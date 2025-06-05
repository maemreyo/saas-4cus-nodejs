import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';
import { Cacheable } from '@infrastructure/cache/redis.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  limits: PlanLimits;
  popular?: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
}

export interface PlanLimits {
  maxProjects?: number;
  maxUsers?: number;
  maxStorage?: number; // in MB
  maxApiCalls?: number;
  maxFileUploads?: number;
  [key: string]: number | undefined;
}

@Service()
export class SubscriptionService {
  private plans: Map<string, SubscriptionPlan> = new Map();

  constructor() {
    this.initializePlans();
  }

  private initializePlans() {
    const plans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for trying out our platform',
        stripePriceId: '',
        stripeProductId: '',
        price: 0,
        currency: 'usd',
        interval: 'month',
        features: [
          { id: 'basic_features', name: 'Basic Features', included: true },
          { id: 'community_support', name: 'Community Support', included: true },
          { id: 'api_access', name: 'API Access', included: false },
          { id: 'priority_support', name: 'Priority Support', included: false },
          { id: 'advanced_analytics', name: 'Advanced Analytics', included: false },
          { id: 'custom_domain', name: 'Custom Domain', included: false },
          { id: 'team_collaboration', name: 'Team Collaboration', included: false },
          { id: 'sso', name: 'SSO/SAML', included: false },
        ],
        limits: {
          maxProjects: 3,
          maxUsers: 1,
          maxStorage: 1024, // 1 GB
          maxApiCalls: 1000,
          maxFileUploads: 10,
        },
      },
      {
        id: 'starter',
        name: 'Starter',
        description: 'Great for small teams and projects',
        stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
        stripeProductId: process.env.STRIPE_STARTER_PRODUCT_ID || 'prod_starter',
        price: 19,
        currency: 'usd',
        interval: 'month',
        features: [
          { id: 'basic_features', name: 'Basic Features', included: true },
          { id: 'community_support', name: 'Community Support', included: true },
          { id: 'api_access', name: 'API Access', included: true },
          { id: 'priority_support', name: 'Priority Support', included: false },
          { id: 'advanced_analytics', name: 'Advanced Analytics', included: false },
          { id: 'custom_domain', name: 'Custom Domain', included: false },
          { id: 'team_collaboration', name: 'Team Collaboration', included: true },
          { id: 'sso', name: 'SSO/SAML', included: false },
        ],
        limits: {
          maxProjects: 10,
          maxUsers: 5,
          maxStorage: 10240, // 10 GB
          maxApiCalls: 10000,
          maxFileUploads: 100,
        },
      },
      {
        id: 'pro',
        name: 'Professional',
        description: 'For growing businesses',
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
        stripeProductId: process.env.STRIPE_PRO_PRODUCT_ID || 'prod_pro',
        price: 49,
        currency: 'usd',
        interval: 'month',
        popular: true,
        features: [
          { id: 'basic_features', name: 'Basic Features', included: true },
          { id: 'community_support', name: 'Community Support', included: true },
          { id: 'api_access', name: 'API Access', included: true },
          { id: 'priority_support', name: 'Priority Support', included: true },
          { id: 'advanced_analytics', name: 'Advanced Analytics', included: true },
          { id: 'custom_domain', name: 'Custom Domain', included: true },
          { id: 'team_collaboration', name: 'Team Collaboration', included: true },
          { id: 'sso', name: 'SSO/SAML', included: false },
        ],
        limits: {
          maxProjects: 50,
          maxUsers: 20,
          maxStorage: 102400, // 100 GB
          maxApiCalls: 100000,
          maxFileUploads: 1000,
        },
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations',
        stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
        stripeProductId: process.env.STRIPE_ENTERPRISE_PRODUCT_ID || 'prod_enterprise',
        price: 199,
        currency: 'usd',
        interval: 'month',
        features: [
          { id: 'basic_features', name: 'Basic Features', included: true },
          { id: 'community_support', name: 'Community Support', included: true },
          { id: 'api_access', name: 'API Access', included: true },
          { id: 'priority_support', name: 'Priority Support', included: true },
          { id: 'advanced_analytics', name: 'Advanced Analytics', included: true },
          { id: 'custom_domain', name: 'Custom Domain', included: true },
          { id: 'team_collaboration', name: 'Team Collaboration', included: true },
          { id: 'sso', name: 'SSO/SAML', included: true },
        ],
        limits: {
          maxProjects: -1, // Unlimited
          maxUsers: -1,
          maxStorage: -1,
          maxApiCalls: -1,
          maxFileUploads: -1,
        },
      },
    ];

    plans.forEach(plan => this.plans.set(plan.id, plan));
  }

  /**
   * Get all available plans
   */
  getPlans(): SubscriptionPlan[] {
    return Array.from(this.plans.values());
  }

  /**
   * Get plan by ID
   */
  getPlan(planId: string): SubscriptionPlan | undefined {
    return this.plans.get(planId);
  }

  /**
   * Get plan by Stripe price ID
   */
  getPlanByPriceId(stripePriceId: string): SubscriptionPlan | undefined {
    return Array.from(this.plans.values()).find(plan => plan.stripePriceId === stripePriceId);
  }

  /**
   * Get user's current subscription with caching
   */
  @Cacheable({ ttl: 300, namespace: 'subscription' })
  async getUserSubscription(userId: string) {
    const subscription = await prisma.client.subscription.findFirst({
      where: {
        userId,
        status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return {
        plan: this.getPlan('free'),
        subscription: null,
        isActive: true,
        isTrial: false,
      };
    }

    const plan = this.getPlanByPriceId(subscription.stripePriceId);

    return {
      plan: plan || this.getPlan('free'),
      subscription,
      isActive: subscription.status === 'ACTIVE' || subscription.status === 'TRIALING',
      isTrial: subscription.status === 'TRIALING',
      willCancelAt: subscription.cancelAtPeriodEnd ? subscription.currentPeriodEnd : null,
    };
  }

  /**
   * Check if user has access to a feature
   */
  async hasFeature(userId: string, featureId: string): Promise<boolean> {
    const { plan } = await this.getUserSubscription(userId);
    if (!plan) return false;

    const feature = plan.features.find(f => f.id === featureId);
    return feature?.included || false;
  }

  /**
   * Check if user has access to multiple features
   */
  async hasAllFeatures(userId: string, featureIds: string[]): Promise<boolean> {
    const { plan } = await this.getUserSubscription(userId);
    if (!plan) return false;

    return featureIds.every(featureId => {
      const feature = plan.features.find(f => f.id === featureId);
      return feature?.included || false;
    });
  }

  /**
   * Check usage limit for a resource
   */
  async checkUsageLimit(
    userId: string,
    resource: keyof PlanLimits,
    currentUsage?: number,
  ): Promise<{
    allowed: boolean;
    limit: number;
    used: number;
    remaining: number;
    unlimited: boolean;
  }> {
    const { plan } = await this.getUserSubscription(userId);
    if (!plan) {
      return {
        allowed: false,
        limit: 0,
        used: 0,
        remaining: 0,
        unlimited: false,
      };
    }

    const limit = plan.limits[resource] || 0;
    const unlimited = limit === -1;

    // Get current usage if not provided
    let used = currentUsage || 0;
    if (used === undefined) {
      used = await this.getCurrentUsage(userId, resource);
    }

    const remaining = unlimited ? Infinity : Math.max(0, limit - used);
    const allowed = unlimited || used < limit;

    return {
      allowed,
      limit: unlimited ? Infinity : limit,
      used,
      remaining,
      unlimited,
    };
  }

  /**
   * Get current usage for a resource
   */
  private async getCurrentUsage(userId: string, resource: keyof PlanLimits): Promise<number> {
    switch (resource) {
      case 'maxProjects':
        return await prisma.client.project.count({ where: { userId } });

      case 'maxUsers':
        // For team/organization features
        return 1; // Placeholder

      case 'maxStorage':
        const files = await prisma.client.file.aggregate({
          where: { userId },
          _sum: { size: true },
        });
        return Math.ceil((files._sum.size || 0) / (1024 * 1024)); // Convert to MB

      case 'maxApiCalls':
        // Get API calls for current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        return await prisma.client.apiUsage.count({
          where: {
            userId,
            createdAt: { gte: startOfMonth },
          },
        });

      case 'maxFileUploads':
        return await prisma.client.file.count({ where: { userId } });

      default:
        return 0;
    }
  }

  /**
   * Enforce usage limit - throws exception if limit exceeded
   */
  async enforceUsageLimit(userId: string, resource: keyof PlanLimits): Promise<void> {
    const usage = await this.checkUsageLimit(userId, resource);

    if (!usage.allowed) {
      throw new ForbiddenException(
        `You have reached the ${resource} limit (${usage.limit}) for your current plan. Please upgrade to continue.`,
        {
          resource,
          limit: usage.limit,
          used: usage.used,
          upgrade_url: '/billing/upgrade',
        },
      );
    }
  }

  /**
   * Get subscription statistics
   */
  async getSubscriptionStats(userId: string) {
    const { plan, subscription } = await this.getUserSubscription(userId);

    if (!plan) {
      return null;
    }

    // Get usage for all resources
    const usageStats: Record<string, any> = {};

    for (const resource of Object.keys(plan.limits)) {
      usageStats[resource] = await this.checkUsageLimit(userId, resource as keyof PlanLimits);
    }

    // Get billing history
    const invoices = await prisma.client.invoice.findMany({
      where: {
        subscriptionId: subscription?.id,
        status: 'PAID',
      },
      orderBy: { createdAt: 'desc' },
      take: 12, // Last 12 invoices
    });

    const totalSpent = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

    return {
      plan,
      subscription,
      usage: usageStats,
      billing: {
        totalSpent: totalSpent / 100, // Convert from cents
        invoiceCount: invoices.length,
        lastPayment: invoices[0]?.paidAt || null,
        nextPayment: subscription?.currentPeriodEnd || null,
      },
    };
  }

  /**
   * Calculate proration for plan change
   */
  async calculateProration(
    userId: string,
    newPlanId: string,
  ): Promise<{
    amount: number;
    credits: number;
    description: string;
  }> {
    const { plan: currentPlan, subscription } = await this.getUserSubscription(userId);
    const newPlan = this.getPlan(newPlanId);

    if (!currentPlan || !newPlan || !subscription) {
      return {
        amount: newPlan?.price || 0,
        credits: 0,
        description: 'New subscription',
      };
    }

    // Calculate remaining days in current period
    const now = new Date();
    const periodEnd = subscription.currentPeriodEnd;
    const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysInPeriod = 30; // Assuming monthly

    // Calculate prorated amounts
    const currentPlanDailyRate = currentPlan.price / daysInPeriod;
    const newPlanDailyRate = newPlan.price / daysInPeriod;

    const credits = currentPlanDailyRate * daysRemaining;
    const charges = newPlanDailyRate * daysRemaining;
    const amount = Math.max(0, charges - credits);

    return {
      amount: Math.round(amount * 100) / 100,
      credits: Math.round(credits * 100) / 100,
      description: `Upgrade from ${currentPlan.name} to ${newPlan.name} (${daysRemaining} days remaining)`,
    };
  }
}
