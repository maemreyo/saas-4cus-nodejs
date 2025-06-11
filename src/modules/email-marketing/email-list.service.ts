import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { queueService } from '@shared/queue/queue.service';
import { TenantContextService } from '@modules/tenant/tenant.context';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException
} from '@shared/exceptions';
import {
  CreateEmailListDto,
  UpdateEmailListDto,
  AddSubscriberDto,
  ImportSubscribersDto,
  UpdateSubscriberDto,
  SubscriberQueryDto,
  EmailListQueryDto,
  SubscriberTagsDto,
  BulkOperationDto
} from './email-marketing.dto';
import {
  EmailListStatus,
  Prisma
} from '@prisma/client';
import { EmailMarketingEvents } from './email-marketing.events';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';
import Papa from 'papaparse';

@Service()
export class EmailListService {
  constructor(
    private tenantContext: TenantContextService
  ) {}

  /**
   * Create a new email list
   */
  async create(data: CreateEmailListDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    try {
      const list = await prisma.client.emailList.create({
        data: {
          tenantId,
          name: data.name,
          description: data.description,
          doubleOptIn: data.doubleOptIn ?? true,
          welcomeEmailId: data.welcomeEmailId,
          confirmationPageUrl: data.confirmationPageUrl,
          defaultFromName: data.defaultFromName,
          defaultFromEmail: data.defaultFromEmail,
          defaultReplyTo: data.defaultReplyTo,
          customFields: data.customFields,
          metadata: data.metadata
        }
      });

      await eventBus.emit(EmailMarketingEvents.LIST_CREATED, {
        listId: list.id,
        tenantId
      });

      logger.info('Email list created', { listId: list.id, tenantId });

      return list;
    } catch (error) {
      logger.error('Failed to create email list', error as Error);
      throw error;
    }
  }

