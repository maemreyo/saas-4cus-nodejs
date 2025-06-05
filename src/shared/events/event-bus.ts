import { EventEmitter } from 'events'
import { Service } from 'typedi'
import { logger } from '@shared/logger'
import { redis } from '@infrastructure/cache/redis.service'

export interface EventPayload {
  timestamp: Date
  [key: string]: any
}

export type EventHandler<T = any> = (payload: T) => void | Promise<void>

@Service()
export class EventBus {
  private emitter: EventEmitter
  private handlers: Map<string, Set<EventHandler>> = new Map()

  constructor() {
    this.emitter = new EventEmitter()
    this.emitter.setMaxListeners(100) // Increase max listeners
    this.setupRedisSubscriber()
  }

  // Set up Redis subscriber for distributed events
  private setupRedisSubscriber() {
    redis.subscribe('events:*', (message: any) => {
      const { event, payload } = message
      this.emitLocal(event, payload)
    })
  }

  // Register event handler
  on<T = EventPayload>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }

    this.handlers.get(event)!.add(handler as EventHandler)

    this.emitter.on(event, async (payload: T) => {
      try {
        await handler(payload)
      } catch (error) {
        logger.error(`Event handler error for ${event}`, error as Error, { event, payload })
      }
    })
  }

  // Register one-time event handler
  once<T = EventPayload>(event: string, handler: EventHandler<T>): void {
    this.emitter.once(event, async (payload: T) => {
      try {
        await handler(payload)
      } catch (error) {
        logger.error(`Event handler error for ${event}`, error as Error, { event, payload })
      }
    })
  }

  // Remove event handler
  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler)
    this.emitter.off(event, handler)
  }

  // Emit event locally
  emitLocal<T = EventPayload>(event: string, payload: T): void {
    logger.debug('Event emitted locally', { event, payload })
    this.emitter.emit(event, payload)
  }

  // Emit event (distributed)
  async emit<T = EventPayload>(event: string, payload: T): Promise<void> {
    try {
      // Emit locally
      this.emitLocal(event, payload)

      // Publish to Redis for other instances
      await redis.publish(`events:${event}`, { event, payload })

      logger.debug('Event emitted', { event, payload })
    } catch (error) {
      logger.error('Failed to emit event', error as Error, { event, payload })
    }
  }

  // Wait for event
  async waitFor<T = EventPayload>(event: string, timeout?: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = timeout ? setTimeout(() => {
        this.off(event, handler)
        reject(new Error(`Event ${event} timeout after ${timeout}ms`))
      }, timeout) : null

      const handler = (payload: T) => {
        if (timer) clearTimeout(timer)
        resolve(payload)
      }

      this.once(event, handler)
    })
  }

  // Get registered events
  getEvents(): string[] {
    return Array.from(this.handlers.keys())
  }

  // Get handler count for event
  getHandlerCount(event: string): number {
    return this.handlers.get(event)?.size || 0
  }

  // Clear all handlers
  clear(): void {
    this.emitter.removeAllListeners()
    this.handlers.clear()
  }
}

// Create singleton instance
export const eventBus = new EventBus()

// Event decorators
export function OnEvent(event: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    // Register handler on class instantiation
    const handler = async (payload: any) => {
      try {
        await originalMethod.call(target, payload)
      } catch (error) {
        logger.error(`Event handler error for ${event}`, error as Error)
      }
    }

    eventBus.on(event, handler)

    return descriptor
  }
}