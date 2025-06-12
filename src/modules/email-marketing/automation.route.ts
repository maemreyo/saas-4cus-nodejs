import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { AutomationController } from './automation.controller';
import { requireAuth } from '@shared/middleware/auth.middleware';
import { requireTenant } from '@modules/tenant/tenant.middleware';

export default async function automationRoutes(fastify: FastifyInstance) {
  const controller = Container.get(AutomationController);

  // Apply authentication and tenant middleware to all routes
  fastify.addHook('preHandler', requireAuth);
  fastify.addHook('preHandler', requireTenant);

  // Automation CRUD
  fastify.post('/', controller.create.bind(controller));
  fastify.get('/', controller.find.bind(controller));
  fastify.get('/:id', controller.findById.bind(controller));
  fastify.put('/:id', controller.update.bind(controller));
  fastify.delete('/:id', controller.delete.bind(controller));

  // Automation actions
  fastify.post('/:id/activate', controller.activate.bind(controller));
  fastify.post('/:id/deactivate', controller.deactivate.bind(controller));

  // Automation steps
  fastify.post('/:id/steps', controller.addStep.bind(controller));
  fastify.put('/:id/steps/:stepId', controller.updateStep.bind(controller));
  fastify.delete('/:id/steps/:stepId', controller.deleteStep.bind(controller));

  // Enrollments
  fastify.post('/:id/enroll', controller.enrollSubscriber.bind(controller));
  fastify.get('/:id/enrollments', controller.getEnrollments.bind(controller));
  fastify.post('/:id/enrollments/:enrollmentId/cancel', controller.cancelEnrollment.bind(controller));

  // Manual trigger
  fastify.post('/trigger', controller.trigger.bind(controller));
}
