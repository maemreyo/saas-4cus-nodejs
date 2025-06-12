import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { ForbiddenException, NotFoundException } from '@shared/exceptions';
import { logger } from '@shared/logger';
import { AuthRequest } from '@modules/auth/middleware/auth.middleware';
import { TenantService } from '../tenant.service';
import { TenantContextService } from '../tenant.context';

// Extended request with tenant
export interface TenantRequest extends AuthRequest {
  tenant?: {
    id: string;
    slug: string;
    name: string;
  };
  tenantRole?: string;
}

/**
 * Check tenant middleware
 * Extracts tenant information from request and sets it in context
 */
export async function checkTenant(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Get tenant ID from various sources
    const tenantId =
      request.headers['x-tenant-id'] as string ||
      (request.query as any)?.tenantId as string;

    // Get tenant slug from various sources
    const tenantSlug =
      request.headers['x-tenant-slug'] as string ||
      (request.query as any)?.tenantSlug as string;

    // Skip if no tenant info provided
    if (!tenantId && !tenantSlug) {
      return;
    }

    const tenantService = Container.get(TenantService);
    const tenantContext = Container.get(TenantContextService);

    // Find tenant
    let tenant;
    if (tenantId) {
      tenant = await tenantService.getTenant(tenantId);
    } else if (tenantSlug) {
      tenant = await tenantService.getTenantBySlug(tenantSlug);
    }

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Set tenant in context
    tenantContext.setTenant({
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name
    });

    // Set tenant in request
    const tenantRequest = request as unknown as TenantRequest;
    tenantRequest.tenant = {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name
    };

    // Log for debugging
    logger.debug('Tenant context set', {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      path: request.url
    });

  } catch (error) {
    logger.error('Tenant check failed', error as Error);
    throw error;
  }
}

/**
 * Require tenant middleware
 * Ensures request has tenant context
 */
export async function requireTenant(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // First check if tenant is already set
  await checkTenant(request, reply);

  // Verify tenant is set
  const tenantRequest = request as unknown as TenantRequest;
  if (!tenantRequest.tenant) {
    throw new ForbiddenException('Tenant ID or slug is required');
  }
}

/**
 * Require tenant membership
 * Ensures user is a member of the tenant
 */
export async function requireTenantMembership(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const tenantRequest = request as unknown as TenantRequest;

  // Ensure tenant context is set
  if (!tenantRequest.tenant) {
    await requireTenant(request, reply);
  }

  // Ensure user is authenticated
  if (!tenantRequest.user) {
    throw new ForbiddenException('Authentication required');
  }

  // Check membership
  const tenantService = Container.get(TenantService);
  const member = await tenantService.getMember(tenantRequest.tenant!.id, tenantRequest.user.id);

  if (!member) {
    throw new ForbiddenException('You are not a member of this tenant');
  }

  // Set role in request
  tenantRequest.tenantRole = member.role;

  // Set role in context
  const tenantContext = Container.get(TenantContextService);
  tenantContext.setMemberRole(member.role);

  // Log for debugging
  logger.debug('Tenant membership verified', {
    userId: tenantRequest.user.id,
    tenantId: tenantRequest.tenant.id,
    role: member.role
  });
}
