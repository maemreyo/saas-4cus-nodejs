import { Service } from 'typedi';
import { Notification, NotificationType } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { Events } from '@shared/events/events';
import { queueService } from '@shared/queue/queue.service';
import { EmailService } from '@shared/services/email.service';
import { NotFoundException, BadRequestException } from '@shared/exceptions';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';

export interface CreateNotificationOptions {
  userId: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'ALERT' | 'CRITICAL' |
        'ai_api_key_expired' | 'ai_usage_warning' | 'ai_usage_exceeded' | 'ai_cost_threshold';
  title: string;
  message?: string; // Alias for content
  content?: string;
  metadata?: Record<string, any>;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'low' | 'medium' | 'high' | 'critical';
  expiresAt?: Date;
  actionUrl?: string; // Simple action URL
  actions?: Array<{
    label: string;
    url?: string;
    action?: string;
  }>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sms: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours?: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

@Service()
export class NotificationService {
  constructor(
    private eventBus: EventBus,
    private emailService: EmailService
  ) {}

  /**
   * Create a notification
   */
  async create(options: CreateNotificationOptions): Promise<Notification> {
    // Normalize options
    const {
      userId,
      title,
      content = options.message || '',
      metadata = {},
      expiresAt,
      actionUrl
    } = options;

    // Normalize priority (convert lowercase to uppercase)
    let priority = options.priority || 'MEDIUM';
    if (typeof priority === 'string' && priority.toUpperCase() !== priority) {
      priority = priority.toUpperCase() as any;
    }

    // Normalize actions
    let actions = options.actions || [];

    // Add actionUrl to actions if provided
    if (actionUrl && !actions.some(a => a.url === actionUrl)) {
      actions = [
        ...actions,
        { label: 'View', url: actionUrl }
      ];
    }

    // Map type to NotificationType enum
    const typeMap: Record<string, NotificationType> = {
      'INFO': NotificationType.IN_APP,
      'WARNING': NotificationType.IN_APP,
      'ERROR': NotificationType.EMAIL,
      'SUCCESS': NotificationType.IN_APP,
      'ALERT': NotificationType.EMAIL,
      'CRITICAL': NotificationType.EMAIL,
      // Custom AI notification types
      'ai_api_key_expired': NotificationType.IN_APP,
      'ai_usage_warning': NotificationType.IN_APP,
      'ai_usage_exceeded': NotificationType.EMAIL,
      'ai_cost_threshold': NotificationType.EMAIL
    };

    const notification = await prisma.client.notification.create({
      data: {
        userId,
        type: typeMap[options.type] || NotificationType.IN_APP,
        title,
        content,
        metadata: {
          ...metadata,
          priority,
          notificationType: options.type,
          actions
        }
      }
    });

    // Clear user's notification cache
    await redis.delete(`notifications:${userId}:unread`);

    // Check user preferences
    const preferences = await this.getUserPreferences(userId);

    // Queue delivery based on preferences and priority
    const criticalTypes = ['ERROR', 'ALERT', 'CRITICAL', 'ai_usage_exceeded', 'ai_cost_threshold'];
    if (priority === 'CRITICAL' || (preferences.email && criticalTypes.includes(options.type))) {
      await this.queueEmailNotification(notification);
    }

    // Send push notification for high priority
    if (preferences.push && (['HIGH', 'CRITICAL'].includes(priority as string))) {
      await this.queuePushNotification(notification);
    }

    // Real-time notification via WebSocket
    if (preferences.inApp) {
      await this.sendRealTimeNotification(notification);
    }

    logger.info('Notification created', {
      notificationId: notification.id,
      userId,
      type: options.type,
      priority
    });

    await this.eventBus.emit(Events.NOTIFICATION_CREATED, {
      notificationId: notification.id,
      userId,
      type: options.type,
      timestamp: new Date()
    });

    return notification;
  }

