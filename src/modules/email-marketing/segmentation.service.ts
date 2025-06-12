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
  TestSegmentDto,
  SegmentCondition
} from './email-marketing.dto';
import { EmailSegmentOperator, Prisma } from '@prisma/client';
import { EmailMarketingEvents } from './email-marketing.events';

@Service()
export class SegmentationService {
  constructor(
    private tenantContext: TenantContextService
  ) {}

  /**
   * Create a new segment
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

    try {
      const segment = await prisma.client.emailSegment.create({
        data: {
          listId,
          name: data.name,
          description: data.description,
          conditions: data.conditions,
          metadata: data.metadata
        }
      });

      // Calculate initial count
      await this.recalculateSegment(segment.id);

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
    const segment = await this.findById(segmentId);

    try {
      const updated = await prisma.client.emailSegment.update({
        where: { id: segmentId },
        data: {
          name: data.name,
          description: data.description,
          conditions: data.conditions,
          metadata: data.metadata
        }
      });

      // Recalculate if conditions changed
      if (data.conditions) {
        await this.recalculateSegment(segmentId);
      }

      await eventBus.emit(EmailMarketingEvents.SEGMENT_UPDATED, {
        segmentId: updated.id
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
    const segment = await this.findById(segmentId);

    // Check if segment is used in any active campaigns
    const activeCampaigns = await prisma.client.emailCampaign.count({
      where: {
        OR: [
          { segmentIds: { has: segmentId } },
          { excludeSegmentIds: { has: segmentId } }
        ],
        status: {
          in: ['SCHEDULED', 'SENDING']
        }
      }
    });

    if (activeCampaigns > 0) {
      throw new BadRequestException('Cannot delete segment used in active campaigns');
    }

    try {
      await prisma.client.emailSegment.delete({
        where: { id: segmentId }
      });

      await eventBus.emit(EmailMarketingEvents.SEGMENT_DELETED, {
        segmentId
      });

      logger.info('Segment deleted', { segmentId });
    } catch (error) {
      logger.error('Failed to delete segment', error as Error);
      throw error;
    }
  }

  /**
   * Get segment by ID
   */
  async findById(segmentId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const segment = await prisma.client.emailSegment.findFirst({
      where: {
        id: segmentId,
        list: {
          tenantId
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
   * Find segments with filtering
   */
  async find(listId: string, query: SegmentQueryDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    // Validate list belongs to tenant
    const list = await prisma.client.emailList.findFirst({
      where: {
        id: listId,
        tenantId
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
   * Test segment conditions
   */
  async test(segmentId: string, data: TestSegmentDto): Promise<any> {
    const segment = await this.findById(segmentId);

    const conditions = data.conditions || segment.conditions;
    const where = this.buildWhereClause(conditions as SegmentCondition[]);

    const subscribers = await prisma.client.emailListSubscriber.findMany({
      where: {
        listId: segment.listId,
        subscribed: true,
        confirmed: true,
        ...where
      },
      take: data.limit || 10,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        tags: true,
        subscribedAt: true
      }
    });

    const count = await prisma.client.emailListSubscriber.count({
      where: {
        listId: segment.listId,
        subscribed: true,
        confirmed: true,
        ...where
      }
    });

    return {
      count,
      sample: subscribers
    };
  }

  /**
   * Get subscribers in segment
   */
  async getSubscribers(segmentId: string, limit?: number, offset?: number): Promise<any> {
    const segment = await this.findById(segmentId);
    const where = this.buildWhereClause(segment.conditions as SegmentCondition[]);

    const [subscribers, total] = await Promise.all([
      prisma.client.emailListSubscriber.findMany({
        where: {
          listId: segment.listId,
          subscribed: true,
          confirmed: true,
          ...where
        },
        skip: offset || 0,
        take: limit || 100
      }),
      prisma.client.emailListSubscriber.count({
        where: {
          listId: segment.listId,
          subscribed: true,
          confirmed: true,
          ...where
        }
      })
    ]);

    return {
      subscribers,
      total
    };
  }

  /**
   * Recalculate segment count
   */
  async recalculateSegment(segmentId: string): Promise<void> {
    const segment = await prisma.client.emailSegment.findUnique({
      where: { id: segmentId }
    });

    if (!segment) return;

    const where = this.buildWhereClause(segment.conditions as SegmentCondition[]);

    const count = await prisma.client.emailListSubscriber.count({
      where: {
        listId: segment.listId,
        subscribed: true,
        confirmed: true,
        ...where
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
   * Get segment conditions for multiple segments
   */
  async getSegmentConditions(segmentIds: string[]): Promise<any> {
    const segments = await prisma.client.emailSegment.findMany({
      where: { id: { in: segmentIds } }
    });

    if (segments.length === 0) return {};

    // Combine conditions with OR
    const orConditions = segments.map(segment =>
      this.buildWhereClause(segment.conditions as SegmentCondition[])
    );

    return { OR: orConditions };
  }

  /**
   * Build Prisma where clause from segment conditions
   */
  private buildWhereClause(conditions: SegmentCondition[]): any {
    const where: any = {};
    const andConditions: any[] = [];

    for (const condition of conditions) {
      const clause = this.buildConditionClause(condition);
      if (clause) {
        andConditions.push(clause);
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  /**
   * Build individual condition clause
   */
  private buildConditionClause(condition: SegmentCondition): any {
    const { field, operator, value } = condition;

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

      case 'customData':
        return this.buildCustomDataCondition(condition);

      default:
        return null;
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

      default:
        return null;
    }
  }

  /**
   * Build array field condition
   */
  private buildArrayCondition(field: string, operator: EmailSegmentOperator, value: any): any {
    const values = Array.isArray(value) ? value : [value];

    switch (operator) {
      case EmailSegmentOperator.IN:
        return { [field]: { hasSome: values } };

      case EmailSegmentOperator.NOT_IN:
        return { NOT: { [field]: { hasSome: values } } };

      default:
        return null;
    }
  }

  /**
   * Build date field condition
   */
  private buildDateCondition(field: string, operator: EmailSegmentOperator, value: any): any {
    const date = new Date(value);

    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        // Same day
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
        return null;
    }
  }

  /**
   * Build number field condition
   */
  private buildNumberCondition(field: string, operator: EmailSegmentOperator, value: any): any {
    const numValue = Number(value);

    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        return { [field]: numValue };

      case EmailSegmentOperator.NOT_EQUALS:
        return { [field]: { not: numValue } };

      case EmailSegmentOperator.GREATER_THAN:
        return { [field]: { gt: numValue } };

      case EmailSegmentOperator.LESS_THAN:
        return { [field]: { lt: numValue } };

      default:
        return null;
    }
  }

  /**
   * Build custom data field condition
   */
  private buildCustomDataCondition(condition: SegmentCondition): any {
    const { operator, value, customField } = condition;

    if (!customField) return null;

    // Use JSON path query for custom data
    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        return {
          customData: {
            path: [customField],
            equals: value
          }
        };

      case EmailSegmentOperator.NOT_EQUALS:
        return {
          NOT: {
            customData: {
              path: [customField],
              equals: value
            }
          }
        };

      case EmailSegmentOperator.CONTAINS:
        return {
          customData: {
            path: [customField],
            string_contains: value
          }
        };

      default:
        return null;
    }
  }
}
