import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { EmailCampaignController } from '../controllers/email-campaign.controller';
import { requireAuth } from '@/modules/auth/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import {
  emailSendRateLimit,
  checkDailyEmailQuota,
  trackEmailUsage,
  validateCampaignOwnership,
  checkCampaignSendPermission
} from '../middleware/email-marketing.middleware';

export default async function emailCampaignRoutes(fastify: FastifyInstance) {
  const campaignController = Container.get(EmailCampaignController);

  // All routes require authentication and tenant context
  fastify.addHook('onRequest', async (request, reply) => {
    await requireAuth(request, reply);
    await requireTenant(request, reply);
  });

  // Campaign CRUD endpoints
  fastify.post('/', campaignController.createCampaign.bind(campaignController));
  fastify.get('/', campaignController.getCampaigns.bind(campaignController));

  // Campaign-specific routes with ownership validation
  fastify.register(async function campaignSpecificRoutes(fastify: FastifyInstance) {
    // Add ownership validation for all campaign-specific routes
    fastify.addHook('preHandler', validateCampaignOwnership());

    // Single campaign operations
    fastify.get('/:campaignId', campaignController.getCampaign.bind(campaignController));
    fastify.put('/:campaignId', campaignController.updateCampaign.bind(campaignController));
    fastify.delete('/:campaignId', campaignController.deleteCampaign.bind(campaignController));

    // Campaign actions
    fastify.post('/:campaignId/schedule', campaignController.scheduleCampaign.bind(campaignController));
    fastify.patch('/:campaignId/pause', campaignController.pauseCampaign.bind(campaignController));
    fastify.patch('/:campaignId/resume', campaignController.resumeCampaign.bind(campaignController));
    fastify.post('/:campaignId/duplicate', campaignController.duplicateCampaign.bind(campaignController));

    // Send campaign with additional middleware
    fastify.post('/:campaignId/send', {
      preHandler: [
        checkCampaignSendPermission,
        emailSendRateLimit(),
        checkDailyEmailQuota,
        trackEmailUsage
      ]
    }, campaignController.sendCampaign.bind(campaignController));

    // Analytics and testing
    fastify.get('/:campaignId/analytics', campaignController.getCampaignAnalytics.bind(campaignController));
    fastify.get('/:campaignId/performance', campaignController.getCampaignPerformance.bind(campaignController));
    fastify.get('/:campaignId/preview', campaignController.previewCampaign.bind(campaignController));
    fastify.post('/:campaignId/test', campaignController.sendTestEmail.bind(campaignController));

    // A/B Testing
    fastify.post('/:campaignId/ab-test', campaignController.createABTest.bind(campaignController));
    fastify.get('/:campaignId/ab-test', campaignController.getABTestResults.bind(campaignController));
  });
}
