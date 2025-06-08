import { Container } from 'typedi';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { logger } from '@shared/logger';

// Export all components
export { OnboardingService } from './onboarding.service';
export { OnboardingController } from './onboarding.controller';
export * from './onboarding.dto';

// Export types
export type {
  OnboardingFlowTemplate,
  OnboardingStepTemplate,
  OnboardingContext
} from './onboarding.service';

// Export routes
export { default as onboardingRoutes } from './onboarding.route';

/**
 * Initialize Onboarding module
 */
export async function initializeOnboardingModule(): Promise<void> {
  try {
    logger.info('Initializing onboarding module...');

    // Initialize services
    Container.get(OnboardingService);
    Container.get(OnboardingController);

    logger.info('Onboarding module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize onboarding module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Onboarding module
 */
export async function shutdownOnboardingModule(): Promise<void> {
  logger.info('Onboarding module shut down');
}

// Convenience functions
export async function startOnboarding(
  userId: string,
  flowId: string,
  context?: any
): Promise<any> {
  const onboardingService = Container.get(OnboardingService);
  return onboardingService.startOnboarding(userId, flowId, context);
}

export async function getOnboardingProgress(userId: string): Promise<any> {
  const onboardingService = Container.get(OnboardingService);
  return onboardingService.getProgress(userId);
}

export async function completeOnboardingStep(
  userId: string,
  stepId: string,
  data?: any
): Promise<void> {
  const onboardingService = Container.get(OnboardingService);
  return onboardingService.completeStep(userId, stepId, data);
}

export async function getOnboardingChecklist(userId: string): Promise<any> {
  const onboardingService = Container.get(OnboardingService);
  return onboardingService.getChecklist(userId);
}

export async function getOnboardingHints(userId: string, page: string): Promise<any[]> {
  const onboardingService = Container.get(OnboardingService);
  return onboardingService.getHints(userId, page);
}
