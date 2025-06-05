import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { SubscriptionService } from './subscription.service';
import { ForbiddenException } from '@shared/exceptions';

/**
 * Middleware to check if user has required feature
 */
export function requireFeature(featureId: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const subscriptionService = Container.get(SubscriptionService);
    const userId = request.customUser!.id;

    const hasAccess = await subscriptionService.hasFeature(userId, featureId);

    if (!hasAccess) {
      throw new ForbiddenException('This feature is not available in your current plan', {
        feature: featureId,
        upgrade_url: '/billing/upgrade',
      });
    }
  };
}

/**
 * Middleware to check if user has required plan
 */
export function requirePlan(minPlanId: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const subscriptionService = Container.get(SubscriptionService);
    const userId = request.customUser!.id;

    const { plan } = await subscriptionService.getUserSubscription(userId);

    const planHierarchy = ['free', 'starter', 'pro', 'enterprise'];
    const currentPlanIndex = planHierarchy.indexOf(plan?.id || 'free');
    const requiredPlanIndex = planHierarchy.indexOf(minPlanId);

    if (currentPlanIndex < requiredPlanIndex) {
      throw new ForbiddenException(`This feature requires ${minPlanId} plan or higher`, {
        current_plan: plan?.id || 'free',
        required_plan: minPlanId,
        upgrade_url: '/billing/upgrade',
      });
    }
  };
}

/**
 * Middleware to check usage limits
 */
export function checkUsageLimit(resource: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const subscriptionService = Container.get(SubscriptionService);
    const userId = request.customUser!.id;

    await subscriptionService.enforceUsageLimit(userId, resource as any);
  };
}
