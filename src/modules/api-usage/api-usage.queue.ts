import { Job } from 'bullmq';
import { Service } from 'typedi';
import { ApiUsageService } from './api-usage.service';
import { queueService } from '@shared/queue/queue.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { ApiUsageEvents } from './api-usage.events';
import { prisma } from '@infrastructure/database/prisma.service';
import { subMinutes, startOfMonth } from 'date-fns';

@Service()
export class ApiUsageQueueProcessor {
  constructor(private apiUsageService: ApiUsageService) {
    this.registerProcessors();
  }

  private registerProcessors() {
    // Health check monitoring
    queueService.registerProcessor('api-usage', 'health-check', this.processHealthCheck.bind(this));

    // Usage aggregation
    queueService.registerProcessor('api-usage', 'aggregate-metrics', this.processAggregateMetrics.bind(this));

    // Alert processing
    queueService.registerProcessor('api-usage', 'check-alerts', this.processCheckAlerts.bind(this));

    // Usage reset
    queueService.registerProcessor('api-usage', 'reset-quotas', this.processResetQuotas.bind(this));

    // Cleanup old data
    queueService.registerProcessor('api-usage', 'cleanup', this.processCleanup.bind(this));

    // Generate reports
    queueService.registerProcessor('api-usage', 'generate-report', this.processGenerateReport.bind(this));
  }

