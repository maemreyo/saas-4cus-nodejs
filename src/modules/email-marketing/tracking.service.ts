import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { redis } from '@infrastructure/cache/redis.service';
import {
  EmailDeliveryStatus,
  Prisma
} from '@prisma/client';
import { EmailMarketingEvents } from './email-marketing.events';
import { createHash } from 'crypto';
import UAParser from 'ua-parser-js';
import geoip from 'geoip-lite';

interface TrackingData {
  campaignId?: string;
  subscriberId: string;
  messageId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface ClickData extends TrackingData {
  url: string;
  linkId: string;
}

@Service()
export class TrackingService {
  private readonly TRACKING_PIXEL = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  /**
   * Track email sent
   */
  async trackSent(data: TrackingData): Promise<void> {
    try {
      if (data.campaignId) {
        // Update recipient status
        await prisma.client.emailCampaignRecipient.updateMany({
          where: {
            campaignId: data.campaignId,
            subscriberId: data.subscriberId
          },
          data: {
            status: EmailDeliveryStatus.SENT,
            sentAt: data.timestamp
          }
        });

        // Update campaign stats
        await this.incrementCampaignStat(data.campaignId, 'sentCount');
      }

      // Record activity
      await this.recordActivity('sent', data);

      await eventBus.emit(EmailMarketingEvents.EMAIL_SENT, {
        ...data,
        type: 'sent'
      });
    } catch (error) {
      logger.error('Failed to track email sent', error as Error, data);
    }
  }

  /**
   * Track email delivered
   */
  async trackDelivered(data: TrackingData): Promise<void> {
    try {
      if (data.campaignId) {
        // Update recipient status
        await prisma.client.emailCampaignRecipient.updateMany({
          where: {
            campaignId: data.campaignId,
            subscriberId: data.subscriberId
          },
          data: {
            status: EmailDeliveryStatus.DELIVERED,
            deliveredAt: data.timestamp
          }
        });

        // Update campaign stats
        await this.incrementCampaignStat(data.campaignId, 'deliveredCount');
      }

      // Record activity
      await this.recordActivity('delivered', data);

      await eventBus.emit(EmailMarketingEvents.EMAIL_DELIVERED, {
        ...data,
        type: 'delivered'
      });
    } catch (error) {
      logger.error('Failed to track email delivered', error as Error, data);
    }
  }

  /**
   * Track email opened
   */
  async trackOpen(data: TrackingData): Promise<void> {
    try {
      // Check if already opened (for unique opens)
      const isFirstOpen = data.campaignId ?
        await this.isFirstOpen(data.campaignId, data.subscriberId) :
        false;

      if (data.campaignId) {
        // Update recipient
        const updateData: any = {
          status: EmailDeliveryStatus.OPENED,
          openCount: { increment: 1 }
        };

        if (isFirstOpen) {
          updateData.openedAt = data.timestamp;
        }

        await prisma.client.emailCampaignRecipient.updateMany({
          where: {
            campaignId: data.campaignId,
            subscriberId: data.subscriberId
          },
          data: updateData
        });

        // Update campaign stats
        await this.incrementCampaignStat(data.campaignId, 'openCount');
        if (isFirstOpen) {
          await this.incrementCampaignStat(data.campaignId, 'uniqueOpenCount');
        }
      }

      // Parse user agent and location
      const deviceInfo = this.parseUserAgent(data.userAgent);
      const location = this.getLocation(data.ipAddress);

      // Record activity with device info
      await this.recordActivity('opened', {
        ...data,
        device: deviceInfo.device,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        location
      });

      // Update subscriber engagement
      await this.updateSubscriberEngagement(data.subscriberId, 'open');

      await eventBus.emit(EmailMarketingEvents.EMAIL_OPENED, {
        ...data,
        type: 'opened',
        isFirstOpen
      });
    } catch (error) {
      logger.error('Failed to track email open', error as Error, data);
    }
  }

