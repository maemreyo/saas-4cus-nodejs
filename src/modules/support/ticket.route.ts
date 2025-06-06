import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { TicketController } from './ticket.controller';

export default async function ticketRoutes(fastify: FastifyInstance) {
  const ticketController = Container.get(TicketController);

  // All routes require authentication
  fastify.addHook('onRequest', async (request, reply) => {
    await (fastify as any).verifyJWT(request, reply);
  });

  // Public category routes (for ticket creation)
  fastify.get('/categories', ticketController.getCategories.bind(ticketController));

  // Ticket CRUD
  fastify.post('/', ticketController.createTicket.bind(ticketController));
  fastify.get('/', ticketController.listTickets.bind(ticketController));
  fastify.get('/:ticketId', ticketController.getTicket.bind(ticketController));
  fastify.get('/number/:number', ticketController.getTicketByNumber.bind(ticketController));
  fastify.put('/:ticketId', ticketController.updateTicket.bind(ticketController));

  // Ticket actions
  fastify.post('/:ticketId/close', ticketController.closeTicket.bind(ticketController));
  fastify.post('/:ticketId/reopen', ticketController.reopenTicket.bind(ticketController));
  fastify.post('/:ticketId/rate', ticketController.rateTicket.bind(ticketController));

  // Messages
  fastify.get('/:ticketId/messages', ticketController.getMessages.bind(ticketController));
  fastify.post('/:ticketId/messages', ticketController.addMessage.bind(ticketController));

  // Activities
  fastify.get('/:ticketId/activities', ticketController.getTicketActivities.bind(ticketController));

  // Statistics
  fastify.get('/stats', ticketController.getTicketStats.bind(ticketController));

  // Templates (for ticket creation)
  fastify.get('/templates', ticketController.getTemplates.bind(ticketController));
  fastify.get('/templates/:templateId/apply', ticketController.applyTemplate.bind(ticketController));

  // Agent-only routes
  fastify.register(async function agentRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyRole(['ADMIN', 'SUPER_ADMIN'])(request, reply);
    });

    // Assignment
    fastify.post('/:ticketId/assign', ticketController.assignTicket.bind(ticketController));
    fastify.post('/:ticketId/unassign', ticketController.unassignTicket.bind(ticketController));

    // Bulk operations
    fastify.post('/bulk-update', ticketController.bulkUpdateTickets.bind(ticketController));

    // Category management
    fastify.post('/categories', ticketController.createCategory.bind(ticketController));

    // Template management
    fastify.post('/templates', ticketController.createTemplate.bind(ticketController));
  });
}