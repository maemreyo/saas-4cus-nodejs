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
import { TemplateService } from './template.service';
import { SegmentationService } from './segmentation.service';
import { nanoid } from 'nanoid';

@Service()
export class CampaignService {
  constructor(
    private tenantContext: TenantContextService,
    private emailService: EmailService,
    private templateService: TemplateService,
    private segmentationService: SegmentationService
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

      // Validate template if provided
      if (data.templateId) {
        await this.templateService.findById(data.templateId);
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
          isABTest: data.isABTest ?? false,
          abTestConfig: data.abTestConfig,
          metadata: data.metadata
        }
      });

      // Create campaign stats
      await prisma.client.emailCampaignStats.create({
        data: {
          id: nanoid(),
          campaignId: campaign.id
        }
      });

      // Create A/B test variants if configured
      if (data.isABTest && data.abTestConfig) {
        await this.createABTestVariants(campaign.id, data.abTestConfig);
      }

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_CREATED, {
        campaignId: campaign.id,
        tenantId
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

    if (campaign.status !== EmailCampaignStatus.DRAFT) {
      throw new BadRequestException('Can only update draft campaigns');
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
          templateId: data.templateId,
          htmlContent: data.htmlContent,
          textContent: data.textContent,
          segmentIds: data.segmentIds,
          excludeSegmentIds: data.excludeSegmentIds,
          trackOpens: data.trackOpens,
          trackClicks: data.trackClicks,
          googleAnalytics: data.googleAnalytics,
          utmParams: data.utmParams,
          metadata: data.metadata
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
      throw new BadRequestException('Can only schedule draft campaigns');
    }

    if (scheduledAt <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Validate campaign has recipients
    const recipientCount = await this.calculateRecipients(campaign);
    if (recipientCount === 0) {
      throw new BadRequestException('Campaign has no recipients');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: EmailCampaignStatus.SCHEDULED,
          scheduledAt
        }
      });

      // Schedule job
      await queueService.addJob(
        'email-marketing',
        'send-campaign',
        { campaignId },
        {
          delay: scheduledAt.getTime() - Date.now()
        }
      );

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_SCHEDULED, {
        campaignId: updated.id,
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
   * Send campaign
   */
  async send(campaignId: string, options?: SendCampaignDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    if (!['DRAFT', 'SCHEDULED'].includes(campaign.status)) {
      throw new BadRequestException('Campaign cannot be sent in current status');
    }

    try {
      // Update status
      await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: EmailCampaignStatus.SENDING,
          sentAt: new Date()
        }
      });

      // Queue sending job
      await queueService.addJob(
        'email-marketing',
        'process-campaign-send',
        {
          campaignId,
          testMode: options?.testMode,
          testEmails: options?.testEmails
        },
        {
          priority: 1
        }
      );

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_SENDING, {
        campaignId,
        tenantId
      });

      logger.info('Campaign sending started', { campaignId });

      return { message: 'Campaign sending started' };
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
      throw new BadRequestException('Can only pause sending campaigns');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: EmailCampaignStatus.PAUSED
        }
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
      throw new BadRequestException('Can only resume paused campaigns');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: EmailCampaignStatus.SENDING
        }
      });

      // Queue resume job
      await queueService.addJob(
        'email-marketing',
        'resume-campaign-send',
        { campaignId }
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

    if (!['SCHEDULED', 'SENDING', 'PAUSED'].includes(campaign.status)) {
      throw new BadRequestException('Campaign cannot be cancelled in current status');
    }

    try {
      const updated = await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: EmailCampaignStatus.CANCELLED
        }
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
      throw new BadRequestException('Cannot delete sending campaigns');
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
   * Get campaign by ID
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
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    // Get detailed stats
    const stats = await prisma.client.emailCampaignStats.findUnique({
      where: { campaignId }
    });

    if (!stats) {
      throw new NotFoundException('Campaign stats not found');
    }

    // Get recipient status breakdown
    const recipientStats = await prisma.client.emailCampaignRecipient.groupBy({
      by: ['status'],
      where: { campaignId },
      _count: true
    });

    // Get top clicked links
    const topLinks = await prisma.client.emailActivity.groupBy({
      by: ['clickedUrl'],
      where: {
        campaignId,
        type: 'clicked',
        clickedUrl: { not: null }
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
      }, {} as Record<EmailDeliveryStatus, number>),
      topClickedLinks: topLinks.map(link => ({
        url: link.clickedUrl!,
        clicks: link._count
      }))
    };
  }

  /**
   * Clone campaign
   */
  async clone(campaignId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    const clonedData = {
      ...campaign,
      id: undefined,
      name: `${campaign.name} (Copy)`,
      status: EmailCampaignStatus.DRAFT,
      scheduledAt: null,
      sentAt: null,
      completedAt: null,
      createdAt: undefined,
      updatedAt: undefined
    };

    return this.create(clonedData);
  }

  /**
   * Calculate campaign recipients
   */
  private async calculateRecipients(campaign: any): Promise<number> {
    let where: Prisma.EmailListSubscriberWhereInput = {
      listId: campaign.listId,
      subscribed: true,
      confirmed: true
    };

    // Apply segment filters
    if (campaign.segmentIds.length > 0) {
      const segmentConditions = await this.segmentationService.getSegmentConditions(
        campaign.segmentIds
      );
      where = { ...where, ...segmentConditions };
    }

    // Apply exclusion segments
    if (campaign.excludeSegmentIds.length > 0) {
      const excludeConditions = await this.segmentationService.getSegmentConditions(
        campaign.excludeSegmentIds
      );
      where = {
        ...where,
        NOT: excludeConditions
      };
    }

    return prisma.client.emailListSubscriber.count({ where });
  }

  /**
   * Create A/B test variants
   */
  private async createABTestVariants(
    campaignId: string,
    config: ABTestConfigDto
  ): Promise<void> {
    for (const variant of config.variants) {
      await prisma.client.emailABTestVariant.create({
        data: {
          campaignId,
          name: variant.name,
          weight: variant.weight,
          subject: variant.subject,
          fromName: variant.fromName
        }
      });
    }
  }

  /**
   * Select A/B test winner
   */
  async selectABTestWinner(campaignId: string, variantId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const campaign = await this.findById(campaignId);

    if (!campaign.isABTest) {
      throw new BadRequestException('Campaign is not an A/B test');
    }

    // Update winning variant
    await prisma.client.emailABTestVariant.update({
      where: { id: variantId },
      data: { isWinner: true }
    });

    // Update campaign
    const updated = await prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: { winningVariantId: variantId }
    });

    await eventBus.emit(EmailMarketingEvents.CAMPAIGN_AB_TEST_WINNER_SELECTED, {
      campaignId,
      variantId,
      tenantId
    });

    return updated;
  }
}
