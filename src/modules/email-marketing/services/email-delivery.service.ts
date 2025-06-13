// Service for email delivery and sending

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EmailService } from '@/shared/services/email.service';
import { QueueService } from '@/shared/queue/queue.service';
import { EmailTrackingService } from './email-tracking.service';
import { EmailTemplateService } from './email-template.service';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { logger } from '@/shared/logger';
import {
  EmailCampaign,
  EmailCampaignRecipient,
  EmailListSubscriber,
  EmailAutomationStep,
  EmailDeliveryStatus,
  EmailActivityType
} from '@prisma/client';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';

export interface EmailContent {
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailOptions {
  to: string;
  from: {
    name: string;
    email: string;
  };
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailDeliveryService {
  private transporter: nodemailer.Transporter;
  private readonly sendingDomain: string;
  private readonly defaultFromEmail: string;
  private readonly maxRetries = 3;
  private readonly batchDelay = 100; // ms between emails

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly queue: QueueService,
    private readonly tracking: EmailTrackingService,
    private readonly templates: EmailTemplateService,
    private readonly redis: RedisService
  ) {
    this.sendingDomain = process.env.EMAIL_SENDING_DOMAIN || 'mail.example.com';
    this.defaultFromEmail = process.env.EMAIL_DEFAULT_FROM || 'noreply@example.com';
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter based on provider
   */
  private initializeTransporter(): void {
    const provider = process.env.EMAIL_PROVIDER || 'smtp';

    switch (provider) {
      case 'sendgrid':
        this.transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY!
          }
        });
        break;

      case 'ses':
        // AWS SES configuration
        this.transporter = nodemailer.createTransport({
          SES: {} // Would need AWS SDK configuration
        });
        break;

      case 'smtp':
      default:
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST!,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!
          }
        });
    }
  }

  /**
   * Send a test email for a campaign
   */
  async sendTestEmail(
    campaign: EmailCampaign,
    recipientEmail: string
  ): Promise<void> {
    const content = await this.renderEmail(campaign, {
      id: 'test',
      email: recipientEmail,
      firstName: 'Test',
      lastName: 'User'
    } as EmailListSubscriber);

    await this.sendEmail({
      to: recipientEmail,
      from: {
        name: campaign.fromName,
        email: campaign.fromEmail
      },
      replyTo: campaign.replyTo || undefined,
      subject: `[TEST] ${content.subject}`,
      html: content.html,
      text: content.text,
      headers: {
        'X-Campaign-ID': campaign.id,
        'X-Test-Email': 'true'
      }
    });

    logger.info('Test email sent', {
      campaignId: campaign.id,
      recipient: recipientEmail
    });
  }

  /**
   * Send campaign emails in batches
   */
  async sendCampaignBatch(
    campaignId: string,
    recipientIds: string[],
    options?: {
      batchSize?: number;
      delayBetweenBatches?: number;
    }
  ): Promise<{
    sent: number;
    failed: number;
    errors: Array<{ recipientId: string; error: string }>;
  }> {
    const campaign = await this.prisma.client.emailCampaign.findUnique({
      where: { id: campaignId },
      include: {
        list: true
      }
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as Array<{ recipientId: string; error: string }>
    };

    // Process recipients in smaller chunks
    const chunkSize = options?.batchSize || 10;

    for (let i = 0; i < recipientIds.length; i += chunkSize) {
      const chunk = recipientIds.slice(i, i + chunkSize);

      await Promise.all(
        chunk.map(async (recipientId) => {
          try {
            await this.sendCampaignEmail(campaign, recipientId);
            results.sent++;
          } catch (error: any) {
            results.failed++;
            results.errors.push({
              recipientId,
              error: error.message
            });

            logger.error('Failed to send campaign email', {
              campaignId,
              recipientId,
              error
            });
          }
        })
      );

      // Delay between chunks
      if (i + chunkSize < recipientIds.length) {
        await this.delay(options?.delayBetweenBatches || this.batchDelay);
      }
    }

    return results;
  }

  /**
   * Send a single campaign email
   */
  private async sendCampaignEmail(
    campaign: EmailCampaign,
    recipientId: string
  ): Promise<void> {
    // Get recipient with subscriber info
    const recipient = await this.prisma.client.emailCampaignRecipient.findUnique({
      where: { id: recipientId },
      include: {
        subscriber: true
      }
    });

    if (!recipient || !recipient.subscriber) {
      throw new Error('Recipient not found');
    }

    // Check if already sent
    if (recipient.sentAt) {
      logger.warn('Email already sent to recipient', {
        campaignId: campaign.id,
        recipientId
      });
      return;
    }

    // Check subscriber status
    if (!recipient.subscriber.subscribed || !recipient.subscriber.confirmed) {
      await this.prisma.client.emailCampaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: EmailDeliveryStatus.FAILED,
          error: 'Subscriber not active'
        }
      });
      throw new Error('Subscriber not active');
    }

    // Render email content
    const content = await this.renderEmail(campaign, recipient.subscriber);

    // Process for tracking
    const processedContent = this.tracking.processEmailForTracking(content.html, {
      campaignId: campaign.id,
      recipientId: recipient.id,
      trackOpens: campaign.trackOpens,
      trackClicks: campaign.trackClicks,
      utmParams: campaign.utmParams as any
    });

    // Send email
    try {
      await this.sendEmail({
        to: recipient.subscriber.email,
        from: {
          name: campaign.fromName,
          email: campaign.fromEmail
        },
        replyTo: campaign.replyTo || undefined,
        subject: content.subject,
        html: processedContent,
        text: content.text,
        headers: {
          'X-Campaign-ID': campaign.id,
          'X-Recipient-ID': recipient.id,
          'List-Unsubscribe': this.generateUnsubscribeHeader(
            campaign.listId || '',
            recipient.subscriber.email
          )
        }
      });

      // Update recipient status
      await this.prisma.client.emailCampaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: EmailDeliveryStatus.SENT,
          sentAt: new Date()
        }
      });

      // Track sent event
      await this.tracking.batchTrackEvents([{
        type: EmailActivityType.DELIVERED,
        campaignId: campaign.id,
        recipientEmail: recipient.subscriber.email,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      // Update recipient with error
      await this.prisma.client.emailCampaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: EmailDeliveryStatus.FAILED,
          error: error.message
        }
      });

      throw error;
    }
  }

  /**
   * Send automation email
   */
  async sendAutomationEmail(
    step: EmailAutomationStep & { automation: any; template?: any },
    subscriber: EmailListSubscriber,
    metadata?: any
  ): Promise<void> {
    // Render content
    const data = {
      ...this.getSubscriberData(subscriber),
      ...metadata
    };

    let content: EmailContent;

    if (step.template) {
      content = await this.templates.renderTemplate(
        step.template.id,
        data,
        step.automation.tenantId
      );
    } else {
      const subjectTemplate = handlebars.compile(step.subject);
      const htmlTemplate = handlebars.compile(step.htmlContent);
      const textTemplate = step.textContent ? handlebars.compile(step.textContent) : null;

      content = {
        subject: subjectTemplate(data),
        html: htmlTemplate(data),
        text: textTemplate ? textTemplate(data) : undefined
      };
    }

    // Get list for sender info
    const list = await this.prisma.client.emailList.findUnique({
      where: { id: step.automation.listId }
    });

    if (!list) {
      throw new Error('List not found for automation');
    }

    // Send email
    await this.sendEmail({
      to: subscriber.email,
      from: {
        name: list.defaultFromName || 'Company',
        email: list.defaultFromEmail || this.defaultFromEmail
      },
      replyTo: list.defaultReplyTo || undefined,
      subject: content.subject,
      html: content.html,
      text: content.text,
      headers: {
        'X-Automation-ID': step.automationId,
        'X-Step-ID': step.id,
        'List-Unsubscribe': this.generateUnsubscribeHeader(
          list.id,
          subscriber.email
        )
      }
    });

    logger.info('Automation email sent', {
      automationId: step.automationId,
      stepId: step.id,
      subscriber: subscriber.email
    });
  }

  /**
   * Render email content with personalization
   */
  async renderEmail(
    campaign: EmailCampaign,
    subscriber?: EmailListSubscriber | null
  ): Promise<EmailContent> {
    const data = {
      // Campaign data
      campaignName: campaign.name,

      // Subscriber data
      ...(subscriber ? this.getSubscriberData(subscriber) : {
        email: 'subscriber@example.com',
        firstName: 'Subscriber',
        lastName: '',
        fullName: 'Subscriber'
      }),

      // System data
      currentYear: new Date().getFullYear(),
      companyName: process.env.COMPANY_NAME || 'Company',

      // URLs
      unsubscribeUrl: subscriber ?
        this.generateUnsubscribeUrl(campaign.listId || '', subscriber.email) :
        '{{unsubscribe_url}}',
      preferencesUrl: subscriber ?
        this.generatePreferencesUrl(subscriber.email) :
        '{{preferences_url}}',
      viewInBrowserUrl: this.generateViewInBrowserUrl(campaign.id, subscriber?.id)
    };

    // Compile templates
    const subjectTemplate = handlebars.compile(campaign.subject);
    const htmlTemplate = handlebars.compile(campaign.htmlContent);
    const textTemplate = campaign.textContent ?
      handlebars.compile(campaign.textContent) : null;

    return {
      subject: subjectTemplate(data),
      html: htmlTemplate(data),
      text: textTemplate ? textTemplate(data) : this.generateTextFromHtml(htmlTemplate(data))
    };
  }

  /**
   * Send email via transporter
   */
  private async sendEmail(options: SendEmailOptions): Promise<void> {
    const maxRetries = this.maxRetries;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.transporter.sendMail({
          from: `${options.from.name} <${options.from.email}>`,
          to: options.to,
          replyTo: options.replyTo,
          subject: options.subject,
          html: options.html,
          text: options.text,
          headers: options.headers,
          attachments: options.attachments
        });

        return; // Success
      } catch (error: any) {
        lastError = error;

        logger.warn(`Email send attempt ${attempt} failed`, {
          to: options.to,
          error: error.message
        });

        // Check if retryable
        if (!this.isRetryableError(error) || attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw lastError;
  }

  /**
   * Get subscriber data for templates
   */
  private getSubscriberData(subscriber: EmailListSubscriber): Record<string, any> {
    return {
      email: subscriber.email,
      firstName: subscriber.firstName || '',
      lastName: subscriber.lastName || '',
      fullName: [subscriber.firstName, subscriber.lastName]
        .filter(Boolean)
        .join(' ') || subscriber.email,
      ...subscriber.customData as any
    };
  }

  /**
   * Generate unsubscribe URL
   */
  private generateUnsubscribeUrl(listId: string, email: string): string {
    const token = Buffer.from(`${listId}:${email}`).toString('base64url');
    return `${process.env.APP_URL}/unsubscribe/${token}`;
  }

  /**
   * Generate preferences URL
   */
  private generatePreferencesUrl(email: string): string {
    const token = Buffer.from(email).toString('base64url');
    return `${process.env.APP_URL}/preferences/${token}`;
  }

  /**
   * Generate view in browser URL
   */
  private generateViewInBrowserUrl(campaignId: string, subscriberId?: string): string {
    const data = subscriberId ? `${campaignId}:${subscriberId}` : campaignId;
    const token = Buffer.from(data).toString('base64url');
    return `${process.env.APP_URL}/view/${token}`;
  }

  /**
   * Generate unsubscribe header
   */
  private generateUnsubscribeHeader(listId: string, email: string): string {
    const url = this.generateUnsubscribeUrl(listId, email);
    const mailtoUrl = `mailto:unsubscribe@${this.sendingDomain}?subject=Unsubscribe`;
    return `<${url}>, <${mailtoUrl}>`;
  }

  /**
   * Generate text content from HTML
   */
  private generateTextFromHtml(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    const retryableCodes = [
      'ECONNREFUSED',
      'ECONNRESET',
      'ETIMEDOUT',
      'ENETUNREACH',
      'EAI_AGAIN'
    ];

    return retryableCodes.includes(error.code) ||
           (error.responseCode && error.responseCode >= 500);
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
