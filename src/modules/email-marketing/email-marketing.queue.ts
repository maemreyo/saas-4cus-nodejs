import { Service } from 'typedi';
import { Job } from 'bull';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';
import { EmailService } from '@shared/services/email.service';
import { eventBus } from '@shared/events/event-bus';
import { CampaignService } from './campaign.service';
import { EmailListService } from './email-list.service';
import { AutomationService } from './automation.service';
import { TemplateService } from './template.service';
import { TrackingService } from './tracking.service';
import { EmailMarketingEvents } from './email-marketing.events';
import {
  EmailCampaignStatus,
  EmailDeliveryStatus,
  EmailAutomationTrigger
} from '@prisma/client';
import { nanoid } from 'nanoid';

interface EmailJob {
  recipientId: string;
  campaignId?: string;
  automationId?: string;
  stepId?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  to: string;
  messageId: string;
}

@Service()
export class EmailMarketingQueueProcessor {
  constructor(
    private emailService: EmailService,
    private campaignService: CampaignService,
    private templateService: TemplateService,
    private trackingService: TrackingService
  ) {
    this.registerHandlers();
  }

  /**
   * Register queue handlers
   */
  private registerHandlers(): void {
    // Campaign processing
    queueService.process('email-marketing', 'send-campaign', this.processCampaignSend.bind(this));
    queueService.process('email-marketing', 'process-campaign-send', this.processCampaignBatch.bind(this));
    queueService.process('email-marketing', 'resume-campaign-send', this.resumeCampaignSend.bind(this));

    // Individual email sending
    queueService.process('email-marketing', 'send-email', this.sendEmail.bind(this));
    queueService.process('email-marketing', 'send-transactional', this.sendTransactionalEmail.bind(this));

    // Subscriber import
    queueService.process('email-marketing', 'import-subscribers', this.importSubscribers.bind(this));

    // Automation processing
    queueService.process('email-marketing', 'process-automation-trigger', this.processAutomationTrigger.bind(this));
    queueService.process('email-marketing', 'process-automation-step', this.processAutomationStep.bind(this));
    queueService.process('email-marketing', 'check-date-triggers', this.checkDateTriggers.bind(this));

    // Welcome emails
    queueService.process('email-marketing', 'send-welcome-email', this.sendWelcomeEmail.bind(this));

    // Stats calculation
    queueService.process('email-marketing', 'calculate-campaign-stats', this.calculateCampaignStats.bind(this));
    queueService.process('email-marketing', 'update-segment-counts', this.updateSegmentCounts.bind(this));

    logger.info('Email marketing queue handlers registered');
  }

  /**
   * Process campaign send
   */
  private async processCampaignSend(job: Job): Promise<void> {
    const { campaignId, testMode = false, testEmails = [] } = job.data;

    try {
      const campaign = await prisma.client.emailCampaign.findUnique({
        where: { id: campaignId },
        include: {
          list: true,
          template: true
        }
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Update campaign status
      await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: { status: EmailCampaignStatus.SENDING }
      });

      if (testMode) {
        // Send test emails
        await this.sendTestEmails(campaign, testEmails);
      } else {
        // Get recipients
        const recipients = await this.getCampaignRecipients(campaign);

        // Create recipient records
        const recipientRecords = await this.createRecipientRecords(campaignId, recipients);

        // Queue emails in batches
        await this.queueCampaignEmails(campaign, recipientRecords);
      }

      logger.info('Campaign send processing started', {
        campaignId,
        testMode,
        recipientCount: testMode ? testEmails.length : undefined
      });
    } catch (error) {
      logger.error('Failed to process campaign send', error as Error);

      // Update campaign status to failed
      await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: { status: EmailCampaignStatus.FAILED }
      });

