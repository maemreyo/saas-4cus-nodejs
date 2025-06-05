import { Service } from 'typedi';
import { OnEvent } from '@shared/events/event-bus';
import { Events } from '@shared/events/events';
import { logger } from '@shared/logger';

@Service()
export class NotificationEventHandlers {
  @OnEvent(Events.NOTIFICATION_CREATED)
  async handleNotificationCreated(payload: any) {
    logger.info('Notification created event', payload);
    // TODO: Send push notification, email, etc.
  }
}
