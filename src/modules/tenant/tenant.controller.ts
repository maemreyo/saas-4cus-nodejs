import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { TenantService } from './tenant.service';
import { TenantMemberRole } from '@prisma/client';
import { validateSchema } from '@shared/validators';
import {
  CreateTenantDTO,
  UpdateTenantDTO,
  InviteMemberDTO,
  UpdateMemberRoleDTO,
  TransferOwnershipDTO,
} from './tenant.dto';

@Service()
export class TenantController {
  constructor(private tenantService: TenantService) {}

  /**
   * Create new tenant
   */
  async createTenant(request: FastifyRequest<{ Body: CreateTenantDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(CreateTenantDTO.schema, request.body);
    const userId = request.customUser!.id;

    const tenant = await this.tenantService.createTenant({
      ...dto,
      ownerId: userId,
    } as any);

    reply.code(201).send({
      message: 'Tenant created successfully',
      data: tenant,
    });
  }

  /**
   * Get current tenant
   */
  async getCurrentTenant(request: FastifyRequest, reply: FastifyReply) {
    const tenant = (request as any).tenant;

    if (!tenant) {
      return reply.code(404).send({ error: 'No tenant context' });
    }

    reply.send({ data: tenant });
  }

  /**
   * Get user's tenants
   */
  async getUserTenants(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const tenants = await this.tenantService.getUserTenants(userId);

    reply.send({ data: tenants });
  }

  /**
   * Get tenant by ID
   */
  async getTenant(request: FastifyRequest<{ Params: { tenantId: string } }>, reply: FastifyReply) {
    const { tenantId } = request.params;
    const userId = request.customUser!.id;

    // Check permissions
    await this.tenantService.checkTenantPermission(tenantId, userId);

    const tenant = await this.tenantService.getTenant(tenantId);
    reply.send({ data: tenant });
  }

  /**
   * Update tenant
   */
  async updateTenant(
    request: FastifyRequest<{
      Params: { tenantId: string };
      Body: UpdateTenantDTO;
    }>,
    reply: FastifyReply,
  ) {
    const dto = await validateSchema(UpdateTenantDTO.schema, request.body);
    const { tenantId } = request.params;
    const userId = request.customUser!.id;

    const tenant = await this.tenantService.updateTenant(tenantId, userId, dto);

    reply.send({
      message: 'Tenant updated successfully',
      data: tenant,
    });
  }

  /**
   * Delete tenant
   */
  async deleteTenant(request: FastifyRequest<{ Params: { tenantId: string } }>, reply: FastifyReply) {
    const { tenantId } = request.params;
    const userId = request.customUser!.id;

    await this.tenantService.deleteTenant(tenantId, userId);

    reply.send({ message: 'Tenant deleted successfully' });
  }

  /**
   * Get tenant members
   */
  async getTenantMembers(
    request: FastifyRequest<{
      Params: { tenantId: string };
      Querystring: { limit?: number; offset?: number; role?: TenantMemberRole };
    }>,
    reply: FastifyReply,
  ) {
    const { tenantId } = request.params;
    const { limit, offset, role } = request.query;
    const userId = request.customUser!.id;

    const result = await this.tenantService.getTenantMembers(tenantId, userId, {
      limit,
      offset,
      role,
    });

    reply.send({ data: result });
  }

  /**
   * Invite member
   */
  async inviteMember(
    request: FastifyRequest<{
      Params: { tenantId: string };
      Body: InviteMemberDTO;
    }>,
    reply: FastifyReply,
  ) {
    const dto = await validateSchema(InviteMemberDTO.schema, request.body);
    const { tenantId } = request.params;
    const inviterId = request.customUser!.id;

    await this.tenantService.inviteMember(tenantId, inviterId, {
      ...dto,
      invitedById: inviterId,
    } as any);

    reply.send({ message: 'Invitation sent successfully' });
  }

  /**
   * Accept invitation
   */
  async acceptInvitation(request: FastifyRequest<{ Params: { token: string } }>, reply: FastifyReply) {
    const { token } = request.params;
    const userId = request.customUser!.id;

    const tenant = await this.tenantService.acceptInvitation(token, userId);

    reply.send({
      message: 'Invitation accepted successfully',
      data: tenant,
    });
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    request: FastifyRequest<{
      Params: { tenantId: string; memberId: string };
      Body: UpdateMemberRoleDTO;
    }>,
    reply: FastifyReply,
  ) {
    const dto = await validateSchema(UpdateMemberRoleDTO.schema, request.body);
    const { tenantId, memberId } = request.params;
    const updatedBy = request.customUser!.id;

    await this.tenantService.updateMemberRole(tenantId, memberId, dto.role, updatedBy);

    reply.send({ message: 'Member role updated successfully' });
  }

  /**
   * Remove member
   */
  async removeMember(
    request: FastifyRequest<{
      Params: { tenantId: string; memberId: string };
    }>,
    reply: FastifyReply,
  ) {
    const { tenantId, memberId } = request.params;
    const removedBy = request.customUser!.id;

    await this.tenantService.removeMember(tenantId, memberId, removedBy);

    reply.send({ message: 'Member removed successfully' });
  }

  /**
   * Leave tenant
   */
  async leaveTenant(request: FastifyRequest<{ Params: { tenantId: string } }>, reply: FastifyReply) {
    const { tenantId } = request.params;
    const userId = request.customUser!.id;

    await this.tenantService.leaveTenant(tenantId, userId);

    reply.send({ message: 'Left tenant successfully' });
  }

  /**
   * Transfer ownership
   */
  async transferOwnership(
    request: FastifyRequest<{
      Params: { tenantId: string };
      Body: TransferOwnershipDTO;
    }>,
    reply: FastifyReply,
  ) {
    const dto = await validateSchema(TransferOwnershipDTO.schema, request.body);
    const { tenantId } = request.params;
    const currentOwnerId = request.customUser!.id;

    await this.tenantService.transferOwnership(tenantId, currentOwnerId, dto.newOwnerId);

    reply.send({ message: 'Ownership transferred successfully' });
  }

  /**
   * Get tenant statistics
   */
  async getTenantStats(request: FastifyRequest<{ Params: { tenantId: string } }>, reply: FastifyReply) {
    const { tenantId } = request.params;
    const userId = request.customUser!.id;

    const stats = await this.tenantService.getTenantStats(tenantId, userId);

    reply.send({ data: stats });
  }
}