  /**
   * Track email click
   */
  async trackClick(data: ClickData): Promise<void> {
    try {
      // Check if already clicked (for unique clicks)
      const isFirstClick = data.campaignId ?
        await this.isFirstClick(data.campaignId, data.subscriberId) :
        false;

      if (data.campaignId) {
        // Update recipient
        const updateData: any = {
          status: EmailDeliveryStatus.CLICKED,
          clickCount: { increment: 1 }
        };

        if (isFirstClick) {
          updateData.clickedAt = data.timestamp;
        }

        await prisma.client.emailCampaignRecipient.updateMany({
          where: {
            campaignId: data.campaignId,
            subscriberId: data.subscriberId
          },
          data: updateData
        });

        // Update campaign stats
        await this.incrementCampaignStat(data.campaignId, 'clickCount');
        if (isFirstClick) {
          await this.incrementCampaignStat(data.campaignId, 'uniqueClickCount');
        }
      }

      // Parse user agent and location
      const deviceInfo = this.parseUserAgent(data.userAgent);
      const location = this.getLocation(data.ipAddress);

      // Record activity with click details
      await this.recordActivity('clicked', {
        ...data,
        clickedUrl: data.url,
        device: deviceInfo.device,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        location
      });

      // Update subscriber engagement
      await this.updateSubscriberEngagement(data.subscriberId, 'click');

      // Track link clicks
      await this.trackLinkClick(data.campaignId, data.url);

      await eventBus.emit(EmailMarketingEvents.EMAIL_CLICKED, {
        ...data,
        type: 'clicked',
        isFirstClick
      });
    } catch (error) {
      logger.error('Failed to track email click', error as Error, data);
    }
  }

  /**
   * Track email bounce
   */
  async trackBounce(data: TrackingData & { bounceType: 'hard' | 'soft' }): Promise<void> {
    try {
      if (data.campaignId) {
        // Update recipient status
        await prisma.client.emailCampaignRecipient.updateMany({
          where: {
            campaignId: data.campaignId,
            subscriberId: data.subscriberId
          },
          data: {
            status: EmailDeliveryStatus.BOUNCED,
            bouncedAt: data.timestamp,
            error: data.bounceType
          }
        });

        // Update campaign stats
        await this.incrementCampaignStat(data.campaignId, 'bouncedCount');
      }

      // Record activity
      await this.recordActivity('bounced', {
        ...data,
        bounceType: data.bounceType
      });

      // Handle hard bounces
      if (data.bounceType === 'hard') {
        await this.handleHardBounce(data.subscriberId);
      }

      await eventBus.emit(EmailMarketingEvents.EMAIL_BOUNCED, {
        ...data,
        type: 'bounced'
      });
    } catch (error) {
      logger.error('Failed to track email bounce', error as Error, data);
    }
  }

  /**
   * Track unsubscribe
   */
  async trackUnsubscribe(data: TrackingData & { reason?: string }): Promise<void> {
    try {
      if (data.campaignId) {
        // Update recipient status
        await prisma.client.emailCampaignRecipient.updateMany({
          where: {
            campaignId: data.campaignId,
            subscriberId: data.subscriberId
          },
          data: {
            status: EmailDeliveryStatus.UNSUBSCRIBED,
            unsubscribedAt: data.timestamp
          }
        });

        // Update campaign stats
        await this.incrementCampaignStat(data.campaignId, 'unsubscribeCount');
      }

      // Record activity
      await this.recordActivity('unsubscribed', {
        ...data,
        reason: data.reason
      });

      await eventBus.emit(EmailMarketingEvents.EMAIL_UNSUBSCRIBED, {
        ...data,
        type: 'unsubscribed'
      });
    } catch (error) {
      logger.error('Failed to track unsubscribe', error as Error, data);
    }
  }

