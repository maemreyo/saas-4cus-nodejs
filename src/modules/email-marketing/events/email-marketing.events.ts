// Event definitions for email marketing module

export const EmailMarketingEvents = {
  // List events
  LIST_CREATED: 'email.list.created',
  LIST_UPDATED: 'email.list.updated',
  LIST_DELETED: 'email.list.deleted',
  LIST_CLEANED: 'email.list.cleaned',

  // Subscriber events
  SUBSCRIBER_ADDED: 'email.subscriber.added',
  SUBSCRIBER_CONFIRMED: 'email.subscriber.confirmed',
  SUBSCRIBER_UPDATED: 'email.subscriber.updated',
  SUBSCRIBER_UNSUBSCRIBED: 'email.subscriber.unsubscribed',
  SUBSCRIBERS_IMPORTED: 'email.subscribers.imported',

  // Campaign events
  CAMPAIGN_CREATED: 'email.campaign.created',
  CAMPAIGN_UPDATED: 'email.campaign.updated',
  CAMPAIGN_DELETED: 'email.campaign.deleted',
  CAMPAIGN_SCHEDULED: 'email.campaign.scheduled',
  CAMPAIGN_SENDING: 'email.campaign.sending',
  CAMPAIGN_SENT: 'email.campaign.sent',
  CAMPAIGN_PAUSED: 'email.campaign.paused',
  CAMPAIGN_RESUMED: 'email.campaign.resumed',
  CAMPAIGN_CANCELLED: 'email.campaign.cancelled',
  CAMPAIGN_COMPLETED: 'email.campaign.completed',
  CAMPAIGN_DUPLICATED: 'email.campaign.duplicated',

  // A/B Testing events
  ABTEST_CREATED: 'email.abtest.created',
  ABTEST_WINNER: 'email.abtest.winner',
  ABTEST_CONTROL_SENDING: 'email.abtest.control.sending',

  // Automation events
  AUTOMATION_CREATED: 'email.automation.created',
  AUTOMATION_UPDATED: 'email.automation.updated',
  AUTOMATION_ACTIVATED: 'email.automation.activated',
  AUTOMATION_DEACTIVATED: 'email.automation.deactivated',
  AUTOMATION_ENROLLED: 'email.automation.enrolled',
  AUTOMATION_COMPLETED: 'email.automation.completed',
  AUTOMATION_CANCELLED: 'email.automation.cancelled',
  AUTOMATION_STEP_ADDED: 'email.automation.step.added',
  AUTOMATION_STEP_SENT: 'email.automation.step.sent',

  // Template events
  TEMPLATE_CREATED: 'email.template.created',
  TEMPLATE_UPDATED: 'email.template.updated',
  TEMPLATE_DELETED: 'email.template.deleted',
  TEMPLATE_CLONED: 'email.template.cloned',
  TEMPLATE_ARCHIVED: 'email.template.archived',

  // Segment events
  SEGMENT_CREATED: 'email.segment.created',
  SEGMENT_UPDATED: 'email.segment.updated',
  SEGMENT_DELETED: 'email.segment.deleted',
  SEGMENT_SIZE_CHANGED: 'email.segment.size.changed',

  // Tracking events
  EMAIL_OPENED: 'email.opened',
  EMAIL_CLICKED: 'email.clicked',
  EMAIL_BOUNCED: 'email.bounced',
  EMAIL_COMPLAINED: 'email.complained',

  // Testing events
  TEST_EMAIL_SENT: 'email.test.sent'
} as const;

export type EmailMarketingEventType = typeof EmailMarketingEvents[keyof typeof EmailMarketingEvents];

// Event payload interfaces
export interface EmailListCreatedEvent {
  tenantId: string;
  listId: string;
  name: string;
}

export interface EmailSubscriberAddedEvent {
  listId: string;
  subscriberId: string;
  email: string;
  requiresConfirmation: boolean;
}

export interface EmailCampaignSendingEvent {
  tenantId: string;
  campaignId: string;
  recipientCount: number;
}

export interface EmailAutomationEnrolledEvent {
  automationId: string;
  subscriberId: string;
  enrollmentId: string;
}

export interface EmailABTestWinnerEvent {
  campaignId: string;
  variantId: string;
  variantName: string;
  metric: string;
  improvement: number;
}
