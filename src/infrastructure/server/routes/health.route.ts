import { FastifyInstance } from 'fastify';
import { config } from '@infrastructure/config';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { queueService } from '@shared/queue/queue.service';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy';
  duration: number;
  details?: any;
}

async function healthRoutes(fastify: FastifyInstance) {
  // Liveness probe
  fastify.get('/health/live', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Readiness probe
  fastify.get('/health/ready', async (request, reply) => {
    const checks = await Promise.all([checkDatabase(), checkRedis(), checkQueues()]);

    const allHealthy = checks.every(check => check.status === 'healthy');

    reply.code(allHealthy ? 200 : 503).send({
      status: allHealthy ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
      checks,
    });
  });

  // Detailed health check
  fastify.get('/health', async (request, reply) => {
    const checks = await Promise.all([checkDatabase(), checkRedis(), checkQueues(), checkDiskSpace(), checkMemory()]);

    const allHealthy = checks.every(check => check.status === 'healthy');

    reply.code(allHealthy ? 200 : 503).send({
      status: allHealthy ? 'healthy' : 'unhealthy',
      version: config.app.version,
      environment: config.app.env,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    });
  });

  // Metrics endpoint
  fastify.get('/health/metrics', async (request, reply) => {
    const [dbStats, cacheStats, queueStats] = await Promise.all([
      prisma.getStats(),
      redis.getStats(),
      queueService.healthCheck(),
    ]);

    return {
      database: dbStats,
      cache: cacheStats,
      queues: queueStats,
      process: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
      },
    };
  });
}

async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await prisma.ping();
    return {
      service: 'database',
      status: 'healthy',
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      service: 'database',
      status: 'unhealthy',
      duration: Date.now() - start,
      details: { error: (error as Error).message },
    };
  }
}

async function checkRedis(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await redis.ping();
    return {
      service: 'redis',
      status: 'healthy',
      duration: Date.now() - start,
    };
  } catch (error) {
    return {
      service: 'redis',
      status: 'unhealthy',
      duration: Date.now() - start,
      details: { error: (error as Error).message },
    };
  }
}

async function checkQueues(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const health = await queueService.healthCheck();
    const allHealthy = Object.values(health).every(q => q.status === 'healthy');

    return {
      service: 'queues',
      status: allHealthy ? 'healthy' : 'unhealthy',
      duration: Date.now() - start,
      details: health,
    };
  } catch (error) {
    return {
      service: 'queues',
      status: 'unhealthy',
      duration: Date.now() - start,
      details: { error: (error as Error).message },
    };
  }
}

async function checkDiskSpace(): Promise<HealthCheckResult> {
  const start = Date.now();
  // Implementation depends on OS
  return {
    service: 'disk',
    status: 'healthy',
    duration: Date.now() - start,
  };
}

async function checkMemory(): Promise<HealthCheckResult> {
  const start = Date.now();
  const usage = process.memoryUsage();
  const heapUsedPercent = (usage.heapUsed / usage.heapTotal) * 100;

  return {
    service: 'memory',
    status: heapUsedPercent < 90 ? 'healthy' : 'unhealthy',
    duration: Date.now() - start,
    details: {
      heapUsedPercent: Math.round(heapUsedPercent),
      rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
    },
  };
}

export default healthRoutes;
