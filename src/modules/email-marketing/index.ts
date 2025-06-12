// Main entry point for email marketing module

import { Container } from 'typedi';
import { EmailMarketingService } from './email-marketing.service';
import { EmailMarketingController } from './email-marketing.controller';
import { EmailMarketingEventHandlers } from './email-marketing.events';
import { EmailMarketingQueueProcessor } from './email-marketing.queue';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';

// Export all components
export { EmailMarketingService } from './email-marketing.service';
export { EmailMarketingController } from './email-marketing.controller';
export { EmailMarketingEvents } from './email-marketing.events';
export * from './email-marketing.dto';

// Export routes
export { default as emailMarketingRoutes } from './email-marketing.route';

/**
 * Initialize Email Marketing module
 */
export async function initializeEmailMarketingModule(): Promise<void> {
  try {
    logger.info('Initializing email marketing module...');

    // Initialize services
    const emailMarketingService = Container.get(EmailMarketingService);
    const emailMarketingController = Container.get(EmailMarketingController);
    const eventHandlers = Container.get(EmailMarketingEventHandlers);
    const queueProcessor = Container.get(EmailMarketingQueueProcessor);

    // Register queue processors
    await registerQueueProcessors();

    // Schedule daily statistics job
    await queueService.addJob(
      'email-marketing',
      'daily-stats',
      {},
      {
        repeat: { cron: '0 2 * * *' } // Daily at 2 AM
      }
    );

    // Schedule cleanup job for old tracking data
    await queueService.addJob(
      'email-marketing',
      'cleanup-tracking',
      {},
      {
        repeat: { cron: '0 3 * * *' } // Daily at 3 AM
      }
    );

    logger.info('Email marketing module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize email marketing module', error as Error);
    throw error;
  }
}

/**
 * Register queue processors
 */
async function registerQueueProcessors(): Promise<void> {
  const queueProcessor = Container.get(EmailMarketingQueueProcessor);

  // Send campaign processor
  queueService.registerProcessor(
    'email-marketing',
    'send-campaign',
    queueProcessor.processSendCampaign.bind(queueProcessor)
  );

  // Send confirmation email processor
  queueService.registerProcessor(
    'email-marketing',
    'send-confirmation',
    queueProcessor.processSendConfirmation.bind(queueProcessor)
  );

  // Send individual email processor
  queueService.registerProcessor(
    'email-marketing',
    'send-email',
    queueProcessor.processSendEmail.bind(queueProcessor)
  );

  // Process automation step processor
  queueService.registerProcessor(
    'email-marketing',
    'process-automation-step',
    queueProcessor.processAutomationStep.bind(queueProcessor)
  );

  // Daily statistics processor
  queueService.registerProcessor(
    'email-marketing',
    'daily-stats',
    queueProcessor.processDailyStats.bind(queueProcessor)
  );

  // Cleanup tracking data processor
  queueService.registerProcessor(
    'email-marketing',
    'cleanup-tracking',
    queueProcessor.processCleanupTracking.bind(queueProcessor)
  );

  logger.info('Email marketing queue processors registered');
}

/**
 * Shutdown Email Marketing module
 */
export async function shutdownEmailMarketingModule(): Promise<void> {
  logger.info('Email marketing module shut down');
}