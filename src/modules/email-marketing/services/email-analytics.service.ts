// Service for email marketing analytics and reporting

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { RedisService } from '@/infrastructure/cache/redis.service';
import {
  EmailCampaignStats,
  EmailActivity,
  EmailDeliveryStatus,
  Prisma
} from '@prisma/client';

export interface CampaignAnalytics {
  campaignId: string;
  name: string;
  subject: string;
  sentAt?: Date;
  stats: EmailCampaignStats;
  hourlyMetrics?: HourlyMetric[];
  clickMap?: ClickMapEntry[];
  deviceStats?: DeviceStats;
  locationStats?: LocationStats[];
}

export interface HourlyMetric {
  hour: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export interface ClickMapEntry {
  url: string;
  clicks: number;
  uniqueClicks: number;
  percentage: number;
}

export interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
  other: number;
}

export interface LocationStats {
  location: string;
  opens: number;
  clicks: number;
}

export interface SubscriberEngagement {
  subscriberId: string;
  email: string;
  totalReceived: number;
  totalOpened: number;
  totalClicked: number;
  lastOpenedAt?: Date;
  lastClickedAt?: Date;
  engagementScore: number;
}

export interface ListAnalytics {
  listId: string;
  name: string;
  subscriberGrowth: GrowthMetric[];
  engagementTrend: EngagementTrend[];
  topPerformers: SubscriberEngagement[];
  inactive: SubscriberEngagement[];
}

export interface GrowthMetric {
  date: Date;
  subscribers: number;
  newSubscribers: number;
  unsubscribes: number;
  netGrowth: number;
}

export interface EngagementTrend {
  date: Date;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}

