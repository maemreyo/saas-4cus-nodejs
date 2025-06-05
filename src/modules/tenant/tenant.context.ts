import { AsyncLocalStorage } from 'async_hooks';
import { Service } from 'typedi';

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: string;
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
}