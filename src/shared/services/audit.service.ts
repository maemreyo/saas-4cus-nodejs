import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';

export interface AuditLogEntry {
  userId: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  oldValues?: any;
  newValues?: any;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Service()
export class AuditService {
  /**
   * Create an audit log entry
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.client.auditLog.create({
        data: {
          userId: entry.userId,
          action: entry.action,
          entity: entry.entity,
          entityId: entry.entityId,
          oldValues: entry.oldValues,
          newValues: entry.newValues,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          metadata: entry.metadata
        }
      });

      logger.debug('Audit log created', {
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId
      });
    } catch (error) {
      logger.error('Failed to create audit log', error as Error, entry);
    }
  }

  /**
   * Query audit logs
   */
  async query(
    filters: {
      userId?: string;
      action?: string;
      entity?: string;
      entityId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    options?: {
      page?: number;
      limit?: number;
      orderBy?: 'createdAt' | 'action';
      order?: 'asc' | 'desc';
    }
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const orderBy = options?.orderBy || 'createdAt';
    const order = options?.order || 'desc';

    const where = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.action && { action: { contains: filters.action } }),
      ...(filters.entity && { entity: filters.entity }),
      ...(filters.entityId && { entityId: filters.entityId }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: filters.startDate,
          lte: filters.endDate
        }
      })
    };

    const [logs, total] = await Promise.all([
      prisma.client.auditLog.findMany({
        where,
        orderBy: { [orderBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true
            }
          }
        }
      }),
      prisma.client.auditLog.count({ where })
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get entity history
   */
  async getEntityHistory(entity: string, entityId: string) {
    const logs = await prisma.client.auditLog.findMany({
      where: {
        entity,
        entityId
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true
          }
        }
      }
    });

    return logs;
  }

  /**
   * Get user activity
   */
  async getUserActivity(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.client.auditLog.findMany({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by action type
    const activitySummary = logs.reduce((acc, log) => {
      const actionType = log.action.split('.')[0];
      acc[actionType] = (acc[actionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      logs,
      summary: activitySummary,
      total: logs.length
    };
  }

  /**
   * Clean up old audit logs
   */
  async cleanup(retentionDays: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.client.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });

    logger.info('Cleaned up old audit logs', {
      deleted: result.count,
      retentionDays
    });

    return result.count;
  }
}