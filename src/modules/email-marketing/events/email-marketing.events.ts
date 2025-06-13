// Email marketing event definitions

/**
 * Email marketing event types
 */
export enum EmailMarketingEventType {
  // Campaign events
  CAMPAIGN_CREATED = 'email.campaign.created',
  CAMPAIGN_UPDATED = 'email.campaign.updated',
  CAMPAIGN_DELETED = 'email.campaign.deleted',
  CAMPAIGN_SCHEDULED = 'email.campaign.scheduled',
  CAMPAIGN_SEND_STARTED = 'email.campaign.send.started',
  CAMPAIGN_PAUSED = 'email.campaign.paused',
  CAMPAIGN_RESUMED = 'email.campaign.resumed',
  CAMPAIGN_COMPLETED = 'email.campaign.completed',
  CAMPAIGN_FAILED = 'email.campaign.failed',

  // Email delivery events
  EMAIL_SENT = 'email.sent',
  EMAIL_DELIVERED = 'email.delivered',
  EMAIL_OPENED = 'email.opened',
  EMAIL_CLICKED = 'email.clicked',
  EMAIL_BOUNCED = 'email.bounced',
  EMAIL_COMPLAINED = 'email.complained',
  EMAIL_UNSUBSCRIBED = 'email.unsubscribed',

  // Subscriber events
  SUBSCRIBER_ADDED = 'email.subscriber.added',
  SUBSCRIBER_UPDATED = 'email.subscriber.updated',
  SUBSCRIBER_REMOVED = 'email.subscriber.removed',
  SUBSCRIBER_UNSUBSCRIBED = 'email.subscriber.unsubscribed',

  // List events
  LIST_CREATED = 'email.list.created',
  LIST_UPDATED = 'email.list.updated',
  LIST_DELETED = 'email.list.deleted',

  // Automation events
  AUTOMATION_CREATED = 'email.automation.created',
  AUTOMATION_UPDATED = 'email.automation.updated',
  AUTOMATION_DELETED = 'email.automation.deleted',
  AUTOMATION_ACTIVATED = 'email.automation.activated',
  AUTOMATION_DEACTIVATED = 'email.automation.deactivated',
  AUTOMATION_ENROLLMENT_STARTED = 'email.automation.enrollment.started',
  AUTOMATION_ENROLLMENT_COMPLETED = 'email.automation.enrollment.completed',
  AUTOMATION_ENROLLMENT_CANCELLED = 'email.automation.enrollment.cancelled',

  // Template events
  TEMPLATE_CREATED = 'email.template.created',
  TEMPLATE_UPDATED = 'email.template.updated',
  TEMPLATE_DELETED = 'email.template.deleted'
}

/**
 * Base interface for all email marketing events
 */
export interface EmailMarketingEvent {
  tenantId?: string;
  timestamp: Date;
}

/**
 * Campaign event interfaces
 */
export interface CampaignEvent extends EmailMarketingEvent {
  campaignId: string;
}

export interface CampaignCreatedEvent extends CampaignEvent {
  name: string;
  type: string;
}

export interface CampaignSendStartedEvent extends CampaignEvent {
  jobId: string | number;
}

export interface CampaignCompletedEvent extends CampaignEvent {
  completedAt: Date;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
  };
}

/**
 * Email delivery event interfaces
 */
export interface EmailDeliveryEvent extends EmailMarketingEvent {
  campaignId?: string;
  automationId?: string;
  emailId: string;
  recipientId: string;
  recipientEmail: string;
}

export interface EmailOpenedEvent extends EmailDeliveryEvent {
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export interface EmailClickedEvent extends EmailDeliveryEvent {
  timestamp: Date;
  url: string;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export interface EmailBouncedEvent extends EmailDeliveryEvent {
  type: 'hard' | 'soft';
  reason?: string;
  diagnosticCode?: string;
}

/**
 * Subscriber event interfaces
 */
export interface SubscriberEvent extends EmailMarketingEvent {
  subscriberId: string;
  email: string;
  listId?: string;
}

export interface SubscriberAddedEvent extends SubscriberEvent {
  source: 'import' | 'api' | 'form' | 'manual';
  metadata?: Record<string, any>;
}

export interface SubscriberUnsubscribedEvent extends SubscriberEvent {
  campaignId?: string;
  reason?: string;
}

/**
 * List event interfaces
 */
export interface ListEvent extends EmailMarketingEvent {
  listId: string;
  name: string;
}

/**
 * Automation event interfaces
 */
export interface AutomationEvent extends EmailMarketingEvent {
  automationId: string;
  name?: string;
}

export interface AutomationEnrollmentEvent extends AutomationEvent {
  enrollmentId: string;
  subscriberId: string;
  email?: string;
}
