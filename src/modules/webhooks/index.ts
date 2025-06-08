import { Container } from 'typedi';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';

// Export all components
export { WebhookService } from './webhook.service';
export { WebhookController } from './webhook.controller';
export * from './webhook.dto';

// Export types
export type { CreateWebhookOptions, WebhookPayload, WebhookDeliveryResult } from './webhook.service';

// Export routes
export { default as webhookRoutes } from './webhook.route';

/**
 * Initialize Webhooks module
 */
export async function initializeWebhooksModule(): Promise<void> {
  try {
    logger.info('Initializing webhooks module...');

    // Initialize services
    const webhookService = Container.get(WebhookService);
    Container.get(WebhookController);

    // Service already sets up event listeners in constructor

    logger.info('Webhooks module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize webhooks module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Webhooks module
 */
export async function shutdownWebhooksModule(): Promise<void> {
  logger.info('Webhooks module shut down');
}

// Convenience functions
export async function createWebhook(userId: string, tenantId: string | undefined, options: any): Promise<any> {
  const webhookService = Container.get(WebhookService);
  return webhookService.createWebhook(userId, tenantId, options);
}

export async function triggerWebhook(event: string, data: any): Promise<void> {
  const webhookService = Container.get(WebhookService);
  return webhookService.trigger(event, data);
}

export async function verifyWebhookSignature(secret: string, payload: any, signature: string): Promise<boolean> {
  const webhookService = Container.get(WebhookService);
  return webhookService.verifySignature(secret, payload, signature);
}

// Helper to emit events that trigger webhooks
export async function emitWebhookEvent(event: string, data: any): Promise<void> {
  await eventBus.emit(event, data);
}
