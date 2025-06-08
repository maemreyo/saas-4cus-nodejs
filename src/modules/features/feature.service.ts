import { Service } from 'typedi';
import { Feature, Plan, PlanFeature } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException
} from '@shared/exceptions';
import { FeatureEvents } from './feature.events';

export interface CreateFeatureOptions {
  name: string;
  key: string;
  description?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface CreatePlanOptions {
  name: string;
  slug: string;
  description?: string;
  stripePriceId?: string;
  stripeProductId?: string;
  price: number;
  currency?: string;
  interval?: string;
  trialDays?: number;
  popular?: boolean;
  features: Array<{
    featureId: string;
    included: boolean;
    limitValue?: number;
  }>;
  metadata?: Record<string, any>;
}

export interface UpdatePlanOptions {
  name?: string;
  description?: string;
  price?: number;
  popular?: boolean;
  features?: Array<{
    featureId: string;
    included: boolean;
    limitValue?: number;
  }>;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  userWhitelist?: string[];
  userBlacklist?: string[];
  metadata?: Record<string, any>;
}

@Service()
export class FeatureService {
  private featureFlags: Map<string, FeatureFlag> = new Map();

  constructor(private eventBus: EventBus) {
    this.initializeFeatureFlags();
  }

  /**
   * Initialize feature flags from config or database
   */
  private async initializeFeatureFlags() {
    // Load feature flags from database or config
    const flags: FeatureFlag[] = [
      {
        key: 'new_dashboard',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        key: 'beta_api_v2',
        enabled: false,
        rolloutPercentage: 0,
        userWhitelist: []
      },
      {
        key: 'advanced_analytics',
        enabled: true,
        rolloutPercentage: 50
      }
    ];

    flags.forEach(flag => this.featureFlags.set(flag.key, flag));
  }

  /**
   * Create a new feature
   */
  async createFeature(options: CreateFeatureOptions): Promise<Feature> {
    // Check if feature key already exists
    const existing = await prisma.client.feature.findUnique({
      where: { key: options.key }
    });

    if (existing) {
      throw new ConflictException('Feature key already exists');
    }

    const feature = await prisma.client.feature.create({
      data: {
        name: options.name,
        key: options.key,
        description: options.description,
        category: options.category,
        metadata: options.metadata || {}
      }
    });

    logger.info('Feature created', { featureId: feature.id, key: feature.key });

    await this.eventBus.emit(FeatureEvents.FEATURE_CREATED, {
      featureId: feature.id,
      key: feature.key,
      timestamp: new Date()
    });

    return feature;
  }

  /**
   * Get all features
   */
  @Cacheable({ ttl: 3600, namespace: 'features' })
  async getFeatures(options?: {
    category?: string;
    includeUsage?: boolean;
  }): Promise<Feature[]> {
    const where = options?.category ? { category: options.category } : {};

    const features = await prisma.client.feature.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    if (options?.includeUsage) {
      // Add usage statistics
      const featureIds = features.map(f => f.id);
      const usage = await prisma.client.featureUsage.groupBy({
        by: ['featureId'],
        where: { featureId: { in: featureIds } },
        _count: { userId: true }
      });

      const usageMap = new Map(usage.map(u => [u.featureId, u._count.userId]));

      return features.map(feature => ({
        ...feature,
        usage: usageMap.get(feature.id) || 0
      }));
    }

    return features;
  }

  /**
   * Get feature by key
   */
  async getFeatureByKey(key: string): Promise<Feature> {
    const feature = await prisma.client.feature.findUnique({
      where: { key }
    });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    return feature;
  }

  /**
   * Create a new plan
   */
  @CacheInvalidate(['plans'])
  async createPlan(options: CreatePlanOptions): Promise<Plan> {
    // Check if slug already exists
    const existing = await prisma.client.plan.findUnique({
      where: { slug: options.slug }
    });

    if (existing) {
      throw new ConflictException('Plan slug already exists');
    }

    // Create plan with features in transaction
    const plan = await prisma.client.$transaction(async (tx) => {
      // Create plan
      const newPlan = await tx.plan.create({
        data: {
          name: options.name,
          slug: options.slug,
          description: options.description,
          stripePriceId: options.stripePriceId,
          stripeProductId: options.stripeProductId,
          price: options.price,
          currency: options.currency || 'usd',
          interval: options.interval || 'month',
          trialDays: options.trialDays || 0,
          popular: options.popular || false,
          metadata: options.metadata
        }
      });

      // Create plan features
      if (options.features.length > 0) {
        await tx.planFeature.createMany({
          data: options.features.map(f => ({
            planId: newPlan.id,
            featureId: f.featureId,
            included: f.included,
            limitValue: f.limitValue
          }))
        });
      }

      return newPlan;
    });

    logger.info('Plan created', { planId: plan.id, slug: plan.slug });

    await this.eventBus.emit(FeatureEvents.PLAN_CREATED, {
      planId: plan.id,
      slug: plan.slug,
      timestamp: new Date()
    });

    return plan;
  }

