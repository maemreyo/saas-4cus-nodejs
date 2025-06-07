import { Container } from 'typedi';
import { ApiUsageService } from './api-usage.service';
import { ApiUsageController } from './api-usage.controller';
import { ApiUsageQueueProcessor, initializeApiUsageJobs } from './api-usage.queue';
import { ApiUsageEventHandlers } from './api-usage.events.handlers';
import { logger } from '@shared/logger';

// Export all components
export { ApiUsageService } from './api-usage.service';
export { ApiUsageController } from './api-usage.controller';
export { ApiUsageEvents } from './api-usage.events';
export * from './api-usage.dto';
export * from './api-usage.middleware';

// Export default routes
export { default as apiUsageRoutes } from './api-usage.route';

/**
 * Initialize API Usage module
 */
export async function initializeApiUsageModule(): Promise<void> {
  try {
    // Initialize services
    Container.get(ApiUsageService);
    Container.get(ApiUsageController);
    Container.get(ApiUsageQueueProcessor);
    Container.get(ApiUsageEventHandlers);

    // Initialize queue jobs
    await initializeApiUsageJobs();

    logger.info('API Usage module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize API Usage module', error as Error);
    throw error;
  }
}

/**
 * Shutdown API Usage module
 */
export async function shutdownApiUsageModule(): Promise<void> {
  logger.info('Shutting down API Usage module');

  // Any cleanup tasks can be added here

  logger.info('API Usage module shut down successfully');
}
