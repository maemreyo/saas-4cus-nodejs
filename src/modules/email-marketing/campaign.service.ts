import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { queueService } from '@shared/queue/queue.service';
import { EmailService } from '@shared/services/email.service';
import { TenantContextService } from '@modules/tenant/tenant.context';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@shared/exceptions';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  SendCampaignDto,
  CampaignQueryDto,
  CampaignStatsDto,
  ABTestConfigDto
} from './email-marketing.dto';
import {
  EmailCampaignStatus,
  EmailCampaignType,
  EmailDeliveryStatus,
  Prisma
} from '@prisma/client';
import { EmailMarketingEvents } from './email-marketing.events';
import { nanoid } from 'nanoid';

@Service()
export class CampaignService {
  constructor(
    private tenantContext: TenantContextService,
    private emailService: EmailService
  ) {}

  /**
   * Create a new campaign
   */
  async create(data: CreateCampaignDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    try {
      // Validate list exists if provided
      if (data.listId) {
        const list = await prisma.client.emailList.findFirst({
          where: {
            id: data.listId,
            tenantId,
            deletedAt: null
          }
        });

        if (!list) {
          throw new NotFoundException('Email list not found');
        }
      }

      // Create campaign
      const campaign = await prisma.client.emailCampaign.create({
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
          templateId: data.templateId,
          htmlContent: data.htmlContent || '',
          textContent: data.textContent,
          segmentIds: data.segmentIds || [],
          excludeSegmentIds: data.excludeSegmentIds || [],
          trackOpens: data.trackOpens ?? true,
          trackClicks: data.trackClicks ?? true,
          googleAnalytics: data.googleAnalytics ?? false,
          utmParams: data.utmParams,
          metadata: data.metadata
        },
        include: {
          list: true,
          template: true,
          stats: true
        }
      });

      // Create stats record
      await prisma.client.emailCampaignStats.create({
        data: {
          id: nanoid(),
          campaignId: campaign.id
        }
      });

      // Create A/B test variants if needed
      if (data.isABTest && data.abTestConfig) {
        await this.createABTestVariants(campaign.id, data.abTestConfig);
      }

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_CREATED, {
        campaignId: campaign.id,
        tenantId,
        type: campaign.type
      });

      logger.info('Campaign created', { campaignId: campaign.id, tenantId });

