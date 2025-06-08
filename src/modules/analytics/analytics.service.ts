import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { Cacheable } from '@infrastructure/cache/redis.service';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { InvoiceStatus, SubscriptionStatus, Prisma } from '@prisma/client';

export interface AnalyticsEvent {
  userId?: string;
  tenantId?: string;
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  sessionId?: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

export interface MetricData {
  value: number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface TimeSeriesData {
  date: Date;
  value: number;
  [key: string]: any;
}

export interface DashboardMetrics {
  overview: {
    totalUsers: MetricData;
    activeUsers: MetricData;
    revenue: MetricData;
    churnRate: MetricData;
  };
  timeSeries: {
    userGrowth: TimeSeriesData[];
    revenueGrowth: TimeSeriesData[];
    activeUsers: TimeSeriesData[];
  };
  breakdown: {
    usersByPlan: Array<{ plan: string; count: number; percentage: number }>;
    revenueByPlan: Array<{ plan: string; revenue: number; percentage: number }>;
    topFeatures: Array<{ feature: string; usage: number }>;
  };
}

@Service()
export class AnalyticsService {
  private readonly METRICS_CACHE_TTL = 300; // 5 minutes

  constructor(private eventBus: EventBus) {}

  /**
   * Track analytics event
   */
  async track(event: AnalyticsEvent): Promise<void> {
    try {
      // Store in database
      await prisma.client.analyticsEvent.create({
        data: {
          userId: event.userId,
          tenantId: event.tenantId,
          event: event.event,
          properties: event.properties || {},
          sessionId: event.sessionId,
          deviceId: event.deviceId,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          referrer: event.referrer,
          utmSource: event.utm?.source,
          utmMedium: event.utm?.medium,
          utmCampaign: event.utm?.campaign,
          utmTerm: event.utm?.term,
          utmContent: event.utm?.content,
          timestamp: event.timestamp || new Date(),
        },
      });

      // Store in Redis for real-time analytics
      await this.trackRealTimeMetric(event);

      // Emit event for external analytics services
      await this.eventBus.emit('analytics.event.tracked', event);
    } catch (error) {
      logger.error('Failed to track analytics event', error as Error, { event });
    }
  }

  /**
   * Track page view
   */
  async trackPageView(userId: string | undefined, page: string, properties?: Record<string, any>): Promise<void> {
    await this.track({
      userId,
      event: 'page_view',
      properties: {
        page,
        ...properties,
      },
    });
  }

  /**
   * Track real-time metric in Redis
   */
  private async trackRealTimeMetric(event: AnalyticsEvent): Promise<void> {
    const now = new Date();
    const hourKey = format(now, 'yyyy-MM-dd:HH');
    const dayKey = format(now, 'yyyy-MM-dd');

    // Increment counters
    const pipeline = redis.pipeline();

    // Hourly metrics
    pipeline.hincrby(`analytics:hourly:${hourKey}`, event.event, 1);
    pipeline.expire(`analytics:hourly:${hourKey}`, 86400); // 24 hours

    // Daily metrics
    pipeline.hincrby(`analytics:daily:${dayKey}`, event.event, 1);
    pipeline.expire(`analytics:daily:${dayKey}`, 604800); // 7 days

    // User activity
    if (event.userId) {
      pipeline.pfadd(`analytics:users:active:${dayKey}`, event.userId);
      pipeline.expire(`analytics:users:active:${dayKey}`, 604800);
    }

    await pipeline.exec();
  }

  /**
   * Get dashboard metrics
   */
  @Cacheable({ ttl: 300, namespace: 'analytics:dashboard' })
  async getDashboardMetrics(tenantId?: string, dateRange: number = 30): Promise<DashboardMetrics> {
    const endDate = new Date();
    const startDate = subDays(endDate, dateRange);

    const [overview, timeSeries, breakdown] = await Promise.all([
      this.getOverviewMetrics(tenantId, startDate, endDate),
      this.getTimeSeriesMetrics(tenantId, startDate, endDate),
      this.getBreakdownMetrics(tenantId),
    ]);

    return {
      overview,
      timeSeries,
      breakdown,
    };
  }

