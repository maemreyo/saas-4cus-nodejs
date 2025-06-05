import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { WebhookController } from './webhook.controller';

export default async function webhookRoutes(fastify: FastifyInstance) {
  const webhookController = Container.get(WebhookController);

  // All routes require authentication
  fastify.addHook('onRequest', async (request, reply) => {
    await (fastify as any).verifyJWT(request, reply);
  });

  // Available events
  fastify.get('/events', webhookController.getAvailableEvents.bind(webhookController));

  // Webhook CRUD
  fastify.post('/', webhookController.createWebhook.bind(webhookController));
  fastify.get('/', webhookController.listWebhooks.bind(webhookController));
  fastify.get('/:webhookId', webhookController.getWebhook.bind(webhookController));
  fastify.put('/:webhookId', webhookController.updateWebhook.bind(webhookController));
  fastify.delete('/:webhookId', webhookController.deleteWebhook.bind(webhookController));

  // Webhook operations
  fastify.post('/:webhookId/test', webhookController.testWebhook.bind(webhookController));
  fastify.get('/:webhookId/stats', webhookController.getWebhookStats.bind(webhookController));
  fastify.get('/:webhookId/deliveries', webhookController.getWebhookEvents.bind(webhookController));

  // Delivery operations
  fastify.post('/deliveries/:deliveryId/replay', webhookController.replayDelivery.bind(webhookController));
}