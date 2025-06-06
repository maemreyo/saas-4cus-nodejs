import { Service } from 'typedi';
import { OnEvent } from '@shared/events/event-bus';
import { ApiUsageEvents } from './api-usage.events';
import { logger } from '@shared/logger';
import { EmailService } from '@shared/services/email.service';
import { WebhookService } from '@modules/webhooks/webhook.service';
import { NotificationService } from '@modules/notification/notification.service';
import { prisma } from '@infrastructure/database/prisma.service';

@Service()
export class ApiUsageEventHandlers {
  constructor(
    private emailService: EmailService,
    private webhookService: WebhookService,
    private notificationService: NotificationService
  ) {}

  @OnEvent(ApiUsageEvents.RATE_LIMIT_WARNING)
  async handleRateLimitWarning(payload: {
    userId: string;
    endpoint: string;
    limit: number;
    used: number;
    percentage: number;
  }) {
    logger.warn('Rate limit warning', payload);

    // Create in-app notification
    await this.notificationService.create({
      userId: payload.userId,
      type: 'WARNING',
      title: `API Quota Warning - ${threshold}% Used`,
      content: `You have used ${threshold}% of your ${payload.resource} quota`,
      metadata: payload
    });
  }

  @OnEvent(ApiUsageEvents.QUOTA_EXCEEDED)
  async handleQuotaExceeded(payload: {
    userId: string;
    resource: string;
    limit: number;
    used: number;
    resetAt: Date;
  }) {
    logger.error('API quota exceeded', payload);

    const user = await prisma.client.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) return;

    // Send email notification
    await this.emailService.queue({
      to: user.email,
      subject: 'API Quota Exceeded',
      template: 'quota-exceeded',
      context: {
        name: user.displayName || user.email,
        resource: payload.resource,
        limit: payload.limit,
        used: payload.used,
        resetAt: payload.resetAt,
        upgradeUrl: '/billing/upgrade'
      }
    });

    // Create urgent in-app notification
    await this.notificationService.create({
      userId: payload.userId,
      type: 'ERROR',
      title: 'API Quota Exceeded',
      content: `Monthly quota for ${payload.resource} has been exceeded. Please upgrade your plan.`,
      metadata: payload,
      priority: 'HIGH'
    });