  /**
   * Process health check
   */
  async processHealthCheck(job: Job) {
    const previousHealth = job.data.previousHealth;

    try {
      const health = await this.apiUsageService.healthCheck();

      // Check for status changes
      if (previousHealth && previousHealth.status !== health.status) {
        if (health.status === 'healthy' && previousHealth.status !== 'healthy') {
          // Recovered
          const downtime = Date.now() - (previousHealth.timestamp || Date.now());
          await eventBus.emit(ApiUsageEvents.API_HEALTH_RECOVERED, {
            previousStatus: previousHealth.status,
            currentStatus: health.status,
            downtime: Math.round(downtime / 1000 / 60), // minutes
            metrics: health.metrics,
          });
        } else if (health.status === 'degraded') {
          await eventBus.emit(ApiUsageEvents.API_HEALTH_DEGRADED, health);
        } else if (health.status === 'unhealthy') {
          await eventBus.emit(ApiUsageEvents.API_HEALTH_UNHEALTHY, health);
        }
      }

      // Update job progress
      await job.updateProgress(100);

      return {
        health,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error('Health check failed', error as Error);
      throw error;
    }
  }

  /**
   * Process metrics aggregation
   */
  async processAggregateMetrics(job: Job) {
    const { timeWindow } = job.data;

    try {
      const endDate = new Date();
      const startDate = subMinutes(endDate, timeWindow || 60);

      // Get recent API usage
      const usage = await prisma.client.apiUsage.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Aggregate by endpoint
      const endpointMetrics = new Map<
        string,
        {
          count: number;
          totalResponseTime: number;
          errors: number;
        }
      >();

      usage.forEach(record => {
        const key = `${record.endpoint}:${record.method}`;
        const current = endpointMetrics.get(key) || {
          count: 0,
          totalResponseTime: 0,
          errors: 0,
        };

        current.count++;
        current.totalResponseTime += record.responseTime;
        if (record.statusCode >= 400) {
          current.errors++;
        }

        endpointMetrics.set(key, current);
      });

      // Check for alerts
      for (const [endpoint, metrics] of endpointMetrics) {
        const errorRate = (metrics.errors / metrics.count) * 100;
        const avgResponseTime = metrics.totalResponseTime / metrics.count;

        // High error rate alert
        if (errorRate > 10) {
          await eventBus.emit(ApiUsageEvents.HIGH_ERROR_RATE, {
            endpoint,
            errorRate,
            timeWindow: `${timeWindow} minutes`,
            errors: metrics.errors,
            total: metrics.count,
          });
        }

        // Slow response time alert
        if (avgResponseTime > 3000) {
          await eventBus.emit(ApiUsageEvents.SLOW_RESPONSE_TIME, {
            endpoint,
            averageResponseTime: avgResponseTime,
            timeWindow: `${timeWindow} minutes`,
          });
        }
      }

      await job.updateProgress(100);

      return {
        aggregated: endpointMetrics.size,
        timeWindow,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error('Metrics aggregation failed', error as Error);
      throw error;
    }
  }

  /**
   * Process alert checking
   */
  async processCheckAlerts(job: Job) {
    try {
      // Check quota warnings for all users
      const activeUsers = await prisma.client.user.findMany({
        where: {
          status: 'ACTIVE',
          subscriptions: {
            some: {
              status: { in: ['ACTIVE', 'TRIALING'] },
            },
          },
        },
      });

      let warnings = 0;

      for (const user of activeUsers) {
        const quotas = await this.apiUsageService.getUsageQuota(user.id);

        for (const quota of quotas) {
          if (quota.percentage >= 80 && quota.percentage < 100) {
            await eventBus.emit(ApiUsageEvents.QUOTA_WARNING, {
              userId: user.id,
              resource: quota.resource,
              limit: quota.limit,
              used: quota.used,
              percentage: quota.percentage,
            });
            warnings++;
          }
        }

        // Update progress
        await job.updateProgress((activeUsers.indexOf(user) / activeUsers.length) * 100);
      }

      return {
        usersChecked: activeUsers.length,
        warningsSent: warnings,
      };
    } catch (error) {
      logger.error('Alert checking failed', error as Error);
      throw error;
    }
  }

  /**
   * Process quota resets
   */
  async processResetQuotas(job: Job) {
    try {
      const now = new Date();
      const isStartOfMonth = now.getDate() === 1;

      if (!isStartOfMonth) {
        return { message: 'Not start of month, skipping reset' };
      }

      // Reset monthly quotas
      logger.info('Resetting monthly API quotas');

      // Clear Redis counters
      const pattern = 'api:user:monthly:*';
      await prisma.client.$executeRaw`
        DELETE FROM api_usage
        WHERE created_at < ${startOfMonth(now)}
      `;

      await eventBus.emit(ApiUsageEvents.QUOTA_RESET, {
        resetAt: now,
        type: 'monthly',
      });

      return {
        resetAt: now,
        message: 'Monthly quotas reset successfully',
      };
    } catch (error) {
      logger.error('Quota reset failed', error as Error);
      throw error;
    }
  }

  /**
   * Process cleanup of old data
   */
  async processCleanup(job: Job) {
    const { retentionDays = 90 } = job.data;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      // Delete old API usage records
      const result = await prisma.client.apiUsage.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      logger.info('Cleaned up old API usage records', {
        deleted: result.count,
        cutoffDate,
      });

      await job.updateProgress(100);

      return {
        deleted: result.count,
        cutoffDate,
      };
    } catch (error) {
      logger.error('Cleanup failed', error as Error);
      throw error;
    }
  }

  /**
   * Process report generation
   */
  async processGenerateReport(job: Job) {
    const { userId, startDate, endDate, format } = job.data;

    try {
      // Export usage data
      const data = await this.apiUsageService.exportUsageData(userId, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        format,
      });

      // Upload to storage
      const filename = `api-usage-${userId}-${startDate}-${endDate}.${format}`;
      const storageServiceModule = await import('@shared/services/storage.service');
      const fileUrl = await storageServiceModule.storageService.storeFile(data, filename, {
        contentType: format === 'csv' ? 'text/csv' : 'application/json',
      });

      // Emit event
      await eventBus.emit(ApiUsageEvents.USAGE_REPORT_GENERATED, {
        userId,
        reportType: 'api-usage',
        period: `${startDate} to ${endDate}`,
        fileUrl,
      });

      await job.updateProgress(100);

      return {
        fileUrl,
        size: data.length,
      };
    } catch (error) {
      logger.error('Report generation failed', error as Error);
      throw error;
    }
  }
}

// Initialize queue jobs
export async function initializeApiUsageJobs() {
  // Health check every 5 minutes
  await queueService.addJob(
    'api-usage',
    'health-check',
    { previousHealth: null },
    {
      repeat: { cron: '*/5 * * * *' },
    },
  );

  // Aggregate metrics every hour
  await queueService.addJob(
    'api-usage',
    'aggregate-metrics',
    { timeWindow: 60 },
    {
      repeat: { cron: '0 * * * *' },
    },
  );

  // Check alerts every 30 minutes
  await queueService.addJob(
    'api-usage',
    'check-alerts',
    {},
    {
      repeat: { cron: '*/30 * * * *' },
    },
  );

  // Reset quotas at start of each month
  await queueService.addJob(
    'api-usage',
    'reset-quotas',
    {},
    {
      repeat: { cron: '0 0 1 * *' },
    },
  );

  // Cleanup old data daily at 3 AM
  await queueService.addJob(
    'api-usage',
    'cleanup',
    { retentionDays: 90 },
    {
      repeat: { cron: '0 3 * * *' },
    },
  );

  logger.info('API usage queue jobs initialized');
}
