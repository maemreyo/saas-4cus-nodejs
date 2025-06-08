import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { NotificationService } from './notification.service';
import { validateSchema } from '@shared/validators';
import {
  CreateNotificationDTO,
  UpdatePreferencesDTO,
  MarkNotificationsReadDTO
} from './notification.dto';

@Service()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  /**
   * Get user notifications
   */
  async getNotifications(
    request: FastifyRequest<{
      Querystring: {
        limit?: number;
        offset?: number;
        unreadOnly?: boolean;
        type?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.customUser!.id;
    const { limit, offset, unreadOnly, type } = request.query;

    const result = await this.notificationService.getUserNotifications(userId, {
      limit,
      offset,
      unreadOnly,
      type
    });

    reply.send({ data: result });
  }

  /**
   * Create notification (internal/admin use)
   */
  async createNotification(
    request: FastifyRequest<{ Body: CreateNotificationDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(CreateNotificationDTO.schema, request.body) as any;

    const notification = await this.notificationService.create(dto);

    reply.code(201).send({
      message: 'Notification created successfully',
      data: { notification }
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(
    request: FastifyRequest<{ Params: { notificationId: string } }>,
    reply: FastifyReply
  ) {
    const userId = request.customUser!.id;
    const { notificationId } = request.params;

    await this.notificationService.markAsRead(notificationId, userId);

    reply.send({
      message: 'Notification marked as read'
    });
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(
    request: FastifyRequest<{ Body: MarkNotificationsReadDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(MarkNotificationsReadDTO.schema, request.body);
    const userId = request.customUser!.id;

    if (dto.markAll) {
      await this.notificationService.markAllAsRead(userId);
    } else if (dto.notificationIds) {
      for (const notificationId of dto.notificationIds) {
        await this.notificationService.markAsRead(notificationId, userId);
      }
    }

    reply.send({
      message: 'Notifications marked as read'
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(
    request: FastifyRequest<{ Params: { notificationId: string } }>,
    reply: FastifyReply
  ) {
    const userId = request.customUser!.id;
    const { notificationId } = request.params;

    await this.notificationService.deleteNotification(notificationId, userId);

    reply.send({
      message: 'Notification deleted successfully'
    });
  }

  /**
   * Get notification preferences
   */
  async getPreferences(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const preferences = await this.notificationService.getUserPreferences(userId);

    reply.send({ data: { preferences } });
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(
    request: FastifyRequest<{ Body: UpdatePreferencesDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(UpdatePreferencesDTO.schema, request.body) as any;
    const userId = request.customUser!.id;

    await this.notificationService.updateUserPreferences(userId, dto);

    reply.send({
      message: 'Preferences updated successfully'
    });
  }

  /**
   * Get notification statistics
   */
  async getStatistics(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const stats = await this.notificationService.getStatistics(userId);

    reply.send({ data: stats });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const result = await this.notificationService.getUserNotifications(userId, {
      unreadOnly: true,
      limit: 0
    });

    reply.send({ data: { unread: result.unread } });
  }
}
