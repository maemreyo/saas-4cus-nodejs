import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { TenantContextService } from '@modules/tenant/tenant.context';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@shared/exceptions';
import {
  CreateSegmentDto,
  UpdateSegmentDto,
  SegmentQueryDto,
  SegmentCondition,
  TestSegmentDto
} from './email-marketing.dto';
import {
  EmailSegmentOperator,
  Prisma
} from '@prisma/client';
import { EmailMarketingEvents } from './email-marketing.events';

interface SegmentConditionEvaluator {
  field: string;
  operator: EmailSegmentOperator;
  value: any;
}

@Service()
export class SegmentationService {
  constructor(
    private tenantContext: TenantContextService
  ) {}

  /**
   * Create segment
   */
  async create(listId: string, data: CreateSegmentDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    // Validate list exists
    const list = await prisma.client.emailList.findFirst({
      where: {
        id: listId,
        tenantId,
        deletedAt: null
      }
    });

    if (!list) {
      throw new NotFoundException('Email list not found');
    }

    // Validate conditions
    this.validateConditions(data.conditions);

    try {
      const segment = await prisma.client.emailSegment.create({
        data: {
          listId,
          name: data.name,
          description: data.description,
          conditions: data.conditions as any,
          metadata: data.metadata
        }
      });

      // Calculate initial subscriber count
      await this.updateSubscriberCount(segment.id);

      await eventBus.emit(EmailMarketingEvents.SEGMENT_CREATED, {
        segmentId: segment.id,
        listId,
        tenantId
      });

      logger.info('Segment created', { segmentId: segment.id, listId });

      return segment;
    } catch (error) {
      logger.error('Failed to create segment', error as Error);
      throw error;
    }
  }

