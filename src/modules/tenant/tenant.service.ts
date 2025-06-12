import { Service } from 'typedi';
import { Tenant, TenantMember, TenantMemberRole, TenantStatus } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { EmailService } from '@shared/services/email.service';
import { BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@shared/exceptions';
import { nanoid } from 'nanoid';
import { slugify } from '@shared/utils/helpers';
import { TenantEvents } from './tenant.events';

export interface CreateTenantOptions {
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  ownerId: string;
  metadata?: Record<string, any>;
}

export interface UpdateTenantOptions {
  name?: string;
  slug?: string;
  description?: string;
  logo?: string;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface InviteMemberOptions {
  email: string;
  role?: TenantMemberRole;
  sendEmail?: boolean;
  invitedById: string;
}

@Service()
export class TenantService {
  constructor(
    private eventBus: EventBus,
    private emailService: EmailService,
  ) {}

  /**
   * Create a new tenant
   */
  async createTenant(options: CreateTenantOptions): Promise<Tenant> {
    // Generate slug if not provided
    let slug = options.slug || slugify(options.name);

    // Ensure slug is unique
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const existing = await prisma.client.tenant.findUnique({
        where: { slug },
      });

      if (!existing) {
        isUnique = true;
      } else {
        slug = `${slugify(options.name)}-${nanoid(6).toLowerCase()}`;
        attempts++;
      }
    }

    if (!isUnique) {
      throw new ConflictException('Unable to generate unique slug for tenant');
    }

    // Create tenant
    const tenant = await prisma.client.tenant.create({
      data: {
        name: options.name,
        slug,
        description: options.description,
        logo: options.logo,
        ownerId: options.ownerId,
        metadata: options.metadata || {},
      },
    });

    // Add owner as a member
    await prisma.client.tenantMember.create({
      data: {
        tenantId: tenant.id,
        userId: options.ownerId,
        role: TenantMemberRole.OWNER,
      },
    });

    logger.info('Tenant created', { tenantId: tenant.id, ownerId: options.ownerId });

    await this.eventBus.emit(TenantEvents.TENANT_CREATED, {
      tenantId: tenant.id,
      ownerId: options.ownerId,
      timestamp: new Date(),
    });

    return tenant;
  }

  /**
   * Get tenant by ID
   */
  async getTenant(tenantId: string): Promise<Tenant> {
    const tenant = await prisma.client.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant || tenant.deletedAt) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  /**
   * Get tenant by slug
   */
  async getTenantBySlug(slug: string): Promise<Tenant> {
    const tenant = await prisma.client.tenant.findUnique({
      where: { slug },
    });

    if (!tenant || tenant.deletedAt) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  /**
   * Get tenant member
   */
  async getMember(tenantId: string, userId: string): Promise<TenantMember | null> {
    return prisma.client.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId
        }
      }
    });
  }

  /**
   * Update tenant
   */
  async updateTenant(tenantId: string, userId: string, options: UpdateTenantOptions): Promise<Tenant> {
    // Check permissions
    await this.checkTenantPermission(tenantId, userId, [TenantMemberRole.OWNER, TenantMemberRole.ADMIN]);

    // Check slug uniqueness if updating
    if (options.slug) {
      const existing = await prisma.client.tenant.findUnique({
        where: { slug: options.slug },
      });

      if (existing && existing.id !== tenantId) {
        throw new ConflictException('Slug already in use');
      }
    }

    const tenant = await prisma.client.tenant.update({
      where: { id: tenantId },
      data: {
        name: options.name,
        slug: options.slug,
        description: options.description,
        logo: options.logo,
        settings: options.settings,
        metadata: options.metadata,
      },
    });

    // Clear cache
    await this.clearTenantCache(tenantId);

    logger.info('Tenant updated', { tenantId, userId });

    await this.eventBus.emit(TenantEvents.TENANT_UPDATED, {
      tenantId,
      updatedBy: userId,
      changes: options,
      timestamp: new Date(),
    });

    return tenant;
  }

  /**
   * Delete tenant (soft delete)
   */
  async deleteTenant(tenantId: string, userId: string): Promise<void> {
    // Only owner can delete
    await this.checkTenantPermission(tenantId, userId, [TenantMemberRole.OWNER]);

    await prisma.client.tenant.update({
      where: { id: tenantId },
      data: {
        status: TenantStatus.DELETED,
        deletedAt: new Date(),
      },
    });

    // Clear cache
    await this.clearTenantCache(tenantId);

    logger.info('Tenant deleted', { tenantId, userId });

    await this.eventBus.emit(TenantEvents.TENANT_DELETED, {
      tenantId,
      deletedBy: userId,
      timestamp: new Date(),
    });
  }

  /**
   * Get user's tenants
   */
  async getUserTenants(userId: string): Promise<
    Array<{
      tenant: Tenant;
      membership: TenantMember;
    }>
  > {
    const memberships = await prisma.client.tenantMember.findMany({
      where: { userId },
      include: {
        tenant: true,
      },
    });

    return memberships
      .filter(m => !m.tenant.deletedAt)
      .map(m => ({
        tenant: m.tenant,
        membership: m,
      }));
  }

  /**
   * Get tenant members
   */
  async getTenantMembers(
    tenantId: string,
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      role?: TenantMemberRole;
    },
  ): Promise<{
    members: Array<TenantMember & { user: any }>;
    total: number;
  }> {
    // Check permissions
    await this.checkTenantPermission(tenantId, userId);

    const where = {
      tenantId,
      ...(options?.role && { role: options.role }),
    };

    const [members, total] = await Promise.all([
      prisma.client.tenantMember.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              displayName: true,
              avatar: true,
            },
          },
        },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: { joinedAt: 'desc' },
      }),
      prisma.client.tenantMember.count({ where }),
    ]);

    return { members, total };
  }

  /**
   * Invite member to tenant
   */
  async inviteMember(tenantId: string, inviterId: string, options: InviteMemberOptions): Promise<void> {
    // Check permissions
    await this.checkTenantPermission(tenantId, inviterId, [TenantMemberRole.OWNER, TenantMemberRole.ADMIN]);

    // Check if user is already a member
    const existingUser = await prisma.client.user.findUnique({
      where: { email: options.email },
    });

    if (existingUser) {
      const existingMember = await prisma.client.tenantMember.findUnique({
        where: {
          tenantId_userId: {
            tenantId,
            userId: existingUser.id,
          },
        },
      });

      if (existingMember) {
        throw new ConflictException('User is already a member of this tenant');
      }
    }

    // Check for existing invitation
    const existingInvite = await prisma.client.tenantInvitation.findFirst({
      where: {
        tenantId,
        email: options.email,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvite) {
      throw new ConflictException('An invitation has already been sent to this email');
    }

    // Create invitation
    const invitation = await prisma.client.tenantInvitation.create({
      data: {
        tenantId,
        email: options.email,
        role: options.role || TenantMemberRole.MEMBER,
        token: nanoid(32),
        invitedById: inviterId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        tenant: true,
      },
    });

    // Send invitation email
    if (options.sendEmail !== false) {
      await this.emailService.queue({
        to: options.email,
        subject: `You're invited to join ${invitation.tenant.name}`,
        template: 'tenant-invitation',
        context: {
          tenantName: invitation.tenant.name,
          inviteUrl: `${process.env.APP_URL}/invitations/${invitation.token}`,
          role: invitation.role,
        },
      });
    }

    logger.info('Tenant invitation sent', {
      tenantId,
      email: options.email,
      inviterId,
    });

    await this.eventBus.emit(TenantEvents.MEMBER_INVITED, {
      tenantId,
      email: options.email,
      invitedBy: inviterId,
      timestamp: new Date(),
    });
  }

  /**
   * Accept invitation
   */
  async acceptInvitation(token: string, userId: string): Promise<Tenant> {
    const invitation = await prisma.client.tenantInvitation.findUnique({
      where: { token },
      include: { tenant: true },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.acceptedAt) {
      throw new BadRequestException('Invitation has already been accepted');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user email matches
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.email !== invitation.email) {
      throw new ForbiddenException('This invitation is for a different email address');
    }

    // Add user to tenant
    await prisma.client.tenantMember.create({
      data: {
        tenantId: invitation.tenantId,
        userId,
        role: invitation.role,
        invitedById: invitation.invitedById,
      },
    });

    // Mark invitation as accepted
    await prisma.client.tenantInvitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    });

    logger.info('Tenant invitation accepted', {
      tenantId: invitation.tenantId,
      userId,
    });

    await this.eventBus.emit(TenantEvents.MEMBER_JOINED, {
      tenantId: invitation.tenantId,
      userId,
      role: invitation.role,
      timestamp: new Date(),
    });

    return invitation.tenant;
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    tenantId: string,
    memberId: string,
    newRole: TenantMemberRole,
    updatedBy: string,
  ): Promise<void> {
    // Check permissions - only owner and admin can update roles
    await this.checkTenantPermission(tenantId, updatedBy, [TenantMemberRole.OWNER, TenantMemberRole.ADMIN]);

    const member = await prisma.client.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId: memberId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Can't change owner role
    if (member.role === TenantMemberRole.OWNER) {
      throw new ForbiddenException('Cannot change owner role');
    }

    // Only owner can promote to admin
    if (newRole === TenantMemberRole.ADMIN) {
      await this.checkTenantPermission(tenantId, updatedBy, [TenantMemberRole.OWNER]);
    }

    await prisma.client.tenantMember.update({
      where: {
        tenantId_userId: {
          tenantId,
          userId: memberId,
        },
      },
      data: { role: newRole },
    });

    logger.info('Member role updated', {
      tenantId,
      memberId,
      newRole,
      updatedBy,
    });

    await this.eventBus.emit(TenantEvents.MEMBER_ROLE_UPDATED, {
      tenantId,
      memberId,
      oldRole: member.role,
      newRole,
      updatedBy,
      timestamp: new Date(),
    });
  }

  /**
   * Remove member from tenant
   */
  async removeMember(tenantId: string, memberId: string, removedBy: string): Promise<void> {
    // Check permissions
    await this.checkTenantPermission(tenantId, removedBy, [TenantMemberRole.OWNER, TenantMemberRole.ADMIN]);

    const member = await prisma.client.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId: memberId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Can't remove owner
    if (member.role === TenantMemberRole.OWNER) {
      throw new ForbiddenException('Cannot remove owner from tenant');
    }

    // Only owner can remove admin
    if (member.role === TenantMemberRole.ADMIN) {
      await this.checkTenantPermission(tenantId, removedBy, [TenantMemberRole.OWNER]);
    }

    await prisma.client.tenantMember.delete({
      where: {
        tenantId_userId: {
          tenantId,
          userId: memberId,
        },
      },
    });

    logger.info('Member removed from tenant', {
      tenantId,
      memberId,
      removedBy,
    });

    await this.eventBus.emit(TenantEvents.MEMBER_REMOVED, {
      tenantId,
      memberId,
      removedBy,
      timestamp: new Date(),
    });
  }

  /**
   * Leave tenant
   */
  async leaveTenant(tenantId: string, userId: string): Promise<void> {
    const member = await prisma.client.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Not a member of this tenant');
    }

    // Owner can't leave
    if (member.role === TenantMemberRole.OWNER) {
      throw new ForbiddenException('Owner cannot leave tenant. Transfer ownership first.');
    }

    await prisma.client.tenantMember.delete({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    logger.info('Member left tenant', { tenantId, userId });

    await this.eventBus.emit(TenantEvents.MEMBER_LEFT, {
      tenantId,
      userId,
      timestamp: new Date(),
    });
  }

  /**
   * Transfer ownership
   */
  async transferOwnership(tenantId: string, currentOwnerId: string, newOwnerId: string): Promise<void> {
    // Verify current owner
    await this.checkTenantPermission(tenantId, currentOwnerId, [TenantMemberRole.OWNER]);

    // Check if new owner is a member
    const newOwnerMembership = await prisma.client.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId: newOwnerId,
        },
      },
    });

    if (!newOwnerMembership) {
      throw new BadRequestException('New owner must be a member of the tenant');
    }

    // Use transaction to ensure atomicity
    await prisma.client.$transaction(async tx => {
      // Update tenant owner
      await tx.tenant.update({
        where: { id: tenantId },
        data: { ownerId: newOwnerId },
      });

      // Update old owner to admin
      await tx.tenantMember.update({
        where: {
          tenantId_userId: {
            tenantId,
            userId: currentOwnerId,
          },
        },
        data: { role: TenantMemberRole.ADMIN },
      });

      // Update new owner role
      await tx.tenantMember.update({
        where: {
          tenantId_userId: {
            tenantId,
            userId: newOwnerId,
          },
        },
        data: { role: TenantMemberRole.OWNER },
      });
    });

    logger.info('Tenant ownership transferred', {
      tenantId,
      from: currentOwnerId,
      to: newOwnerId,
    });

    await this.eventBus.emit(TenantEvents.OWNERSHIP_TRANSFERRED, {
      tenantId,
      fromUserId: currentOwnerId,
      toUserId: newOwnerId,
      timestamp: new Date(),
    });
  }

  /**
   * Check tenant permission
   */
  async checkTenantPermission(
    tenantId: string,
    userId: string,
    allowedRoles?: TenantMemberRole[],
  ): Promise<TenantMember> {
    const member = await prisma.client.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('Not a member of this tenant');
    }

    if (allowedRoles && !allowedRoles.includes(member.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return member;
  }

  /**
   * Clear tenant cache
   */
  private async clearTenantCache(tenantId: string): Promise<void> {
    await redis.invalidateByPattern(`tenant:${tenantId}:*`);
  }

  /**
   * Get tenant statistics
   */
  async getTenantStats(tenantId: string, userId: string): Promise<any> {
    // Check permissions
    await this.checkTenantPermission(tenantId, userId);

    // Get tenant member user IDs for file aggregation
    const tenantMembers = await prisma.client.tenantMember.findMany({
      where: { tenantId },
      select: { userId: true },
    });
    const memberUserIds = tenantMembers.map(member => member.userId);

    const [memberCount, projectCount, storageUsed, apiCallsThisMonth] = await Promise.all([
      prisma.client.tenantMember.count({ where: { tenantId } }),
      prisma.client.project.count({ where: { tenantId } }),
      prisma.client.file.aggregate({
        where: {
          userId: { in: memberUserIds },
          deletedAt: null,
        },
        _sum: { size: true },
      }),
      prisma.client.apiUsage.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(new Date().setDate(1)), // Start of month
          },
        },
      }),
    ]);

    return {
      members: memberCount,
      projects: projectCount,
      storage: {
        used: storageUsed._sum.size || 0,
        usedMB: Math.ceil((storageUsed._sum.size || 0) / (1024 * 1024)),
      },
      apiCalls: apiCallsThisMonth,
    };
  }
}
