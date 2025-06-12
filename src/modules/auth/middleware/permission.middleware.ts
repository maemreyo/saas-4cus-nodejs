import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { ForbiddenException } from '@shared/exceptions';
import { logger } from '@shared/logger';
import { AuthRequest } from './auth.middleware';

/**
 * Check if user has required permissions
 */
export function hasPermission(...requiredPermissions: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const authRequest = request as unknown as AuthRequest;

      // Skip check if no permissions required
      if (requiredPermissions.length === 0) {
        return;
      }

      // Ensure user is authenticated
      if (!authRequest.user) {
        throw new ForbiddenException('Authentication required');
      }

      // Get user permissions
      const userPermissions = authRequest.user.permissions || [];

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        throw new ForbiddenException('Insufficient permissions');
      }

      // Log for debugging
      logger.debug('Permission check passed', {
        userId: authRequest.user.id,
        requiredPermissions,
        userPermissions,
        path: request.url
      });

    } catch (error) {
      logger.error('Permission check failed', error as Error);
      throw error;
    }
  };
}
