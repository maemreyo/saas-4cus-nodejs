import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';
import { EmailService } from '@shared/services/email.service';
import { AnalyticsService } from './analytics.service';
import { StorageService } from '@/shared/services/storage.service';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import { format } from 'date-fns';
import { SubscriptionStatus } from '@prisma/client';

export interface ReportOptions {
  type: 'dashboard' | 'revenue' | 'users' | 'custom';
  format: 'pdf' | 'csv' | 'json';
  recipients?: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    hour?: number;
  };
  filters?: {
    tenantId?: string;
    dateRange?: number;
    startDate?: Date;
    endDate?: Date;
  };
  customQuery?: any;
}

@Service()
export class ReportService {
  constructor(
    private analyticsService: AnalyticsService,
    private emailService: EmailService,
    private storageService: StorageService,
  ) {}

  /**
   * Generate report
   */
  async generateReport(options: ReportOptions): Promise<{
    url: string;
    filename: string;
    size: number;
  }> {
    logger.info('Generating report', { type: options.type, format: options.format });

    let data: any;
    let filename: string;

    // Get report data
    switch (options.type) {
      case 'dashboard':
        data = await this.getDashboardReportData(options.filters);
        filename = `dashboard-report-${format(new Date(), 'yyyy-MM-dd')}`;
        break;

      case 'revenue':
        data = await this.getRevenueReportData(options.filters);
        filename = `revenue-report-${format(new Date(), 'yyyy-MM-dd')}`;
        break;

      case 'users':
        data = await this.getUsersReportData(options.filters);
        filename = `users-report-${format(new Date(), 'yyyy-MM-dd')}`;
        break;

      case 'custom':
        data = await this.getCustomReportData(options.customQuery);
        filename = `custom-report-${format(new Date(), 'yyyy-MM-dd')}`;
        break;

      default:
        throw new Error(`Unknown report type: ${options.type}`);
    }

    // Generate report file
    let file: Buffer;
    let mimeType: string;

    switch (options.format) {
      case 'pdf':
        file = await this.generatePDF(data, options.type);
        mimeType = 'application/pdf';
        filename += '.pdf';
        break;

      case 'csv':
        file = await this.generateCSV(data);
        mimeType = 'text/csv';
        filename += '.csv';
        break;

      case 'json':
        file = Buffer.from(JSON.stringify(data, null, 2));
        mimeType = 'application/json';
        filename += '.json';
        break;

      default:
        throw new Error(`Unknown format: ${options.format}`);
    }

    // Upload to storage
    const { url } = await this.storageService.upload({
      buffer: file,
      filename,
      mimeType,
      path: 'reports',
    });

    // Send to recipients if specified
    if (options.recipients && options.recipients.length > 0) {
      await this.sendReportEmail(options.recipients, {
        url,
        filename,
        type: options.type,
      });
    }

    return {
      url,
      filename,
      size: file.length,
    };
  }

  /**
   * Schedule recurring report
   */
  async scheduleReport(options: ReportOptions & { name: string }): Promise<string> {
    const jobId = `report:${options.name}`;

    let repeatOptions: any;
    if (options.schedule) {
      switch (options.schedule.frequency) {
        case 'daily':
          repeatOptions = {
            cron: `0 ${options.schedule.hour || 9} * * *`,
          };
          break;

        case 'weekly':
          repeatOptions = {
            cron: `0 ${options.schedule.hour || 9} * * ${options.schedule.dayOfWeek || 1}`,
          };
          break;

        case 'monthly':
          repeatOptions = {
            cron: `0 ${options.schedule.hour || 9} ${options.schedule.dayOfMonth || 1} * *`,
          };
          break;
      }
    }

    await queueService.addJob(
      'report',
      'generate',
      {
        ...options,
        __jobId: jobId,
      },
      {
        repeat: repeatOptions,
      },
    );

    logger.info('Report scheduled', { jobId, schedule: options.schedule });

    return jobId;
  }