      return campaign;
    } catch (error) {
      logger.error('Failed to create campaign', error as Error);
      throw error;
    }
  }

  /**
   * Update campaign
   */
  async update(campaignId: string, data: UpdateCampaignDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    // Cannot update sent campaigns
    if (campaign.status === EmailCampaignStatus.SENT) {
      throw new BadRequestException('Cannot update sent campaign');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          name: data.name,
          subject: data.subject,
          preheader: data.preheader,
          fromName: data.fromName,
          fromEmail: data.fromEmail,
          replyTo: data.replyTo,
          htmlContent: data.htmlContent,
          textContent: data.textContent,
          segmentIds: data.segmentIds,
          excludeSegmentIds: data.excludeSegmentIds,
          trackOpens: data.trackOpens,
          trackClicks: data.trackClicks,
          googleAnalytics: data.googleAnalytics,
          utmParams: data.utmParams,
          metadata: data.metadata
        },
        include: {
          list: true,
          template: true,
          stats: true
        }
      });

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_UPDATED, {
        campaignId: updated.id,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update campaign', error as Error);
      throw error;
    }
  }

  /**
   * Schedule campaign
   */
  async schedule(campaignId: string, scheduledAt: Date): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    if (campaign.status !== EmailCampaignStatus.DRAFT) {
      throw new BadRequestException('Only draft campaigns can be scheduled');
    }

    if (scheduledAt <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          scheduledAt,
          status: EmailCampaignStatus.SCHEDULED
        }
      });

      // Queue job for scheduled send
      await queueService.addJob(
        'email-marketing',
        'send-campaign',
        { campaignId },
        { delay: scheduledAt.getTime() - Date.now() }
      );

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_SCHEDULED, {
        campaignId,
        tenantId,
        scheduledAt
      });

      logger.info('Campaign scheduled', { campaignId, scheduledAt });

      return updated;
    } catch (error) {
      logger.error('Failed to schedule campaign', error as Error);
      throw error;
    }
  }

  /**
   * Send campaign immediately
   */
  async send(campaignId: string, options?: SendCampaignDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    if (![EmailCampaignStatus.DRAFT, EmailCampaignStatus.SCHEDULED].includes(campaign.status)) {
      throw new BadRequestException('Campaign cannot be sent in current status');
    }

    try {
      // Update campaign status
      await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: EmailCampaignStatus.SENDING,
          sentAt: new Date()
        }
      });

      // Queue campaign send job
      await queueService.addJob(
        'email-marketing',
        'send-campaign',
        {
          campaignId,
          testMode: options?.testMode,
          testEmails: options?.testEmails
        },
        { priority: 1 }
      );

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_SENDING, {
        campaignId,
        tenantId
      });

      logger.info('Campaign send initiated', { campaignId });

      return { message: 'Campaign send initiated' };
    } catch (error) {
      logger.error('Failed to send campaign', error as Error);
      throw error;
    }
  }

  /**
   * Pause campaign
   */
  async pause(campaignId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    if (campaign.status !== EmailCampaignStatus.SENDING) {
      throw new BadRequestException('Only sending campaigns can be paused');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: { status: EmailCampaignStatus.PAUSED }
      });

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_PAUSED, {
        campaignId,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to pause campaign', error as Error);
      throw error;
    }
  }

  /**
   * Resume campaign
   */
  async resume(campaignId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    if (campaign.status !== EmailCampaignStatus.PAUSED) {
      throw new BadRequestException('Only paused campaigns can be resumed');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: { status: EmailCampaignStatus.SENDING }
      });

      // Queue resume job
      await queueService.addJob(
        'email-marketing',
        'resume-campaign',
        { campaignId },
        { priority: 1 }
      );

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_RESUMED, {
        campaignId,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to resume campaign', error as Error);
      throw error;
    }
  }

  /**
   * Cancel campaign
   */
  async cancel(campaignId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    if (![EmailCampaignStatus.SCHEDULED, EmailCampaignStatus.SENDING, EmailCampaignStatus.PAUSED].includes(campaign.status)) {
      throw new BadRequestException('Campaign cannot be cancelled in current status');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: { status: EmailCampaignStatus.CANCELLED }
      });

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_CANCELLED, {
        campaignId,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to cancel campaign', error as Error);
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  async delete(campaignId: string): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    if (campaign.status === EmailCampaignStatus.SENDING) {
      throw new BadRequestException('Cannot delete sending campaign');
    }

    try {
      await prisma.client.emailCampaign.delete({
        where: { id: campaignId }
      });

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_DELETED, {
        campaignId,
        tenantId
      });

      logger.info('Campaign deleted', { campaignId });
    } catch (error) {
      logger.error('Failed to delete campaign', error as Error);
      throw error;
    }
  }

  /**
   * Find campaign by ID
   */
  async findById(campaignId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await prisma.client.emailCampaign.findFirst({
      where: {
        id: campaignId,
        tenantId
      },
      include: {
        list: true,
        template: true,
        stats: true,
        abTestVariants: true
      }
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  /**
   * Find campaigns with filtering
   */
  async find(query: CampaignQueryDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const where: Prisma.EmailCampaignWhereInput = {
      tenantId,
      ...(query.listId && { listId: query.listId }),
      ...(query.status && { status: query.status }),
      ...(query.type && { type: query.type }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { subject: { contains: query.search, mode: 'insensitive' } }
        ]
      })
    };

    const [campaigns, total] = await Promise.all([
      prisma.client.emailCampaign.findMany({
        where,
        include: {
          list: true,
          stats: true
        },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit
      }),
      prisma.client.emailCampaign.count({ where })
    ]);

    return {
      campaigns,
      pagination: {
        total,
        page: Math.floor(query.skip / query.limit) + 1,
        limit: query.limit,
        pages: Math.ceil(total / query.limit)
      }
    };
  }

  /**
   * Get campaign statistics
   */
  async getStats(campaignId: string): Promise<CampaignStatsDto> {
    const campaign = await this.findById(campaignId);

    const stats = await prisma.client.emailCampaignStats.findUnique({
      where: { campaignId }
    });

    if (!stats) {
      throw new NotFoundException('Campaign stats not found');
    }

    // Get detailed recipient stats
    const recipientStats = await prisma.client.emailCampaignRecipient.groupBy({
      by: ['status'],
      where: { campaignId },
      _count: true
    });

    // Get click map
    const clickMap = await prisma.client.emailActivity.groupBy({
      by: ['clickedUrl'],
      where: {
        campaignId,
        type: 'clicked'
      },
      _count: true,
      orderBy: {
        _count: {
          clickedUrl: 'desc'
        }
      },
      take: 10
    });

    return {
      ...stats,
      recipientStats: recipientStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {} as Record<string, number>),
      topClickedLinks: clickMap.map(item => ({
        url: item.clickedUrl!,
        clicks: item._count
      }))
    } as CampaignStatsDto;
  }

  /**
   * Duplicate campaign
   */
  async duplicate(campaignId: string, name?: string): Promise<any> {
    const campaign = await this.findById(campaignId);

    const duplicated = await this.create({
      ...campaign,
      name: name || `${campaign.name} (Copy)`,
      status: EmailCampaignStatus.DRAFT,
      scheduledAt: null,
      sentAt: null,
      completedAt: null
    });

    logger.info('Campaign duplicated', {
      originalId: campaignId,
      duplicatedId: duplicated.id
    });

    return duplicated;
  }

  /**
   * Create A/B test variants
   */
  private async createABTestVariants(
    campaignId: string,
    config: ABTestConfigDto
  ): Promise<void> {
    const variants = config.variants.map(variant => ({
      campaignId,
      name: variant.name,
      weight: variant.weight,
      subject: variant.subject,
      fromName: variant.fromName
    }));

    await prisma.client.emailABTestVariant.createMany({
      data: variants
    });

    // Update campaign as A/B test
    await prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        isABTest: true,
        abTestConfig: config as any
      }
    });
  }

  /**
   * Get recipients for campaign
   */
  async getRecipients(campaignId: string, status?: EmailDeliveryStatus): Promise<any> {
    const campaign = await this.findById(campaignId);

    const where: Prisma.EmailCampaignRecipientWhereInput = {
      campaignId,
      ...(status && { status })
    };

    const recipients = await prisma.client.emailCampaignRecipient.findMany({
      where,
      include: {
        subscriber: true
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return recipients;
  }

  /**
   * Get campaign timeline
   */
  async getTimeline(campaignId: string): Promise<any> {
    const campaign = await this.findById(campaignId);

    const activities = await prisma.client.emailActivity.findMany({
      where: { campaignId },
      include: {
        subscriber: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      subscriber: {
        email: activity.subscriber.email,
        firstName: activity.subscriber.firstName,
        lastName: activity.subscriber.lastName
      },
      clickedUrl: activity.clickedUrl,
      device: activity.device,
      location: activity.location,
      createdAt: activity.createdAt
    }));
  }
}