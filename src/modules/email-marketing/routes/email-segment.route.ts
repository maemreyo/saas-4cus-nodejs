import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailSegmentController } from '../controllers/email-segment.controller';
import { requireAuth } from '@/modules/auth/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';

export default async function emailSegmentRoutes(fastify: FastifyInstance) {
  const segmentController = Container.get(EmailSegmentController);

  // All routes require authentication and tenant context
  fastify.addHook('onRequest', async (request, reply) => {
    await requireAuth(request, reply);
    await requireTenant(request, reply);
  });

  // Segment CRUD endpoints
  fastify.post('/', segmentController.createSegment.bind(segmentController));
  fastify.get('/', segmentController.getSegments.bind(segmentController));
  fastify.get('/:segmentId', segmentController.getSegment.bind(segmentController));
  fastify.put('/:segmentId', segmentController.updateSegment.bind(segmentController));
  fastify.delete('/:segmentId', segmentController.deleteSegment.bind(segmentController));

  // Segment operations
  fastify.post('/test', segmentController.testSegment.bind(segmentController));
  fastify.post('/:segmentId/refresh', segmentController.refreshSegment.bind(segmentController));
}
