import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { OnboardingController } from './onboarding.controller';

export default async function onboardingRoutes(fastify: FastifyInstance) {
  const onboardingController = Container.get(OnboardingController);

  // All routes require authentication
  fastify.addHook('onRequest', async (request, reply) => {
    await (fastify as any).verifyJWT(request, reply);
  });

  // Onboarding flow management
  fastify.post('/start', onboardingController.startOnboarding.bind(onboardingController));
  fastify.get('/progress', onboardingController.getProgress.bind(onboardingController));
  fastify.post('/skip', onboardingController.skipOnboarding.bind(onboardingController));

  // Step management
  fastify.post('/steps/complete', onboardingController.completeStep.bind(onboardingController));
  fastify.post('/steps/skip', onboardingController.skipStep.bind(onboardingController));

  // UI helpers
  fastify.get('/checklist', onboardingController.getChecklist.bind(onboardingController));
  fastify.get('/hints', onboardingController.getHints.bind(onboardingController));

  // Admin routes
  fastify.get('/analytics', {
    preHandler: [
      async (request, reply) => {
        await (fastify as any).verifyRole(['ADMIN', 'SUPER_ADMIN'])(request, reply);
      }
    ]
  }, onboardingController.getAnalytics.bind(onboardingController));
}