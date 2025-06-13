// Configuration for email marketing module

import { logger } from '@/shared/logger';
import { z } from 'zod';

export const emailMarketingConfigSchema = z.object({
  enabled: z.boolean().default(true),

  // Provider settings
  provider: z.enum(['sendgrid', 'ses', 'smtp', 'mailgun', 'postmark']).default('smtp'),
  sendgridApiKey: z.string().optional(),
  sesRegion: z.string().default('us-east-1'),

  // SMTP settings
  smtp: z.object({
    host: z.string(),
    port: z.number(),
    secure: z.boolean().default(false),
    user: z.string(),
    pass: z.string()
  }).optional(),

  // Sending limits
  limits: z.object({
    maxRecipientsPerCampaign: z.number().default(100000),
    maxPerHour: z.number().default(10000),
    maxPerDay: z.number().default(100000),
    batchSize: z.number().default(100),
    delayBetweenBatches: z.number().default(1000) // ms
  }),

  // Tracking settings
  tracking: z.object({
    domain: z.string(),
    secret: z.string(),
    enableOpenTracking: z.boolean().default(true),
    enableClickTracking: z.boolean().default(true)
  }),

  // List settings
  lists: z.object({
    defaultDoubleOptIn: z.boolean().default(true),
    maxSubscribersPerList: z.number().default(1000000),
    importBatchSize: z.number().default(1000),
    cleanupInactiveDays: z.number().default(180)
  }),

  // Campaign settings
  campaigns: z.object({
    defaultFromName: z.string().default('Company'),
    defaultFromEmail: z.string().email(),
    defaultReplyTo: z.string().email().optional(),
    maxTestEmails: z.number().default(10)
  }),

  // Automation settings
  automations: z.object({
    maxStepsPerAutomation: z.number().default(20),
    maxActiveAutomations: z.number().default(100),
    maxEnrollmentsPerDay: z.number().default(10000)
  }),

  // A/B Testing settings
  abTesting: z.object({
    minSampleSize: z.number().default(1000),
    defaultTestPercentage: z.number().default(20),
    minTestDuration: z.number().default(4), // hours
    confidenceThreshold: z.number().default(95) // percentage
  }),

  // Template settings
  templates: z.object({
    maxTemplates: z.number().default(1000),
    maxTemplateSize: z.number().default(512000), // 500KB
    allowPublicTemplates: z.boolean().default(true)
  }),

  // Webhook settings
  webhooks: z.object({
    sendgridPublicKey: z.string().optional(),
    verifySignatures: z.boolean().default(true),
    retryFailedWebhooks: z.boolean().default(true),
    maxRetries: z.number().default(3)
  }),

  // Anti-spam settings
  antiSpam: z.object({
    maxSubscribeAttemptsPerHour: z.number().default(5),
    maxUnsubscribeAttemptsPerHour: z.number().default(10),
    blockSuspiciousIPs: z.boolean().default(true),
    honeypotField: z.string().default('_email_confirm')
  }),

  // Analytics settings
  analytics: z.object({
    retentionDays: z.number().default(365),
    aggregationInterval: z.number().default(3600), // seconds
    enableRealtimeStats: z.boolean().default(true)
  }),

  // Compliance settings
  compliance: z.object({
    gdprEnabled: z.boolean().default(true),
    canSpamCompliant: z.boolean().default(true),
    requireUnsubscribeLink: z.boolean().default(true),
    requirePhysicalAddress: z.boolean().default(true)
  })
});

export type EmailMarketingConfig = z.infer<typeof emailMarketingConfigSchema>;

/**
 * Get email marketing configuration
 */
