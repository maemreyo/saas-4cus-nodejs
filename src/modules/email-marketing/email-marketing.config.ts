import { z } from 'zod';

/**
 * Email marketing configuration schema
 */
export const emailMarketingConfigSchema = z.object({
  // Email sending limits
  sending: z.object({
    maxRecipientsPerCampaign: z.number().default(100000),
    maxEmailsPerHour: z.number().default(10000),
    maxEmailsPerDay: z.number().default(100000),
    batchSize: z.number().default(100),
    retryAttempts: z.number().default(3),
    retryDelay: z.number().default(5000), // milliseconds
  }),

  // List settings
  lists: z.object({
    maxListsPerTenant: z.number().default(100),
    maxSubscribersPerList: z.number().default(1000000),
    defaultDoubleOptIn: z.boolean().default(true),
    importBatchSize: z.number().default(1000),
    confirmationTokenExpiry: z.number().default(7 * 24 * 60 * 60 * 1000), // 7 days
  }),

  // Campaign settings
  campaigns: z.object({
    maxCampaignsPerMonth: z.number().default(1000),
    maxTestEmails: z.number().default(10),
    abTestMinRecipients: z.number().default(1000),
    abTestMaxDuration: z.number().default(24), // hours
    trackingPixelUrl: z.string().optional(),
  }),

  // Template settings
  templates: z.object({
    maxTemplatesPerTenant: z.number().default(500),
    maxTemplateSize: z.number().default(1024 * 1024), // 1MB
    maxPublicTemplates: z.number().default(50),
    thumbnailWidth: z.number().default(300),
    thumbnailHeight: z.number().default(400),
  }),

  // Automation settings
  automations: z.object({
    maxAutomationsPerTenant: z.number().default(100),
    maxStepsPerAutomation: z.number().default(50),
    maxActiveAutomations: z.number().default(20),
    minStepDelay: z.number().default(5), // minutes
    maxStepDelay: z.number().default(365 * 24 * 60), // 1 year in minutes
  }),

  // Tracking settings
  tracking: z.object({
    enableOpenTracking: z.boolean().default(true),
    enableClickTracking: z.boolean().default(true),
    trackingDomain: z.string().optional(),
    webhookSecret: z.string().optional(),
    activityRetentionDays: z.number().default(90),
  }),

  // Bounce handling
  bounces: z.object({
    hardBounceThreshold: z.number().default(1),
    softBounceThreshold: z.number().default(5),
    bounceCheckInterval: z.number().default(24), // hours
    autoUnsubscribeHardBounces: z.boolean().default(true),
  }),

  // Compliance settings
  compliance: z.object({
    requireUnsubscribeLink: z.boolean().default(true),
    requirePhysicalAddress: z.boolean().default(true),
    gdprEnabled: z.boolean().default(true),
    canSpamCompliant: z.boolean().default(true),
    defaultDataRetention: z.number().default(365), // days
  }),

  // Rate limiting
  rateLimits: z.object({
    apiCallsPerMinute: z.number().default(100),
    subscribersPerMinute: z.number().default(1000),
    campaignCreationPerHour: z.number().default(10),
  }),

  // Feature flags
  features: z.object({
    enableABTesting: z.boolean().default(true),
    enableAutomations: z.boolean().default(true),
    enableSegmentation: z.boolean().default(true),
    enableCustomFields: z.boolean().default(true),
    enableWebhooks: z.boolean().default(true),
    enableAdvancedAnalytics: z.boolean().default(true),
  }),
});

export type EmailMarketingConfig = z.infer<typeof emailMarketingConfigSchema>;

/**
 * Default email marketing configuration
 */
