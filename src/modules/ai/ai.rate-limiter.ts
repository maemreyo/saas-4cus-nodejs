// Updated: 2024-12-25 - AI module implementation

import { Service } from 'typedi';
import { FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { TooManyRequestsException } from '@shared/exceptions';
import { EntitlementService } from '@modules/features/entitlement.service';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface UserRateLimits {
  completion: { windowMs: number; max: number };
  chat: { windowMs: number; max: number };
  embedding: { windowMs: number; max: number };
  image: { windowMs: number; max: number };
  audio: { windowMs: number; max: number };
}

@Service()
export class AiRateLimiter {
  private defaultLimits: UserRateLimits = {
    completion: { windowMs: 60000, max: 100 }, // 100 per minute
    chat: { windowMs: 60000, max: 100 }, // 100 per minute
    embedding: { windowMs: 60000, max: 200 }, // 200 per minute
    image: { windowMs: 60000, max: 20 }, // 20 per minute
    audio: { windowMs: 60000, max: 50 }, // 50 per minute
  };

  constructor(
    private entitlementService: EntitlementService
  ) {}

  async createLimiter(operation: keyof UserRateLimits) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.customUser?.id;
      if (!userId) {
        throw new TooManyRequestsException('User not authenticated');
      }

      const tenantId = (request as any).customTenant?.id;

      // Get user's rate limits based on their plan
      const limits = await this.getUserRateLimits(userId, operation);

      const key = this.generateKey(operation, userId, tenantId);
      const now = Date.now();
      const windowStart = now - limits.windowMs;

      try {
        // Remove old entries
        await redis.zremrangebyscore(key, '-inf', windowStart.toString());

        // Count requests in current window
        const currentCount = await redis.zcard(key);

        if (currentCount >= limits.max) {
          // Calculate retry after
          const oldestEntry = await redis.zrange(key, 0, 0, 'WITHSCORES');
          const retryAfter = oldestEntry.length > 1
            ? Math.ceil((parseInt(oldestEntry[1]) + limits.windowMs - now) / 1000)
            : Math.ceil(limits.windowMs / 1000);

          reply.header('X-RateLimit-Limit', limits.max.toString());
          reply.header('X-RateLimit-Remaining', '0');
          reply.header('X-RateLimit-Reset', new Date(now + retryAfter * 1000).toISOString());
          reply.header('Retry-After', retryAfter.toString());

          throw new TooManyRequestsException(
            `Rate limit exceeded. You can make ${limits.max} ${operation} requests per ${limits.windowMs / 1000} seconds.`
          );
        }

        // Add current request
        await redis.zadd(key, now.toString(), `${now}-${Math.random()}`);
        await redis.expire(key, Math.ceil(limits.windowMs / 1000));

        // Set rate limit headers
        const remaining = limits.max - currentCount - 1;
        const reset = new Date(now + limits.windowMs);

        reply.header('X-RateLimit-Limit', limits.max.toString());
        reply.header('X-RateLimit-Remaining', remaining.toString());
        reply.header('X-RateLimit-Reset', reset.toISOString());

        // Warn if approaching limit
        if (remaining < limits.max * 0.2) {
          reply.header('X-RateLimit-Warning', 'You are approaching your rate limit');
        }
      } catch (error) {
        if (error instanceof TooManyRequestsException) {
          throw error;
        }

        logger.error('Rate limiter error', error as Error);
        // Allow request to proceed on rate limiter error
      }
    };
  }

  private async getUserRateLimits(
    userId: string,
    operation: keyof UserRateLimits
  ): Promise<{ windowMs: number; max: number }> {
    try {
      // Check user's plan entitlements
      const entitlement = await this.entitlementService.getEntitlement(
        userId,
        `ai_rate_limit_${operation}`
      );

      if (entitlement && entitlement.limit > 0) {
        return {
          windowMs: 60000, // Always 1 minute window
          max: entitlement.limit,
        };
      }

      // Check for premium tier
      const isPremium = await this.entitlementService.check(userId, 'premium_ai_access');
      if (isPremium) {
        // Premium users get 2x rate limits
        return {
          windowMs: this.defaultLimits[operation].windowMs,
          max: this.defaultLimits[operation].max * 2,
        };
      }

      return this.defaultLimits[operation];
    } catch (error) {
      logger.error('Failed to get user rate limits', error as Error);
      return this.defaultLimits[operation];
    }
  }

  private generateKey(
    operation: string,
    userId: string,
    tenantId?: string
  ): string {
    if (tenantId) {
      return `ai:ratelimit:${operation}:tenant:${tenantId}:user:${userId}`;
    }
    return `ai:ratelimit:${operation}:user:${userId}`;
  }

  // Get current usage for a user
  async getCurrentUsage(
    userId: string,
    operation: keyof UserRateLimits,
    tenantId?: string
  ): Promise<{ current: number; limit: number; resetAt: Date }> {
    const limits = await this.getUserRateLimits(userId, operation);
    const key = this.generateKey(operation, userId, tenantId);
    const now = Date.now();
    const windowStart = now - limits.windowMs;

    // Remove old entries
    await redis.zremrangebyscore(key, '-inf', windowStart.toString());

    // Count current requests
    const current = await redis.zcard(key);

    return {
      current,
      limit: limits.max,
      resetAt: new Date(now + limits.windowMs),
    };
  }

  // Reset rate limit for a user (admin function)
  async resetLimit(
    userId: string,
    operation?: keyof UserRateLimits,
    tenantId?: string
  ): Promise<void> {
    if (operation) {
      const key = this.generateKey(operation, userId, tenantId);
      await redis.delete(key);
    } else {
      // Reset all operations
      const operations: (keyof UserRateLimits)[] = ['completion', 'chat', 'embedding', 'image', 'audio'];
      for (const op of operations) {
        const key = this.generateKey(op, userId, tenantId);
        await redis.delete(key);
      }
    }

    logger.info('Rate limit reset', { userId, operation, tenantId });
  }

  // Get all current rate limit statuses for a user
  async getAllLimits(
    userId: string,
    tenantId?: string
  ): Promise<Record<keyof UserRateLimits, { current: number; limit: number; resetAt: Date }>> {
    const operations: (keyof UserRateLimits)[] = ['completion', 'chat', 'embedding', 'image', 'audio'];
    const result: any = {};

    for (const operation of operations) {
      result[operation] = await this.getCurrentUsage(userId, operation, tenantId);
    }

    return result;
  }

  // Middleware for cost-based rate limiting
  async costBasedLimiter(costPerRequest: number) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.customUser?.id;
      if (!userId) {
        throw new TooManyRequestsException('User not authenticated');
      }

      // Check user's remaining budget
      const budget = await this.entitlementService.getEntitlement(userId, 'ai_monthly_budget');

      if (budget && budget.limit > 0) {
        const currentUsage = await this.getCurrentMonthCost(userId);

        if (currentUsage + costPerRequest > budget.limit) {
          throw new TooManyRequestsException(
            `Monthly AI budget exceeded. Current usage: $${(currentUsage / 100).toFixed(2)}, Budget: $${(budget.limit / 100).toFixed(2)}`
          );
        }

        // Set budget headers
        reply.header('X-AI-Budget-Limit', (budget.limit / 100).toFixed(2));
        reply.header('X-AI-Budget-Remaining', ((budget.limit - currentUsage) / 100).toFixed(2));
      }
    };
  }

  private async getCurrentMonthCost(userId: string): Promise<number> {
    // This would query the AI usage logs for the current month
    // Simplified for this example
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { prisma } = await import('@infrastructure/database/prisma.service');

    const result = await prisma.client.aiUsageLog.aggregate({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        cost: true,
      },
    });

    return result._sum.cost || 0;
  }
}
