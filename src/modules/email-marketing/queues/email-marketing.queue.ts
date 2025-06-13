// Queue processor for email marketing background jobs

import { Injectable } from '@/shared/decorators';
import { QueueService } from '@/shared/queue/queue.service';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { EmailDeliveryService } from '../services/email-delivery.service';
import { EmailCampaignService } from '../services/email-campaign.service';
import { EmailAutomationService } from '../services/email-automation.service';
import { EmailAnalyticsService } from '../services/email-analytics.service';
import { ABTestingService } from '../services/ab-testing.service';
import { EventBus } from '@/shared/events/event-bus';
import { logger } from '@/shared/logger';
import { Job } from 'bull';
import { Container } from 'typedi';
import {
  EmailCampaignStatus,
  EmailDeliveryStatus
} from '@prisma/client';

export interface CampaignSendJob {
  campaignId: string;
  tenantId: string;
}

export interface CampaignProcessJob {
  campaignId: string;
  tenantId: string;
  batchSize?: number;
  delayBetweenBatches?: number;
  resumeFrom?: boolean;
}

export interface AutomationStepJob {
  enrollmentId: string;
  stepId: string;
}

export interface CampaignStatsUpdateJob {
  campaignId: string;
}

export interface ListCleanupJob {
  listId: string;
  tenantId: string;
  options: any;
}

export interface ABTestWinnerJob {
  campaignId: string;
  config: any;
}

@Injectable()
export class EmailMarketingQueue {
  constructor(
    private readonly queue: QueueService,
    private readonly prisma: PrismaService,
    private readonly delivery: EmailDeliveryService,
    private readonly campaigns: EmailCampaignService,
    private readonly automations: EmailAutomationService,
    private readonly analytics: EmailAnalyticsService,
    private readonly abTesting: ABTestingService,
    private readonly eventBus: EventBus
  ) {}

  /**
   * Initialize queue processors
   */
  async initialize(): Promise<void> {
    // Campaign send job (triggered by schedule)
    this.queue.process('email:campaign:send', async (job) => {
      return this.processCampaignSend(job as unknown as Job<CampaignSendJob>);
    });

    // Campaign processing (actual sending)
    this.queue.process('email:campaign:process', 5, async (job) => {
      return this.processCampaign(job as unknown as Job<CampaignProcessJob>);
    });

    // Automation step execution
    this.queue.process('email:automation:step', 10, async (job) => {
      return this.processAutomationStep(job as unknown as Job<AutomationStepJob>);
    });

    // Update campaign statistics
    this.queue.process('email:stats:update', async (job) => {
      return this.updateCampaignStats(job as unknown as Job<CampaignStatsUpdateJob>);
    });

    // List cleanup
    this.queue.process('email:list:cleanup', async (job) => {
      return this.processListCleanup(job as unknown as Job<ListCleanupJob>);
    });

    // A/B test winner determination
    this.queue.process('email:abtest:winner', async (job) => {
      return this.determineABTestWinner(job as unknown as Job<ABTestWinnerJob>);
    });

    // Set up recurring jobs
    await this.setupRecurringJobs();

    logger.info('Email marketing queue initialized');
  }

  /**
   * Process campaign send (initialize sending)
   */
  private async processCampaignSend(job: Job<CampaignSendJob>): Promise<void> {
    const { campaignId, tenantId } = job.data;

    try {
      logger.info('Starting campaign send', { campaignId });

      // Send the campaign
      await this.campaigns.sendCampaign(tenantId, campaignId);

      // Log success
      await this.eventBus.emit('email.campaign.send.started', {
        campaignId,
        tenantId,
        jobId: job.id
      });
    } catch (error) {
      logger.error('Failed to start campaign send', {
        campaignId,
        error
      });

      // Update campaign status
      await this.prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: { status: EmailCampaignStatus.FAILED }
      });

