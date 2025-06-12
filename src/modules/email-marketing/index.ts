import { Container } from 'typedi';
import { FastifyInstance } from 'fastify';
import { logger } from '@shared/logger';
import { CampaignService } from './campaign.service';
import { EmailListService } from './email-list.service';
import { AutomationService } from './automation.service';
import { SegmentationService } from './segmentation.service';
import { TemplateService } from './template.service';
import { TrackingService } from './tracking.service';
import { CampaignController } from './campaign.controller';
import { EmailListController } from './email-list.controller';
import { AutomationController } from './automation.controller';
import { TemplateController } from './template.controller';
import { EmailMarketingQueueProcessor } from './email-marketing.queue';
import { EmailMarketingScheduler } from './email-marketing.scheduler';
import { EmailMarketingEventHandlers } from './email-marketing.events';
import { emailMarketingConfig } from './email-marketing.config';

// Export all services
export { CampaignService } from './campaign.service';
export { EmailListService } from './email-list.service';
export { AutomationService } from './automation.service';
export { SegmentationService } from './segmentation.service';
export { TemplateService } from './template.service';
export { TrackingService } from './tracking.service';

// Export controllers
export { CampaignController } from './campaign.controller';
export { EmailListController } from './email-list.controller';
export { AutomationController } from './automation.controller';
export { TemplateController } from './template.controller';

// Export DTOs and types
export * from './email-marketing.dto';
export * from './email-marketing.events';

// Export configuration
export { emailMarketingConfig } from './email-marketing.config';
export type { EmailMarketingConfig } from './email-marketing.config';

// Export routes
export { default as campaignRoutes } from './campaign.route';
export { default as emailListRoutes } from './email-list.route';
export { default as automationRoutes } from './automation.route';
export { default as templateRoutes } from './template.route';
export { default as trackingRoutes } from './tracking.route';

/**
 * Register email marketing routes
 */
export async function registerEmailMarketingRoutes(fastify: FastifyInstance): Promise<void> {
  // Import routes
  const campaignRoutes = await import('./campaign.route');
  const emailListRoutes = await import('./email-list.route');
  const automationRoutes = await import('./automation.route');
  const templateRoutes = await import('./template.route');
  const trackingRoutes = await import('./tracking.route');

  // Register routes with prefix
  await fastify.register(campaignRoutes.default, { prefix: '/api/v1/email-marketing/campaigns' });
  await fastify.register(emailListRoutes.default, { prefix: '/api/v1/email-marketing/lists' });
  await fastify.register(automationRoutes.default, { prefix: '/api/v1/email-marketing/automations' });
  await fastify.register(templateRoutes.default, { prefix: '/api/v1/email-marketing/templates' });
  await fastify.register(trackingRoutes.default, { prefix: '/api/v1/email-marketing' });

  logger.info('Email marketing routes registered');
}

/**
 * Initialize Email Marketing module
 */
export async function initializeEmailMarketingModule(): Promise<void> {
  try {
    logger.info('Initializing email marketing module...', {
      config: {
        maxEmailsPerDay: emailMarketingConfig.sending.maxEmailsPerDay,
        enableAutomations: emailMarketingConfig.features.enableAutomations,
        enableABTesting: emailMarketingConfig.features.enableABTesting,
      },
    });

    // Initialize services
    Container.get(CampaignService);
    Container.get(EmailListService);
    Container.get(AutomationService);
    Container.get(SegmentationService);
    Container.get(TemplateService);
    Container.get(TrackingService);

    // Initialize controllers
    Container.get(CampaignController);
    Container.get(EmailListController);
    Container.get(AutomationController);
    Container.get(TemplateController);

    // Initialize background processors
    Container.get(EmailMarketingQueueProcessor);
    Container.get(EmailMarketingScheduler);
    Container.get(EmailMarketingEventHandlers);

    // Create default email templates
    await createDefaultTemplates();

    logger.info('Email marketing module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize email marketing module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Email Marketing module
 */
export async function shutdownEmailMarketingModule(): Promise<void> {
  try {
    logger.info('Shutting down email marketing module...');

    const scheduler = Container.get(EmailMarketingScheduler);
    await scheduler.shutdown();

    logger.info('Email marketing module shut down successfully');
  } catch (error) {
    logger.error('Error shutting down email marketing module', error as Error);
  }
}

/**
 * Create default email templates
 */
async function createDefaultTemplates(): Promise<void> {
  try {
    const templateService = Container.get(TemplateService);

    // Check if default templates exist
    const existingTemplates = await templateService.findByCategory('system');

    if (existingTemplates.length === 0) {
      // Create welcome email template
      await templateService.create({
        name: 'Welcome Email',
        category: 'system',
        subject: 'Welcome to {{companyName}}!',
        preheader: 'Thank you for joining us',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Welcome to {{companyName}}</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #007bff;">Welcome to {{companyName}}!</h1>
              <p>Hi {{firstName}},</p>
              <p>Thank you for subscribing to our email list. We're excited to have you on board!</p>
              <p>You'll be the first to know about:</p>
              <ul>
                <li>New features and updates</li>
                <li>Exclusive offers and promotions</li>
                <li>Tips and best practices</li>
              </ul>
              <p>If you have any questions, feel free to reply to this email.</p>
              <p>Best regards,<br>{{companyName}} Team</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                You received this email because you subscribed to {{companyName}}.
                <a href="{{unsubscribeUrl}}" style="color: #007bff;">Unsubscribe</a>
              </p>
            </div>
          </body>
          </html>
        `,
        textContent: `Welcome to {{companyName}}!

Hi {{firstName}},

Thank you for subscribing to our email list. We're excited to have you on board!

You'll be the first to know about:
- New features and updates
- Exclusive offers and promotions
- Tips and best practices

If you have any questions, feel free to reply to this email.

Best regards,
{{companyName}} Team

---
You received this email because you subscribed to {{companyName}}.
Unsubscribe: {{unsubscribeUrl}}
        `,
        variables: {
          companyName: 'string',
          firstName: 'string',
          unsubscribeUrl: 'string',
        },
        isPublic: true,
        tenantId: 'system', // System template
      } as any);

      // Create confirmation email template
      await templateService.create({
        name: 'Subscription Confirmation',
        category: 'system',
        subject: 'Please confirm your subscription',
        preheader: 'One more step to complete your subscription',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Confirm Your Subscription</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #007bff;">Confirm Your Subscription</h1>
              <p>Hi {{firstName}},</p>
              <p>Please confirm your email address to complete your subscription to {{companyName}}.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="{{confirmationUrl}}"
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Confirm Subscription
                </a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">{{confirmationUrl}}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't request this subscription, you can safely ignore this email.</p>
              <p>Thanks,<br>{{companyName}} Team</p>
            </div>
          </body>
          </html>
        `,
        textContent: `Confirm Your Subscription

Hi {{firstName}},

Please confirm your email address to complete your subscription to {{companyName}}.

Confirm here: {{confirmationUrl}}

This link will expire in 24 hours.

If you didn't request this subscription, you can safely ignore this email.

Thanks,
{{companyName}} Team
        `,
        variables: {
          companyName: 'string',
          firstName: 'string',
          confirmationUrl: 'string',
        },
        isPublic: true,
        tenantId: 'system',
      } as any);

      logger.info('Default email templates created');
    }
  } catch (error) {
    logger.error('Failed to create default templates', error as Error);
  }
}
