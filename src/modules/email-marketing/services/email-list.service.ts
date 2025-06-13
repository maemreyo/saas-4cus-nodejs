// Service for managing email lists and subscribers

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { AppError } from '@/shared/exceptions';
import { EmailService } from '@/shared/services/email.service';
import { logger } from '@/shared/logger';
import {
  EmailList,
  EmailListSubscriber,
  EmailListStatus,
  Prisma
} from '@prisma/client';
import {
  CreateEmailListDTO,
  UpdateEmailListDTO,
  ImportSubscribersDTO,
  SubscribeDTO,
  UnsubscribeDTO,
  UpdateSubscriberDTO
} from '../dto/email-list.dto';
import * as crypto from 'crypto';
import { parse as parseCSV } from 'papaparse';

@Injectable()
export class EmailListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly redis: RedisService,
    private readonly emailService: EmailService
  ) {}

  /**
   * Create a new email list
   */
  async createList(
    tenantId: string,
    data: CreateEmailListDTO
  ): Promise<EmailList> {
    const list = await this.prisma.emailList.create({
      data: {
        tenantId,
        ...data,
        status: EmailListStatus.ACTIVE
      }
    });

    await this.eventBus.emit('email.list.created', {
      tenantId,
      listId: list.id,
      name: list.name
    });

    logger.info('Email list created', { tenantId, listId: list.id });

    return list;
  }

  /**
   * Update an email list
   */
  async updateList(
    tenantId: string,
    listId: string,
    data: UpdateEmailListDTO
  ): Promise<EmailList> {
    const list = await this.prisma.emailList.update({
      where: {
        id: listId,
        tenantId
      },
      data
    });

    await this.invalidateListCache(listId);

    await this.eventBus.emit('email.list.updated', {
      tenantId,
      listId,
      changes: data
    });

    return list;
  }

  /**
   * Get email list with statistics
   */
  async getList(
    tenantId: string,
    listId: string
  ): Promise<EmailList & { stats: any }> {
    const cacheKey = `email-list:${listId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const list = await this.prisma.emailList.findFirst({
      where: {
        id: listId,
        tenantId,
        deletedAt: null
      }
    });

    if (!list) {
      throw new AppError('Email list not found', 404);
    }

    const stats = await this.getListStats(listId);
    const result = { ...list, stats };

    await this.redis.set(cacheKey, result, { ttl: 300 });

    return result;
  }

  /**
   * Get list statistics
   */
  async getListStats(listId: string): Promise<{
    totalSubscribers: number;
    activeSubscribers: number;
    unconfirmedSubscribers: number;
    unsubscribed: number;
    averageEngagementScore: number;
    growthRate: number;
  }> {
    const [
      totalSubscribers,
      activeSubscribers,
      unconfirmedSubscribers,
      unsubscribed,
      avgEngagement,
      lastMonthCount
    ] = await Promise.all([
      this.prisma.emailListSubscriber.count({
        where: { listId }
      }),
      this.prisma.emailListSubscriber.count({
        where: { listId, subscribed: true, confirmed: true }
      }),
      this.prisma.emailListSubscriber.count({
        where: { listId, confirmed: false }
      }),
      this.prisma.emailListSubscriber.count({
        where: { listId, subscribed: false }
      }),
      this.prisma.emailListSubscriber.aggregate({
        where: { listId, subscribed: true },
        _avg: { engagementScore: true }
      }),
      this.prisma.emailListSubscriber.count({
        where: {
          listId,
          subscribedAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    const growthRate = lastMonthCount > 0
      ? ((activeSubscribers - lastMonthCount) / lastMonthCount) * 100
      : 0;

    return {
      totalSubscribers,
      activeSubscribers,
      unconfirmedSubscribers,
      unsubscribed,
      averageEngagementScore: avgEngagement._avg.engagementScore || 0,
      growthRate
    };
  }

  /**
   * Subscribe to a list
   */
  async subscribe(
    listId: string,
    data: SubscribeDTO,
    source?: string
  ): Promise<EmailListSubscriber> {
    const list = await this.prisma.emailList.findUnique({
      where: { id: listId }
    });

    if (!list || list.status !== EmailListStatus.ACTIVE) {
      throw new AppError('List not available for subscription', 400);
    }

    // Check if already subscribed
    const existing = await this.prisma.emailListSubscriber.findUnique({
      where: {
        listId_email: {
          listId,
          email: data.email.toLowerCase()
        }
      }
    });

    if (existing) {
      if (existing.subscribed) {
        throw new AppError('Already subscribed to this list', 409);
      }

      // Resubscribe
      return this.resubscribe(existing.id);
    }

    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const subscriber = await this.prisma.emailListSubscriber.create({
      data: {
        listId,
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        confirmationToken,
        confirmed: !list.doubleOptIn,
        confirmedAt: !list.doubleOptIn ? new Date() : null,
        source,
        ipAddress: data.ipAddress,
        customData: data.customData,
        tags: data.tags || []
      }
    });

    // Send confirmation email if double opt-in
    if (list.doubleOptIn) {
      await this.sendConfirmationEmail(list, subscriber);
    } else if (list.welcomeEmailId) {
      // Send welcome email
      await this.sendWelcomeEmail(list, subscriber);
    }

    await this.eventBus.emit('email.subscriber.added', {
      listId,
      subscriberId: subscriber.id,
      email: subscriber.email,
      requiresConfirmation: list.doubleOptIn
    });

    return subscriber;
  }

  /**
   * Confirm subscription
   */
  async confirmSubscription(token: string): Promise<{
    subscriber: EmailListSubscriber;
    list: EmailList;
  }> {
    const subscriber = await this.prisma.emailListSubscriber.findUnique({
      where: { confirmationToken: token },
      include: { list: true }
    });

    if (!subscriber) {
      throw new AppError('Invalid confirmation token', 400);
    }

    if (subscriber.confirmed) {
      throw new AppError('Already confirmed', 400);
    }

    const updated = await this.prisma.emailListSubscriber.update({
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

    await this.eventBus.emit('email.subscriber.confirmed', {
      listId: subscriber.listId,
      subscriberId: subscriber.id,
      email: subscriber.email
    });

    return {
      subscriber: updated,
      list: subscriber.list
    };
  }

  /**
   * Unsubscribe from a list
   */
  async unsubscribe(
    data: UnsubscribeDTO
  ): Promise<void> {
    const subscriber = await this.prisma.emailListSubscriber.findFirst({
      where: {
        email: data.email.toLowerCase(),
        listId: data.listId
      }
    });

    if (!subscriber || !subscriber.subscribed) {
      throw new AppError('Not subscribed to this list', 400);
    }

    await this.prisma.$transaction([
      // Update subscriber status
      this.prisma.emailListSubscriber.update({
        where: { id: subscriber.id },
        data: {
          subscribed: false,
          unsubscribedAt: new Date()
        }
      }),

      // Record unsubscribe reason
      this.prisma.emailUnsubscribe.create({
        data: {
          email: data.email.toLowerCase(),
          listId: data.listId,
          reason: data.reason,
          feedback: data.feedback,
          globalUnsubscribe: data.globalUnsubscribe || false
        }
      })
    ]);

    // Handle global unsubscribe
    if (data.globalUnsubscribe) {
      await this.globalUnsubscribe(data.email);
    }

    await this.eventBus.emit('email.subscriber.unsubscribed', {
      listId: data.listId,
      email: data.email,
      reason: data.reason,
      globalUnsubscribe: data.globalUnsubscribe
    });
  }

  /**
   * Import subscribers in bulk
   */
  async importSubscribers(
    tenantId: string,
    listId: string,
    data: ImportSubscribersDTO
  ): Promise<{
    imported: number;
    updated: number;
    failed: number;
    errors: Array<{ email: string; error: string }>;
  }> {
    const list = await this.getList(tenantId, listId);

    if (!list) {
      throw new AppError('List not found', 404);
    }

    const results = {
      imported: 0,
      updated: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>
    };

    // Parse CSV if provided
    let subscribers = data.subscribers;
    if (data.csvContent) {
      const parsed = parseCSV(data.csvContent, {
        header: true,
        skipEmptyLines: true
      });

      if (parsed.errors.length > 0) {
        throw new AppError('Invalid CSV format', 400);
      }

      subscribers = parsed.data as any[];
    }

    // Process in batches
    const batchSize = 100;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (sub) => {
          try {
            const existing = await this.prisma.emailListSubscriber.findUnique({
              where: {
                listId_email: {
                  listId,
                  email: sub.email.toLowerCase()
                }
              }
            });

            if (existing) {
              if (data.updateExisting) {
                await this.prisma.emailListSubscriber.update({
                  where: { id: existing.id },
                  data: {
                    firstName: sub.firstName || existing.firstName,
                    lastName: sub.lastName || existing.lastName,
                    customData: {
                      ...existing.customData as object,
                      ...sub.customData
                    },
                    tags: [...new Set([...existing.tags, ...(sub.tags || [])])]
                  }
                });
                results.updated++;
              }
            } else {
              await this.subscribe(listId, {
                email: sub.email,
                firstName: sub.firstName,
                lastName: sub.lastName,
                customData: sub.customData,
                tags: sub.tags
              }, 'import');
              results.imported++;
            }
          } catch (error: any) {
            results.failed++;
            results.errors.push({
              email: sub.email,
              error: error.message
            });
          }
        })
      );
    }

    await this.eventBus.emit('email.subscribers.imported', {
      tenantId,
      listId,
      imported: results.imported,
      updated: results.updated,
      failed: results.failed
    });

    return results;
  }

  /**
   * Update subscriber data
   */
  async updateSubscriber(
    subscriberId: string,
    data: UpdateSubscriberDTO
  ): Promise<EmailListSubscriber> {
    const subscriber = await this.prisma.emailListSubscriber.update({
      where: { id: subscriberId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        customData: data.customData,
        tags: data.tags
      }
    });

    await this.eventBus.emit('email.subscriber.updated', {
      subscriberId,
      changes: data
    });

    return subscriber;
  }

  /**
   * Clean list by removing inactive subscribers
   */
  async cleanList(
    tenantId: string,
    listId: string,
    options: {
      removeUnconfirmed?: boolean;
      removeInactive?: boolean;
      inactiveDays?: number;
      removeBounced?: boolean;
    }
  ): Promise<{
    removed: number;
    archived: number;
  }> {
    const list = await this.getList(tenantId, listId);

    if (!list) {
      throw new AppError('List not found', 404);
    }

    const conditions: Prisma.EmailListSubscriberWhereInput[] = [];

    if (options.removeUnconfirmed) {
      conditions.push({
        confirmed: false,
        subscribedAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });
    }

    if (options.removeInactive) {
      const inactiveDays = options.inactiveDays || 180;
      conditions.push({
        lastEngagedAt: {
          lt: new Date(Date.now() - inactiveDays * 24 * 60 * 60 * 1000)
        }
      });
    }

    if (options.removeBounced) {
      // Find bounced emails
      const bouncedEmails = await this.prisma.emailCampaignRecipient.findMany({
        where: {
          status: 'BOUNCED',
          campaign: {
            listId
          }
        },
        select: {
          subscriber: {
            select: { id: true }
          }
        },
        distinct: ['subscriberId']
      });

      if (bouncedEmails.length > 0) {
        conditions.push({
          id: {
            in: bouncedEmails.map(b => b.subscriber.id)
          }
        });
      }
    }

    if (conditions.length === 0) {
      return { removed: 0, archived: 0 };
    }

    // Archive subscribers
    const archived = await this.prisma.emailListSubscriber.updateMany({
      where: {
        listId,
        OR: conditions
      },
      data: {
        subscribed: false,
        unsubscribedAt: new Date()
      }
    });

    await this.invalidateListCache(listId);

    await this.eventBus.emit('email.list.cleaned', {
      tenantId,
      listId,
      removed: 0,
      archived: archived.count
    });

    return {
      removed: 0,
      archived: archived.count
    };
  }

  /**
   * Send confirmation email
   */
  private async sendConfirmationEmail(
    list: EmailList,
    subscriber: EmailListSubscriber
  ): Promise<void> {
    const confirmationUrl = `${process.env.APP_URL}/email/confirm/${subscriber.confirmationToken}`;

    await this.emailService.send({
      to: subscriber.email,
      subject: `Please confirm your subscription to ${list.name}`,
      html: `
        <h2>Confirm Your Subscription</h2>
        <p>Hi ${subscriber.firstName || 'there'},</p>
        <p>Please confirm your subscription to ${list.name} by clicking the link below:</p>
        <p><a href="${confirmationUrl}">Confirm Subscription</a></p>
        <p>If you didn't subscribe to this list, you can ignore this email.</p>
      `,
      text: `Please confirm your subscription to ${list.name} by visiting: ${confirmationUrl}`
    });
  }

  /**
   * Send welcome email
   */
  private async sendWelcomeEmail(
    list: EmailList,
    subscriber: EmailListSubscriber
  ): Promise<void> {
    // This would integrate with the campaign service to send the welcome email
    logger.info('Welcome email would be sent', {
      listId: list.id,
      subscriberId: subscriber.id,
      welcomeEmailId: list.welcomeEmailId
    });
  }

  /**
   * Resubscribe a previously unsubscribed email
   */
  private async resubscribe(subscriberId: string): Promise<EmailListSubscriber> {
    return this.prisma.emailListSubscriber.update({
      where: { id: subscriberId },
      data: {
        subscribed: true,
        subscribedAt: new Date(),
        unsubscribedAt: null
      }
    });
  }

  /**
   * Global unsubscribe from all lists
   */
  private async globalUnsubscribe(email: string): Promise<void> {
    await this.prisma.emailListSubscriber.updateMany({
      where: {
        email: email.toLowerCase(),
        subscribed: true
      },
      data: {
        subscribed: false,
        unsubscribedAt: new Date()
      }
    });
  }

  /**
   * Invalidate list cache
   */
  private async invalidateListCache(listId: string): Promise<void> {
    await this.redis.delete(`email-list:${listId}`);
  }
}