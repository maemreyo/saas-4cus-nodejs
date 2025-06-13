// CORRECT: Email automation routes using proper Fastify pattern

import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailAutomationController } from '../controllers/email-automation.controller';
import { requireAuth } from '@/modules/auth/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import { validateAutomationOwnership } from '../middleware/email-marketing.middleware';

export default async function emailAutomationRoutes(fastify: FastifyInstance) {
  const automationController = Container.get(EmailAutomationController);

  // All routes require authentication and tenant context
  fastify.addHook('onRequest', async (request, reply) => {
    await requireAuth(request, reply);
    await requireTenant(request, reply);
  });

  // Automation CRUD endpoints
  fastify.post('/', automationController.createAutomation.bind(automationController));
  fastify.get('/', automationController.getAutomations.bind(automationController));

  // Automation-specific routes with ownership validation
  fastify.register(async function automationSpecificRoutes(fastify: FastifyInstance) {
    // Add ownership validation for all automation-specific routes
    fastify.addHook('preHandler', validateAutomationOwnership());

    // Single automation operations
    fastify.get('/:automationId', automationController.getAutomation.bind(automationController));
    fastify.put('/:automationId', automationController.updateAutomation.bind(automationController));
    fastify.delete('/:automationId', automationController.deleteAutomation.bind(automationController));

    // Automation actions
    fastify.patch('/:automationId/activate', automationController.activateAutomation.bind(automationController));
    fastify.patch('/:automationId/deactivate', automationController.deactivateAutomation.bind(automationController));

    // Step management
    fastify.post('/:automationId/steps', automationController.addAutomationStep.bind(automationController));
    fastify.put('/:automationId/steps/:stepId', automationController.updateAutomationStep.bind(automationController));
    fastify.delete('/:automationId/steps/:stepId', automationController.deleteAutomationStep.bind(automationController));

    // Subscriber enrollment
    fastify.post('/:automationId/enroll', automationController.enrollSubscriber.bind(automationController));

    // Analytics
    fastify.get('/:automationId/analytics', automationController.getAutomationAnalytics.bind(automationController));
  });
}