  /**
   * Update segment
   */
  async update(segmentId: string, data: UpdateSegmentDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const segment = await this.findById(segmentId);

    // Validate conditions if provided
    if (data.conditions) {
      this.validateConditions(data.conditions);
    }

    try {
      const updated = await prisma.client.emailSegment.update({
        where: { id: segmentId },
        data: {
          name: data.name,
          description: data.description,
          conditions: data.conditions as any,
          metadata: data.metadata
        }
      });

      // Recalculate subscriber count if conditions changed
      if (data.conditions) {
        await this.updateSubscriberCount(segmentId);
      }

      await eventBus.emit(EmailMarketingEvents.SEGMENT_UPDATED, {
        segmentId: updated.id,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update segment', error as Error);
      throw error;
    }
  }

  /**
   * Delete segment
   */
  async delete(segmentId: string): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(segmentId);

    // Check if segment is used in any campaigns
    const campaignsUsingSegment = await prisma.client.emailCampaign.count({
      where: {
        OR: [
          { segmentIds: { has: segmentId } },
          { excludeSegmentIds: { has: segmentId } }
        ],
        status: { in: ['SCHEDULED', 'SENDING'] }
      }
    });

    if (campaignsUsingSegment > 0) {
      throw new BadRequestException('Cannot delete segment used in active campaigns');
    }

    try {
      await prisma.client.emailSegment.delete({
        where: { id: segmentId }
      });

      await eventBus.emit(EmailMarketingEvents.SEGMENT_DELETED, {
        segmentId,
        tenantId
      });

      logger.info('Segment deleted', { segmentId });
    } catch (error) {
      logger.error('Failed to delete segment', error as Error);
      throw error;
    }
  }

  /**
   * Find segment by ID
   */
  async findById(segmentId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const segment = await prisma.client.emailSegment.findFirst({
      where: {
        id: segmentId,
        list: {
          tenantId,
          deletedAt: null
        }
      },
      include: {
        list: true
      }
    });

    if (!segment) {
      throw new NotFoundException('Segment not found');
    }

    return segment;
  }

  /**
   * Find segments
   */
  async find(listId: string, query: SegmentQueryDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    // Validate list
    const list = await prisma.client.emailList.findFirst({
      where: {
        id: listId,
        tenantId,
        deletedAt: null
      }
    });

    if (!list) {
      throw new NotFoundException('Email list not found');
    }

    const where: Prisma.EmailSegmentWhereInput = {
      listId,
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } }
        ]
      })
    };

    const [segments, total] = await Promise.all([
      prisma.client.emailSegment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit
      }),
      prisma.client.emailSegment.count({ where })
    ]);

    return {
      segments,
      pagination: {
        total,
        page: Math.floor(query.skip / query.limit) + 1,
        limit: query.limit,
        pages: Math.ceil(total / query.limit)
      }
    };
  }

  /**
   * Get subscribers in segment
   */
  async getSubscribers(segmentId: string, limit: number = 100): Promise<any[]> {
    const segment = await this.findById(segmentId);

    const whereClause = this.buildWhereClause(segment.conditions);

    const subscribers = await prisma.client.emailListSubscriber.findMany({
      where: {
        listId: segment.listId,
        subscribed: true,
        confirmed: true,
        ...whereClause
      },
      take: limit,
      orderBy: { subscribedAt: 'desc' }
    });

    return subscribers;
  }

  /**
   * Test segment conditions
   */
  async test(segmentId: string, data: TestSegmentDto): Promise<any> {
    const segment = await this.findById(segmentId);

    const conditions = data.conditions || segment.conditions;
    const whereClause = this.buildWhereClause(conditions);

    const [subscribers, count] = await Promise.all([
      prisma.client.emailListSubscriber.findMany({
        where: {
          listId: segment.listId,
          subscribed: true,
          confirmed: true,
          ...whereClause
        },
        take: data.limit || 10,
        orderBy: { subscribedAt: 'desc' }
      }),
      prisma.client.emailListSubscriber.count({
        where: {
          listId: segment.listId,
          subscribed: true,
          confirmed: true,
          ...whereClause
        }
      })
    ]);

    return {
      totalCount: count,
      sampleSubscribers: subscribers
    };
  }

  /**
   * Update subscriber count for segment
   */
  async updateSubscriberCount(segmentId: string): Promise<void> {
    const segment = await prisma.client.emailSegment.findUnique({
      where: { id: segmentId }
    });

    if (!segment) return;

    const whereClause = this.buildWhereClause(segment.conditions);

    const count = await prisma.client.emailListSubscriber.count({
      where: {
        listId: segment.listId,
        subscribed: true,
        confirmed: true,
        ...whereClause
      }
    });

    await prisma.client.emailSegment.update({
      where: { id: segmentId },
      data: {
        subscriberCount: count,
        lastCalculatedAt: new Date()
      }
    });
  }

  /**
   * Update all segments for a list
   */
  async updateAllSegmentCounts(listId: string): Promise<void> {
    const segments = await prisma.client.emailSegment.findMany({
      where: { listId }
    });

    for (const segment of segments) {
      await this.updateSubscriberCount(segment.id);
    }
  }

  /**
   * Duplicate segment
   */
  async duplicate(segmentId: string, name?: string): Promise<any> {
    const segment = await this.findById(segmentId);

    const duplicated = await this.create(segment.listId, {
      name: name || `${segment.name} (Copy)`,
      description: segment.description,
      conditions: segment.conditions as SegmentCondition[],
      metadata: segment.metadata
    });

    logger.info('Segment duplicated', {
      originalId: segmentId,
      duplicatedId: duplicated.id
    });

    return duplicated;
  }

  /**
   * Validate segment conditions
   */
  private validateConditions(conditions: SegmentCondition[]): void {
    if (!conditions || conditions.length === 0) {
      throw new BadRequestException('At least one condition is required');
    }

    for (const condition of conditions) {
      if (!condition.field || !condition.operator) {
        throw new BadRequestException('Invalid condition: field and operator are required');
      }

      // Validate operator-value combinations
      switch (condition.operator) {
        case EmailSegmentOperator.IN:
        case EmailSegmentOperator.NOT_IN:
          if (!Array.isArray(condition.value)) {
            throw new BadRequestException(`Operator ${condition.operator} requires array value`);
          }
          break;

        case EmailSegmentOperator.GREATER_THAN:
        case EmailSegmentOperator.LESS_THAN:
          if (typeof condition.value !== 'number' && !Date.parse(condition.value)) {
            throw new BadRequestException(`Operator ${condition.operator} requires numeric or date value`);
          }
          break;
      }
    }
  }

  /**
   * Build Prisma where clause from segment conditions
   */
  private buildWhereClause(conditions: any): Prisma.EmailListSubscriberWhereInput {
    const where: any = {};

    if (!conditions || conditions.length === 0) {
      return where;
    }

    // Group conditions by logic operator (AND/OR)
    const andConditions: any[] = [];
    const orConditions: any[] = [];

    for (const condition of conditions) {
      const clause = this.buildConditionClause(condition);

      if (condition.logic === 'OR') {
        orConditions.push(clause);
      } else {
        andConditions.push(clause);
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    return where;
  }

  /**
   * Build individual condition clause
   */
  private buildConditionClause(condition: SegmentConditionEvaluator): any {
    const { field, operator, value } = condition;

    // Handle standard fields
    switch (field) {
      case 'email':
        return this.buildStringCondition('email', operator, value);

      case 'firstName':
        return this.buildStringCondition('firstName', operator, value);

      case 'lastName':
        return this.buildStringCondition('lastName', operator, value);

      case 'tags':
        return this.buildArrayCondition('tags', operator, value);

      case 'subscribedAt':
        return this.buildDateCondition('subscribedAt', operator, value);

      case 'lastEngagedAt':
        return this.buildDateCondition('lastEngagedAt', operator, value);

      case 'engagementScore':
        return this.buildNumberCondition('engagementScore', operator, value);

      case 'source':
        return this.buildStringCondition('source', operator, value);

      case 'location':
        return this.buildStringCondition('location', operator, value);

      default:
        // Handle custom fields
        if (field.startsWith('custom.')) {
          const customField = field.replace('custom.', '');
          return this.buildJsonFieldCondition('customData', customField, operator, value);
        }
        return {};
    }
  }

  /**
   * Build string field condition
   */
  private buildStringCondition(field: string, operator: EmailSegmentOperator, value: any): any {
    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        return { [field]: value };

      case EmailSegmentOperator.NOT_EQUALS:
        return { [field]: { not: value } };

      case EmailSegmentOperator.CONTAINS:
        return { [field]: { contains: value, mode: 'insensitive' } };

      case EmailSegmentOperator.NOT_CONTAINS:
        return { [field]: { not: { contains: value, mode: 'insensitive' } } };

      case EmailSegmentOperator.IN:
        return { [field]: { in: value } };

      case EmailSegmentOperator.NOT_IN:
        return { [field]: { notIn: value } };

      default:
        return {};
    }
  }

  /**
   * Build number field condition
   */
  private buildNumberCondition(field: string, operator: EmailSegmentOperator, value: any): any {
    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        return { [field]: value };

      case EmailSegmentOperator.NOT_EQUALS:
        return { [field]: { not: value } };

      case EmailSegmentOperator.GREATER_THAN:
        return { [field]: { gt: value } };

      case EmailSegmentOperator.LESS_THAN:
        return { [field]: { lt: value } };

      default:
        return {};
    }
  }

  /**
   * Build date field condition
   */
  private buildDateCondition(field: string, operator: EmailSegmentOperator, value: any): any {
    const date = new Date(value);

    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        // For date equality, we need to check within the same day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return { [field]: { gte: startOfDay, lte: endOfDay } };

      case EmailSegmentOperator.GREATER_THAN:
        return { [field]: { gt: date } };

      case EmailSegmentOperator.LESS_THAN:
        return { [field]: { lt: date } };

      default:
        return {};
    }
  }

  /**
   * Build array field condition
   */
  private buildArrayCondition(field: string, operator: EmailSegmentOperator, value: any): any {
    switch (operator) {
      case EmailSegmentOperator.CONTAINS:
        return { [field]: { has: value } };

      case EmailSegmentOperator.NOT_CONTAINS:
        return { NOT: { [field]: { has: value } } };

      case EmailSegmentOperator.IN:
        return { [field]: { hasSome: value } };

      case EmailSegmentOperator.NOT_IN:
        return { NOT: { [field]: { hasSome: value } } };

      default:
        return {};
    }
  }

  /**
   * Build JSON field condition
   */
  private buildJsonFieldCondition(
    field: string,
    path: string,
    operator: EmailSegmentOperator,
    value: any
  ): any {
    // This is a simplified version - Prisma's JSON filtering is limited
    // In production, you might need to use raw queries for complex JSON filtering
    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        return {
          [field]: {
            path: [path],
            equals: value
          }
        };

      default:
        return {};
    }
  }
}