// Email marketing routes registration
import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailMarketingController } from './controllers/email-marketing.controller';
import { EmailListController } from './controllers/email-list.controller';
import { EmailCampaignController } from './controllers/email-campaign.controller';
import { EmailAutomationController } from './controllers/email-automation.controller';
import { EmailTemplateController } from './controllers/email-template.controller';
import { logger } from '@shared/logger';

/**
 * Register all email marketing related routes
 */
export async function registerEmailMarketingRoutes(app: FastifyInstance): Promise<void> {
  try {
    logger.info('Registering Email Marketing routes...');

    // Get controller instances from container
    const emailMarketingController = Container.get(EmailMarketingController);
    const emailListController = Container.get(EmailListController);
    const emailCampaignController = Container.get(EmailCampaignController);
    const emailAutomationController = Container.get(EmailAutomationController);
    const emailTemplateController = Container.get(EmailTemplateController);

    // Register routes using the decorator pattern
    // The actual route handlers are defined in the controller classes using decorators
    app.register(async (instance) => {
      // The routes are automatically registered through the Controller decorators
      // This just ensures the controllers are properly initialized
    });

    logger.info('Email Marketing routes registered successfully');
  } catch (error) {
    logger.error('Failed to register Email Marketing routes:', error);
    throw error;
  }
}