  /**
   * Track spam complaint
   */
  async trackComplaint(data: TrackingData): Promise<void> {
    try {
      if (data.campaignId) {
        // Update recipient status
        await prisma.client.emailCampaignRecipient.updateMany({
          where: {
            campaignId: data.campaignId,
            subscriberId: data.subscriberId
          },
          data: {
            status: EmailDeliveryStatus.COMPLAINED,
            complainedAt: data.timestamp
          }
        });

        // Update campaign stats
        await this.incrementCampaignStat(data.campaignId, 'complaintCount');
      }

      // Record activity
      await this.recordActivity('complained', data);

      // Handle complaint
      await this.handleComplaint(data.subscriberId);

      await eventBus.emit(EmailMarketingEvents.EMAIL_COMPLAINED, {
        ...data,
        type: 'complained'
      });
    } catch (error) {
      logger.error('Failed to track complaint', error as Error, data);
    }
  }

  /**
   * Generate tracking pixel
   */
  generateTrackingPixel(campaignId: string, subscriberId: string): string {
    const trackingId = this.generateTrackingId(campaignId, subscriberId);
    return `${process.env.APP_URL}/api/email-marketing/track/open/${trackingId}`;
  }

  /**
   * Generate click tracking URL
   */
  generateClickTrackingUrl(
    campaignId: string,
    subscriberId: string,
    originalUrl: string,
    linkId?: string
  ): string {
    const trackingId = this.generateTrackingId(campaignId, subscriberId);
    const encodedUrl = Buffer.from(originalUrl).toString('base64url');
    const link = linkId || this.generateLinkId(originalUrl);

    return `${process.env.APP_URL}/api/email-marketing/track/click/${trackingId}/${link}?url=${encodedUrl}`;
  }

  /**
   * Decode tracking ID
   */
  decodeTrackingId(trackingId: string): { campaignId: string; subscriberId: string } | null {
    try {
      const decoded = Buffer.from(trackingId, 'base64url').toString();
      const [campaignId, subscriberId] = decoded.split(':');

      if (!campaignId || !subscriberId) {
        return null;
      }

      return { campaignId, subscriberId };
    } catch {
      return null;
    }
  }

  /**
   * Get tracking pixel image
   */
  getTrackingPixel(): Buffer {
    return this.TRACKING_PIXEL;
  }

  /**
   * Update campaign statistics in real-time
   */
  async updateCampaignStats(campaignId: string): Promise<void> {
    try {
      const stats = await prisma.client.emailCampaignRecipient.groupBy({
        by: ['status'],
        where: { campaignId },
        _count: true
      });

      const totals = await prisma.client.emailCampaignRecipient.aggregate({
        where: { campaignId },
        _sum: {
          openCount: true,
          clickCount: true
        }
      });

      const totalRecipients = stats.reduce((sum, stat) => sum + stat._count, 0);
      const delivered = stats.find(s => s.status === EmailDeliveryStatus.DELIVERED)?._count || 0;
      const uniqueOpens = stats.find(s => s.status === EmailDeliveryStatus.OPENED)?._count || 0;
      const uniqueClicks = stats.find(s => s.status === EmailDeliveryStatus.CLICKED)?._count || 0;

      const updateData = {
        totalRecipients,
        deliveredCount: delivered,
        uniqueOpenCount: uniqueOpens,
        uniqueClickCount: uniqueClicks,
        openCount: totals._sum.openCount || 0,
        clickCount: totals._sum.clickCount || 0,
        deliveryRate: totalRecipients > 0 ? (delivered / totalRecipients) * 100 : 0,
        openRate: delivered > 0 ? (uniqueOpens / delivered) * 100 : 0,
        clickRate: delivered > 0 ? (uniqueClicks / delivered) * 100 : 0,
        clickToOpenRate: uniqueOpens > 0 ? (uniqueClicks / uniqueOpens) * 100 : 0
      };

      await prisma.client.emailCampaignStats.update({
        where: { campaignId },
        data: updateData
      });
    } catch (error) {
      logger.error('Failed to update campaign stats', error as Error, { campaignId });
    }
  }

