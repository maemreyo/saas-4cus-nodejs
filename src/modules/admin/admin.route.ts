import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { AdminController } from './admin.controller';

export default async function adminRoutes(fastify: FastifyInstance) {
  const adminController = Container.get(AdminController);

  // Add admin middleware to all routes
  fastify.addHook('onRequest', async (request, reply) => {
    await (fastify as any).verifyJWT(request, reply);
    await (fastify as any).verifyRole(['ADMIN', 'SUPER_ADMIN'])(request, reply);
  });

  // ==================== USER MANAGEMENT ====================
  fastify.get('/users', adminController.searchUsers.bind(adminController));
  fastify.get('/users/:userId', adminController.getUserDetails.bind(adminController));
  fastify.put('/users/:userId', adminController.updateUser.bind(adminController));
  fastify.post('/users/bulk-action', adminController.bulkUserAction.bind(adminController));
  fastify.get('/users/statistics', adminController.getUserStatistics.bind(adminController));
  fastify.get('/users/:userId/activity', adminController.getUserActivity.bind(adminController));
  fastify.post('/users/:userId/impersonate', adminController.impersonateUser.bind(adminController));

  // ==================== SYSTEM METRICS ====================
  fastify.get('/metrics', adminController.getSystemMetrics.bind(adminController));
  fastify.get('/metrics/revenue', adminController.getRevenueMetrics.bind(adminController));
  fastify.get('/metrics/usage', adminController.getUsageMetrics.bind(adminController));
  fastify.get('/metrics/health', adminController.getSystemHealth.bind(adminController));
  fastify.get('/metrics/realtime', adminController.getRealTimeMetrics.bind(adminController));

  // ==================== CONTENT MODERATION ====================
  fastify.post('/moderation/review', adminController.reviewContent.bind(adminController));
  fastify.post('/moderation/bulk', adminController.bulkModerateContent.bind(adminController));
  fastify.get('/moderation/reports', adminController.getContentReports.bind(adminController));
  fastify.get('/moderation/statistics', adminController.getModerationStats.bind(adminController));
  fastify.get('/moderation/rules', adminController.getModerationRules.bind(adminController));
  fastify.put('/moderation/rules/:ruleId', adminController.updateModerationRule.bind(adminController));

  // ==================== SYSTEM CONFIGURATION ====================
  fastify.get('/config', adminController.getSystemConfig.bind(adminController));
  fastify.put('/config', adminController.updateSystemConfig.bind(adminController));

  // ==================== AUDIT LOGS ====================
  fastify.get('/audit-logs', adminController.getAuditLogs.bind(adminController));

  // ==================== REVENUE & BILLING ====================
  fastify.get('/revenue/analytics', adminController.getRevenueAnalytics.bind(adminController));
  fastify.post('/revenue/refund', adminController.processRefund.bind(adminController));

  // ==================== SUPPORT & TICKETS ====================
  fastify.get('/tickets/statistics', adminController.getTicketStats.bind(adminController));
  fastify.post('/tickets/:ticketId/assign', adminController.assignTicket.bind(adminController));

  // ==================== FEATURE USAGE ====================
  fastify.get('/features/usage', adminController.getFeatureUsage.bind(adminController));

  // ==================== ANNOUNCEMENTS ====================
  fastify.post('/announcements', adminController.createAnnouncement.bind(adminController));
  fastify.get('/announcements', adminController.getAnnouncements.bind(adminController));

  // ==================== DATA EXPORT ====================
  fastify.post('/export', adminController.exportData.bind(adminController));

  // ==================== COMPLIANCE ====================
  fastify.post('/compliance/report', adminController.generateComplianceReport.bind(adminController));
  fastify.post('/compliance/gdpr', adminController.handleGDPRRequest.bind(adminController));

  // Super Admin only routes
  fastify.register(async function superAdminRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      if (request.customUser?.role !== 'SUPER_ADMIN') {
        reply.code(403).send({ error: 'Super admin access required' });
      }
    });

    // Dangerous operations
    fastify.post('/maintenance', async (request, reply) => {
      const systemConfigService = Container.get(await import('./system-config.service').then(m => m.SystemConfigService));
      await systemConfigService.toggleMaintenanceMode(true, request.body);
      reply.send({ message: 'Maintenance mode enabled' });
    });

    fastify.delete('/maintenance', async (request, reply) => {
      const systemConfigService = Container.get(await import('./system-config.service').then(m => m.SystemConfigService));
      await systemConfigService.toggleMaintenanceMode(false);
      reply.send({ message: 'Maintenance mode disabled' });
    });

    // System reset operations
    fastify.post('/system/reset-cache', async (request, reply) => {
      const { redis } = await import('@infrastructure/cache/redis.service');
      await redis.flush();
      reply.send({ message: 'Cache cleared' });
    });
  });
}
