import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { StorageService } from '@shared/services/storage.service';
import { logger } from '@shared/logger';
import { Parser } from 'json2csv';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { QueueService } from '@shared/queue/queue.service';
import { EmailService } from '@shared/services/email.service';
import { Prisma } from '@prisma/client';

export interface ExportOptions {
  entityType: 'users' | 'subscriptions' | 'invoices' | 'tickets' | 'analytics' | 'audit_logs' | 'projects' | 'tenants';
  format: 'csv' | 'json' | 'xlsx';
  filters?: Record<string, any>;
  dateRange?: {
    start: string;
    end: string;
  };
  includeRelations?: boolean;
  fields?: string[];
  limit?: number;
  async?: boolean;
  recipientEmail?: string;
}

export interface ExportResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  url?: string;
  filename?: string;
  size?: number;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

@Service()
export class DataExportService {
  private activeExports: Map<string, ExportResult> = new Map();

  constructor(
    private storageService: StorageService,
    private queueService: QueueService,
    private emailService: EmailService
  ) {}

  /**
   * Export data based on options
   */
  async export(options: ExportOptions): Promise<ExportResult> {
    const exportId = this.generateExportId();
    const exportResult: ExportResult = {
      id: exportId,
      status: 'processing',
      createdAt: new Date()
    };

    // Store export status
    this.activeExports.set(exportId, exportResult);

    if (options.async) {
      // Queue the export job
      await this.queueService.addJob('export', 'data-export', {
        exportId,
        options
      });

      logger.info('Export job queued', { exportId, entityType: options.entityType });

      return exportResult;
    }

    // Process synchronously
    try {
      const result = await this.processExport(exportId, options);
      return result;
    } catch (error) {
      exportResult.status = 'failed';
      exportResult.error = (error as Error).message;
      logger.error('Export failed', error as Error, { exportId });
      return exportResult;
    }
  }

  /**
   * Process the export
   */
  async processExport(exportId: string, options: ExportOptions): Promise<ExportResult> {
    const exportResult = this.activeExports.get(exportId) || {
      id: exportId,
      status: 'processing' as const,
      createdAt: new Date()
    };

    try {
      logger.info('Processing export', { exportId, entityType: options.entityType });

      // Fetch data
      const data = await this.fetchData(options);

      if (!data || data.length === 0) {
        throw new Error('No data found for export');
      }

      // Generate file
      const file = await this.generateFile(data, options);

      // Upload to storage
      const filename = this.generateFilename(options);
      const { url } = await this.storageService.upload({
        buffer: file,
        filename,
        mimeType: this.getMimeType(options.format),
        path: `exports/${format(new Date(), 'yyyy-MM-dd')}`
      });

      // Update result
      exportResult.status = 'completed';
      exportResult.url = url;
      exportResult.filename = filename;
      exportResult.size = file.length;
      exportResult.completedAt = new Date();

      // Send email if requested
      if (options.recipientEmail) {
        await this.sendExportEmail(options.recipientEmail, exportResult);
      }

      logger.info('Export completed', {
        exportId,
        filename,
        size: file.length,
        records: data.length
      });

      return exportResult;
    } catch (error) {
      exportResult.status = 'failed';
      exportResult.error = (error as Error).message;
      logger.error('Export processing failed', error as Error, { exportId });
      throw error;
    } finally {
      // Clean up after some time
      setTimeout(() => {
        this.activeExports.delete(exportId);
      }, 3600000); // 1 hour
    }
  }

  /**
   * Get export status
   */
  getExportStatus(exportId: string): ExportResult | null {
    return this.activeExports.get(exportId) || null;
  }

