import 'reflect-metadata';
import { Container } from 'typedi';
import { config } from '@infrastructure/config';
import { logger } from '@shared/logger';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { FastifyServer } from '@infrastructure/server/fastify';
import { queueService } from '@shared/queue/queue.service';
import { EmailService } from '@shared/services/email.service';
import { eventBus } from '@shared/events/event-bus';
import { elasticsearchClient } from '@infrastructure/search/elasticsearch.service';

// Import processors to register them
import '@shared/queue/processors/email.processor';
import '@shared/queue/processors/cleanup.processor';

// Import event handlers
import './modules/user/user.events';
import './modules/notification/notification.events';
import './modules/support/ticket.events.handlers';

// Import module initializers
import { initializeAuthModule, shutdownAuthModule } from './modules/auth';
import { initializeUserModule, shutdownUserModule } from './modules/user';
import { initializeNotificationModule, shutdownNotificationModule } from './modules/notification';
import { initializeBillingModule, shutdownBillingModule } from './modules/billing';
import { initializeTenantModule, shutdownTenantModule } from './modules/tenant';
import { initializeAnalyticsModule, shutdownAnalyticsModule } from './modules/analytics';
import { initializeFeaturesModule, shutdownFeaturesModule } from './modules/features';
import { initializeWebhooksModule, shutdownWebhooksModule } from './modules/webhooks';
import { initializeOnboardingModule, shutdownOnboardingModule } from './modules/onboarding';
import { initializeSupportModule, shutdownSupportModule } from './modules/support';
import { initializeApiUsageModule, shutdownApiUsageModule } from './modules/api-usage';
import { initializeAdminModule, shutdownAdminModule } from './modules/admin';

// Sentry initialization
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

// Module initialization order (respecting dependencies)
const MODULE_INIT_ORDER = [
  { name: 'Auth', init: initializeAuthModule, shutdown: shutdownAuthModule },
  { name: 'User', init: initializeUserModule, shutdown: shutdownUserModule },
  { name: 'Tenant', init: initializeTenantModule, shutdown: shutdownTenantModule },
  { name: 'Billing', init: initializeBillingModule, shutdown: shutdownBillingModule },
  { name: 'Features', init: initializeFeaturesModule, shutdown: shutdownFeaturesModule },
  { name: 'Notification', init: initializeNotificationModule, shutdown: shutdownNotificationModule },
  { name: 'Analytics', init: initializeAnalyticsModule, shutdown: shutdownAnalyticsModule },
  { name: 'Webhooks', init: initializeWebhooksModule, shutdown: shutdownWebhooksModule },
  { name: 'Onboarding', init: initializeOnboardingModule, shutdown: shutdownOnboardingModule },
  { name: 'Support', init: initializeSupportModule, shutdown: shutdownSupportModule },
  { name: 'API Usage', init: initializeApiUsageModule, shutdown: shutdownApiUsageModule },
  { name: 'Admin', init: initializeAdminModule, shutdown: shutdownAdminModule },
];

async function bootstrap() {
  try {
    logger.info('Starting application...', {
      environment: config.app.env,
      version: config.app.version,
    });

    // Initialize Sentry
    if (config.monitoring.sentry.enabled) {
      Sentry.init({
        dsn: config.monitoring.sentry.dsn,
        environment: config.monitoring.sentry.environment,
        integrations: [new ProfilingIntegration()],
        tracesSampleRate: config.monitoring.sentry.tracesSampleRate,
        profilesSampleRate: config.monitoring.sentry.profilesSampleRate,
      });

      logger.info('Sentry initialized');
    }

    // Connect to database
    await prisma.connect();

    // Connect to Redis
    await redis.connect();

    // Connect to Elasticsearch (optional - don't fail if not available)
    try {
      await elasticsearchClient.connect();
    } catch (error) {
      logger.warn('Elasticsearch connection failed - search features will be limited', error as Error);
    }

    // Initialize core services
    Container.get(EmailService);

    // Initialize all modules in order
    for (const module of MODULE_INIT_ORDER) {
      try {
        await module.init();
        logger.info(`${module.name} module initialized`);
      } catch (error) {
        logger.error(`Failed to initialize ${module.name} module`, error as Error);
        // Decide whether to continue or fail based on module criticality
        if (['Auth', 'User', 'Tenant'].includes(module.name)) {
          throw error; // Critical modules - fail startup
        }
        // Non-critical modules - continue with warning
      }
    }

    // Initialize Fastify server
    const server = Container.get(FastifyServer);
    await server.initialize();

    // Start server
    await server.start();

    // Schedule recurring jobs
    await scheduleRecurringJobs();

    logger.info('Application started successfully', {
      modules: MODULE_INIT_ORDER.map(m => m.name),
      url: `http://${config.app.host}:${config.app.port}`,
      docs: config.api.swagger.enabled ? `http://${config.app.host}:${config.app.port}${config.api.swagger.route}` : 'disabled',
    });
  } catch (error) {
    logger.fatal('Failed to start application', error as Error);
    await gracefulShutdown();
    process.exit(1);
  }
}

async function scheduleRecurringJobs() {
  // Core cleanup jobs
  await queueService.addJob(
    'cleanup',
    'expiredTokens',
    {},
    {
      repeat: { cron: '0 * * * *' }, // Every hour
    },
  );

  await queueService.addJob(
    'cleanup',
    'oldSessions',
    {},
    {
      repeat: { cron: '0 3 * * *' }, // Daily at 3 AM
    },
  );

  await queueService.addJob(
    'cleanup',
    'tempFiles',
    {},
    {
      repeat: { cron: '0 */6 * * *' }, // Every 6 hours
    },
  );

  logger.info('Recurring jobs scheduled');
}

async function gracefulShutdown() {
  logger.info('Graceful shutdown initiated...');

  try {
    // Stop accepting new requests
    const server = Container.get(FastifyServer);
    await server.stop();

    // Shutdown modules in reverse order
    for (const module of MODULE_INIT_ORDER.slice().reverse()) {
      try {
        await module.shutdown();
        logger.info(`${module.name} module shut down`);
      } catch (error) {
        logger.error(`Error shutting down ${module.name} module`, error as Error);
      }
    }

    // Close queue connections
    await queueService.close();

    // Clear event listeners
    eventBus.clear();

    // Close Elasticsearch connection
    if (elasticsearchClient.getConnectionStatus()) {
      await elasticsearchClient.disconnect();
    }

    // Close Redis connections
    await redis.disconnect();

    // Close database connections
    await prisma.disconnect();

    logger.info('Graceful shutdown completed');
  } catch (error) {
    logger.error('Error during shutdown', error as Error);
  }
}

// Handle shutdown signals
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received');
  await gracefulShutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received');
  await gracefulShutdown();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  logger.fatal('Uncaught exception', error);
  Sentry.captureException(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.fatal('Unhandled rejection', reason);
  Sentry.captureException(reason);
  process.exit(1);
});

// Start application
bootstrap();
