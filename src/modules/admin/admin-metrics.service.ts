import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { Cacheable } from '@infrastructure/cache/redis.service';
import { subDays, subHours, startOfDay, endOfDay, format } from 'date-fns';
import os from 'os';

export interface SystemMetrics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    mrr: number;
    activeSubscriptions: number;
    totalTickets: number;
    openTickets: number;
    avgResponseTime: number;
  };
  performance: {
    cpu: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    uptime: number;
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
  };
  trends: {
    userGrowth: Array<{ date: Date; count: number }>;
    revenueGrowth: Array<{ date: Date; amount: number }>;
    apiUsage: Array<{ date: Date; calls: number }>;
    errorTrend: Array<{ date: Date; errors: number }>;
  };
}

export interface RevenueMetrics {
  total: number;
  mrr: number;
  arr: number;
  averageRevenuePerUser: number;
  byPlan: Array<{ plan: string; revenue: number; count: number }>;
  churnRate: number;
  ltv: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface UsageMetrics {
  api: {
    totalCalls: number;
    uniqueUsers: number;
    byEndpoint: Array<{ endpoint: string; count: number; avgTime: number }>;
    errorsByEndpoint: Array<{ endpoint: string; errors: number; rate: number }>;
  };
  features: {
    byFeature: Array<{ feature: string; usage: number; uniqueUsers: number }>;
    adoptionRate: Record<string, number>;
  };
  storage: {
    totalFiles: number;
    totalSize: number;
    byType: Record<string, { count: number; size: number }>;
  };
}

@Service()
export class AdminMetricsService {
  private readonly CACHE_TTL = 300; // 5 minutes

  /**
   * Get comprehensive system metrics
   */
  @Cacheable({ ttl: 300, namespace: 'admin:metrics' })
  async getSystemMetrics(
    startDate?: Date,
    endDate?: Date
  ): Promise<SystemMetrics> {
    const dateRange = {
      start: startDate || subDays(new Date(), 30),
      end: endDate || new Date()
    };

    const [overview, performance, trends] = await Promise.all([
      this.getOverviewMetrics(dateRange),
      this.getPerformanceMetrics(),
      this.getTrendMetrics(dateRange)
    ]);

    return {
      overview,
      performance,
      trends
    };
  }

  /**
   * Get revenue metrics
   */
  @Cacheable({ ttl: 600, namespace: 'admin:revenue' })
  async getRevenueMetrics(): Promise<RevenueMetrics> {
    const now = new Date();
    const lastMonth = subDays(now, 30);
    const lastWeek = subDays(now, 7);
    const yesterday = subDays(now, 1);

    // Get all paid invoices
    const invoices = await prisma.client.invoice.findMany({
      where: {
        status: 'PAID',
        paidAt: { gte: subDays(now, 365) } // Last year
      },
      include: {
        subscription: {
          include: {
            user: true
          }
        }
      }
    });

    // Calculate total revenue
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0) / 100;

    // Get active subscriptions for MRR
    const activeSubscriptions = await prisma.client.subscription.findMany({
      where: {
        status: { in: ['ACTIVE', 'TRIALING'] }
      },
      include: {
        invoices: {
          where: {
            status: 'PAID',
            paidAt: { gte: lastMonth }
          },
          orderBy: { paidAt: 'desc' },
          take: 1
        }
      }
    });

