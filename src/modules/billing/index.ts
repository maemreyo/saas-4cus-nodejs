import { Container } from 'typedi';
import { BillingService } from './billing.service';
import { SubscriptionService } from './subscription.service';
import { BillingController } from './billing.controller';
import { logger } from '@shared/logger';

// Export all components
export { BillingService } from './billing.service';
export { SubscriptionService } from './subscription.service';
export { BillingController } from './billing.controller';
export { BillingEvents } from './billing.events';
export * from './billing.dto';
export * from './billing.middleware';

// Export routes
export { default as billingRoutes } from './billing.route';

/**
 * Initialize Billing module
 */
export async function initializeBillingModule(): Promise<void> {
  try {
    logger.info('Initializing billing module...');

    // Initialize services
    Container.get(BillingService);
    Container.get(SubscriptionService);
    Container.get(BillingController);

    logger.info('Billing module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize billing module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Billing module
 */
export async function shutdownBillingModule(): Promise<void> {
  logger.info('Billing module shut down');
}