// Service for managing email list segmentation

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { AppError } from '@/shared/exceptions';
import { logger } from '@/shared/logger';
import { EmailActivityType, EmailSegment, EmailSegmentOperator, Prisma } from '@prisma/client';
import { CreateSegmentDTO, UpdateSegmentDTO, TestSegmentDTO } from '../dto/email-segment.dto';

export interface SegmentCondition {
  field?: string;
  operator?: EmailSegmentOperator;
  value?: any;
  type?: 'subscriber' | 'engagement' | 'campaign' | 'custom';
}

export interface SegmentGroup {
  operator?: 'AND' | 'OR';
  conditions?: SegmentCondition[];
}

export interface SegmentConditions {
  operator?: 'AND' | 'OR';
  groups?: SegmentGroup[];
}

@Injectable()
export class EmailSegmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly redis: RedisService,
  ) {}

  /**
   * Create a new segment
   */
  async createSegment(listId: string, data: CreateSegmentDTO): Promise<EmailSegment> {
    // Validate list exists
    const list = await this.prisma.client.emailList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new AppError('Email list not found', 404);
    }

    // Calculate initial subscriber count
    const subscriberCount = await this.calculateSegmentSize(listId, data.conditions);

    // Create segment with proper type casting for Prisma
    const segment = await this.prisma.client.emailSegment.create({
      data: {
        list: { connect: { id: listId } }, // Use relation instead of direct listId
        tenant: { connect: { id: list.tenantId } }, // Connect to tenant
        name: data.name,
        description: data.description || null,
        conditions: data.conditions as any, // Cast to any to bypass type checking
        subscriberCount,
        lastCalculatedAt: new Date(),
        metadata: data.metadata || null,
      },
    });

    await this.eventBus.emit('email.segment.created', {
      tenantId: list.tenantId,
      listId,
      segmentId: segment.id,
      name: segment.name,
      subscriberCount,
    });

    logger.info('Email segment created', {
      listId,
      segmentId: segment.id,
    });

    return segment;
  }

  /**
   * Update a segment
   */
  async updateSegment(segmentId: string, data: UpdateSegmentDTO): Promise<EmailSegment> {
    const segment = await this.getSegment(segmentId);

    let updateData: any = { ...data };

    // Recalculate subscriber count if conditions changed
    if (data.conditions) {
      updateData.subscriberCount = await this.calculateSegmentSize(segment.listId, data.conditions);
      updateData.lastCalculatedAt = new Date();
    }

    const updated = await this.prisma.client.emailSegment.update({
      where: { id: segmentId },
      data: updateData,
    });

    await this.invalidateSegmentCache(segmentId);

    await this.eventBus.emit('email.segment.updated', {
      segmentId,
      changes: data,
    });

    return updated;
  }

  /**
   * Get segment details
   */
  async getSegment(segmentId: string): Promise<EmailSegment> {
    const cacheKey = `email-segment:${segmentId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const segment = await this.prisma.client.emailSegment.findUnique({
      where: { id: segmentId },
      include: {
        list: true,
      },
    });

    if (!segment) {
      throw new AppError('Segment not found', 404);
    }

    await this.redis.set(cacheKey, segment, { ttl: 300 });

    return segment;
  }

  /**
   * Get segments for a list
   */
  async getListSegments(listId: string): Promise<EmailSegment[]> {
    return this.prisma.client.emailSegment.findMany({
      where: { listId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Test segment conditions
   */
  async testSegment(
    listId: string,
    data: TestSegmentDTO,
  ): Promise<{
    count: number;
    sample: any[];
  }> {
    const count = await this.calculateSegmentSize(listId, data.conditions);

    const query = this.buildSegmentQuery(listId, data.conditions);
    const sample = await this.prisma.client.emailListSubscriber.findMany({
      where: query,
      take: data.limit,
      include: {
        activities: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return { count, sample };
  }

  /**
   * Get subscribers in a segment
   */
  async getSegmentSubscribers(segmentIds: string[]): Promise<string[]> {
    if (segmentIds.length === 0) {
      return [];
    }

    const segments = await this.prisma.client.emailSegment.findMany({
      where: { id: { in: segmentIds } },
    });

    if (segments.length === 0) {
      return [];
    }

    // Get all subscribers matching any segment
    const subscriberSets: Set<string>[] = [];

    for (const segment of segments) {
      const query = this.buildSegmentQuery(segment.listId, segment.conditions as unknown as SegmentConditions);

      const subscribers = await this.prisma.client.emailListSubscriber.findMany({
        where: query,
        select: { id: true },
      });

      subscriberSets.push(new Set(subscribers.map(s => s.id)));
    }

    // Union all subscriber sets
    const allSubscribers = new Set<string>();
    for (const set of subscriberSets) {
      for (const id of set) {
        allSubscribers.add(id);
      }
    }

    return Array.from(allSubscribers);
  }

  /**
   * Refresh segment subscriber count
   */
  async refreshSegment(segmentId: string): Promise<EmailSegment> {
    const segment = await this.getSegment(segmentId);

    const subscriberCount = await this.calculateSegmentSize(segment.listId, segment.conditions as unknown as SegmentConditions);

    const updated = await this.prisma.client.emailSegment.update({
      where: { id: segmentId },
      data: {
        subscriberCount,
        lastCalculatedAt: new Date(),
      },
    });

    await this.invalidateSegmentCache(segmentId);

    if (Math.abs(segment.subscriberCount - subscriberCount) > 10) {
      await this.eventBus.emit('email.segment.size.changed', {
        segmentId,
        oldCount: segment.subscriberCount,
        newCount: subscriberCount,
      });
    }

    return updated;
  }

  /**
   * Delete a segment
   */
  async deleteSegment(segmentId: string): Promise<void> {
    const segment = await this.getSegment(segmentId);

    // Check if segment is in use
    const campaignsUsingSegment = await this.prisma.client.emailCampaign.count({
      where: {
        OR: [{ segmentIds: { has: segmentId } }, { excludeSegmentIds: { has: segmentId } }],
      },
    });

    if (campaignsUsingSegment > 0) {
      throw new AppError('Cannot delete segment that is in use by campaigns', 400);
    }

    await this.prisma.client.emailSegment.delete({
      where: { id: segmentId },
    });

    await this.invalidateSegmentCache(segmentId);

    await this.eventBus.emit('email.segment.deleted', {
      segmentId,
      listId: segment.listId,
    });
  }

  /**
   * Build Prisma query from segment conditions
   */
  private buildSegmentQuery(listId: string, conditions: SegmentConditions): Prisma.EmailListSubscriberWhereInput {
    const baseQuery: Prisma.EmailListSubscriberWhereInput = {
      listId,
      subscribed: true,
      confirmed: true,
    };

    if (!conditions || !conditions.groups || conditions.groups.length === 0) {
      return baseQuery;
    }

    const groupQueries = conditions.groups.map(group => this.buildGroupQuery(group));

    if (conditions.operator === 'AND') {
      return {
        ...baseQuery,
        AND: groupQueries,
      };
    } else {
      return {
        ...baseQuery,
        OR: groupQueries,
      };
    }
  }

  /**
   * Build query for a condition group
   */
  private buildGroupQuery(group: SegmentGroup): Prisma.EmailListSubscriberWhereInput {
    if (!group.conditions || group.conditions.length === 0) {
      return {};
    }

    const conditionQueries = group.conditions.map(condition => this.buildConditionQuery(condition));

    if (group.operator === 'AND') {
      return { AND: conditionQueries };
    } else {
      return { OR: conditionQueries };
    }
  }

  /**
   * Build query for a single condition
   */
  private buildConditionQuery(condition: SegmentCondition): Prisma.EmailListSubscriberWhereInput {
    const { field, operator, value, type = 'subscriber' } = condition;

    if (!field || !operator) {
      return {};
    }

    switch (type) {
      case 'subscriber':
        return this.buildSubscriberCondition(field, operator, value);

      case 'engagement':
        return this.buildEngagementCondition(field, operator, value);

      case 'campaign':
        return this.buildCampaignCondition(field, operator, value);

      case 'custom':
        return this.buildCustomDataCondition(field, operator, value);

      default:
        return {};
    }
  }

  /**
   * Build subscriber field conditions
   */
  private buildSubscriberCondition(
    field: string,
    operator: EmailSegmentOperator,
    value: any,
  ): Prisma.EmailListSubscriberWhereInput {
    switch (field) {
      case 'email':
        return this.buildStringCondition('email', operator, value);

      case 'firstName':
        return this.buildStringCondition('firstName', operator, value);

      case 'lastName':
        return this.buildStringCondition('lastName', operator, value);

      case 'subscribedAt':
        return this.buildDateCondition('subscribedAt', operator, value);

      case 'tags':
        return this.buildArrayCondition('tags', operator, value);

      case 'source':
        return this.buildStringCondition('source', operator, value);

      case 'location':
        return this.buildStringCondition('location', operator, value);

      default:
        return {};
    }
  }

  /**
   * Build engagement conditions
   */
  private buildEngagementCondition(
    field: string,
    operator: EmailSegmentOperator,
    value: any,
  ): Prisma.EmailListSubscriberWhereInput {
    switch (field) {
      case 'engagementScore':
        return this.buildNumberCondition('engagementScore', operator, value);

      case 'lastEngagedAt':
        return this.buildDateCondition('lastEngagedAt', operator, value);

      case 'hasOpened':
        if (value) {
          return {
            activities: {
              some: { type: EmailActivityType.OPENED },
            },
          };
        } else {
          return {
            activities: {
              none: { type: EmailActivityType.OPENED },
            },
          };
        }

      case 'hasClicked':
        if (value) {
          return {
            activities: {
              some: { type: EmailActivityType.CLICKED },
            },
          };
        } else {
          return {
            activities: {
              none: { type: EmailActivityType.CLICKED },
            },
          };
        }

      default:
        return {};
    }
  }

  /**
   * Build campaign interaction conditions
   */
  private buildCampaignCondition(
    field: string,
    operator: EmailSegmentOperator,
    value: any,
  ): Prisma.EmailListSubscriberWhereInput {
    switch (field) {
      case 'receivedCampaign':
        return {
          recipients: {
            some: { campaignId: value },
          },
        };

      case 'openedCampaign':
        return {
          recipients: {
            some: {
              campaignId: value,
              openedAt: { not: null },
            },
          },
        };

      case 'clickedCampaign':
        return {
          recipients: {
            some: {
              campaignId: value,
              clickedAt: { not: null },
            },
          },
        };

      default:
        return {};
    }
  }

  /**
   * Build custom data conditions
   */
  private buildCustomDataCondition(
    field: string,
    operator: EmailSegmentOperator,
    value: any,
  ): Prisma.EmailListSubscriberWhereInput {
    // Use JSON path query for custom data
    const path = field.split('.');

    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        return {
          customData: {
            path,
            equals: value,
          },
        };

      case EmailSegmentOperator.NOT_EQUALS:
        return {
          customData: {
            path,
            not: value,
          },
        };

      case EmailSegmentOperator.CONTAINS:
        return {
          customData: {
            path,
            string_contains: value,
          },
        };

      default:
        return {};
    }
  }

  /**
   * Build string field conditions
   */
  private buildStringCondition(
    field: string,
    operator: EmailSegmentOperator,
    value: any,
  ): Prisma.EmailListSubscriberWhereInput {
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
        return { [field]: { in: Array.isArray(value) ? value : [value] } };

      case EmailSegmentOperator.NOT_IN:
        return { [field]: { notIn: Array.isArray(value) ? value : [value] } };

      default:
        return {};
    }
  }

  /**
   * Build number field conditions
   */
  private buildNumberCondition(
    field: string,
    operator: EmailSegmentOperator,
    value: any,
  ): Prisma.EmailListSubscriberWhereInput {
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
        return {};
    }
  }

  /**
   * Build date field conditions
   */
  private buildDateCondition(
    field: string,
    operator: EmailSegmentOperator,
    value: any,
  ): Prisma.EmailListSubscriberWhereInput {
    const dateValue = new Date(value);

    switch (operator) {
      case EmailSegmentOperator.EQUALS:
        // Date equals (same day)
        const startOfDay = new Date(dateValue);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateValue);
        endOfDay.setHours(23, 59, 59, 999);

        return {
          [field]: {
            gte: startOfDay,
            lte: endOfDay,
          },
        };

      case EmailSegmentOperator.GREATER_THAN:
        return { [field]: { gt: dateValue } };

      case EmailSegmentOperator.LESS_THAN:
        return { [field]: { lt: dateValue } };

      default:
        return {};
    }
  }

  /**
   * Build array field conditions
   */
  private buildArrayCondition(
    field: string,
    operator: EmailSegmentOperator,
    value: any,
  ): Prisma.EmailListSubscriberWhereInput {
    const arrayValue = Array.isArray(value) ? value : [value];

    switch (operator) {
      case EmailSegmentOperator.CONTAINS:
        return { [field]: { hasEvery: arrayValue } };

      case EmailSegmentOperator.NOT_CONTAINS:
        return {
          NOT: { [field]: { hasSome: arrayValue } },
        };

      case EmailSegmentOperator.IN:
        return { [field]: { hasSome: arrayValue } };

      default:
        return {};
    }
  }

  /**
   * Calculate segment size
   */
  private async calculateSegmentSize(listId: string, conditions: SegmentConditions): Promise<number> {
    const query = this.buildSegmentQuery(listId, conditions);

    return this.prisma.client.emailListSubscriber.count({
      where: query,
    });
  }

  /**
   * Invalidate segment cache
   */
  private async invalidateSegmentCache(segmentId: string): Promise<void> {
    await this.redis.delete(`email-segment:${segmentId}`);
  }
}