  /**
   * Get overview metrics
   */
  private async getOverviewMetrics(
    tenantId: string | undefined,
    startDate: Date,
    endDate: Date,
  ): Promise<DashboardMetrics['overview']> {
    const where = tenantId ? { tenantId } : {};
    const previousStartDate = subDays(startDate, 30);

    // Current period metrics
    const [totalUsers, activeUsers, revenue, churned] = await Promise.all([
      prisma.client.user.count({ where: { ...where, createdAt: { lte: endDate } } }),
      this.getActiveUsersCount(tenantId, startDate, endDate),
      this.getRevenue(tenantId, startDate, endDate),
      this.getChurnedUsers(tenantId, startDate, endDate),
    ]);

    // Previous period metrics for comparison
    const [prevTotalUsers, prevActiveUsers, prevRevenue, prevChurned] = await Promise.all([
      prisma.client.user.count({ where: { ...where, createdAt: { lte: startDate } } }),
      this.getActiveUsersCount(tenantId, previousStartDate, startDate),
      this.getRevenue(tenantId, previousStartDate, startDate),
      this.getChurnedUsers(tenantId, previousStartDate, startDate),
    ]);

    const churnRate = totalUsers > 0 ? (churned / totalUsers) * 100 : 0;
    const prevChurnRate = prevTotalUsers > 0 ? (prevChurned / prevTotalUsers) * 100 : 0;

    return {
      totalUsers: this.calculateMetricData(totalUsers, prevTotalUsers),
      activeUsers: this.calculateMetricData(activeUsers, prevActiveUsers),
      revenue: this.calculateMetricData(revenue, prevRevenue),
      churnRate: this.calculateMetricData(churnRate, prevChurnRate),
    };
  }

  /**
   * Get time series metrics
   */
  private async getTimeSeriesMetrics(
    tenantId: string | undefined,
    startDate: Date,
    endDate: Date,
  ): Promise<DashboardMetrics['timeSeries']> {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dates: Date[] = [];

    for (let i = 0; i < days; i++) {
      dates.push(subDays(endDate, days - i - 1));
    }

    const [userGrowth, revenueGrowth, activeUsers] = await Promise.all([
      this.getUserGrowthTimeSeries(tenantId, dates),
      this.getRevenueTimeSeries(tenantId, dates),
      this.getActiveUsersTimeSeries(tenantId, dates),
    ]);

    return {
      userGrowth,
      revenueGrowth,
      activeUsers,
    };
  }

  /**
   * Get breakdown metrics
   */
  private async getBreakdownMetrics(tenantId?: string): Promise<DashboardMetrics['breakdown']> {
    const [usersByPlan, revenueByPlan, topFeatures] = await Promise.all([
      this.getUsersByPlan(tenantId),
      this.getRevenueByPlan(tenantId),
      this.getTopFeatures(tenantId),
    ]);

    return {
      usersByPlan,
      revenueByPlan,
      topFeatures,
    };
  }

  /**
   * Calculate metric data with change
   */
  private calculateMetricData(current: number, previous: number): MetricData {
    const change = current - previous;
    const changePercent = previous > 0 ? (change / previous) * 100 : 0;

    return {
      value: current,
      change,
      changePercent: Math.round(changePercent * 100) / 100,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
  }

  /**
   * Get active users count
   */
  private async getActiveUsersCount(tenantId: string | undefined, startDate: Date, endDate: Date): Promise<number> {
    // Create a properly typed where condition
    const whereCondition: Prisma.AnalyticsEventWhereInput = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
      userId: { not: null },
    };

    // Add tenant filter if tenantId is provided
    if (tenantId) {
      whereCondition.tenantId = tenantId;
    }

    const activeUsers = await prisma.client.analyticsEvent.groupBy({
      by: ['userId'],
      where: whereCondition,
      _count: { userId: true },
    });

    return activeUsers.length;
  }

