import { Container } from 'typedi';
import { FeatureService } from './feature.service';
import { EntitlementService } from './entitlement.service';
import { FeatureController } from './feature.controller';
import { logger } from '@shared/logger';

// Export all components
export { FeatureService } from './feature.service';
export { EntitlementService } from './entitlement.service';
export { FeatureController } from './feature.controller';
export * from './feature.dto';
export * from './feature.events';
export * from './feature.middleware';

// Export types
export type { CreateFeatureOptions, CreatePlanOptions, UpdatePlanOptions, FeatureFlag } from './feature.service';

export type { Entitlement } from './entitlement.service';

// Export routes
export { default as featureRoutes } from './feature.route';

/**
 * Initialize Features module
 */
export async function initializeFeaturesModule(): Promise<void> {
  try {
    logger.info('Initializing features module...');

    // Initialize services
    const featureService = Container.get(FeatureService);
    Container.get(EntitlementService);
    Container.get(FeatureController);

    // Initialize feature flags
    await featureService['initializeFeatureFlags']();

    logger.info('Features module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize features module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Features module
 */
export async function shutdownFeaturesModule(): Promise<void> {
  logger.info('Features module shut down');
}

// Convenience functions
export async function checkFeature(userId: string, featureKey: string): Promise<boolean> {
  const entitlementService = Container.get(EntitlementService);
  return entitlementService.check(userId, featureKey);
}

export async function getEntitlement(userId: string, featureKey: string): Promise<any> {
  const entitlementService = Container.get(EntitlementService);
  return entitlementService.getEntitlement(userId, featureKey);
}

export async function consumeFeature(userId: string, featureKey: string, amount = 1): Promise<void> {
  const entitlementService = Container.get(EntitlementService);
  return entitlementService.consume(userId, featureKey, amount);
}

export async function isFeatureFlagEnabled(key: string, userId?: string): Promise<boolean> {
  const featureService = Container.get(FeatureService);
  return featureService.isFeatureFlagEnabled(key, userId);
}

export async function trackFeatureUsage(userId: string, featureKey: string, tenantId?: string): Promise<void> {
  const featureService = Container.get(FeatureService);
  return featureService.trackFeatureUsage(userId, featureKey, tenantId);
}
