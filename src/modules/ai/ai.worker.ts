import { Service } from 'typedi';
import { CronJob } from 'cron';
import { prisma } from '@infrastructure/database/prisma.service';
import { eventBus } from '@shared/events/event-bus';
import { logger } from '@shared/logger';
import { AiEvents } from './ai.events';
import { AiCacheService } from './ai.cache';
import { NotificationService } from '../notification';

@Service()
export class AiWorker {
  private jobs: CronJob[] = [];

  constructor(
    private cacheService: AiCacheService,
    private notificationService: NotificationService
  ) {}

  async start() {
    logger.info('Starting AI worker jobs');

    // Clean up expired API keys (daily at 2 AM)
    this.jobs.push(
      new CronJob('0 2 * * *', async () => {
        await this.cleanupExpiredApiKeys();
      })
    );

    // Check usage limits (every hour)
    this.jobs.push(
      new CronJob('0 * * * *', async () => {
        await this.checkUsageLimits();
      })
    );

    // Generate usage reports (daily at 3 AM)
    this.jobs.push(
      new CronJob('0 3 * * *', async () => {
        await this.generateDailyUsageReports();
      })
    );

    // Cache cleanup (weekly on Sunday at 4 AM)
    this.jobs.push(
      new CronJob('0 4 * * 0', async () => {
        await this.cleanupOldCache();
      })
    );

    // Warm up cache with popular templates (daily at 5 AM)
    this.jobs.push(
      new CronJob('0 5 * * *', async () => {
        await this.warmUpCache();
      })
    );

    // Start all jobs
    this.jobs.forEach(job => job.start());

    // Register event listeners
    this.registerEventListeners();

    logger.info('AI worker jobs started successfully');
  }

  async stop() {
    logger.info('Stopping AI worker jobs');

    // Stop all cron jobs
    this.jobs.forEach(job => job.stop());
    this.jobs = [];

    logger.info('AI worker jobs stopped');
  }

  private registerEventListeners() {
    // Listen for usage limit warnings
    eventBus.on(AiEvents.USAGE_LIMIT_WARNING, async (payload) => {
      await this.handleUsageLimitWarning(payload);
    });

    // Listen for usage limit exceeded
    eventBus.on(AiEvents.USAGE_LIMIT_EXCEEDED, async (payload) => {
      await this.handleUsageLimitExceeded(payload);
    });

    // Listen for cost threshold exceeded
    eventBus.on(AiEvents.COST_THRESHOLD_EXCEEDED, async (payload) => {
      await this.handleCostThresholdExceeded(payload);
    });

    // Listen for API key expiration
    eventBus.on(AiEvents.API_KEY_EXPIRED, async (payload) => {
      await this.handleApiKeyExpired(payload);
    });
  }

  private async cleanupExpiredApiKeys() {
    try {
      logger.info('Cleaning up expired API keys');

      const expiredKeys = await prisma.client.aiApiKey.findMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      for (const key of expiredKeys) {
        // Delete the key
        await prisma.client.aiApiKey.delete({
          where: { id: key.id },
        });

        // Emit event
        await eventBus.emit(AiEvents.API_KEY_EXPIRED, {
          userId: key.userId || 'system',
          tenantId: key.tenantId,
          apiKeyId: key.id,
          providerId: key.providerId,
          name: key.name,
          expiresAt: key.expiresAt,
          timestamp: new Date(),
        });

        // Notify user
        if (key.user) {
          await this.notificationService.create({
            userId: key.user.id,
            type: 'ai_api_key_expired',
            title: 'AI API Key Expired',
            message: `Your API key "${key.name}" has expired and has been removed.`,
            priority: 'medium',
          });
        }
      }

      logger.info(`Cleaned up ${expiredKeys.length} expired API keys`);
    } catch (error) {
      logger.error('Failed to cleanup expired API keys', error as Error);
    }
  }