  /**
   * Get revenue
   */
  private async getRevenue(tenantId: string | undefined, startDate: Date, endDate: Date): Promise<number> {
    // Create a properly typed where condition
    const whereCondition: Prisma.InvoiceWhereInput = {
      status: InvoiceStatus.PAID,
      paidAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Add tenant filter if tenantId is provided
    if (tenantId) {
      whereCondition.subscription = { tenantId };
    }

    const revenue = await prisma.client.invoice.aggregate({
      where: whereCondition,
      _sum: { amount: true },
    });

    return (revenue._sum.amount || 0) / 100; // Convert from cents
  }

  /**
   * Get churned users
   */
  private async getChurnedUsers(tenantId: string | undefined, startDate: Date, endDate: Date): Promise<number> {
    // Create a properly typed where condition
    const whereCondition: Prisma.SubscriptionWhereInput = {
      status: SubscriptionStatus.CANCELED,
      canceledAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Add tenant user filter if tenantId is provided
    if (tenantId) {
      const tenantUserIds = await this.getTenantUserIds(tenantId);
      whereCondition.userId = { in: tenantUserIds };
    }

    return await prisma.client.subscription.count({ where: whereCondition });
  }

  /**
   * Get tenant user IDs
   */
  private async getTenantUserIds(tenantId: string): Promise<string[]> {
    const members = await prisma.client.tenantMember.findMany({
      where: { tenantId },
      select: { userId: true },
    });

    return members.map(m => m.userId);
  }

  /**
   * Get user growth time series
   */
  private async getUserGrowthTimeSeries(tenantId: string | undefined, dates: Date[]): Promise<TimeSeriesData[]> {
    const results: TimeSeriesData[] = [];

    for (const date of dates) {
      // Create a properly typed where condition
      const whereCondition: Prisma.UserWhereInput = {
        createdAt: { lte: endOfDay(date) },
      };

      // Add tenant filter if tenantId is provided
      if (tenantId) {
        whereCondition.tenantMembers = { some: { tenantId } };
      }

      const count = await prisma.client.user.count({
        where: whereCondition,
      });

      results.push({ date, value: count });
    }

    return results;
  }

  /**
   * Get revenue time series
   */
  private async getRevenueTimeSeries(tenantId: string | undefined, dates: Date[]): Promise<TimeSeriesData[]> {
    const results: TimeSeriesData[] = [];

    for (const date of dates) {
      // Create a properly typed where condition
      const whereCondition: Prisma.InvoiceWhereInput = {
        status: InvoiceStatus.PAID,
        paidAt: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      };

      // Add tenant filter if tenantId is provided
      if (tenantId) {
        whereCondition.subscription = { tenantId };
      }

      const revenue = await prisma.client.invoice.aggregate({
        where: whereCondition,
        _sum: { amount: true },
      });

      results.push({
        date,
        value: (revenue._sum.amount || 0) / 100,
      });
    }

    return results;
  }

  /**
   * Get active users time series
   */
  private async getActiveUsersTimeSeries(tenantId: string | undefined, dates: Date[]): Promise<TimeSeriesData[]> {
    const results: TimeSeriesData[] = [];

    for (const date of dates) {
      const dayKey = format(date, 'yyyy-MM-dd');

      // Try to get from Redis first
      const cachedCount = await redis.pfcount(`analytics:users:active:${dayKey}`);

      if (cachedCount > 0) {
        results.push({ date, value: cachedCount });
      } else {
        // Fallback to database
        const count = await this.getActiveUsersCount(tenantId, startOfDay(date), endOfDay(date));
        results.push({ date, value: count });
      }
    }

    return results;
  }

  /**
   * Get users by plan
   */
  private async getUsersByPlan(tenantId?: string): Promise<Array<{ plan: string; count: number; percentage: number }>> {
    // Create the where condition separately to avoid circular reference
    const whereCondition: Prisma.SubscriptionWhereInput = {
      status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
    };

    // Add tenantId condition if provided
    if (tenantId) {
      whereCondition.tenantId = tenantId;
    }

    const subscriptions = await prisma.client.subscription.groupBy({
      by: ['stripePriceId'],
      where: whereCondition,
      _count: { userId: true },
    });

    // Get plan names
    const plans = await prisma.client.plan.findMany({
      where: {
        stripePriceId: { in: subscriptions.map(s => s.stripePriceId) },
      },
    });

    const planMap = new Map(plans.map(p => [p.stripePriceId, p.name]));
    const total = subscriptions.reduce((sum, s) => sum + s._count.userId, 0);

    // Add free users
    const freeUsers = await prisma.client.user.count({
      where: {
        ...(tenantId && { tenantMembers: { some: { tenantId } } }),
        subscriptions: { none: {} },
      },
    });

    const results = [
      {
        plan: 'Free',
        count: freeUsers,
        percentage: total + freeUsers > 0 ? (freeUsers / (total + freeUsers)) * 100 : 0,
      },
    ];

    subscriptions.forEach(sub => {
      const planName = planMap.get(sub.stripePriceId) || 'Unknown';
      results.push({
        plan: planName,
        count: sub._count.userId,
        percentage: total + freeUsers > 0 ? (sub._count.userId / (total + freeUsers)) * 100 : 0,
      });
    });

    return results;
  }

  /**
   * Get revenue by plan
   */
  private async getRevenueByPlan(
    tenantId?: string,
  ): Promise<Array<{ plan: string; revenue: number; percentage: number }>> {
    const last30Days = subDays(new Date(), 30);

    // First, get all invoices with their subscription's stripe price IDs
    const invoices = await prisma.client.invoice.findMany({
      where: {
        status: InvoiceStatus.PAID,
        paidAt: { gte: last30Days },
        ...(tenantId && { subscription: { tenantId } }),
      },
      include: {
        subscription: {
          select: {
            stripePriceId: true,
          },
        },
      },
    });

    // Group revenues by stripePriceId manually
    const revenueByPrice = new Map<string, number>();
    invoices.forEach(invoice => {
      const stripePriceId = invoice.subscription.stripePriceId;
      const current = revenueByPrice.get(stripePriceId) || 0;
      revenueByPrice.set(stripePriceId, current + invoice.amount);
    });

    // Get plan names
    const plans = await prisma.client.plan.findMany();
    const planMap = new Map(plans.map(p => [p.stripePriceId, p.name]));

    const total = Array.from(revenueByPrice.values()).reduce((sum, amount) => sum + amount, 0);

    return Array.from(revenueByPrice.entries()).map(([stripePriceId, amount]) => ({
      plan: planMap.get(stripePriceId) || 'Unknown',
      revenue: amount / 100,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));
  }

  /**
   * Get top features
   */
  private async getTopFeatures(
    tenantId?: string,
    limit: number = 10,
  ): Promise<Array<{ feature: string; usage: number }>> {
    const last30Days = subDays(new Date(), 30);

    // Create a properly typed where condition to avoid circular references
    const whereCondition: Prisma.FeatureUsageWhereInput = {
      createdAt: { gte: last30Days },
    };

    // Add tenant filter if tenantId is provided
    if (tenantId) {
      whereCondition.tenantId = tenantId;
    }

    const usage = await prisma.client.featureUsage.groupBy({
      by: ['featureId'],
      where: whereCondition,
      _sum: { count: true },
      orderBy: {
        _sum: { count: 'desc' },
      },
      take: limit,
    });

    // Get feature names
    const features = await prisma.client.feature.findMany({
      where: {
        id: { in: usage.map(u => u.featureId) },
      },
    });

    const featureMap = new Map(features.map(f => [f.id, f.name]));

    return usage.map(u => ({
      feature: featureMap.get(u.featureId) || 'Unknown',
      usage: u._sum.count || 0,
    }));
  }

  /**
   * Get funnel analytics
   */
  async getFunnelAnalytics(
    steps: string[],
    options: {
      tenantId?: string;
      startDate?: Date;
      endDate?: Date;
      groupBy?: string;
    } = {},
  ): Promise<{
    steps: Array<{
      name: string;
      users: number;
      conversionRate: number;
      dropoffRate: number;
    }>;
    overall: {
      totalUsers: number;
      completedUsers: number;
      conversionRate: number;
    };
  }> {
    const { tenantId, startDate, endDate } = options;
    const results: any[] = [];
    let previousStepUsers = 0;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Create a properly typed where condition to avoid circular references
      const whereCondition: Prisma.AnalyticsEventWhereInput = {
        event: step,
        userId: { not: null },
      };

      // Add tenant filter if tenantId is provided
      if (tenantId) {
        whereCondition.tenantId = tenantId;
      }

      // Add date range if provided
      if (startDate && endDate) {
        whereCondition.timestamp = { gte: startDate, lte: endDate };
      }

      const users = await prisma.client.analyticsEvent.groupBy({
        by: ['userId'],
        where: whereCondition,
        _count: { userId: true },
      });

      const userCount = users.length;
      const conversionRate = i === 0 ? 100 : previousStepUsers > 0 ? (userCount / previousStepUsers) * 100 : 0;
      const dropoffRate = i === 0 ? 0 : 100 - conversionRate;

      results.push({
        name: step,
        users: userCount,
        conversionRate: Math.round(conversionRate * 100) / 100,
        dropoffRate: Math.round(dropoffRate * 100) / 100,
      });

      previousStepUsers = userCount;
    }

    const totalUsers = results[0]?.users || 0;
    const completedUsers = results[results.length - 1]?.users || 0;
    const overallConversionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;

    return {
      steps: results,
      overall: {
        totalUsers,
        completedUsers,
        conversionRate: Math.round(overallConversionRate * 100) / 100,
      },
    };
  }

  /**
   * Get cohort retention
   */
  async getCohortRetention(
    options: {
      tenantId?: string;
      cohortSize?: 'day' | 'week' | 'month';
      periods?: number;
    } = {},
  ): Promise<{
    cohorts: Array<{
      date: Date;
      size: number;
      retention: number[];
    }>;
  }> {
    const { tenantId, cohortSize = 'week', periods = 8 } = options;
    const cohorts: any[] = [];

    // Get cohort dates
    const now = new Date();
    const cohortDates: Date[] = [];

    for (let i = 0; i < periods; i++) {
      const date =
        cohortSize === 'day' ? subDays(now, i) : cohortSize === 'week' ? subDays(now, i * 7) : subDays(now, i * 30);
      cohortDates.unshift(date);
    }

    for (const cohortDate of cohortDates) {
      // Get users who joined in this cohort
      const cohortStart = startOfDay(cohortDate);
      const cohortEnd =
        cohortSize === 'day'
          ? endOfDay(cohortDate)
          : cohortSize === 'week'
            ? endOfDay(subDays(cohortDate, -6))
            : endOfDay(subDays(cohortDate, -29));

      const cohortUsers = await prisma.client.user.findMany({
        where: {
          ...(tenantId && { tenantMembers: { some: { tenantId } } }),
          createdAt: {
            gte: cohortStart,
            lte: cohortEnd,
          },
        },
        select: { id: true },
      });

      const cohortUserIds = cohortUsers.map(u => u.id);
      const cohortSizeCount = cohortUserIds.length;

      if (cohortSizeCount === 0) continue;

      // Calculate retention for each period
      const retention: number[] = [100]; // First period is always 100%

      for (let period = 1; period < periods; period++) {
        const periodStart =
          cohortSize === 'day'
            ? subDays(cohortStart, -period)
            : cohortSize === 'week'
              ? subDays(cohortStart, -(period * 7))
              : subDays(cohortStart, -(period * 30));

        const periodEnd =
          cohortSize === 'day'
            ? endOfDay(periodStart)
            : cohortSize === 'week'
              ? endOfDay(subDays(periodStart, -6))
              : endOfDay(subDays(periodStart, -29));

        // Check if period is in the future
        if (periodStart > now) {
          retention.push(null as any);
          continue;
        }

        // Create a properly typed where condition to avoid circular references
        const whereCondition: Prisma.AnalyticsEventWhereInput = {
          userId: { in: cohortUserIds },
          timestamp: {
            gte: periodStart,
            lte: periodEnd,
          },
        };

        const activeUsers = await prisma.client.analyticsEvent.groupBy({
          by: ['userId'],
          where: whereCondition,
          _count: { userId: true },
        });

        const retentionRate = (activeUsers.length / cohortSizeCount) * 100;
        retention.push(Math.round(retentionRate * 100) / 100);
      }

      cohorts.push({
        date: cohortDate,
        size: cohortSizeCount,
        retention,
      });
    }

    return { cohorts };
  }

  /**
   * Get user journey
   */
  async getUserJourney(
    userId: string,
    options: {
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    } = {},
  ): Promise<{
    events: Array<{
      timestamp: Date;
      event: string;
      properties: any;
      sessionId?: string;
    }>;
    summary: {
      totalEvents: number;
      uniqueEvents: number;
      sessions: number;
      avgEventsPerSession: number;
    };
  }> {
    const { limit = 100, startDate, endDate } = options;

    const events = await prisma.client.analyticsEvent.findMany({
      where: {
        userId,
        ...(startDate &&
          endDate && {
            timestamp: { gte: startDate, lte: endDate },
          }),
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: {
        timestamp: true,
        event: true,
        properties: true,
        sessionId: true,
      },
    });

    const uniqueEvents = new Set(events.map(e => e.event)).size;
    const sessions = new Set(events.filter(e => e.sessionId).map(e => e.sessionId)).size;

    return {
      events,
      summary: {
        totalEvents: events.length,
        uniqueEvents,
        sessions,
        avgEventsPerSession: sessions > 0 ? events.length / sessions : 0,
      },
    };
  }
}
