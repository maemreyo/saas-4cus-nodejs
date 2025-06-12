import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { ForbiddenException } from '@shared/exceptions';
import { logger } from '@shared/logger';
import { AuthRequest } from '@modules/auth/middleware/auth.middleware';

/**
 * Check if user has an active subscription
 * This is a placeholder implementation - replace with actual subscription logic
 */
export async function checkSubscription(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authRequest = request as unknown as AuthRequest;

    // Skip check if no user (should be caught by auth middleware)
    if (!authRequest.user) {
      return;
    }

    // TODO: Implement actual subscription check logic
    // For now, we'll assume all authenticated users have access

    // Example implementation:
    // const subscriptionService = Container.get(SubscriptionService);
    // const hasActiveSubscription = await subscriptionService.hasActiveSubscription(authRequest.user.id);
    // if (!hasActiveSubscription) {
    //   throw new ForbiddenException('Your subscription has expired');
    // }

    // Log for debugging
    logger.debug('Subscription check passed', {
      userId: authRequest.user.id,
      path: request.url
    });

  } catch (error) {
    logger.error('Subscription check failed', error as Error);
    throw error;
  }
}
