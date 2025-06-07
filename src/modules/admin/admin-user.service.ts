import { Service } from 'typedi';
import { User, UserStatus, UserRole, Prisma } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { EmailService } from '@shared/services/email.service';
import { AuditService } from '@shared/services/audit.service';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@shared/exceptions';
import { generateSecureToken } from '@shared/utils/crypto';
import { subDays } from 'date-fns';

export interface UserSearchOptions {
  query?: string;
  email?: string;
  status?: UserStatus;
  role?: UserRole;
  verified?: boolean;
  tenantId?: string;
  createdAfter?: string;
  createdBefore?: string;
  page?: number;
  limit?: number;
  sort?: 'createdAt' | 'lastLoginAt' | 'loginCount';
  order?: 'asc' | 'desc';
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  verified: number;
  unverified: number;
  byRole: Record<string, number>;
  newLastWeek: number;
  newLastMonth: number;
}

@Service()
export class AdminUserService {
  constructor(
    private eventBus: EventBus,
    private emailService: EmailService,
    private auditService: AuditService
  ) {}

  /**
   * Search and list users with advanced filters
   */
  async searchUsers(options: UserSearchOptions) {
    const {
      query,
      email,
      status,
      role,
      verified,
      tenantId,
      createdAfter,
      createdBefore,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = options;

    const where: Prisma.UserWhereInput = {
      ...(query && {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } }
        ]
      }),
      ...(email && { email: { contains: email, mode: 'insensitive' } }),
      ...(status && { status }),
      ...(role && { role }),
      ...(verified !== undefined && { emailVerified: verified }),
      ...(tenantId && { tenantMembers: { some: { tenantId } } }),
      ...(createdAfter && { createdAt: { gte: new Date(createdAfter) } }),
      ...(createdBefore && { createdAt: { lte: new Date(createdBefore) } })
    };

    const [users, total] = await Promise.all([
      prisma.client.user.findMany({
        where,
        include: {
          subscriptions: {
            where: { status: { in: ['ACTIVE', 'TRIALING'] } },
            take: 1
          },
          tenantMembers: {
            include: { tenant: { select: { id: true, name: true, slug: true } } }
          },
          _count: {
            select: {
              sessions: true,
              tickets: true,
              projects: true
            }
          }
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.client.user.count({ where })
    ]);

    // Add additional computed fields
    const enrichedUsers = users.map(user => ({
      ...user,
      hasActiveSubscription: user.subscriptions.length > 0,
      tenants: user.tenantMembers.map(tm => tm.tenant)
    }));

    return {
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get detailed user information
   */
  async getUserDetails(userId: string) {
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        authProviders: true,
        sessions: {
          where: { expiresAt: { gt: new Date() } },
          orderBy: { lastActivityAt: 'desc' },
          take: 5
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          include: {
            invoices: {
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          }
        },
        tenantMembers: {
          include: {
            tenant: true
          }
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            number: true,
            subject: true,
            status: true,
            priority: true,
            createdAt: true
          }
        },
        apiUsage: {
          where: {
            createdAt: { gte: subDays(new Date(), 30) }
          },
          select: {
            endpoint: true,
            method: true,
            statusCode: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 100
        },
        _count: {
          select: {
            projects: true,
            files: true,
            notifications: true,
            auditLogs: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate additional metrics
    const apiUsageByEndpoint = user.apiUsage.reduce((acc, usage) => {
      const key = `${usage.method} ${usage.endpoint}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalRevenue = user.subscriptions.reduce((sum, sub) => {
      return sum + sub.invoices.reduce((invSum, inv) => {
        return invSum + (inv.status === 'PAID' ? inv.amount : 0);
      }, 0);
    }, 0);

    return {
      ...user,
      metrics: {
        totalRevenue: totalRevenue / 100, // Convert from cents
        apiUsageByEndpoint,
        activeSessions: user.sessions.length,
        totalApiCalls: user.apiUsage.length
      }
    };
  }

  /**
   * Update user information
   */
  async updateUser(
    adminId: string,
    userId: string,
    updates: {
      email?: string;
      firstName?: string;
      lastName?: string;
      displayName?: string;
      role?: UserRole;
      status?: UserStatus;
      emailVerified?: boolean;
      metadata?: any;
    }
  ) {
    const user = await prisma.client.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent demoting super admin
    if (user.role === UserRole.SUPER_ADMIN && updates.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot demote super admin');
    }

    const oldValues = { ...user };

    const updatedUser = await prisma.client.user.update({
      where: { id: userId },
      data: updates
    });

    // Clear user cache
    await redis.delete(`user:${userId}:*`);

    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: 'user.updated',
      entity: 'user',
      entityId: userId,
      oldValues,
      newValues: updatedUser,
      metadata: { changes: updates }
    });

    // Send notification if status changed
    if (updates.status && updates.status !== user.status) {
      await this.notifyUserStatusChange(updatedUser, updates.status);
    }

    logger.info('User updated by admin', {
      adminId,
      userId,
      changes: updates
    });

    await this.eventBus.emit('admin.user.updated', {
      adminId,
      userId,
      changes: updates,
      timestamp: new Date()
    });

    return updatedUser;
  }

  /**
   * Bulk user actions
   */
  async bulkUserAction(
    adminId: string,
    userIds: string[],
    action: 'suspend' | 'activate' | 'delete' | 'verify_email' | 'reset_password',
    options?: {
      reason?: string;
      notifyUsers?: boolean;
    }
  ) {
    const users = await prisma.client.user.findMany({
      where: { id: { in: userIds } }
    });

    if (users.length !== userIds.length) {
      throw new BadRequestException('Some users not found');
    }

    const results = {
      succeeded: [] as string[],
      failed: [] as { userId: string; error: string }[]
    };

    for (const user of users) {
      try {
        switch (action) {
          case 'suspend':
            await this.suspendUser(adminId, user.id, options?.reason);
            break;

          case 'activate':
            await this.activateUser(adminId, user.id);
            break;

          case 'delete':
            await this.deleteUser(adminId, user.id);
            break;

          case 'verify_email':
            await this.verifyUserEmail(adminId, user.id);
            break;

          case 'reset_password':
            await this.resetUserPassword(adminId, user.id);
            break;
        }

        results.succeeded.push(user.id);

        if (options?.notifyUsers) {
          await this.notifyBulkAction(user, action, options.reason);
        }
      } catch (error: any) {
        results.failed.push({
          userId: user.id,
          error: error.message
        });
      }
    }

    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: `user.bulk.${action}`,
      entity: 'user',
      entityId: null,
      metadata: {
        userIds,
        results,
        reason: options?.reason
      }
    });

    logger.info('Bulk user action completed', {
      adminId,
      action,
      total: userIds.length,
      succeeded: results.succeeded.length,
      failed: results.failed.length
    });

    return results;
  }

  /**
   * Suspend user account
   */
  async suspendUser(adminId: string, userId: string, reason?: string) {
    const currentUser = await prisma.client.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const user = await prisma.client.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.SUSPENDED,
        metadata: {
          ...(currentUser.metadata as any || {}),
          suspendedAt: new Date(),
          suspendedBy: adminId,
          suspendReason: reason
        }
      }
    });

    // Revoke all sessions
    await prisma.client.session.deleteMany({
      where: { userId }
    });

    // Clear cache
    await redis.delete(`user:${userId}:*`);
    await redis.delete(`session:*:${userId}`);

    await this.eventBus.emit('admin.user.suspended', {
      adminId,
      userId,
      reason,
      timestamp: new Date()
    });

    return user;
  }

  /**
   * Activate user account
   */
  async activateUser(adminId: string, userId: string) {
    const currentUser = await prisma.client.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const user = await prisma.client.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.ACTIVE,
        metadata: {
          ...(currentUser.metadata as any || {}),
          activatedAt: new Date(),
          activatedBy: adminId
        }
      }
    });

    await this.eventBus.emit('admin.user.activated', {
      adminId,
      userId,
      timestamp: new Date()
    });

    return user;
  }

  /**
   * Delete user account (soft delete)
   */
  async deleteUser(adminId: string, userId: string) {
    // Check if user has active subscriptions
    const activeSubscriptions = await prisma.client.subscription.count({
      where: {
        userId,
        status: { in: ['ACTIVE', 'TRIALING'] }
      }
    });

    if (activeSubscriptions > 0) {
      throw new BadRequestException('Cannot delete user with active subscriptions');
    }

    const currentUser = await prisma.client.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const user = await prisma.client.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.DELETED,
        deletedAt: new Date(),
        email: `deleted_${userId}@deleted.local`, // Anonymize email
        metadata: {
          ...(currentUser.metadata as any || {}),
          deletedBy: adminId,
          originalEmail: currentUser.email
        }
      }
    });

    // Delete all sessions
    await prisma.client.session.deleteMany({ where: { userId } });

    // Clear all cache
    await redis.delete(`user:${userId}:*`);

    await this.eventBus.emit('admin.user.deleted', {
      adminId,
      userId,
      timestamp: new Date()
    });

    return user;
  }

  /**
   * Force verify user email
   */
  async verifyUserEmail(adminId: string, userId: string) {
    const user = await prisma.client.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date()
      }
    });

    await this.auditService.log({
      userId: adminId,
      action: 'user.email.verified',
      entity: 'user',
      entityId: userId,
      metadata: { verifiedBy: 'admin' }
    });

    return user;
  }

  /**
   * Force reset user password
   */
  async resetUserPassword(adminId: string, userId: string) {
    const user = await prisma.client.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset token
    const resetToken = generateSecureToken();

    await prisma.client.token.create({
      data: {
        userId,
        type: 'PASSWORD_RESET',
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000) // 1 hour
      }
    });

    // Send reset email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    await this.auditService.log({
      userId: adminId,
      action: 'user.password.reset',
      entity: 'user',
      entityId: userId,
      metadata: { resetBy: 'admin' }
    });

    return { message: 'Password reset email sent' };
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<UserStatistics> {
    const [
      total,
      statusCounts,
      verifiedCount,
      roleCounts,
      newLastWeek,
      newLastMonth
    ] = await Promise.all([
      prisma.client.user.count(),

      prisma.client.user.groupBy({
        by: ['status'],
        _count: { status: true }
      }),

      prisma.client.user.count({
        where: { emailVerified: true }
      }),

      prisma.client.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }),

      prisma.client.user.count({
        where: {
          createdAt: { gte: subDays(new Date(), 7) }
        }
      }),

      prisma.client.user.count({
        where: {
          createdAt: { gte: subDays(new Date(), 30) }
        }
      })
    ]);

    const statusMap = statusCounts.reduce((acc, item) => {
      acc[item.status.toLowerCase()] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    const roleMap = roleCounts.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active: statusMap.active || 0,
      inactive: statusMap.inactive || 0,
      suspended: statusMap.suspended || 0,
      verified: verifiedCount,
      unverified: total - verifiedCount,
      byRole: roleMap,
      newLastWeek,
      newLastMonth
    };
  }

  /**
   * Get user activity timeline
   */
  async getUserActivity(userId: string, days: number = 30) {
    const startDate = subDays(new Date(), days);

    const [
      logins,
      apiCalls,
      tickets,
      auditLogs
    ] = await Promise.all([
      // Login activity
      prisma.client.analyticsEvent.findMany({
        where: {
          userId,
          event: 'user.loggedIn',
          timestamp: { gte: startDate }
        },
        orderBy: { timestamp: 'desc' },
        take: 50
      }),

      // API usage
      prisma.client.apiUsage.groupBy({
        by: ['endpoint', 'method'],
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      }),

      // Support tickets
      prisma.client.ticket.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          number: true,
          subject: true,
          status: true,
          createdAt: true,
          closedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Audit logs
      prisma.client.auditLog.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    return {
      logins,
      apiUsage: apiCalls,
      tickets,
      auditLogs
    };
  }

  /**
   * Export user data
   */
  async exportUserData(userId: string) {
    const user = await this.getUserDetails(userId);

    // Remove sensitive data
    const { password, twoFactorSecret, ...userData } = user;

    return {
      user: userData,
      exportedAt: new Date(),
      exportedBy: 'admin'
    };
  }

  /**
   * Notify user about status change
   */
  private async notifyUserStatusChange(user: User, newStatus: UserStatus) {
    const messages = {
      [UserStatus.SUSPENDED]: {
        subject: 'Account Suspended',
        template: 'account-suspended'
      },
      [UserStatus.ACTIVE]: {
        subject: 'Account Activated',
        template: 'account-activated'
      },
      [UserStatus.DELETED]: {
        subject: 'Account Deleted',
        template: 'account-deleted'
      }
    };

    const message = messages[newStatus];
    if (message) {
      await this.emailService.queue({
        to: user.email,
        subject: message.subject,
        template: message.template,
        context: {
          userName: user.displayName || user.email,
          status: newStatus
        }
      });
    }
  }

  /**
   * Notify user about bulk action
   */
  private async notifyBulkAction(user: User, action: string, reason?: string) {
    await this.emailService.queue({
      to: user.email,
      subject: `Account ${action.replace('_', ' ')}`,
      template: 'admin-action',
      context: {
        userName: user.displayName || user.email,
        action,
        reason
      }
    });
  }
}
