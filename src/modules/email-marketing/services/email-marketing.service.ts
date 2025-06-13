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
        stats: true,
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

  /**
   * Get delivery rates over time
   */
  async getDeliveryRates(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
    interval: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<any[]> {
    // Default to last 30 days if no dates provided
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    // This would typically involve complex database queries with time-based grouping
    // For simplicity, we'll return a mock implementation
    const mockData = [];
    const intervalMillis =
      interval === 'hourly' ? 60 * 60 * 1000 :
      interval === 'daily' ? 24 * 60 * 60 * 1000 :
      interval === 'weekly' ? 7 * 24 * 60 * 60 * 1000 :
      30 * 24 * 60 * 60 * 1000;

    for (let time = start.getTime(); time <= end.getTime(); time += intervalMillis) {
      mockData.push({
        date: new Date(time),
        sent: Math.floor(Math.random() * 1000) + 500,
        delivered: Math.floor(Math.random() * 900) + 400,
        bounced: Math.floor(Math.random() * 50),
        deliveryRate: 0.95 + (Math.random() * 0.05 - 0.025)
      });
    }

    return mockData;
  }

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
    segmentBy?: 'campaign' | 'list' | 'automation'
  ): Promise<any> {
    // Default to last 30 days if no dates provided
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    // This would typically involve complex database queries with aggregations
    // For simplicity, we'll return a mock implementation
    if (segmentBy === 'campaign') {
      return {
        bySegment: [
          { name: 'Welcome Series', opens: 2450, clicks: 890, unsubscribes: 12 },
          { name: 'Monthly Newsletter', opens: 1850, clicks: 620, unsubscribes: 8 },
          { name: 'Product Announcement', opens: 3200, clicks: 1540, unsubscribes: 15 },
        ],
        overall: {
          totalSent: 10000,
          totalOpens: 7500,
          totalClicks: 3050,
          totalUnsubscribes: 35,
          openRate: 0.75,
          clickRate: 0.305,
          clickToOpenRate: 0.407,
          unsubscribeRate: 0.0035
        }
      };
    } else if (segmentBy === 'list') {
      return {
        bySegment: [
          { name: 'Main Subscribers', opens: 4200, clicks: 1850, unsubscribes: 18 },
          { name: 'New Customers', opens: 1950, clicks: 720, unsubscribes: 5 },
          { name: 'Prospects', opens: 1350, clicks: 480, unsubscribes: 12 },
        ],
        overall: {
          totalSent: 10000,
          totalOpens: 7500,
          totalClicks: 3050,
          totalUnsubscribes: 35,
          openRate: 0.75,
          clickRate: 0.305,
          clickToOpenRate: 0.407,
          unsubscribeRate: 0.0035
        }
      };
    } else {
      // Default overall metrics
      return {
        overall: {
          totalSent: 10000,
          totalOpens: 7500,
          totalClicks: 3050,
          totalUnsubscribes: 35,
          openRate: 0.75,
          clickRate: 0.305,
          clickToOpenRate: 0.407,
          unsubscribeRate: 0.0035
        },
        timeSeriesData: [
          { date: new Date(start.getTime() + 1000000), opens: 250, clicks: 90 },
          { date: new Date(start.getTime() + 2000000), opens: 320, clicks: 110 },
          { date: new Date(start.getTime() + 3000000), opens: 280, clicks: 95 },
          // More time series data would be here
        ]
      };
    }
  }

  /**
   * Get sender reputation score
   */
  async getReputationScore(tenantId: string): Promise<{
    overall: number;
    components: {
      deliverability: number;
      engagement: number;
      compliance: number;
      infrastructure: number;
    };
    issues: string[];
    recommendations: string[];
  }> {
    // This would typically involve checking various reputation factors
    // For simplicity, we'll return a mock implementation
    const stats = await this.getStats(tenantId);

    const deliverability = Math.min(100, stats.deliveryRate * 100);
    const engagement = Math.min(100, (stats.openRate * 0.5 + stats.clickRate * 0.5) * 200);
    const compliance = 95; // Mock value
    const infrastructure = 90; // Mock value

    const overall = Math.round((deliverability * 0.4 + engagement * 0.3 + compliance * 0.2 + infrastructure * 0.1));

    const issues = [];
    const recommendations = [];

    if (deliverability < 95) {
      issues.push('Deliverability issues detected');
      recommendations.push('Improve email authentication with DKIM, SPF, and DMARC');
    }

    if (engagement < 70) {
      issues.push('Low engagement metrics');
      recommendations.push('Improve email content and targeting');
    }

    return {
      overall,
      components: {
        deliverability,
        engagement,
        compliance,
        infrastructure
      },
      issues,
      recommendations
    };
  }

  /**
   * Get sender domains
   */
  async getSenderDomains(tenantId: string): Promise<{
    domains: {
      domain: string;
      status: 'verified' | 'pending' | 'failed';
      dkim: boolean;
      spf: boolean;
      dmarc: boolean;
      isDefault: boolean;
      createdAt: Date;
    }[];
  }> {
    // This would typically involve querying the database for sender domains
    // For simplicity, we'll return a mock implementation
    return {
      domains: [
        {
          domain: 'example.com',
          status: 'verified',
          dkim: true,
          spf: true,
          dmarc: true,
          isDefault: true,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          domain: 'marketing.example.com',
          status: 'verified',
          dkim: true,
          spf: true,
          dmarc: false,
          isDefault: false,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          domain: 'new.example.com',
          status: 'pending',
          dkim: false,
          spf: true,
          dmarc: false,
          isDefault: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ]
    };
  }

  /**
   * Verify sender domain
   */
  async verifySenderDomain(tenantId: string, domain: string): Promise<{
    success: boolean;
    domain: string;
    verificationRecords: {
      type: 'TXT' | 'MX' | 'CNAME';
      host: string;
      value: string;
      status: 'verified' | 'pending' | 'failed';
    }[];
    nextSteps?: string[];
  }> {
    // This would typically involve checking DNS records for the domain
    // For simplicity, we'll return a mock implementation

    // Simulate a verification process
    const isVerified = Math.random() > 0.3;

    return {
      success: isVerified,
      domain,
      verificationRecords: [
        {
          type: 'TXT',
          host: `_dkim.${domain}`,
          value: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrLHiExVd55zd/IQ/J',
          status: isVerified ? 'verified' : 'pending'
        },
        {
          type: 'TXT',
          host: domain,
          value: 'v=spf1 include:_spf.example.com ~all',
          status: 'verified'
        },
        {
          type: 'TXT',
          host: `_dmarc.${domain}`,
          value: 'v=DMARC1; p=none; rua=mailto:dmarc@example.com',
          status: Math.random() > 0.5 ? 'verified' : 'pending'
        }
      ],
      nextSteps: isVerified ? [] : [
        'Add the missing DNS records to your domain',
        'Wait for DNS propagation (up to 48 hours)',
        'Re-verify the domain'
      ]
    };
  }

  /**
   * Get suppression list
   */
  async getSuppressionList(
    tenantId: string,
    options: {
      page?: number;
      limit?: number;
      reason?: 'bounce' | 'complaint' | 'unsubscribe' | 'manual';
    }
  ): Promise<{
    items: {
      email: string;
      reason: 'bounce' | 'complaint' | 'unsubscribe' | 'manual';
      createdAt: Date;
      source?: string;
      note?: string;
    }[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    // This would typically involve querying the database for suppressed emails
    // For simplicity, we'll return a mock implementation
    const { page = 1, limit = 50, reason } = options;

    // Generate mock data
    const mockItems = [];
    const total = 120; // Mock total count

    for (let i = 0; i < Math.min(limit, total - (page - 1) * limit); i++) {
      const itemReason = reason || ['bounce', 'complaint', 'unsubscribe', 'manual'][Math.floor(Math.random() * 4)] as any;
      mockItems.push({
        email: `user${(page - 1) * limit + i}@example.com`,
        reason: itemReason,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        source: itemReason === 'manual' ? 'User' : 'System',
        note: itemReason === 'manual' ? 'Added manually by admin' : undefined
      });
    }

    return {
      items: mockItems,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Add email to suppression list
   */
  async addToSuppressionList(
    tenantId: string,
    email: string,
    reason: 'bounce' | 'complaint' | 'unsubscribe' | 'manual',
    note?: string
  ): Promise<void> {
    // This would typically involve adding the email to a suppression list in the database
    // For simplicity, we'll just log the action
    logger.info(`Added ${email} to suppression list for tenant ${tenantId} with reason: ${reason}`);

    // Emit event for tracking
    await this.eventBus.emit('email.suppression.added', {
      tenantId,
      email,
      reason,
      note,
      timestamp: new Date()
    });
  }

  /**
   * Remove email from suppression list
   */
  async removeFromSuppressionList(tenantId: string, email: string): Promise<void> {
    // This would typically involve removing the email from a suppression list in the database
    // For simplicity, we'll just log the action
    logger.info(`Removed ${email} from suppression list for tenant ${tenantId}`);

    // Emit event for tracking
    await this.eventBus.emit('email.suppression.removed', {
      tenantId,
      email,
      timestamp: new Date()
    });
  }

  /**
   * Get usage limits
   */
  async getUsageLimits(tenantId: string): Promise<{
    plan: {
      name: string;
      monthlyEmailLimit: number;
      dailyEmailLimit: number;
      maxSubscribers: number;
      maxLists: number;
      features: string[];
    };
    currentUsage: {
      monthlyEmailsSent: number;
      dailyEmailsSent: number;
      totalSubscribers: number;
      totalLists: number;
    };
    percentages: {
      monthlyEmails: number;
      dailyEmails: number;
      subscribers: number;
      lists: number;
    };
  }> {
    // This would typically involve checking the tenant's plan and usage
    // For simplicity, we'll return a mock implementation

    // Get actual counts for subscribers and lists
    const stats = await this.getStats(tenantId);

    // Mock plan details
    const plan = {
      name: 'Business',
      monthlyEmailLimit: 50000,
      dailyEmailLimit: 5000,
      maxSubscribers: 10000,
      maxLists: 50,
      features: ['A/B Testing', 'Advanced Analytics', 'API Access', 'Custom Templates']
    };

    // Mock usage
    const monthlyEmailsSent = Math.floor(Math.random() * 30000) + 10000;
    const dailyEmailsSent = Math.floor(Math.random() * 2000) + 500;

    return {
      plan,
      currentUsage: {
        monthlyEmailsSent,
        dailyEmailsSent,
        totalSubscribers: stats.totalSubscribers,
        totalLists: stats.totalLists
      },
      percentages: {
        monthlyEmails: Math.round((monthlyEmailsSent / plan.monthlyEmailLimit) * 100),
        dailyEmails: Math.round((dailyEmailsSent / plan.dailyEmailLimit) * 100),
        subscribers: Math.round((stats.totalSubscribers / plan.maxSubscribers) * 100),
        lists: Math.round((stats.totalLists / plan.maxLists) * 100)
      }
    };
  }

  /**
   * Get current usage
   */
  async getCurrentUsage(tenantId: string, period: 'day' | 'month' | 'year' = 'month'): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
    period: 'day' | 'month' | 'year';
    startDate: Date;
    endDate: Date;
    previousPeriodComparison?: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      percentageChange: {
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
      };
    };
  }> {
    // This would typically involve querying the database for usage statistics
    // For simplicity, we'll return a mock implementation

    let startDate: Date;
    const endDate = new Date();

    if (period === 'day') {
      startDate = new Date(endDate);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    } else {
      startDate = new Date(endDate.getFullYear(), 0, 1);
    }

    // Generate mock data
    const sent = Math.floor(Math.random() * 10000) + 5000;
    const delivered = Math.floor(sent * (0.95 + Math.random() * 0.05));
    const opened = Math.floor(delivered * (0.4 + Math.random() * 0.3));
    const clicked = Math.floor(opened * (0.2 + Math.random() * 0.2));
    const bounced = sent - delivered;
    const complained = Math.floor(delivered * 0.001);
    const unsubscribed = Math.floor(delivered * 0.005);

    // Previous period comparison
    const prevSent = Math.floor(sent * (0.8 + Math.random() * 0.4));
    const prevDelivered = Math.floor(prevSent * (0.95 + Math.random() * 0.05));
    const prevOpened = Math.floor(prevDelivered * (0.4 + Math.random() * 0.3));
    const prevClicked = Math.floor(prevOpened * (0.2 + Math.random() * 0.2));

    return {
      sent,
      delivered,
      opened,
      clicked,
      bounced,
      complained,
      unsubscribed,
      period,
      startDate,
      endDate,
      previousPeriodComparison: {
        sent: prevSent,
        delivered: prevDelivered,
        opened: prevOpened,
        clicked: prevClicked,
        percentageChange: {
          sent: Math.round(((sent - prevSent) / prevSent) * 100),
          delivered: Math.round(((delivered - prevDelivered) / prevDelivered) * 100),
          opened: Math.round(((opened - prevOpened) / prevOpened) * 100),
          clicked: Math.round(((clicked - prevClicked) / prevClicked) * 100)
        }
      }
    };
  }
}
