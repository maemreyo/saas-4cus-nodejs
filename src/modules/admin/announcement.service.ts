import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { NotificationService } from '@modules/notification/notification.service';
import { EmailService } from '@shared/services/email.service';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';
import { NotFoundException } from '@shared/exceptions';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'critical' | 'maintenance';
  targetAudience: 'all' | 'users' | 'admins' | 'specific';
  targetUserIds?: string[];
  targetTenantIds?: string[];
  priority: number;
  startDate?: Date;
  endDate?: Date;
  dismissible: boolean;
  ctaText?: string;
  ctaUrl?: string;
  icon?: string;
  color?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

export interface AnnouncementView {
  announcementId: string;
  userId: string;
  viewedAt: Date;
  dismissed: boolean;
  dismissedAt?: Date;
}

@Service()
export class AnnouncementService {
  private readonly CACHE_KEY = 'announcements:active';
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private eventBus: EventBus,
    private notificationService: NotificationService,
    private emailService: EmailService
  ) {}

  /**
   * Create a new announcement
   */
  @CacheInvalidate(['announcements'])
  async create(data: {
    title: string;
    content: string;
    type: 'info' | 'warning' | 'critical' | 'maintenance';
    targetAudience?: 'all' | 'users' | 'admins' | 'specific';
    targetUserIds?: string[];
    targetTenantIds?: string[];
    startDate?: Date;
    endDate?: Date;
    dismissible?: boolean;
    ctaText?: string;
    ctaUrl?: string;
    priority?: number;
    sendEmail?: boolean;
    sendNotification?: boolean;
    createdBy: string;
  }): Promise<Announcement> {
    // Create announcement in database
    const announcement: Announcement = {
      id: this.generateAnnouncementId(),
      title: data.title,
      content: data.content,
      type: data.type,
      targetAudience: data.targetAudience || 'all',
      targetUserIds: data.targetUserIds,
      targetTenantIds: data.targetTenantIds,
      priority: data.priority || this.getPriorityByType(data.type),
      startDate: data.startDate,
      endDate: data.endDate,
      dismissible: data.dismissible !== false,
      ctaText: data.ctaText,
      ctaUrl: data.ctaUrl,
      icon: this.getIconByType(data.type),
      color: this.getColorByType(data.type),
      createdBy: data.createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in database (using Setting model for simplicity)
    // Convert to proper JSON structure
    await prisma.client.setting.create({
      data: {
        key: `announcement:${announcement.id}`,
        value: JSON.parse(JSON.stringify(announcement)),
        description: `Announcement: ${announcement.title}`
      }
    });

    // Clear cache
    await this.clearAnnouncementCache();

    logger.info('Announcement created', {
      announcementId: announcement.id,
      type: announcement.type,
      targetAudience: announcement.targetAudience
    });

    // Send notifications if requested
    if (data.sendNotification || data.sendEmail) {
      await this.distributeAnnouncement(announcement, {
        sendEmail: data.sendEmail,
        sendNotification: data.sendNotification
      });
    }

    await this.eventBus.emit('admin.announcement.created', {
      announcementId: announcement.id,
      type: announcement.type,
      createdBy: data.createdBy,
      timestamp: new Date()
    });

    return announcement;
  }

  /**
   * Get active announcements for a user
   */
  @Cacheable({ ttl: 300, namespace: 'announcements' })
  async getActiveForUser(
    userId: string,
    options?: {
      includeViewed?: boolean;
      includeDismissed?: boolean;
    }
  ): Promise<Announcement[]> {
    const now = new Date();
    const allAnnouncements = await this.getActive();

    // Get user details for filtering
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        tenantMembers: true
      }
    });

    if (!user) {
      return [];
    }

    // Filter announcements based on target audience
    const filteredAnnouncements = allAnnouncements.filter(announcement => {
      // Check date range
      if (announcement.startDate && announcement.startDate > now) return false;
      if (announcement.endDate && announcement.endDate < now) return false;

      // Check target audience
      switch (announcement.targetAudience) {
        case 'all':
          return true;

        case 'users':
          return user.role === 'USER';

        case 'admins':
          return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

        case 'specific':
          // Check if user is in target list
          if (announcement.targetUserIds?.includes(userId)) return true;

          // Check if user's tenant is in target list
          if (announcement.targetTenantIds) {
            const userTenantIds = user.tenantMembers.map(tm => tm.tenantId);
            return announcement.targetTenantIds.some(tid => userTenantIds.includes(tid));
          }

          return false;

        default:
          return false;
      }
    });

    // Get view/dismiss status
    if (!options?.includeViewed || !options?.includeDismissed) {
      const viewKeys = filteredAnnouncements.map(a => `announcement:view:${a.id}:${userId}`);

      // Fetch all view statuses in parallel
      const viewStatuses = await Promise.all(
        viewKeys.map(key => redis.get(key))
      );

      return filteredAnnouncements.filter((announcement, index) => {
        const viewStatus = viewStatuses[index] as any;

        if (!options?.includeViewed && viewStatus?.viewed) return false;
        if (!options?.includeDismissed && viewStatus?.dismissed) return false;

        return true;
      });
    }

    return filteredAnnouncements;
  }

  /**
   * Get all active announcements
   */
  @Cacheable({ ttl: 300, namespace: 'announcements:all' })
  async getActive(): Promise<Announcement[]> {
    const now = new Date();

    // Get all announcement settings
    const settings = await prisma.client.setting.findMany({
      where: {
        key: { startsWith: 'announcement:' }
      }
    });

    const announcements = settings
      .map(setting => {
        // Parse the JSON value to Announcement type
        const value = setting.value as any;
        return value as Announcement;
      })
      .filter(announcement => {
        // Filter by date range
        if (announcement.startDate && new Date(announcement.startDate) > now) return false;
        if (announcement.endDate && new Date(announcement.endDate) < now) return false;
        return true;
      })
      .sort((a, b) => b.priority - a.priority);

    return announcements;
  }

  /**
   * Update announcement
   */
  @CacheInvalidate(['announcements'])
  async update(
    announcementId: string,
    updates: Partial<Announcement>
  ): Promise<Announcement> {
    const setting = await prisma.client.setting.findUnique({
      where: { key: `announcement:${announcementId}` }
    });

    if (!setting) {
      throw new NotFoundException('Announcement not found');
    }

    const announcement = setting.value as any as Announcement;
    const updatedAnnouncement = {
      ...announcement,
      ...updates,
      updatedAt: new Date()
    };

    await prisma.client.setting.update({
      where: { key: `announcement:${announcementId}` },
      data: { value: JSON.parse(JSON.stringify(updatedAnnouncement)) }
    });

    await this.clearAnnouncementCache();

    logger.info('Announcement updated', { announcementId });

    await this.eventBus.emit('admin.announcement.updated', {
      announcementId,
      updates,
      timestamp: new Date()
    });

    return updatedAnnouncement;
  }

  /**
   * Delete announcement
   */
  @CacheInvalidate(['announcements'])
  async delete(announcementId: string): Promise<void> {
    await prisma.client.setting.delete({
      where: { key: `announcement:${announcementId}` }
    });

    await this.clearAnnouncementCache();

    logger.info('Announcement deleted', { announcementId });

    await this.eventBus.emit('admin.announcement.deleted', {
      announcementId,
      timestamp: new Date()
    });
  }

  /**
   * Mark announcement as viewed
   */
  async markAsViewed(announcementId: string, userId: string): Promise<void> {
    const key = `announcement:view:${announcementId}:${userId}`;

    await redis.set(key, {
      viewed: true,
      viewedAt: new Date(),
      dismissed: false
    }, { ttl: 86400 * 30 }); // 30 days

    await this.eventBus.emit('announcement.viewed', {
      announcementId,
      userId,
      timestamp: new Date()
    });
  }

  /**
   * Dismiss announcement
   */
  async dismiss(announcementId: string, userId: string): Promise<void> {
    const key = `announcement:view:${announcementId}:${userId}`;

    const current = await redis.get(key) || {};

    await redis.set(key, {
      ...current,
      dismissed: true,
      dismissedAt: new Date()
    }, { ttl: 86400 * 30 }); // 30 days

    await this.eventBus.emit('announcement.dismissed', {
      announcementId,
      userId,
      timestamp: new Date()
    });
  }

  /**
   * Get announcement statistics
   */
  async getStatistics(announcementId: string): Promise<{
    totalViews: number;
    uniqueViews: number;
    dismissals: number;
    ctaClicks: number;
    viewsByDay: Array<{ date: Date; views: number }>;
  }> {
    // This would typically query analytics events
    // For now, return mock data
    return {
      totalViews: 0,
      uniqueViews: 0,
      dismissals: 0,
      ctaClicks: 0,
      viewsByDay: []
    };
  }

  /**
   * Schedule announcement
   */
  async schedule(announcement: Partial<Announcement>, scheduledFor: Date): Promise<void> {
    // Create job to publish announcement at scheduled time
    await prisma.client.job.create({
      data: {
        queue: 'announcements',
        name: 'publish-announcement',
        data: announcement,
        scheduledFor,
        status: 'PENDING'
      }
    });

    logger.info('Announcement scheduled', {
      scheduledFor,
      title: announcement.title
    });
  }

  /**
   * Distribute announcement to users
   */
  private async distributeAnnouncement(
    announcement: Announcement,
    options?: {
      sendEmail?: boolean;
      sendNotification?: boolean;
    }
  ): Promise<void> {
    // Get target users
    const users = await this.getTargetUsers(announcement);

    logger.info('Distributing announcement', {
      announcementId: announcement.id,
      userCount: users.length,
      options
    });

    // Send notifications
    if (options?.sendNotification) {
      for (const user of users) {
        await this.notificationService.create({
          userId: user.id,
          type: this.mapAnnouncementTypeToNotificationType(announcement.type),
          title: announcement.title,
          content: announcement.content,
          metadata: {
            announcementId: announcement.id,
            ctaText: announcement.ctaText,
            ctaUrl: announcement.ctaUrl
          }
        });
      }
    }

    // Send emails
    if (options?.sendEmail) {
      const emailJobs = users.map(user => ({
        to: user.email,
        subject: announcement.title,
        template: 'announcement',
        context: {
          userName: user.displayName || user.email,
          announcement
        }
      }));

      // Queue emails in batches
      const batchSize = 100;
      for (let i = 0; i < emailJobs.length; i += batchSize) {
        const batch = emailJobs.slice(i, i + batchSize);
        await Promise.all(batch.map(job => this.emailService.queue(job)));
      }
    }
  }

  /**
   * Get users targeted by announcement
   */
  private async getTargetUsers(announcement: Announcement) {
    switch (announcement.targetAudience) {
      case 'all':
        return await prisma.client.user.findMany({
          where: { status: 'ACTIVE' }
        });

      case 'users':
        return await prisma.client.user.findMany({
          where: {
            status: 'ACTIVE',
            role: 'USER'
          }
        });

      case 'admins':
        return await prisma.client.user.findMany({
          where: {
            status: 'ACTIVE',
            role: { in: ['ADMIN', 'SUPER_ADMIN'] }
          }
        });

      case 'specific':
        const where: any = { status: 'ACTIVE' };

        if (announcement.targetUserIds?.length) {
          where.id = { in: announcement.targetUserIds };
        }

        if (announcement.targetTenantIds?.length) {
          where.tenantMembers = {
            some: {
              tenantId: { in: announcement.targetTenantIds }
            }
          };
        }

        return await prisma.client.user.findMany({ where });

      default:
        return [];
    }
  }

  // Helper methods

  private generateAnnouncementId(): string {
    return `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getPriorityByType(type: string): number {
    const priorities = {
      critical: 100,
      maintenance: 90,
      warning: 50,
      info: 10
    };
    return priorities[type as keyof typeof priorities] || 10;
  }

  private getIconByType(type: string): string {
    const icons = {
      info: 'info-circle',
      warning: 'exclamation-triangle',
      critical: 'exclamation-circle',
      maintenance: 'tools'
    };
    return icons[type as keyof typeof icons] || 'info-circle';
  }

  private getColorByType(type: string): string {
    const colors = {
      info: '#17a2b8',
      warning: '#ffc107',
      critical: '#dc3545',
      maintenance: '#6c757d'
    };
    return colors[type as keyof typeof colors] || '#17a2b8';
  }

  private mapAnnouncementTypeToNotificationType(
    type: string
  ): 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'ALERT' | 'CRITICAL' {
    const mapping = {
      info: 'INFO' as const,
      warning: 'WARNING' as const,
      critical: 'CRITICAL' as const,
      maintenance: 'ALERT' as const
    };
    return mapping[type as keyof typeof mapping] || 'INFO';
  }

  private async clearAnnouncementCache(): Promise<void> {
    await redis.delete('announcements:*');
  }
}
