import { Container } from 'typedi';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { logger } from '@shared/logger';

// Export all components
export { AuthService } from './auth.service';
export { AuthController } from './auth.controller';
export * from './auth.dto';
export * from './auth.schema';

// Export routes
export { default as authRoutes } from './auth.route';

/**
 * Initialize Auth module
 */
export async function initializeAuthModule(): Promise<void> {
  try {
    logger.info('Initializing auth module...');

    // Initialize services
    Container.get(AuthService);
    Container.get(AuthController);

    logger.info('Auth module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize auth module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Auth module
 */
export async function shutdownAuthModule(): Promise<void> {
  logger.info('Auth module shut down');
}