  /**
   * Record email activity
   */
  private async recordActivity(type: string, data: any): Promise<void> {
    await prisma.client.emailActivity.create({
      data: {
        campaignId: data.campaignId,
        subscriberId: data.subscriberId,
        type,
        clickedUrl: data.clickedUrl,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        location: data.location,
        device: data.device,
        os: data.os,
        browser: data.browser,
        metadata: {
          messageId: data.messageId,
          ...data.metadata
        }
      }
    });
  }

  /**
   * Update subscriber engagement score
   */
  private async updateSubscriberEngagement(
    subscriberId: string,
    action: 'open' | 'click'
  ): Promise<void> {
    const score = action === 'click' ? 2 : 1;

    await prisma.client.emailListSubscriber.update({
      where: { id: subscriberId },
      data: {
        lastEngagedAt: new Date(),
        engagementScore: { increment: score }
      }
    });
  }

  /**
   * Increment campaign statistic
   */
  private async incrementCampaignStat(
    campaignId: string,
    field: string
  ): Promise<void> {
    await prisma.client.emailCampaignStats.update({
      where: { campaignId },
      data: {
        [field]: { increment: 1 }
      }
    });

    // Cache bust
    await redis.delete(`campaign:stats:${campaignId}`);
  }

  /**
   * Check if first open
   */
  private async isFirstOpen(
    campaignId: string,
    subscriberId: string
  ): Promise<boolean> {
    const recipient = await prisma.client.emailCampaignRecipient.findFirst({
      where: { campaignId, subscriberId },
      select: { openedAt: true }
    });

    return !recipient?.openedAt;
  }

  /**
   * Check if first click
   */
  private async isFirstClick(
    campaignId: string,
    subscriberId: string
  ): Promise<boolean> {
    const recipient = await prisma.client.emailCampaignRecipient.findFirst({
      where: { campaignId, subscriberId },
      select: { clickedAt: true }
    });

    return !recipient?.clickedAt;
  }

  /**
   * Track link clicks
   */
  private async trackLinkClick(
    campaignId: string | undefined,
    url: string
  ): Promise<void> {
    if (!campaignId) return;

    const key = `campaign:links:${campaignId}`;
    await redis.hincrby(key, url, 1);
  }

  /**
   * Handle hard bounce
   */
  private async handleHardBounce(subscriberId: string): Promise<void> {
    // Mark subscriber as invalid
    await prisma.client.emailListSubscriber.update({
      where: { id: subscriberId },
      data: {
        subscribed: false,
        metadata: {
          bounced: true,
          bouncedAt: new Date()
        }
      }
    });
  }

  /**
   * Handle spam complaint
   */
  private async handleComplaint(subscriberId: string): Promise<void> {
    // Unsubscribe and mark as complained
    await prisma.client.emailListSubscriber.update({
      where: { id: subscriberId },
      data: {
        subscribed: false,
        unsubscribedAt: new Date(),
        metadata: {
          complained: true,
          complainedAt: new Date()
        }
      }
    });
  }

  /**
   * Parse user agent
   */
  private parseUserAgent(userAgent?: string): any {
    if (!userAgent) {
      return { device: 'Unknown', os: 'Unknown', browser: 'Unknown' };
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      device: result.device.type || 'Desktop',
      os: result.os.name || 'Unknown',
      browser: result.browser.name || 'Unknown'
    };
  }

  /**
   * Get location from IP
   */
  private getLocation(ipAddress?: string): string | null {
    if (!ipAddress) return null;

    const geo = geoip.lookup(ipAddress);
    if (!geo) return null;

    return `${geo.city || 'Unknown'}, ${geo.country}`;
  }

  /**
   * Generate tracking ID
   */
  private generateTrackingId(campaignId: string, subscriberId: string): string {
    return Buffer.from(`${campaignId}:${subscriberId}`).toString('base64url');
  }

  /**
   * Generate link ID
   */
  private generateLinkId(url: string): string {
    return createHash('sha256').update(url).digest('hex').substring(0, 8);
  }
}