import { Container } from 'typedi';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationEventHandlers } from './notification.events';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';

// Export all components
export { NotificationService } from './notification.service';
export { NotificationController } from './notification.controller';
export { NotificationEventHandlers } from './notification.events';
export * from './notification.dto';

// Export routes
export { default as notificationRoutes } from './notification.route';

/**
 * Initialize Notification module
 */
export async function initializeNotificationModule(): Promise<void> {
  try {
    logger.info('Initializing notification module...');

    // Initialize services
    Container.get(NotificationService);
    Container.get(NotificationController);
    Container.get(NotificationEventHandlers);

    // Register queue processors
    queueService.registerProcessor('notification', 'send-email', async (job) => {
      const { notificationId } = job.data;
      logger.info('Processing email notification', { notificationId });
      // Email sending logic would go here
    });

    queueService.registerProcessor('notification', 'send-push', async (job) => {
      const { notificationId } = job.data;
      logger.info('Processing push notification', { notificationId });
      // Push notification logic would go here
    });

    // Schedule cleanup job
    await queueService.addJob(
      'notification',
      'cleanup',
      {},
      {
        repeat: { cron: '0 3 * * *' } // Daily at 3 AM
      }
    );

    queueService.registerProcessor('notification', 'cleanup', async () => {
      const notificationService = Container.get(NotificationService);
      const deleted = await notificationService.cleanupOldNotifications(30);
      logger.info('Notification cleanup completed', { deleted });
      return { deleted };
    });

    logger.info('Notification module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize notification module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Notification module
 */
export async function shutdownNotificationModule(): Promise<void> {
  logger.info('Notification module shut down');
}