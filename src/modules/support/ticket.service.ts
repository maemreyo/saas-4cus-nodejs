import { Service } from 'typedi';
import {
  Ticket,
  TicketMessage,
  TicketActivity,
  TicketStatus,
  TicketPriority,
  TicketType,
  TicketActivityType,
  Prisma,
} from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { EmailService } from '@shared/services/email.service';
import { queueService } from '@shared/queue/queue.service';
import { NotFoundException, BadRequestException, ForbiddenException } from '@shared/exceptions';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';
import { TicketEvents } from './ticket.events';
import { nanoid } from 'nanoid';

export interface CreateTicketOptions {
  subject: string;
  description: string;
  type?: TicketType;
  priority?: TicketPriority;
  categoryId?: string;
  tags?: string[];
  attachments?: string[];
  tenantId?: string;
}

export interface UpdateTicketOptions {
  subject?: string;
  description?: string;
  type?: TicketType;
  priority?: TicketPriority;
  status?: TicketStatus;
  categoryId?: string;
  tags?: string[];
  assigneeId?: string | null;
  resolutionAt?: Date;
  closedAt?: Date;
  firstResponseSla?: number;
  resolutionSla?: number;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  categoryId?: string;
  assigneeId?: string;
  userId?: string;
  tenantId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResolutionTime: number;
  avgFirstResponseTime: number;
  satisfactionScore: number;
}

@Service()
export class TicketService {
  private readonly SLA_FIRST_RESPONSE_MINUTES = {
    [TicketPriority.CRITICAL]: 30,
    [TicketPriority.URGENT]: 60,
    [TicketPriority.HIGH]: 120,
    [TicketPriority.MEDIUM]: 240,
    [TicketPriority.LOW]: 480,
  };

  private readonly SLA_RESOLUTION_MINUTES = {
    [TicketPriority.CRITICAL]: 240,
    [TicketPriority.URGENT]: 480,
    [TicketPriority.HIGH]: 1440,
    [TicketPriority.MEDIUM]: 2880,
    [TicketPriority.LOW]: 5760,
  };

  constructor(
    private eventBus: EventBus,
    private emailService: EmailService,
  ) {}

  /**
   * Create a new ticket
   */
  async createTicket(userId: string, options: CreateTicketOptions): Promise<Ticket> {
    // Generate ticket number
    const ticketNumber = await this.generateTicketNumber();

    // Determine priority based on keywords if not specified
    const priority = options.priority || this.detectPriority(options.subject + ' ' + options.description);

    // Get SLA times
    const firstResponseSla = this.SLA_FIRST_RESPONSE_MINUTES[priority];
    const resolutionSla = this.SLA_RESOLUTION_MINUTES[priority];

    // Create ticket
    const ticket = await prisma.client.ticket.create({
      data: {
        number: ticketNumber,
        userId,
        tenantId: options.tenantId,
        subject: options.subject,
        description: options.description,
        type: options.type || TicketType.GENERAL_INQUIRY,
        priority,
        status: TicketStatus.OPEN,
        categoryId: options.categoryId,
        tags: options.tags || [],
        attachments: options.attachments || [],
        firstResponseSla,
        resolutionSla,
        metadata: {},
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
        category: true,
      },
    });

    // Create initial activity
    await this.createActivity(ticket.id, userId, TicketActivityType.CREATED, {
      description: 'Ticket created',
    });

    // Schedule SLA monitoring
    await this.scheduleSLAMonitoring(ticket.id);

    // Send notifications
    await queueService.addJob('notification', 'ticketCreated', {
      ticketId: ticket.id,
      userId,
    });

    logger.info('Ticket created', {
      ticketId: ticket.id,
      number: ticket.number,
      userId,
    });

    await this.eventBus.emit(TicketEvents.TICKET_CREATED, {
      ticketId: ticket.id,
      number: ticket.number,
      userId,
      timestamp: new Date(),
    });

    return ticket;
  }

