// Module initialization and exports

import { FastifyInstance } from 'fastify';
import { EmailMarketingService } from './services/email-marketing.service';
import { EmailListService } from './services/email-list.service';
import { EmailCampaignService } from './services/email-campaign.service';
import { EmailAutomationService } from './services/email-automation.service';
import { EmailTemplateService } from './services/email-template.service';
import { EmailSegmentService } from './services/email-segment.service';
import { EmailAnalyticsService } from './services/email-analytics.service';
import { EmailMarketingController } from './controllers/email-marketing.controller';
import { EmailMarketingQueue } from './queues/email-marketing.queue';
import { registerEmailMarketingRoutes } from './email-marketing.route';
import { EmailTrackingService } from './services/email-tracking.service';
import { EmailDeliveryService } from './services/email-delivery.service';
import { ABTestingService } from './services/ab-testing.service';
import { container } from '@/infrastructure/container';
import { logger } from '@/shared/logger';

// Export all services
export * from './services/email-marketing.service';
export * from './services/email-list.service';
export * from './services/email-campaign.service';
export * from './services/email-automation.service';
export * from './services/email-template.service';
export * from './services/email-segment.service';
export * from './services/email-analytics.service';
export * from './services/email-tracking.service';
export * from './services/email-delivery.service';
export * from './services/ab-testing.service';

// Export DTOs
export * from './dto/email-list.dto';
export * from './dto/email-campaign.dto';
export * from './dto/email-automation.dto';
export * from './dto/email-template.dto';
export * from './dto/email-segment.dto';
export * from './dto/email-subscriber.dto';

// Export controllers
export * from './controllers/email-marketing.controller';
export * from './controllers/email-list.controller';
export * from './controllers/email-campaign.controller';
export * from './controllers/email-automation.controller';
export * from './controllers/email-template.controller';

// Export events
export * from './events/email-marketing.events';

/**
 * Initialize the Email Marketing module
 */
export async function initializeEmailMarketingModule(app: FastifyInstance): Promise<void> {
  try {
    logger.info('Initializing Email Marketing module...');

    // Register services
    container.register('emailMarketingService', { useClass: EmailMarketingService });
    container.register('emailListService', { useClass: EmailListService });
    container.register('emailCampaignService', { useClass: EmailCampaignService });
    container.register('emailAutomationService', { useClass: EmailAutomationService });
    container.register('emailTemplateService', { useClass: EmailTemplateService });
    container.register('emailSegmentService', { useClass: EmailSegmentService });
    container.register('emailAnalyticsService', { useClass: EmailAnalyticsService });
    container.register('emailTrackingService', { useClass: EmailTrackingService });
    container.register('emailDeliveryService', { useClass: EmailDeliveryService });
    container.register('abTestingService', { useClass: ABTestingService });

    // Register controllers
    container.register('emailMarketingController', { useClass: EmailMarketingController });

    // Initialize queue
    const emailQueue = container.resolve(EmailMarketingQueue);
    await emailQueue.initialize();

    // Register routes
    await registerEmailMarketingRoutes(app);

    logger.info('Email Marketing module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Email Marketing module:', error);
    throw error;
  }
}