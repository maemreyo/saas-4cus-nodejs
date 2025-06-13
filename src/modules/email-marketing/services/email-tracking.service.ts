// Service for email open and click tracking

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { EmailAnalyticsService } from './email-analytics.service';
import { logger } from '@/shared/logger';
import * as crypto from 'crypto';
import { EmailActivityType } from '@prisma/client';

export interface TrackingPixelData {
  campaignId: string;
  recipientId: string;
  messageId?: string;
}

export interface TrackingLinkData {
  campaignId: string;
  recipientId: string;
  originalUrl: string;
  linkId: string;
}

@Injectable()
export class EmailTrackingService {
  private readonly trackingDomain: string;
  private readonly secretKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly analytics: EmailAnalyticsService,
  ) {
    this.trackingDomain = process.env.EMAIL_TRACKING_DOMAIN || 'https://track.example.com';
    this.secretKey = process.env.EMAIL_TRACKING_SECRET || 'default-secret-key';
  }

  /**
   * Generate tracking pixel URL
   */
  generateTrackingPixel(data: TrackingPixelData): string {
    const encoded = this.encodeTrackingData(data);
    return `${this.trackingDomain}/pixel/${encoded}.gif`;
  }

  /**
   * Generate tracked link
   */
  generateTrackedLink(originalUrl: string, data: Omit<TrackingLinkData, 'originalUrl' | 'linkId'>): string {
    const linkId = crypto.randomBytes(8).toString('hex');

    const trackingData: TrackingLinkData = {
      ...data,
      originalUrl,
      linkId,
    };

    const encoded = this.encodeTrackingData(trackingData);
    return `${this.trackingDomain}/click/${encoded}`;
  }

  /**
   * Process tracking pixel request
   */
  async trackOpen(
    encoded: string,
    metadata: {
      userAgent?: string;
      ipAddress?: string;
    },
  ): Promise<void> {
    try {
      const data = this.decodeTrackingData<TrackingPixelData>(encoded);

      if (!data) {
        logger.warn('Invalid tracking pixel data');
        return;
      }

      // Check if already tracked (deduplicate)
      const cacheKey = `email:open:${data.campaignId}:${data.recipientId}`;
      const alreadyTracked = await this.redis.get(cacheKey);

      if (!alreadyTracked) {
        // Get recipient info
        const recipient = await this.prisma.client.emailCampaignRecipient.findFirst({
          where: {
            id: data.recipientId,
            campaignId: data.campaignId,
          },
          include: {
            subscriber: true,
          },
        });

        if (recipient) {
          // Track the open
          await this.analytics.trackActivity(EmailActivityType.OPENED, {
            campaignId: data.campaignId,
            subscriberId: recipient.subscriberId,
            userAgent: metadata.userAgent,
            ipAddress: metadata.ipAddress,
          });

          // Cache to prevent duplicate tracking
          await this.redis.set(cacheKey, true, { ttl: 86400 }); // 24 hours
        }
      }
    } catch (error) {
      logger.error('Failed to track email open', { error, encoded });
    }
  }

  /**
   * Process link click tracking
   */
  async trackClick(
    encoded: string,
    metadata: {
      userAgent?: string;
      ipAddress?: string;
    },
  ): Promise<string | null> {
    try {
      const data = this.decodeTrackingData<TrackingLinkData>(encoded);

      if (!data) {
        logger.warn('Invalid tracking link data');
        return null;
      }

      // Get recipient info
      const recipient = await this.prisma.client.emailCampaignRecipient.findFirst({
        where: {
          id: data.recipientId,
          campaignId: data.campaignId,
        },
        include: {
          subscriber: true,
        },
      });

      if (recipient) {
        // Track the click
        await this.analytics.trackActivity(EmailActivityType.CLICKED, {
          campaignId: data.campaignId,
          subscriberId: recipient.subscriberId,
          clickedUrl: data.originalUrl,
          userAgent: metadata.userAgent,
          ipAddress: metadata.ipAddress,
        });

        // Also track as opened if not already
        const openCacheKey = `email:open:${data.campaignId}:${data.recipientId}`;
        const alreadyOpened = await this.redis.get(openCacheKey);

        if (!alreadyOpened) {
          await this.analytics.trackActivity(EmailActivityType.OPENED, {
            campaignId: data.campaignId,
            subscriberId: recipient.subscriberId,
            userAgent: metadata.userAgent,
            ipAddress: metadata.ipAddress,
          });

          await this.redis.set(openCacheKey, true, { ttl: 86400 });
        }
      }

      return data.originalUrl;
    } catch (error) {
      logger.error('Failed to track link click', { error, encoded });
      return null;
    }
  }

  /**
   * Replace links in email content with tracked versions
   */
  replaceLinksWithTracking(
    html: string,
    data: {
      campaignId: string;
      recipientId: string;
    },
  ): string {
    // Regular expression to find links
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])((?:https?:\/\/)[^"']+)\1/gi;

    return html.replace(linkRegex, (match, quote, url) => {
      // Skip tracking for certain URLs
      if (this.shouldSkipTracking(url)) {
        return match;
      }

      const trackedUrl = this.generateTrackedLink(url, data);
      return match.replace(url, trackedUrl);
    });
  }

  /**
   * Add tracking pixel to email content
   */
  addTrackingPixel(html: string, data: TrackingPixelData): string {
    const pixelUrl = this.generateTrackingPixel(data);
    const pixelHtml = `<img src="${pixelUrl}" width="1" height="1" border="0" alt="" style="display:block;width:1px;height:1px;border:0;" />`;

    // Try to insert before closing body tag
    if (html.includes('</body>')) {
      return html.replace('</body>', `${pixelHtml}</body>`);
    }

    // Otherwise append to the end
    return html + pixelHtml;
  }

  /**
   * Generate UTM parameters for a URL
   */
  addUTMParameters(
    url: string,
    params: {
      source?: string;
      medium?: string;
      campaign?: string;
      term?: string;
      content?: string;
    },
  ): string {
    try {
      const urlObj = new URL(url);

      if (params.source) {
        urlObj.searchParams.set('utm_source', params.source);
      }
      if (params.medium) {
        urlObj.searchParams.set('utm_medium', params.medium);
      }
      if (params.campaign) {
        urlObj.searchParams.set('utm_campaign', params.campaign);
      }
      if (params.term) {
        urlObj.searchParams.set('utm_term', params.term);
      }
      if (params.content) {
        urlObj.searchParams.set('utm_content', params.content);
      }

      return urlObj.toString();
    } catch (error) {
      // Invalid URL, return as is
      return url;
    }
  }

  /**
   * Process email content for tracking
   */
  processEmailForTracking(
    html: string,
    options: {
      campaignId: string;
      recipientId: string;
      trackOpens: boolean;
      trackClicks: boolean;
      utmParams?: any;
    },
  ): string {
    let processedHtml = html;

    // Add click tracking
    if (options.trackClicks) {
      processedHtml = this.replaceLinksWithTracking(processedHtml, {
        campaignId: options.campaignId,
        recipientId: options.recipientId,
      });
    }

    // Add UTM parameters
    if (options.utmParams) {
      processedHtml = this.addUTMParametersToLinks(processedHtml, options.utmParams);
    }

    // Add open tracking pixel
    if (options.trackOpens) {
      processedHtml = this.addTrackingPixel(processedHtml, {
        campaignId: options.campaignId,
        recipientId: options.recipientId,
      });
    }

    return processedHtml;
  }

  /**
   * Batch track email events (for webhook processing)
   */
  async batchTrackEvents(
    events: Array<{
      type: 'DELIVERED' | 'BOUNCED' | 'COMPLAINED';
      // type: 'delivered' | 'bounced' | 'complained';
      campaignId: string;
      recipientEmail: string;
      timestamp: Date;
      error?: string;
    }>,
  ): Promise<void> {
    for (const event of events) {
      try {
        // Find recipient
        const recipient = await this.prisma.client.emailCampaignRecipient.findFirst({
          where: {
            campaignId: event.campaignId,
            subscriber: {
              email: event.recipientEmail,
            },
          },
        });

        if (recipient) {
          await this.analytics.trackActivity(event.type, {
            campaignId: event.campaignId,
            subscriberId: recipient.subscriberId,
          });

          // Update recipient status for bounces
          if (event.type === 'BOUNCED' && event.error) {
            await this.prisma.client.emailCampaignRecipient.update({
              where: { id: recipient.id },
              data: { error: event.error },
            });
          }
        }
      } catch (error) {
        logger.error('Failed to track batch event', {
          event,
          error,
        });
      }
    }
  }

  /**
   * Get tracking statistics for a campaign
   */
  async getTrackingStats(campaignId: string): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalOpens: number;
    uniqueOpens: number;
    totalClicks: number;
    uniqueClicks: number;
    clickedLinks: Array<{
      url: string;
      clicks: number;
      uniqueClicks: number;
    }>;
  }> {
    const [recipients, clickActivities] = await Promise.all([
      this.prisma.client.emailCampaignRecipient.findMany({
        where: { campaignId },
        select: {
          status: true,
          openCount: true,
          clickCount: true,
        },
      }),
      this.prisma.client.emailActivity.findMany({
        where: {
          campaignId,
          type: EmailActivityType.CLICKED,
          clickedUrl: { not: null },
        },
        select: {
          clickedUrl: true,
          subscriberId: true,
        },
      }),
    ]);

    // Calculate stats
    const stats = recipients.reduce(
      (acc, recipient) => {
        if (recipient.status !== 'PENDING') {
          acc.totalSent++;
        }
        if (recipient.status === 'DELIVERED' || recipient.status === 'OPENED' || recipient.status === 'CLICKED') {
          acc.totalDelivered++;
        }
        if (recipient.openCount > 0) {
          acc.uniqueOpens++;
          acc.totalOpens += recipient.openCount;
        }
        if (recipient.clickCount > 0) {
          acc.uniqueClicks++;
          acc.totalClicks += recipient.clickCount;
        }
        return acc;
      },
      {
        totalSent: 0,
        totalDelivered: 0,
        totalOpens: 0,
        uniqueOpens: 0,
        totalClicks: 0,
        uniqueClicks: 0,
      },
    );

    // Calculate clicked links
    const linkStats = new Map<string, Set<string>>();

    for (const activity of clickActivities) {
      const url = activity.clickedUrl!;
      if (!linkStats.has(url)) {
        linkStats.set(url, new Set());
      }
      linkStats.get(url)!.add(activity.subscriberId);
    }

    const clickedLinks = Array.from(linkStats.entries())
      .map(([url, subscribers]) => ({
        url,
        clicks: clickActivities.filter(a => a.clickedUrl === url).length,
        uniqueClicks: subscribers.size,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    return {
      ...stats,
      clickedLinks,
    };
  }

  /**
   * Encode tracking data
   */
  private encodeTrackingData(data: any): string {
    const json = JSON.stringify(data);
    const encrypted = this.encrypt(json);
    return Buffer.from(encrypted).toString('base64url');
  }

  /**
   * Decode tracking data
   */
  private decodeTrackingData<T>(encoded: string): T | null {
    try {
      const encrypted = Buffer.from(encoded, 'base64url').toString();
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      return null;
    }
  }

  /**
   * Encrypt data
   */
  private encrypt(text: string): string {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(this.secretKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt data
   */
  private decrypt(text: string): string {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(this.secretKey, 'salt', 32);

    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Check if URL should skip tracking
   */
  private shouldSkipTracking(url: string): boolean {
    const skipPatterns = [
      /^mailto:/i,
      /^tel:/i,
      /^sms:/i,
      /unsubscribe/i,
      /preferences/i,
      /privacy/i,
      /\{\{.*\}\}/, // Template variables
    ];

    return skipPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Add UTM parameters to all links in HTML
   */
  private addUTMParametersToLinks(html: string, utmParams: any): string {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])((?:https?:\/\/)[^"']+)\1/gi;

    return html.replace(linkRegex, (match, quote, url) => {
      if (this.shouldSkipTracking(url)) {
        return match;
      }

      const urlWithUTM = this.addUTMParameters(url, utmParams);
      return match.replace(url, urlWithUTM);
    });
  }
}
