import { Container } from 'typedi';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEventHandlers } from './user.events';
import { logger } from '@shared/logger';

// Export all components
export { UserService } from './user.service';
export { UserController } from './user.controller';
export { UserEventHandlers } from './user.events';
export * from './user.dto';

// Export routes
export { default as userRoutes } from './user.route';

/**
 * Initialize User module
 */
export async function initializeUserModule(): Promise<void> {
  try {
    logger.info('Initializing user module...');

    // Initialize services
    Container.get(UserService);
    Container.get(UserController);
    Container.get(UserEventHandlers);

    logger.info('User module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize user module', error as Error);
    throw error;
  }
}

/**
 * Shutdown User module
 */
export async function shutdownUserModule(): Promise<void> {
  logger.info('User module shut down');
}