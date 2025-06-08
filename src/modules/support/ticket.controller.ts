import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { TicketService } from './ticket.service';
import { CategoryService } from './category.service';
import { TemplateService } from './template.service';
import { validateSchema } from '@shared/validators';
import {
  CreateTicketDTO,
  UpdateTicketDTO,
  CreateMessageDTO,
  AssignTicketDTO,
  RateTicketDTO,
  ListTicketsDTO,
  CreateCategoryDTO,
  CreateTemplateDTO,
  BulkUpdateTicketsDTO,
} from './ticket.dto';

@Service()
export class TicketController {
  constructor(
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private templateService: TemplateService,
  ) {}

  /**
   * Create a new ticket
   */
  async createTicket(request: FastifyRequest<{ Body: CreateTicketDTO }>, reply: FastifyReply) {
    const dto = (await validateSchema(CreateTicketDTO.schema, request.body)) as any;
    const userId = request.customUser!.id;
    const tenantId = (request as any).tenant?.id;

    const ticket = await this.ticketService.createTicket(userId, {
      ...dto,
      tenantId,
    });

    reply.code(201).send({
      message: 'Ticket created successfully',
      data: ticket,
    });
  }

  /**
   * Get ticket by ID
   */
  async getTicket(request: FastifyRequest<{ Params: { ticketId: string } }>, reply: FastifyReply) {
    const { ticketId } = request.params;
    const userId = request.customUser!.id;

    const ticket = await this.ticketService.getTicket(ticketId);

    // Check permissions
    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role);
    if (!isAgent && ticket.userId !== userId) {
      return reply.code(403).send({ error: 'Forbidden' });
    }

