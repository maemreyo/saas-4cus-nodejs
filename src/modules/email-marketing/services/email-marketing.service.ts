// Main orchestration service for email marketing operations

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { logger } from '@/shared/logger';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { EmailListService } from './email-list.service';
import { EmailCampaignService } from './email-campaign.service';
import { EmailAutomationService } from './email-automation.service';
import { EmailAnalyticsService } from './email-analytics.service';
import { EmailDeliveryService } from './email-delivery.service';
import { EmailSegmentService } from './email-segment.service';
import { EmailTemplateService } from './email-template.service';
import { AppError } from '@/shared/exceptions';
import { EmailListStatus, EmailCampaignStatus, EmailCampaignType, EmailDeliveryStatus } from '@prisma/client';

export interface EmailMarketingStats {
  totalLists: number;
  totalSubscribers: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalAutomations: number;
  activeAutomations: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}

export interface EmailMarketingDashboard {
  stats: EmailMarketingStats;
  recentCampaigns: any[];
  topPerformingCampaigns: any[];
  subscriberGrowth: any[];
  engagementTrends: any[];
}

@Injectable()
export class EmailMarketingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly redis: RedisService,
    private readonly listService: EmailListService,
    private readonly campaignService: EmailCampaignService,
    private readonly automationService: EmailAutomationService,
    private readonly analyticsService: EmailAnalyticsService,
    private readonly deliveryService: EmailDeliveryService,
    private readonly segmentService: EmailSegmentService,
    private readonly templateService: EmailTemplateService,
  ) {}

  /**
   * Get comprehensive email marketing dashboard data
   */
  async getDashboard(tenantId: string): Promise<EmailMarketingDashboard> {
    const cacheKey = `email-marketing:dashboard:${tenantId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const [stats, recentCampaigns, topPerformingCampaigns, subscriberGrowth, engagementTrends] = await Promise.all([
      this.getStats(tenantId),
      this.getRecentCampaigns(tenantId),
      this.getTopPerformingCampaigns(tenantId),
      this.analyticsService.getSubscriberGrowth(tenantId, 30),
      this.analyticsService.getEngagementTrends(tenantId, 30),
    ]);

    const dashboard: EmailMarketingDashboard = {
      stats,
      recentCampaigns,
      topPerformingCampaigns,
      subscriberGrowth,
      engagementTrends,
    };

    // Cache for 5 minutes
    await this.redis.set(cacheKey, dashboard, { ttl: 300 });

    return dashboard;
  }

  /**
   * Get overall email marketing statistics
   */
  async getStats(tenantId: string): Promise<EmailMarketingStats> {
    const [lists, campaigns, automations, overallStats] = await Promise.all([
      // Count lists and subscribers
      this.prisma.client.$transaction([
        this.prisma.client.emailList.count({
          where: { tenantId, deletedAt: null },
        }),
        this.prisma.client.emailListSubscriber.count({
          where: {
            list: { tenantId },
            subscribed: true,
            confirmed: true,
          },
        }),
      ]),

      // Count campaigns
      this.prisma.client.$transaction([
        this.prisma.client.emailCampaign.count({
          where: { tenantId },
        }),
        this.prisma.client.emailCampaign.count({
          where: {
            tenantId,
            status: EmailCampaignStatus.SENDING,
          },
        }),
      ]),

      // Count automations
      this.prisma.client.$transaction([
        this.prisma.client.emailAutomation.count({
          where: { tenantId },
        }),
        this.prisma.client.emailAutomation.count({
          where: {
            tenantId,
            active: true,
          },
        }),
      ]),

      // Get aggregate stats
      this.prisma.client.emailCampaignStats.aggregate({
        where: {
          campaign: { tenantId },
        },
        _avg: {
          deliveryRate: true,
          openRate: true,
          clickRate: true,
          unsubscribeRate: true,
        },
      }),
    ]);

    return {
      totalLists: lists[0],
      totalSubscribers: lists[1],
      totalCampaigns: campaigns[0],
      activeCampaigns: campaigns[1],
      totalAutomations: automations[0],
      activeAutomations: automations[1],
      deliveryRate: overallStats._avg.deliveryRate || 0,
      openRate: overallStats._avg.openRate || 0,
      clickRate: overallStats._avg.clickRate || 0,
      unsubscribeRate: overallStats._avg.unsubscribeRate || 0,
    };
  }

  /**
   * Get recent campaigns
   */
  async getRecentCampaigns(tenantId: string, limit: number = 10): Promise<any[]> {
    return this.prisma.client.emailCampaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        stats: true,
        _count: {
          select: {
            recipients: true,
          },
        },
      },
    });
  }

  /**
   * Get top performing campaigns
   */
  async getTopPerformingCampaigns(tenantId: string, limit: number = 10): Promise<any[]> {
    return this.prisma.client.emailCampaign.findMany({
      where: {
        tenantId,
        status: EmailCampaignStatus.SENT,
      },
      include: {
        stats: {
          orderBy: [{ clickRate: 'desc' }, { openRate: 'desc' }],
        },
      },
      take: limit,
    });
  }

  /**
   * Send test email for a campaign
   */
  async sendTestEmail(tenantId: string, campaignId: string, recipientEmail: string): Promise<void> {
    const campaign = await this.campaignService.getCampaign(tenantId, campaignId);

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    await this.deliveryService.sendTestEmail(campaign, recipientEmail);

    await this.eventBus.emit('email.test.sent', {
      tenantId,
      campaignId,
      recipientEmail,
      timestamp: new Date(),
    });
  }

  /**
   * Preview email content with personalization
   */
  async previewEmail(
    tenantId: string,
    campaignId: string,
    subscriberId?: string,
  ): Promise<{ subject: string; html: string; text?: string }> {
    const campaign = await this.campaignService.getCampaign(tenantId, campaignId);

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    let subscriber = null;
    if (subscriberId) {
      subscriber = await this.prisma.client.emailListSubscriber.findFirst({
        where: {
          id: subscriberId,
          list: { tenantId },
        },
      });
    }

    return this.deliveryService.renderEmail(campaign, subscriber);
  }

  /**
   * Validate email content
   */
  async validateEmailContent(
    html: string,
    text?: string,
  ): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    spamScore?: number;
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required elements
    if (!html.includes('<html') || !html.includes('</html>')) {
      errors.push('HTML content must include <html> tags');
    }

    if (!html.includes('<body') || !html.includes('</body>')) {
      errors.push('HTML content must include <body> tags');
    }

    // Check for unsubscribe link
    if (!html.includes('{{unsubscribe_url}}') && !html.includes('unsubscribe')) {
      errors.push('Email must include an unsubscribe link');
    }

    // Check for tracking pixel
    if (html.includes('{{tracking_pixel}}')) {
      warnings.push('Tracking pixel detected - ensure GDPR compliance');
    }

    // Check content length
    if (html.length > 102400) {
      // 100KB
      warnings.push('Email content is large and may be clipped by email clients');
    }

    // Check for common spam triggers
    const spamTriggers = [/free money/i, /click here now/i, /limited time offer/i, /act now/i, /100% guaranteed/i];

    let spamScore = 0;
    for (const trigger of spamTriggers) {
      if (trigger.test(html) || (text && trigger.test(text))) {
        warnings.push(`Potential spam trigger detected: ${trigger.source}`);
        spamScore += 0.5;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      spamScore,
    };
  }

  /**
   * Get email marketing health status
   */
  async getHealthStatus(tenantId: string): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check delivery rates
    const stats = await this.getStats(tenantId);

    if (stats.deliveryRate < 0.95) {
      issues.push('Low delivery rate detected');
      recommendations.push('Review your sender reputation and email authentication');
    }

    if (stats.openRate < 0.15) {
      issues.push('Low open rate detected');
      recommendations.push('Improve subject lines and sender name recognition');
    }

    if (stats.clickRate < 0.02) {
      issues.push('Low click rate detected');
      recommendations.push('Improve email content and call-to-action buttons');
    }

    if (stats.unsubscribeRate > 0.02) {
      issues.push('High unsubscribe rate detected');
      recommendations.push('Review email frequency and content relevance');
    }

    // Check bounces
    const recentBounces = await this.prisma.client.emailCampaignRecipient.count({
      where: {
        campaign: { tenantId },
        status: EmailDeliveryStatus.BOUNCED,
        bouncedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    if (recentBounces > 100) {
      issues.push('High bounce rate detected');
      recommendations.push('Clean your email list and remove invalid addresses');
    }

    const status = issues.length === 0 ? 'healthy' : issues.length <= 2 ? 'warning' : 'critical';

    return {
      status,
      issues,
      recommendations,
    };
  }

  /**
   * Export email marketing data
   */
  async exportData(
    tenantId: string,
    options: {
      includeSubscribers?: boolean;
      includeCampaigns?: boolean;
      includeAnalytics?: boolean;
      format?: 'json' | 'csv';
      dateFrom?: Date;
      dateTo?: Date;
    },
  ): Promise<Buffer> {
    const data: any = {
      exportDate: new Date(),
      tenant: tenantId,
    };

    if (options.includeSubscribers) {
      data.subscribers = await this.prisma.client.emailListSubscriber.findMany({
        where: {
          list: { tenantId },
          subscribedAt: {
            gte: options.dateFrom,
            lte: options.dateTo,
          },
        },
        include: {
          list: {
            select: {
              name: true,
            },
          },
        },
      });
    }

    if (options.includeCampaigns) {
      data.campaigns = await this.prisma.client.emailCampaign.findMany({
        where: {
          tenantId,
          createdAt: {
            gte: options.dateFrom,
            lte: options.dateTo,
          },
        },
        include: {
          stats: true,
        },
      });
    }

    if (options.includeAnalytics) {
      data.analytics = await this.analyticsService.getComprehensiveAnalytics(
        tenantId,
        options.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        options.dateTo || new Date(),
      );
    }

    // Convert to requested format
    if (options.format === 'csv') {
      // Implementation would use a CSV library
      throw new AppError('CSV export not yet implemented', 501);
    }

    return Buffer.from(JSON.stringify(data, null, 2));
  }
}
