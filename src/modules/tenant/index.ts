import { Container } from 'typedi';
import { TenantService } from './tenant.service';
import { TenantContextService } from './tenant.context';
import { TenantController } from './tenant.controller';
import { logger } from '@shared/logger';

// Export all components
export { TenantService } from './tenant.service';
export { TenantContextService } from './tenant.context';
export { TenantController } from './tenant.controller';
export { TenantEvents } from './tenant.events';
export * from './tenant.dto';
export * from './middleware';
export * from './tenant.utils'; // NEW: Export utility functions

// Export routes
export { default as tenantRoutes } from './tenant.route';

/**
 * Initialize Tenant module
 */
export async function initializeTenantModule(): Promise<void> {
  try {
    logger.info('Initializing tenant module...');

    // Initialize services
    Container.get(TenantService);
    Container.get(TenantContextService);
    Container.get(TenantController);

    logger.info('Tenant module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize tenant module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Tenant module
 */
export async function shutdownTenantModule(): Promise<void> {
  logger.info('Tenant module shut down');
}
