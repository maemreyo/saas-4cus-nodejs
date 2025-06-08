import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { ApiUsageService } from './api-usage.service';
import { logger } from '@shared/logger';
/**
 * Middleware to track API usage
 */
/**
 * Middleware to track API usage
 */
export async function trackApiUsage(request: FastifyRequest, reply: FastifyReply) {
  // Skip tracking for certain endpoints
  const skipEndpoints = [
    '/health',
    '/metrics',
    '/docs',
    '/api/api-usage', // Don't track usage tracking endpoints
    '/api/auth/refresh', // Don't track token refresh
  ];

  if (skipEndpoints.some(endpoint => request.url.startsWith(endpoint))) {
    return;
  }

  const startTime = Date.now();

  // Store start time on request context
  (request as any).apiUsageStartTime = startTime;

  // Hook into the response to track after response is sent
  const originalSend = reply.send.bind(reply);

  reply.send = function (payload: any) {
    // Track the usage asynchronously after sending response
    setImmediate(async () => {
      try {
        const apiUsageService = Container.get(ApiUsageService);
        const responseTime = Date.now() - ((request as any).apiUsageStartTime || startTime);

        // Only track for authenticated users
        if (request.customUser) {
          await apiUsageService.trackUsage(
            request.customUser.id,
            request.routerPath || request.url.split('?')[0], // Use route pattern if available
            request.method,
            reply.statusCode,
            responseTime,
            {
              tenantId: (request as any).tenant?.id,
              ipAddress: request.ip,
              userAgent: request.headers['user-agent'],
              metadata: {
                query: request.query,
                params: request.params,
                error: reply.statusCode >= 400 ? payload : undefined,
              },
            },
          );
        }
      } catch (error) {
        // Don't fail the request if tracking fails
        logger.error('Failed to track API usage', error as Error);
      }
    });

    return originalSend(payload);
  };
}

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(options?: { endpoint?: string; limit?: number; windowMs?: number }) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.customUser) {
      return; // Skip rate limiting for unauthenticated requests
    }

    const apiUsageService = Container.get(ApiUsageService);
    const endpoint = options?.endpoint || request.routerPath || '*';

    try {
      const rateLimitInfo = await apiUsageService.checkRateLimit(request.customUser.id, endpoint, options?.limit);

      // Add rate limit headers
      reply.header('X-RateLimit-Limit', rateLimitInfo.limit.toString());
      reply.header('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
      reply.header('X-RateLimit-Reset', rateLimitInfo.reset.toISOString());

      if (rateLimitInfo.retryAfter) {
        reply.header('Retry-After', rateLimitInfo.retryAfter.toString());
      }
    } catch (error: any) {
      if (error.statusCode === 403) {
        // Rate limit exceeded
        reply.code(429).send({
          error: 'Too Many Requests',
          message: error.message,
          details: error.details,
        });
      } else {
        throw error;
      }
    }
  };
}

/**
 * API quota enforcement middleware
 */
export function enforceApiQuota() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.customUser) {
      return; // Skip quota check for unauthenticated requests
    }

    const apiUsageService = Container.get(ApiUsageService);

    try {
      const quotas = await apiUsageService.getUsageQuota(request.customUser.id);
      const apiQuota = quotas.find(q => q.resource === 'api_calls');

      if (apiQuota && apiQuota.remaining <= 0) {
        reply.code(429).send({
          error: 'Quota Exceeded',
          message: 'Monthly API quota exceeded',
          details: {
            limit: apiQuota.limit,
            used: apiQuota.used,
            resetAt: apiQuota.resetAt,
          },
        });
      }

      // Add quota headers
      if (apiQuota) {
        reply.header('X-Quota-Limit', apiQuota.limit.toString());
        reply.header('X-Quota-Remaining', apiQuota.remaining.toString());
        reply.header('X-Quota-Reset', apiQuota.resetAt.toISOString());
      }
    } catch (error) {
      // Don't fail the request if quota check fails
      logger.error('Failed to check API quota', error as Error);
    }
  };
}

/**
 * Endpoint-specific rate limiting
 */
export function endpointRateLimit(endpoint: string, limit: number, windowMs: number = 60000) {
  return rateLimitMiddleware({ endpoint, limit, windowMs });
}

/**
 * Plan-based rate limiting
 */
export async function planBasedRateLimit(request: FastifyRequest, reply: FastifyReply) {
  if (!request.customUser) {
    return;
  }

  const apiUsageService = Container.get(ApiUsageService);
  const endpoint = request.routerPath || '*';

  try {
    // Check rate limit based on user's plan
    const rateLimitInfo = await apiUsageService.checkRateLimit(request.customUser.id, endpoint);

    // Add headers
    reply.header('X-RateLimit-Limit', rateLimitInfo.limit.toString());
    reply.header('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
    reply.header('X-RateLimit-Reset', rateLimitInfo.reset.toISOString());
  } catch (error: any) {
    if (error.statusCode === 403) {
      reply.code(429).send({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded for your plan',
        details: error.details,
      });
    }
  }
}
