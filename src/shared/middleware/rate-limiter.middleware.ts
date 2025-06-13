import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { TooManyRequestsException } from '@shared/exceptions';
import { logger } from '@shared/logger';
import { AuthRequest } from '@modules/auth/middleware/auth.middleware';
import { TenantRequest } from '@modules/tenant/middleware/tenant.middleware';

// Rate limit options
export interface RateLimitOptions {
  windowMs: number;
  max: number;
  timeWindow?: string; // Support for human-readable time format like '1 minute'
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (request: FastifyRequest) => string;
}

// Default options
const defaultOptions: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
};

/**
 * Rate limiter middleware factory
 * Creates a rate limiter middleware with the given options
 */
export function rateLimiter(options: Partial<RateLimitOptions> = {}) {
  // Convert timeWindow to windowMs if provided
  if (options.timeWindow) {
    options.windowMs = parseTimeWindow(options.timeWindow);
    delete options.timeWindow;
  }

  // Merge options with defaults
  const opts: RateLimitOptions = {
    ...defaultOptions,
    ...options
  };

  // Return middleware function
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // Generate key based on IP and user ID if available
      const authRequest = request as unknown as AuthRequest;
      const tenantRequest = request as unknown as TenantRequest;

      // Default key is IP address
      let key = request.ip;

      // Use custom key generator if provided
      if (opts.keyGenerator) {
        key = opts.keyGenerator(request);
      }
      // Otherwise, include user ID and tenant ID if available
      else if (authRequest.user) {
        key = `${key}:user:${authRequest.user.id}`;

        // if (tenantRequest.tenant) {
        //   key = `${key}:tenant:${tenantRequest.tenant.id}`;
        // }
      }

      // TODO: Implement actual rate limiting logic
      // For now, we'll just log and continue

      // Example implementation:
      // const rateLimiterService = Container.get(RateLimiterService);
      // const result = await rateLimiterService.check(key, opts.max, opts.windowMs);
      //
      // if (result.remaining <= 0) {
      //   throw new TooManyRequestsException(`Too many requests, please try again in ${result.retryAfter} seconds`);
      // }
      //
      // // Set rate limit headers
      // if (opts.standardHeaders) {
      //   reply.header('X-RateLimit-Limit', opts.max);
      //   reply.header('X-RateLimit-Remaining', result.remaining);
      //   reply.header('X-RateLimit-Reset', result.reset);
      // }

      // Log for debugging
      logger.debug('Rate limit check passed', {
        key,
        path: request.url
      });

    } catch (error) {
      logger.error('Rate limit check failed', error as Error);
      throw error;
    }
  };
}

/**
 * Parse human-readable time window to milliseconds
 * Examples: '1 minute', '5 minutes', '1 hour', '1 day'
 */
function parseTimeWindow(timeWindow: string): number {
  const parts = timeWindow.split(' ');
  if (parts.length !== 2) {
    throw new Error(`Invalid time window format: ${timeWindow}. Expected format: '1 minute', '5 minutes', etc.`);
  }

  const value = parseInt(parts[0], 10);
  const unit = parts[1].toLowerCase();

  if (isNaN(value) || value <= 0) {
    throw new Error(`Invalid time value: ${parts[0]}. Must be a positive number.`);
  }

  switch (unit) {
    case 'second':
    case 'seconds':
      return value * 1000;
    case 'minute':
    case 'minutes':
      return value * 60 * 1000;
    case 'hour':
    case 'hours':
      return value * 60 * 60 * 1000;
    case 'day':
    case 'days':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: ${unit}. Supported units: second(s), minute(s), hour(s), day(s).`);
  }
}
