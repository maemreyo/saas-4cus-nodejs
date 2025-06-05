import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { TenantService } from './tenant.service';
import { TenantContextService } from './tenant.context';
import { ForbiddenException, BadRequestException } from '@shared/exceptions';

/**
 * Extract tenant from subdomain or header
 */
export async function tenantMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const tenantService = Container.get(TenantService);
  const contextService = Container.get(TenantContextService);

  let tenantId: string | undefined;
  let tenantSlug: string | undefined;

  // 1. Check subdomain
  const host = request.hostname;
  const subdomain = host.split('.')[0];

  if (subdomain && subdomain !== 'app' && subdomain !== 'www') {
    tenantSlug = subdomain;
  }

  // 2. Check header (overrides subdomain)
  const headerTenantId = request.headers['x-tenant-id'] as string;
  const headerTenantSlug = request.headers['x-tenant-slug'] as string;

  if (headerTenantId) {
    tenantId = headerTenantId;
  } else if (headerTenantSlug) {
    tenantSlug = headerTenantSlug;
  }

  // 3. Check query parameter (for testing)
  if (process.env.NODE_ENV === 'development') {
    const queryTenant = (request.query as any).tenant;
    if (queryTenant) {
      tenantSlug = queryTenant;
    }
  }

  // If no tenant identified, continue without tenant context
  if (!tenantId && !tenantSlug) {
    return;
  }

  try {
    // Get tenant
    let tenant;
    if (tenantId) {
      tenant = await tenantService.getTenant(tenantId);
    } else if (tenantSlug) {
      tenant = await tenantService.getTenantBySlug(tenantSlug);
    }

    if (!tenant) {
      throw new BadRequestException('Invalid tenant');
    }

    // Check if user is member of tenant
    if (request.customUser) {
      const membership = await tenantService.checkTenantPermission(
        tenant.id,
        request.customUser.id
      );

      // Set tenant context
      await contextService.run({
        tenantId: tenant.id,
        userId: request.customUser.id,
        role: membership.role
      }, async () => {
        // Continue with request
        await reply;
      });
    }

    // Add tenant to request
    (request as any).tenant = tenant;
  } catch (error) {
    // Log error but don't fail request
    logger.error('Tenant middleware error', error as Error);
  }
}

/**
 * Require tenant context
 */
export function requireTenant() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!(request as any).tenant) {
      throw new BadRequestException('Tenant context required');
    }
  };
}

/**
 * Require specific tenant role
 */
export function requireTenantRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const contextService = Container.get(TenantContextService);
    const context = contextService.get();

    if (!context) {
      throw new ForbiddenException('No tenant context');
    }

    if (!roles.includes(context.role)) {
      throw new ForbiddenException('Insufficient tenant permissions');
    }
  };
}