  /**
   * Get user notifications
   */
  @Cacheable({ ttl: 300, namespace: 'notifications' })
  async getUserNotifications(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      type?: string;
    }
  ): Promise<{
    notifications: Notification[];
    total: number;
    unread: number;
  }> {
    const where = {
      userId,
      ...(options?.unreadOnly && { readAt: null }),
      ...(options?.type && {
        metadata: {
          path: ['notificationType'],
          equals: options.type
        }
      })
    };

    const [notifications, total, unread] = await Promise.all([
      prisma.client.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0
      }),
      prisma.client.notification.count({ where }),
      prisma.client.notification.count({
        where: {
          userId,
          readAt: null
        }
      })
    ]);

    return { notifications, total, unread };
  }

  /**
   * Mark notification as read
   */
  @CacheInvalidate(['notifications'])
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await prisma.client.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.readAt) {
      return; // Already read
    }

    await prisma.client.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() }
    });

    // Clear cache
    await redis.delete(`notifications:${userId}:unread`);
  }

  /**
   * Mark all notifications as read
   */
  @CacheInvalidate(['notifications'])
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.client.notification.updateMany({
      where: {
        userId,
        readAt: null
      },
      data: { readAt: new Date() }
    });

    // Clear cache
    await redis.delete(`notifications:${userId}:unread`);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await prisma.client.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await prisma.client.notification.delete({
      where: { id: notificationId }
    });

    // Clear cache
    await redis.delete(`notifications:${userId}:*`);
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    const user = await prisma.client.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const defaultPreferences: NotificationPreferences = {
      email: true,
      push: true,
      inApp: true,
      sms: false,
      frequency: 'immediate'
    };

    return {
      ...defaultPreferences,
      ...(user.preferences as any)?.notifications
    };
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    const user = await prisma.client.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await prisma.client.user.update({
      where: { id: userId },
      data: {
        preferences: {
          ...(user.preferences as any || {}),
          notifications: {
            ...(user.preferences as any)?.notifications,
            ...preferences
          }
        }
      }
    });
  }

  /**
   * Queue email notification
   */
  private async queueEmailNotification(notification: Notification): Promise<void> {
    await queueService.addJob('notification', 'send-email', {
      notificationId: notification.id
    });
  }

  /**
   * Queue push notification
   */
  private async queuePushNotification(notification: Notification): Promise<void> {
    await queueService.addJob('notification', 'send-push', {
      notificationId: notification.id
    });
  }

  /**
   * Send real-time notification
   */
  private async sendRealTimeNotification(notification: Notification): Promise<void> {
    // Publish to Redis for WebSocket delivery
    await redis.publish(`notifications:${notification.userId}`, {
      type: 'notification',
      data: notification
    });
  }

  /**
   * Get notification statistics
   */
  async getStatistics(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    lastWeek: number;
  }> {
    const [total, unread, notifications] = await Promise.all([
      prisma.client.notification.count({ where: { userId } }),
      prisma.client.notification.count({ where: { userId, readAt: null } }),
      prisma.client.notification.findMany({
        where: { userId },
        select: { metadata: true, createdAt: true }
      })
    ]);

    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    let lastWeek = 0;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    notifications.forEach(n => {
      const meta = n.metadata as any;

      if (meta?.notificationType) {
        byType[meta.notificationType] = (byType[meta.notificationType] || 0) + 1;
      }

      if (meta?.priority) {
        byPriority[meta.priority] = (byPriority[meta.priority] || 0) + 1;
      }

      if (n.createdAt > weekAgo) {
        lastWeek++;
      }
    });

    return {
      total,
      unread,
      byType,
      byPriority,
      lastWeek
    };
  }

  /**
   * Clean up old notifications
   */
  async cleanupOldNotifications(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.client.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        readAt: { not: null }
      }
    });

    logger.info('Cleaned up old notifications', {
      deleted: result.count,
      cutoffDate
    });

    return result.count;
  }
}
