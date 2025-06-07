import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedException, ForbiddenException } from '@shared/exceptions';
import { logger } from '@shared/logger';
import { redis } from '@infrastructure/cache/redis.service';
import { prisma } from '@infrastructure/database/prisma.service';
import { AuditService } from '@shared/services/audit.service';
import { Container } from 'typedi';

export interface AdminAuthOptions {
  requireSuperAdmin?: boolean;
  allowedRoles?: string[];
  checkIpWhitelist?: boolean;
  trackActivity?: boolean;
  rateLimit?: {
    max: number;
    window: number; // in seconds
  };
}

/**
 * Admin authentication middleware
 */
export function adminAuth(options: AdminAuthOptions = {}) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Check if user is authenticated
      if (!request.customUser) {
        throw new UnauthorizedException('Authentication required');
      }

      const user = request.customUser;

      // Check if user has admin role
      const allowedRoles = options.allowedRoles || ['ADMIN', 'SUPER_ADMIN'];
      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenException('Admin access required');
      }

      // Check if super admin is required
      if (options.requireSuperAdmin && user.role !== 'SUPER_ADMIN') {
        throw new ForbiddenException('Super admin access required');
      }

      // Check IP whitelist if enabled
      if (options.checkIpWhitelist) {
        await checkIpWhitelist(request.ip, user.id);
      }

      // Apply rate limiting if specified
      if (options.rateLimit) {
        await checkRateLimit(user.id, options.rateLimit);
      }

      // Track admin activity
      if (options.trackActivity !== false) {
        await trackAdminActivity(request, user.id);
      }

      // Add admin context to request
      (request as any).adminContext = {
        userId: user.id,
        role: user.role,
        ip: request.ip,
        timestamp: new Date()
      };

    } catch (error) {
      logger.error('Admin auth failed', error as Error, {
        userId: request.customUser?.id,
        path: request.url,
        ip: request.ip
      });
      throw error;
    }
  };
}

/**
 * Check if IP is whitelisted for admin access
 */
async function checkIpWhitelist(ip: string, userId: string): Promise<void> {
  // Get system config from cache or database
  const configKey = 'system:config:security.allowedIps';
  let allowedIps = await redis.get<string[]>(configKey);

  if (!allowedIps) {
    // Fetch from database
    const setting = await prisma.client.setting.findUnique({
      where: { key: 'security.allowedIps' }
    });

    if (setting && setting.value) {
      allowedIps = setting.value as string[];
      await redis.set(configKey, allowedIps, { ttl: 3600 });
    }
  }

  if (allowedIps && allowedIps.length > 0 && !allowedIps.includes(ip)) {
    logger.security('Admin access denied - IP not whitelisted', {
      userId,
      ip,
      allowedIps
    });
    throw new ForbiddenException('Access denied from this IP address');
  }
}

/**
 * Check admin rate limit
 */
async function checkRateLimit(
  userId: string,
  limits: { max: number; window: number }
): Promise<void> {
  const key = `admin:ratelimit:${userId}`;
  const current = await redis.increment(key);

  if (current === 1) {
    await redis.expire(key, limits.window);
  }

  if (current > limits.max) {
    logger.security('Admin rate limit exceeded', {
      userId,
      limit: limits.max,
      window: limits.window,
      current
    });
    throw new ForbiddenException('Rate limit exceeded');
  }
}

/**
 * Track admin activity
 */
async function trackAdminActivity(request: FastifyRequest, userId: string): Promise<void> {
  try {
    // Update last admin activity
    const activityKey = `admin:activity:${userId}`;
    await redis.set(activityKey, {
      lastActivity: new Date(),
      endpoint: request.url,
      method: request.method,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    }, { ttl: 86400 }); // 24 hours

    // Track in analytics
    await prisma.client.analyticsEvent.create({
      data: {
        userId,
        event: 'admin.activity',
        properties: {
          endpoint: request.url,
          method: request.method,
          action: getActionFromEndpoint(request.url)
        },
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] as string,
        timestamp: new Date()
      }
    });
  } catch (error) {
    logger.error('Failed to track admin activity', error as Error);
    // Don't throw - this shouldn't block the request
  }
}

