import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailListController } from '../controllers/email-list.controller';
import { requireAuth } from '@/modules/auth/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';

export default async function emailListRoutes(fastify: FastifyInstance) {
  const listController = Container.get(EmailListController);

  // All routes require authentication and tenant context
  fastify.addHook('onRequest', async (request, reply) => {
    await requireAuth(request, reply);
    await requireTenant(request, reply);
  });

  // List CRUD endpoints
  fastify.post('/', listController.createList.bind(listController));
  fastify.get('/', listController.getLists.bind(listController));

  // List-specific routes
  fastify.get('/:listId', listController.getList.bind(listController));
  fastify.put('/:listId', listController.updateList.bind(listController));
  fastify.delete('/:listId', listController.deleteList.bind(listController));

  // Subscriber management
  fastify.get('/:listId/subscribers', listController.getListSubscribers.bind(listController));
  fastify.post('/:listId/subscribe', listController.subscribe.bind(listController));
  fastify.post('/:listId/unsubscribe', listController.unsubscribe.bind(listController));
  fastify.post('/:listId/import', listController.importSubscribers.bind(listController));
  fastify.put('/:listId/subscribers/:subscriberId', listController.updateSubscriber.bind(listController));
  fastify.delete('/:listId/subscribers/:subscriberId', listController.removeSubscriber.bind(listController));

  // List operations
  fastify.post('/:listId/clean', listController.cleanList.bind(listController));
  fastify.get('/:listId/analytics', listController.getListAnalytics.bind(listController));
  fastify.get('/:listId/export', listController.exportSubscribers.bind(listController));
}
