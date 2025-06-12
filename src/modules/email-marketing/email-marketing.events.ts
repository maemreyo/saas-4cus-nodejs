import { Service } from 'typedi';
import { eventBus } from '@shared/events/event-bus';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';
import { NotificationService } from '../notification';

/**
 * Email marketing event names
 */
export enum EmailMarketingEvents {
  // List events
  LIST_CREATED = 'email.list.created',
  LIST_UPDATED = 'email.list.updated',
  LIST_DELETED = 'email.list.deleted',
  LIST_STATUS_CHANGED = 'email.list.status_changed',

  // Subscriber events
  SUBSCRIBER_ADDED = 'email.subscriber.added',
  SUBSCRIBER_UPDATED = 'email.subscriber.updated',
  SUBSCRIBER_REMOVED = 'email.subscriber.removed',
  SUBSCRIBER_CONFIRMED = 'email.subscriber.confirmed',
  SUBSCRIBER_RESUBSCRIBED = 'email.subscriber.resubscribed',
  SUBSCRIBER_TAGS_UPDATED = 'email.subscriber.tags_updated',
  SUBSCRIBERS_IMPORTED = 'email.subscribers.imported',

  // Campaign events
  CAMPAIGN_CREATED = 'email.campaign.created',
  CAMPAIGN_UPDATED = 'email.campaign.updated',
  CAMPAIGN_DELETED = 'email.campaign.deleted',
  CAMPAIGN_SCHEDULED = 'email.campaign.scheduled',
  CAMPAIGN_SENDING = 'email.campaign.sending',
  CAMPAIGN_PAUSED = 'email.campaign.paused',
  CAMPAIGN_RESUMED = 'email.campaign.resumed',
  CAMPAIGN_CANCELLED = 'email.campaign.cancelled',
  CAMPAIGN_COMPLETED = 'email.campaign.completed',
  CAMPAIGN_AB_TEST_WINNER_SELECTED = 'email.campaign.ab_test_winner_selected',

  // Email activity events
  EMAIL_SENT = 'email.activity.sent',
  EMAIL_DELIVERED = 'email.activity.delivered',
  EMAIL_OPENED = 'email.activity.opened',
  EMAIL_CLICKED = 'email.activity.clicked',
  EMAIL_BOUNCED = 'email.activity.bounced',
  EMAIL_UNSUBSCRIBED = 'email.activity.unsubscribed',
  EMAIL_COMPLAINED = 'email.activity.complained',

  // Template events
  TEMPLATE_CREATED = 'email.template.created',
  TEMPLATE_UPDATED = 'email.template.updated',
  TEMPLATE_DELETED = 'email.template.deleted',

  // Segment events
  SEGMENT_CREATED = 'email.segment.created',
  SEGMENT_UPDATED = 'email.segment.updated',
  SEGMENT_DELETED = 'email.segment.deleted',

  // Automation events
  AUTOMATION_CREATED = 'email.automation.created',
  AUTOMATION_UPDATED = 'email.automation.updated',
  AUTOMATION_DELETED = 'email.automation.deleted',
  AUTOMATION_ACTIVATED = 'email.automation.activated',
  AUTOMATION_DEACTIVATED = 'email.automation.deactivated',
  AUTOMATION_STEP_ADDED = 'email.automation.step_added',
  AUTOMATION_STEP_UPDATED = 'email.automation.step_updated',
  AUTOMATION_STEP_DELETED = 'email.automation.step_deleted',
  AUTOMATION_STEP_SENT = 'email.automation.step_sent',
  AUTOMATION_ENROLLMENT_STARTED = 'email.automation.enrollment_started',
  AUTOMATION_ENROLLMENT_COMPLETED = 'email.automation.enrollment_completed',
  AUTOMATION_ENROLLMENT_CANCELLED = 'email.automation.enrollment_cancelled',

  // Report events
  DAILY_REPORT_GENERATED = 'email.report.daily_generated',
}

/**
 * Email marketing event handlers
 */
@Service()
export class EmailMarketingEventHandlers {
  private notificationService: NotificationService;

  constructor() {
    this.registerHandlers();
  }

  /**
   * Register event handlers
   */
  private registerHandlers(): void {
    // List events
    eventBus.on(EmailMarketingEvents.LIST_CREATED, this.handleListCreated.bind(this));
    eventBus.on(EmailMarketingEvents.LIST_STATUS_CHANGED, this.handleListStatusChanged.bind(this));

    // Subscriber events
    eventBus.on(EmailMarketingEvents.SUBSCRIBER_ADDED, this.handleSubscriberAdded.bind(this));
    eventBus.on(EmailMarketingEvents.SUBSCRIBER_CONFIRMED, this.handleSubscriberConfirmed.bind(this));
    eventBus.on(EmailMarketingEvents.SUBSCRIBERS_IMPORTED, this.handleSubscribersImported.bind(this));

    // Campaign events
    eventBus.on(EmailMarketingEvents.CAMPAIGN_SCHEDULED, this.handleCampaignScheduled.bind(this));
    eventBus.on(EmailMarketingEvents.CAMPAIGN_COMPLETED, this.handleCampaignCompleted.bind(this));

    // Email activity events
    eventBus.on(EmailMarketingEvents.EMAIL_BOUNCED, this.handleEmailBounced.bind(this));
    eventBus.on(EmailMarketingEvents.EMAIL_COMPLAINED, this.handleEmailComplained.bind(this));

    // Automation events
    eventBus.on(EmailMarketingEvents.AUTOMATION_ACTIVATED, this.handleAutomationActivated.bind(this));
    eventBus.on(EmailMarketingEvents.AUTOMATION_ENROLLMENT_COMPLETED, this.handleEnrollmentCompleted.bind(this));

    // Report events
    eventBus.on(EmailMarketingEvents.DAILY_REPORT_GENERATED, this.handleDailyReportGenerated.bind(this));

    logger.info('Email marketing event handlers registered');
  }