      throw error;
    }
  }

  /**
   * Process campaign batch
   */
  private async processCampaignBatch(job: Job): Promise<void> {
    const { campaignId, recipientIds } = job.data;

    try {
      const campaign = await prisma.client.emailCampaign.findUnique({
        where: { id: campaignId },
        include: { template: true }
      });

      if (!campaign || campaign.status !== EmailCampaignStatus.SENDING) {
        return;
      }

      // Process each recipient
      for (const recipientId of recipientIds) {
        const recipient = await prisma.client.emailCampaignRecipient.findUnique({
          where: { id: recipientId },
          include: { subscriber: true }
        });

        if (!recipient || recipient.status !== EmailDeliveryStatus.PENDING) {
          continue;
        }

        // Prepare email content
        const messageId = `${campaignId}-${recipientId}-${nanoid(8)}`;
        const variables = {
          firstName: recipient.subscriber.firstName,
          lastName: recipient.subscriber.lastName,
          email: recipient.subscriber.email,
          ...recipient.subscriber.customData
        };

        let htmlContent = campaign.htmlContent;
        let textContent = campaign.textContent;

        // Apply template if used
        if (campaign.template) {
          const rendered = this.templateService.renderTemplate(
            campaign.template.htmlContent,
            variables
          );
          htmlContent = rendered;

          if (campaign.template.textContent) {
            textContent = this.templateService.renderTemplate(
              campaign.template.textContent,
              variables
            );
          }
        }

        // Add tracking
        if (campaign.trackOpens || campaign.trackClicks) {
          htmlContent = this.trackingService.addTrackingToHtml(htmlContent, messageId);
        }

        // Queue individual email
        await queueService.addJob('email-marketing', 'send-email', {
          recipientId: recipient.id,
          campaignId,
          subject: campaign.subject,
          htmlContent,
          textContent,
          fromName: campaign.fromName,
          fromEmail: campaign.fromEmail,
          replyTo: campaign.replyTo,
          to: recipient.subscriber.email,
          messageId
        } as EmailJob);
      }

      // Check if all emails are processed
      await this.checkCampaignCompletion(campaignId);
    } catch (error) {
      logger.error('Failed to process campaign batch', error as Error);
      throw error;
    }
  }

  /**
   * Send individual email
   */
  private async sendEmail(job: Job<EmailJob>): Promise<void> {
    const data = job.data;

    try {
      // Send email via email service
      await this.emailService.send({
        to: data.to,
        subject: data.subject,
        html: data.htmlContent,
        text: data.textContent,
        from: `${data.fromName} <${data.fromEmail}>`,
        replyTo: data.replyTo,
        headers: {
          'X-Message-ID': data.messageId,
          'X-Campaign-ID': data.campaignId,
          'X-Automation-ID': data.automationId
        }
      });

      // Track sent
      await this.trackingService.trackSent(data.recipientId);

      logger.info('Email sent', {
        recipientId: data.recipientId,
        campaignId: data.campaignId,
        to: data.to
      });
    } catch (error) {
      logger.error('Failed to send email', error as Error);

      // Update recipient status
      await prisma.client.emailCampaignRecipient.update({
        where: { id: data.recipientId },
        data: {
          status: EmailDeliveryStatus.FAILED,
          error: (error as Error).message
        }
      });

      throw error;
    }
  }

  /**
   * Send transactional email
   */
  private async sendTransactionalEmail(job: Job): Promise<void> {
    const { to, subject, templateKey, variables } = job.data;

    try {
      // Load template
      const template = await prisma.client.emailTemplate.findFirst({
        where: {
          category: 'transactional',
          name: templateKey
        }
      });

      if (!template) {
        throw new Error(`Transactional template not found: ${templateKey}`);
      }

      // Render template
      const htmlContent = this.templateService.renderTemplate(
        template.htmlContent,
        variables
      );

      const textContent = template.textContent
        ? this.templateService.renderTemplate(template.textContent, variables)
        : undefined;

      // Send email
      await this.emailService.send({
        to,
        subject: this.templateService.renderTemplate(template.subject, variables),
        html: htmlContent,
        text: textContent
      });

      logger.info('Transactional email sent', { to, templateKey });
    } catch (error) {
      logger.error('Failed to send transactional email', error as Error);
      throw error;
    }
  }

  /**
   * Import subscribers
   */
  private async importSubscribers(job: Job): Promise<void> {
    const { listId, tenantId, subscribers, updateExisting, skipConfirmation } = job.data;

    try {
      let imported = 0;
      let updated = 0;
      let failed = 0;

      for (const subscriberData of subscribers) {
        try {
          const existing = await prisma.client.emailListSubscriber.findUnique({
            where: {
              listId_email: {
                listId,
                email: subscriberData.email.toLowerCase()
              }
            }
          });

          if (existing && !updateExisting) {
            failed++;
            continue;
          }

          if (existing) {
            await prisma.client.emailListSubscriber.update({
              where: { id: existing.id },
              data: {
                firstName: subscriberData.firstName || existing.firstName,
                lastName: subscriberData.lastName || existing.lastName,
                customData: { ...existing.customData, ...subscriberData.customData },
                tags: [...new Set([...existing.tags, ...(subscriberData.tags || [])])]
              }
            });
            updated++;
          } else {
            const list = await prisma.client.emailList.findUnique({
              where: { id: listId }
            });

            await prisma.client.emailListSubscriber.create({
              data: {
                listId,
                email: subscriberData.email.toLowerCase(),
                firstName: subscriberData.firstName,
                lastName: subscriberData.lastName,
                confirmed: skipConfirmation || !list?.doubleOptIn,
                confirmationToken: !skipConfirmation && list?.doubleOptIn ? nanoid() : null,
                customData: subscriberData.customData,
                tags: subscriberData.tags || [],
                source: 'import'
              }
            });
            imported++;
          }
        } catch (error) {
          logger.error('Failed to import subscriber', error as Error);
          failed++;
        }
      }

      await eventBus.emit(EmailMarketingEvents.SUBSCRIBERS_IMPORTED, {
        listId,
        tenantId,
        imported,
        updated,
        failed,
        total: subscribers.length
      });

      logger.info('Subscriber import completed', {
        listId,
        imported,
        updated,
        failed
      });
    } catch (error) {
      logger.error('Failed to import subscribers', error as Error);
      throw error;
    }
  }

  /**
   * Process automation trigger
   */
  private async processAutomationTrigger(job: Job): Promise<void> {
    const { automationId, triggerData } = job.data;

    try {
      const automation = await prisma.client.emailAutomation.findUnique({
        where: { id: automationId },
        include: { steps: { orderBy: { order: 'asc' } } }
      });

      if (!automation || !automation.active) {
        return;
      }

      // Process trigger based on type
      switch (automation.trigger) {
        case EmailAutomationTrigger.DATE_BASED:
          await this.processDateBasedTrigger(automation);
          break;
        case EmailAutomationTrigger.WEBHOOK:
          await this.processWebhookTrigger(automation, triggerData);
          break;
        default:
          logger.warn('Unsupported automation trigger type', {
            automationId,
            trigger: automation.trigger
          });
      }
    } catch (error) {
      logger.error('Failed to process automation trigger', error as Error);
      throw error;
    }
  }

  /**
   * Process automation step
   */
  private async processAutomationStep(job: Job): Promise<void> {
    const { enrollmentId, stepId } = job.data;

    try {
      const enrollment = await prisma.client.emailAutomationEnrollment.findUnique({
        where: { id: enrollmentId }
      });

      if (!enrollment || enrollment.status !== 'active') {
        return;
      }

      const step = await prisma.client.emailAutomationStep.findUnique({
        where: { id: stepId },
        include: {
          automation: true,
          template: true
        }
      });

      if (!step) {
        return;
      }

      // Check conditions
      if (step.conditions) {
        const conditionsMet = await this.evaluateStepConditions(
          enrollment.subscriberId,
          step.conditions
        );

        if (!conditionsMet) {
          // Skip to next step
          await this.queueNextStep(enrollment, step);
          return;
        }
      }

      // Get subscriber
      const subscriber = await prisma.client.emailListSubscriber.findFirst({
        where: {
          id: enrollment.subscriberId,
          subscribed: true
        }
      });

      if (!subscriber) {
        // Cancel enrollment
        await prisma.client.emailAutomationEnrollment.update({
          where: { id: enrollmentId },
          data: {
            status: 'cancelled',
            cancelledAt: new Date()
          }
        });
        return;
      }

      // Prepare email content
      const variables = {
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        email: subscriber.email,
        ...subscriber.customData
      };

      let htmlContent = step.htmlContent;
      let textContent = step.textContent;
      let subject = step.subject;

      // Apply template if used
      if (step.template) {
        htmlContent = this.templateService.renderTemplate(
          step.template.htmlContent,
          variables
        );
        subject = this.templateService.renderTemplate(
          step.template.subject,
          variables
        );
        if (step.template.textContent) {
          textContent = this.templateService.renderTemplate(
            step.template.textContent,
            variables
          );
        }
      } else {
        htmlContent = this.templateService.renderTemplate(htmlContent, variables);
        subject = this.templateService.renderTemplate(subject, variables);
        if (textContent) {
          textContent = this.templateService.renderTemplate(textContent, variables);
        }
      }

      // Send email
      const messageId = `automation-${step.automationId}-${enrollmentId}-${stepId}`;
      await this.emailService.send({
        to: subscriber.email,
        subject,
        html: htmlContent,
        text: textContent,
        headers: {
          'X-Message-ID': messageId,
          'X-Automation-ID': step.automationId,
          'X-Step-ID': stepId
        }
      });

      // Update enrollment
      await prisma.client.emailAutomationEnrollment.update({
        where: { id: enrollmentId },
        data: { currentStepId: stepId }
      });

      // Queue next step
      await this.queueNextStep(enrollment, step);

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_STEP_SENT, {
        automationId: step.automationId,
        stepId,
        enrollmentId,
        subscriberId: subscriber.id
      });

      logger.info('Automation step sent', {
        automationId: step.automationId,
        stepId,
        enrollmentId
      });
    } catch (error) {
      logger.error('Failed to process automation step', error as Error);
      throw error;
    }
  }

  /**
   * Check date-based triggers
   */
  private async checkDateTriggers(job: Job): Promise<void> {
    const { automationId } = job.data;

    try {
      const automation = await prisma.client.emailAutomation.findUnique({
        where: { id: automationId }
      });

      if (!automation || !automation.active) {
        return;
      }

      // Implementation depends on specific date trigger logic
      logger.info('Checking date triggers', { automationId });
    } catch (error) {
      logger.error('Failed to check date triggers', error as Error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  private async sendWelcomeEmail(job: Job): Promise<void> {
    const { listId, subscriberId, welcomeEmailId } = job.data;

    try {
      const subscriber = await prisma.client.emailListSubscriber.findUnique({
        where: { id: subscriberId }
      });

      if (!subscriber || !subscriber.subscribed) {
        return;
      }

      // Get welcome email campaign
      const welcomeCampaign = await prisma.client.emailCampaign.findUnique({
        where: { id: welcomeEmailId },
        include: { template: true }
      });

      if (!welcomeCampaign) {
        return;
      }

      // Prepare content
      const variables = {
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        email: subscriber.email,
        ...subscriber.customData
      };

      const subject = this.templateService.renderTemplate(
        welcomeCampaign.subject,
        variables
      );

      let htmlContent = welcomeCampaign.htmlContent;
      let textContent = welcomeCampaign.textContent;

      if (welcomeCampaign.template) {
        htmlContent = this.templateService.renderTemplate(
          welcomeCampaign.template.htmlContent,
          variables
        );
        if (welcomeCampaign.template.textContent) {
          textContent = this.templateService.renderTemplate(
            welcomeCampaign.template.textContent,
            variables
          );
        }
      }

      // Send email
      await this.emailService.send({
        to: subscriber.email,
        subject,
        html: htmlContent,
        text: textContent,
        from: `${welcomeCampaign.fromName} <${welcomeCampaign.fromEmail}>`,
        replyTo: welcomeCampaign.replyTo
      });

      logger.info('Welcome email sent', {
        listId,
        subscriberId,
        welcomeEmailId
      });
    } catch (error) {
      logger.error('Failed to send welcome email', error as Error);
      throw error;
    }
  }

  /**
   * Calculate campaign statistics
   */
  private async calculateCampaignStats(job: Job): Promise<void> {
    const { campaignId } = job.data;

    try {
      await this.trackingService['recalculateRates'](campaignId);

      logger.info('Campaign stats calculated', { campaignId });
    } catch (error) {
      logger.error('Failed to calculate campaign stats', error as Error);
      throw error;
    }
  }

  /**
   * Update segment counts
   */
  private async updateSegmentCounts(job: Job): Promise<void> {
    const { segmentId } = job.data;

    try {
      const segment = await prisma.client.emailSegment.findUnique({
        where: { id: segmentId }
      });

      if (!segment) {
        return;
      }

      // Implementation would call segmentation service
      logger.info('Segment counts updated', { segmentId });
    } catch (error) {
      logger.error('Failed to update segment counts', error as Error);
      throw error;
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Get campaign recipients
   */
  private async getCampaignRecipients(campaign: any): Promise<any[]> {
    let where: any = {
      listId: campaign.listId,
      subscribed: true,
      confirmed: true
    };

    // Apply segments
    if (campaign.segmentIds.length > 0) {
      // Implementation would use segmentation service
    }

    return prisma.client.emailListSubscriber.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        customData: true
      }
    });
  }

  /**
   * Create recipient records
   */
  private async createRecipientRecords(
    campaignId: string,
    subscribers: any[]
  ): Promise<any[]> {
    const recipients = subscribers.map(subscriber => ({
      campaignId,
      subscriberId: subscriber.id,
      status: EmailDeliveryStatus.PENDING
    }));

    await prisma.client.emailCampaignRecipient.createMany({
      data: recipients
    });

    return prisma.client.emailCampaignRecipient.findMany({
      where: { campaignId }
    });
  }

  /**
   * Queue campaign emails
   */
  private async queueCampaignEmails(campaign: any, recipients: any[]): Promise<void> {
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      batches.push(batch.map(r => r.id));
    }

    // Queue batches
    for (const recipientIds of batches) {
      await queueService.addJob(
        'email-marketing',
        'process-campaign-batch',
        {
          campaignId: campaign.id,
          recipientIds
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          }
        }
      );
    }

    // Update campaign stats
    await prisma.client.emailCampaignStats.update({
      where: { campaignId: campaign.id },
      data: { totalRecipients: recipients.length }
    });
  }

  /**
   * Send test emails
   */
  private async sendTestEmails(campaign: any, testEmails: string[]): Promise<void> {
    for (const email of testEmails) {
      await this.emailService.send({
        to: email,
        subject: `[TEST] ${campaign.subject}`,
        html: campaign.htmlContent,
        text: campaign.textContent,
        from: `${campaign.fromName} <${campaign.fromEmail}>`,
        replyTo: campaign.replyTo
      });
    }
  }

  /**
   * Check campaign completion
   */
  private async checkCampaignCompletion(campaignId: string): Promise<void> {
    const pendingCount = await prisma.client.emailCampaignRecipient.count({
      where: {
        campaignId,
        status: EmailDeliveryStatus.PENDING
      }
    });

    if (pendingCount === 0) {
      await prisma.client.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: EmailCampaignStatus.SENT,
          completedAt: new Date()
        }
      });

      await eventBus.emit(EmailMarketingEvents.CAMPAIGN_COMPLETED, {
        campaignId
      });
    }
  }

  /**
   * Resume campaign send
   */
  private async resumeCampaignSend(job: Job): Promise<void> {
    const { campaignId } = job.data;

    try {
      // Get pending recipients
      const pendingRecipients = await prisma.client.emailCampaignRecipient.findMany({
        where: {
          campaignId,
          status: EmailDeliveryStatus.PENDING
        }
      });

      // Queue remaining emails
      await this.queueCampaignEmails(
        { id: campaignId },
        pendingRecipients
      );

      logger.info('Campaign send resumed', {
        campaignId,
        pendingCount: pendingRecipients.length
      });
    } catch (error) {
      logger.error('Failed to resume campaign send', error as Error);
      throw error;
    }
  }

  /**
   * Process date-based trigger
   */
  private async processDateBasedTrigger(automation: any): Promise<void> {
    // Implementation depends on specific date trigger logic
    logger.info('Processing date-based trigger', { automationId: automation.id });
  }

  /**
   * Process webhook trigger
   */
  private async processWebhookTrigger(automation: any, data: any): Promise<void> {
    // Implementation depends on webhook data
    logger.info('Processing webhook trigger', {
      automationId: automation.id,
      data
    });
  }

  /**
   * Evaluate step conditions
   */
  private async evaluateStepConditions(
    subscriberId: string,
    conditions: any
  ): Promise<boolean> {
    // Implementation would evaluate conditions
    return true;
  }

  /**
   * Queue next automation step
   */
  private async queueNextStep(enrollment: any, currentStep: any): Promise<void> {
    const nextStep = await prisma.client.emailAutomationStep.findFirst({
      where: {
        automationId: currentStep.automationId,
        order: { gt: currentStep.order }
      },
      orderBy: { order: 'asc' }
    });

    if (nextStep) {
      const delayMs = this.calculateDelay(nextStep.delayAmount, nextStep.delayUnit);

      await queueService.addJob(
        'email-marketing',
        'process-automation-step',
        {
          enrollmentId: enrollment.id,
          stepId: nextStep.id
        },
        {
          delay: delayMs
        }
      );
    } else {
      // Mark enrollment as completed
      await prisma.client.emailAutomationEnrollment.update({
        where: { id: enrollment.id },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      });

      // Update automation stats
      await prisma.client.emailAutomation.update({
        where: { id: currentStep.automationId },
        data: {
          totalCompleted: { increment: 1 }
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_ENROLLMENT_COMPLETED, {
        automationId: currentStep.automationId,
        enrollmentId: enrollment.id
      });
    }
  }

  /**
   * Calculate delay in milliseconds
   */
  private calculateDelay(amount: number, unit: string): number {
    const multipliers: Record<string, number> = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000
    };

    return amount * (multipliers[unit] || multipliers.hours);
  }
}
