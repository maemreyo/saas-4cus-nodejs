import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailTemplateController } from '../controllers/email-template.controller';
import { requireAuth } from '@/modules/auth/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';

export default async function emailTemplateRoutes(fastify: FastifyInstance) {
  const templateController = Container.get(EmailTemplateController);

  // All routes require authentication and tenant context
  fastify.addHook('onRequest', async (request, reply) => {
    await requireAuth(request, reply);
    await requireTenant(request, reply);
  });

  // Template CRUD endpoints
  fastify.post('/', templateController.createTemplate.bind(templateController));
  fastify.get('/', templateController.getTemplates.bind(templateController));
  fastify.get('/:templateId', templateController.getTemplate.bind(templateController));
  fastify.put('/:templateId', templateController.updateTemplate.bind(templateController));
  fastify.delete('/:templateId', templateController.deleteTemplate.bind(templateController));

  // Template operations
  fastify.post('/:templateId/clone', templateController.cloneTemplate.bind(templateController));
  fastify.post('/render', templateController.renderTemplate.bind(templateController));
  fastify.get('/:templateId/preview', templateController.previewTemplate.bind(templateController));
  fastify.get('/:templateId/stats', templateController.getTemplateStats.bind(templateController));
  fastify.post('/:templateId/test', templateController.testTemplate.bind(templateController));
  fastify.get('/:templateId/export', templateController.exportTemplate.bind(templateController));
  fastify.post('/import', templateController.importTemplate.bind(templateController));
  fastify.get('/:templateId/variables', templateController.getTemplateVariables.bind(templateController));
}
