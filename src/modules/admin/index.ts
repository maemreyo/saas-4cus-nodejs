import { Container } from 'typedi';
import { logger } from '@shared/logger';
import { QueueService } from '@shared/queue/queue.service';
import { EventBus } from '@shared/events/event-bus';
import { AdminUserService } from './admin-user.service';
import { AdminMetricsService } from './admin-metrics.service';
import { AdminModerationService } from './admin-moderation.service';
import { SystemConfigService } from './system-config.service';
import { AnnouncementService } from './announcement.service';
import { DataExportService } from './data-export.service';
import { AdminController } from './admin.controller';
import { redis } from '@infrastructure/cache/redis.service';
import { prisma } from '@infrastructure/database/prisma.service';

// Export all admin services
export * from './admin-user.service';
export * from './admin-metrics.service';
export * from './admin-moderation.service';
export * from './system-config.service';
export * from './announcement.service';
export * from './data-export.service';
export * from './admin.controller';
export * from './admin.middleware';
export * from './admin.dto';

// Export routes
export { default as adminRoutes } from './admin.route';

/**
 * Initialize the admin module
 */
export async function initializeAdminModule(): Promise<void> {
  try {
    logger.info('Initializing admin module...');

    // Initialize services
    const adminUserService = Container.get(AdminUserService);
    const adminMetricsService = Container.get(AdminMetricsService);
    const adminModerationService = Container.get(AdminModerationService);
    const systemConfigService = Container.get(SystemConfigService);
    const announcementService = Container.get(AnnouncementService);
    const dataExportService = Container.get(DataExportService);
    const queueService = Container.get(QueueService);
    const eventBus = Container.get(EventBus);

    // Register queue processors
    queueService.registerProcessor('export', 'data-export', async job => {
      const { exportId, options } = job.data;
      return await dataExportService.processExport(exportId, options);
    });

    queueService.registerProcessor('admin', 'audit-cleanup', async job => {
      const { retentionDays = 90 } = job.data;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await prisma.client.auditLog.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
        },
      });

      logger.info('Audit logs cleaned up', {
        deleted: result.count,
        retentionDays,
      });

      return { deleted: result.count };
    });

    queueService.registerProcessor('admin', 'metrics-aggregation', async job => {
      // Aggregate metrics for dashboard
      const metrics = await adminMetricsService.getSystemMetrics();

      // Cache aggregated metrics
      await redis.set('admin:metrics:aggregated', metrics, { ttl: 300 });

      logger.info('Metrics aggregated successfully');

      return { status: 'completed' };
    });

    // Schedule recurring admin jobs
    await scheduleAdminJobs(queueService);

    // Register event handlers
    registerAdminEventHandlers(eventBus);

    // Initialize default system configuration
    await initializeSystemConfig(systemConfigService);

    // Set up real-time metrics collection
    await setupMetricsCollection();

    logger.info('Admin module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize admin module', error as Error);
    throw error;
  }
}

/**
 * Schedule recurring admin jobs
 */
async function scheduleAdminJobs(queueService: QueueService): Promise<void> {
  // Audit log cleanup - daily at 3 AM
  await queueService.addJob(
    'admin',
    'audit-cleanup',
    { retentionDays: 90 },
    {
      repeat: { cron: '0 3 * * *' },
    },
  );

  // Metrics aggregation - every 5 minutes
  await queueService.addJob(
    'admin',
    'metrics-aggregation',
    {},
    {
      repeat: { cron: '*/5 * * * *' },
    },
  );

  // System health check - every minute
  await queueService.addJob(
    'admin',
    'health-check',
    {},
    {
      repeat: { cron: '* * * * *' },
    },
  );

  logger.info('Admin recurring jobs scheduled');
}

/**
 * Register admin event handlers
 */
