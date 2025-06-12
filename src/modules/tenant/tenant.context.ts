import { AsyncLocalStorage } from 'async_hooks';
import { Service } from 'typedi';

export interface TenantContext {
  tenantId: string;
  userId?: string;
  role?: string;
  tenantSlug?: string;
  tenantName?: string;
}

@Service()
export class TenantContextService {
  private storage = new AsyncLocalStorage<TenantContext>();

  /**
   * Run code with tenant context
   */
  run<T>(context: TenantContext, fn: () => T): T {
    return this.storage.run(context, fn);
  }

  /**
   * Get current tenant context
   */
  get(): TenantContext | undefined {
    return this.storage.getStore();
  }

  /**
   * Get current tenant ID
   */
  getTenantId(): string | undefined {
    return this.storage.getStore()?.tenantId;
  }

  /**
   * Require tenant context
   */
  require(): TenantContext {
    const context = this.get();
    if (!context) {
      throw new Error('No tenant context available');
    }
    return context;
  }

  /**
   * Set tenant information
   */
  setTenant(tenant: { id: string; slug: string; name: string }): void {
    const currentContext = this.get() || { tenantId: tenant.id };

    // Update context with tenant info
    const newContext: TenantContext = {
      ...currentContext,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantName: tenant.name
    };

    // Run with updated context
    this.storage.enterWith(newContext);
  }

  /**
   * Set member role in tenant
   */
  setMemberRole(role: string): void {
    const currentContext = this.require();

    // Update context with role
    const newContext: TenantContext = {
      ...currentContext,
      role
    };

    // Run with updated context
    this.storage.enterWith(newContext);
  }

  /**
   * Clear tenant context
   */
  clear(): void {
    this.storage.enterWith(undefined as any);
  }
}
