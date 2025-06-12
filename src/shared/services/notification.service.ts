// Shared notification service for sending notifications across the application

import { Service } from 'typedi';
import { Container } from 'typedi';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';
import { eventBus } from '@shared/events/event-bus';
import { prisma } from '@infrastructure/database/prisma.service';
import { NotificationType, UserRole } from '@prisma/client';
import { NotFoundException } from '../exceptions';

export interface NotificationData {
  userId?: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  channel?: 'email' | 'push' | 'in-app' | 'all';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  severity?: 'info' | 'warning' | 'error';
}

export interface AdminNotificationData extends Omit<NotificationData, 'userId'> {
  roles?: UserRole[];
}

@Service()
export class SharedNotificationService {
  /**
   * Send notification to a specific user
   */
  async send(data: NotificationData): Promise<void> {
    try {
      // Create in-app notification record
      if (!data.channel || data.channel === 'in-app' || data.channel === 'all') {
        await this.createNotificationRecord(data);
      }

      // Queue email notification
      if (data.channel === 'email' || data.channel === 'all') {
        await queueService.addJob('notification', 'send-email', {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data
        });
      }

      // Queue push notification
      if (data.channel === 'push' || data.channel === 'all') {
        await queueService.addJob('notification', 'send-push', {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data
        });
      }

      // Emit event
      await eventBus.emit('notification.sent', {
        userId: data.userId,
        type: data.type,
        channel: data.channel || 'all'
      });

      logger.info('Notification sent', {
        userId: data.userId,
        type: data.type,
        channel: data.channel
      });
    } catch (error) {
      logger.error('Failed to send notification', error as Error);
      throw error;
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendBulk(userIds: string[], data: Omit<NotificationData, 'userId'>): Promise<void> {
    const promises = userIds.map(userId =>
      this.send({ ...data, userId })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Send notification to all admin users
   */
  async sendToAdmins(data: AdminNotificationData): Promise<void> {
    try {
      const roles = data.roles || [UserRole.ADMIN, UserRole.SUPER_ADMIN];

      const admins = await prisma.client.user.findMany({
        where: {
          role: { in: roles },
          status: 'ACTIVE' // Use status field instead of isActive
        },
        select: { id: true }
      });

      const userIds = admins.map(admin => admin.id);

      await this.sendBulk(userIds, {
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        channel: data.channel,
        priority: data.priority || 'high',
        severity: data.severity
      });

      logger.info('Admin notification sent', {
        adminCount: userIds.length,
        type: data.type
      });
    } catch (error) {
      logger.error('Failed to send admin notification', error as Error);
      throw error;
    }
  }

  /**
   * Send notification to tenant members
   */
  async sendToTenant(
    tenantId: string,
    data: Omit<NotificationData, 'userId'>,
    filter?: { roles?: string[] }
  ): Promise<void> {
    try {
      const where: any = {
        tenantId,
        user: { isActive: true }
      };

      if (filter?.roles) {
        where.role = { in: filter.roles };
      }

      const members = await prisma.client.tenantMember.findMany({
        where,
        select: { userId: true }
      });

      const userIds = members.map(member => member.userId);

      await this.sendBulk(userIds, data);

      logger.info('Tenant notification sent', {
        tenantId,
        memberCount: userIds.length,
        type: data.type
      });
    } catch (error) {
      logger.error('Failed to send tenant notification', error as Error);
      throw error;
    }
  }

  /**
   * Create notification record in database
   */
  private async createNotificationRecord(data: NotificationData): Promise<void> {
    if (!data.userId) return;

    try {
      // Map notification type to Prisma enum
      const typeMap: Record<string, NotificationType> = {
        'email': NotificationType.EMAIL,
        'push': NotificationType.PUSH,
        'in-app': NotificationType.IN_APP,
        'all': NotificationType.IN_APP // Default to IN_APP for 'all'
      };

      await prisma.client.notification.create({
        data: {
          userId: data.userId,
          type: typeMap[data.channel || 'in-app'] || NotificationType.IN_APP,
          title: data.title,
          content: data.message, // Use content field instead of message
          metadata: {
            priority: data.priority || 'medium',
            data: data.data,
            readStatus: false // Store read status in metadata
          }
        }
      });
    } catch (error) {
      logger.error('Failed to create notification record', error as Error);
      // Don't throw - notification should still be sent via other channels
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    // Get the current notification
    const notification = await prisma.client.notification.findUnique({
      where: {
        id: notificationId
      }
    });

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    // Update the notification with readAt timestamp
    await prisma.client.notification.update({
      where: {
        id: notificationId
      },
      data: {
        readAt: new Date(),
        metadata: {
          ...notification.metadata as any,
          readStatus: true
        }
      }
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    // Get all unread notifications for the user
    const notifications = await prisma.client.notification.findMany({
      where: {
        userId,
        readAt: null
      }
    });

    // Update each notification individually to handle metadata
    const updatePromises = notifications.map(notification =>
      prisma.client.notification.update({
        where: { id: notification.id },
        data: {
          readAt: new Date(),
          metadata: {
            ...notification.metadata as any,
            readStatus: true
          }
        }
      })
    );

    await Promise.all(updatePromises);
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.client.notification.count({
      where: {
        userId,
        readAt: null
      }
    });
  }
}

// Export singleton instance
export const notificationService = Container.get(SharedNotificationService);
