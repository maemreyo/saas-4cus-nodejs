// Service for managing email campaigns

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { QueueService } from '@/shared/queue/queue.service';
import { AppError } from '@/shared/exceptions';
import { logger } from '@/shared/logger';
import {
  EmailCampaign,
  EmailCampaignStatus,
  EmailCampaignType,
  EmailCampaignRecipient,
  EmailDeliveryStatus,
  Prisma,
} from '@prisma/client';
import {
  CreateCampaignDTO,
  UpdateCampaignDTO,
  ScheduleCampaignDTO,
  CampaignFiltersDTO,
  SendCampaignDTO,
} from '../dto/email-campaign.dto';
import { EmailSegmentService } from './email-segment.service';
import { EmailDeliveryService } from './email-delivery.service';
import { ABTestingService } from './ab-testing.service';

export interface CampaignWithStats extends EmailCampaign {
  stats?: any;
  recipients?: any;
}

@Injectable()
export class EmailCampaignService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly redis: RedisService,
    private readonly queue: QueueService,
    private readonly segmentService: EmailSegmentService,
    private readonly deliveryService: EmailDeliveryService,
    private readonly abTestingService: ABTestingService,
  ) {}

  /**
   * Create a new campaign
   */
  async createCampaign(tenantId: string, data: CreateCampaignDTO): Promise<EmailCampaign> {
    // Validate list exists
    if (data.listId) {
      const list = await this.prisma.client.emailList.findFirst({
        where: {
          id: data.listId,
          tenantId,
          deletedAt: null,
        },
      });

      if (!list) {
        throw new AppError('Email list not found', 404);
      }
    }

    // Validate template exists
    if (data.templateId) {
      const template = await this.prisma.client.emailTemplate.findFirst({
        where: {
          id: data.templateId,
          OR: [{ tenantId }, { isPublic: true }],
        },
      });

      if (!template) {
        throw new AppError('Email template not found', 404);
      }

      // Use template content if not provided
      if (!data.htmlContent) {
        data.htmlContent = template.htmlContent;
        data.textContent = template.textContent;
        data.subject = data.subject || template.subject;
        data.preheader = data.preheader || template.preheader;
      }
    }

    const campaign = await this.prisma.client.emailCampaign.create({
      data: {
        tenantId,
        listId: data.listId,
        name: data.name,
        subject: data.subject,
        preheader: data.preheader,
        fromName: data.fromName,
        fromEmail: data.fromEmail,
        replyTo: data.replyTo,
        type: data.type || EmailCampaignType.REGULAR,
        status: EmailCampaignStatus.DRAFT,
        templateId: data.templateId,
        htmlContent: data.htmlContent,
        textContent: data.textContent,
        segmentIds: data.segmentIds || [],
        excludeSegmentIds: data.excludeSegmentIds || [],
        trackOpens: data.trackOpens ?? true,
        trackClicks: data.trackClicks ?? true,
        googleAnalytics: data.googleAnalytics ?? false,
        utmParams: data.utmParams,
        isABTest: data.isABTest ?? false,
        abTestConfig: data.abTestConfig,
        metadata: data.metadata,
      },
    });

    // Create campaign stats record
    await this.prisma.client.emailCampaignStats.create({
      data: {
        id: `stats_${campaign.id}`,
        campaignId: campaign.id,
      },
    });

    // Create A/B test variants if configured
    if (data.isABTest && data.abTestConfig?.variants) {
      // Ensure variants have required properties
      const validVariants = data.abTestConfig.variants.map(variant => ({
        name: variant.name || 'Untitled Variant',
        weight: variant.weight || 50,
        subject: variant.subject,
        fromName: variant.fromName,
        preheader: undefined, // Remove preheader as it doesn't exist in the variant type
        htmlContent: variant.content || undefined, // Map content to htmlContent
        textContent: undefined
      }));
      await this.abTestingService.createVariants(campaign.id, validVariants);
    }

    await this.eventBus.emit('email.campaign.created', {
      tenantId,
      campaignId: campaign.id,
      name: campaign.name,
      type: campaign.type,
    });

    logger.info('Email campaign created', {
      tenantId,
      campaignId: campaign.id,
    });

    return campaign;
  }

  /**
   * Update a campaign
   */
  async updateCampaign(tenantId: string, campaignId: string, data: UpdateCampaignDTO): Promise<EmailCampaign> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    if (campaign.status !== EmailCampaignStatus.DRAFT) {
      throw new AppError('Cannot update campaign after sending', 400);
    }

    const updated = await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    await this.invalidateCampaignCache(campaignId);

    await this.eventBus.emit('email.campaign.updated', {
      tenantId,
      campaignId,
      changes: data,
    });

    return updated;
  }

  /**
   * Get campaign with stats
   */
  async getCampaign(tenantId: string, campaignId: string): Promise<CampaignWithStats> {
    const cacheKey = `email-campaign:${campaignId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const campaign = await this.prisma.client.emailCampaign.findFirst({
      where: {
        id: campaignId,
        tenantId,
      },
      include: {
        stats: true,
        list: true,
        template: true,
        abTestVariants: true,
        _count: {
          select: {
            recipients: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    await this.redis.set(cacheKey, campaign, { ttl: 300 });

    return campaign;
  }

  /**
   * Get campaigns with pagination and filtering
   */
  async getCampaigns(
    tenantId: string,
    filters: CampaignFiltersDTO,
  ): Promise<{
    campaigns: CampaignWithStats[];
    total: number;
    page: number;
    pages: number;
  }> {
    return this.listCampaigns(tenantId, filters);
  }

  /**
   * List campaigns with filters
   * @private
   */
  private async listCampaigns(
    tenantId: string,
    filters: CampaignFiltersDTO,
  ): Promise<{
    campaigns: CampaignWithStats[];
    total: number;
    page: number;
    pages: number;
  }> {
    const where: Prisma.EmailCampaignWhereInput = {
      tenantId,
      ...(filters.status && { status: filters.status }),
      ...(filters.type && { type: filters.type }),
      ...(filters.listId && { listId: filters.listId }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { subject: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...(filters.dateFrom || filters.dateTo
        ? {
            createdAt: {
              ...(filters.dateFrom && { gte: filters.dateFrom }),
              ...(filters.dateTo && { lte: filters.dateTo }),
            },
          }
        : {}),
    };

    const [campaigns, total] = await Promise.all([
      this.prisma.client.emailCampaign.findMany({
        where,
        include: {
          stats: true,
          _count: {
            select: {
              recipients: true,
            },
          },
        },
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      this.prisma.client.emailCampaign.count({ where }),
    ]);

    return {
      campaigns,
      total,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    };
  }

  /**
   * Schedule a campaign
   */
  async scheduleCampaign(tenantId: string, campaignId: string, data: ScheduleCampaignDTO): Promise<EmailCampaign> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    if (campaign.status !== EmailCampaignStatus.DRAFT) {
      throw new AppError('Campaign must be in draft status to schedule', 400);
    }

    // Validate schedule date
    if (data.scheduledAt <= new Date()) {
      throw new AppError('Schedule date must be in the future', 400);
    }

    const updated = await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        scheduledAt: data.scheduledAt,
        status: EmailCampaignStatus.SCHEDULED,
      },
    });

    // Schedule the send job
    await this.queue.add(
      'email:campaign:send',
      {
        campaignId,
        tenantId,
      },
      {
        delay: data.scheduledAt.getTime() - Date.now(),
        jobId: `campaign_${campaignId}_scheduled`,
      },
    );

    await this.eventBus.emit('email.campaign.scheduled', {
      tenantId,
      campaignId,
      scheduledAt: data.scheduledAt,
    });

    logger.info('Campaign scheduled', {
      campaignId,
      scheduledAt: data.scheduledAt,
    });

    return updated;
  }

  /**
   * Send a campaign
   */
  async sendCampaign(tenantId: string, campaignId: string, options?: SendCampaignDTO): Promise<{ success: boolean; recipientCount: number }> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    if (campaign.status === EmailCampaignStatus.SENT) {
      throw new AppError('Campaign has already been sent', 400);
    }

    if (campaign.status === EmailCampaignStatus.SENDING) {
      throw new AppError('Campaign is currently being sent', 400);
    }

    // Update campaign status
    await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: EmailCampaignStatus.SENDING,
        sentAt: new Date(),
      },
    });

    try {
      // Get recipients
      const recipients = await this.getRecipients(campaign, options);

      if (recipients.length === 0) {
        throw new AppError('No recipients found for campaign', 400);
      }

      // Create recipient records
      await this.createRecipientRecords(campaignId, recipients);

      // Queue campaign for processing
      await this.queue.add(
        'email:campaign:process',
        {
          campaignId,
          tenantId,
          batchSize: options?.batchSize || 100,
          delayBetweenBatches: options?.delayBetweenBatches || 1000,
        },
        {
          removeOnComplete: false,
          removeOnFail: false,
        },
      );

      await this.eventBus.emit('email.campaign.sending', {
        tenantId,
        campaignId,
        recipientCount: recipients.length,
      });

      logger.info('Campaign send initiated', {
        campaignId,
        recipients: recipients.length,
      });

      return {
        success: true,
        recipientCount: recipients.length
      };
    } catch (error) {
      // Revert status on error
      await this.prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: EmailCampaignStatus.DRAFT,
          sentAt: null,
        },
      });
      throw error;
    }
  }

  /**
   * Pause a sending campaign
   */
  async pauseCampaign(tenantId: string, campaignId: string): Promise<EmailCampaign> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    if (campaign.status !== EmailCampaignStatus.SENDING) {
      throw new AppError('Can only pause campaigns that are sending', 400);
    }

    const updatedCampaign = await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: EmailCampaignStatus.PAUSED,
      },
    });

    // Remove from queue
    await this.queue.removeJobs('email:campaign:process', {
      campaignId,
    });

    await this.eventBus.emit('email.campaign.paused', {
      tenantId,
      campaignId,
    });

    return updatedCampaign;
  }

  /**
   * Resume a paused campaign
   */
  async resumeCampaign(tenantId: string, campaignId: string): Promise<EmailCampaign> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    if (campaign.status !== EmailCampaignStatus.PAUSED) {
      throw new AppError('Can only resume paused campaigns', 400);
    }

    const updatedCampaign = await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: EmailCampaignStatus.SENDING,
      },
    });

    // Re-queue for processing
    await this.queue.add('email:campaign:process', {
      campaignId,
      tenantId,
      resumeFrom: true,
    });

    await this.eventBus.emit('email.campaign.resumed', {
      tenantId,
      campaignId,
    });

    return updatedCampaign;
  }

  /**
   * Cancel a campaign
   */
  async cancelCampaign(tenantId: string, campaignId: string): Promise<void> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    if (campaign.status === EmailCampaignStatus.SENT) {
      throw new AppError('Cannot cancel completed campaigns', 400);
    }

    await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: EmailCampaignStatus.CANCELLED,
      },
    });

    // Remove from queue
    await this.queue.removeJobs('email:campaign:send', {
      campaignId,
    });
    await this.queue.removeJobs('email:campaign:process', {
      campaignId,
    });

    await this.eventBus.emit('email.campaign.cancelled', {
      tenantId,
      campaignId,
    });
  }

  /**
   * Duplicate a campaign
   */
  async duplicateCampaign(tenantId: string, campaignId: string, name?: string): Promise<EmailCampaign> {
    const original = await this.getCampaign(tenantId, campaignId);

    const { id, createdAt, updatedAt, sentAt, completedAt, status, stats, ...campaignData } = original;

    // Create a clean copy of campaign data without status
    const cleanCampaignData = { ...campaignData };

    // Convert metadata to Record<string, any> if needed
    const metadata = cleanCampaignData.metadata ?
      (typeof cleanCampaignData.metadata === 'string' ?
        JSON.parse(cleanCampaignData.metadata) : cleanCampaignData.metadata) :
      {};

    // Convert utmParams to Record<string, any> if needed
    const utmParams = cleanCampaignData.utmParams ?
      (typeof cleanCampaignData.utmParams === 'string' ?
        JSON.parse(cleanCampaignData.utmParams) : cleanCampaignData.utmParams) :
      {};

    // Convert abTestConfig to proper format if needed
    const abTestConfig = cleanCampaignData.abTestConfig ?
      (typeof cleanCampaignData.abTestConfig === 'string' ?
        JSON.parse(cleanCampaignData.abTestConfig) : cleanCampaignData.abTestConfig) :
      undefined;

    const duplicate = await this.createCampaign(tenantId, {
      ...cleanCampaignData,
      metadata,
      utmParams,
      abTestConfig,
      name: name || `${original.name} (Copy)`,
      // status will be set to DRAFT in createCampaign
    });

    await this.eventBus.emit('email.campaign.duplicated', {
      tenantId,
      originalId: campaignId,
      duplicateId: duplicate.id,
    });

    return duplicate;
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(tenantId: string, campaignId: string): Promise<void> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    if (campaign.status === EmailCampaignStatus.SENDING) {
      throw new AppError('Cannot delete campaigns that are sending', 400);
    }

    await this.prisma.client.emailCampaign.delete({
      where: { id: campaignId },
    });

    await this.invalidateCampaignCache(campaignId);

    await this.eventBus.emit('email.campaign.deleted', {
      tenantId,
      campaignId,
    });
  }

  /**
   * Get campaign recipients based on segments
   */
  private async getRecipients(
    campaign: EmailCampaign,
    options?: SendCampaignDTO,
  ): Promise<Array<{ id: string; email: string }>> {
    let query: Prisma.EmailListSubscriberWhereInput = {
      listId: campaign.listId!,
      subscribed: true,
      confirmed: true,
    };

    // Apply segment filters
    if (campaign.segmentIds.length > 0) {
      const segmentSubscribers = await this.segmentService.getSegmentSubscribers(campaign.segmentIds);
      query.id = { in: segmentSubscribers };
    }

    // Apply exclusion segments
    if (campaign.excludeSegmentIds.length > 0) {
      const excludeSubscribers = await this.segmentService.getSegmentSubscribers(campaign.excludeSegmentIds);
      // Handle the case where query.id might not be an object
      if (query.id && typeof query.id === 'object') {
        query.id = {
          ...query.id,
          notIn: excludeSubscribers,
        };
      } else {
        query.id = {
          notIn: excludeSubscribers,
        };
      }
    }

    // Apply test mode filter
    if (options?.testMode && options.testEmails) {
      query.email = { in: options.testEmails };
    }

    const subscribers = await this.prisma.client.emailListSubscriber.findMany({
      where: query,
      select: {
        id: true,
        email: true,
      },
      take: options?.limit,
    });

    return subscribers;
  }

  /**
   * Create recipient records for tracking
   */
  private async createRecipientRecords(
    campaignId: string,
    recipients: Array<{ id: string; email: string }>,
  ): Promise<void> {
    const data = recipients.map(recipient => ({
      campaignId,
      subscriberId: recipient.id,
      status: EmailDeliveryStatus.PENDING,
    }));

    // Insert in batches
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await this.prisma.client.emailCampaignRecipient.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }
  }

  /**
   * Invalidate campaign cache
   */
  private async invalidateCampaignCache(campaignId: string): Promise<void> {
    await this.redis.delete(`email-campaign:${campaignId}`);
  }

  /**
   * Preview campaign content with subscriber data
   */
  async previewCampaign(tenantId: string, campaignId: string, subscriberId?: string): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
  }> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    if (subscriberId) {
      // Get subscriber data for personalization
      const subscriber = await this.prisma.client.emailListSubscriber.findUnique({
        where: { id: subscriberId },
      });

      if (!subscriber) {
        throw new AppError('Subscriber not found', 404);
      }

      // Use the delivery service to render the email with subscriber data
      const content = await this.deliveryService.renderEmail(campaign, subscriber);

      return {
        subject: content.subject,
        htmlContent: content.html,
        textContent: content.text || '',
      };
    }

    // No subscriber, just return the raw content
    return {
      subject: campaign.subject,
      htmlContent: campaign.htmlContent,
      textContent: campaign.textContent || '',
    };
  }

  /**
   * Send a test email for a campaign
   */
  async sendTestEmail(
    tenantId: string,
    campaignId: string,
    recipientEmail: string,
    subscriberId?: string
  ): Promise<void> {
    const campaign = await this.getCampaign(tenantId, campaignId);

    // Use the delivery service's sendTestEmail method
    await this.deliveryService.sendTestEmail(campaign, recipientEmail);

    await this.eventBus.emit('email.campaign.test.sent', {
      tenantId,
      campaignId,
      recipientEmail,
    });

    logger.info('Test email sent', {
      campaignId,
      recipientEmail,
    });
  }
}
