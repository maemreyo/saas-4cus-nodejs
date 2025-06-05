import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { FeatureController } from './feature.controller';

export default async function featureRoutes(fastify: FastifyInstance) {
  const featureController = Container.get(FeatureController);

  // Public routes
  fastify.get('/plans', featureController.getPlans.bind(featureController));
  fastify.get('/plans/:slug', featureController.getPlan.bind(featureController));
  fastify.get('/plans/compare', featureController.comparePlans.bind(featureController));

  // Protected routes
  fastify.register(async function protectedRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyJWT(request, reply);
    });

    // Features
    fastify.get('/features', featureController.getFeatures.bind(featureController));

    // Feature flags
    fastify.get('/flags', featureController.getUserFeatureFlags.bind(featureController));
    fastify.get('/flags/:key', featureController.checkFeatureFlag.bind(featureController));

    // Entitlements
    fastify.get('/entitlements', featureController.getUserEntitlements.bind(featureController));
    fastify.post('/entitlements/check', featureController.checkEntitlement.bind(featureController));
    fastify.post('/entitlements/consume', featureController.consumeEntitlement.bind(featureController));

    // Usage tracking
    fastify.post('/track', featureController.trackUsage.bind(featureController));

    // Admin routes
    fastify.register(async function adminRoutes(fastify: FastifyInstance) {
      fastify.addHook('onRequest', async (request, reply) => {
        await (fastify as any).verifyRole(['ADMIN', 'SUPER_ADMIN'])(request, reply);
      });

      // Feature management
      fastify.post('/features', featureController.createFeature.bind(featureController));

      // Plan management
      fastify.post('/plans', featureController.createPlan.bind(featureController));
      fastify.put('/plans/:planId', featureController.updatePlan.bind(featureController));

      // Feature flag management
      fastify.put('/flags/:key', featureController.updateFeatureFlag.bind(featureController));

      // Usage statistics
      fastify.get('/features/:featureKey/stats', featureController.getFeatureUsageStats.bind(featureController));
    });
  });
}