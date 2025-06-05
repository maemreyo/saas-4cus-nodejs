import { Service } from 'typedi'
import { OnEvent } from '@shared/events/event-bus'
import { Events } from '@shared/events/events'
import { logger } from '@shared/logger'

@Service()
export class UserEventHandlers {
  @OnEvent(Events.USER_REGISTERED)
  async handleUserRegistered(payload: any) {
    logger.info('User registered event', payload)
    // TODO: Send welcome email, analytics, etc.
  }

  @OnEvent(Events.USER_LOGGED_IN)
  async handleUserLoggedIn(payload: any) {
    logger.info('User logged in event', payload)
    // TODO: Update last login, track analytics
  }
}