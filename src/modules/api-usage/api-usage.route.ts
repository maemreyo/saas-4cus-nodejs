import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { ApiUsageController } from './api-usage.controller';

export default async function apiUsageRoutes(fastify: FastifyInstance) {
  const apiUsageController = Container.get(ApiUsageController);

  // All routes require authentication
  fastify.addHook('onRequest', async (request, reply) => {
    await (fastify as any).verifyJWT(request, reply);
  });

  // User endpoints
  fastify.get('/stats', apiUsageController.getUsageStats.bind(apiUsageController));
  fastify.post('/time-series', apiUsageController.getUsageTimeSeries.bind(apiUsageController));
  fastify.get('/rate-limit', apiUsageController.getRateLimit.bind(apiUsageController));
  fastify.get('/quota', apiUsageController.getUsageQuota.bind(apiUsageController));
  fastify.post('/export', apiUsageController.exportUsageData.bind(apiUsageController));

  // Endpoint analytics
  fastify.get('/endpoints/:endpoint/analytics', apiUsageController.getEndpointAnalytics.bind(apiUsageController));

  // Health status (public for monitoring)
  fastify.get('/health', {
    preHandler: [] // Skip auth for health endpoint
  }, apiUsageController.getHealthStatus.bind(apiUsageController));

  // Admin routes
  fastify.register(async function adminRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyRole(['ADMIN', 'SUPER_ADMIN'])(request, reply);
    });

    // Admin analytics
    fastify.get('/top-users', apiUsageController.getTopUsers.bind(apiUsageController));
    fastify.get('/system-metrics', apiUsageController.getSystemMetrics.bind(apiUsageController));
  });
}