import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { AnalyticsController } from './analytics.controller';

export default async function analyticsRoutes(fastify: FastifyInstance) {
  const analyticsController = Container.get(AnalyticsController);

  // Public tracking endpoints
  fastify.post('/track', analyticsController.trackEvent.bind(analyticsController));
  fastify.post('/page', analyticsController.trackPageView.bind(analyticsController));

  // Protected analytics endpoints
  fastify.register(async function protectedRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyJWT(request, reply);
    });

    // Dashboard and metrics
    fastify.get('/dashboard', analyticsController.getDashboard.bind(analyticsController));
    fastify.post('/funnel', analyticsController.getFunnel.bind(analyticsController));
    fastify.get('/cohorts', analyticsController.getCohortRetention.bind(analyticsController));
    fastify.get('/journey/:userId', analyticsController.getUserJourney.bind(analyticsController));

    // Reports
    fastify.post('/reports/generate', analyticsController.generateReport.bind(analyticsController));
    fastify.post('/reports/schedule', analyticsController.scheduleReport.bind(analyticsController));
  });
}