    reply.send({ data: ticket });
  }

  /**
   * Get ticket by number
   */
  async getTicketByNumber(request: FastifyRequest<{ Params: { number: string } }>, reply: FastifyReply) {
    const { number } = request.params;
    const userId = request.customUser!.id;

    const ticket = await this.ticketService.getTicketByNumber(number);

    // Check permissions
    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role);
    if (!isAgent && ticket.userId !== userId) {
      return reply.code(403).send({ error: 'Forbidden' });
    }

    reply.send({ data: ticket });
  }

  /**
   * Update ticket
   */
  async updateTicket(
    request: FastifyRequest<{
      Params: { ticketId: string };
      Body: UpdateTicketDTO;
    }>,
    reply: FastifyReply,
  ) {
    const { ticketId } = request.params;
    const dto = await validateSchema(UpdateTicketDTO.schema, request.body);
    const userId = request.customUser!.id;
    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role);

    const ticket = await this.ticketService.updateTicket(ticketId, userId, dto, isAgent);

    reply.send({
      message: 'Ticket updated successfully',
      data: ticket,
    });
  }

  /**
   * List tickets
   */
  async listTickets(request: FastifyRequest<{ Querystring: ListTicketsDTO }>, reply: FastifyReply) {
    const filters = request.query;
    const userId = request.customUser!.id;
    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role);
    const tenantId = (request as any).tenant?.id;

    // Apply permission filters
    if (!isAgent) {
      filters.userId = userId;
    }

    if (tenantId) {
      filters.tenantId = tenantId;
    }

    const result = await this.ticketService.listTickets(
      {
        ...filters,
        dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
        dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      },
      {
        page: filters.page || 1,
        limit: filters.limit || 20,
        sort: filters.sort,
        order: filters.order,
      },
    );

    reply.send({ data: result });
  }

  /**
   * Add message to ticket
   */
  async addMessage(
    request: FastifyRequest<{
      Params: { ticketId: string };
      Body: CreateMessageDTO;
    }>,
    reply: FastifyReply,
  ) {
    const { ticketId } = request.params;
    const dto = await validateSchema(CreateMessageDTO.schema, request.body);
    const userId = request.customUser!.id;

    const message = await this.ticketService.addMessage(ticketId, userId, dto.content, {
      attachments: dto.attachments,
      internal: dto.internal,
    });

    reply.send({
      message: 'Message added successfully',
      data: message,
    });
  }

  /**
   * Get ticket messages
   */
  async getMessages(
    request: FastifyRequest<{
      Params: { ticketId: string };
      Querystring: { includeInternal?: boolean };
    }>,
    reply: FastifyReply,
  ) {
    const { ticketId } = request.params;
    const { includeInternal } = request.query;
    const userId = request.customUser!.id;

    const messages = await this.ticketService.getTicketMessages(ticketId, userId, includeInternal);

    reply.send({ data: messages });
  }

  /**
   * Assign ticket
   */
  async assignTicket(
    request: FastifyRequest<{
      Params: { ticketId: string };
      Body: AssignTicketDTO;
    }>,
    reply: FastifyReply,
  ) {
    const { ticketId } = request.params;
    const dto = await validateSchema(AssignTicketDTO.schema, request.body);
    const assignedBy = request.customUser!.id;

    // Only agents can assign tickets
    if (!['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role)) {
      return reply.code(403).send({ error: 'Only agents can assign tickets' });
    }

    const ticket = await this.ticketService.assignTicket(ticketId, dto.assigneeId, assignedBy);

    reply.send({
      message: 'Ticket assigned successfully',
      data: ticket,
    });
  }

  /**
   * Unassign ticket
   */
  async unassignTicket(request: FastifyRequest<{ Params: { ticketId: string } }>, reply: FastifyReply) {
    const { ticketId } = request.params;
    const userId = request.customUser!.id;

    // Only agents can unassign tickets
    if (!['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role)) {
      return reply.code(403).send({ error: 'Only agents can unassign tickets' });
    }

    const ticket = await this.ticketService.assignTicket(ticketId, '', userId); // Pass empty string to unassign

    reply.send({
      message: 'Ticket unassigned successfully',
      data: ticket,
    });
  }

  /**
   * Close ticket
   */
  async closeTicket(request: FastifyRequest<{ Params: { ticketId: string } }>, reply: FastifyReply) {
    const { ticketId } = request.params;
    const userId = request.customUser!.id;
    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role);

    const ticket = await this.ticketService.closeTicket(ticketId, userId, isAgent);

    reply.send({
      message: 'Ticket closed successfully',
      data: ticket,
    });
  }

  /**
   * Reopen ticket
   */
  async reopenTicket(request: FastifyRequest<{ Params: { ticketId: string } }>, reply: FastifyReply) {
    const { ticketId } = request.params;
    const userId = request.customUser!.id;

    const ticket = await this.ticketService.reopenTicket(ticketId, userId);

    reply.send({
      message: 'Ticket reopened successfully',
      data: ticket,
    });
  }

  /**
   * Rate ticket
   */
  async rateTicket(
    request: FastifyRequest<{
      Params: { ticketId: string };
      Body: RateTicketDTO;
    }>,
    reply: FastifyReply,
  ) {
    const { ticketId } = request.params;
    const dto = await validateSchema(RateTicketDTO.schema, request.body);
    const userId = request.customUser!.id;

    const ticket = await this.ticketService.rateTicket(ticketId, userId, dto.rating, dto.comment);

    reply.send({
      message: 'Thank you for your feedback',
      data: ticket,
    });
  }

  /**
   * Get ticket statistics
   */
  async getTicketStats(
    request: FastifyRequest<{
      Querystring: {
        userId?: string;
        tenantId?: string;
        assigneeId?: string;
        dateFrom?: string;
        dateTo?: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const { userId, tenantId, assigneeId, dateFrom, dateTo } = request.query;
    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role);

    // Non-agents can only see their own stats
    const filters = {
      userId: isAgent ? userId : request.customUser!.id,
      tenantId: tenantId || (request as any).tenant?.id,
      assigneeId: isAgent ? assigneeId : undefined,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    };

    const stats = await this.ticketService.getTicketStats(filters);

    reply.send({ data: stats });
  }

  /**
   * Get ticket activities
   */
  async getTicketActivities(
    request: FastifyRequest<{
      Params: { ticketId: string };
      Querystring: { limit?: number };
    }>,
    reply: FastifyReply,
  ) {
    const { ticketId } = request.params;
    const { limit } = request.query;
    const userId = request.customUser!.id;

    // Check permissions
    const ticket = await this.ticketService.getTicket(ticketId);
    const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role);

    if (!isAgent && ticket.userId !== userId) {
      return reply.code(403).send({ error: 'Forbidden' });
    }

    const activities = await this.ticketService.getTicketActivities(ticketId, limit);

    reply.send({ data: activities });
  }

  /**
   * Bulk update tickets (admin only)
   */
  async bulkUpdateTickets(request: FastifyRequest<{ Body: BulkUpdateTicketsDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(BulkUpdateTicketsDTO.schema, request.body);
    const userId = request.customUser!.id;

    // Only agents can bulk update
    if (!['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role)) {
      return reply.code(403).send({ error: 'Only agents can bulk update tickets' });
    }

    const count = await this.ticketService.bulkUpdateTickets(dto.ticketIds, dto.updates, userId);

    reply.send({
      message: `${count} tickets updated successfully`,
      data: { count },
    });
  }

  // Category endpoints

  /**
   * Get ticket categories
   */
  async getCategories(request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoryService.getCategories();
    reply.send({ data: categories });
  }

  /**
   * Create category (admin only)
   */
  async createCategory(request: FastifyRequest<{ Body: CreateCategoryDTO }>, reply: FastifyReply) {
    if (!['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role)) {
      return reply.code(403).send({ error: 'Admin access required' });
    }

    const dto = (await validateSchema(CreateCategoryDTO.schema, request.body)) as any;
    const category = await this.categoryService.createCategory(dto);

    reply.code(201).send({
      message: 'Category created successfully',
      data: category,
    });
  }

  // Template endpoints

  /**
   * Get ticket templates
   */
  async getTemplates(request: FastifyRequest, reply: FastifyReply) {
    const templates = await this.templateService.getTemplates();
    reply.send({ data: templates });
  }

  /**
   * Create template (admin only)
   */
  async createTemplate(request: FastifyRequest<{ Body: CreateTemplateDTO }>, reply: FastifyReply) {
    if (!['ADMIN', 'SUPER_ADMIN'].includes(request.customUser!.role)) {
      return reply.code(403).send({ error: 'Admin access required' });
    }

    const dto = (await validateSchema(CreateTemplateDTO.schema, request.body)) as any;
    const template = await this.templateService.createTemplate(dto);

    reply.code(201).send({
      message: 'Template created successfully',
      data: template,
    });
  }

  /**
   * Apply template to new ticket
   */
  async applyTemplate(request: FastifyRequest<{ Params: { templateId: string } }>, reply: FastifyReply) {
    const { templateId } = request.params;
    const template = await this.templateService.getTemplate(templateId);

    reply.send({
      data: {
        subject: template.subject,
        content: template.content,
        category: template.category,
        tags: template.tags,
      },
    });
  }
}
