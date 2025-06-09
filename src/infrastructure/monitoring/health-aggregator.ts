import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { queueService } from '@shared/queue/queue.service';
import { moduleManager } from '@infrastructure/modules/module-manager';
import { elasticsearchClient } from '@infrastructure/search/elasticsearch.service';
import { logger } from '@shared/logger';
import os from 'os';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: {
    [key: string]: {
      status: 'healthy' | 'unhealthy' | 'degraded';
      responseTime?: number;
      details?: any;
      error?: string;
    };
  };
  system: {
    cpu: {
      usage: number;
      cores: number;
    };
    memory: {
      total: number;
      used: number;
      free: number;
      percentage: number;
    };
    disk?: {
      total: number;
      used: number;
      free: number;
      percentage: number;
    };
  };
}

@Service()
export class HealthAggregator {
  async checkHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const checks: HealthCheckResult['checks'] = {};
    let overallStatus: HealthCheckResult['status'] = 'healthy';

    // Database check
    const dbCheck = await this.checkDatabase();
    checks.database = dbCheck;
    if (dbCheck.status !== 'healthy') overallStatus = 'degraded';

    // Redis check
    const redisCheck = await this.checkRedis();
    checks.redis = redisCheck;
    if (redisCheck.status !== 'healthy' && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }

    // Queue check
    const queueCheck = await this.checkQueues();
    checks.queues = queueCheck;
    if (queueCheck.status !== 'healthy' && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }

    // Elasticsearch check (optional)
    const esCheck = await this.checkElasticsearch();
    if (esCheck) {
      checks.elasticsearch = esCheck;
      // Elasticsearch is optional, so don't affect overall status
    }

    // Module health checks
    const moduleHealth = await moduleManager.healthCheck();
    checks.modules = {
      status: moduleHealth.healthy ? 'healthy' : 'degraded',
      details: moduleHealth.modules,
    };
    if (!moduleHealth.healthy && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }

    // External services check
    const externalCheck = await this.checkExternalServices();
    checks.external = externalCheck;
    if (externalCheck.status === 'unhealthy') {
      overallStatus = 'unhealthy';
    }

    // System resources
    const system = await this.getSystemMetrics();

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks,
      system,
    };
  }

  private async checkDatabase(): Promise<HealthCheckResult['checks'][string]> {
    const start = Date.now();
    try {
      await prisma.client.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - start;

      // Get connection pool stats if available
      const stats = await prisma.getStats();

      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        details: stats,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: (error as Error).message,
        responseTime: Date.now() - start,
      };
    }
  }

  private async checkRedis(): Promise<HealthCheckResult['checks'][string]> {
    const start = Date.now();
    try {
      const pong = await redis.ping();
      const responseTime = Date.now() - start;

      // Get Redis info
      const info = await redis.info();
      const memoryUsed = parseInt(info.used_memory || '0');
      const connectedClients = parseInt(info.connected_clients || '0');

      return {
        status: pong && responseTime < 100 ? 'healthy' : 'degraded',
        responseTime,
        details: {
          connected: pong,
          memoryUsed: Math.round(memoryUsed / 1024 / 1024), // MB
          connectedClients,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: (error as Error).message,
        responseTime: Date.now() - start,
      };
    }
  }

  private async checkQueues(): Promise<HealthCheckResult['checks'][string]> {
    const start = Date.now();
    try {
      const health = await queueService.healthCheck();
      const responseTime = Date.now() - start;

      // Check if any queue is unhealthy
      const unhealthyQueues = Object.entries(health)
        .filter(([_, status]) => (status as any).status === 'unhealthy')
        .map(([name]) => name);

      return {
        status: unhealthyQueues.length === 0 ? 'healthy' : 'degraded',
        responseTime,
        details: {
          queues: health,
          unhealthyQueues,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: (error as Error).message,
        responseTime: Date.now() - start,
      };
    }
  }

  private async checkElasticsearch(): Promise<HealthCheckResult['checks'][string] | null> {
    if (!elasticsearchClient.getConnectionStatus()) {
      return null;
    }

    const start = Date.now();
    try {
      const client = elasticsearchClient.getClient();
      const health = await client.cluster.health();
      const responseTime = Date.now() - start;

      return {
        status: health.status === 'green' ? 'healthy' : health.status === 'yellow' ? 'degraded' : 'unhealthy',
        responseTime,
        details: {
          clusterName: health.cluster_name,
          status: health.status,
          numberOfNodes: health.number_of_nodes,
          activeShards: health.active_shards,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: (error as Error).message,
        responseTime: Date.now() - start,
      };
    }
  }

  private async checkExternalServices(): Promise<HealthCheckResult['checks'][string]> {
    const services: Record<string, boolean> = {};

    // Check SMTP (if configured)
    if (process.env.SMTP_HOST) {
      try {
        // This is a simple check - in production you might want to actually test SMTP connection
        services.smtp = true;
      } catch {
        services.smtp = false;
      }
    }

    // Check Stripe (if configured)
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        // In production, you might want to make a test API call to Stripe
        services.stripe = true;
      } catch {
        services.stripe = false;
      }
    }

    // Check OAuth providers (if configured)
    if (process.env.GOOGLE_CLIENT_ID) {
      services.googleOAuth = true;
    }

    const failedServices = Object.entries(services)
      .filter(([_, status]) => !status)
      .map(([name]) => name);

    return {
      status: failedServices.length === 0 ? 'healthy' : failedServices.length < Object.keys(services).length / 2 ? 'degraded' : 'unhealthy',
      details: {
        services,
        failedServices,
      },
    };
  }

  private async getSystemMetrics(): Promise<HealthCheckResult['system']> {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // CPU usage calculation
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }
      totalIdle += cpu.times.idle;
    });

    const cpuUsage = 100 - ~~(100 * totalIdle / totalTick);

    return {
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
      },
      memory: {
        total: Math.round(totalMem / 1024 / 1024), // MB
        used: Math.round(usedMem / 1024 / 1024), // MB
        free: Math.round(freeMem / 1024 / 1024), // MB
        percentage: Math.round((usedMem / totalMem) * 100),
      },
    };
  }

  async getLiveMetrics(): Promise<{
    requestsPerMinute: number;
    activeUsers: number;
    errorRate: number;
    averageResponseTime: number;
  }> {
    try {
      // Get metrics from Redis
      const [rpm, activeUsers, errors, totalRequests] = await Promise.all([
        redis.get('metrics:rpm') || 0,
        redis.get('metrics:active_users') || 0,
        redis.get('metrics:errors:5min') || 0,
        redis.get('metrics:requests:5min') || 1,
      ]);

      const errorRate = (Number(errors) / Number(totalRequests)) * 100;

      // Get average response time from recent requests
      const avgResponseTime = Number(await redis.get('metrics:avg_response_time')) || 0;

      return {
        requestsPerMinute: Number(rpm),
        activeUsers: Number(activeUsers),
        errorRate: Math.round(errorRate * 100) / 100,
        averageResponseTime: Math.round(avgResponseTime),
      };
    } catch (error) {
      logger.error('Failed to get live metrics', error as Error);
      return {
        requestsPerMinute: 0,
        activeUsers: 0,
        errorRate: 0,
        averageResponseTime: 0,
      };
    }
  }
}

// Create singleton instance
export const healthAggregator = new HealthAggregator();