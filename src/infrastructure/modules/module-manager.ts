import { logger } from '@shared/logger';
import { Container } from 'typedi';

// Import all module initializers
import { initializeAuthModule, shutdownAuthModule } from '@modules/auth';
import { initializeUserModule, shutdownUserModule } from '@modules/user';
import { initializeBillingModule, shutdownBillingModule } from '@modules/billing';
import { initializeTenantModule, shutdownTenantModule } from '@modules/tenant';
import { initializeNotificationModule, shutdownNotificationModule } from '@modules/notification';
import { initializeSupportModule, shutdownSupportModule } from '@modules/support';
import { initializeApiUsageModule, shutdownApiUsageModule } from '@modules/api-usage';
import { initializeAdminModule, shutdownAdminModule } from '@modules/admin';
import { initializeAnalyticsModule, shutdownAnalyticsModule } from '@modules/analytics';
import { initializeFeaturesModule, shutdownFeaturesModule } from '@modules/features';
import { initializeOnboardingModule, shutdownOnboardingModule } from '@modules/onboarding';
import { initializeWebhooksModule, shutdownWebhooksModule } from '@modules/webhooks';

export interface ModuleConfig {
  name: string;
  enabled: boolean;
  priority: number; // Lower number = higher priority
  dependencies?: string[];
  initialize: () => Promise<void>;
  shutdown: () => Promise<void>;
  healthCheck?: () => Promise<{ healthy: boolean; details?: any }>;
}

export class ModuleManager {
  private static instance: ModuleManager;
  private modules: Map<string, ModuleConfig> = new Map();
  private initialized: Set<string> = new Set();
  private initializationOrder: string[] = [];

  private constructor() {
    this.registerModules();
  }

  static getInstance(): ModuleManager {
    if (!ModuleManager.instance) {
      ModuleManager.instance = new ModuleManager();
    }
    return ModuleManager.instance;
  }

  private registerModules() {
    // Core modules (priority 100-199)
    this.register({
      name: 'auth',
      enabled: true,
      priority: 100,
      initialize: initializeAuthModule,
      shutdown: shutdownAuthModule,
      healthCheck: async () => ({ healthy: true }),
    });

    this.register({
      name: 'user',
      enabled: true,
      priority: 110,
      dependencies: ['auth'],
      initialize: initializeUserModule,
      shutdown: shutdownUserModule,
      healthCheck: async () => ({ healthy: true }),
    });

    // Business modules (priority 200-299)
    this.register({
      name: 'tenant',
      enabled: process.env.TENANT_MODULE_ENABLED !== 'false',
      priority: 200,
      dependencies: ['auth', 'user'],
      initialize: initializeTenantModule,
      shutdown: shutdownTenantModule,
      healthCheck: async () => ({ healthy: true }),
    });

    this.register({
      name: 'billing',
      enabled: process.env.BILLING_MODULE_ENABLED !== 'false',
      priority: 210,
      dependencies: ['auth', 'user', 'tenant'],
      initialize: initializeBillingModule,
      shutdown: shutdownBillingModule,
      healthCheck: async () => {
        // Check Stripe connection
        const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;
        return {
          healthy: stripeConfigured,
          details: { stripeConfigured },
        };
      },
    });

    this.register({
      name: 'features',
      enabled: true,
      priority: 220,
      dependencies: ['billing'],
      initialize: initializeFeaturesModule,
      shutdown: shutdownFeaturesModule,
      healthCheck: async () => ({ healthy: true }),
    });

    // Feature modules (priority 300-399)
    this.register({
      name: 'notification',
      enabled: true,
      priority: 300,
      dependencies: ['user'],
      initialize: initializeNotificationModule,
      shutdown: shutdownNotificationModule,
      healthCheck: async () => ({ healthy: true }),
    });

    this.register({
      name: 'support',
      enabled: process.env.SUPPORT_MODULE_ENABLED !== 'false',
      priority: 310,
      dependencies: ['user', 'notification'],
      initialize: initializeSupportModule,
      shutdown: shutdownSupportModule,
      healthCheck: async () => ({ healthy: true }),
    });

    this.register({
      name: 'analytics',
      enabled: process.env.ANALYTICS_MODULE_ENABLED !== 'false',
      priority: 320,
      dependencies: ['user'],
      initialize: initializeAnalyticsModule,
      shutdown: shutdownAnalyticsModule,
      healthCheck: async () => ({ healthy: true }),
    });

    this.register({
      name: 'onboarding',
      enabled: process.env.ONBOARDING_MODULE_ENABLED !== 'false',
      priority: 330,
      dependencies: ['user', 'analytics'],
      initialize: initializeOnboardingModule,
      shutdown: shutdownOnboardingModule,
      healthCheck: async () => ({ healthy: true }),
    });

    this.register({
      name: 'webhooks',
      enabled: process.env.WEBHOOKS_MODULE_ENABLED !== 'false',
      priority: 340,
      dependencies: ['user'],
      initialize: initializeWebhooksModule,
      shutdown: shutdownWebhooksModule,
      healthCheck: async () => ({ healthy: true }),
    });

    // System modules (priority 400-499)
    this.register({
      name: 'api-usage',
      enabled: true,
      priority: 400,
      dependencies: ['user', 'billing'],
      initialize: initializeApiUsageModule,
      shutdown: shutdownApiUsageModule,
      healthCheck: async () => ({ healthy: true }),
    });

    this.register({
      name: 'admin',
      enabled: process.env.ADMIN_MODULE_ENABLED !== 'false',
      priority: 410,
      dependencies: ['auth', 'user', 'billing', 'tenant'],
      initialize: initializeAdminModule,
      shutdown: shutdownAdminModule,
      healthCheck: async () => ({ healthy: true }),
    });
  }