@Injectable()
export class EmailAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(
    campaignId: string,
    options?: {
      includeHourlyMetrics?: boolean;
      includeClickMap?: boolean;
      includeDeviceStats?: boolean;
      includeLocationStats?: boolean;
    }
  ): Promise<CampaignAnalytics> {
    const cacheKey = `campaign-analytics:${campaignId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached && !options) {
      return cached;
    }

    const campaign = await this.prisma.emailCampaign.findUnique({
      where: { id: campaignId },
      include: {
        stats: true
      }
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const analytics: CampaignAnalytics = {
      campaignId: campaign.id,
      name: campaign.name,
      subject: campaign.subject,
      sentAt: campaign.sentAt || undefined,
      stats: campaign.stats!
    };

    if (options?.includeHourlyMetrics) {
      analytics.hourlyMetrics = await this.getHourlyMetrics(campaignId);
    }

    if (options?.includeClickMap) {
      analytics.clickMap = await this.getClickMap(campaignId);
    }

    if (options?.includeDeviceStats) {
      analytics.deviceStats = await this.getDeviceStats(campaignId);
    }

    if (options?.includeLocationStats) {
      analytics.locationStats = await this.getLocationStats(campaignId);
    }

    // Cache for 5 minutes
    await this.redis.set(cacheKey, analytics, { ttl: 300 });

    return analytics;
  }

  /**
   * Update campaign statistics
   */
  async updateCampaignStats(campaignId: string): Promise<void> {
    const [
      totalRecipients,
      sentCount,
      deliveredCount,
      bouncedCount,
      openData,
      clickData,
      unsubscribeCount,
      complaintCount
    ] = await Promise.all([
      // Total recipients
      this.prisma.emailCampaignRecipient.count({
        where: { campaignId }
      }),

      // Sent count
      this.prisma.emailCampaignRecipient.count({
        where: {
          campaignId,
          sentAt: { not: null }
        }
      }),

      // Delivered count
      this.prisma.emailCampaignRecipient.count({
        where: {
          campaignId,
          status: EmailDeliveryStatus.DELIVERED
        }
      }),

      // Bounced count
      this.prisma.emailCampaignRecipient.count({
        where: {
          campaignId,
          status: EmailDeliveryStatus.BOUNCED
        }
      }),

      // Open data
      this.prisma.emailCampaignRecipient.aggregate({
        where: {
          campaignId,
          openedAt: { not: null }
        },
        _count: true,
        _sum: { openCount: true }
      }),

      // Click data
      this.prisma.emailCampaignRecipient.aggregate({
        where: {
          campaignId,
          clickedAt: { not: null }
        },
        _count: true,
        _sum: { clickCount: true }
      }),

      // Unsubscribe count
      this.prisma.emailCampaignRecipient.count({
        where: {
          campaignId,
          unsubscribedAt: { not: null }
        }
      }),

      // Complaint count
      this.prisma.emailCampaignRecipient.count({
        where: {
          campaignId,
          complainedAt: { not: null }
        }
      })
    ]);

    // Calculate rates
    const deliveryRate = sentCount > 0 ? (deliveredCount / sentCount) * 100 : 0;
    const openRate = deliveredCount > 0 ? (openData._count / deliveredCount) * 100 : 0;
    const clickRate = deliveredCount > 0 ? (clickData._count / deliveredCount) * 100 : 0;
    const clickToOpenRate = openData._count > 0 ? (clickData._count / openData._count) * 100 : 0;
    const unsubscribeRate = deliveredCount > 0 ? (unsubscribeCount / deliveredCount) * 100 : 0;
    const complaintRate = deliveredCount > 0 ? (complaintCount / deliveredCount) * 100 : 0;

    // Update stats
    await this.prisma.emailCampaignStats.upsert({
      where: { campaignId },
      create: {
        id: `stats_${campaignId}`,
        campaignId,
        totalRecipients,
        sentCount,
        deliveredCount,
        bouncedCount,
        openCount: openData._sum.openCount || 0,
        uniqueOpenCount: openData._count,
        clickCount: clickData._sum.clickCount || 0,
        uniqueClickCount: clickData._count,
        unsubscribeCount,
        complaintCount,
        deliveryRate,
        openRate,
        clickRate,
        clickToOpenRate,
        unsubscribeRate,
        complaintRate
      },
      update: {
        totalRecipients,
        sentCount,
        deliveredCount,
        bouncedCount,
        openCount: openData._sum.openCount || 0,
        uniqueOpenCount: openData._count,
        clickCount: clickData._sum.clickCount || 0,
        uniqueClickCount: clickData._count,
        unsubscribeCount,
        complaintCount,
        deliveryRate,
        openRate,
        clickRate,
        clickToOpenRate,
        unsubscribeRate,
        complaintRate,
        updatedAt: new Date()
      }
    });

    // Invalidate cache
    await this.redis.delete(`campaign-analytics:${campaignId}`);
  }

  /**
   * Track email activity
   */
  async trackActivity(
    type: string,
    data: {
      campaignId?: string;
      subscriberId: string;
      clickedUrl?: string;
      userAgent?: string;
      ipAddress?: string;
    }
  ): Promise<void> {
    // Parse user agent
    let device, os, browser;
    if (data.userAgent) {
      const parsed = this.parseUserAgent(data.userAgent);
      device = parsed.device;
      os = parsed.os;
      browser = parsed.browser;
    }

    // Get location from IP
    let location;
    if (data.ipAddress) {
      location = await this.getLocationFromIP(data.ipAddress);
    }

    // Create activity record
    await this.prisma.emailActivity.create({
      data: {
        campaignId: data.campaignId,
        subscriberId: data.subscriberId,
        type,
        clickedUrl: data.clickedUrl,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        location,
        device,
        os,
        browser
      }
    });

    // Update recipient record if campaign activity
    if (data.campaignId) {
      const updateData: any = {};

      switch (type) {
        case 'delivered':
          updateData.status = EmailDeliveryStatus.DELIVERED;
          updateData.deliveredAt = new Date();
          break;

        case 'opened':
          updateData.status = EmailDeliveryStatus.OPENED;
          updateData.openedAt = updateData.openedAt || new Date();
          updateData.openCount = { increment: 1 };
          break;

        case 'clicked':
          updateData.status = EmailDeliveryStatus.CLICKED;
          updateData.clickedAt = updateData.clickedAt || new Date();
          updateData.clickCount = { increment: 1 };
          break;

        case 'bounced':
          updateData.status = EmailDeliveryStatus.BOUNCED;
          updateData.bouncedAt = new Date();
          break;

        case 'unsubscribed':
          updateData.status = EmailDeliveryStatus.UNSUBSCRIBED;
          updateData.unsubscribedAt = new Date();
          break;

        case 'complained':
          updateData.status = EmailDeliveryStatus.COMPLAINED;
          updateData.complainedAt = new Date();
          break;
      }

      await this.prisma.emailCampaignRecipient.updateMany({
        where: {
          campaignId: data.campaignId,
          subscriberId: data.subscriberId
        },
        data: updateData
      });

      // Update campaign stats
      await this.updateCampaignStats(data.campaignId);
    }

    // Update subscriber engagement
    await this.updateSubscriberEngagement(data.subscriberId, type);
  }

  /**
   * Get subscriber growth metrics
   */
  async getSubscriberGrowth(
    tenantId: string,
    days: number = 30
  ): Promise<GrowthMetric[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const metrics: GrowthMetric[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [totalSubscribers, newSubscribers, unsubscribes] = await Promise.all([
        // Total subscribers at end of day
        this.prisma.emailListSubscriber.count({
          where: {
            list: { tenantId },
            subscribedAt: { lt: nextDate },
            OR: [
              { unsubscribedAt: null },
              { unsubscribedAt: { gte: nextDate } }
            ]
          }
        }),

        // New subscribers on this day
        this.prisma.emailListSubscriber.count({
          where: {
            list: { tenantId },
            subscribedAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),

        // Unsubscribes on this day
        this.prisma.emailListSubscriber.count({
          where: {
            list: { tenantId },
            unsubscribedAt: {
              gte: date,
              lt: nextDate
            }
          }
        })
      ]);

      metrics.push({
        date,
        subscribers: totalSubscribers,
        newSubscribers,
        unsubscribes,
        netGrowth: newSubscribers - unsubscribes
      });
    }

    return metrics;
  }

  /**
   * Get engagement trends
   */
  async getEngagementTrends(
    tenantId: string,
    days: number = 30
  ): Promise<EngagementTrend[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const campaigns = await this.prisma.emailCampaign.findMany({
      where: {
        tenantId,
        sentAt: {
          gte: startDate
        }
      },
      include: {
        stats: true
      },
      orderBy: {
        sentAt: 'asc'
      }
    });

    // Group by date
    const trendsByDate = new Map<string, EngagementTrend>();

    for (const campaign of campaigns) {
      if (!campaign.sentAt || !campaign.stats) continue;

      const dateKey = campaign.sentAt.toISOString().split('T')[0];

      if (!trendsByDate.has(dateKey)) {
        trendsByDate.set(dateKey, {
          date: new Date(dateKey),
          openRate: 0,
          clickRate: 0,
          unsubscribeRate: 0
        });
      }

      const trend = trendsByDate.get(dateKey)!;
      const stats = campaign.stats;

      // Calculate weighted average based on delivered count
      const weight = stats.deliveredCount;
      trend.openRate = (trend.openRate + stats.openRate * weight) / (weight + 1);
      trend.clickRate = (trend.clickRate + stats.clickRate * weight) / (weight + 1);
      trend.unsubscribeRate = (trend.unsubscribeRate + stats.unsubscribeRate * weight) / (weight + 1);
    }

    return Array.from(trendsByDate.values()).sort((a, b) =>
      a.date.getTime() - b.date.getTime()
    );
  }

  /**
   * Get comprehensive analytics for a date range
   */
  async getComprehensiveAnalytics(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    overview: {
      totalCampaigns: number;
      totalEmailsSent: number;
      averageOpenRate: number;
      averageClickRate: number;
      totalRevenue: number;
    };
    topCampaigns: CampaignAnalytics[];
    subscriberGrowth: GrowthMetric[];
    engagementTrends: EngagementTrend[];
  }> {
    const [
      campaignStats,
      topCampaigns,
      subscriberGrowth,
      engagementTrends
    ] = await Promise.all([
      // Overview stats
      this.prisma.emailCampaignStats.aggregate({
        where: {
          campaign: {
            tenantId,
            sentAt: {
              gte: startDate,
              lte: endDate
            }
          }
        },
        _count: true,
        _sum: {
          sentCount: true,
          revenue: true
        },
        _avg: {
          openRate: true,
          clickRate: true
        }
      }),

      // Top performing campaigns
      this.prisma.emailCampaign.findMany({
        where: {
          tenantId,
          sentAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          stats: true
        },
        orderBy: {
          stats: {
            clickRate: 'desc'
          }
        },
        take: 10
      }),

      // Subscriber growth
      this.getSubscriberGrowth(
        tenantId,
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      ),

      // Engagement trends
      this.getEngagementTrends(
        tenantId,
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      )
    ]);

    return {
      overview: {
        totalCampaigns: campaignStats._count,
        totalEmailsSent: campaignStats._sum.sentCount || 0,
        averageOpenRate: campaignStats._avg.openRate || 0,
        averageClickRate: campaignStats._avg.clickRate || 0,
        totalRevenue: campaignStats._sum.revenue || 0
      },
      topCampaigns: topCampaigns.map(c => ({
        campaignId: c.id,
        name: c.name,
        subject: c.subject,
        sentAt: c.sentAt || undefined,
        stats: c.stats!
      })),
      subscriberGrowth,
      engagementTrends
    };
  }

  /**
   * Get hourly metrics for a campaign
   */
  private async getHourlyMetrics(campaignId: string): Promise<HourlyMetric[]> {
    const activities = await this.prisma.emailActivity.findMany({
      where: { campaignId },
      select: {
        type: true,
        createdAt: true
      }
    });

    const metrics = new Map<number, HourlyMetric>();

    for (const activity of activities) {
      const hour = activity.createdAt.getHours();

      if (!metrics.has(hour)) {
        metrics.set(hour, {
          hour,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0
        });
      }

      const metric = metrics.get(hour)!;

      switch (activity.type) {
        case 'sent':
          metric.sent++;
          break;
        case 'delivered':
          metric.delivered++;
          break;
        case 'opened':
          metric.opened++;
          break;
        case 'clicked':
          metric.clicked++;
          break;
      }
    }

    return Array.from(metrics.values()).sort((a, b) => a.hour - b.hour);
  }

  /**
   * Get click map for a campaign
   */
  private async getClickMap(campaignId: string): Promise<ClickMapEntry[]> {
    const clicks = await this.prisma.emailActivity.groupBy({
      by: ['clickedUrl'],
      where: {
        campaignId,
        type: 'clicked',
        clickedUrl: { not: null }
      },
      _count: true
    });

    const totalClicks = clicks.reduce((sum, c) => sum + c._count, 0);

    return clicks.map(click => ({
      url: click.clickedUrl!,
      clicks: click._count,
      uniqueClicks: click._count, // Would need distinct count
      percentage: (click._count / totalClicks) * 100
    })).sort((a, b) => b.clicks - a.clicks);
  }

  /**
   * Get device statistics
   */
  private async getDeviceStats(campaignId: string): Promise<DeviceStats> {
    const devices = await this.prisma.emailActivity.groupBy({
      by: ['device'],
      where: {
        campaignId,
        type: { in: ['opened', 'clicked'] },
        device: { not: null }
      },
      _count: true
    });

    const stats: DeviceStats = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
      other: 0
    };

    for (const device of devices) {
      const type = device.device?.toLowerCase() || 'other';
      if (type.includes('desktop')) {
        stats.desktop += device._count;
      } else if (type.includes('mobile')) {
        stats.mobile += device._count;
      } else if (type.includes('tablet')) {
        stats.tablet += device._count;
      } else {
        stats.other += device._count;
      }
    }

    return stats;
  }

  /**
   * Get location statistics
   */
  private async getLocationStats(campaignId: string): Promise<LocationStats[]> {
    const locations = await this.prisma.emailActivity.groupBy({
      by: ['location'],
      where: {
        campaignId,
        type: { in: ['opened', 'clicked'] },
        location: { not: null }
      },
      _count: {
        _all: true
      }
    });

    return locations.map(loc => ({
      location: loc.location!,
      opens: 0, // Would need to separate by type
      clicks: 0
    })).sort((a, b) => (b.opens + b.clicks) - (a.opens + a.clicks));
  }

  /**
   * Update subscriber engagement score
   */
  private async updateSubscriberEngagement(
    subscriberId: string,
    activityType: string
  ): Promise<void> {
    const weights = {
      opened: 1,
      clicked: 3,
      unsubscribed: -10,
      complained: -20
    };

    const weight = weights[activityType as keyof typeof weights] || 0;

    if (weight !== 0) {
      await this.prisma.emailListSubscriber.update({
        where: { id: subscriberId },
        data: {
          engagementScore: { increment: weight },
          lastEngagedAt: ['opened', 'clicked'].includes(activityType)
            ? new Date()
            : undefined
        }
      });
    }
  }

  /**
   * Parse user agent string
   */
  private parseUserAgent(userAgent: string): {
    device?: string;
    os?: string;
    browser?: string;
  } {
    // Simple parsing - in production use a proper UA parser
    const device = userAgent.includes('Mobile') ? 'mobile' :
                  userAgent.includes('Tablet') ? 'tablet' : 'desktop';

    const os = userAgent.includes('Windows') ? 'Windows' :
               userAgent.includes('Mac') ? 'macOS' :
               userAgent.includes('Linux') ? 'Linux' :
               userAgent.includes('Android') ? 'Android' :
               userAgent.includes('iOS') ? 'iOS' : 'Other';

    const browser = userAgent.includes('Chrome') ? 'Chrome' :
                   userAgent.includes('Firefox') ? 'Firefox' :
                   userAgent.includes('Safari') ? 'Safari' :
                   userAgent.includes('Edge') ? 'Edge' : 'Other';

    return { device, os, browser };
  }

  /**
   * Get location from IP address
   */
  private async getLocationFromIP(ipAddress: string): Promise<string | undefined> {
    // In production, use a geolocation service
    // For now, return undefined
    return undefined;
  }
}
