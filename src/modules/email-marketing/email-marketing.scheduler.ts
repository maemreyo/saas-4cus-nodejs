// New file - Email marketing scheduler for periodic tasks

import { Service } from 'typedi';
import { CronJob } from 'cron';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';
import { eventBus } from '@shared/events/event-bus';
import { EmailMarketingEvents } from './email-marketing.events';
import {
  EmailCampaignStatus,
  EmailAutomationTrigger
} from '@prisma/client';

@Service()
export class EmailMarketingScheduler {
  private jobs: Map<string, CronJob> = new Map();

  constructor() {
    this.initializeJobs();
  }

  /**
   * Initialize scheduled jobs
   */
  private initializeJobs(): void {
    // Update segment counts every hour
    this.addJob('update-segment-counts', '0 * * * *', this.updateSegmentCounts.bind(this));

    // Check scheduled campaigns every minute
    this.addJob('check-scheduled-campaigns', '* * * * *', this.checkScheduledCampaigns.bind(this));

    // Clean up old email activities every day at 2 AM
    this.addJob('cleanup-activities', '0 2 * * *', this.cleanupOldActivities.bind(this));

    // Update subscriber engagement scores every 6 hours
    this.addJob('update-engagement-scores', '0 */6 * * *', this.updateEngagementScores.bind(this));

    // Check date-based automations every hour
    this.addJob('check-date-automations', '0 * * * *', this.checkDateBasedAutomations.bind(this));

    // Generate daily reports at 8 AM
    this.addJob('generate-daily-reports', '0 8 * * *', this.generateDailyReports.bind(this));

    logger.info('Email marketing scheduler initialized');
  }

  /**
   * Add a scheduled job
   */
  private addJob(name: string, cronTime: string, onTick: () => void): void {
    const job = new CronJob(cronTime, onTick, null, true, 'UTC');
    this.jobs.set(name, job);
    logger.info(`Scheduled job added: ${name} (${cronTime})`);
  }

  /**
   * Update segment counts
   */
  private async updateSegmentCounts(): Promise<void> {
    try {
      const segments = await prisma.client.emailSegment.findMany({
        where: {
          lastCalculatedAt: {
            lt: new Date(Date.now() - 60 * 60 * 1000) // Older than 1 hour
          }
        },
        take: 100
      });

      for (const segment of segments) {
        await queueService.addJob(
          'email-marketing',
          'update-segment-counts',
          { segmentId: segment.id }
        );
      }

      logger.info(`Queued ${segments.length} segments for count update`);
    } catch (error) {
      logger.error('Failed to update segment counts', error as Error);
    }
  }

  /**
   * Check scheduled campaigns
   */
  private async checkScheduledCampaigns(): Promise<void> {
    try {
      const campaigns = await prisma.client.emailCampaign.findMany({
        where: {
          status: EmailCampaignStatus.SCHEDULED,
          scheduledAt: {
            lte: new Date()
          }
        }
      });

      for (const campaign of campaigns) {
        await queueService.addJob(
          'email-marketing',
          'send-campaign',
          { campaignId: campaign.id }
        );

        logger.info(`Scheduled campaign queued for sending: ${campaign.id}`);
      }
    } catch (error) {
      logger.error('Failed to check scheduled campaigns', error as Error);
    }
  }

  /**
   * Clean up old email activities
   */
  private async cleanupOldActivities(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deleted = await prisma.client.emailActivity.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      });

      logger.info(`Cleaned up ${deleted.count} old email activities`);
    } catch (error) {
      logger.error('Failed to cleanup old activities', error as Error);
    }
  }

  /**
   * Update subscriber engagement scores
   */
  private async updateEngagementScores(): Promise<void> {
    try {
      // Get subscribers with recent activity
      const recentlyActiveSubscribers = await prisma.client.emailActivity.groupBy({
        by: ['subscriberId'],
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          },
          type: { in: ['opened', 'clicked'] }
        },
        _count: true
      });

      for (const activity of recentlyActiveSubscribers) {
        const score = Math.min(100, activity._count * 10);

        await prisma.client.emailListSubscriber.update({
          where: { id: activity.subscriberId },
          data: {
            engagementScore: score,
            lastEngagedAt: new Date()
          }
        });
      }

      // Decay scores for inactive subscribers
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await prisma.client.emailListSubscriber.updateMany({
        where: {
          lastEngagedAt: {
            lt: thirtyDaysAgo
          },
          engagementScore: {
            gt: 0
          }
        },
        data: {
          engagementScore: {
            multiply: 0.9 // Decay by 10%
          }
        }
      });

      logger.info('Subscriber engagement scores updated');
    } catch (error) {
      logger.error('Failed to update engagement scores', error as Error);
    }
  }

  /**
   * Check date-based automations
   */
  private async checkDateBasedAutomations(): Promise<void> {
    try {
      const automations = await prisma.client.emailAutomation.findMany({
        where: {
          active: true,
          trigger: EmailAutomationTrigger.DATE_BASED
        }
      });

      for (const automation of automations) {
        await queueService.addJob(
          'email-marketing',
          'check-date-triggers',
          { automationId: automation.id }
        );
      }

      logger.info(`Checked ${automations.length} date-based automations`);
    } catch (error) {
      logger.error('Failed to check date-based automations', error as Error);
    }
  }

  /**
   * Generate daily reports
   */
  private async generateDailyReports(): Promise<void> {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get campaigns sent yesterday
      const campaigns = await prisma.client.emailCampaign.findMany({
        where: {
          sentAt: {
            gte: yesterday,
            lt: today
          }
        },
        include: {
          stats: true
        }
      });

      // Get new subscribers yesterday
      const newSubscribers = await prisma.client.emailListSubscriber.count({
        where: {
          subscribedAt: {
            gte: yesterday,
            lt: today
          }
        }
      });

      // Get unsubscribes yesterday
      const unsubscribes = await prisma.client.emailListSubscriber.count({
        where: {
          unsubscribedAt: {
            gte: yesterday,
            lt: today
          }
        }
      });

      const reportData = {
        date: yesterday,
        campaigns: campaigns.map(c => ({
          id: c.id,
          name: c.name,
          stats: c.stats
        })),
        newSubscribers,
        unsubscribes
      };

      await eventBus.emit(EmailMarketingEvents.DAILY_REPORT_GENERATED, reportData);

      logger.info('Daily email marketing report generated', {
        campaignsCount: campaigns.length,
        newSubscribers,
        unsubscribes
      });
    } catch (error) {
      logger.error('Failed to generate daily reports', error as Error);
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stop(): void {
    for (const [name, job] of this.jobs) {
      job.stop();
      logger.info(`Stopped scheduled job: ${name}`);
    }
    this.jobs.clear();
  }

  /**
   * Start all scheduled jobs
   */
  start(): void {
    for (const [name, job] of this.jobs) {
      job.start();
      logger.info(`Started scheduled job: ${name}`);
    }
  }
}