      throw error;
    }
  }

  /**
   * Process campaign (send emails in batches)
   */
  private async processCampaign(job: Job<CampaignProcessJob>): Promise<void> {
    const { campaignId, batchSize = 100, delayBetweenBatches = 1000 } = job.data;

    try {
      const campaign = await this.prisma.client.emailCampaign.findUnique({
        where: { id: campaignId },
        include: { abTestVariants: true }
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Check if paused
      if (campaign.status === EmailCampaignStatus.PAUSED) {
        logger.info('Campaign is paused, stopping processing', { campaignId });
        return;
      }

      // Get pending recipients
      const recipients = await this.prisma.client.emailCampaignRecipient.findMany({
        where: {
          campaignId,
          status: EmailDeliveryStatus.PENDING
        },
        select: { id: true },
        take: batchSize
      });

      if (recipients.length === 0) {
        // All emails sent, finalize campaign
        await this.finalizeCampaign(campaignId);
        return;
      }

      // For A/B tests, check if we need to determine winner first
      if (campaign.isABTest && !campaign.winningVariantId) {
        const shouldDetermineWinner = await this.checkABTestProgress(campaign);
        if (shouldDetermineWinner) {
          await this.queue.add('email:abtest:winner', {
            campaignId,
            config: campaign.abTestConfig
          });
          return;
        }
      }

      // Send batch
      const recipientIds = recipients.map(r => r.id);
      const results = await this.delivery.sendCampaignBatch(
        campaignId,
        recipientIds,
        { batchSize: 10, delayBetweenBatches: 100 }
      );

      // Update job progress
      const progress = await this.calculateCampaignProgress(campaignId);
      await job.progress(progress);

      // Log batch completion
      logger.info('Campaign batch processed', {
        campaignId,
        sent: results.sent,
        failed: results.failed,
        progress
      });

      // Queue next batch
      if (progress < 100) {
        await this.queue.add(
          'email:campaign:process',
          {
            ...job.data,
            resumeFrom: true
          },
          {
            delay: delayBetweenBatches,
            removeOnComplete: true,
            removeOnFail: false
          }
        );
      }

      // Update stats periodically
      if (results.sent > 0 && results.sent % 1000 === 0) {
        await this.queue.add('email:stats:update', { campaignId });
      }
    } catch (error) {
      logger.error('Failed to process campaign batch', {
        campaignId,
        error
      });

      // Update campaign status on critical errors
      if (job.attemptsMade >= 3) {
        await this.prisma.client.emailCampaign.update({
          where: { id: campaignId },
          data: { status: EmailCampaignStatus.FAILED }
        });
      }

      throw error;
    }
  }

  /**
   * Process automation step
   */
  private async processAutomationStep(job: Job<AutomationStepJob>): Promise<void> {
    const { enrollmentId, stepId } = job.data;

    try {
      await this.automations.executeStep(enrollmentId, stepId);

      logger.info('Automation step executed', {
        enrollmentId,
        stepId
      });
    } catch (error) {
      logger.error('Failed to execute automation step', {
        enrollmentId,
        stepId,
        error
      });

      // Cancel enrollment on repeated failures
      if (job.attemptsMade >= 3) {
        await this.automations.cancelEnrollment(enrollmentId);
      }

      throw error;
    }
  }

  /**
   * Update campaign statistics
   */
  private async updateCampaignStats(job: Job<CampaignStatsUpdateJob>): Promise<void> {
    const { campaignId } = job.data;

    try {
      await this.analytics.updateCampaignStats(campaignId);

      logger.info('Campaign stats updated', { campaignId });
    } catch (error) {
      logger.error('Failed to update campaign stats', {
        campaignId,
        error
      });
      throw error;
    }
  }

  /**
   * Process list cleanup
   */
  private async processListCleanup(job: Job<ListCleanupJob>): Promise<void> {
    const { listId, tenantId, options } = job.data;

    try {
      const emailListService = await import('../services/email-list.service').then(m => m.EmailListService);
      const listService = new emailListService(
        this.prisma,
        this.eventBus,
        Container.get(RedisService), // Get RedisService from Container
        {} as any // EmailService would be injected properly
      );

      const result = await listService.cleanList(tenantId, listId, options);

      logger.info('List cleanup completed', {
        listId,
        removed: result.removed,
        archived: result.archived
      });
    } catch (error) {
      logger.error('Failed to clean list', {
        listId,
        error
      });
      throw error;
    }
  }

  /**
   * Determine A/B test winner
   */
  private async determineABTestWinner(job: Job<ABTestWinnerJob>): Promise<void> {
    const { campaignId, config } = job.data;

    try {
      const winner = await this.abTesting.determineWinner(campaignId, config);

      if (winner) {
        // Send to control group with winning variant
        await this.abTesting.sendToControlGroup(campaignId);

        // Continue campaign processing
        await this.queue.add('email:campaign:process', {
          campaignId,
          tenantId: '', // Would be retrieved from campaign
          resumeFrom: true
        });
      } else {
        // Check again later
        await this.queue.add(
          'email:abtest:winner',
          job.data,
          {
            delay: 3600000 // 1 hour
          }
        );
      }
    } catch (error) {
      logger.error('Failed to determine A/B test winner', {
        campaignId,
        error
      });
      throw error;
    }
  }

  /**
   * Finalize campaign
   */
  private async finalizeCampaign(campaignId: string): Promise<void> {
    await this.prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: EmailCampaignStatus.SENT,
        completedAt: new Date()
      }
    });

    // Final stats update
    await this.analytics.updateCampaignStats(campaignId);

    await this.eventBus.emit('email.campaign.completed', {
      campaignId,
      completedAt: new Date()
    });

    logger.info('Campaign completed', { campaignId });
  }

  /**
   * Calculate campaign progress
   */
  private async calculateCampaignProgress(campaignId: string): Promise<number> {
    const [total, sent] = await Promise.all([
      this.prisma.client.emailCampaignRecipient.count({
        where: { campaignId }
      }),
      this.prisma.client.emailCampaignRecipient.count({
        where: {
          campaignId,
          status: { not: EmailDeliveryStatus.PENDING }
        }
      })
    ]);

    return total > 0 ? Math.round((sent / total) * 100) : 0;
  }

  /**
   * Check if A/B test should determine winner
   */
  private async checkABTestProgress(campaign: any): Promise<boolean> {
    if (!campaign.abTestConfig) {
      return false;
    }

    const config = campaign.abTestConfig as any;
    const testPercentage = config.testPercentage || 20;

    // Check if test group has been sent
    const [total, sent] = await Promise.all([
      this.prisma.client.emailCampaignRecipient.count({
        where: { campaignId: campaign.id }
      }),
      this.prisma.client.emailCampaignRecipient.count({
        where: {
          campaignId: campaign.id,
          status: { not: EmailDeliveryStatus.PENDING },
          metadata: {
            path: ['variantId'],
            not: null
          }
        }
      })
    ]);

    const testGroupSize = Math.floor(total * (testPercentage / 100));

    return sent >= testGroupSize;
  }

  /**
   * Setup recurring jobs
   */
  private async setupRecurringJobs(): Promise<void> {
    // Schedule hourly stats updates for active campaigns
    this.queue.add(
      'email:stats:refresh',
      {},
      {
        repeat: {
          cron: '0 * * * *' // Every hour
        }
      }
    );

    // Process this recurring job
    this.queue.process('email:stats:refresh', async () => {
      const activeCampaigns = await this.prisma.client.emailCampaign.findMany({
        where: {
          status: EmailCampaignStatus.SENDING
        },
        select: { id: true }
      });

      for (const campaign of activeCampaigns) {
        await this.queue.add('email:stats:update', {
          campaignId: campaign.id
        });
      }
    });

    // Schedule daily list maintenance
    this.queue.add(
      'email:lists:maintenance',
      {},
      {
        repeat: {
          cron: '0 2 * * *' // 2 AM daily
        }
      }
    );

    // Process list maintenance
    this.queue.process('email:lists:maintenance', async () => {
      // Update engagement scores
      await this.prisma.client.$executeRaw`
        UPDATE email_list_subscribers
        SET engagement_score = GREATEST(0, engagement_score - 1)
        WHERE last_engaged_at < NOW() - INTERVAL '30 days'
          AND engagement_score > 0
      `;

      logger.info('Daily list maintenance completed');
    });
  }
}
