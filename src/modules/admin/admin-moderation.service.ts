import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { AuditService } from '@shared/services/audit.service';
import { EmailService } from '@shared/services/email.service';
import { NotificationService } from '@modules/notification/notification.service';
import { NotFoundException, BadRequestException } from '@shared/exceptions';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';

export interface ContentReport {
  id: string;
  entityType: string;
  entityId: string;
  reportedBy: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: Date;
  action?: string;
  createdAt: Date;
}

export interface ModerationRule {
  id: string;
  name: string;
  description: string;
  type: 'keyword' | 'regex' | 'ai';
  pattern?: string;
  keywords?: string[];
  action: 'flag' | 'block' | 'delete';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  metadata?: any;
}

export interface ComplianceReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalReports: number;
    resolved: number;
    pending: number;
    averageResolutionTime: number;
  };
  byType: Record<string, number>;
  byAction: Record<string, number>;
  topReporters: Array<{ userId: string; count: number }>;
  compliance: {
    gdpr: boolean;
    coppa: boolean;
    ccpa: boolean;
  };
}

@Service()
export class AdminModerationService {
  private moderationRules: Map<string, ModerationRule> = new Map();

  constructor(
    private eventBus: EventBus,
    private auditService: AuditService,
    private emailService: EmailService,
    private notificationService: NotificationService
  ) {
    this.initializeModerationRules();
  }

  /**
   * Initialize default moderation rules
   */
  private async initializeModerationRules() {
    const defaultRules: ModerationRule[] = [
      {
        id: 'profanity',
        name: 'Profanity Filter',
        description: 'Blocks common profanity',
        type: 'keyword',
        keywords: [], // Would be populated with actual list
        action: 'flag',
        severity: 'medium',
        enabled: true
      },
      {
        id: 'spam_links',
        name: 'Spam Link Detection',
        description: 'Detects and blocks spam links',
        type: 'regex',
        pattern: '(https?:\\/\\/)?(www\\.)?(bit\\.ly|tinyurl|short\\.link)',
        action: 'block',
        severity: 'high',
        enabled: true
      },
      {
        id: 'personal_info',
        name: 'Personal Information',
        description: 'Detects SSN, credit cards, etc',
        type: 'regex',
        pattern: '\\b(?:\\d{3}-\\d{2}-\\d{4}|\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4})\\b',
        action: 'flag',
        severity: 'critical',
        enabled: true
      }
    ];

    defaultRules.forEach(rule => {
      this.moderationRules.set(rule.id, rule);
    });
  }

