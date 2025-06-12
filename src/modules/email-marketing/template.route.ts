// New file - Template routes

import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { TemplateController } from './template.controller';
import { requireAuth } from '@shared/middleware/auth.middleware';
import { requireTenant } from '@modules/tenant/tenant.middleware';

export default async function templateRoutes(fastify: FastifyInstance) {
  const controller = Container.get(TemplateController);

  // Apply authentication and tenant middleware to all routes
  fastify.addHook('preHandler', requireAuth);
  fastify.addHook('preHandler', requireTenant);

  // Template CRUD
  fastify.post('/', controller.create.bind(controller));
  fastify.get('/', controller.find.bind(controller));
  fastify.get('/categories', controller.getCategories.bind(controller));
  fastify.get('/:id', controller.findById.bind(controller));
  fastify.put('/:id', controller.update.bind(controller));
  fastify.delete('/:id', controller.delete.bind(controller));

  // Template actions
  fastify.post('/:id/preview', controller.preview.bind(controller));
  fastify.post('/:id/duplicate', controller.duplicate.bind(controller));
}