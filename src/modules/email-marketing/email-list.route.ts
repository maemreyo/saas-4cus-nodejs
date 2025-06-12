import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailListController } from './email-list.controller';
import { requireAuth } from '@shared/middleware/auth.middleware'
import { requireTenant } from '@modules/tenant/tenant.middleware';

export default async function emailListRoutes(fastify: FastifyInstance) {
  const controller = Container.get(EmailListController);

  // Apply authentication and tenant middleware to all routes except confirmation
  fastify.addHook('preHandler', async (request, reply) => {
    // Skip auth for confirmation endpoint
    if (request.url.includes('/confirm')) {
      return;
    }
    await requireAuth(request, reply);
    await requireTenant(request, reply);
  });

  // List CRUD
  fastify.post('/', controller.create.bind(controller));
  fastify.get('/', controller.find.bind(controller));
  fastify.get('/:id', controller.findById.bind(controller));
  fastify.put('/:id', controller.update.bind(controller));
  fastify.patch('/:id/status', controller.updateStatus.bind(controller));
  fastify.delete('/:id', controller.delete.bind(controller));

  // List statistics
  fastify.get('/:id/stats', controller.getStats.bind(controller));

  // Subscriber management
  fastify.post('/:id/subscribers', controller.addSubscriber.bind(controller));
  fastify.post('/:id/subscribers/import', controller.importSubscribers.bind(controller));
  fastify.get('/:id/subscribers', controller.getSubscribers.bind(controller));
  fastify.put('/:id/subscribers/:subscriberId', controller.updateSubscriber.bind(controller));
  fastify.delete('/:id/subscribers/:subscriberId', controller.removeSubscriber.bind(controller));
  fastify.patch('/:id/subscribers/:subscriberId/tags', controller.updateSubscriberTags.bind(controller));
  fastify.post('/:id/subscribers/bulk', controller.bulkOperation.bind(controller));

  // Public confirmation endpoint
  fastify.get('/confirm', controller.confirmSubscription.bind(controller));

  // Segment management
  fastify.post('/:id/segments', controller.createSegment.bind(controller));
  fastify.get('/:id/segments', controller.getSegments.bind(controller));
  fastify.put('/:id/segments/:segmentId', controller.updateSegment.bind(controller));
  fastify.delete('/:id/segments/:segmentId', controller.deleteSegment.bind(controller));
  fastify.post('/:id/segments/:segmentId/test', controller.testSegment.bind(controller));
  fastify.get('/:id/segments/:segmentId/subscribers', controller.getSegmentSubscribers.bind(controller));
}