  /**
   * Get all plans with features
   */
  @Cacheable({ ttl: 3600, namespace: 'plans' })
  async getPlans(options?: {
    active?: boolean;
    includeFeatures?: boolean;
  }): Promise<Array<Plan & { features?: any[] }>> {
    const where = options?.active !== undefined ? { active: options.active } : {};

    const plans = await prisma.client.plan.findMany({
      where,
      include: options?.includeFeatures ? {
        features: {
          include: {
            feature: true
          }
        }
      } : undefined,
      orderBy: { price: 'asc' }
    });

    return plans;
  }

  /**
   * Get plan by slug
   */
  async getPlanBySlug(slug: string): Promise<Plan & { features: any[] }> {
    const plan = await prisma.client.plan.findUnique({
      where: { slug },
      include: {
        features: {
          include: {
            feature: true
          }
        }
      }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  /**
   * Update plan
   */
  @CacheInvalidate(['plans'])
  async updatePlan(
    planId: string,
    updates: UpdatePlanOptions
  ): Promise<Plan> {
    const plan = await prisma.client.plan.update({
      where: { id: planId },
      data: {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        popular: updates.popular
      }
    });

    // Update features if provided
    if (updates.features) {
      await prisma.client.$transaction(async (tx) => {
        // Remove existing features
        await tx.planFeature.deleteMany({
          where: { planId }
        });

        // Add new features
        await tx.planFeature.createMany({
          data: updates.features!.map(f => ({
            planId,
            featureId: f.featureId,
            included: f.included,
            limitValue: f.limitValue
          }))
        });
      });
    }

    logger.info('Plan updated', { planId });

    await this.eventBus.emit(FeatureEvents.PLAN_UPDATED, {
      planId,
      timestamp: new Date()
    });

    return plan;
  }

  /**
   * Check if feature flag is enabled for user
   */
  async isFeatureFlagEnabled(
    key: string,
    userId?: string,
    attributes?: Record<string, any>
  ): Promise<boolean> {
    const flag = this.featureFlags.get(key);

    if (!flag) {
      return false;
    }

    // Check if globally disabled
    if (!flag.enabled) {
      return false;
    }

    // Check user blacklist
    if (userId && flag.userBlacklist?.includes(userId)) {
      return false;
    }

    // Check user whitelist
    if (userId && flag.userWhitelist?.includes(userId)) {
      return true;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      if (!userId) {
        return false; // Need user ID for percentage rollout
      }

      // Use consistent hashing for user
      const hash = this.hashUserId(userId, key);
      return hash < flag.rolloutPercentage;
    }

    return true;
  }

  /**
   * Get all feature flags for user
   */
  async getUserFeatureFlags(userId: string): Promise<Record<string, boolean>> {
    const flags: Record<string, boolean> = {};

    for (const [key, _] of this.featureFlags) {
      flags[key] = await this.isFeatureFlagEnabled(key, userId);
    }

    return flags;
  }

  /**
   * Update feature flag
   */
  async updateFeatureFlag(
    key: string,
    updates: Partial<FeatureFlag>
  ): Promise<void> {
    const flag = this.featureFlags.get(key);

    if (!flag) {
      throw new NotFoundException('Feature flag not found');
    }

    this.featureFlags.set(key, { ...flag, ...updates });

    // Store in Redis for distributed systems
    await redis.set(`feature_flag:${key}`, { ...flag, ...updates });

    logger.info('Feature flag updated', { key, updates });

    await this.eventBus.emit(FeatureEvents.FEATURE_FLAG_UPDATED, {
      key,
      updates,
      timestamp: new Date()
    });
  }

  /**
   * Track feature usage
   */
  async trackFeatureUsage(
    userId: string,
    featureKey: string,
    tenantId?: string
  ): Promise<void> {
    try {
      const feature = await this.getFeatureByKey(featureKey);

      // Check if usage record exists for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existing = await prisma.client.featureUsage.findFirst({
        where: {
          userId,
          featureId: feature.id,
          tenantId,
          createdAt: { gte: today }
        }
      });

      if (existing) {
        // Update count
        await prisma.client.featureUsage.update({
          where: { id: existing.id },
          data: {
            count: { increment: 1 },
            lastUsedAt: new Date()
          }
        });
      } else {
        // Create new record
        await prisma.client.featureUsage.create({
          data: {
            userId,
            featureId: feature.id,
            tenantId,
            count: 1
          }
        });
      }
    } catch (error) {
      // Don't throw, just log
      logger.error('Failed to track feature usage', error as Error, {
        userId,
        featureKey
      });
    }
  }

  /**
   * Get feature usage statistics
   */
  async getFeatureUsageStats(
    featureKey: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      tenantId?: string;
    }
  ): Promise<{
    totalUsers: number;
    totalUsage: number;
    dailyUsage: Array<{ date: Date; count: number; users: number }>;
  }> {
    const feature = await this.getFeatureByKey(featureKey);

    const where = {
      featureId: feature.id,
      ...(options?.tenantId && { tenantId: options.tenantId }),
      ...(options?.startDate && {
        createdAt: {
          gte: options.startDate,
          ...(options?.endDate && { lte: options.endDate })
        }
      })
    };

    // Get total statistics
    const [totalUsers, totalUsage] = await Promise.all([
      prisma.client.featureUsage.groupBy({
        by: ['userId'],
        where,
        _count: { userId: true }
      }).then(results => results.length),

      prisma.client.featureUsage.aggregate({
        where,
        _sum: { count: true }
      }).then(result => result._sum.count || 0)
    ]);

    // Get daily usage
    const dailyUsage = await prisma.client.$queryRaw<Array<{
      date: Date;
      count: bigint;
      users: bigint;
    }>>`
      SELECT
        DATE(created_at) as date,
        SUM(count) as count,
        COUNT(DISTINCT user_id) as users
      FROM feature_usage
      WHERE feature_id = ${feature.id}
        ${options?.tenantId ? prisma.client.$queryRaw`AND tenant_id = ${options.tenantId}` : prisma.client.$queryRaw``}
        ${options?.startDate ? prisma.client.$queryRaw`AND created_at >= ${options.startDate}` : prisma.client.$queryRaw``}
        ${options?.endDate ? prisma.client.$queryRaw`AND created_at <= ${options.endDate}` : prisma.client.$queryRaw``}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;

    return {
      totalUsers,
      totalUsage,
      dailyUsage: dailyUsage.map(row => ({
        date: row.date,
        count: Number(row.count),
        users: Number(row.users)
      }))
    };
  }

  /**
   * Hash user ID for consistent feature flag rollout
   */
  private hashUserId(userId: string, featureKey: string): number {
    const str = `${userId}:${featureKey}`;
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash) % 100;
  }

  /**
   * Compare plans
   */
  async comparePlans(planIds: string[]): Promise<{
    plans: Plan[];
    features: Array<{
      feature: Feature;
      availability: Record<string, boolean | number>;
    }>;
  }> {
    const plans = await prisma.client.plan.findMany({
      where: { id: { in: planIds } },
      include: {
        features: {
          include: { feature: true }
        }
      }
    });

    // Get all unique features
    const allFeatures = new Map<string, Feature>();
    const planFeatureMap = new Map<string, Map<string, any>>();

    plans.forEach(plan => {
      const featureMap = new Map<string, any>();

      plan.features.forEach(pf => {
        allFeatures.set(pf.feature.id, pf.feature);
        featureMap.set(pf.feature.id, {
          included: pf.included,
          limitValue: pf.limitValue
        });
      });

      planFeatureMap.set(plan.id, featureMap);
    });

    // Build comparison
    const features = Array.from(allFeatures.values()).map(feature => {
      const availability: Record<string, boolean | number> = {};

      plans.forEach(plan => {
        const planFeature = planFeatureMap.get(plan.id)?.get(feature.id);
        if (planFeature) {
          availability[plan.slug] = planFeature.limitValue || planFeature.included;
        } else {
          availability[plan.slug] = false;
        }
      });

      return { feature, availability };
    });

    return { plans, features };
  }
}
