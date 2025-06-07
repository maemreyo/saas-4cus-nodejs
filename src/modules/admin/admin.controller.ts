import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { logger } from '@shared/logger';
import { AdminUserService } from './admin-user.service';
import { AdminMetricsService } from './admin-metrics.service';
import { AdminModerationService } from './admin-moderation.service';
import { AuditService } from '@shared/services/audit.service';
import { validateSchema } from '@shared/validators';
import {
  UserSearchDTO,
  UpdateUserDTO,
  BulkUserActionDTO,
  SystemConfigDTO,
  MetricsQueryDTO,
  SystemHealthQueryDTO,
  ContentReviewDTO,
  BulkContentActionDTO,
  AuditLogQueryDTO,
  RevenueQueryDTO,
  RefundDTO,
  TicketStatsQueryDTO,
  FeatureUsageQueryDTO,
  CreateAnnouncementDTO,
  DataExportDTO
} from './admin.dto';
import { SystemConfigService } from './system-config.service';
import { SubscriptionService } from '@modules/billing/subscription.service';
import { BillingService } from '@modules/billing/billing.service';
import { TicketService } from '@modules/support/ticket.service';
import { FeatureService } from '@modules/features/feature.service';
import { AnnouncementService } from './announcement.service';
import { DataExportService, ExportOptions } from './data-export.service';

@Service()
export class AdminController {
  constructor(
    private adminUserService: AdminUserService,
    private adminMetricsService: AdminMetricsService,
    private adminModerationService: AdminModerationService,
    private auditService: AuditService,
    private systemConfigService: SystemConfigService,
    private subscriptionService: SubscriptionService,
    private billingService: BillingService,
    private ticketService: TicketService,
    private featureService: FeatureService,
    private announcementService: AnnouncementService,
    private dataExportService: DataExportService
  ) {}

  // ==================== USER MANAGEMENT ====================

  /**
   * Search and list users
   */
  async searchUsers(
    request: FastifyRequest<{ Querystring: UserSearchDTO }>,
    reply: FastifyReply
  ) {
    const filters = await validateSchema(UserSearchDTO.schema, request.query);
    const result = await this.adminUserService.searchUsers(filters);

    reply.send({ data: result });
  }

  /**
   * Get detailed user information
   */
  async getUserDetails(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;
    const user = await this.adminUserService.getUserDetails(userId);

    reply.send({ data: user });
  }

  /**
   * Update user information
   */
  async updateUser(
    request: FastifyRequest<{
      Params: { userId: string };
      Body: UpdateUserDTO;
    }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;
    const adminId = request.customUser!.id;
    const updates = await validateSchema(UpdateUserDTO.schema, request.body);

    const user = await this.adminUserService.updateUser(adminId, userId, updates);

    reply.send({
      message: 'User updated successfully',
      data: user
    });
  }

  /**
   * Perform bulk actions on users
   */
  async bulkUserAction(
    request: FastifyRequest<{ Body: BulkUserActionDTO }>,
    reply: FastifyReply
  ) {
    const adminId = request.customUser!.id;
    const dto = await validateSchema(BulkUserActionDTO.schema, request.body);

    const result = await this.adminUserService.bulkUserAction(
      adminId,
      dto.userIds,
      dto.action,
      {
        reason: dto.reason,
        notifyUsers: dto.notifyUsers
      }
    );

    reply.send({
      message: 'Bulk action completed',
      data: result
    });
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(request: FastifyRequest, reply: FastifyReply) {
    const stats = await this.adminUserService.getUserStatistics();
    reply.send({ data: stats });
  }

  /**
   * Get user activity timeline
   */
  async getUserActivity(
    request: FastifyRequest<{
      Params: { userId: string };
      Querystring: { days?: number };
    }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;
    const { days = 30 } = request.query;

    const activity = await this.adminUserService.getUserActivity(userId, days);
    reply.send({ data: activity });
  }

  /**
   * Impersonate user (for debugging)
   */
  async impersonateUser(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;
    const adminId = request.customUser!.id;

    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: 'user.impersonate',
      entity: 'user',
      entityId: userId,
      metadata: { impersonatedBy: adminId }
    });