  /**
   * Get dashboard report data
   */
  private async getDashboardReportData(filters?: any): Promise<any> {
    const metrics = await this.analyticsService.getDashboardMetrics(filters?.tenantId, filters?.dateRange || 30);

    return {
      generatedAt: new Date(),
      period: {
        start: filters?.startDate || new Date(Date.now() - (filters?.dateRange || 30) * 24 * 60 * 60 * 1000),
        end: filters?.endDate || new Date(),
      },
      metrics,
    };
  }

  /**
   * Get revenue report data
   */
  private async getRevenueReportData(filters?: any): Promise<any> {
    const where = {
      ...(filters?.tenantId && { subscription: { tenantId: filters.tenantId } }),
      ...(filters?.startDate &&
        filters?.endDate && {
          paidAt: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
    };

    const [invoices, summary, byPlan, byMonth] = await Promise.all([
      // Recent invoices
      prisma.client.invoice.findMany({
        where,
        include: {
          subscription: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { paidAt: 'desc' },
        take: 100,
      }),

      // Summary
      prisma.client.invoice.aggregate({
        where,
        _sum: { amount: true },
        _count: { id: true },
        _avg: { amount: true },
      }),

      // Revenue by plan - Fixed groupBy
      this.getRevenueByPlan(filters?.tenantId),

      // Monthly revenue
      prisma.client.$queryRaw`
        SELECT
          DATE_TRUNC('month', paid_at) as month,
          SUM(amount) as revenue,
          COUNT(*) as transactions
        FROM invoices
        WHERE status = 'paid'
          ${filters?.tenantId ? prisma.client.$queryRaw`AND subscription_id IN (SELECT id FROM subscriptions WHERE tenant_id = ${filters.tenantId})` : prisma.client.$queryRaw``}
          ${filters?.startDate ? prisma.client.$queryRaw`AND paid_at >= ${filters.startDate}` : prisma.client.$queryRaw``}
          ${filters?.endDate ? prisma.client.$queryRaw`AND paid_at <= ${filters.endDate}` : prisma.client.$queryRaw``}
        GROUP BY DATE_TRUNC('month', paid_at)
        ORDER BY month DESC
      `,
    ]);

    return {
      generatedAt: new Date(),
      period: {
        start: filters?.startDate,
        end: filters?.endDate,
      },
      summary: {
        totalRevenue: (summary._sum.amount || 0) / 100,
        totalTransactions: summary._count.id,
        averageTransaction: (summary._avg.amount || 0) / 100,
      },
      byPlan,
      byMonth,
      recentInvoices: invoices.map(inv => ({
        id: inv.id,
        amount: inv.amount / 100,
        currency: inv.currency,
        status: inv.status,
        paidAt: inv.paidAt,
        customer: {
          id: inv.subscription.user.id,
          email: inv.subscription.user.email,
          name: inv.subscription.user.displayName,
        },
      })),
    };
  }

  /**
   * Get users report data
   */
  private async getUsersReportData(filters?: any): Promise<any> {
    const where = {
      ...(filters?.tenantId && { tenantMembers: { some: { tenantId: filters.tenantId } } }),
      ...(filters?.startDate &&
        filters?.endDate && {
          createdAt: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
    };

    const [users, summary, byPlan, byStatus, signupTrend] = await Promise.all([
      // Recent users
      prisma.client.user.findMany({
        where,
        include: {
          subscriptions: {
            where: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] } },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),

      // Summary
      prisma.client.user.aggregate({
        where,
        _count: { id: true },
      }),

      // Users by subscription plan - Get from subscription data
      prisma.client.subscription
        .findMany({
          where: {
            status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
            ...(filters?.tenantId && { tenantId: filters.tenantId }),
          },
          select: {
            stripePriceId: true,
            userId: true,
          },
        })
        .then(subs => {
          const grouped = subs.reduce(
            (acc, sub) => {
              acc[sub.stripePriceId] = (acc[sub.stripePriceId] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          );

          return Object.entries(grouped).map(([stripePriceId, count]) => ({
            stripePriceId,
            _count: { userId: count },
          }));
        }),

      // Users by status
      prisma.client.user.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),

      // Signup trend
      prisma.client.$queryRaw`
        SELECT
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as signups
        FROM users
        WHERE 1=1
          ${filters?.tenantId ? prisma.client.$queryRaw`AND id IN (SELECT user_id FROM tenant_members WHERE tenant_id = ${filters.tenantId})` : prisma.client.$queryRaw``}
          ${filters?.startDate ? prisma.client.$queryRaw`AND created_at >= ${filters.startDate}` : prisma.client.$queryRaw``}
          ${filters?.endDate ? prisma.client.$queryRaw`AND created_at <= ${filters.endDate}` : prisma.client.$queryRaw``}
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
        LIMIT 30
      `,
    ]);

    return {
      generatedAt: new Date(),
      period: {
        start: filters?.startDate,
        end: filters?.endDate,
      },
      summary: {
        totalUsers: summary._count.id,
        activeUsers: users.filter(u => u.status === 'ACTIVE').length,
        paidUsers: users.filter(u => u.subscriptions.length > 0).length,
      },
      byPlan,
      byStatus,
      signupTrend,
      recentUsers: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.displayName,
        status: user.status,
        createdAt: user.createdAt,
        subscription: user.subscriptions[0]
          ? {
              plan: user.subscriptions[0].stripePriceId,
              status: user.subscriptions[0].status,
            }
          : null,
      })),
    };
  }

  /**
   * Get custom report data
   */
  private async getCustomReportData(query: any): Promise<any> {
    // Execute custom query
    // This should be carefully validated and sanitized
    return query;
  }

  /**
   * Generate PDF report
   */
  private async generatePDF(data: any, type: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add content based on report type
      doc.fontSize(20).text(`${type.toUpperCase()} REPORT`, 50, 50);
      doc.fontSize(12).text(`Generated: ${format(new Date(), 'PPP')}`, 50, 80);

      // Add report content
      doc.moveDown();
      this.addPDFContent(doc, data);

      doc.end();
    });
  }

  /**
   * Add PDF content based on data
   */
  private addPDFContent(doc: any, data: any): void {
    // This is a simplified version - you'd want to format this nicely
    doc.fontSize(10).text(JSON.stringify(data, null, 2), {
      width: 500,
      align: 'left',
    });
  }

  /**
   * Generate CSV report
   */
  private async generateCSV(data: any): Promise<Buffer> {
    // Flatten data for CSV
    const flatData = this.flattenDataForCSV(data);

    if (Array.isArray(flatData) && flatData.length > 0) {
      const parser = new Parser({
        fields: Object.keys(flatData[0]),
      });
      return Buffer.from(parser.parse(flatData));
    }

    return Buffer.from('No data available');
  }

  /**
   * Flatten nested data for CSV export
   */
  private flattenDataForCSV(data: any): any[] {
    // This should be customized based on report type
    if (Array.isArray(data)) {
      return data;
    }

    // Extract the most relevant array from the data
    if (data.recentInvoices) return data.recentInvoices;
    if (data.recentUsers) return data.recentUsers;
    if (data.metrics) return [data.metrics];

    return [data];
  }

  /**
   * Send report email
   */
  private async sendReportEmail(
    recipients: string[],
    report: { url: string; filename: string; type: string },
  ): Promise<void> {
    for (const recipient of recipients) {
      await this.emailService.queue({
        to: recipient,
        subject: `Your ${report.type} report is ready`,
        template: 'report-ready',
        context: {
          reportType: report.type,
          downloadUrl: report.url,
          filename: report.filename,
        },
      });
    }
  }

  /**
   * Helper method to get revenue by plan
   */
  private async getRevenueByPlan(tenantId?: string): Promise<any[]> {
    const invoices = await prisma.client.invoice.findMany({
      where: {
        status: 'PAID',
        ...(tenantId && { subscription: { tenantId } }),
      },
      include: {
        subscription: {
          select: {
            stripePriceId: true,
          },
        },
      },
    });

    // Group revenues by stripePriceId manually
    const revenueByPrice = new Map<string, number>();
    invoices.forEach(invoice => {
      const stripePriceId = invoice.subscription.stripePriceId;
      const current = revenueByPrice.get(stripePriceId) || 0;
      revenueByPrice.set(stripePriceId, current + invoice.amount);
    });

    return Array.from(revenueByPrice.entries()).map(([stripePriceId, amount]) => ({
      stripePriceId,
      _sum: { amount },
    }));
  }
}