  private register(config: ModuleConfig) {
    this.modules.set(config.name, config);
  }

  async initializeAll(): Promise<void> {
    logger.info('Starting module initialization...');

    // Get enabled modules
    const enabledModules = Array.from(this.modules.values())
      .filter(m => m.enabled)
      .sort((a, b) => a.priority - b.priority);

    // Build initialization order respecting dependencies
    const order = this.buildInitializationOrder(enabledModules);

    // Initialize modules in order
    for (const moduleName of order) {
      const module = this.modules.get(moduleName);
      if (!module) continue;

      try {
        logger.info(`Initializing module: ${moduleName}`);
        await module.initialize();
        this.initialized.add(moduleName);
        this.initializationOrder.push(moduleName);
        logger.info(`Module ${moduleName} initialized successfully`);
      } catch (error) {
        logger.error(`Failed to initialize module: ${moduleName}`, error as Error);
        throw new Error(`Module initialization failed: ${moduleName}`);
      }
    }

    logger.info('All modules initialized successfully', {
      initialized: Array.from(this.initialized),
    });
  }

  async shutdownAll(): Promise<void> {
    logger.info('Starting module shutdown...');

    // Shutdown in reverse order
    const shutdownOrder = [...this.initializationOrder].reverse();

    for (const moduleName of shutdownOrder) {
      const module = this.modules.get(moduleName);
      if (!module) continue;

      try {
        logger.info(`Shutting down module: ${moduleName}`);
        await module.shutdown();
        this.initialized.delete(moduleName);
        logger.info(`Module ${moduleName} shut down successfully`);
      } catch (error) {
        logger.error(`Error shutting down module: ${moduleName}`, error as Error);
        // Continue with other modules
      }
    }

    this.initializationOrder = [];
    logger.info('All modules shut down');
  }

  async healthCheck(): Promise<{
    healthy: boolean;
    modules: Record<string, any>;
  }> {
    const results: Record<string, any> = {};
    let allHealthy = true;

    for (const [name, module] of this.modules) {
      if (!module.enabled || !this.initialized.has(name)) {
        results[name] = { status: 'disabled' };
        continue;
      }

      if (module.healthCheck) {
        try {
          const health = await module.healthCheck();
          results[name] = {
            status: health.healthy ? 'healthy' : 'unhealthy',
            ...health.details,
          };
          if (!health.healthy) allHealthy = false;
        } catch (error) {
          results[name] = {
            status: 'error',
            error: (error as Error).message,
          };
          allHealthy = false;
        }
      } else {
        results[name] = { status: 'healthy' };
      }
    }

    return { healthy: allHealthy, modules: results };
  }

  getInitializedModules(): string[] {
    return Array.from(this.initialized);
  }

  isModuleInitialized(name: string): boolean {
    return this.initialized.has(name);
  }

  private buildInitializationOrder(modules: ModuleConfig[]): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (moduleName: string) => {
      if (visited.has(moduleName)) return;
      if (visiting.has(moduleName)) {
        throw new Error(`Circular dependency detected: ${moduleName}`);
      }

      const module = this.modules.get(moduleName);
      if (!module || !module.enabled) return;

      visiting.add(moduleName);

      // Visit dependencies first
      if (module.dependencies) {
        for (const dep of module.dependencies) {
          visit(dep);
        }
      }

      visiting.delete(moduleName);
      visited.add(moduleName);
      order.push(moduleName);
    };

    // Visit all modules
    for (const module of modules) {
      visit(module.name);
    }

    return order;
  }
}

// Export singleton instance
export const moduleManager = ModuleManager.getInstance();