export const defaultEmailMarketingConfig: EmailMarketingConfig = {
  sending: {
    maxRecipientsPerCampaign: 100000,
    maxEmailsPerHour: 10000,
    maxEmailsPerDay: 100000,
    batchSize: 100,
    retryAttempts: 3,
    retryDelay: 5000,
  },
  lists: {
    maxListsPerTenant: 100,
    maxSubscribersPerList: 1000000,
    defaultDoubleOptIn: true,
    importBatchSize: 1000,
    confirmationTokenExpiry: 7 * 24 * 60 * 60 * 1000,
  },
  campaigns: {
    maxCampaignsPerMonth: 1000,
    maxTestEmails: 10,
    abTestMinRecipients: 1000,
    abTestMaxDuration: 24,
  },
  templates: {
    maxTemplatesPerTenant: 500,
    maxTemplateSize: 1024 * 1024,
    maxPublicTemplates: 50,
    thumbnailWidth: 300,
    thumbnailHeight: 400,
  },
  automations: {
    maxAutomationsPerTenant: 100,
    maxStepsPerAutomation: 50,
    maxActiveAutomations: 20,
    minStepDelay: 5,
    maxStepDelay: 365 * 24 * 60,
  },
  tracking: {
    enableOpenTracking: true,
    enableClickTracking: true,
    activityRetentionDays: 90,
  },
  bounces: {
    hardBounceThreshold: 1,
    softBounceThreshold: 5,
    bounceCheckInterval: 24,
    autoUnsubscribeHardBounces: true,
  },
  compliance: {
    requireUnsubscribeLink: true,
    requirePhysicalAddress: true,
    gdprEnabled: true,
    canSpamCompliant: true,
    defaultDataRetention: 365,
  },
  rateLimits: {
    apiCallsPerMinute: 100,
    subscribersPerMinute: 1000,
    campaignCreationPerHour: 10,
  },
  features: {
    enableABTesting: true,
    enableAutomations: true,
    enableSegmentation: true,
    enableCustomFields: true,
    enableWebhooks: true,
    enableAdvancedAnalytics: true,
  },
};

/**
 * Load email marketing configuration from environment
 */
export function loadEmailMarketingConfig(): EmailMarketingConfig {
  const config = { ...defaultEmailMarketingConfig };

  // Override with environment variables if set
  if (process.env.EMAIL_MAX_RECIPIENTS_PER_CAMPAIGN) {
    config.sending.maxRecipientsPerCampaign = parseInt(process.env.EMAIL_MAX_RECIPIENTS_PER_CAMPAIGN, 10);
  }

  if (process.env.EMAIL_MAX_PER_HOUR) {
    config.sending.maxEmailsPerHour = parseInt(process.env.EMAIL_MAX_PER_HOUR, 10);
  }

  if (process.env.EMAIL_MAX_PER_DAY) {
    config.sending.maxEmailsPerDay = parseInt(process.env.EMAIL_MAX_PER_DAY, 10);
  }

  if (process.env.EMAIL_BATCH_SIZE) {
    config.sending.batchSize = parseInt(process.env.EMAIL_BATCH_SIZE, 10);
  }

  if (process.env.EMAIL_TRACKING_DOMAIN) {
    config.tracking.trackingDomain = process.env.EMAIL_TRACKING_DOMAIN;
  }

  if (process.env.EMAIL_WEBHOOK_SECRET) {
    config.tracking.webhookSecret = process.env.EMAIL_WEBHOOK_SECRET;
  }

  if (process.env.EMAIL_ENABLE_OPEN_TRACKING !== undefined) {
    config.tracking.enableOpenTracking = process.env.EMAIL_ENABLE_OPEN_TRACKING === 'true';
  }

  if (process.env.EMAIL_ENABLE_CLICK_TRACKING !== undefined) {
    config.tracking.enableClickTracking = process.env.EMAIL_ENABLE_CLICK_TRACKING === 'true';
  }

  if (process.env.EMAIL_DEFAULT_DOUBLE_OPT_IN !== undefined) {
    config.lists.defaultDoubleOptIn = process.env.EMAIL_DEFAULT_DOUBLE_OPT_IN === 'true';
  }

  // Validate configuration
  return emailMarketingConfigSchema.parse(config);
}

/**
 * Get email marketing configuration
 */
export const emailMarketingConfig = loadEmailMarketingConfig();