  /**
   * Update ticket
   */
  @CacheInvalidate(['ticket'])
  async updateTicket(
    ticketId: string,
    userId: string,
    updates: UpdateTicketOptions,
    isAgent: boolean = false,
  ): Promise<Ticket> {
    const ticket = await this.getTicket(ticketId);

    // Check permissions
    if (!isAgent && ticket.userId !== userId) {
      throw new ForbiddenException('You can only update your own tickets');
    }

    // Track changes for activity log
    const changes: any[] = [];

    if (updates.status && updates.status !== ticket.status) {
      changes.push({
        type: TicketActivityType.STATUS_CHANGED,
        oldValue: ticket.status,
        newValue: updates.status,
      });

      // Handle special status transitions
      if (updates.status === TicketStatus.RESOLVED) {
        updates.resolutionAt = new Date();
      } else if (updates.status === TicketStatus.CLOSED) {
        updates.closedAt = new Date();
      }
    }

    if (updates.priority && updates.priority !== ticket.priority) {
      changes.push({
        type: TicketActivityType.PRIORITY_CHANGED,
        oldValue: ticket.priority,
        newValue: updates.priority,
      });

      // Update SLA if priority changed
      updates.firstResponseSla = this.SLA_FIRST_RESPONSE_MINUTES[updates.priority];
      updates.resolutionSla = this.SLA_RESOLUTION_MINUTES[updates.priority];
    }

    if (updates.categoryId && updates.categoryId !== ticket.categoryId) {
      changes.push({
        type: TicketActivityType.CATEGORY_CHANGED,
        oldValue: ticket.categoryId,
        newValue: updates.categoryId,
      });
    }

    if (updates.tags && JSON.stringify(updates.tags) !== JSON.stringify(ticket.tags)) {
      changes.push({
        type: TicketActivityType.TAGS_UPDATED,
        oldValue: ticket.tags.join(', '),
        newValue: updates.tags.join(', '),
      });
    }

    // Update ticket
    const updatedTicket = await prisma.client.ticket.update({
      where: { id: ticketId },
      data: updates as any,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
        category: true,
      },
    });

    // Create activities for changes
    for (const change of changes) {
      await this.createActivity(ticketId, userId, change.type, {
        oldValue: change.oldValue,
        newValue: change.newValue,
      });
    }

    logger.info('Ticket updated', {
      ticketId,
      userId,
      changes: changes.length,
    });

    await this.eventBus.emit(TicketEvents.TICKET_UPDATED, {
      ticketId,
      userId,
      changes,
      timestamp: new Date(),
    });

