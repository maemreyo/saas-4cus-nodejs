import 'reflect-metadata'
import { Container } from 'typedi'
import { config } from '@infrastructure/config'
import { logger } from '@shared/logger'
import { prisma } from '@infrastructure/database/prisma.service'
import { redis } from '@infrastructure/cache/redis.service'
import { FastifyServer } from '@infrastructure/server/fastify'
import { queueService } from '@shared/queue/queue.service'
import { EmailService } from '@shared/services/email.service'
import { eventBus } from '@shared/events/event-bus'

// Import processors to register them
import '@shared/queue/processors/email.processor'
import '@shared/queue/processors/cleanup.processor'

// Import event handlers
import './modules/user/user.events'
import './modules/notification/notification.events'

// Sentry initialization
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'

async function bootstrap() {
  try {
    logger.info('Starting application...', {
      environment: config.app.env,
      version: config.app.version
    })

    // Initialize Sentry
    if (config.monitoring.sentry.enabled) {
      Sentry.init({
        dsn: config.monitoring.sentry.dsn,
        environment: config.monitoring.sentry.environment,
        integrations: [
          new ProfilingIntegration()
        ],
        tracesSampleRate: config.monitoring.sentry.tracesSampleRate,
        profilesSampleRate: config.monitoring.sentry.profilesSampleRate
      })

      logger.info('Sentry initialized')
    }

    // Connect to database
    await prisma.connect()

    // Connect to Redis
    await redis.connect()

    // Initialize services
    Container.get(EmailService)

    // Initialize Fastify server
    const server = Container.get(FastifyServer)
    await server.initialize()

    // Start server
    await server.start()

    // Schedule recurring jobs
    await scheduleRecurringJobs()

    logger.info('Application started successfully')
  } catch (error) {
    logger.fatal('Failed to start application', error as Error)
    await gracefulShutdown()
    process.exit(1)
  }
}

async function scheduleRecurringJobs() {
  // Clean expired tokens every hour
  await queueService.addJob('cleanup', 'expiredTokens', {}, {
    repeat: { cron: '0 * * * *' }
  })

  // Clean old sessions every day at 3 AM
  await queueService.addJob('cleanup', 'oldSessions', {}, {
    repeat: { cron: '0 3 * * *' }
  })

  // Clean temporary files every 6 hours
  await queueService.addJob('cleanup', 'tempFiles', {}, {
    repeat: { cron: '0 */6 * * *' }
  })

  logger.info('Recurring jobs scheduled')
}

async function gracefulShutdown() {
  logger.info('Graceful shutdown initiated...')

  try {
    // Stop accepting new requests
    const server = Container.get(FastifyServer)
    await server.stop()

    // Close queue connections
    await queueService.close()

    // Clear event listeners
    eventBus.clear()

    // Close Redis connections
    await redis.disconnect()

    // Close database connections
    await prisma.disconnect()

    logger.info('Graceful shutdown completed')
  } catch (error) {
    logger.error('Error during shutdown', error as Error)
  }
}

// Handle shutdown signals
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received')
  await gracefulShutdown()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received')
  await gracefulShutdown()
  process.exit(0)
})

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  logger.fatal('Uncaught exception', error)
  Sentry.captureException(error)
  process.exit(1)
})

process.on('unhandledRejection', (reason: any) => {
  logger.fatal('Unhandled rejection', reason)
  Sentry.captureException(reason)
  process.exit(1)
})

// Start application
bootstrap()