function registerAdminEventHandlers(eventBus: EventBus): void {
  // User events
  eventBus.on('user.suspended', async (payload: any) => {
    logger.info('User suspended event received', payload);
    // Could send notifications, update metrics, etc.
  });

  eventBus.on('user.deleted', async (payload: any) => {
    logger.info('User deleted event received', payload);
    // Clean up user data, update metrics
  });

  // System events
  eventBus.on('system.maintenance.enabled', async (payload: any) => {
    // Cache maintenance status for quick checks
    await redis.set('system:maintenance:enabled', true, { ttl: 86400 });
    await redis.set('system:maintenance:info', payload, { ttl: 86400 });
  });

  eventBus.on('system.maintenance.disabled', async () => {
    await redis.delete('system:maintenance:enabled');
    await redis.delete('system:maintenance:info');
  });

  // Config events
  eventBus.on('admin.config.updated', async (payload: any) => {
    // Clear config cache to force reload
    await redis.delete('system:config:*');
  });

  // Security events
  eventBus.on('security.threat.detected', async (payload: any) => {
    logger.security('Security threat detected', payload);
    // Could trigger automatic responses
  });
}

/**
 * Initialize default system configuration
 */
async function initializeSystemConfig(configService: SystemConfigService): Promise<void> {
  try {
    // Check if config exists
    const existingConfig = await configService.getConfig();

    if (!existingConfig || Object.keys(existingConfig).length === 0) {
      logger.info('Initializing default system configuration');

      // Set default configuration
      await configService.updateConfig({
        maintenance: {
          enabled: false,
          message: 'The system is currently under maintenance. Please check back later.',
        },
        features: {
          registration: true,
          oauth: true,
          twoFactorAuth: true, // Changed from twoFactor to twoFactorAuth
          emailVerification: true,
          apiAccess: true,
          fileUpload: true,
          publicProfiles: false,
        },
        limits: {
          maxUsersPerTenant: 100,
          maxProjectsPerUser: 50,
          maxFileSize: 10 * 1024 * 1024, // 10MB
          maxStoragePerUser: 1024 * 1024 * 1024, // 1GB
          apiRateLimit: 100,
          maxTeamSize: 50,
          maxConcurrentSessions: 5,
        },
        security: {
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireLowercase: true,
          passwordRequireNumbers: true,
          passwordRequireSpecial: true,
          sessionTimeout: 60,
          maxLoginAttempts: 5,
          lockoutDuration: 15,
          enforceIpWhitelist: false,
          requireEmailVerification: true,
          require2FAForAdmins: false,
        },
      });
    }
  } catch (error) {
    logger.error('Failed to initialize system config', error as Error);
  }
}

/**
 * Set up real-time metrics collection
 */
async function setupMetricsCollection(): Promise<void> {
  // Initialize metrics counters
  await redis.set('metrics:requests:total', 0);
  await redis.set('metrics:errors:total', 0);

  // Set up periodic metrics reset
  setInterval(async () => {
    try {
      // Get current values
      const requests = (await redis.get('metrics:requests:1min')) || 0;
      const errors = (await redis.get('metrics:errors:1min')) || 0;

      // Calculate rates
      const rpm = Number(requests);
      const epm = Number(errors);

      // Store rates
      await redis.set('metrics:rpm', rpm);
      await redis.set('metrics:epm', epm);

      // Reset counters
      await redis.set('metrics:requests:1min', 0);
      await redis.set('metrics:errors:1min', 0);

      // Update 5-minute counters
      await redis.increment('metrics:requests:5min', rpm);
      await redis.increment('metrics:errors:5min', epm);
    } catch (error) {
      logger.error('Metrics collection error', error as Error);
    }
  }, 60000); // Every minute

  // Reset 5-minute counters
  setInterval(async () => {
    await redis.set('metrics:requests:5min', 0);
    await redis.set('metrics:errors:5min', 0);
  }, 300000); // Every 5 minutes

  logger.info('Real-time metrics collection started');
}

/**
 * Shutdown the admin module
 */
export async function shutdownAdminModule(): Promise<void> {
  try {
    logger.info('Shutting down admin module...');

    // Clear any cached data
    await redis.delete('admin:*');
    await redis.delete('system:*');

    logger.info('Admin module shut down successfully');
  } catch (error) {
    logger.error('Error shutting down admin module', error as Error);
  }
}