  /**
   * Handle list created event
   */
  private async handleListCreated(data: any): Promise<void> {
    logger.info('Email list created', data);

    // Send notification to owner
    await this.notificationService.create({
      userId: data.userId,
      type: 'email_list_created',
      title: 'Email List Created',
      message: `Your email list has been created successfully.`,
      data: {
        listId: data.listId,
      },
    });
  }

  /**
   * Handle list status changed event
   */
  private async handleListStatusChanged(data: any): Promise<void> {
    logger.info('Email list status changed', data);

    // Update related campaigns if list is archived
    if (data.status === 'ARCHIVED') {
      await queueService.addJob('email-marketing', 'pause-list-campaigns', { listId: data.listId });
    }
  }

  /**
   * Handle subscriber added event
   */
  private async handleSubscriberAdded(data: any): Promise<void> {
    logger.info('Subscriber added', data);

    // Update segment counts
    await queueService.addJob('email-marketing', 'update-list-segments', { listId: data.listId });

    // Track analytics
    await eventBus.emit('analytics.track', {
      event: 'subscriber_added',
      properties: {
        listId: data.listId,
        subscriberId: data.subscriberId,
      },
    });
  }

  /**
   * Handle subscriber confirmed event
   */
  private async handleSubscriberConfirmed(data: any): Promise<void> {
    logger.info('Subscriber confirmed', data);

    // Send welcome email if configured
    if (data.welcomeEmailId) {
      await queueService.addJob('email-marketing', 'send-welcome-email', {
        listId: data.listId,
        subscriberId: data.subscriberId,
        welcomeEmailId: data.welcomeEmailId,
      });
    }
  }

  /**
   * Handle subscribers imported event
   */
  private async handleSubscribersImported(data: any): Promise<void> {
    logger.info('Subscribers imported', data);

    // Send import completion notification
    await this.notificationService.create({
      userId: data.userId,
      type: 'import_completed',
      title: 'Import Completed',
      message: `Import completed: ${data.imported} added, ${data.updated} updated, ${data.failed} failed.`,
      data: {
        listId: data.listId,
        imported: data.imported,
        updated: data.updated,
        failed: data.failed,
      },
    });
  }

  /**
   * Handle campaign scheduled event
   */
  private async handleCampaignScheduled(data: any): Promise<void> {
    logger.info('Campaign scheduled', data);

    // Send scheduled notification
    await this.notificationService.create({
      userId: data.userId,
      type: 'campaign_scheduled',
      title: 'Campaign Scheduled',
      message: `Your campaign has been scheduled for ${new Date(data.scheduledAt).toLocaleString()}.`,
      data: {
        campaignId: data.campaignId,
        scheduledAt: data.scheduledAt,
      },
    });
  }

  /**
   * Handle campaign completed event
   */
  private async handleCampaignCompleted(data: any): Promise<void> {
    logger.info('Campaign completed', data);

    // Calculate final stats
    await queueService.addJob('email-marketing', 'calculate-campaign-stats', { campaignId: data.campaignId });

    // Send completion notification
    await this.notificationService.create({
      userId: data.userId,
      type: 'campaign_completed',
      title: 'Campaign Completed',
      message: 'Your email campaign has been sent successfully.',
      data: {
        campaignId: data.campaignId,
      },
    });
  }

  /**
   * Handle email bounced event
   */
  private async handleEmailBounced(data: any): Promise<void> {
    logger.info('Email bounced', data);

    // Track bounce rate
    if (data.bounceType === 'hard') {
      await eventBus.emit('analytics.track', {
        event: 'hard_bounce',
        properties: {
          campaignId: data.campaignId,
          subscriberId: data.subscriberId,
          reason: data.reason,
        },
      });
    }
  }

  /**
   * Handle email complained event
   */
  private async handleEmailComplained(data: any): Promise<void> {
    logger.info('Email complaint received', data);

    // Alert admin about complaint
    await this.notificationService.sendToAdmins({
      type: 'spam_complaint',
      title: 'Spam Complaint Received',
      message: `A spam complaint was received for campaign ${data.campaignId}.`,
      severity: 'warning',
      data: {
        campaignId: data.campaignId,
        subscriberId: data.subscriberId,
      },
    });
  }

  /**
   * Handle automation activated event
   */
  private async handleAutomationActivated(data: any): Promise<void> {
    logger.info('Automation activated', data);

    // Track activation
    await eventBus.emit('analytics.track', {
      event: 'automation_activated',
      properties: {
        automationId: data.automationId,
      },
    });
  }

  /**
   * Handle enrollment completed event
   */
  private async handleEnrollmentCompleted(data: any): Promise<void> {
    logger.info('Automation enrollment completed', data);

    // Update automation metrics
    await eventBus.emit('analytics.track', {
      event: 'automation_completed',
      properties: {
        automationId: data.automationId,
        enrollmentId: data.enrollmentId,
      },
    });
  }

  /**
   * Handle daily report generated event
   */
  private async handleDailyReportGenerated(data: any): Promise<void> {
    logger.info('Daily report generated', data);

    // Send report to admins
    await this.notificationService.sendToAdmins({
      type: 'daily_email_report',
      title: 'Daily Email Marketing Report',
      message: `Daily report for ${data.date.toDateString()} is ready.`,
      data: {
        ...data,
        reportUrl: `/admin/email-marketing/reports/${data.date.toISOString().split('T')[0]}`,
      },
    });
  }
}
