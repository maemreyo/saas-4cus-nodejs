// Queue processor for email marketing background jobs

import { Service } from 'typedi';
import { Job } from 'bullmq';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EmailService } from '@shared/services/email.service';
import { EventBus } from '@shared/events/event-bus';
import { queueService } from '@shared/queue/queue.service';
import { EmailMarketingEvents } from './email-marketing.events';
import {
  CampaignStatus,
  SubscriberStatus,
  AutomationStepType,
  EmailActivityType
} from '@prisma/client';

// Import notification service for sending notifications
import { NotificationService } from '@modules/notification/notification.service';

interface SendCampaignJob {
  campaignId: string;
  tenantId: string;
}

interface SendConfirmationJob {
  subscriberId: string;
  email: string;
  confirmToken: string;
  tenantId: string;
}

interface SendEmailJob {
  recipientId: string;
  campaignId?: string;
  automationStepId?: string;
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  trackingId: string;
}

interface ProcessAutomationStepJob {
  enrollmentId: string;
  stepId: string;
  subscriberId: string;
}

@Service()
export class EmailMarketingQueueProcessor {
  constructor(
    private emailService: EmailService,
    private eventBus: EventBus,
    private notificationService: NotificationService
  ) {}

  /**
   * Process send campaign job
   */
  async processSendCampaign(job: Job<SendCampaignJob>): Promise<void> {
    const { campaignId, tenantId } = job.data;
    logger.info('Processing campaign send', { campaignId, jobId: job.id });

    try {
      // Get campaign details
      const campaign = await prisma.client.emailCampaign.findFirst({
        where: { id: campaignId, tenantId },
        include: {
          list: true,
          template: true,
          segment: true
        }
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Update campaign status
      await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: CampaignStatus.SENDING,
          sentAt: new Date()
        }
      });

      // Get recipients based on segment or entire list
      const recipients = await this.getCampaignRecipients(campaign);
      logger.info(`Found ${recipients.length} recipients for campaign`, { campaignId });

      // Process in batches
      const batchSize = 50;
      let sentCount = 0;
      let errorCount = 0;

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        // Queue individual email jobs
        await Promise.all(
          batch.map(async (recipient) => {
            try {
              const trackingId = await this.generateTrackingId(campaignId, recipient.id);
              const personalizedContent = await this.personalizeContent(
                campaign.htmlContent!,
                recipient
              );

              await queueService.addJob('email-marketing', 'send-email', {
                recipientId: recipient.id,
                campaignId,
                to: recipient.email,
                subject: campaign.subject,
                htmlContent: personalizedContent.html,
                textContent: personalizedContent.text,
                trackingId
              });

              sentCount++;
            } catch (error) {
              logger.error('Failed to queue email', {
                error,
                recipientId: recipient.id,
                campaignId
              });
              errorCount++;
            }
          })
        );

        // Update progress
        await job.updateProgress((i + batch.length) / recipients.length * 100);
      }

