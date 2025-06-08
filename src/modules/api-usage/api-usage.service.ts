import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { SubscriptionService } from '@modules/billing/subscription.service';
import { Cacheable } from '@infrastructure/cache/redis.service';
import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, format } from 'date-fns';
import { ForbiddenException } from '@shared/exceptions';

export interface ApiUsageMetrics {
  endpoint: string;
  method: string;
  count: number;
  averageResponseTime: number;
  errorRate: number;
  successRate: number;
}

export interface ApiUsageStats {
  totalRequests: number;
  uniqueEndpoints: number;
  averageResponseTime: number;
  errorRate: number;
  requestsPerMinute: number;
  topEndpoints: ApiUsageMetrics[];
  statusCodeDistribution: Record<string, number>;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

export interface UsageQuota {
  resource: string;
  limit: number;
  used: number;
  remaining: number;
  percentage: number;
  resetAt: Date;
}

@Service()
export class ApiUsageService {
  private readonly METRICS_WINDOW = 60; // 60 seconds for rate limiting
  private readonly USAGE_CACHE_TTL = 300; // 5 minutes

  constructor(
    private eventBus: EventBus,
    private subscriptionService: SubscriptionService,
  ) {}

  /**
   * Track API usage
   */
  async trackUsage(
    userId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    options?: {
      tenantId?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, any>;
    },
  ): Promise<void> {
    try {
      // Store in database
      await prisma.client.apiUsage.create({
        data: {
          userId,
          tenantId: options?.tenantId,
          endpoint,
          method,
          statusCode,
          responseTime,
          ipAddress: options?.ipAddress,
          userAgent: options?.userAgent,
          metadata: options?.metadata || {},
        },
      });

      // Track in Redis for real-time metrics
      await this.trackRealTimeMetrics(userId, endpoint, method, statusCode, responseTime);

      // Check quota limits
      await this.checkAndUpdateQuota(userId, endpoint);

      // Emit event for analytics
      await this.eventBus.emit('api.usage.tracked', {
        userId,
        endpoint,
        method,
        statusCode,
        responseTime,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to track API usage', error as Error);
    }
  }

  /**
   * Track real-time metrics in Redis
   */
  private async trackRealTimeMetrics(
    userId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
  ): Promise<void> {
    const now = new Date();
    const minuteKey = format(now, 'yyyy-MM-dd:HH:mm');
    const hourKey = format(now, 'yyyy-MM-dd:HH');
    const dayKey = format(now, 'yyyy-MM-dd');

    const pipeline = redis.pipeline();

    // Per-minute metrics
    pipeline.hincrby(`api:metrics:minute:${minuteKey}`, 'total', 1);
    pipeline.hincrby(`api:metrics:minute:${minuteKey}`, `${endpoint}:${method}`, 1);
    pipeline.hincrby(`api:metrics:minute:${minuteKey}`, `status:${statusCode}`, 1);
    pipeline.expire(`api:metrics:minute:${minuteKey}`, 3600); // 1 hour

    // Per-hour metrics
    pipeline.hincrby(`api:metrics:hour:${hourKey}`, 'total', 1);
    pipeline.hincrby(`api:metrics:hour:${hourKey}`, `${endpoint}:${method}`, 1);
    pipeline.expire(`api:metrics:hour:${hourKey}`, 86400); // 24 hours

    // User daily usage
    pipeline.hincrby(`api:user:daily:${userId}:${dayKey}`, 'total', 1);
    pipeline.hincrby(`api:user:daily:${userId}:${dayKey}`, endpoint, 1);
    pipeline.expire(`api:user:daily:${userId}:${dayKey}`, 604800); // 7 days

    // Response time tracking (using sorted sets)
    pipeline.zadd(`api:response:${dayKey}`, responseTime, `${endpoint}:${method}:${Date.now()}`);
    pipeline.expire(`api:response:${dayKey}`, 86400);

    await pipeline.exec();
  }

  /**
   * Get API usage statistics
   */
  @Cacheable({ ttl: 300, namespace: 'api:stats' })
  async getUsageStats(
    userId?: string,
    tenantId?: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      groupBy?: 'hour' | 'day' | 'month';
    },
  ): Promise<ApiUsageStats> {
    const where = {
      ...(userId && { userId }),
      ...(tenantId && { tenantId }),
      ...(options?.startDate &&
        options?.endDate && {
          createdAt: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
    };

    const [totalRequests, uniqueEndpoints, avgResponseTime, statusCodes, topEndpoints] = await Promise.all([
      prisma.client.apiUsage.count({ where }),

      prisma.client.apiUsage
        .groupBy({
          by: ['endpoint'],
          where,
          _count: { endpoint: true },
        })
        .then(results => results.length),

      prisma.client.apiUsage
        .aggregate({
          where,
          _avg: { responseTime: true },
        })
        .then(result => result._avg.responseTime || 0),

      prisma.client.apiUsage.groupBy({
        by: ['statusCode'],
        where,
        _count: { statusCode: true },
      }),

      this.getTopEndpoints(where),
    ]);

    // Calculate error rate
    const errorCount = statusCodes.filter(s => s.statusCode >= 400).reduce((sum, s) => sum + s._count.statusCode, 0);
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;

    // Calculate requests per minute
    const timeRange =
      options?.startDate && options?.endDate
        ? (options.endDate.getTime() - options.startDate.getTime()) / 1000 / 60
        : 1440; // Default to 24 hours
    const requestsPerMinute = totalRequests / timeRange;

    // Build status code distribution
    const statusCodeDistribution: Record<string, number> = {};
    statusCodes.forEach(s => {
      statusCodeDistribution[s.statusCode.toString()] = s._count.statusCode;
    });

    return {
      totalRequests,
      uniqueEndpoints,
      averageResponseTime: Math.round(avgResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      requestsPerMinute: Math.round(requestsPerMinute * 100) / 100,
      topEndpoints,
      statusCodeDistribution,
    };
  }

  /**
   * Get top endpoints by usage
   */
  private async getTopEndpoints(where: any, limit: number = 10): Promise<ApiUsageMetrics[]> {
    const endpoints = await prisma.client.apiUsage.groupBy({
      by: ['endpoint', 'method'],
      where,
      _count: { endpoint: true },
      _avg: { responseTime: true },
      orderBy: {
        _count: { endpoint: 'desc' },
      },
      take: limit,
    });

    const metrics: ApiUsageMetrics[] = [];

    for (const endpoint of endpoints) {
      // Get success/error rates
      const statusCodes = await prisma.client.apiUsage.groupBy({
        by: ['statusCode'],
        where: {
          ...where,
          endpoint: endpoint.endpoint,
          method: endpoint.method,
        },
        _count: { statusCode: true },
      });

      const total = statusCodes.reduce((sum, s) => sum + s._count.statusCode, 0);
      const errors = statusCodes.filter(s => s.statusCode >= 400).reduce((sum, s) => sum + s._count.statusCode, 0);

      metrics.push({
        endpoint: endpoint.endpoint,
        method: endpoint.method,
        count: endpoint._count.endpoint,
        averageResponseTime: Math.round(endpoint._avg.responseTime || 0),
        errorRate: total > 0 ? (errors / total) * 100 : 0,
        successRate: total > 0 ? ((total - errors) / total) * 100 : 0,
      });
    }

    return metrics;
  }

  /**
   * Get usage time series
   */
  async getUsageTimeSeries(
    options: {
      startDate: Date;
      endDate: Date;
      groupBy: 'hour' | 'day' | 'month';
      endpoint?: string;
    },
    userId?: string,
    tenantId?: string,
  ): Promise<Array<{ timestamp: Date; requests: number; errors: number; avgResponseTime: number }>> {
    const where = {
      ...(userId && { userId }),
      ...(tenantId && { tenantId }),
      ...(options.endpoint && { endpoint: options.endpoint }),
      createdAt: {
        gte: options.startDate,
        lte: options.endDate,
      },
    };

    let dateFormat: string;
    switch (options.groupBy) {
      case 'hour':
        dateFormat = 'yyyy-MM-dd HH:00:00';
        break;
      case 'month':
        dateFormat = 'yyyy-MM-01';
        break;
      default:
        dateFormat = 'yyyy-MM-dd';
    }

    const results = await prisma.client.$queryRaw<
      Array<{
        timestamp: Date;
        requests: bigint;
        errors: bigint;
        avg_response_time: number;
      }>
    >`
      SELECT
        DATE_TRUNC(${options.groupBy}, created_at) as timestamp,
        COUNT(*) as requests,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as errors,
        AVG(response_time) as avg_response_time
      FROM api_usage
      WHERE created_at >= ${options.startDate}
        AND created_at <= ${options.endDate}
        ${userId ? prisma.client.$queryRaw`AND user_id = ${userId}` : prisma.client.$queryRaw``}
        ${tenantId ? prisma.client.$queryRaw`AND tenant_id = ${tenantId}` : prisma.client.$queryRaw``}
        ${options.endpoint ? prisma.client.$queryRaw`AND endpoint = ${options.endpoint}` : prisma.client.$queryRaw``}
      GROUP BY DATE_TRUNC(${options.groupBy}, created_at)
      ORDER BY timestamp DESC
    `;

    return results.map(row => ({
      timestamp: row.timestamp,
      requests: Number(row.requests),
      errors: Number(row.errors),
      avgResponseTime: Math.round(row.avg_response_time || 0),
    }));
  }

  /**
   * Check rate limit for user
   */
  async checkRateLimit(userId: string, endpoint: string, limit?: number): Promise<RateLimitInfo> {
    const { plan } = await this.subscriptionService.getUserSubscription(userId);
    const maxRequests = limit || plan?.limits.maxApiCalls || 1000;

    const now = new Date();
    const windowStart = new Date(now.getTime() - this.METRICS_WINDOW * 1000);
    const windowKey = `ratelimit:${userId}:${endpoint}:${Math.floor(now.getTime() / 1000 / this.METRICS_WINDOW)}`;

    // Get current usage in window
    const currentUsage = (await redis.get(windowKey)) || 0;

    if (currentUsage >= maxRequests) {
      const reset = new Date((Math.floor(now.getTime() / 1000 / this.METRICS_WINDOW) + 1) * this.METRICS_WINDOW * 1000);
      const retryAfter = Math.ceil((reset.getTime() - now.getTime()) / 1000);

      throw new ForbiddenException('Rate limit exceeded', {
        limit: maxRequests,
        remaining: 0,
        reset: reset.toISOString(),
        retryAfter,
      });
    }

    // Increment usage
    await redis.incr(windowKey);
    await redis.expire(windowKey, this.METRICS_WINDOW);

    const remaining = maxRequests - currentUsage - 1;
    const reset = new Date((Math.floor(now.getTime() / 1000 / this.METRICS_WINDOW) + 1) * this.METRICS_WINDOW * 1000);

    return {
      limit: maxRequests,
      remaining,
      reset,
    };
  }

  /**
   * Check and update quota
   */
  private async checkAndUpdateQuota(userId: string, endpoint: string): Promise<void> {
    const { plan } = await this.subscriptionService.getUserSubscription(userId);
    if (!plan || !plan.limits.maxApiCalls || plan.limits.maxApiCalls === -1) {
      return; // No limit or unlimited
    }

    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    const usage = await prisma.client.apiUsage.count({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    if (usage >= plan.limits.maxApiCalls) {
      await this.eventBus.emit('api.usage.limit_reached', {
        userId,
        limit: plan.limits.maxApiCalls,
        usage,
        endpoint,
        timestamp: new Date(),
      });

      throw new ForbiddenException('Monthly API quota exceeded', {
        limit: plan.limits.maxApiCalls,
        used: usage,
        resetAt: startOfMonth(new Date(new Date().setMonth(new Date().getMonth() + 1))),
      });
    }

    // Warn at 80% usage
    if (usage >= plan.limits.maxApiCalls * 0.8) {
      await this.eventBus.emit('api.usage.limit_warning', {
        userId,
        limit: plan.limits.maxApiCalls,
        usage,
        percentage: (usage / plan.limits.maxApiCalls) * 100,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Get usage quota for user
   */
  async getUsageQuota(userId: string): Promise<UsageQuota[]> {
    const { plan } = await this.subscriptionService.getUserSubscription(userId);
    if (!plan) {
      return [];
    }

    const quotas: UsageQuota[] = [];
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const nextMonthStart = startOfMonth(new Date(new Date().setMonth(new Date().getMonth() + 1)));

    // API Calls quota
    if (plan.limits.maxApiCalls && plan.limits.maxApiCalls !== -1) {
      const apiUsage = await prisma.client.apiUsage.count({
        where: {
          userId,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      quotas.push({
        resource: 'api_calls',
        limit: plan.limits.maxApiCalls,
        used: apiUsage,
        remaining: Math.max(0, plan.limits.maxApiCalls - apiUsage),
        percentage: (apiUsage / plan.limits.maxApiCalls) * 100,
        resetAt: nextMonthStart,
      });
    }

    // Add other quotas from subscription service
    const usageLimits = ['maxProjects', 'maxUsers', 'maxStorage', 'maxFileUploads'];

    for (const resource of usageLimits) {
      const usage = await this.subscriptionService.checkUsageLimit(userId, resource as any);
      if (usage.limit && usage.limit !== Infinity) {
        quotas.push({
          resource,
          limit: usage.limit,
          used: usage.used,
          remaining: usage.remaining,
          percentage: (usage.used / usage.limit) * 100,
          resetAt: resource === 'maxApiCalls' ? nextMonthStart : new Date(), // Most quotas don't reset
        });
      }
    }

    return quotas;
  }

  /**
   * Get endpoint analytics
   */
  async getEndpointAnalytics(
    endpoint: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      tenantId?: string;
    },
  ): Promise<{
    endpoint: string;
    totalRequests: number;
    uniqueUsers: number;
    methods: Record<string, number>;
    statusCodes: Record<string, number>;
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    errorRate: number;
    topErrors: Array<{ message: string; count: number }>;
  }> {
    const where = {
      endpoint,
      ...(options?.tenantId && { tenantId: options.tenantId }),
      ...(options?.startDate &&
        options?.endDate && {
          createdAt: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
    };

    const [totalRequests, uniqueUsers, methods, statusCodes, responseTimeStats] = await Promise.all([
      prisma.client.apiUsage.count({ where }),

      prisma.client.apiUsage
        .groupBy({
          by: ['userId'],
          where,
          _count: { userId: true },
        })
        .then(results => results.length),

      prisma.client.apiUsage.groupBy({
        by: ['method'],
        where,
        _count: { method: true },
      }),

      prisma.client.apiUsage.groupBy({
        by: ['statusCode'],
        where,
        _count: { statusCode: true },
      }),

      this.getResponseTimePercentiles(where),
    ]);

    // Calculate error rate
    const errorCount = statusCodes.filter(s => s.statusCode >= 400).reduce((sum, s) => sum + s._count.statusCode, 0);
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;

    // Get top errors
    const topErrors = await this.getTopErrors(where);

    return {
      endpoint,
      totalRequests,
      uniqueUsers,
      methods: methods.reduce(
        (acc, m) => {
          acc[m.method] = m._count.method;
          return acc;
        },
        {} as Record<string, number>,
      ),
      statusCodes: statusCodes.reduce(
        (acc, s) => {
          acc[s.statusCode.toString()] = s._count.statusCode;
          return acc;
        },
        {} as Record<string, number>,
      ),
      ...responseTimeStats,
      errorRate: Math.round(errorRate * 100) / 100,
      topErrors,
    };
  }

  /**
   * Get response time percentiles
   */
  private async getResponseTimePercentiles(where: any): Promise<{
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  }> {
    const responseTimes = await prisma.client.apiUsage.findMany({
      where,
      select: { responseTime: true },
      orderBy: { responseTime: 'asc' },
    });

    if (responseTimes.length === 0) {
      return {
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
      };
    }

    const times = responseTimes.map(r => r.responseTime);
    const average = times.reduce((sum, t) => sum + t, 0) / times.length;
    const p95Index = Math.floor(times.length * 0.95);
    const p99Index = Math.floor(times.length * 0.99);

    return {
      averageResponseTime: Math.round(average),
      p95ResponseTime: times[p95Index] || times[times.length - 1],
      p99ResponseTime: times[p99Index] || times[times.length - 1],
    };
  }

  /**
   * Get top errors
   */
  private async getTopErrors(where: any, limit: number = 5): Promise<Array<{ message: string; count: number }>> {
    const errors = await prisma.client.apiUsage.findMany({
      where: {
        ...where,
        statusCode: { gte: 400 },
      },
      select: { metadata: true },
    });

    const errorCounts = new Map<string, number>();

    errors.forEach(error => {
      const message = (error.metadata as any)?.error || 'Unknown error';
      errorCounts.set(message, (errorCounts.get(message) || 0) + 1);
    });

    return Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([message, count]) => ({ message, count }));
  }

  /**
   * Export usage data
   */
  async exportUsageData(
    userId: string,
    options: {
      startDate: Date;
      endDate: Date;
      format: 'csv' | 'json';
    },
  ): Promise<Buffer> {
    const usage = await prisma.client.apiUsage.findMany({
      where: {
        userId,
        createdAt: {
          gte: options.startDate,
          lte: options.endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (options.format === 'json') {
      return Buffer.from(JSON.stringify(usage, null, 2));
    }

    // CSV format
    const { parse } = await import('json2csv');
    const fields = ['createdAt', 'endpoint', 'method', 'statusCode', 'responseTime', 'ipAddress'];
    const csv = parse(usage, { fields });
    return Buffer.from(csv);
  }

  /**
   * Health check for API monitoring
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: {
      requestsPerMinute: number;
      errorRate: number;
      averageResponseTime: number;
      activeEndpoints: number;
    };
    issues: string[];
  }> {
    const now = new Date();
    const fiveMinutesAgo = subDays(now, 0.00347); // ~5 minutes

    const recentStats = await this.getUsageStats(undefined, undefined, {
      startDate: fiveMinutesAgo,
      endDate: now,
    });

    const issues: string[] = [];
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Check error rate
    if (recentStats.errorRate > 10) {
      issues.push(`High error rate: ${recentStats.errorRate}%`);
      status = 'degraded';
    }
    if (recentStats.errorRate > 25) {
      status = 'unhealthy';
    }

    // Check response time
    if (recentStats.averageResponseTime > 1000) {
      issues.push(`Slow response time: ${recentStats.averageResponseTime}ms`);
      status = status === 'healthy' ? 'degraded' : status;
    }
    if (recentStats.averageResponseTime > 3000) {
      status = 'unhealthy';
    }

    // Check request rate
    if (recentStats.requestsPerMinute < 1) {
      issues.push('Low request rate - possible monitoring issue');
      status = status === 'healthy' ? 'degraded' : status;
    }

    return {
      status,
      metrics: {
        requestsPerMinute: recentStats.requestsPerMinute,
        errorRate: recentStats.errorRate,
        averageResponseTime: recentStats.averageResponseTime,
        activeEndpoints: recentStats.uniqueEndpoints,
      },
      issues,
    };
  }
}