  private async checkUsageLimits() {
    try {
      logger.info('Checking AI usage limits');

      // Check API key usage limits
      const apiKeys = await prisma.client.aiApiKey.findMany({
        where: {
          usageLimit: {
            not: null,
          },
        },
        include: {
          user: true,
        },
      });

      for (const key of apiKeys) {
        if (key.usageLimit && key.currentUsage >= key.usageLimit * 0.8) {
          const percentage = (key.currentUsage / key.usageLimit) * 100;

          if (percentage >= 100) {
            await eventBus.emit(AiEvents.USAGE_LIMIT_EXCEEDED, {
              userId: key.userId || 'system',
              tenantId: key.tenantId,
              currentUsage: key.currentUsage,
              limit: key.usageLimit,
              percentage: 100,
              resource: 'api_key',
              timestamp: new Date(),
            });
          } else if (percentage >= 80) {
            await eventBus.emit(AiEvents.USAGE_LIMIT_WARNING, {
              userId: key.userId || 'system',
              tenantId: key.tenantId,
              currentUsage: key.currentUsage,
              limit: key.usageLimit,
              percentage,
              resource: 'api_key',
              timestamp: new Date(),
            });
          }
        }
      }

      // Check user monthly limits
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const userUsage = await prisma.client.aiUsageLog.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          totalTokens: true,
          cost: true,
        },
      });

      // Check against user limits (would need to fetch from entitlements)
      for (const usage of userUsage) {
        // Implementation would check against user's plan limits
        logger.debug('User usage check', {
          userId: usage.userId,
          tokens: usage._sum.totalTokens,
          cost: usage._sum.cost,
        });
      }

      logger.info('Usage limit check completed');
    } catch (error) {
      logger.error('Failed to check usage limits', error as Error);
    }
  }

  private async generateDailyUsageReports() {
    try {
      logger.info('Generating daily AI usage reports');

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get usage stats for yesterday
      const usageStats = await prisma.client.aiUsageLog.groupBy({
        by: ['userId', 'providerId', 'model', 'operation'],
        where: {
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _sum: {
          promptTokens: true,
          completionTokens: true,
          totalTokens: true,
          cost: true,
        },
        _count: true,
        _avg: {
          latency: true,
        },
      });

      // Get top users by usage
      const topUsers = await prisma.client.aiUsageLog.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _sum: {
          totalTokens: true,
          cost: true,
        },
        _count: true,
        orderBy: {
          _sum: {
            cost: 'desc',
          },
        },
        take: 10,
      });

      // Store or send reports as needed
      logger.info('Daily usage reports generated', {
        date: yesterday.toISOString(),
        totalUsers: new Set(usageStats.map(s => s.userId)).size,
        totalRequests: usageStats.reduce((sum, s) => sum + s._count, 0),
        totalCost: usageStats.reduce((sum, s) => sum + (s._sum.cost || 0), 0),
      });
    } catch (error) {
      logger.error('Failed to generate usage reports', error as Error);
    }
  }

  private async cleanupOldCache() {
    try {
      logger.info('Cleaning up old AI cache entries');

      const stats = await this.cacheService.getStats();
      logger.info('Cache stats before cleanup', stats);

      // Clear old cache entries
      // This would be more sophisticated in production
      await this.cacheService.clear();

      const newStats = await this.cacheService.getStats();
      logger.info('Cache stats after cleanup', newStats);
    } catch (error) {
      logger.error('Failed to cleanup cache', error as Error);
    }
  }

  private async warmUpCache() {
    try {
      logger.info('Warming up AI cache with popular templates');

      // Get most used templates
      const popularTemplates = await prisma.client.aiPromptTemplate.findMany({
        where: {
          isPublic: true,
        },
        orderBy: {
          usageCount: 'desc',
        },
        take: 20,
      });

      // Common queries to cache
      const commonRequests = [
        {
          type: 'completion' as const,
          input: 'Explain this concept in simple terms:',
          options: { model: 'gpt-3.5-turbo', temperature: 0.7 },
          result: {
            id: 'cached',
            text: 'I can help explain concepts in simple, easy-to-understand language.',
            model: 'gpt-3.5-turbo',
            usage: { promptTokens: 10, completionTokens: 15, totalTokens: 25 },
            finishReason: 'stop' as const,
          },
        },
      ];

      await this.cacheService.warmUp(commonRequests);

      logger.info('Cache warm-up completed');
    } catch (error) {
      logger.error('Failed to warm up cache', error as Error);
    }
  }

  // Event handlers
  private async handleUsageLimitWarning(payload: any) {
    try {
      const user = await prisma.client.user.findUnique({
        where: { id: payload.userId },
      });

      if (user) {
        await this.notificationService.create({
          userId: user.id,
          type: 'ai_usage_warning',
          title: 'AI Usage Warning',
          message: `You've used ${Math.round(payload.percentage)}% of your monthly AI ${payload.resource} limit.`,
          priority: 'medium',
        });
      }
    } catch (error) {
      logger.error('Failed to handle usage limit warning', error as Error);
    }
  }

  private async handleUsageLimitExceeded(payload: any) {
    try {
      const user = await prisma.client.user.findUnique({
        where: { id: payload.userId },
      });

      if (user) {
        await this.notificationService.create({
          userId: user.id,
          type: 'ai_usage_exceeded',
          title: 'AI Usage Limit Exceeded',
          message: `You've exceeded your monthly AI ${payload.resource} limit. Please upgrade your plan to continue using AI features.`,
          priority: 'high',
          actionUrl: '/settings/billing',
        });
      }
    } catch (error) {
      logger.error('Failed to handle usage limit exceeded', error as Error);
    }
  }

  private async handleCostThresholdExceeded(payload: any) {
    try {
      const user = await prisma.client.user.findUnique({
        where: { id: payload.userId },
      });

      if (user) {
        await this.notificationService.create({
          userId: user.id,
          type: 'ai_cost_threshold',
          title: 'AI Cost Threshold Alert',
          message: `Your AI usage cost has exceeded your configured threshold. Current cost: $${(payload.currentCost / 100).toFixed(2)}`,
          priority: 'high',
        });
      }
    } catch (error) {
      logger.error('Failed to handle cost threshold exceeded', error as Error);
    }
  }

  private async handleApiKeyExpired(payload: any) {
    try {
      logger.info('API key expired', { apiKeyId: payload.apiKeyId });
      // Additional handling if needed
    } catch (error) {
      logger.error('Failed to handle API key expiration', error as Error);
    }
  }
}