  /**
   * Update email list
   */
  async update(listId: string, data: UpdateEmailListDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(listId);

    try {
      const updated = await prisma.client.emailList.update({
        where: { id: listId },
        data: {
          name: data.name,
          description: data.description,
          doubleOptIn: data.doubleOptIn,
          welcomeEmailId: data.welcomeEmailId,
          confirmationPageUrl: data.confirmationPageUrl,
          defaultFromName: data.defaultFromName,
          defaultFromEmail: data.defaultFromEmail,
          defaultReplyTo: data.defaultReplyTo,
          customFields: data.customFields,
          metadata: data.metadata
        }
      });

      await eventBus.emit(EmailMarketingEvents.LIST_UPDATED, {
        listId: updated.id,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update email list', error as Error);
      throw error;
    }
  }

  /**
   * Archive/unarchive email list
   */
  async updateStatus(listId: string, status: EmailListStatus): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(listId);

    try {
      const updated = await prisma.client.emailList.update({
        where: { id: listId },
        data: { status }
      });

      await eventBus.emit(EmailMarketingEvents.LIST_STATUS_CHANGED, {
        listId: updated.id,
        tenantId,
        status
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update list status', error as Error);
      throw error;
    }
  }

  /**
   * Delete email list
   */
  async delete(listId: string): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(listId);

    // Check if list has active campaigns
    const activeCampaigns = await prisma.client.emailCampaign.count({
      where: {
        listId,
        status: {
          in: ['SCHEDULED', 'SENDING']
        }
      }
    });

    if (activeCampaigns > 0) {
      throw new BadRequestException('Cannot delete list with active campaigns');
    }

    try {
      await prisma.client.emailList.update({
        where: { id: listId },
        data: { deletedAt: new Date() }
      });

      await eventBus.emit(EmailMarketingEvents.LIST_DELETED, {
        listId,
        tenantId
      });

      logger.info('Email list deleted', { listId });
    } catch (error) {
      logger.error('Failed to delete email list', error as Error);
      throw error;
    }
  }

  /**
   * Find email list by ID
   */
  async findById(listId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const list = await prisma.client.emailList.findFirst({
      where: {
        id: listId,
        tenantId,
        deletedAt: null
      },
      include: {
        _count: {
          select: {
            subscribers: {
              where: { subscribed: true }
            },
            campaigns: true,
            segments: true
          }
        }
      }
    });

    if (!list) {
      throw new NotFoundException('Email list not found');
    }

    return list;
  }

  /**
   * Find email lists
   */
  async find(query: EmailListQueryDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const where: Prisma.EmailListWhereInput = {
      tenantId,
      deletedAt: null,
      ...(query.status && { status: query.status }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } }
        ]
      })
    };

    const [lists, total] = await Promise.all([
      prisma.client.emailList.findMany({
        where,
        include: {
          _count: {
            select: {
              subscribers: {
                where: { subscribed: true }
              },
              campaigns: true,
              segments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit
      }),
      prisma.client.emailList.count({ where })
    ]);

    return {
      lists,
      pagination: {
        total,
        page: Math.floor(query.skip / query.limit) + 1,
        limit: query.limit,
        pages: Math.ceil(total / query.limit)
      }
    };
  }

  /**
   * Add subscriber to list
   */
  async addSubscriber(listId: string, data: AddSubscriberDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const list = await this.findById(listId);

    // Check if subscriber already exists
    const existing = await prisma.client.emailListSubscriber.findUnique({
      where: {
        listId_email: {
          listId,
          email: data.email.toLowerCase()
        }
      }
    });

    if (existing) {
      if (existing.subscribed) {
        throw new ConflictException('Subscriber already exists in this list');
      } else {
        // Resubscribe
        const updated = await prisma.client.emailListSubscriber.update({
          where: { id: existing.id },
          data: {
            subscribed: true,
            subscribedAt: new Date(),
            unsubscribedAt: null,
            confirmed: !list.doubleOptIn,
            confirmationToken: list.doubleOptIn ? nanoid() : null,
            confirmedAt: !list.doubleOptIn ? new Date() : null,
            firstName: data.firstName || existing.firstName,
            lastName: data.lastName || existing.lastName,
            customData: { ...existing.customData, ...data.customData },
            tags: data.tags || existing.tags,
            source: data.source || existing.source,
            ipAddress: data.ipAddress || existing.ipAddress,
            location: data.location || existing.location
          }
        });

        await this.sendConfirmationEmail(list, updated);

        await eventBus.emit(EmailMarketingEvents.SUBSCRIBER_RESUBSCRIBED, {
          subscriberId: updated.id,
          listId,
          tenantId
        });

        return updated;
      }
    }

    try {
      const subscriber = await prisma.client.emailListSubscriber.create({
        data: {
          listId,
          email: data.email.toLowerCase(),
          firstName: data.firstName,
          lastName: data.lastName,
          confirmed: !list.doubleOptIn,
          confirmationToken: list.doubleOptIn ? nanoid() : null,
          confirmedAt: !list.doubleOptIn ? new Date() : null,
          customData: data.customData,
          tags: data.tags || [],
          source: data.source,
          ipAddress: data.ipAddress,
          location: data.location,
          metadata: data.metadata
        }
      });

      // Send confirmation email if double opt-in
      if (list.doubleOptIn) {
        await this.sendConfirmationEmail(list, subscriber);
      } else if (list.welcomeEmailId) {
        // Send welcome email if configured
        await this.sendWelcomeEmail(list, subscriber);
      }

      await eventBus.emit(EmailMarketingEvents.SUBSCRIBER_ADDED, {
        subscriberId: subscriber.id,
        listId,
        tenantId
      });

      logger.info('Subscriber added', {
        subscriberId: subscriber.id,
        listId,
        email: subscriber.email
      });

      return subscriber;
    } catch (error) {
      logger.error('Failed to add subscriber', error as Error);
      throw error;
    }
  }

  /**
   * Import subscribers in bulk
   */
  async importSubscribers(listId: string, data: ImportSubscribersDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const list = await this.findById(listId);

    // Parse CSV if provided
    let subscribers = data.subscribers;

    if (data.csv) {
      const parsed = Papa.parse(data.csv, {
        header: true,
        skipEmptyLines: true
      });

      if (parsed.errors.length > 0) {
        throw new BadRequestException('Invalid CSV format');
      }

      subscribers = parsed.data.map((row: any) => ({
        email: row.email || row.Email,
        firstName: row.firstName || row.first_name || row['First Name'],
        lastName: row.lastName || row.last_name || row['Last Name'],
        customData: row
      }));
    }

    if (!subscribers || subscribers.length === 0) {
      throw new BadRequestException('No subscribers to import');
    }

    // Queue import job
    const job = await queueService.addJob(
      'email-marketing',
      'import-subscribers',
      {
        listId,
        tenantId,
        subscribers,
        updateExisting: data.updateExisting,
        skipConfirmation: data.skipConfirmation
      }
    );

    logger.info('Subscriber import initiated', {
      listId,
      count: subscribers.length,
      jobId: job.id
    });

    return {
      message: 'Import initiated',
      jobId: job.id,
      count: subscribers.length
    };
  }

  /**
   * Update subscriber
   */
  async updateSubscriber(
    listId: string,
    subscriberId: string,
    data: UpdateSubscriberDto
  ): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(listId);

    const subscriber = await prisma.client.emailListSubscriber.findFirst({
      where: {
        id: subscriberId,
        listId
      }
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    try {
      const updated = await prisma.client.emailListSubscriber.update({
        where: { id: subscriberId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          customData: data.customData ?
            { ...subscriber.customData, ...data.customData } :
            subscriber.customData,
          metadata: data.metadata
        }
      });

      await eventBus.emit(EmailMarketingEvents.SUBSCRIBER_UPDATED, {
        subscriberId: updated.id,
        listId,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update subscriber', error as Error);
      throw error;
    }
  }

  /**
   * Update subscriber tags
   */
  async updateSubscriberTags(
    listId: string,
    subscriberId: string,
    data: SubscriberTagsDto
  ): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(listId);

    const subscriber = await prisma.client.emailListSubscriber.findFirst({
      where: {
        id: subscriberId,
        listId
      }
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    try {
      let tags = [...subscriber.tags];

      if (data.add && data.add.length > 0) {
        tags = [...new Set([...tags, ...data.add])];
      }

      if (data.remove && data.remove.length > 0) {
        tags = tags.filter(tag => !data.remove!.includes(tag));
      }

      const updated = await prisma.client.emailListSubscriber.update({
        where: { id: subscriberId },
        data: { tags }
      });

      await eventBus.emit(EmailMarketingEvents.SUBSCRIBER_TAGS_UPDATED, {
        subscriberId: updated.id,
        listId,
        tenantId,
        tags
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update subscriber tags', error as Error);
      throw error;
    }
  }

  /**
   * Unsubscribe
   */
  async unsubscribe(
    listId: string,
    email: string,
    reason?: string,
    feedback?: string
  ): Promise<void> {
    const subscriber = await prisma.client.emailListSubscriber.findUnique({
      where: {
        listId_email: {
          listId,
          email: email.toLowerCase()
        }
      }
    });

    if (!subscriber || !subscriber.subscribed) {
      throw new NotFoundException('Subscriber not found or already unsubscribed');
    }

    try {
      await prisma.client.emailListSubscriber.update({
        where: { id: subscriber.id },
        data: {
          subscribed: false,
          unsubscribedAt: new Date()
        }
      });

      // Record unsubscribe
      await prisma.client.emailUnsubscribe.create({
        data: {
          email: email.toLowerCase(),
          listId,
          reason,
          feedback
        }
      });

      await eventBus.emit(EmailMarketingEvents.SUBSCRIBER_UNSUBSCRIBED, {
        subscriberId: subscriber.id,
        listId,
        email,
        reason
      });

      logger.info('Subscriber unsubscribed', {
        subscriberId: subscriber.id,
        listId,
        email
      });
    } catch (error) {
      logger.error('Failed to unsubscribe', error as Error);
      throw error;
    }
  }

  /**
   * Confirm subscription
   */
  async confirmSubscription(token: string): Promise<any> {
    const subscriber = await prisma.client.emailListSubscriber.findFirst({
      where: {
        confirmationToken: token,
        confirmed: false
      },
      include: {
        list: true
      }
    });

    if (!subscriber) {
      throw new NotFoundException('Invalid or expired confirmation token');
    }

    try {
      const updated = await prisma.client.emailListSubscriber.update({
        where: { id: subscriber.id },
        data: {
          confirmed: true,
          confirmedAt: new Date(),
          confirmationToken: null
        }
      });

      // Send welcome email if configured
      if (subscriber.list.welcomeEmailId) {
        await this.sendWelcomeEmail(subscriber.list, updated);
      }

      await eventBus.emit(EmailMarketingEvents.SUBSCRIBER_CONFIRMED, {
        subscriberId: updated.id,
        listId: subscriber.listId
      });

      logger.info('Subscription confirmed', {
        subscriberId: updated.id,
        email: updated.email
      });

      return {
        subscriber: updated,
        confirmationPageUrl: subscriber.list.confirmationPageUrl
      };
    } catch (error) {
      logger.error('Failed to confirm subscription', error as Error);
      throw error;
    }
  }

  /**
   * Get subscribers
   */
  async getSubscribers(listId: string, query: SubscriberQueryDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(listId);

    const where: Prisma.EmailListSubscriberWhereInput = {
      listId,
      ...(query.subscribed !== undefined && { subscribed: query.subscribed }),
      ...(query.confirmed !== undefined && { confirmed: query.confirmed }),
      ...(query.tags && query.tags.length > 0 && {
        tags: { hasSome: query.tags }
      }),
      ...(query.search && {
        OR: [
          { email: { contains: query.search, mode: 'insensitive' } },
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } }
        ]
      })
    };

    const [subscribers, total] = await Promise.all([
      prisma.client.emailListSubscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip: query.skip,
        take: query.limit
      }),
      prisma.client.emailListSubscriber.count({ where })
    ]);

    return {
      subscribers,
      pagination: {
        total,
        page: Math.floor(query.skip / query.limit) + 1,
        limit: query.limit,
        pages: Math.ceil(total / query.limit)
      }
    };
  }

  /**
   * Get list statistics
   */
  async getStats(listId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(listId);

    const [
      total,
      subscribed,
      confirmed,
      unsubscribed,
      growthStats
    ] = await Promise.all([
      prisma.client.emailListSubscriber.count({
        where: { listId }
      }),
      prisma.client.emailListSubscriber.count({
        where: { listId, subscribed: true }
      }),
      prisma.client.emailListSubscriber.count({
        where: { listId, subscribed: true, confirmed: true }
      }),
      prisma.client.emailListSubscriber.count({
        where: { listId, subscribed: false }
      }),
      this.getGrowthStats(listId)
    ]);

    return {
      total,
      subscribed,
      confirmed,
      unsubscribed,
      unsubscribeRate: total > 0 ? (unsubscribed / total) * 100 : 0,
      growth: growthStats
    };
  }

  /**
   * Bulk operations
   */
  async bulkOperation(listId: string, operation: BulkOperationDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(listId);

    const where: Prisma.EmailListSubscriberWhereInput = {
      listId,
      id: { in: operation.subscriberIds }
    };

    switch (operation.action) {
      case 'delete':
        const deleted = await prisma.client.emailListSubscriber.deleteMany({
          where
        });
        return { deleted: deleted.count };

      case 'unsubscribe':
        const unsubscribed = await prisma.client.emailListSubscriber.updateMany({
          where,
          data: {
            subscribed: false,
            unsubscribedAt: new Date()
          }
        });
        return { unsubscribed: unsubscribed.count };

      case 'add_tags':
        if (!operation.tags || operation.tags.length === 0) {
          throw new BadRequestException('Tags required for add_tags operation');
        }
        // This is more complex - would need to update each subscriber individually
        const subscribers = await prisma.client.emailListSubscriber.findMany({
          where
        });

        for (const subscriber of subscribers) {
          await prisma.client.emailListSubscriber.update({
            where: { id: subscriber.id },
            data: {
              tags: [...new Set([...subscriber.tags, ...operation.tags!])]
            }
          });
        }
        return { updated: subscribers.length };

      default:
        throw new BadRequestException('Invalid bulk operation');
    }
  }

  /**
   * Get list growth statistics
   */
  private async getGrowthStats(listId: string): Promise<any> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await prisma.client.emailListSubscriber.groupBy({
      by: ['subscribedAt'],
      where: {
        listId,
        subscribedAt: { gte: thirtyDaysAgo }
      },
      _count: true
    });

    return {
      daily: dailyStats,
      totalLast30Days: dailyStats.reduce((sum, day) => sum + day._count, 0)
    };
  }

  /**
   * Send confirmation email
   */
  private async sendConfirmationEmail(list: any, subscriber: any): Promise<void> {
    const confirmationUrl = `${process.env.APP_URL}/confirm-subscription?token=${subscriber.confirmationToken}`;

    await queueService.addJob(
      'email-marketing',
      'send-transactional',
      {
        to: subscriber.email,
        subject: `Please confirm your subscription to ${list.name}`,
        templateKey: 'subscription-confirmation',
        variables: {
          listName: list.name,
          firstName: subscriber.firstName || 'Subscriber',
          confirmationUrl
        }
      }
    );
  }

  /**
   * Send welcome email
   */
  private async sendWelcomeEmail(list: any, subscriber: any): Promise<void> {
    await queueService.addJob(
      'email-marketing',
      'send-welcome-email',
      {
        listId: list.id,
        subscriberId: subscriber.id,
        welcomeEmailId: list.welcomeEmailId
      }
    );
  }
}