      // Update campaign status
      await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: CampaignStatus.SENT,
          completedAt: new Date(),
          statistics: {
            totalSent: sentCount,
            totalFailed: errorCount
          }
        }
      });

      // Emit event
      await this.eventBus.emit(EmailMarketingEvents.CAMPAIGN_COMPLETED, {
        campaignId,
        tenantId,
        sentCount,
        errorCount,
        timestamp: new Date()
      });

      // Send notification to campaign creator
      if (campaign.createdById) {
        await this.notificationService.create({
          userId: campaign.createdById,
          type: errorCount > 0 ? 'WARNING' : 'SUCCESS',
          title: 'Campaign Sent',
          content: `Campaign "${campaign.name}" has been sent to ${sentCount} recipients.${errorCount > 0 ? ` ${errorCount} failed.` : ''}`,
          metadata: {
            campaignId,
            tenantId,
            sentCount,
            errorCount
          },
          actions: [
            {
              label: 'View Report',
              url: `/campaigns/${campaignId}/report`
            }
          ]
        });
      }

      logger.info('Campaign send completed', {
        campaignId,
        sentCount,
        errorCount
      });
    } catch (error) {
      logger.error('Failed to send campaign', { error, campaignId });

      // Update campaign status to failed
      await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: CampaignStatus.FAILED,
          failedAt: new Date(),
          failureReason: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }
  }

  /**
   * Process send confirmation email job
   */
  async processSendConfirmation(job: Job<SendConfirmationJob>): Promise<void> {
    const { subscriberId, email, confirmToken, tenantId } = job.data;
    logger.info('Processing confirmation email', { subscriberId, email });

    try {
      // Get tenant details for branding
      const tenant = await prisma.client.tenant.findUnique({
        where: { id: tenantId }
      });

      const confirmUrl = `${process.env.APP_URL}/confirm-subscription/${confirmToken}`;

      await this.emailService.send({
        to: email,
        subject: `Please confirm your subscription${tenant ? ` to ${tenant.name}` : ''}`,
        html: `
          <h2>Confirm Your Subscription</h2>
          <p>Thank you for subscribing! Please confirm your email address by clicking the link below:</p>
          <p><a href="${confirmUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Subscription</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${confirmUrl}</p>
          <p>This link will expire in 48 hours.</p>
        `,
        text: `
          Confirm Your Subscription

          Thank you for subscribing! Please confirm your email address by visiting:
          ${confirmUrl}

          This link will expire in 48 hours.
        `
      });

      logger.info('Confirmation email sent', { subscriberId, email });
    } catch (error) {
      logger.error('Failed to send confirmation email', { error, subscriberId });
      throw error;
    }
  }

  /**
   * Process send individual email job
   */
  async processSendEmail(job: Job<SendEmailJob>): Promise<void> {
    const {
      recipientId,
      campaignId,
      automationStepId,
      to,
      subject,
      htmlContent,
      textContent,
      trackingId
    } = job.data;

    logger.info('Processing email send', {
      recipientId,
      campaignId,
      automationStepId,
      to
    });

    try {
      // Add tracking pixel and click tracking
      const trackedHtml = this.addEmailTracking(htmlContent, trackingId);

      // Send email
      const result = await this.emailService.send({
        to,
        subject,
        html: trackedHtml,
        text: textContent,
        headers: {
          'X-Campaign-ID': campaignId || '',
          'X-Tracking-ID': trackingId,
          'List-Unsubscribe': `<${process.env.APP_URL}/unsubscribe/${trackingId}>`
        }
      });

      // Record email sent
      if (campaignId) {
        await prisma.client.campaignRecipient.create({
          data: {
            campaignId,
            subscriberId: recipientId,
            sentAt: new Date(),
            messageId: result.messageId
          }
        });
      }

      // Record automation email
      if (automationStepId) {
        await prisma.client.automationEmail.create({
          data: {
            stepId: automationStepId,
            subscriberId: recipientId,
            sentAt: new Date(),
            messageId: result.messageId
          }
        });
      }

      // Emit event
      await this.eventBus.emit(EmailMarketingEvents.EMAIL_SENT, {
        recipientId,
        campaignId,
        automationStepId,
        to,
        trackingId,
        messageId: result.messageId,
        timestamp: new Date()
      });

      logger.info('Email sent successfully', {
        recipientId,
        messageId: result.messageId
      });
    } catch (error) {
      logger.error('Failed to send email', { error, recipientId, to });

      // Record failure
      if (campaignId) {
        await prisma.client.campaignRecipient.create({
          data: {
            campaignId,
            subscriberId: recipientId,
            failedAt: new Date(),
            failureReason: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }

      throw error;
    }
  }

  /**
   * Process automation step
   */
  async processAutomationStep(job: Job<ProcessAutomationStepJob>): Promise<void> {
    const { enrollmentId, stepId, subscriberId } = job.data;
    logger.info('Processing automation step', { enrollmentId, stepId });

    try {
      // Get step details
      const step = await prisma.client.automationStep.findUnique({
        where: { id: stepId },
        include: {
          automation: true,
          template: true
        }
      });

      if (!step || !step.automation.isActive) {
        logger.warn('Step not found or automation inactive', { stepId });
        return;
      }

      // Get subscriber details
      const subscriber = await prisma.client.emailSubscriber.findUnique({
        where: { id: subscriberId }
      });

      if (!subscriber || subscriber.status !== SubscriberStatus.ACTIVE) {
        logger.warn('Subscriber not active', { subscriberId });
        return;
      }

      // Process based on step type
      switch (step.type) {
        case AutomationStepType.SEND_EMAIL:
          await this.processEmailStep(step, subscriber, enrollmentId);
          break;

        case AutomationStepType.WAIT:
          await this.processWaitStep(step, enrollmentId);
          break;

        case AutomationStepType.CONDITION:
          await this.processConditionStep(step, subscriber, enrollmentId);
          break;

        default:
          logger.warn('Unknown step type', { stepType: step.type });
      }

      // Emit event
      await this.eventBus.emit(EmailMarketingEvents.AUTOMATION_STEP_SENT, {
        automationId: step.automationId,
        stepId,
        subscriberId,
        enrollmentId,
        timestamp: new Date()
      });

    } catch (error) {
      logger.error('Failed to process automation step', {
        error,
        enrollmentId,
        stepId
      });
      throw error;
    }
  }

  /**
   * Process daily statistics
   */
  async processDailyStats(job: Job): Promise<void> {
    logger.info('Processing daily email marketing statistics');

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all tenants
      const tenants = await prisma.client.tenant.findMany({
        where: { deletedAt: null }
      });

      for (const tenant of tenants) {
        // Calculate daily stats
        const stats = await this.calculateDailyStats(tenant.id, yesterday, today);

        // Store daily report
        await prisma.client.emailMarketingReport.create({
          data: {
            tenantId: tenant.id,
            date: yesterday,
            ...stats
          }
        });

        // Emit event
        await this.eventBus.emit(EmailMarketingEvents.DAILY_REPORT_GENERATED, {
          tenantId: tenant.id,
          date: yesterday,
          stats,
          timestamp: new Date()
        });
      }

      logger.info('Daily statistics processing completed');
    } catch (error) {
      logger.error('Failed to process daily statistics', { error });
      throw error;
    }
  }

  /**
   * Cleanup old tracking data
   */
  async processCleanupTracking(job: Job): Promise<void> {
    logger.info('Processing tracking data cleanup');

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90); // 90 days retention

      // Delete old tracking records
      const deletedActivities = await prisma.client.emailActivity.deleteMany({
        where: {
          createdAt: { lt: cutoffDate }
        }
      });

      // Delete old campaign recipients
      const deletedRecipients = await prisma.client.campaignRecipient.deleteMany({
        where: {
          sentAt: { lt: cutoffDate }
        }
      });

      logger.info('Tracking data cleanup completed', {
        deletedActivities: deletedActivities.count,
        deletedRecipients: deletedRecipients.count
      });
    } catch (error) {
      logger.error('Failed to cleanup tracking data', { error });
      throw error;
    }
  }

  // ===== HELPER METHODS =====

  /**
   * Get campaign recipients
   */
  private async getCampaignRecipients(campaign: any): Promise<any[]> {
    const where: any = {
      listId: campaign.listId,
      status: SubscriberStatus.ACTIVE
    };

    // Apply segment filters if present
    if (campaign.segment) {
      // Apply segment conditions
      // This would be more complex in real implementation
      if (campaign.segment.conditions.tags) {
        where.tags = {
          hasSome: campaign.segment.conditions.tags
        };
      }
    }

    return await prisma.client.emailSubscriber.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        customFields: true
      }
    });
  }

  /**
   * Generate tracking ID
   */
  private async generateTrackingId(
    campaignId: string,
    subscriberId: string
  ): Promise<string> {
    const trackingId = `${campaignId}-${subscriberId}-${Date.now()}`;

    // Store tracking data in Redis with 30 day expiry
    await redis.setex(
      `email:tracking:${trackingId}`,
      30 * 24 * 3600,
      JSON.stringify({ campaignId, subscriberId })
    );

    return trackingId;
  }

  /**
   * Personalize content
   */
  private async personalizeContent(
    content: string,
    recipient: any
  ): Promise<{ html: string; text: string }> {
    // Simple variable replacement
    let html = content;
    let text = content;

    // Replace merge tags
    const replacements: Record<string, string> = {
      '{{firstName}}': recipient.firstName || '',
      '{{lastName}}': recipient.lastName || '',
      '{{email}}': recipient.email,
      '{{fullName}}': `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim()
    };

    for (const [tag, value] of Object.entries(replacements)) {
      html = html.replace(new RegExp(tag, 'g'), value);
      text = text.replace(new RegExp(tag, 'g'), value);
    }

    // Add custom fields
    if (recipient.customFields) {
      for (const [key, value] of Object.entries(recipient.customFields)) {
        const tag = `{{${key}}}`;
        html = html.replace(new RegExp(tag, 'g'), String(value));
        text = text.replace(new RegExp(tag, 'g'), String(value));
      }
    }

    // Convert HTML to text if needed
    text = text.replace(/<[^>]*>/g, '');

    return { html, text };
  }

  /**
   * Add email tracking
   */
  private addEmailTracking(html: string, trackingId: string): string {
    // Add tracking pixel
    const trackingPixel = `<img src="${process.env.APP_URL}/api/email-marketing/track/open/${trackingId}" width="1" height="1" style="display:none;" />`;
    html = html.replace('</body>', `${trackingPixel}</body>`);

    // Add click tracking to links
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/gi;
    html = html.replace(linkRegex, (match, url, rest) => {
      // Skip unsubscribe and tracking links
      if (url.includes('unsubscribe') || url.includes('/track/')) {
        return match;
      }

      const trackedUrl = `${process.env.APP_URL}/api/email-marketing/track/click/${trackingId}?url=${encodeURIComponent(url)}`;
      return `<a href="${trackedUrl}"${rest}>`;
    });

    return html;
  }

  /**
   * Process email automation step
   */
  private async processEmailStep(
    step: any,
    subscriber: any,
    enrollmentId: string
  ): Promise<void> {
    const trackingId = await this.generateTrackingId(
      `automation-${step.automationId}`,
      subscriber.id
    );

    const content = await this.personalizeContent(
      step.template.htmlContent,
      subscriber
    );

    await queueService.addJob('email-marketing', 'send-email', {
      recipientId: subscriber.id,
      automationStepId: step.id,
      to: subscriber.email,
      subject: step.template.subject,
      htmlContent: content.html,
      textContent: content.text,
      trackingId
    });

    // Schedule next step if exists
    await this.scheduleNextStep(enrollmentId, step);
  }

  /**
   * Process wait step
   */
  private async processWaitStep(
    step: any,
    enrollmentId: string
  ): Promise<void> {
    // Just schedule the next step after wait period
    await this.scheduleNextStep(enrollmentId, step);
  }

  /**
   * Process condition step
   */
  private async processConditionStep(
    step: any,
    subscriber: any,
    enrollmentId: string
  ): Promise<void> {
    // Evaluate condition (simplified)
    const conditionMet = await this.evaluateCondition(
      step.settings.condition,
      subscriber
    );

    // Update enrollment with path taken
    await prisma.client.automationEnrollment.update({
      where: { id: enrollmentId },
      data: {
        currentStepId: conditionMet ? step.settings.truePath : step.settings.falsePath
      }
    });

    // Continue with appropriate path
    const nextStepId = conditionMet ? step.settings.truePath : step.settings.falsePath;
    if (nextStepId) {
      await queueService.addJob('email-marketing', 'process-automation-step', {
        enrollmentId,
        stepId: nextStepId,
        subscriberId: subscriber.id
      });
    }
  }

  /**
   * Schedule next automation step
   */
  private async scheduleNextStep(
    enrollmentId: string,
    currentStep: any
  ): Promise<void> {
    // Get next step
    const nextStep = await prisma.client.automationStep.findFirst({
      where: {
        automationId: currentStep.automationId,
        order: { gt: currentStep.order }
      },
      orderBy: { order: 'asc' }
    });

    if (nextStep) {
      // Calculate delay based on step settings
      let delay = 0;
      if (currentStep.type === AutomationStepType.WAIT) {
        delay = this.parseDelay(currentStep.settings.delay);
      }

      // Update enrollment
      await prisma.client.automationEnrollment.update({
        where: { id: enrollmentId },
        data: { currentStepId: nextStep.id }
      });

      // Schedule next step
      await queueService.addJob(
        'email-marketing',
        'process-automation-step',
        {
          enrollmentId,
          stepId: nextStep.id,
          subscriberId: currentStep.subscriberId
        },
        { delay }
      );
    } else {
      // No more steps - complete enrollment
      await prisma.client.automationEnrollment.update({
        where: { id: enrollmentId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });

      await this.eventBus.emit(EmailMarketingEvents.AUTOMATION_ENROLLMENT_COMPLETED, {
        enrollmentId,
        automationId: currentStep.automationId,
        timestamp: new Date()
      });
    }
  }

  /**
   * Parse delay string to milliseconds
   */
  private parseDelay(delay: string): number {
    const match = delay.match(/(\d+)\s*(hour|day|week)/i);
    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'hour':
        return value * 60 * 60 * 1000;
      case 'day':
        return value * 24 * 60 * 60 * 1000;
      case 'week':
        return value * 7 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }

  /**
   * Evaluate automation condition
   */
  private async evaluateCondition(
    condition: any,
    subscriber: any
  ): Promise<boolean> {
    // Simplified condition evaluation
    // In real implementation, this would be more complex

    if (condition.type === 'tag') {
      return subscriber.tags.includes(condition.value);
    }

    if (condition.type === 'field') {
      return subscriber.customFields[condition.field] === condition.value;
    }

    return false;
  }

  /**
   * Calculate daily statistics
   */
  private async calculateDailyStats(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const [
      emailsSent,
      emailsOpened,
      emailsClicked,
      emailsBounced,
      newSubscribers,
      unsubscribes
    ] = await Promise.all([
      // Emails sent
      prisma.client.campaignRecipient.count({
        where: {
          campaign: { tenantId },
          sentAt: { gte: startDate, lt: endDate }
        }
      }),

      // Emails opened
      prisma.client.emailActivity.count({
        where: {
          campaign: { tenantId },
          type: EmailActivityType.OPEN,
          createdAt: { gte: startDate, lt: endDate }
        }
      }),

      // Emails clicked
      prisma.client.emailActivity.count({
        where: {
          campaign: { tenantId },
          type: EmailActivityType.CLICK,
          createdAt: { gte: startDate, lt: endDate }
        }
      }),

      // Emails bounced
      prisma.client.emailActivity.count({
        where: {
          campaign: { tenantId },
          type: EmailActivityType.BOUNCE,
          createdAt: { gte: startDate, lt: endDate }
        }
      }),

      // New subscribers
      prisma.client.emailSubscriber.count({
        where: {
          list: { tenantId },
          subscribedAt: { gte: startDate, lt: endDate }
        }
      }),

      // Unsubscribes
      prisma.client.emailSubscriber.count({
        where: {
          list: { tenantId },
          unsubscribedAt: { gte: startDate, lt: endDate }
        }
      })
    ]);

    return {
      emailsSent,
      emailsOpened,
      emailsClicked,
      emailsBounced,
      newSubscribers,
      unsubscribes,
      openRate: emailsSent > 0 ? (emailsOpened / emailsSent) * 100 : 0,
      clickRate: emailsSent > 0 ? (emailsClicked / emailsSent) * 100 : 0,
      bounceRate: emailsSent > 0 ? (emailsBounced / emailsSent) * 100 : 0
    };
  }
}