    return updatedTicket;
  }

  /**
   * Get ticket by ID
   */
  @Cacheable({ ttl: 300, namespace: 'ticket' })
  async getTicket(ticketId: string): Promise<Ticket & { messages?: TicketMessage[] }> {
    const ticket = await prisma.client.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
          },
        },
        category: true,
        tenant: true,
      },
    });

    if (!ticket || ticket.deletedAt) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  /**
   * Get ticket by number
   */
  async getTicketByNumber(number: string): Promise<Ticket> {
    const ticket = await prisma.client.ticket.findUnique({
      where: { number },
      include: {
        user: true,
        assignee: true,
        category: true,
      },
    });

    if (!ticket || ticket.deletedAt) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  /**
   * List tickets
   */
  async listTickets(
    filters: TicketFilters,
    pagination: {
      page: number;
      limit: number;
      sort?: string;
      order?: 'asc' | 'desc';
    },
  ): Promise<{
    tickets: Ticket[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: Prisma.TicketWhereInput = {
      deletedAt: null,
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.type && { type: filters.type }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.tenantId && { tenantId: filters.tenantId }),
      ...(filters.dateFrom &&
        filters.dateTo && {
          createdAt: {
            gte: filters.dateFrom,
            lte: filters.dateTo,
          },
        }),
      ...(filters.tags &&
        filters.tags.length > 0 && {
          tags: { hasEvery: filters.tags },
        }),
      ...(filters.search && {
        OR: [
          { subject: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { number: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: any = {};
    if (pagination.sort) {
      orderBy[pagination.sort] = pagination.order || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [tickets, total] = await Promise.all([
      prisma.client.ticket.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              displayName: true,
            },
          },
          assignee: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              displayName: true,
            },
          },
          category: true,
          _count: {
            select: { messages: true },
          },
        },
        orderBy,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.client.ticket.count({ where }),
    ]);

    return {
      tickets,
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  /**
   * Assign ticket to agent
   */
  async assignTicket(ticketId: string, assigneeId: string, assignedBy: string): Promise<Ticket> {
    const ticket = await this.getTicket(ticketId);

    // Verify assignee is valid (should be an agent/admin)
    const assignee = await prisma.client.user.findUnique({
      where: { id: assigneeId },
    });

    if (!assignee || !['ADMIN', 'SUPER_ADMIN'].includes(assignee.role)) {
      throw new BadRequestException('Invalid assignee');
    }

    const oldAssigneeId = ticket.assigneeId;

    // Update ticket
    const updatedTicket = await prisma.client.ticket.update({
      where: { id: ticketId },
      data: {
        assigneeId,
        status: ticket.status === TicketStatus.OPEN ? TicketStatus.IN_PROGRESS : ticket.status,
      },
      include: {
        user: true,
        assignee: true,
        category: true,
      },
    });

    // Create activity
    await this.createActivity(ticketId, assignedBy, TicketActivityType.ASSIGNED, {
      description: `Assigned to ${assignee.displayName || assignee.email}`,
      oldValue: oldAssigneeId,
      newValue: assigneeId,
    });

    // Clear cache
    await redis.delete(`ticket:${ticketId}`);

    // Send notifications
    await queueService.addJob('notification', 'ticketAssigned', {
      ticketId,
      assigneeId,
      assignedBy,
    });

    logger.info('Ticket assigned', {
      ticketId,
      assigneeId,
      assignedBy,
    });

    await this.eventBus.emit(TicketEvents.TICKET_ASSIGNED, {
      ticketId,
      assigneeId,
      assignedBy,
      timestamp: new Date(),
    });

    return updatedTicket;
  }

  /**
   * Add message to ticket
   */
  async addMessage(
    ticketId: string,
    userId: string,
    content: string,
    options?: {
      attachments?: string[];
      internal?: boolean;
    },
  ): Promise<TicketMessage> {
    const ticket = await this.getTicket(ticketId);

    // Check permissions
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
    const isCustomer = ticket.userId === userId;

    if (!isAgent && !isCustomer) {
      throw new ForbiddenException('You do not have permission to add messages to this ticket');
    }

    // Customers cannot add internal notes
    if (!isAgent && options?.internal) {
      throw new ForbiddenException('Only agents can add internal notes');
    }

    // Create message
    const message = await prisma.client.ticketMessage.create({
      data: {
        ticketId,
        userId,
        content,
        attachments: options?.attachments || [],
        internal: options?.internal || false,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    // Update ticket
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Set first response time if this is the first agent response
    if (isAgent && !ticket.firstResponseAt && !options?.internal) {
      updateData.firstResponseAt = new Date();

      // Check SLA
      if (ticket.firstResponseSla) {
        const responseTime = (new Date().getTime() - ticket.createdAt.getTime()) / 60000; // in minutes
        if (responseTime > ticket.firstResponseSla) {
          updateData.slaBreached = true;
        }
      }
    }

    // Update status based on who replied
    if (isAgent && ticket.status === TicketStatus.WAITING_FOR_SUPPORT) {
      updateData.status = TicketStatus.WAITING_FOR_CUSTOMER;
    } else if (isCustomer && ticket.status === TicketStatus.WAITING_FOR_CUSTOMER) {
      updateData.status = TicketStatus.WAITING_FOR_SUPPORT;
    }

    await prisma.client.ticket.update({
      where: { id: ticketId },
      data: updateData,
    });

    // Create activity
    await this.createActivity(
      ticketId,
      userId,
      options?.internal ? TicketActivityType.INTERNAL_NOTE_ADDED : TicketActivityType.MESSAGE_ADDED,
      { messageId: message.id },
    );

    // Clear cache
    await redis.delete(`ticket:${ticketId}`);

    // Send notifications
    if (!options?.internal) {
      await queueService.addJob('notification', 'ticketMessageAdded', {
        ticketId,
        messageId: message.id,
        userId,
      });
    }

    logger.info('Message added to ticket', {
      ticketId,
      messageId: message.id,
      userId,
      internal: options?.internal,
    });

    await this.eventBus.emit(TicketEvents.TICKET_MESSAGE_ADDED, {
      ticketId,
      messageId: message.id,
      userId,
      internal: options?.internal,
      timestamp: new Date(),
    });

    return message;
  }

  /**
   * Get ticket messages
   */
  async getTicketMessages(
    ticketId: string,
    userId: string,
    includeInternal: boolean = false,
  ): Promise<TicketMessage[]> {
    const ticket = await this.getTicket(ticketId);

    // Check permissions
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
    const isCustomer = ticket.userId === userId;

    if (!isAgent && !isCustomer) {
      throw new ForbiddenException('You do not have permission to view this ticket');
    }

    const where: Prisma.TicketMessageWhereInput = {
      ticketId,
      deletedAt: null,
    };

    // Customers cannot see internal notes
    if (!isAgent || !includeInternal) {
      where.internal = false;
    }

    const messages = await prisma.client.ticketMessage.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }

  /**
   * Close ticket
   */
  async closeTicket(ticketId: string, userId: string, isAgent: boolean = false): Promise<Ticket> {
    const ticket = await this.getTicket(ticketId);

    // Check permissions
    if (!isAgent && ticket.userId !== userId) {
      throw new ForbiddenException('You can only close your own tickets');
    }

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Ticket is already closed');
    }

    const updatedTicket = await prisma.client.ticket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatus.CLOSED,
        closedAt: new Date(),
      },
      include: {
        user: true,
        assignee: true,
        category: true,
      },
    });

    // Create activity
    await this.createActivity(ticketId, userId, TicketActivityType.CLOSED);

    // Clear cache
    await redis.delete(`ticket:${ticketId}`);

    logger.info('Ticket closed', { ticketId, userId });

    await this.eventBus.emit(TicketEvents.TICKET_CLOSED, {
      ticketId,
      userId,
      timestamp: new Date(),
    });

    return updatedTicket;
  }

  /**
   * Reopen ticket
   */
  async reopenTicket(ticketId: string, userId: string): Promise<Ticket> {
    const ticket = await this.getTicket(ticketId);

    if (ticket.status !== TicketStatus.CLOSED) {
      throw new BadRequestException('Only closed tickets can be reopened');
    }

    // Check if ticket was closed too long ago (e.g., 30 days)
    if (ticket.closedAt) {
      const daysSinceClosed = (new Date().getTime() - ticket.closedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceClosed > 30) {
        throw new BadRequestException('Ticket has been closed for too long and cannot be reopened');
      }
    }

    const updatedTicket = await prisma.client.ticket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatus.OPEN,
        closedAt: null,
      },
      include: {
        user: true,
        assignee: true,
        category: true,
      },
    });

    // Create activity
    await this.createActivity(ticketId, userId, TicketActivityType.REOPENED);

    // Clear cache
    await redis.delete(`ticket:${ticketId}`);

    logger.info('Ticket reopened', { ticketId, userId });

    await this.eventBus.emit(TicketEvents.TICKET_REOPENED, {
      ticketId,
      userId,
      timestamp: new Date(),
    });

    return updatedTicket;
  }

  /**
   * Rate ticket satisfaction
   */
  async rateTicket(ticketId: string, userId: string, rating: number, comment?: string): Promise<Ticket> {
    const ticket = await this.getTicket(ticketId);

    // Check permissions
    if (ticket.userId !== userId) {
      throw new ForbiddenException('You can only rate your own tickets');
    }

    if (ticket.status !== TicketStatus.CLOSED && ticket.status !== TicketStatus.RESOLVED) {
      throw new BadRequestException('You can only rate closed or resolved tickets');
    }

    const updatedTicket = await prisma.client.ticket.update({
      where: { id: ticketId },
      data: {
        satisfactionRating: rating,
        satisfactionComment: comment,
      },
      include: {
        user: true,
        assignee: true,
        category: true,
      },
    });

    // Clear cache
    await redis.delete(`ticket:${ticketId}`);

    logger.info('Ticket rated', {
      ticketId,
      userId,
      rating,
    });

    await this.eventBus.emit(TicketEvents.TICKET_RATED, {
      ticketId,
      userId,
      rating,
      timestamp: new Date(),
    });

    return updatedTicket;
  }

  /**
   * Get ticket statistics
   */
  @Cacheable({ ttl: 300, namespace: 'ticket:stats' })
  async getTicketStats(filters?: {
    userId?: string;
    tenantId?: string;
    assigneeId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<TicketStats> {
    const where: Prisma.TicketWhereInput = {
      deletedAt: null,
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.tenantId && { tenantId: filters.tenantId }),
      ...(filters?.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters?.dateFrom &&
        filters?.dateTo && {
          createdAt: {
            gte: filters.dateFrom,
            lte: filters.dateTo,
          },
        }),
    };

    const [total, statusCounts, resolutionTimes, firstResponseTimes, satisfactionScores] = await Promise.all([
      prisma.client.ticket.count({ where }),
      prisma.client.ticket.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),
      prisma.client.ticket.aggregate({
        where: {
          ...where,
          resolutionAt: { not: null },
        },
        _avg: {
          resolutionSla: true,
        },
      }),
      prisma.client.ticket.aggregate({
        where: {
          ...where,
          firstResponseAt: { not: null },
        },
        _avg: {
          firstResponseSla: true,
        },
      }),
      prisma.client.ticket.aggregate({
        where: {
          ...where,
          satisfactionRating: { not: null },
        },
        _avg: {
          satisfactionRating: true,
        },
      }),
    ]);

    const statusMap = new Map(statusCounts.map(s => [s.status, s._count.id]));

    return {
      total,
      open: statusMap.get(TicketStatus.OPEN) || 0,
      inProgress: statusMap.get(TicketStatus.IN_PROGRESS) || 0,
      resolved: statusMap.get(TicketStatus.RESOLVED) || 0,
      closed: statusMap.get(TicketStatus.CLOSED) || 0,
      avgResolutionTime: resolutionTimes._avg.resolutionSla || 0,
      avgFirstResponseTime: firstResponseTimes._avg.firstResponseSla || 0,
      satisfactionScore: satisfactionScores._avg.satisfactionRating || 0,
    };
  }

  /**
   * Get ticket activities
   */
  async getTicketActivities(ticketId: string, limit: number = 50): Promise<TicketActivity[]> {
    const activities = await prisma.client.ticketActivity.findMany({
      where: { ticketId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return activities;
  }

  /**
   * Bulk update tickets
   */
  async bulkUpdateTickets(
    ticketIds: string[],
    updates: {
      status?: TicketStatus;
      priority?: TicketPriority;
      assigneeId?: string;
      categoryId?: string;
      tags?: string[];
    },
    userId: string,
  ): Promise<number> {
    // Verify all tickets exist and user has permission
    const tickets = await prisma.client.ticket.findMany({
      where: {
        id: { in: ticketIds },
        deletedAt: null,
      },
    });

    if (tickets.length !== ticketIds.length) {
      throw new BadRequestException('Some tickets not found');
    }

    // Update tickets
    const result = await prisma.client.ticket.updateMany({
      where: {
        id: { in: ticketIds },
      },
      data: updates,
    });

    // Create activities for each ticket
    for (const ticketId of ticketIds) {
      if (updates.status) {
        await this.createActivity(ticketId, userId, TicketActivityType.STATUS_CHANGED, {
          newValue: updates.status,
          bulk: true,
        });
      }
    }

    // Clear cache for all tickets
    await Promise.all(ticketIds.map(id => redis.delete(`ticket:${id}`)));

    logger.info('Bulk tickets update', {
      count: result.count,
      userId,
    });

    return result.count;
  }

  // Private helper methods

  /**
   * Generate unique ticket number
   */
  private async generateTicketNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Get current count for this month
    const countKey = `ticket:counter:${year}${month}`;
    const count = await redis.increment(countKey);

    // Set expiry for counter (2 months)
    if (count === 1) {
      await redis.expire(countKey, 60 * 60 * 24 * 60);
    }

    return `${year}${month}-${count.toString().padStart(5, '0')}`;
  }

  /**
   * Detect priority based on keywords
   */
  private detectPriority(text: string): TicketPriority {
    const lowerText = text.toLowerCase();

    const criticalKeywords = ['critical', 'emergency', 'urgent', 'asap', 'immediately'];
    const highKeywords = ['high priority', 'important', 'quickly', 'soon'];
    const lowKeywords = ['low priority', 'when possible', 'no rush'];

    if (criticalKeywords.some(keyword => lowerText.includes(keyword))) {
      return TicketPriority.CRITICAL;
    }
    if (highKeywords.some(keyword => lowerText.includes(keyword))) {
      return TicketPriority.HIGH;
    }
    if (lowKeywords.some(keyword => lowerText.includes(keyword))) {
      return TicketPriority.LOW;
    }

    return TicketPriority.MEDIUM;
  }

  /**
   * Create ticket activity
   */
  private async createActivity(
    ticketId: string,
    userId: string | null,
    type: TicketActivityType,
    metadata?: any,
  ): Promise<void> {
    await prisma.client.ticketActivity.create({
      data: {
        ticketId,
        userId,
        type,
        description: metadata?.description,
        oldValue: metadata?.oldValue,
        newValue: metadata?.newValue,
        metadata: metadata || {},
      },
    });
  }

  /**
   * Schedule SLA monitoring
   */
  private async scheduleSLAMonitoring(ticketId: string): Promise<void> {
    const ticket = await this.getTicket(ticketId);

    // Schedule first response SLA check
    if (ticket.firstResponseSla) {
      const warningTime = ticket.firstResponseSla * 0.8 * 60 * 1000; // 80% of SLA in ms
      const breachTime = ticket.firstResponseSla * 60 * 1000; // 100% of SLA in ms

      await queueService.addJob(
        'ticket',
        'checkFirstResponseSLA',
        {
          ticketId,
          type: 'warning',
        },
        { delay: warningTime },
      );

      await queueService.addJob(
        'ticket',
        'checkFirstResponseSLA',
        {
          ticketId,
          type: 'breach',
        },
        { delay: breachTime },
      );
    }

    // Schedule resolution SLA check
    if (ticket.resolutionSla) {
      const warningTime = ticket.resolutionSla * 0.8 * 60 * 1000; // 80% of SLA in ms
      const breachTime = ticket.resolutionSla * 60 * 1000; // 100% of SLA in ms

      await queueService.addJob(
        'ticket',
        'checkResolutionSLA',
        {
          ticketId,
          type: 'warning',
        },
        { delay: warningTime },
      );

      await queueService.addJob(
        'ticket',
        'checkResolutionSLA',
        {
          ticketId,
          type: 'breach',
        },
        { delay: breachTime },
      );
    }
  }
}
