import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { SubscriptionService } from '@modules/billing/subscription.service';
import { TenantContextService } from '@modules/tenant/tenant.context';
import { ForbiddenException } from '@shared/exceptions';
import { Cacheable } from '@infrastructure/cache/redis.service';

export interface Entitlement {
  feature: string;
  access: boolean;
  limit?: number;
  used?: number;
  remaining?: number;
}

@Service()
export class EntitlementService {
  constructor(
    private subscriptionService: SubscriptionService,
    private tenantContext: TenantContextService
  ) {}

  /**
   * Check if user has access to a feature
   */
  async check(userId: string, featureKey: string): Promise<boolean> {
    const entitlement = await this.getEntitlement(userId, featureKey);
    return entitlement.access;
  }

  /**
   * Get entitlement details for a feature
   */
  @Cacheable({ ttl: 300, namespace: 'entitlements' })
  async getEntitlement(userId: string, featureKey: string): Promise<Entitlement> {
    // Get user's subscription
    const { plan } = await this.subscriptionService.getUserSubscription(userId);

    if (!plan) {
      return {
        feature: featureKey,
        access: false
      };
    }

    // Get feature
    const feature = await prisma.client.feature.findUnique({
      where: { key: featureKey }
    });

    if (!feature) {
      return {
        feature: featureKey,
        access: false
      };
    }

    // Check plan feature
    const planFeature = await prisma.client.planFeature.findUnique({
      where: {
        planId_featureId: {
          planId: plan.id,
          featureId: feature.id
        }
      }
    });

    if (!planFeature || !planFeature.included) {
      return {
        feature: featureKey,
        access: false
      };
    }

    // If no limit, just return access
    if (!planFeature.limitValue) {
      return {
        feature: featureKey,
        access: true
      };
    }

    // Check usage against limit
    const tenantId = this.tenantContext.getTenantId();
    const used = await this.getFeatureUsage(userId, feature.id, tenantId);
    const remaining = Math.max(0, planFeature.limitValue - used);

    return {
      feature: featureKey,
      access: remaining > 0,
      limit: planFeature.limitValue,
      used,
      remaining
    };
  }

  /**
   * Get all entitlements for user
   */
  async getAllEntitlements(userId: string): Promise<Entitlement[]> {
    const { plan } = await this.subscriptionService.getUserSubscription(userId);

    if (!plan) {
      return [];
    }

    const planFeatures = await prisma.client.planFeature.findMany({
      where: {
        planId: plan.id,
        included: true
      },
      include: {
        feature: true
      }
    });

    const tenantId = this.tenantContext.getTenantId();
    const entitlements: Entitlement[] = [];

    for (const pf of planFeatures) {
      const entitlement: Entitlement = {
        feature: pf.feature.key,
        access: true
      };

      if (pf.limitValue) {
        const used = await this.getFeatureUsage(userId, pf.feature.id, tenantId);
        entitlement.limit = pf.limitValue;
        entitlement.used = used;
        entitlement.remaining = Math.max(0, pf.limitValue - used);
        entitlement.access = entitlement.remaining > 0;
      }

      entitlements.push(entitlement);
    }

    return entitlements;
  }

  /**
   * Consume an entitlement
   */
  async consume(userId: string, featureKey: string, amount: number = 1): Promise<void> {
    const entitlement = await this.getEntitlement(userId, featureKey);

    if (!entitlement.access) {
      throw new ForbiddenException(`No access to feature: ${featureKey}`);
    }

    if (entitlement.limit && entitlement.remaining !== undefined) {
      if (entitlement.remaining < amount) {
        throw new ForbiddenException(
          `Insufficient quota for feature: ${featureKey}. Required: ${amount}, Available: ${entitlement.remaining}`
        );
      }
    }

    // Track usage
    const feature = await prisma.client.feature.findUnique({
      where: { key: featureKey }
    });

    if (feature) {
      const tenantId = this.tenantContext.getTenantId();
      await this.incrementUsage(userId, feature.id, tenantId, amount);

      // Clear cache
      await redis.delete(`entitlements:${userId}:${featureKey}`);
    }
  }

  /**
   * Get feature usage for current period
   */
  private async getFeatureUsage(
    userId: string,
    featureId: string,
    tenantId?: string
  ): Promise<number> {
    // Get current billing period
    const { subscription } = await this.subscriptionService.getUserSubscription(userId);
    const startDate = subscription?.currentPeriodStart || new Date(new Date().setDate(1));

    const usage = await prisma.client.featureUsage.aggregate({
      where: {
        userId,
        featureId,
        tenantId,
        createdAt: { gte: startDate }
      },
      _sum: {
        count: true
      }
    });

    return usage._sum.count || 0;
  }

  /**
   * Increment feature usage
   */
  private async incrementUsage(
    userId: string,
    featureId: string,
    tenantId: string | undefined,
    amount: number
  ): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.client.featureUsage.findFirst({
      where: {
        userId,
        featureId,
        tenantId,
        createdAt: { gte: today }
      }
    });

    if (existing) {
      await prisma.client.featureUsage.update({
        where: { id: existing.id },
        data: {
          count: { increment: amount },
          lastUsedAt: new Date()
        }
      });
    } else {
      await prisma.client.featureUsage.create({
        data: {
          userId,
          featureId,
          tenantId,
          count: amount
        }
      });
    }
  }

  /**
   * Reset usage for a feature
   */
  async resetUsage(userId: string, featureKey: string): Promise<void> {
    const feature = await prisma.client.feature.findUnique({
      where: { key: featureKey }
    });

    if (!feature) return;

    const tenantId = this.tenantContext.getTenantId();

    await prisma.client.featureUsage.deleteMany({
      where: {
        userId,
        featureId: feature.id,
        tenantId
      }
    });

    // Clear cache
    await redis.delete(`entitlements:${userId}:${featureKey}`);
  }
}