    // Calculate MRR
    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const lastInvoice = sub.invoices[0];
      if (lastInvoice) {
        // Normalize to monthly
        const metadata = sub.metadata as any;
        const interval = metadata?.interval || 'month';
        const amount = lastInvoice.amount / 100;
        return sum + (interval === 'year' ? amount / 12 : amount);
      }
      return sum;
    }, 0);

    // Calculate ARR
    const arr = mrr * 12;

    // ARPU
    const uniqueCustomers = new Set(activeSubscriptions.map(s => s.userId)).size;
    const arpu = uniqueCustomers > 0 ? mrr / uniqueCustomers : 0;

    // Revenue by plan
    const revenueByPlan = await this.getRevenueByPlan();

    // Churn rate (customers who cancelled in last 30 days)
    const churnedCount = await prisma.client.subscription.count({
      where: {
        status: 'CANCELED',
        canceledAt: { gte: lastMonth }
      }
    });
    const churnRate = activeSubscriptions.length > 0
      ? (churnedCount / activeSubscriptions.length) * 100
      : 0;

    // LTV (simplified: ARPU / churn rate)
    const monthlyChurnRate = churnRate / 100;
    const ltv = monthlyChurnRate > 0 ? arpu / monthlyChurnRate : arpu * 24; // Default 24 months

    // Growth rates
    const growth = await this.calculateRevenueGrowth(invoices, {
      daily: yesterday,
      weekly: lastWeek,
      monthly: lastMonth
    });

    return {
      total: totalRevenue,
      mrr,
      arr,
      averageRevenuePerUser: arpu,
      byPlan: revenueByPlan,
      churnRate: Math.round(churnRate * 100) / 100,
      ltv: Math.round(ltv),
      growth: {
        daily: growth.daily || 0,
        weekly: growth.weekly || 0,
        monthly: growth.monthly || 0
      }
    };
  }

  /**
   * Get API and feature usage metrics
   */
  @Cacheable({ ttl: 300, namespace: 'admin:usage' })
  async getUsageMetrics(days: number = 30): Promise<UsageMetrics> {
    const startDate = subDays(new Date(), days);

    const [apiMetrics, featureMetrics, storageMetrics] = await Promise.all([
      this.getApiUsageMetrics(startDate),
      this.getFeatureUsageMetrics(startDate),
      this.getStorageMetrics()
    ]);

    return {
      api: apiMetrics,
      features: featureMetrics,
      storage: storageMetrics
    };
  }

  /**
   * Get system health metrics
   */
  async getHealthMetrics() {
    const [dbHealth, redisHealth, queueHealth] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
      this.checkQueueHealth()
    ]);

    // Get error logs from last hour
    const recentErrors = await prisma.client.apiUsage.count({
      where: {
        statusCode: { gte: 500 },
        createdAt: { gte: subHours(new Date(), 1) }
      }
    });

    // Get slow queries
    const slowQueries = await this.getSlowQueries();

    return {
      status: dbHealth && redisHealth && queueHealth ? 'healthy' : 'degraded',
      services: {
        database: dbHealth ? 'healthy' : 'unhealthy',
        redis: redisHealth ? 'healthy' : 'unhealthy',
        queue: queueHealth ? 'healthy' : 'unhealthy'
      },
      errors: {
        last1Hour: recentErrors,
        errorRate: await this.getErrorRate()
      },
      performance: {
        slowQueries: slowQueries.length,
        averageQueryTime: await this.getAverageQueryTime()
      },
      timestamp: new Date()
    };
  }

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics() {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const fiveMinutesAgo = new Date(now.getTime() - 300000);

    // Get from Redis for real-time data - using smembers instead of scard
    const [
      activeUsersList,
      requestsLastMinute,
      errorsLastMinute
    ] = await Promise.all([
      redis.smembers('active_users'),
      redis.get('metrics:requests:1min') || 0,
      redis.get('metrics:errors:1min') || 0
    ]);

    const activeUsers = activeUsersList.length;

    // Get recent API calls
    const recentApiCalls = await prisma.client.apiUsage.findMany({
      where: {
        createdAt: { gte: fiveMinutesAgo }
      },
      select: {
        endpoint: true,
        method: true,
        statusCode: true,
        responseTime: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    // Calculate metrics
    const avgResponseTime = recentApiCalls.length > 0
      ? recentApiCalls.reduce((sum, call) => sum + call.responseTime, 0) / recentApiCalls.length
      : 0;

    const errorRate = recentApiCalls.length > 0
      ? (recentApiCalls.filter(call => call.statusCode >= 400).length / recentApiCalls.length) * 100
      : 0;

    return {
      timestamp: now,
      activeUsers,
      requestsPerMinute: Number(requestsLastMinute),
      errorsPerMinute: Number(errorsLastMinute),
      averageResponseTime: Math.round(avgResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      recentEndpoints: this.groupEndpointActivity(recentApiCalls)
    };
  }

  // Private helper methods

  private async getOverviewMetrics(dateRange: { start: Date; end: Date }) {
    const [
      totalUsers,
      activeUsers,
      revenue,
      activeSubscriptions,
      totalTickets,
      openTickets,
      avgResponseTime
    ] = await Promise.all([
      prisma.client.user.count(),

      prisma.client.user.count({
        where: {
          lastLoginAt: { gte: subDays(new Date(), 30) }
        }
      }),

      prisma.client.invoice.aggregate({
        where: {
          status: 'PAID',
          paidAt: {
            gte: dateRange.start,
            lte: dateRange.end
          }
        },
        _sum: { amount: true }
      }),

      prisma.client.subscription.count({
        where: {
          status: { in: ['ACTIVE', 'TRIALING'] }
        }
      }),

      prisma.client.ticket.count(),

      prisma.client.ticket.count({
        where: {
          status: { in: ['OPEN', 'IN_PROGRESS'] }
        }
      }),

      prisma.client.apiUsage.aggregate({
        where: {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end
          }
        },
        _avg: { responseTime: true }
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      totalRevenue: (revenue._sum.amount || 0) / 100,
      mrr: 0, // Calculated separately
      activeSubscriptions,
      totalTickets,
      openTickets,
      avgResponseTime: Math.round(avgResponseTime._avg.responseTime || 0)
    };
  }

  private async getPerformanceMetrics() {
    // System metrics
    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Get request metrics from Redis
    const [rpm, avgResponseTime, errorCount, totalRequests] = await Promise.all([
      redis.get('metrics:rpm') || 0,
      redis.get('metrics:avg_response_time') || 0,
      redis.get('metrics:errors:5min') || 0,
      redis.get('metrics:requests:5min') || 1
    ]);

    const errorRate = (Number(errorCount) / Number(totalRequests)) * 100;

    return {
      cpu: Math.round(cpuUsage),
      memory: {
        used: Math.round(usedMem / 1024 / 1024), // MB
        total: Math.round(totalMem / 1024 / 1024), // MB
        percentage: Math.round((usedMem / totalMem) * 100)
      },
      uptime: process.uptime(),
      requestsPerMinute: Number(rpm),
      averageResponseTime: Number(avgResponseTime),
      errorRate: Math.round(errorRate * 100) / 100
    };
  }

  private async getTrendMetrics(dateRange: { start: Date; end: Date }) {
    const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const dates: Date[] = [];

    for (let i = 0; i < Math.min(days, 30); i++) {
      dates.push(subDays(dateRange.end, i));
    }

    const [userGrowth, revenueGrowth, apiUsage, errorTrend] = await Promise.all([
      this.getUserGrowthTrend(dates),
      this.getRevenueGrowthTrend(dates),
      this.getApiUsageTrend(dates),
      this.getErrorTrend(dates)
    ]);

    return {
      userGrowth: userGrowth.reverse(),
      revenueGrowth: revenueGrowth.reverse(),
      apiUsage: apiUsage.reverse(),
      errorTrend: errorTrend.reverse()
    };
  }

  private async getUserGrowthTrend(dates: Date[]) {
    const results = [];

    for (const date of dates) {
      const count = await prisma.client.user.count({
        where: {
          createdAt: { lte: endOfDay(date) }
        }
      });

      results.push({ date, count });
    }

    return results;
  }

  private async getRevenueGrowthTrend(dates: Date[]) {
    const results = [];

    for (const date of dates) {
      const revenue = await prisma.client.invoice.aggregate({
        where: {
          status: 'PAID',
          paidAt: {
            gte: startOfDay(date),
            lte: endOfDay(date)
          }
        },
        _sum: { amount: true }
      });

      results.push({
        date,
        amount: (revenue._sum.amount || 0) / 100
      });
    }

    return results;
  }

  private async getApiUsageTrend(dates: Date[]) {
    const results = [];

    for (const date of dates) {
      const calls = await prisma.client.apiUsage.count({
        where: {
          createdAt: {
            gte: startOfDay(date),
            lte: endOfDay(date)
          }
        }
      });

      results.push({ date, calls });
    }

    return results;
  }

  private async getErrorTrend(dates: Date[]) {
    const results = [];

    for (const date of dates) {
      const errors = await prisma.client.apiUsage.count({
        where: {
          statusCode: { gte: 400 },
          createdAt: {
            gte: startOfDay(date),
            lte: endOfDay(date)
          }
        }
      });

      results.push({ date, errors });
    }

    return results;
  }

  private async getRevenueByPlan() {
    const subscriptions = await prisma.client.subscription.findMany({
      where: {
        status: { in: ['ACTIVE', 'TRIALING'] }
      },
      include: {
        invoices: {
          where: {
            status: 'PAID',
            paidAt: { gte: subDays(new Date(), 30) }
          }
        }
      }
    });

    const planRevenue: Record<string, { revenue: number; count: number }> = {};

    subscriptions.forEach(sub => {
      const planId = sub.stripePriceId;
      const revenue = sub.invoices.reduce((sum, inv) => sum + inv.amount, 0) / 100;

      if (!planRevenue[planId]) {
        planRevenue[planId] = { revenue: 0, count: 0 };
      }

      planRevenue[planId].revenue += revenue;
      planRevenue[planId].count += 1;
    });

    // Get plan names
    const plans = await prisma.client.plan.findMany();
    const planMap = new Map(plans.map(p => [p.stripePriceId, p.name]));

    return Object.entries(planRevenue).map(([planId, data]) => ({
      plan: planMap.get(planId) || 'Unknown',
      revenue: data.revenue,
      count: data.count
    }));
  }

  private async calculateRevenueGrowth(
    invoices: any[],
    periods: Record<string, Date>
  ): Promise<Record<string, number>> {
    const growth: Record<string, number> = {};

    for (const [period, startDate] of Object.entries(periods)) {
      const currentRevenue = invoices
        .filter(inv => inv.paidAt >= startDate)
        .reduce((sum, inv) => sum + inv.amount, 0) / 100;

      const previousStart = new Date(startDate);
      previousStart.setTime(startDate.getTime() - (new Date().getTime() - startDate.getTime()));

      const previousRevenue = invoices
        .filter(inv => inv.paidAt >= previousStart && inv.paidAt < startDate)
        .reduce((sum, inv) => sum + inv.amount, 0) / 100;

      growth[period] = previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;
    }

    return growth;
  }

  private async getApiUsageMetrics(startDate: Date) {
    const apiUsage = await prisma.client.apiUsage.findMany({
      where: {
        createdAt: { gte: startDate }
      }
    });

    const totalCalls = apiUsage.length;
    const uniqueUsers = new Set(apiUsage.map(u => u.userId)).size;

    // Group by endpoint
    const endpointStats: Record<string, { count: number; totalTime: number; errors: number }> = {};

    apiUsage.forEach(usage => {
      const key = `${usage.method} ${usage.endpoint}`;
      if (!endpointStats[key]) {
        endpointStats[key] = { count: 0, totalTime: 0, errors: 0 };
      }

      endpointStats[key].count++;
      endpointStats[key].totalTime += usage.responseTime;
      if (usage.statusCode >= 400) {
        endpointStats[key].errors++;
      }
    });

    const byEndpoint = Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        avgTime: Math.round(stats.totalTime / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const errorsByEndpoint = Object.entries(endpointStats)
      .filter(([_, stats]) => stats.errors > 0)
      .map(([endpoint, stats]) => ({
        endpoint,
        errors: stats.errors,
        rate: (stats.errors / stats.count) * 100
      }))
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 10);

    return {
      totalCalls,
      uniqueUsers,
      byEndpoint,
      errorsByEndpoint
    };
  }

  private async getFeatureUsageMetrics(startDate: Date) {
    const featureUsage = await prisma.client.featureUsage.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        feature: true
      }
    });

    // Group by feature
    const featureStats: Record<string, { usage: number; users: Set<string> }> = {};

    featureUsage.forEach(usage => {
      const key = usage.feature.name;
      if (!featureStats[key]) {
        featureStats[key] = { usage: 0, users: new Set() };
      }

      featureStats[key].usage += usage.count;
      featureStats[key].users.add(usage.userId);
    });

    const byFeature = Object.entries(featureStats)
      .map(([feature, stats]) => ({
        feature,
        usage: stats.usage,
        uniqueUsers: stats.users.size
      }))
      .sort((a, b) => b.usage - a.usage);

    // Calculate adoption rate
    const totalUsers = await prisma.client.user.count({
      where: {
        createdAt: { lte: startDate }
      }
    });

    const adoptionRate: Record<string, number> = {};
    byFeature.forEach(f => {
      adoptionRate[f.feature] = totalUsers > 0
        ? (f.uniqueUsers / totalUsers) * 100
        : 0;
    });

    return {
      byFeature,
      adoptionRate
    };
  }

  private async getStorageMetrics() {
    const files = await prisma.client.file.findMany({
      where: {
        deletedAt: null
      }
    });

    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    const byType: Record<string, { count: number; size: number }> = {};

    files.forEach(file => {
      const type = file.mimeType.split('/')[0] || 'other';
      if (!byType[type]) {
        byType[type] = { count: 0, size: 0 };
      }

      byType[type].count++;
      byType[type].size += file.size;
    });

    return {
      totalFiles,
      totalSize,
      byType
    };
  }

  // Health check methods
  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      await prisma.client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed', error as Error);
      return false;
    }
  }

  private async checkRedisHealth(): Promise<boolean> {
    try {
      await redis.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed', error as Error);
      return false;
    }
  }

  private async checkQueueHealth(): Promise<boolean> {
    try {
      // Check if queue service is responsive
      const queueStats = await redis.get('queue:health');
      return true;
    } catch (error) {
      logger.error('Queue health check failed', error as Error);
      return false;
    }
  }

  private async getSlowQueries(): Promise<any[]> {
    // This would require query logging to be enabled
    // For now, return empty array
    return [];
  }

  private async getAverageQueryTime(): Promise<number> {
    // This would require query timing metrics
    // For now, return a placeholder
    return 50; // ms
  }

  private async getErrorRate(): Promise<number> {
    const lastHour = subHours(new Date(), 1);

    const [totalRequests, errorRequests] = await Promise.all([
      prisma.client.apiUsage.count({
        where: { createdAt: { gte: lastHour } }
      }),
      prisma.client.apiUsage.count({
        where: {
          createdAt: { gte: lastHour },
          statusCode: { gte: 400 }
        }
      })
    ]);

    return totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
  }

  private groupEndpointActivity(apiCalls: any[]) {
    const endpoints: Record<string, number> = {};

    apiCalls.forEach(call => {
      const key = `${call.method} ${call.endpoint}`;
      endpoints[key] = (endpoints[key] || 0) + 1;
    });

    return Object.entries(endpoints)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