/**
 * Permission-based middleware for specific admin actions
 */
export function requirePermission(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.customUser;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Super admins have all permissions
    if (user.role === 'SUPER_ADMIN') {
      return;
    }

    // Check if user has specific permission
    const hasPermission = await checkUserPermission(user.id, permission);

    if (!hasPermission) {
      const auditService = Container.get(AuditService);
      await auditService.log({
        userId: user.id,
        action: 'permission.denied',
        entity: 'admin',
        metadata: {
          permission,
          endpoint: request.url
        }
      });

      throw new ForbiddenException(`Permission denied: ${permission}`);
    }
  };
}

/**
 * Check if user has specific permission
 */
async function checkUserPermission(userId: string, permission: string): Promise<boolean> {
  // This would typically check against a permissions table
  // For now, we'll use a simple role-based check

  const user = await prisma.client.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) return false;

  // Define permissions by role
  const rolePermissions: Record<string, string[]> = {
    ADMIN: [
      'users.view',
      'users.update',
      'tickets.view',
      'tickets.manage',
      'content.moderate',
      'analytics.view',
      'announcements.create',
      'export.data'
    ],
    SUPER_ADMIN: ['*'] // All permissions
  };

  const permissions = rolePermissions[user.role] || [];
  return permissions.includes('*') || permissions.includes(permission);
}

/**
 * Audit sensitive admin actions
 */
export function auditAction(action: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.customUser;
    const adminContext = (request as any).adminContext;

    if (!user || !adminContext) {
      return;
    }

    const auditService = Container.get(AuditService);

    await auditService.log({
      userId: user.id,
      action: `admin.${action}`,
      entity: 'admin',
      entityId: request.params ? JSON.stringify(request.params) : null,
      metadata: {
        endpoint: request.url,
        method: request.method,
        body: request.body,
        query: request.query,
        ip: request.ip,
        userAgent: request.headers['user-agent']
      }
    });
  };
}

/**
 * Check if system is in maintenance mode
 */
export async function checkMaintenanceMode(request: FastifyRequest, reply: FastifyReply) {
  const maintenanceKey = 'system:maintenance:enabled';
  const isInMaintenance = await redis.get<boolean>(maintenanceKey);

  if (isInMaintenance) {
    // Check if user is admin (admins can access during maintenance)
    if (!request.customUser || !['ADMIN', 'SUPER_ADMIN'].includes(request.customUser.role)) {
      const maintenanceInfo = await redis.get<any>('system:maintenance:info') || {
        message: 'System is under maintenance'
      };

      reply.code(503).send({
        error: 'Service Unavailable',
        message: maintenanceInfo.message,
        estimatedDuration: maintenanceInfo.estimatedDuration
      });
    }
  }
}

/**
 * Validate admin session
 */
export async function validateAdminSession(request: FastifyRequest, reply: FastifyReply) {
  const user = request.customUser;

  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    return;
  }

  // Check if admin session is still valid
  const sessionKey = `admin:session:${user.id}`;
  const session = await redis.get<any>(sessionKey);

  if (!session) {
    // Create new admin session
    await redis.set(sessionKey, {
      userId: user.id,
      startedAt: new Date(),
      lastActivity: new Date(),
      ip: request.ip
    }, { ttl: 3600 }); // 1 hour
  } else {
    // Update last activity
    session.lastActivity = new Date();
    await redis.set(sessionKey, session, { ttl: 3600 });

    // Check for suspicious activity
    if (session.ip !== request.ip) {
      logger.security('Admin session IP mismatch', {
        userId: user.id,
        sessionIp: session.ip,
        currentIp: request.ip
      });

      // Could enforce stricter security here
    }
  }
}

// Helper functions

function getActionFromEndpoint(url: string): string {
  const parts = url.split('/').filter(Boolean);
  if (parts.length >= 3) {
    return `${parts[2]}.${parts[3] || 'view'}`;
  }
  return 'unknown';
}