    // Generate temporary token for impersonation
    // This would integrate with your auth system
    const token = 'temporary-impersonation-token';

    reply.send({
      message: 'Impersonation token generated',
      data: { token, expiresIn: 3600 }
    });
  }

  // ==================== SYSTEM METRICS ====================

  /**
   * Get comprehensive system metrics
   */
  async getSystemMetrics(
    request: FastifyRequest<{ Querystring: MetricsQueryDTO }>,
    reply: FastifyReply
  ) {
    const query = await validateSchema(MetricsQueryDTO.schema, request.query);

    const metrics = await this.adminMetricsService.getSystemMetrics(
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined
    );

    reply.send({ data: metrics });
  }

  /**
   * Get revenue metrics
   */
  async getRevenueMetrics(request: FastifyRequest, reply: FastifyReply) {
    const metrics = await this.adminMetricsService.getRevenueMetrics();
    reply.send({ data: metrics });
  }

  /**
   * Get usage metrics
   */
  async getUsageMetrics(
    request: FastifyRequest<{ Querystring: { days?: number } }>,
    reply: FastifyReply
  ) {
    const { days = 30 } = request.query;
    const metrics = await this.adminMetricsService.getUsageMetrics(days);
    reply.send({ data: metrics });
  }

  /**
   * Get system health status
   */
  async getSystemHealth(
    request: FastifyRequest<{ Querystring: SystemHealthQueryDTO }>,
    reply: FastifyReply
  ) {
    const query = await validateSchema(SystemHealthQueryDTO.schema, request.query);
    const health = await this.adminMetricsService.getHealthMetrics();
    reply.send({ data: health });
  }

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics(request: FastifyRequest, reply: FastifyReply) {
    const metrics = await this.adminMetricsService.getRealTimeMetrics();
    reply.send({ data: metrics });
  }

  // ==================== CONTENT MODERATION ====================

  /**
   * Review content
   */
  async reviewContent(
    request: FastifyRequest<{ Body: ContentReviewDTO }>,
    reply: FastifyReply
  ) {
    const adminId = request.customUser!.id;
    const dto = await validateSchema(ContentReviewDTO.schema, request.body);

    const result = await this.adminModerationService.reviewContent(
      adminId,
      dto.entityType,
      dto.entityId,
      dto.status as any,
      dto.reason,
      dto.notes
    );

    reply.send({
      message: 'Content reviewed successfully',
      data: result
    });
  }

  /**
   * Bulk content moderation
   */
  async bulkModerateContent(
    request: FastifyRequest<{ Body: BulkContentActionDTO }>,
    reply: FastifyReply
  ) {
    const adminId = request.customUser!.id;
    const dto = await validateSchema(BulkContentActionDTO.schema, request.body) as BulkContentActionDTO;

    // Ensure all items have required properties
    const validItems = dto.items.filter(item => item.entityType && item.entityId);

    if (validItems.length !== dto.items.length) {
      const invalidCount = dto.items.length - validItems.length;
      logger.warn(`Filtered out ${invalidCount} invalid items from bulk moderation request`);
    }

    const result = await this.adminModerationService.bulkModerate(
      adminId,
      validItems,
      dto.action,
      dto.reason
    );

    reply.send({
      message: 'Bulk moderation completed',
      data: result
    });
  }

  /**
   * Get content reports
   */
  async getContentReports(
    request: FastifyRequest<{
      Querystring: {
        status?: string;
        entityType?: string;
        page?: number;
        limit?: number;
      };
    }>,
    reply: FastifyReply
  ) {
    const reports = await this.adminModerationService.getContentReports(
      request.query,
      {
        page: request.query.page,
        limit: request.query.limit
      }
    );

    reply.send({ data: reports });
  }

  /**
   * Get moderation statistics
   */
  async getModerationStats(
    request: FastifyRequest<{
      Querystring: { startDate?: string; endDate?: string };
    }>,
    reply: FastifyReply
  ) {
    const stats = await this.adminModerationService.getModerationStats(
      request.query.startDate ? new Date(request.query.startDate) : undefined,
      request.query.endDate ? new Date(request.query.endDate) : undefined
    );

    reply.send({ data: stats });
  }

  /**
   * Get moderation rules
   */
  async getModerationRules(request: FastifyRequest, reply: FastifyReply) {
    const rules = this.adminModerationService.getModerationRules();
    reply.send({ data: rules });
  }

  /**
   * Update moderation rule
   */
  async updateModerationRule(
    request: FastifyRequest<{
      Params: { ruleId: string };
      Body: any;
    }>,
    reply: FastifyReply
  ) {
    const { ruleId } = request.params;
    const rule = await this.adminModerationService.updateModerationRule(
      ruleId,
      request.body
    );

    reply.send({
      message: 'Moderation rule updated',
      data: rule
    });
  }

  // ==================== SYSTEM CONFIGURATION ====================

  /**
   * Get system configuration
   */
  async getSystemConfig(request: FastifyRequest, reply: FastifyReply) {
    const config = await this.systemConfigService.getConfig();
    reply.send({ data: config });
  }

  /**
   * Update system configuration
   */
  async updateSystemConfig(
    request: FastifyRequest<{ Body: SystemConfigDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(SystemConfigDTO.schema, request.body);

    // Ensure maintenance.enabled is set if maintenance is provided
    if (dto.maintenance && dto.maintenance.enabled === undefined) {
      const currentConfig = await this.systemConfigService.getConfig();
      dto.maintenance.enabled = currentConfig.maintenance.enabled;
    }

    const config = await this.systemConfigService.updateConfig(dto as any);

    reply.send({
      message: 'System configuration updated',
      data: config
    });
  }

  // ==================== AUDIT LOGS ====================

  /**
   * Query audit logs
   */
  async getAuditLogs(
    request: FastifyRequest<{ Querystring: AuditLogQueryDTO }>,
    reply: FastifyReply
  ) {
    const query = await validateSchema(AuditLogQueryDTO.schema, request.query);

    const logs = await this.auditService.query(
      {
        userId: query.userId,
        action: query.action,
        entity: query.entity,
        entityId: query.entityId,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined
      },
      {
        page: query.page,
        limit: query.limit
      }
    );

    reply.send({ data: logs });
  }

  // ==================== REVENUE & BILLING ====================

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(
    request: FastifyRequest<{ Querystring: RevenueQueryDTO }>,
    reply: FastifyReply
  ) {
    const query = await validateSchema(RevenueQueryDTO.schema, request.query);
    // Implementation would connect to billing service
    reply.send({ data: {} });
  }

  /**
   * Process refund
   */
  async processRefund(
    request: FastifyRequest<{ Body: RefundDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(RefundDTO.schema, request.body);
    const adminId = request.customUser!.id;

    // Implementation would connect to billing service
    await this.auditService.log({
      userId: adminId,
      action: 'billing.refund',
      entity: 'subscription',
      entityId: dto.subscriptionId,
      metadata: dto
    });

    reply.send({ message: 'Refund processed successfully' });
  }

  // ==================== SUPPORT & TICKETS ====================

  /**
   * Get ticket statistics
   */
  async getTicketStats(
    request: FastifyRequest<{ Querystring: TicketStatsQueryDTO }>,
    reply: FastifyReply
  ) {
    const query = await validateSchema(TicketStatsQueryDTO.schema, request.query);
    // Implementation would connect to ticket service
    reply.send({ data: {} });
  }

  /**
   * Assign ticket to agent
   */
  async assignTicket(
    request: FastifyRequest<{
      Params: { ticketId: string };
      Body: { assigneeId: string };
    }>,
    reply: FastifyReply
  ) {
    const { ticketId } = request.params;
    const { assigneeId } = request.body;
    const adminId = request.customUser!.id;

    // Implementation would connect to ticket service
    reply.send({ message: 'Ticket assigned successfully' });
  }

  // ==================== FEATURE USAGE ====================

  /**
   * Get feature usage analytics
   */
  async getFeatureUsage(
    request: FastifyRequest<{ Querystring: FeatureUsageQueryDTO }>,
    reply: FastifyReply
  ) {
    const query = await validateSchema(FeatureUsageQueryDTO.schema, request.query);

    const stats = await this.featureService.getFeatureUsageStats(
      query.featureId!,
      {
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        tenantId: query.tenantId
      }
    );

    reply.send({ data: stats });
  }

  // ==================== ANNOUNCEMENTS ====================

  /**
   * Create system announcement
   */
  async createAnnouncement(
    request: FastifyRequest<{ Body: CreateAnnouncementDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(CreateAnnouncementDTO.schema, request.body) as CreateAnnouncementDTO;
    const adminId = request.customUser!.id;

    // Ensure required fields are set
    dto.createdBy = adminId;

    // Create a properly typed announcement object
    const announcementData = {
      title: dto.title,
      content: dto.content,
      type: dto.type,
      targetAudience: dto.targetAudience || 'all',
      targetUserIds: dto.targetUserIds,
      targetTenantIds: dto.targetTenantIds,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      dismissible: dto.dismissible ?? true,
      createdBy: adminId
    };

    const announcement = await this.announcementService.create(announcementData);

    reply.send({
      message: 'Announcement created successfully',
      data: announcement
    });
  }

  /**
   * Get active announcements
   */
  async getAnnouncements(request: FastifyRequest, reply: FastifyReply) {
    const announcements = await this.announcementService.getActive();
    reply.send({ data: announcements });
  }

  // ==================== DATA EXPORT ====================

  /**
   * Export data
   */
  async exportData(
    request: FastifyRequest<{ Body: DataExportDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(DataExportDTO.schema, request.body) as DataExportDTO;
    const adminId = request.customUser!.id;

    // Create a properly typed export options object
    const exportOptions: ExportOptions = {
      entityType: dto.entityType,
      format: dto.format,
      filters: dto.filters,
      dateRange: dto.dateRange,
      includeRelations: dto.includeRelations,
      fields: dto.fields,
      limit: dto.limit,
      async: dto.async,
      recipientEmail: dto.recipientEmail
    };

    const exportResult = await this.dataExportService.export(exportOptions);

    await this.auditService.log({
      userId: adminId,
      action: 'data.export',
      entity: dto.entityType,
      metadata: {
        format: dto.format,
        filters: dto.filters
      }
    });

    reply.send({
      message: 'Export initiated',
      data: exportResult
    });
  }

  // ==================== COMPLIANCE ====================

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    request: FastifyRequest<{
      Querystring: { startDate: string; endDate: string };
    }>,
    reply: FastifyReply
  ) {
    const { startDate, endDate } = request.query;

    const report = await this.adminModerationService.generateComplianceReport(
      new Date(startDate),
      new Date(endDate)
    );

    reply.send({ data: report });
  }

  /**
   * Handle GDPR request
   */
  async handleGDPRRequest(
    request: FastifyRequest<{
      Body: {
        userId: string;
        requestType: 'access' | 'deletion' | 'portability';
      };
    }>,
    reply: FastifyReply
  ) {
    const { userId, requestType } = request.body;
    const adminId = request.customUser!.id;

    const result = await this.adminModerationService.handleDataRequest(
      userId,
      requestType
    );

    await this.auditService.log({
      userId: adminId,
      action: `gdpr.${requestType}`,
      entity: 'user',
      entityId: userId
    });

    reply.send({
      message: 'GDPR request processed',
      data: result
    });
  }
}
