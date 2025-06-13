// Webhook handler for email service provider callbacks

import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable } from '@/shared/decorators';
import { EmailTrackingService } from '../services/email-tracking.service';
import { EmailAnalyticsService } from '../services/email-analytics.service';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { logger } from '@/shared/logger';
import { AppError } from '@/shared/exceptions';
import * as crypto from 'crypto';

interface SendGridEvent {
  email: string;
  timestamp: number;
  event:
    | 'processed'
    | 'dropped'
    | 'delivered'
    | 'bounce'
    | 'deferred'
    | 'open'
    | 'click'
    | 'spamreport'
    | 'unsubscribe';
  sg_message_id: string;
  campaign_id?: string;
  reason?: string;
  type?: string;
  url?: string;
}

interface SESNotification {
  Type: string;
  Message: string;
  MessageId: string;
  Timestamp: string;
  Signature: string;
  SigningCertURL: string;
}

@Injectable()
export class EmailWebhookController {
  constructor(
    private readonly tracking: EmailTrackingService,
    private readonly analytics: EmailAnalyticsService,
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * SendGrid webhook handler
   */
  async handleSendGridWebhook(
    request: FastifyRequest<{
      Body: SendGridEvent[];
      Headers: {
        'x-twilio-email-event-webhook-signature': string;
        'x-twilio-email-event-webhook-timestamp': string;
      };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    // Verify webhook signature
    if (!this.verifySendGridSignature(request)) {
      throw new AppError('Invalid webhook signature', 401);
    }

    const events = request.body;
    const batchEvents: Array<{
      type: 'DELIVERED' | 'BOUNCED' | 'COMPLAINED';
      campaignId: string;
      recipientEmail: string;
      timestamp: Date;
      error?: string;
    }> = [];

    for (const event of events) {
      try {
        switch (event.event) {
          case 'delivered':
            batchEvents.push({
              type: 'DELIVERED',
              campaignId: event.campaign_id!,
              recipientEmail: event.email,
              timestamp: new Date(event.timestamp * 1000),
            });
            break;

          case 'bounce':
            await this.handleBounce(event);
            batchEvents.push({
              type: 'BOUNCED',
              campaignId: event.campaign_id!,
              recipientEmail: event.email,
              timestamp: new Date(event.timestamp * 1000),
              error: `${event.type}: ${event.reason}`,
            });
            break;

          case 'spamreport':
            await this.handleComplaint(event);
            batchEvents.push({
              type: 'COMPLAINED',
              campaignId: event.campaign_id!,
              recipientEmail: event.email,
              timestamp: new Date(event.timestamp * 1000),
            });
            break;

          case 'unsubscribe':
            await this.handleUnsubscribe(event);
            break;

          case 'open':
          case 'click':
            // These are handled by our own tracking
            break;
        }
      } catch (error) {
        logger.error('Failed to process webhook event', {
          event,
          error,
        });
      }
    }

    // Batch track events
    if (batchEvents.length > 0) {
      await this.tracking.batchTrackEvents(batchEvents);
    }

    reply.code(200).send({ received: true });
  }

  /**
   * AWS SES webhook handler
   */
  async handleSESWebhook(
    request: FastifyRequest<{
      Body: SESNotification;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const notification = request.body;

    // Handle subscription confirmation
    if (notification.Type === 'SubscriptionConfirmation') {
      // Would need to confirm SNS subscription
      logger.info('SES SNS subscription confirmation received');
      reply.code(200).send({ status: 'ok' });
      return;
    }

    // Verify SNS signature
    if (!this.verifySNSSignature(notification)) {
      throw new AppError('Invalid SNS signature', 401);
    }

    // Parse message
    const message = JSON.parse(notification.Message);

    try {
      switch (message.notificationType) {
        case 'Bounce':
          await this.handleSESBounce(message);
          break;

        case 'Complaint':
          await this.handleSESComplaint(message);
          break;

        case 'Delivery':
          await this.handleSESDelivery(message);
          break;
      }
    } catch (error) {
      logger.error('Failed to process SES notification', {
        message,
        error,
      });
    }

    reply.code(200).send({ status: 'ok' });
  }

  /**
   * Generic webhook handler (for custom implementations)
   */
  async handleGenericWebhook(
    request: FastifyRequest<{
      Params: { provider: string };
      Body: any;
      Headers: any;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { provider } = request.params;

    logger.info('Generic webhook received', {
      provider,
      headers: request.headers,
      body: request.body,
    });

    // Implement provider-specific handling
    switch (provider) {
      case 'mailgun':
        await this.handleMailgunWebhook(request.body);
        break;

      case 'postmark':
        await this.handlePostmarkWebhook(request.body);
        break;

      default:
        logger.warn('Unknown webhook provider', { provider });
    }

    reply.code(200).send({ received: true });
  }

  /**
   * Handle bounce events
   */
  private async handleBounce(event: any): Promise<void> {
    const email = event.email || event.mail?.destination?.[0];
    const bounceType = event.type || event.bounce?.bounceType || 'unknown';

    // Hard bounce - permanently unsubscribe
    if (bounceType === 'permanent' || bounceType === 'hard') {
      await this.prisma.client.emailListSubscriber.updateMany({
        where: { email },
        data: {
          subscribed: false,
          unsubscribedAt: new Date(),
          metadata: {
            bounceType,
            bounceReason: event.reason || event.bounce?.bouncedRecipients?.[0]?.diagnosticCode,
          },
        },
      });

      await this.eventBus.emit('email.hard.bounce', {
        email,
        reason: event.reason,
      });
    }

    // Soft bounce - track but don't unsubscribe
    await this.eventBus.emit('email.bounce', {
      email,
      type: bounceType,
      reason: event.reason,
    });
  }

  /**
   * Handle complaint/spam reports
   */
  private async handleComplaint(event: any): Promise<void> {
    const email = event.email || event.mail?.destination?.[0];

    // Immediately unsubscribe from all lists
    await this.prisma.client.emailListSubscriber.updateMany({
      where: { email },
      data: {
        subscribed: false,
        unsubscribedAt: new Date(),
        metadata: {
          unsubscribeReason: 'spam_complaint',
        },
      },
    });

    // Add to suppression list
    await this.prisma.client.emailUnsubscribe.create({
      data: {
        email,
        tenantId: 'system', // Use system tenant ID for global unsubscribes
        globalUnsubscribe: true,
        reason: 'spam_complaint',
        feedback: event.feedback || 'User marked email as spam',
      },
    });

    await this.eventBus.emit('email.complaint', {
      email,
      timestamp: new Date(),
    });
  }

  /**
   * Handle unsubscribe events
   */
  private async handleUnsubscribe(event: any): Promise<void> {
    const email = event.email;
    const campaignId = event.campaign_id;

    if (campaignId) {
      // Find the list from campaign
      const campaign = await this.prisma.client.emailCampaign.findUnique({
        where: { id: campaignId },
        select: { listId: true },
      });

      if (campaign?.listId) {
        await this.prisma.client.emailListSubscriber.updateMany({
          where: {
            email,
            listId: campaign.listId,
          },
          data: {
            subscribed: false,
            unsubscribedAt: new Date(),
          },
        });
      }
    } else {
      // Global unsubscribe
      await this.prisma.client.emailListSubscriber.updateMany({
        where: { email },
        data: {
          subscribed: false,
          unsubscribedAt: new Date(),
        },
      });
    }

    await this.eventBus.emit('email.webhook.unsubscribe', {
      email,
      campaignId,
      timestamp: new Date(),
    });
  }

  /**
   * Handle SES bounce notification
   */
  private async handleSESBounce(message: any): Promise<void> {
    const bounce = message.bounce;

    for (const recipient of bounce.bouncedRecipients) {
      await this.handleBounce({
        email: recipient.emailAddress,
        type: bounce.bounceType.toLowerCase(),
        reason: recipient.diagnosticCode,
      });
    }
  }

  /**
   * Handle SES complaint notification
   */
  private async handleSESComplaint(message: any): Promise<void> {
    const complaint = message.complaint;

    for (const recipient of complaint.complainedRecipients) {
      await this.handleComplaint({
        email: recipient.emailAddress,
        feedback: complaint.complaintFeedbackType,
      });
    }
  }

  /**
   * Handle SES delivery notification
   */
  private async handleSESDelivery(message: any): Promise<void> {
    const delivery = message.delivery;
    const recipients = delivery.recipients;

    // Track delivery events
    const events = recipients.map((email: string) => ({
      type: 'delivered' as const,
      campaignId: message.mail.headers?.find((h: any) => h.name === 'X-Campaign-ID')?.value,
      recipientEmail: email,
      timestamp: new Date(delivery.timestamp),
    }));

    if (events[0].campaignId) {
      await this.tracking.batchTrackEvents(events);
    }
  }

  /**
   * Handle Mailgun webhook
   */
  async handleMailgunWebhook(data: any): Promise<void> {
    const eventData = data['event-data'];

    switch (eventData.event) {
      case 'delivered':
      case 'bounced':
      case 'complained':
        await this.tracking.batchTrackEvents([
          {
            type:
              eventData.event === 'bounced' ? 'BOUNCED' : eventData.event === 'complained' ? 'COMPLAINED' : 'DELIVERED',
            campaignId: eventData['user-variables']?.['campaign-id'],
            recipientEmail: eventData.recipient,
            timestamp: new Date(eventData.timestamp * 1000),
            error: eventData.reason,
          },
        ]);
        break;
    }
  }

  /**
   * Handle Postmark webhook
   */
  async handlePostmarkWebhook(data: any): Promise<void> {
    switch (data.RecordType) {
      case 'Bounce':
        await this.handleBounce({
          email: data.Email,
          type: data.Type,
          reason: data.Description,
        });
        break;

      case 'SpamComplaint':
        await this.handleComplaint({
          email: data.Email,
        });
        break;
    }
  }

  /**
   * Verify SendGrid webhook signature
   */
  private verifySendGridSignature(request: FastifyRequest): boolean {
    const publicKey = process.env.SENDGRID_WEBHOOK_PUBLIC_KEY;
    if (!publicKey) {
      logger.warn('SendGrid webhook public key not configured');
      return true; // Allow in development
    }

    const signature = request.headers['x-twilio-email-event-webhook-signature'] as string;
    const timestamp = request.headers['x-twilio-email-event-webhook-timestamp'] as string;

    if (!signature || !timestamp) {
      return false;
    }

    const payload = timestamp + JSON.stringify(request.body);
    const expected = crypto.createVerify('sha256').update(payload).verify(publicKey, signature, 'base64');

    return expected;
  }

  /**
   * Verify AWS SNS signature
   */
  private verifySNSSignature(notification: SESNotification): boolean {
    // In production, implement proper SNS signature verification
    // using AWS SDK or manual verification
    return true;
  }
}
