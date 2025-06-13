import { FastifyRequest } from 'fastify';
import { ForbiddenException } from '@shared/exceptions';

/**
 * Extract tenant ID from request
 * The tenant ID is set by requireTenant middleware in (request as any).tenant.id
 */
export function getTenantId(request: FastifyRequest): string {
  const tenant = (request as any).tenant;

  if (!tenant || !tenant.id) {
    throw new ForbiddenException('Tenant context not found. Ensure requireTenant middleware is applied.');
  }

  return tenant.id;
}

/**
 * Extract tenant info from request
 */
export function getTenantInfo(request: FastifyRequest): { id: string; slug: string; name: string } {
  const tenant = (request as any).tenant;

  if (!tenant) {
    throw new ForbiddenException('Tenant context not found. Ensure requireTenant middleware is applied.');
  }

  return {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name
  };
}

/**
 * Get user ID from request
 */
export function getUserId(request: FastifyRequest): string {
  const user = (request as any).user;

  if (!user || !user.id) {
    throw new ForbiddenException('User context not found. Ensure requireAuth middleware is applied.');
  }

  return user.id;
}

/**
 * Get user info from request
 */
export function getUserInfo(request: FastifyRequest): {
  id: string;
  email: string;
  role: string;
  tenantId?: string;
  permissions?: string[];
} {
  const user = (request as any).user;

  if (!user) {
    throw new ForbiddenException('User context not found. Ensure requireAuth middleware is applied.');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    permissions: user.permissions
  };
}
