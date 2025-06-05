import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { EntitlementService } from './entitlement.service';
import { FeatureService } from './feature.service';
import { ForbiddenException } from '@shared/exceptions';

/**
 * Require feature entitlement
 */
export function requireFeature(featureKey: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const entitlementService = Container.get(EntitlementService);
    const userId = request.customUser!.id;

    const hasAccess = await entitlementService.check(userId, featureKey);

    if (!hasAccess) {
      throw new ForbiddenException(
        `No access to feature: ${featureKey}`,
        {
          feature: featureKey,
          upgrade_url: '/billing/upgrade'
        }
      );
    }
  };
}

/**
 * Consume feature entitlement
 */
export function consumeFeature(featureKey: string, amount: number = 1) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const entitlementService = Container.get(EntitlementService);
    const userId = request.customUser!.id;

    await entitlementService.consume(userId, featureKey, amount);
  };
}

/**
 * Check feature flag
 */
export function featureFlag(key: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const featureService = Container.get(FeatureService);
    const userId = request.customUser?.id;

    const enabled = await featureService.isFeatureFlagEnabled(key, userId);

    if (!enabled) {
      throw new ForbiddenException(
        `Feature flag not enabled: ${key}`,
        { feature_flag: key }
      );
    }
  };
}