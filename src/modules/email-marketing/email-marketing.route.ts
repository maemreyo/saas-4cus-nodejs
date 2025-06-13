// FIXED: Main routes registration for email marketing module using proper Fastify pattern

import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';

// Import sub-route modules
import emailCampaignRoutes from './routes/email-campaign.route';
import emailAutomationRoutes from './routes/email-automation.route';
import emailListRoutes from './routes/email-list.route';
import emailTemplateRoutes from './routes/email-template.route';
import emailTrackingRoutes from './routes/email-tracking.route';
import emailWebhookRoutes from './routes/email-webhook.route';
import emailSegmentRoutes from './routes/email-segment.route';

// Import main controller
import { EmailMarketingController } from './controllers/email-marketing.controller';
import { requireAuth } from '@/modules/auth/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';

export default async function emailMarketingRoutes(fastify: FastifyInstance) {
  // Register main email marketing controller
  const emailMarketingController = Container.get(EmailMarketingController);

  // All routes require authentication and tenant context
  fastify.addHook('onRequest', async (request, reply) => {
    await requireAuth(request, reply);
    await requireTenant(request, reply);
  });

  // Main dashboard and overview endpoints
  fastify.get('/dashboard', emailMarketingController.getDashboard.bind(emailMarketingController));
  fastify.get('/stats', emailMarketingController.getStats.bind(emailMarketingController));
  fastify.get('/health', emailMarketingController.getHealthStatus.bind(emailMarketingController));
  fastify.post('/export', emailMarketingController.exportData.bind(emailMarketingController));

  // Utility endpoints
  fastify.post('/test-email', emailMarketingController.testEmail.bind(emailMarketingController));
  fastify.post('/preview-email', emailMarketingController.previewEmail.bind(emailMarketingController));
  fastify.post('/validate-content', emailMarketingController.validateContent.bind(emailMarketingController));

  // Analytics endpoints
  fastify.get('/delivery-rates', emailMarketingController.getDeliveryRates.bind(emailMarketingController));
  fastify.get('/engagement', emailMarketingController.getEngagementMetrics.bind(emailMarketingController));
  fastify.get('/reputation', emailMarketingController.getReputationScore.bind(emailMarketingController));

  // Sender domain management
  fastify.get('/sender-domains', emailMarketingController.getSenderDomains.bind(emailMarketingController));
  fastify.post(
    '/sender-domains/:domain/verify',
    emailMarketingController.verifySenderDomain.bind(emailMarketingController),
  );

  // Suppression list management
  fastify.get('/suppression-list', emailMarketingController.getSuppressionList.bind(emailMarketingController));
  fastify.post('/suppression-list', emailMarketingController.addToSuppressionList.bind(emailMarketingController));
  fastify.delete(
    '/suppression-list/:email',
    emailMarketingController.removeFromSuppressionList.bind(emailMarketingController),
  );

  // Usage and limits
  fastify.get('/usage-limits', emailMarketingController.getUsageLimits.bind(emailMarketingController));
  fastify.get('/usage', emailMarketingController.getCurrentUsage.bind(emailMarketingController));

  // Register sub-modules
  await fastify.register(emailCampaignRoutes, { prefix: '/campaigns' });
  await fastify.register(emailAutomationRoutes, { prefix: '/automations' });
  await fastify.register(emailListRoutes, { prefix: '/lists' });
  await fastify.register(emailTemplateRoutes, { prefix: '/templates' });
  await fastify.register(emailTrackingRoutes, { prefix: '/track' });
  await fastify.register(emailWebhookRoutes, { prefix: '/webhooks' });

  // Register segment routes under lists
  await fastify.register(async (fastify) => {
    await fastify.register(emailSegmentRoutes, { prefix: '/segments' });
  }, { prefix: '/lists/:listId' });
}
