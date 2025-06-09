// Updated: Integrated with HealthAggregator for comprehensive health checks
import { FastifyInstance } from 'fastify';
import { config } from '@infrastructure/config';
import { healthAggregator } from '@infrastructure/monitoring/health-aggregator';
import { moduleManager } from '@infrastructure/modules/module-manager';
import { version } from '../../../../package.json';

async function healthRoutes(fastify: FastifyInstance) {
  // Simple liveness probe - just check if server is responding
  fastify.get('/health/live', {
    schema: {
      description: 'Kubernetes liveness probe - checks if service is alive',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });

  // Readiness probe - check if service is ready to accept traffic
  fastify.get('/health/ready', {
    schema: {
      description: 'Kubernetes readiness probe - checks if service is ready',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            checks: { type: 'object' },
          },
        },
        503: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            checks: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const health = await healthAggregator.checkHealth();

    // For readiness, we only check critical services
    const criticalChecks = {
      database: health.checks.database,
      redis: health.checks.redis,
    };

    const isReady =
      criticalChecks.database.status === 'healthy' &&
      criticalChecks.redis.status === 'healthy';

    reply.code(isReady ? 200 : 503).send({
      status: isReady ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
      checks: criticalChecks,
    });
  });

  // Comprehensive health check
  fastify.get('/health', {
    schema: {
      description: 'Comprehensive health check with detailed information',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
            timestamp: { type: 'string' },
            version: { type: 'string' },
            environment: { type: 'string' },
            uptime: { type: 'number' },
            checks: { type: 'object' },
            system: { type: 'object' },
          },
        },
        503: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
            timestamp: { type: 'string' },
            version: { type: 'string' },
            environment: { type: 'string' },
            uptime: { type: 'number' },
            checks: { type: 'object' },
            system: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const health = await healthAggregator.checkHealth();

    reply.code(health.status === 'healthy' ? 200 : 503).send(health);
  });

  // Simplified health check for monitoring tools
  fastify.get('/health/simple', {
    schema: {
      description: 'Simple health check for monitoring tools',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            services: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const health = await healthAggregator.checkHealth();

    const services: Record<string, boolean> = {};
    for (const [name, check] of Object.entries(health.checks)) {
      services[name] = check.status === 'healthy';
    }

    return {
      status: health.status,
      services,
    };
  });

  // Live metrics endpoint
  fastify.get('/health/metrics', {
    schema: {
      description: 'Real-time metrics and performance data',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            timestamp: { type: 'string' },
            metrics: {
              type: 'object',
              properties: {
                requestsPerMinute: { type: 'number' },
                activeUsers: { type: 'number' },
                errorRate: { type: 'number' },
                averageResponseTime: { type: 'number' },
              },
            },
            system: { type: 'object' },
            modules: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  }, async (request, reply) => {
    const [metrics, health] = await Promise.all([
      healthAggregator.getLiveMetrics(),
      healthAggregator.checkHealth(),
    ]);

    return {
      timestamp: new Date().toISOString(),
      metrics,
      system: health.system,
      modules: moduleManager.getInitializedModules(),
    };
  });

  // Module status endpoint
  fastify.get('/health/modules', {
    schema: {
      description: 'Check status of all application modules',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            healthy: { type: 'boolean' },
            modules: { type: 'object' },
            initialized: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  }, async (request, reply) => {
    const moduleHealth = await moduleManager.healthCheck();

    return {
      healthy: moduleHealth.healthy,
      modules: moduleHealth.modules,
      initialized: moduleManager.getInitializedModules(),
    };
  });

  // Version endpoint
  fastify.get('/health/version', {
    schema: {
      description: 'Get application version information',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            version: { type: 'string' },
            environment: { type: 'string' },
            node: { type: 'string' },
            uptime: { type: 'number' },
            startTime: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const startTime = new Date(Date.now() - process.uptime() * 1000);

    return {
      version: version || '1.0.0',
      environment: config.app.env,
      node: process.version,
      uptime: process.uptime(),
      startTime: startTime.toISOString(),
    };
  });

  // Database health check
  fastify.get('/health/database', {
    schema: {
      description: 'Database connection health check',
      tags: ['health'],
    },
  }, async (request, reply) => {
    const health = await healthAggregator.checkHealth();
    const dbHealth = health.checks.database;

    reply.code(dbHealth.status === 'healthy' ? 200 : 503).send({
      status: dbHealth.status,
      responseTime: dbHealth.responseTime,
      details: dbHealth.details,
    });
  });

  // Redis health check
  fastify.get('/health/redis', {
    schema: {
      description: 'Redis connection health check',
      tags: ['health'],
    },
  }, async (request, reply) => {
    const health = await healthAggregator.checkHealth();
    const redisHealth = health.checks.redis;

    reply.code(redisHealth.status === 'healthy' ? 200 : 503).send({
      status: redisHealth.status,
      responseTime: redisHealth.responseTime,
      details: redisHealth.details,
    });
  });

  // Custom health check endpoint for specific services
  fastify.get('/health/service/:service', {
    schema: {
      description: 'Health check for specific service',
      tags: ['health'],
      params: {
        type: 'object',
        properties: {
          service: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const { service } = request.params as { service: string };
    const health = await healthAggregator.checkHealth();

    if (!health.checks[service]) {
      return reply.code(404).send({
        error: 'Service not found',
        availableServices: Object.keys(health.checks),
      });
    }

    const serviceHealth = health.checks[service];
    reply.code(serviceHealth.status === 'healthy' ? 200 : 503).send({
      service,
      ...serviceHealth,
    });
  });
}

export default healthRoutes;