  /**
   * Fetch data based on entity type
   */
  private async fetchData(options: ExportOptions): Promise<any[]> {
    const { entityType, filters, dateRange, includeRelations, limit = 10000 } = options;

    let where: any = {};

    // Apply date range filter
    if (dateRange) {
      where.createdAt = {
        gte: new Date(dateRange.start),
        lte: new Date(dateRange.end)
      };
    }

    // Apply custom filters
    if (filters) {
      where = { ...where, ...filters };
    }

    switch (entityType) {
      case 'users':
        return this.exportUsers(where, includeRelations, limit);

      case 'subscriptions':
        return this.exportSubscriptions(where, includeRelations, limit);

      case 'invoices':
        return this.exportInvoices(where, includeRelations, limit);

      case 'tickets':
        return this.exportTickets(where, includeRelations, limit);

      case 'analytics':
        return this.exportAnalytics(where, limit);

      case 'audit_logs':
        return this.exportAuditLogs(where, limit);

      case 'projects':
        return this.exportProjects(where, includeRelations, limit);

      case 'tenants':
        return this.exportTenants(where, includeRelations, limit);

      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  /**
   * Export users
   */
  private async exportUsers(where: any, includeRelations?: boolean, limit?: number) {
    const users = await prisma.client.user.findMany({
      where,
      include: includeRelations ? {
        subscriptions: {
          where: { status: { in: ['ACTIVE', 'TRIALING'] } },
          take: 1
        },
        tenantMembers: {
          include: { tenant: true }
        },
        _count: {
          select: {
            sessions: true,
            tickets: true,
            projects: true,
            files: true
          }
        }
      } : undefined,
      take: limit
    });

    // Transform data for export
    return users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      lastLoginAt: user.lastLoginAt,
      loginCount: user.loginCount,
      createdAt: user.createdAt,
      ...(includeRelations && {
        hasActiveSubscription: (user as any).subscriptions?.length > 0,
        tenants: (user as any).tenantMembers?.map((tm: any) => tm.tenant.name).join(', '),
        sessionCount: (user as any)._count?.sessions || 0,
        ticketCount: (user as any)._count?.tickets || 0,
        projectCount: (user as any)._count?.projects || 0,
        fileCount: (user as any)._count?.files || 0
      })
    }));
  }

  /**
   * Export subscriptions
   */
  private async exportSubscriptions(where: any, includeRelations?: boolean, limit?: number) {
    const subscriptions = await prisma.client.subscription.findMany({
      where,
      include: includeRelations ? {
        user: {
          select: {
            email: true,
            displayName: true
          }
        },
        tenant: {
          select: {
            name: true,
            slug: true
          }
        },
        invoices: {
          where: { status: 'PAID' },
          select: {
            amount: true,
            paidAt: true
          }
        }
      } : undefined,
      take: limit
    });

    return subscriptions.map(sub => ({
      id: sub.id,
      userId: sub.userId,
      tenantId: sub.tenantId,
      status: sub.status,
      stripePriceId: sub.stripePriceId,
      stripeProductId: sub.stripeProductId,
      currentPeriodStart: sub.currentPeriodStart,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      canceledAt: sub.canceledAt,
      trialEnd: sub.trialEnd,
      createdAt: sub.createdAt,
      ...(includeRelations && {
        userEmail: (sub as any).user?.email,
        userName: (sub as any).user?.displayName,
        tenantName: (sub as any).tenant?.name,
        totalRevenue: (sub as any).invoices?.reduce((sum: number, inv: any) => sum + inv.amount, 0) / 100 || 0
      })
    }));
  }

  /**
   * Export invoices
   */
  private async exportInvoices(where: any, includeRelations?: boolean, limit?: number) {
    const invoices = await prisma.client.invoice.findMany({
      where,
      include: includeRelations ? {
        subscription: {
          include: {
            user: {
              select: {
                email: true,
                displayName: true
              }
            },
            tenant: {
              select: {
                name: true
              }
            }
          }
        }
      } : undefined,
      take: limit
    });

    return invoices.map(inv => ({
      id: inv.id,
      subscriptionId: inv.subscriptionId,
      stripeInvoiceId: inv.stripeInvoiceId,
      amount: inv.amount / 100,
      currency: inv.currency,
      status: inv.status,
      periodStart: inv.periodStart,
      periodEnd: inv.periodEnd,
      paidAt: inv.paidAt,
      createdAt: inv.createdAt,
      ...(includeRelations && {
        userEmail: (inv as any).subscription?.user?.email,
        userName: (inv as any).subscription?.user?.displayName,
        tenantName: (inv as any).subscription?.tenant?.name
      })
    }));
  }

  /**
   * Export tickets
   */
  private async exportTickets(where: any, includeRelations?: boolean, limit?: number) {
    const tickets = await prisma.client.ticket.findMany({
      where,
      include: includeRelations ? {
        user: {
          select: {
            email: true,
            displayName: true
          }
        },
        assignee: {
          select: {
            email: true,
            displayName: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      } : undefined,
      take: limit
    });

    return tickets.map(ticket => ({
      id: ticket.id,
      number: ticket.number,
      subject: ticket.subject,
      type: ticket.type,
      status: ticket.status,
      priority: ticket.priority,
      firstResponseAt: ticket.firstResponseAt,
      resolutionAt: ticket.resolutionAt,
      slaBreached: ticket.slaBreached,
      satisfactionRating: ticket.satisfactionRating,
      createdAt: ticket.createdAt,
      closedAt: ticket.closedAt,
      ...(includeRelations && {
        userEmail: (ticket as any).user?.email,
        userName: (ticket as any).user?.displayName,
        assigneeEmail: (ticket as any).assignee?.email,
        assigneeName: (ticket as any).assignee?.displayName,
        category: (ticket as any).category?.name,
        messageCount: (ticket as any)._count?.messages || 0
      })
    }));
  }

  /**
   * Export analytics events
   */
  private async exportAnalytics(where: any, limit?: number) {
    const events = await prisma.client.analyticsEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return events.map(event => ({
      id: event.id,
      userId: event.userId,
      tenantId: event.tenantId,
      event: event.event,
      properties: JSON.stringify(event.properties),
      sessionId: event.sessionId,
      deviceId: event.deviceId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      referrer: event.referrer,
      utmSource: event.utmSource,
      utmMedium: event.utmMedium,
      utmCampaign: event.utmCampaign,
      timestamp: event.timestamp
    }));
  }

  /**
   * Export audit logs
   */
  private async exportAuditLogs(where: any, limit?: number) {
    const logs = await prisma.client.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            displayName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return logs.map(log => ({
      id: log.id,
      userId: log.userId,
      userEmail: (log as any).user?.email,
      userName: (log as any).user?.displayName,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      oldValues: JSON.stringify(log.oldValues),
      newValues: JSON.stringify(log.newValues),
      metadata: JSON.stringify(log.metadata),
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt
    }));
  }

  /**
   * Export projects
   */
  private async exportProjects(where: any, includeRelations?: boolean, limit?: number) {
    const projects = await prisma.client.project.findMany({
      where,
      include: includeRelations ? {
        user: {
          select: {
            email: true,
            displayName: true
          }
        },
        tenant: {
          select: {
            name: true
          }
        }
      } : undefined,
      take: limit
    });

    return projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      slug: project.slug,
      userId: project.userId,
      tenantId: project.tenantId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      ...(includeRelations && {
        userEmail: (project as any).user?.email,
        userName: (project as any).user?.displayName,
        tenantName: (project as any).tenant?.name
      })
    }));
  }

  /**
   * Export tenants
   */
  private async exportTenants(where: any, includeRelations?: boolean, limit?: number) {
    const tenants = await prisma.client.tenant.findMany({
      where,
      include: includeRelations ? {
        owner: {
          select: {
            email: true,
            displayName: true
          }
        },
        subscription: true,
        _count: {
          select: {
            members: true,
            projects: true,
            tickets: true
          }
        }
      } : undefined,
      take: limit
    });

    return tenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      ownerId: tenant.ownerId,
      status: tenant.status,
      stripeCustomerId: tenant.stripeCustomerId,
      createdAt: tenant.createdAt,
      ...(includeRelations && {
        ownerEmail: (tenant as any).owner?.email,
        ownerName: (tenant as any).owner?.displayName,
        subscriptionStatus: (tenant as any).subscription?.status,
        memberCount: (tenant as any)._count?.members || 0,
        projectCount: (tenant as any)._count?.projects || 0,
        ticketCount: (tenant as any)._count?.tickets || 0
      })
    }));
  }

  /**
   * Generate file based on format
   */
  private async generateFile(data: any[], options: ExportOptions): Promise<Buffer> {
    // Filter fields if specified
    if (options.fields && options.fields.length > 0) {
      data = data.map(item => {
        const filtered: any = {};
        options.fields!.forEach(field => {
          if (field in item) {
            filtered[field] = item[field];
          }
        });
        return filtered;
      });
    }

    switch (options.format) {
      case 'csv':
        return this.generateCSV(data);

      case 'json':
        return Buffer.from(JSON.stringify(data, null, 2));

      case 'xlsx':
        return this.generateXLSX(data, options.entityType);

      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * Generate CSV file
   */
  private generateCSV(data: any[]): Buffer {
    if (data.length === 0) {
      return Buffer.from('');
    }

    try {
      const parser = new Parser({
        fields: Object.keys(data[0])
      });
      return Buffer.from(parser.parse(data));
    } catch (error) {
      logger.error('CSV generation failed', error as Error);
      throw new Error('Failed to generate CSV');
    }
  }

  /**
   * Generate XLSX file
   */
  private generateXLSX(data: any[], sheetName: string): Buffer {
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Auto-size columns
      const maxWidth = 50;
      const colWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.min(
          maxWidth,
          Math.max(
            key.length,
            ...data.map(row => String(row[key] || '').length)
          )
        )
      }));
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
    } catch (error) {
      logger.error('XLSX generation failed', error as Error);
      throw new Error('Failed to generate XLSX');
    }
  }

  /**
   * Send export completion email
   */
  private async sendExportEmail(recipientEmail: string, exportResult: ExportResult) {
    await this.emailService.queue({
      to: recipientEmail,
      subject: 'Your data export is ready',
      template: 'export-ready',
      context: {
        downloadUrl: exportResult.url,
        filename: exportResult.filename,
        expiresIn: '24 hours'
      }
    });
  }

  // Helper methods

  private generateExportId(): string {
    return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFilename(options: ExportOptions): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
    return `${options.entityType}-export-${timestamp}.${options.format}`;
  }

  private getMimeType(format: string): string {
    const mimeTypes = {
      csv: 'text/csv',
      json: 'application/json',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    return mimeTypes[format as keyof typeof mimeTypes] || 'application/octet-stream';
  }
}