export function getEmailMarketingConfig(): EmailMarketingConfig {
  return emailMarketingConfigSchema.parse({
    enabled: process.env.EMAIL_MARKETING_ENABLED === 'true',

    provider: process.env.EMAIL_PROVIDER,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    sesRegion: process.env.AWS_REGION,

    smtp: process.env.SMTP_HOST ? {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!
    } : undefined,

    limits: {
      maxRecipientsPerCampaign: parseInt(process.env.EMAIL_MAX_RECIPIENTS_PER_CAMPAIGN || '100000'),
      maxPerHour: parseInt(process.env.EMAIL_MAX_PER_HOUR || '10000'),
      maxPerDay: parseInt(process.env.EMAIL_MAX_PER_DAY || '100000'),
      batchSize: parseInt(process.env.EMAIL_BATCH_SIZE || '100'),
      delayBetweenBatches: parseInt(process.env.EMAIL_BATCH_DELAY || '1000')
    },

    tracking: {
      domain: process.env.EMAIL_TRACKING_DOMAIN || 'https://track.example.com',
      secret: process.env.EMAIL_TRACKING_SECRET || 'default-secret',
      enableOpenTracking: process.env.EMAIL_ENABLE_OPEN_TRACKING !== 'false',
      enableClickTracking: process.env.EMAIL_ENABLE_CLICK_TRACKING !== 'false'
    },

    lists: {
      defaultDoubleOptIn: process.env.EMAIL_DEFAULT_DOUBLE_OPT_IN !== 'false',
      maxSubscribersPerList: parseInt(process.env.EMAIL_MAX_SUBSCRIBERS_PER_LIST || '1000000'),
      importBatchSize: parseInt(process.env.EMAIL_IMPORT_BATCH_SIZE || '1000'),
      cleanupInactiveDays: parseInt(process.env.EMAIL_CLEANUP_INACTIVE_DAYS || '180')
    },

    campaigns: {
      defaultFromName: process.env.EMAIL_DEFAULT_FROM_NAME || 'Company',
      defaultFromEmail: process.env.EMAIL_DEFAULT_FROM_EMAIL || 'noreply@example.com',
      defaultReplyTo: process.env.EMAIL_DEFAULT_REPLY_TO,
      maxTestEmails: parseInt(process.env.EMAIL_MAX_TEST_EMAILS || '10')
    },

    automations: {
      maxStepsPerAutomation: parseInt(process.env.EMAIL_MAX_AUTOMATION_STEPS || '20'),
      maxActiveAutomations: parseInt(process.env.EMAIL_MAX_ACTIVE_AUTOMATIONS || '100'),
      maxEnrollmentsPerDay: parseInt(process.env.EMAIL_MAX_ENROLLMENTS_PER_DAY || '10000')
    },

    abTesting: {
      minSampleSize: parseInt(process.env.EMAIL_AB_MIN_SAMPLE_SIZE || '1000'),
      defaultTestPercentage: parseInt(process.env.EMAIL_AB_DEFAULT_TEST_PERCENTAGE || '20'),
      minTestDuration: parseInt(process.env.EMAIL_AB_MIN_TEST_DURATION || '4'),
      confidenceThreshold: parseInt(process.env.EMAIL_AB_CONFIDENCE_THRESHOLD || '95')
    },

    templates: {
      maxTemplates: parseInt(process.env.EMAIL_MAX_TEMPLATES || '1000'),
      maxTemplateSize: parseInt(process.env.EMAIL_MAX_TEMPLATE_SIZE || '512000'),
      allowPublicTemplates: process.env.EMAIL_ALLOW_PUBLIC_TEMPLATES !== 'false'
    },

    webhooks: {
      sendgridPublicKey: process.env.SENDGRID_WEBHOOK_PUBLIC_KEY,
      verifySignatures: process.env.EMAIL_VERIFY_WEBHOOK_SIGNATURES !== 'false',
      retryFailedWebhooks: process.env.EMAIL_RETRY_FAILED_WEBHOOKS !== 'false',
      maxRetries: parseInt(process.env.EMAIL_WEBHOOK_MAX_RETRIES || '3')
    },

    antiSpam: {
      maxSubscribeAttemptsPerHour: parseInt(process.env.EMAIL_MAX_SUBSCRIBE_ATTEMPTS || '5'),
      maxUnsubscribeAttemptsPerHour: parseInt(process.env.EMAIL_MAX_UNSUBSCRIBE_ATTEMPTS || '10'),
      blockSuspiciousIPs: process.env.EMAIL_BLOCK_SUSPICIOUS_IPS !== 'false',
      honeypotField: process.env.EMAIL_HONEYPOT_FIELD || '_email_confirm'
    },

    analytics: {
      retentionDays: parseInt(process.env.EMAIL_ANALYTICS_RETENTION_DAYS || '365'),
      aggregationInterval: parseInt(process.env.EMAIL_ANALYTICS_AGGREGATION_INTERVAL || '3600'),
      enableRealtimeStats: process.env.EMAIL_ENABLE_REALTIME_STATS !== 'false'
    },

    compliance: {
      gdprEnabled: process.env.EMAIL_GDPR_ENABLED !== 'false',
      canSpamCompliant: process.env.EMAIL_CAN_SPAM_COMPLIANT !== 'false',
      requireUnsubscribeLink: process.env.EMAIL_REQUIRE_UNSUBSCRIBE_LINK !== 'false',
      requirePhysicalAddress: process.env.EMAIL_REQUIRE_PHYSICAL_ADDRESS !== 'false'
    }
  });
}

/**
 * Validate email marketing configuration
 */
export function validateEmailMarketingConfig(): void {
  try {
    const config = getEmailMarketingConfig();

    // Additional validation logic
    if (config.limits.maxPerHour > config.limits.maxPerDay) {
      throw new Error('Hourly email limit cannot exceed daily limit');
    }

    if (config.abTesting.defaultTestPercentage > 50) {
      throw new Error('A/B test percentage cannot exceed 50%');
    }

    if (config.tracking.enableOpenTracking || config.tracking.enableClickTracking) {
      if (!config.tracking.domain || config.tracking.domain === 'https://track.example.com') {
        throw new Error('Valid tracking domain required when tracking is enabled');
      }
    }

    logger.info('Email marketing configuration validated successfully');
  } catch (error) {
    logger.error('Invalid email marketing configuration', { error });
    throw error;
  }
}