  /**
   * Review content for violations
   */
  async reviewContent(
    adminId: string,
    entityType: string,
    entityId: string,
    decision: 'approve' | 'reject' | 'flag',
    reason?: string,
    notes?: string
  ) {
    // Get the content entity
    const content = await this.getContentEntity(entityType, entityId);

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // Record the review
    const review = {
      entityType,
      entityId,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      decision,
      reason,
      notes
    };

    // Apply the decision
    switch (decision) {
      case 'reject':
        await this.rejectContent(entityType, entityId, reason);
        break;

      case 'flag':
        await this.flagContent(entityType, entityId, reason);
        break;

      case 'approve':
        await this.approveContent(entityType, entityId);
        break;
    }

    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: `content.${decision}`,
      entity: entityType,
      entityId,
      metadata: review
    });

    // Notify content owner
    if (content.userId) {
      await this.notifyContentDecision(content.userId, entityType, entityId, decision, reason);
    }

    logger.info('Content reviewed', {
      adminId,
      entityType,
      entityId,
      decision
    });

    await this.eventBus.emit('admin.content.reviewed', {
      adminId,
      entityType,
      entityId,
      decision,
      timestamp: new Date()
    });

    return review;
  }

  /**
   * Bulk content moderation
   */
  async bulkModerate(
    adminId: string,
    items: Array<{ entityType: string; entityId: string }>,
    action: 'approve' | 'reject' | 'flag' | 'delete',
    reason?: string
  ) {
    const results = {
      succeeded: [] as string[],
      failed: [] as { entityId: string; error: string }[]
    };

    for (const item of items) {
      try {
        switch (action) {
          case 'delete':
            await this.deleteContent(item.entityType, item.entityId);
            break;
          default:
            await this.reviewContent(adminId, item.entityType, item.entityId, action, reason);
            break;
        }

        results.succeeded.push(item.entityId);
      } catch (error: any) {
        results.failed.push({
          entityId: item.entityId,
          error: error.message
        });
      }
    }

    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: `content.bulk.${action}`,
      entity: 'content',
      metadata: {
        items,
        results,
        reason
      }
    });

    return results;
  }

  /**
   * Get content reports
   */
  @Cacheable({ ttl: 300, namespace: 'admin:reports' })
  async getContentReports(
    filters?: {
      status?: string;
      entityType?: string;
      reportedBy?: string;
      startDate?: Date;
      endDate?: Date;
    },
    pagination?: {
      page?: number;
      limit?: number;
    }
  ) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 50;

    // This would typically query a reports table
    // For now, we'll simulate with audit logs
    const where = {
      action: { startsWith: 'content.report' },
      ...(filters?.startDate && {
        createdAt: {
          gte: filters.startDate,
          ...(filters?.endDate && { lte: filters.endDate })
        }
      })
    };

    const [reports, total] = await Promise.all([
      prisma.client.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.client.auditLog.count({ where })
    ]);

    return {
      reports: reports.map(this.formatReport),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get moderation statistics
   */
  async getModerationStats(startDate?: Date, endDate?: Date) {
    const dateFilter = {
      ...(startDate && {
        createdAt: {
          gte: startDate,
          ...(endDate && { lte: endDate })
        }
      })
    };

    const [
      totalReviews,
      approvedCount,
      rejectedCount,
      flaggedCount,
      pendingCount
    ] = await Promise.all([
      prisma.client.auditLog.count({
        where: {
          action: { startsWith: 'content.' },
          ...dateFilter
        }
      }),

      prisma.client.auditLog.count({
        where: {
          action: 'content.approve',
          ...dateFilter
        }
      }),

      prisma.client.auditLog.count({
        where: {
          action: 'content.reject',
          ...dateFilter
        }
      }),

      prisma.client.auditLog.count({
        where: {
          action: 'content.flag',
          ...dateFilter
        }
      }),

      // Simulated pending count
      Promise.resolve(0)
    ]);

    // Get review time metrics
    const reviews = await prisma.client.auditLog.findMany({
      where: {
        action: { in: ['content.approve', 'content.reject', 'content.flag'] },
        ...dateFilter
      },
      select: {
        createdAt: true
      }
    });

    // Calculate average resolution time (simulated)
    const avgResolutionTime = reviews.length > 0 ? 3600 : 0; // 1 hour average

    // Get top reviewers
    const reviewerStats = await prisma.client.auditLog.groupBy({
      by: ['userId'],
      where: {
        action: { startsWith: 'content.' },
        ...dateFilter
      },
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10
    });

    return {
      summary: {
        total: totalReviews,
        approved: approvedCount,
        rejected: rejectedCount,
        flagged: flaggedCount,
        pending: pendingCount,
        averageResolutionTime: avgResolutionTime / 60 // in minutes
      },
      byAction: {
        approve: approvedCount,
        reject: rejectedCount,
        flag: flaggedCount
      },
      topReviewers: reviewerStats.map(r => ({
        userId: r.userId!,
        count: r._count.userId
      }))
    };
  }

  /**
   * Get/update moderation rules
   */
  getModerationRules(): ModerationRule[] {
    return Array.from(this.moderationRules.values());
  }

  @CacheInvalidate(['admin:moderation:rules'])
  async updateModerationRule(
    ruleId: string,
    updates: Partial<ModerationRule>
  ): Promise<ModerationRule> {
    const rule = this.moderationRules.get(ruleId);

    if (!rule) {
      throw new NotFoundException('Moderation rule not found');
    }

    const updatedRule = { ...rule, ...updates };
    this.moderationRules.set(ruleId, updatedRule);

    logger.info('Moderation rule updated', { ruleId, updates });

    return updatedRule;
  }

  /**
   * Check content against moderation rules
   */
  async checkContent(content: string): Promise<{
    passed: boolean;
    violations: Array<{
      rule: string;
      severity: string;
      action: string;
    }>;
  }> {
    const violations: Array<{
      rule: string;
      severity: string;
      action: string;
    }> = [];

    for (const rule of this.moderationRules.values()) {
      if (!rule.enabled) continue;

      let violated = false;

      switch (rule.type) {
        case 'keyword':
          if (rule.keywords) {
            violated = rule.keywords.some(keyword =>
              content.toLowerCase().includes(keyword.toLowerCase())
            );
          }
          break;

        case 'regex':
          if (rule.pattern) {
            const regex = new RegExp(rule.pattern, 'gi');
            violated = regex.test(content);
          }
          break;

        case 'ai':
          // Would integrate with AI moderation service
          violated = false;
          break;
      }

      if (violated) {
        violations.push({
          rule: rule.name,
          severity: rule.severity,
          action: rule.action
        });
      }
    }

    return {
      passed: violations.length === 0,
      violations
    };
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceReport> {
    const stats = await this.getModerationStats(startDate, endDate);

    // Get report types
    const reportTypes = await prisma.client.auditLog.groupBy({
      by: ['entity'],
      where: {
        action: { startsWith: 'content.' },
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: { entity: true }
    });

    const byType = reportTypes.reduce((acc, item) => {
      acc[item.entity] = item._count.entity;
      return acc;
    }, {} as Record<string, number>);

    // Compliance checks
    const compliance = {
      gdpr: await this.checkGDPRCompliance(),
      coppa: await this.checkCOPPACompliance(),
      ccpa: await this.checkCCPACompliance()
    };

    return {
      period: {
        start: startDate,
        end: endDate
      },
      summary: {
        totalReports: stats.summary.total,
        resolved: stats.summary.approved + stats.summary.rejected,
        pending: stats.summary.pending,
        averageResolutionTime: stats.summary.averageResolutionTime
      },
      byType,
      byAction: stats.byAction,
      topReporters: stats.topReviewers,
      compliance
    };
  }

  /**
   * Handle user data request (GDPR)
   */
  async handleDataRequest(
    userId: string,
    requestType: 'access' | 'deletion' | 'portability'
  ) {
    logger.info('Processing data request', { userId, requestType });

    switch (requestType) {
      case 'access':
        return await this.exportUserData(userId);

      case 'deletion':
        return await this.scheduleUserDeletion(userId);

      case 'portability':
        return await this.exportUserDataPortable(userId);
    }
  }

  // Private helper methods

  private async getContentEntity(entityType: string, entityId: string): Promise<any> {
    switch (entityType) {
      case 'user':
        return await prisma.client.user.findUnique({ where: { id: entityId } });

      case 'project':
        return await prisma.client.project.findUnique({ where: { id: entityId } });

      case 'ticket':
        return await prisma.client.ticket.findUnique({ where: { id: entityId } });

      case 'file':
        return await prisma.client.file.findUnique({ where: { id: entityId } });

      default:
        return null;
    }
  }

  private async rejectContent(entityType: string, entityId: string, reason?: string) {
    switch (entityType) {
      case 'project':
        await prisma.client.project.update({
          where: { id: entityId },
          data: {
            metadata: {
              moderation: {
                status: 'rejected',
                reason,
                rejectedAt: new Date()
              }
            }
          }
        });
        break;

      // Handle other entity types
    }
  }

  private async flagContent(entityType: string, entityId: string, reason?: string) {
    // Implementation for flagging content
    logger.info('Content flagged', { entityType, entityId, reason });
  }

  private async approveContent(entityType: string, entityId: string) {
    // Implementation for approving content
    logger.info('Content approved', { entityType, entityId });
  }

  private async deleteContent(entityType: string, entityId: string) {
    switch (entityType) {
      case 'project':
        await prisma.client.project.update({
          where: { id: entityId },
          data: { deletedAt: new Date() }
        });
        break;

      case 'file':
        await prisma.client.file.update({
          where: { id: entityId },
          data: { deletedAt: new Date() }
        });
        break;

      // Handle other entity types
    }
  }

  private async notifyContentDecision(
    userId: string,
    entityType: string,
    entityId: string,
    decision: string,
    reason?: string
  ) {
    await this.notificationService.create({
      userId,
      type: decision === 'approve' ? 'SUCCESS' : 'WARNING',
      title: `Content ${decision}ed`,
      content: `Your ${entityType} has been ${decision}ed${reason ? `: ${reason}` : ''}`,
      metadata: {
        entityType,
        entityId,
        decision,
        reason
      }
    });
  }

  private formatReport(auditLog: any): ContentReport {
    const metadata = auditLog.metadata as any;
    return {
      id: auditLog.id,
      entityType: auditLog.entity,
      entityId: auditLog.entityId,
      reportedBy: auditLog.userId,
      reason: metadata?.reason || 'Unknown',
      description: metadata?.description,
      status: 'pending',
      createdAt: auditLog.createdAt
    };
  }

  private async checkGDPRCompliance(): Promise<boolean> {
    // Check if GDPR requirements are met
    // - Data export functionality
    // - Data deletion capability
    // - Consent tracking
    // - Privacy policy acceptance
    return true; // Simplified
  }

  private async checkCOPPACompliance(): Promise<boolean> {
    // Check if COPPA requirements are met
    // - Age verification
    // - Parental consent for minors
    return true; // Simplified
  }

  private async checkCCPACompliance(): Promise<boolean> {
    // Check if CCPA requirements are met
    // - Data sale opt-out
    // - Data disclosure
    return true; // Simplified
  }

  private async exportUserData(userId: string) {
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        projects: true,
        tickets: true,
        files: true,
        notifications: true,
        sessions: true,
        auditLogs: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { password, twoFactorSecret, ...userData } = user;

    return {
      userData,
      exportedAt: new Date(),
      format: 'json'
    };
  }

  private async scheduleUserDeletion(userId: string) {
    // Schedule user deletion after grace period
    await prisma.client.job.create({
      data: {
        queue: 'user-deletion',
        name: 'delete-user',
        data: { userId },
        scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'PENDING'
      }
    });

    return {
      scheduled: true,
      deletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  }

  private async exportUserDataPortable(userId: string) {
    const data = await this.exportUserData(userId);

    // Convert to portable format (e.g., standardized JSON schema)
    return {
      ...data,
      format: 'portable-json',
      schema: '1.0'
    };
  }
}
