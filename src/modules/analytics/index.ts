import { Container } from 'typedi';
import { AnalyticsService } from './analytics.service';
import { ReportService } from './report.service';
import { AnalyticsController } from './analytics.controller';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';

// Export all components
export { AnalyticsService } from './analytics.service';
export { ReportService } from './report.service';
export { AnalyticsController } from './analytics.controller';
export * from './analytics.dto';

// Export types
export type {
  AnalyticsEvent,
  MetricData,
  TimeSeriesData,
  DashboardMetrics
} from './analytics.service';

export type {
  ReportOptions
} from './report.service';

// Export routes
export { default as analyticsRoutes } from './analytics.route';

// Register queue processors
function registerQueueProcessors() {
  queueService.registerProcessor('report', 'generate', async (job) => {
    const reportService = Container.get(ReportService);
    const { __jobId, ...options } = job.data;
    await reportService.generateReport(options);
  });
}

/**
 * Initialize Analytics module
 */
export async function initializeAnalyticsModule(): Promise<void> {
  try {
    logger.info('Initializing analytics module...');

    // Initialize services
    Container.get(AnalyticsService);
    Container.get(ReportService);
    Container.get(AnalyticsController);

    // Register queue processors
    registerQueueProcessors();

    logger.info('Analytics module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize analytics module', error as Error);
    throw error;
  }
}

/**
 * Shutdown Analytics module
 */
export async function shutdownAnalyticsModule(): Promise<void> {
  logger.info('Analytics module shut down');
}

// Convenience function for tracking events
export async function trackEvent(event: string, properties?: any, userId?: string, tenantId?: string): Promise<void> {
  const analyticsService = Container.get(AnalyticsService);
  await analyticsService.track({
    event,
    properties,
    userId,
    tenantId,
    timestamp: new Date()
  });
}

// Convenience function for tracking page views
export async function trackPageView(page: string, userId?: string, properties?: any): Promise<void> {
  const analyticsService = Container.get(AnalyticsService);
  await analyticsService.trackPageView(userId, page, properties);
}
