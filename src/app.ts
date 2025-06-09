// Updated: Integrated with ModuleManager and EnvironmentValidator
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
import { moduleManager } from '@infrastructure/modules/module-manager';
import { EnvironmentValidator } from '@infrastructure/config/env-validator';
import { elasticsearchClient } from '@infrastructure/search/elasticsearch.service';

// Import processors to register them
import '@shared/queue/processors/email.processor';
import '@shared/queue/processors/cleanup.processor';

// Import event handlers to register them
import '@modules/user/user.events';
import '@modules/notification/notification.events';
import '@modules/support/ticket.events.handlers';

// Sentry initialization
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

async function bootstrap() {
  try {
    logger.info('Starting application...', {
      environment: config.app.env,
      version: config.app.version,
    });

    // Step 1: Validate environment
    logger.info('Validating environment...');
    await EnvironmentValidator.checkAndCreateEnvFile();
    const envValidation = EnvironmentValidator.validate();
    EnvironmentValidator.printReport(envValidation);

    if (!envValidation.valid) {
      logger.fatal('Environment validation failed. Please check your .env file.');
      process.exit(1);
    }

    // Step 2: Initialize Sentry (if enabled)
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

    // Step 3: Connect to core services
    logger.info('Connecting to core services...');

    // Database
    await prisma.connect();
    logger.info('Database connected');

    // Redis
    await redis.connect();
    logger.info('Redis connected');

    // Elasticsearch (optional)
    try {
      await elasticsearchClient.connect();
      logger.info('Elasticsearch connected');
    } catch (error) {
      logger.warn('Elasticsearch connection failed - search features may be limited', error as Error);
    }

    // Step 4: Initialize core services
    Container.get(EmailService);
    logger.info('Core services initialized');

    // Step 5: Initialize all modules using ModuleManager
    logger.info('Initializing application modules...');
    await moduleManager.initializeAll();

    // Step 6: Initialize Fastify server
    const server = Container.get(FastifyServer);
    await server.initialize();

    // Step 7: Schedule recurring jobs
    await scheduleRecurringJobs();

    // Step 8: Start server
    await server.start();

    // Step 9: Log startup success
    const initializedModules = moduleManager.getInitializedModules();
    logger.info('Application started successfully', {
      modules: initializedModules,
      environment: config.app.env,
      port: config.app.port,
    });

    // Step 10: Print startup summary
    printStartupSummary();

  } catch (error) {
    logger.fatal('Failed to start application', error as Error);
    await gracefulShutdown();
    process.exit(1);
  }
}

async function scheduleRecurringJobs() {
  // Clean expired tokens every hour
  await queueService.addJob(
    'cleanup',
    'expiredTokens',
    {},
    {
      repeat: { cron: '0 * * * *' },
    },
  );

  // Clean old sessions every day at 3 AM
  await queueService.addJob(
    'cleanup',
    'oldSessions',
    {},
    {
      repeat: { cron: '0 3 * * *' },
    },
  );

  // Clean temporary files every 6 hours
  await queueService.addJob(
    'cleanup',
    'tempFiles',
    {},
    {
      repeat: { cron: '0 */6 * * *' },
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

    // Shutdown all modules via ModuleManager
    await moduleManager.shutdownAll();

    // Close queue connections
    await queueService.close();

    // Clear event listeners
    eventBus.clear();

    // Close search connections
    await elasticsearchClient.disconnect();

    // Close Redis connections
    await redis.disconnect();

    // Close database connections
    await prisma.disconnect();

    logger.info('Graceful shutdown completed');
  } catch (error) {
    logger.error('Error during shutdown', error as Error);
  }
}

function printStartupSummary() {
  const modules = moduleManager.getInitializedModules();
  const urls = {
    api: `http://localhost:${config.app.port}`,
    swagger: config.api.swagger.enabled ? `http://localhost:${config.app.port}${config.api.swagger.route}` : null,
    health: `http://localhost:${config.app.port}/health`,
  };

  console.log('\n===========================================');
  console.log('🚀 Modern Backend Template Started Successfully!');
  console.log('===========================================\n');
  console.log(`Environment: ${config.app.env}`);
  console.log(`Version: ${config.app.version}\n`);

  console.log('📡 URLs:');
  console.log(`   API: ${urls.api}`);
  if (urls.swagger) {
    console.log(`   Swagger: ${urls.swagger}`);
  }
  console.log(`   Health: ${urls.health}\n`);

  console.log('📦 Active Modules:');
  modules.forEach(module => {
    console.log(`   ✅ ${module}`);
  });

  console.log('\n🔧 Quick Commands:');
  console.log('   pnpm dev          - Start development server');
  console.log('   pnpm test         - Run tests');
  console.log('   pnpm db:studio    - Open Prisma Studio');
  console.log('   pnpm logs         - View logs');

  console.log('\n===========================================\n');
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