    // Trigger webhook
    await this.webhookService.trigger('api.quota.exceeded', payload);
  }

  @OnEvent(ApiUsageEvents.HIGH_ERROR_RATE)
  async handleHighErrorRate(payload: {
    endpoint: string;
    errorRate: number;
    timeWindow: string;
    errors: number;
    total: number;
  }) {
    logger.error('High API error rate detected', payload);

    // Notify admins
    const admins = await prisma.client.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
    });

    for (const admin of admins) {
      await this.notificationService.create({
        userId: admin.id,
        type: 'ALERT',
        title: 'High API Error Rate',
        content: `Endpoint ${payload.endpoint} has ${payload.errorRate}% error rate`,
        metadata: payload,
        priority: 'HIGH'
      });
    }

    // Send alert email to ops team
    if (process.env.OPS_ALERT_EMAIL) {
      await this.emailService.queue({
        to: process.env.OPS_ALERT_EMAIL,
        subject: `[ALERT] High Error Rate on ${payload.endpoint}`,
        template: 'api-error-alert',
        context: payload
      });
    }
  }

  @OnEvent(ApiUsageEvents.SLOW_RESPONSE_TIME)
  async handleSlowResponseTime(payload: {
    endpoint: string;
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    timeWindow: string;
  }) {
    logger.warn('Slow API response time detected', payload);

    // Log to monitoring system
    logger.metric('api.response_time.slow', payload.averageResponseTime, {
      endpoint: payload.endpoint,
      p95: payload.p95ResponseTime.toString(),
      p99: payload.p99ResponseTime.toString()
    });

    // Notify admins if critically slow
    if (payload.averageResponseTime > 5000) {
      const admins = await prisma.client.user.findMany({
        where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
      });

      for (const admin of admins) {
        await this.notificationService.create({
          userId: admin.id,
          type: 'ALERT',
          title: 'Critical API Performance Issue',
          content: `Endpoint ${payload.endpoint} averaging ${payload.averageResponseTime}ms response time`,
          metadata: payload,
          priority: 'HIGH'
        });
      }
    }
  }

  @OnEvent(ApiUsageEvents.API_HEALTH_DEGRADED)
  async handleApiHealthDegraded(payload: {
    status: string;
    metrics: any;
    issues: string[];
  }) {
    logger.warn('API health degraded', payload);

    // Create incident
    await prisma.client.incident.create({
      data: {
        title: 'API Health Degraded',
        description: `API health check returned degraded status: ${payload.issues.join(', ')}`,
        severity: 'MEDIUM',
        status: 'OPEN',
        metadata: payload
      }
    });

    // Notify ops team
    if (process.env.OPS_ALERT_EMAIL) {
      await this.emailService.queue({
        to: process.env.OPS_ALERT_EMAIL,
        subject: '[WARNING] API Health Degraded',
        template: 'api-health-alert',
        context: payload
      });
    }
  }

  @OnEvent(ApiUsageEvents.API_HEALTH_UNHEALTHY)
  async handleApiHealthUnhealthy(payload: {
    status: string;
    metrics: any;
    issues: string[];
  }) {
    logger.error('API health unhealthy', payload);

    // Create critical incident
    await prisma.client.incident.create({
      data: {
        title: 'API Health Critical',
        description: `API health check returned unhealthy status: ${payload.issues.join(', ')}`,
        severity: 'HIGH',
        status: 'OPEN',
        metadata: payload
      }
    });

    // Page on-call engineer
    if (process.env.PAGERDUTY_INTEGRATION_KEY) {
      // Send PagerDuty alert
      logger.error('Triggering PagerDuty alert for unhealthy API');
    }

    // Notify all admins
    const admins = await prisma.client.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
    });

    for (const admin of admins) {
      await this.notificationService.create({
        userId: admin.id,
        type: 'CRITICAL',
        title: 'API Health Critical',
        content: 'API health check failed. Immediate action required.',
        metadata: payload,
        priority: 'CRITICAL'
      });

      // Also send email for critical alerts
      await this.emailService.queue({
        to: admin.email,
        subject: '[CRITICAL] API Health Check Failed',
        template: 'api-critical-alert',
        context: payload
      });
    }
  }

  @OnEvent(ApiUsageEvents.API_HEALTH_RECOVERED)
  async handleApiHealthRecovered(payload: {
    previousStatus: string;
    currentStatus: string;
    downtime: number; // in minutes
    metrics: any;
  }) {
    logger.info('API health recovered', payload);

    // Update incident
    await prisma.client.incident.updateMany({
      where: {
        title: { in: ['API Health Degraded', 'API Health Critical'] },
        status: 'OPEN'
      },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolution: `API health recovered after ${payload.downtime} minutes`
      }
    });

    // Notify admins
    const admins = await prisma.client.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
    });

    for (const admin of admins) {
      await this.notificationService.create({
        userId: admin.id,
        type: 'INFO',
        title: 'API Health Recovered',
        content: `API health has recovered after ${payload.downtime} minutes of degradation`,
        metadata: payload
      });
    }
  }

  @OnEvent(ApiUsageEvents.USAGE_REPORT_GENERATED)
  async handleUsageReportGenerated(payload: {
    userId: string;
    reportType: string;
    period: string;
    fileUrl: string;
  }) {
    logger.info('Usage report generated', payload);

    const user = await prisma.client.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) return;

    // Send email with report
    await this.emailService.queue({
      to: user.email,
      subject: `Your API Usage Report - ${payload.period}`,
      template: 'usage-report',
      context: {
        name: user.displayName || user.email,
        reportType: payload.reportType,
        period: payload.period,
        downloadUrl: payload.fileUrl
      }
    });

    // Create notification
    await this.notificationService.create({
      userId: payload.userId,
      type: 'INFO',
      title: 'API Usage Report Ready',
      content: `Your ${payload.reportType} report for ${payload.period} is ready for download`,
      metadata: payload
    });
  }
} notification
    await this.notificationService.create({
      userId: payload.userId,
      type: 'WARNING',
      title: 'API Rate Limit Warning',
      content: `You have used ${payload.percentage}% of your rate limit for ${payload.endpoint}`,
      metadata: payload
    });
  }

  @OnEvent(ApiUsageEvents.RATE_LIMIT_EXCEEDED)
  async handleRateLimitExceeded(payload: {
    userId: string;
    endpoint: string;
    limit: number;
    resetAt: Date;
  }) {
    logger.error('Rate limit exceeded', payload);

    const user = await prisma.client.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) return;

    // Send email notification
    await this.emailService.queue({
      to: user.email,
      subject: 'API Rate Limit Exceeded',
      template: 'rate-limit-exceeded',
      context: {
        name: user.displayName || user.email,
        endpoint: payload.endpoint,
        limit: payload.limit,
        resetAt: payload.resetAt
      }
    });

    // Create in-app notification
    await this.notificationService.create({
      userId: payload.userId,
      type: 'ERROR',
      title: 'API Rate Limit Exceeded',
      content: `Rate limit exceeded for ${payload.endpoint}. Resets at ${payload.resetAt}`,
      metadata: payload
    });
  }

  @OnEvent(ApiUsageEvents.QUOTA_WARNING)
  async handleQuotaWarning(payload: {
    userId: string;
    resource: string;
    limit: number;
    used: number;
    percentage: number;
  }) {
    logger.warn('API quota warning', payload);

    // Only send warning at specific thresholds
    const thresholds = [80, 90, 95];
    const threshold = thresholds.find(t => payload.percentage >= t && payload.percentage < t + 5);

    if (!threshold) return;

    const user = await prisma.client.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) return;

    // Send email notification
    await this.emailService.queue({
      to: user.email,
      subject: `API Quota Warning - ${threshold}% Used`,
      template: 'quota-warning',
      context: {
        name: user.displayName || user.email,
        resource: payload.resource,
        percentage: threshold,
        used: payload.used,
        limit: payload.limit,
        remaining: payload.limit - payload.used,
        upgradeUrl: '/billing/upgrade'
      }
    });

    // Create in-app