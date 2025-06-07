import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { NotificationController } from './notification.controller';

export default async function notificationRoutes(fastify: FastifyInstance) {
  const notificationController = Container.get(NotificationController);

  // All routes require authentication
  fastify.addHook('onRequest', async (request, reply) => {
    await (fastify as any).verifyJWT(request, reply);
  });

  // Notification management
  fastify.get('/', notificationController.getNotifications.bind(notificationController));
  fastify.get('/unread-count', notificationController.getUnreadCount.bind(notificationController));
  fastify.get('/statistics', notificationController.getStatistics.bind(notificationController));
  fastify.post('/:notificationId/read', notificationController.markAsRead.bind(notificationController));
  fastify.post('/mark-read', notificationController.markMultipleAsRead.bind(notificationController));
  fastify.delete('/:notificationId', notificationController.deleteNotification.bind(notificationController));

  // Preferences
  fastify.get('/preferences', notificationController.getPreferences.bind(notificationController));
  fastify.put('/preferences', notificationController.updatePreferences.bind(notificationController));

  // Admin routes
  fastify.register(async function adminRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyRole(['ADMIN', 'SUPER_ADMIN'])(request, reply);
    });

    // Create notification (for admin/system use)
    fastify.post('/', notificationController.createNotification.bind(notificationController));
  });
}