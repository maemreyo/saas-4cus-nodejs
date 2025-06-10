// Updated: 2024-12-25 - AI module implementation

import { Service } from 'typedi';
import { HealthService } from '@infrastructure/health/health.service';
import { HealthStatus } from '@infrastructure/health/health.types';
import { prisma } from '@infrastructure/database/prisma.service';
import { AiService } from './ai.service';
import { AiCacheService } from './ai.cache';
import { logger } from '@shared/logger';

// Import providers for health checking
import { OpenAIProvider } from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { GoogleAIProvider } from './providers/google-ai.provider';
import { OllamaProvider } from './providers/ollama.provider';
import { MockProvider } from './providers/mock.provider';

@Service()
export class AiHealthCheck {
  constructor(
    private healthService: HealthService,
    private aiService: AiService,
    private cacheService: AiCacheService
  ) {}

  async register() {
    // Register main AI service health check
    this.healthService.register('ai:service', async () => {
      try {
        // Check if AI service is responding
        const models = await this.aiService.getAvailableModels();

        return {
          status: HealthStatus.HEALTHY,
          message: 'AI service is operational',
          details: {
            availableModels: models.length,
            timestamp: new Date().toISOString(),
          },
        };
      } catch (error) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: 'AI service is not responding',
          error: (error as Error).message,
        };
      }
    });

    // Register cache health check
    this.healthService.register('ai:cache', async () => {
      try {
        const stats = await this.cacheService.getStats();

        return {
          status: HealthStatus.HEALTHY,
          message: 'AI cache is operational',
          details: {
            ...stats,
            timestamp: new Date().toISOString(),
          },
        };
      } catch (error) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: 'AI cache is not responding',
          error: (error as Error).message,
        };
      }
    });

    // Register provider health checks
    await this.registerProviderHealthChecks();

    // Register usage tracking health check
    this.healthService.register('ai:usage', async () => {
      try {
        const recentLogs = await prisma.client.aiUsageLog.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 60000), // Last minute
            },
          },
        });

        return {
          status: HealthStatus.HEALTHY,
          message: 'AI usage tracking is operational',
          details: {
            recentRequests: recentLogs,
            timestamp: new Date().toISOString(),
          },
        };
      } catch (error) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: 'AI usage tracking is not responding',
          error: (error as Error).message,
        };
      }
    });

    logger.info('AI health checks registered');
  }

  private async registerProviderHealthChecks() {
    const providers = await prisma.client.aiProvider.findMany({
      where: { enabled: true },
    });

    for (const providerConfig of providers) {
      this.healthService.register(`ai:provider:${providerConfig.name}`, async () => {
        try {
          const provider = await this.createProviderInstance(providerConfig.name);

          if (!provider) {
            return {
              status: HealthStatus.UNHEALTHY,
              message: `Provider ${providerConfig.name} not configured`,
            };
          }

          const isAvailable = await provider.isAvailable();

          if (isAvailable) {
            return {
              status: HealthStatus.HEALTHY,
              message: `${providerConfig.displayName} is operational`,
              details: {
                provider: providerConfig.name,
                endpoint: providerConfig.apiEndpoint,
                timestamp: new Date().toISOString(),
              },
            };
          } else {
            return {
              status: HealthStatus.DEGRADED,
              message: `${providerConfig.displayName} is not available`,
              details: {
                provider: providerConfig.name,
                endpoint: providerConfig.apiEndpoint,
              },
            };
          }
        } catch (error) {
          return {
            status: HealthStatus.UNHEALTHY,
            message: `${providerConfig.displayName} health check failed`,
            error: (error as Error).message,
          };
        }
      });
    }
  }

  private async createProviderInstance(providerName: string) {
    // Get API key from environment or database
    let apiKey: string | undefined;

    switch (providerName) {
      case 'openai':
        apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return null;
        return new OpenAIProvider({ apiKey });

      case 'anthropic':
        apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return null;
        return new AnthropicProvider({ apiKey });

      case 'google':
        apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) return null;
        return new GoogleAIProvider({ apiKey });

      case 'ollama':
        return new OllamaProvider({
          baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        });

      case 'mock':
        return new MockProvider({});

      default:
        return null;
    }
  }

  async getHealthSummary() {
    const providers = await prisma.client.aiProvider.findMany({
      where: { enabled: true },
    });

    const providerStatuses = await Promise.all(
      providers.map(async (provider) => {
        const health = await this.healthService.check(`ai:provider:${provider.name}`);
        return {
          name: provider.name,
          displayName: provider.displayName,
          status: health.status,
          message: health.message,
        };
      })
    );

    const [serviceHealth, cacheHealth, usageHealth] = await Promise.all([
      this.healthService.check('ai:service'),
      this.healthService.check('ai:cache'),
      this.healthService.check('ai:usage'),
    ]);

    // Get recent usage stats
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayStats = await prisma.client.aiUsageLog.aggregate({
      where: {
        createdAt: { gte: startOfDay },
      },
      _sum: {
        totalTokens: true,
        cost: true,
      },
      _count: true,
      _avg: {
        latency: true,
      },
    });

    // Get error rate
    const recentErrors = await prisma.client.aiUsageLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 3600000) }, // Last hour
        error: { not: null },
      },
    });

    const totalRecent = await prisma.client.aiUsageLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 3600000) },
      },
    });

    const errorRate = totalRecent > 0 ? (recentErrors / totalRecent) * 100 : 0;

    return {
      status: this.calculateOverallStatus([
        serviceHealth.status,
        cacheHealth.status,
        usageHealth.status,
        ...providerStatuses.map(p => p.status),
      ]),
      service: serviceHealth,
      cache: cacheHealth,
      usage: usageHealth,
      providers: providerStatuses,
      stats: {
        today: {
          requests: todayStats._count,
          tokens: todayStats._sum.totalTokens || 0,
          cost: todayStats._sum.cost || 0,
          avgLatency: Math.round(todayStats._avg.latency || 0),
        },
        errorRate: Math.round(errorRate * 100) / 100,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private calculateOverallStatus(statuses: HealthStatus[]): HealthStatus {
    if (statuses.some(s => s === HealthStatus.UNHEALTHY)) {
      return HealthStatus.UNHEALTHY;
    }
    if (statuses.some(s => s === HealthStatus.DEGRADED)) {
      return HealthStatus.DEGRADED;
    }
    return HealthStatus.HEALTHY;
  }
}