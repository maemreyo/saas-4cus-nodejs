
import 'fastify';
import { UserRole, TenantMemberRole } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    // User property set by auth middleware
    user?: {
      id: string;
      email: string;
      role: UserRole;
      tenantId?: string;
      permissions?: string[];
    };

    // Tenant property set by tenant middleware
    tenant?: {
      id: string;
      slug: string;
      name: string;
      role?: TenantMemberRole;
    };
  }
}
