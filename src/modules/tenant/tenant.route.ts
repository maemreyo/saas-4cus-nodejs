import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { TenantController } from './tenant.controller';

export default async function tenantRoutes(fastify: FastifyInstance) {
  const tenantController = Container.get(TenantController);

  // All routes require authentication
  fastify.addHook('onRequest', async (request, reply) => {
    await (fastify as any).verifyJWT(request, reply);
  });

  // User's tenants
  fastify.get('/my-tenants', tenantController.getUserTenants.bind(tenantController));

  // Create tenant
  fastify.post('/', tenantController.createTenant.bind(tenantController));

  // Current tenant (from context)
  fastify.get('/current', tenantController.getCurrentTenant.bind(tenantController));

  // Accept invitation
  fastify.post('/invitations/:token/accept', tenantController.acceptInvitation.bind(tenantController));

  // Tenant-specific routes
  fastify.register(async function tenantSpecificRoutes(fastify: FastifyInstance) {
    // Get tenant
    fastify.get('/:tenantId', tenantController.getTenant.bind(tenantController));

    // Update tenant
    fastify.put('/:tenantId', tenantController.updateTenant.bind(tenantController));

    // Delete tenant
    fastify.delete('/:tenantId', tenantController.deleteTenant.bind(tenantController));

    // Get statistics
    fastify.get('/:tenantId/stats', tenantController.getTenantStats.bind(tenantController));

    // Members
    fastify.get('/:tenantId/members', tenantController.getTenantMembers.bind(tenantController));
    fastify.post('/:tenantId/members/invite', tenantController.inviteMember.bind(tenantController));
    fastify.put('/:tenantId/members/:memberId/role', tenantController.updateMemberRole.bind(tenantController));
    fastify.delete('/:tenantId/members/:memberId', tenantController.removeMember.bind(tenantController));
    fastify.post('/:tenantId/leave', tenantController.leaveTenant.bind(tenantController));

    // Ownership
    fastify.post('/:tenantId/transfer-ownership', tenantController.transferOwnership.bind(tenantController));
  });
}
