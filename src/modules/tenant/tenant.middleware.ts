import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { TenantService } from './tenant.service';
import { TenantContextService } from './tenant.context';
import { ForbiddenException, NotFoundException } from '@shared/exceptions';
import { logger } from '@shared/logger';
import { TenantMemberRole } from '@prisma/client';
import { AuthRequest } from '@shared/middleware/auth.middleware';

export interface TenantRequest extends AuthRequest {
  tenant?: {
    id: string;
    slug: string;
    name: string;
    role?: TenantMemberRole;
  };
}

/**
 * Extract tenant from request
 */
async function extractTenant(request: FastifyRequest): Promise<{
  id?: string;
  slug?: string;
} | null> {
  // Check header first (highest priority)
  const headerTenantId = request.headers['x-tenant-id'] as string;
  const headerTenantSlug = request.headers['x-tenant-slug'] as string;

  if (headerTenantId || headerTenantSlug) {
    return {
      id: headerTenantId,
      slug: headerTenantSlug
    };
  }

  // Check subdomain
  const host = request.headers.host;
  if (host && process.env.TENANT_SUBDOMAIN_ENABLED === 'true') {
    const subdomain = extractSubdomain(host);
    if (subdomain) {
      return { slug: subdomain };
    }
  }

  // Check query parameter
  const queryTenantId = (request.query as any)?.tenantId;
  const queryTenantSlug = (request.query as any)?.tenant;

  if (queryTenantId || queryTenantSlug) {
    return {
      id: queryTenantId,
      slug: queryTenantSlug
    };
  }

  // Check route parameter
  const paramTenantId = (request.params as any)?.tenantId;
  if (paramTenantId) {
    return { id: paramTenantId };
  }

  return null;
}

/**
 * Extract subdomain from host
 */
function extractSubdomain(host: string): string | null {
  const appDomain = process.env.APP_DOMAIN || 'localhost';
  const parts = host.split('.');

  // For domain like: tenant.app.com
  if (parts.length >= 3 && host.endsWith(appDomain)) {
    return parts[0];
  }

  // For localhost:port
  if (host.includes('localhost') && parts.length >= 2) {
    return parts[0];
  }

  return null;
}

/**
 * Require tenant context middleware
 * Compatible with Fastify's preHandler hook
 */
export async function requireTenant(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const tenantInfo = await extractTenant(request);

    if (!tenantInfo || (!tenantInfo.id && !tenantInfo.slug)) {
      throw new ForbiddenException('Tenant context required');
    }

    const tenantService = Container.get(TenantService);
    const tenantContext = Container.get(TenantContextService);

    // Find tenant
    let tenant;
    if (tenantInfo.id) {
      tenant = await tenantService.findById(tenantInfo.id);
    } else if (tenantInfo.slug) {
      tenant = await tenantService.findBySlug(tenantInfo.slug);
    }

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Set tenant context
    tenantContext.setTenant({
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name
    });

    // Cast to TenantRequest
    const tenantRequest = request as TenantRequest;

    // If user is authenticated, get their role in the tenant
    if (tenantRequest.user) {
      const member = await tenantService.getMember(tenant.id, tenantRequest.user.id);
      if (member) {
        tenantContext.setMemberRole(member.role);
        tenantRequest.tenant = {
          id: tenant.id,
          slug: tenant.slug,
          name: tenant.name,
          role: member.role
        };
      }
    } else {
      tenantRequest.tenant = {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name
      };
    }

    logger.debug('Tenant context set', {
      tenantId: tenant.id,
      userId: tenantRequest.user?.id,
      role: tenantRequest.tenant?.role
    });
  } catch (error) {
    logger.error('Failed to set tenant context', error as Error);
    throw error;
  }
}

/**
 * Require specific tenant role
 * Compatible with Fastify's preHandler hook
 */
export function requireTenantRole(roles: TenantMemberRole[]) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tenantRequest = request as TenantRequest;

    // Ensure tenant context is set
    if (!tenantRequest.tenant) {
      await requireTenant(request, reply);
    }

    // Ensure user is authenticated
    if (!tenantRequest.user) {
      throw new ForbiddenException('Authentication required');
    }

    // Check user role in tenant
    if (!tenantRequest.tenant?.role || !roles.includes(tenantRequest.tenant.role)) {
      throw new ForbiddenException('Insufficient tenant permissions');
    }
  };
}

/**
 * Optional tenant context - sets tenant if available but doesn't require it
 * Compatible with Fastify's preHandler hook
 */
export async function optionalTenant(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await requireTenant(request, reply);
  } catch (error) {
    // Ignore errors for optional tenant
    logger.debug('Optional tenant context not available');
  }
}

/**
 * Ensure user is member of tenant
 * Compatible with Fastify's preHandler hook
 */
export async function requireTenantMembership(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const tenantRequest = request as TenantRequest;

  // Ensure tenant context is set
  if (!tenantRequest.tenant) {
    await requireTenant(request, reply);
  }

  // Ensure user is authenticated
  if (!tenantRequest.user) {
    throw new ForbiddenException('Authentication required');
  }

  // Check membership
  if (!tenantRequest.tenant?.role) {
    const tenantService = Container.get(TenantService);
    const member = await tenantService.getMember(tenantRequest.tenant!.id, tenantRequest.user.id);

    if (!member) {
      throw new ForbiddenException('Not a member of this tenant');
    }

    tenantRequest.tenant.role = member.role;
  }
}

/**
 * Clear tenant context after request
 * Compatible with Fastify's onResponse hook
 */
export async function clearTenantContext(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const tenantContext = Container.get(TenantContextService);
  tenantContext.clear();
}
