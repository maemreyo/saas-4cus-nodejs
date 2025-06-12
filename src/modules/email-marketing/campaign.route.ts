import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { CampaignController } from './campaign.controller';
import { requireAuth } from '@shared/middleware/auth.middleware';
import { requireTenant } from '@modules/tenant/tenant.middleware';

export default async function campaignRoutes(fastify: FastifyInstance) {
  const controller = Container.get(CampaignController);

  // Apply authentication and tenant middleware to all routes
  fastify.addHook('preHandler', requireAuth);
  fastify.addHook('preHandler', requireTenant);

  // Campaign CRUD
  fastify.post('/', controller.create.bind(controller));
  fastify.get('/', controller.find.bind(controller));
  fastify.get('/:id', controller.findById.bind(controller));
  fastify.put('/:id', controller.update.bind(controller));
  fastify.delete('/:id', controller.delete.bind(controller));

  // Campaign actions
  fastify.post('/:id/schedule', controller.schedule.bind(controller));
  fastify.post('/:id/send', controller.send.bind(controller));
  fastify.post('/:id/pause', controller.pause.bind(controller));
  fastify.post('/:id/resume', controller.resume.bind(controller));
  fastify.post('/:id/cancel', controller.cancel.bind(controller));
  fastify.post('/:id/clone', controller.clone.bind(controller));

  // Campaign statistics
  fastify.get('/:id/stats', controller.getStats.bind(controller));

  // A/B testing
  fastify.post('/:id/ab-test/winner', controller.selectABTestWinner.bind(controller));
}
