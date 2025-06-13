// Middleware for email marketing module

import { FastifyRequest, FastifyReply } from 'fastify';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AppError } from '@/shared/exceptions';
import { getTenantId } from '@/modules/tenant/tenant.context';
import { container } from '@/infrastructure/container';
import { z } from 'zod';

/**
 * Rate limit for email sending
 */
export function emailSendRateLimit(
  limit: number = 100,
  windowMs: number = 3600000 // 1 hour
) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const redis = container.resolve(RedisService);
    const tenantId = getTenantId(request);

    const key = `email-rate-limit:${tenantId}:${Math.floor(Date.now() / windowMs)}`;
    const current = await redis.increment(key);

    // Set expiry on first increment
    if (current === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }

    if (current > limit) {
      throw new AppError(
        `Email sending limit exceeded. Maximum ${limit} emails per hour.`,
        429
      );
    }

    // Add rate limit headers
    reply.header('X-Email-RateLimit-Limit', limit.toString());
    reply.header('X-Email-RateLimit-Remaining', Math.max(0, limit - current).toString());
    reply.header('X-Email-RateLimit-Reset', new Date(Math.ceil(Date.now() / windowMs) * windowMs).toISOString());
  };
}

/**
 * Check email marketing module is enabled
 */
export async function requireEmailMarketing(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const enabled = process.env.EMAIL_MARKETING_ENABLED === 'true';

  if (!enabled) {
    throw new AppError('Email marketing module is not enabled', 403);
  }
}

/**
 * Validate campaign ownership
 */
export function validateCampaignOwnership() {
  return async function (
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const prisma = container.resolve(PrismaService);
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    const campaign = await prisma.client.emailCampaign.findFirst({
      where: {
        id: campaignId,
        tenantId
      }
    });

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    // Attach to request for use in handlers
    (request as any).campaign = campaign;
  };
}

/**
 * Validate list ownership
 */
export function validateListOwnership() {
  return async function (
    request: FastifyRequest<{
      Params: { listId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const prisma = container.resolve(PrismaService);
    const tenantId = getTenantId(request);
    const { listId } = request.params;

    const list = await prisma.client.emailList.findFirst({
      where: {
        id: listId,
        tenantId,
        deletedAt: null
      }
    });

    if (!list) {
      throw new AppError('Email list not found', 404);
    }

    // Attach to request for use in handlers
    (request as any).list = list;
  };
}

/**
 * Validate template ownership
 */
export function validateTemplateOwnership() {
  return async function (
    request: FastifyRequest<{
      Params: { templateId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const prisma = container.resolve(PrismaService);
    const tenantId = getTenantId(request);
    const { templateId } = request.params;

    const template = await prisma.client.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [
          { tenantId },
          { isPublic: true }
        ],
        isArchived: false
      }
    });

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    // Check write permissions for non-public templates
    if (template.tenantId !== tenantId && request.method !== 'GET') {
      throw new AppError('Cannot modify public templates', 403);
    }

    // Attach to request for use in handlers
    (request as any).template = template;
  };
}

/**
 * Validate automation ownership
 */
export function validateAutomationOwnership() {
  return async function (
    request: FastifyRequest<{
      Params: { automationId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const prisma = container.resolve(PrismaService);
    const tenantId = getTenantId(request);
    const { automationId } = request.params;

    const automation = await prisma.client.emailAutomation.findFirst({
      where: {
        id: automationId,
        tenantId
      }
    });

    if (!automation) {
      throw new AppError('Automation not found', 404);
    }

    // Attach to request for use in handlers
    (request as any).automation = automation;
  };
}

/**
 * Check campaign send permissions
 */
export async function checkCampaignSendPermission(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const campaign = (request as any).campaign;

  if (!campaign) {
    throw new AppError('Campaign not found in request context', 500);
  }

  // Check campaign status
  if (campaign.status === 'SENT') {
    throw new AppError('Campaign has already been sent', 400);
  }

  if (campaign.status === 'SENDING') {
    throw new AppError('Campaign is currently being sent', 400);
  }

  if (campaign.status === 'CANCELLED') {
    throw new AppError('Campaign has been cancelled', 400);
  }
}

/**
 * Validate email content
 */
export function validateEmailContent() {
  const schema = z.object({
    subject: z.string().min(1).max(500),
    htmlContent: z.string().min(1),
    textContent: z.string().optional()
  });

  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const body = request.body as any;

      // Validate if email content is present
      if (body.subject || body.htmlContent) {
        schema.parse({
          subject: body.subject,
          htmlContent: body.htmlContent,
          textContent: body.textContent
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Invalid email content', 400, error.errors);
      }
      throw error;
    }
  };
}

/**
 * Check daily email quota
 */
export async function checkDailyEmailQuota(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const redis = container.resolve(RedisService);
  const tenantId = getTenantId(request);

  const dailyLimit = parseInt(process.env.EMAIL_MAX_PER_DAY || '100000');
  const key = `email-daily-quota:${tenantId}:${new Date().toISOString().split('T')[0]}`;

  const current = await redis.get<number>(key) || 0;

  if (current >= dailyLimit) {
    throw new AppError(
      `Daily email quota exceeded. Maximum ${dailyLimit} emails per day.`,
      429
    );
  }
}

/**
 * Track email usage
 */
export async function trackEmailUsage(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Hook to track after response
  reply.addHook('onSend', async (req, rep, payload) => {
    const redis = container.resolve(RedisService);
    const tenantId = getTenantId(request);

    // Only track on successful sends
    if (rep.statusCode >= 200 && rep.statusCode < 300) {
      const dailyKey = `email-daily-quota:${tenantId}:${new Date().toISOString().split('T')[0]}`;
      const monthlyKey = `email-monthly-quota:${tenantId}:${new Date().toISOString().slice(0, 7)}`;

      await Promise.all([
        redis.increment(dailyKey),
        redis.increment(monthlyKey)
      ]);

      // Set expiry
      await redis.expire(dailyKey, 86400); // 24 hours
      await redis.expire(monthlyKey, 2592000); // 30 days
    }
  });
}

/**
 * Validate subscriber limit
 */
export async function checkSubscriberLimit(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const prisma = container.resolve(PrismaService);
  const tenantId = getTenantId(request);

  // Get tenant's plan limits
  const tenant = await prisma.client.tenant.findUnique({
    where: { id: tenantId },
    include: {
      subscription: {
        include: {
          plan: true
        }
      }
    }
  });

  if (!tenant?.subscription?.plan) {
    return; // No limits if no subscription
  }

  const planLimits = tenant.subscription.plan.features as any;
  const maxSubscribers = planLimits?.maxSubscribers || Infinity;

  if (maxSubscribers !== Infinity) {
    const currentCount = await prisma.client.emailListSubscriber.count({
      where: {
        list: { tenantId },
        subscribed: true
      }
    });

    if (currentCount >= maxSubscribers) {
      throw new AppError(
        `Subscriber limit reached. Your plan allows maximum ${maxSubscribers} subscribers.`,
        403
      );
    }
  }
}

/**
 * Validate bulk operation size
 */
export function validateBulkOperation(maxSize: number = 10000) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const body = request.body as any;

    if (body.subscribers && Array.isArray(body.subscribers)) {
      if (body.subscribers.length > maxSize) {
        throw new AppError(
          `Bulk operation size exceeds maximum of ${maxSize} items`,
          400
        );
      }
    }

    if (body.recipientIds && Array.isArray(body.recipientIds)) {
      if (body.recipientIds.length > maxSize) {
        throw new AppError(
          `Bulk operation size exceeds maximum of ${maxSize} recipients`,
          400
        );
      }
    }
  };
}

/**
 * Anti-spam check for public endpoints
 */
export function antiSpamCheck(
  maxAttempts: number = 5,
  windowMs: number = 3600000 // 1 hour
) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const redis = container.resolve(RedisService);
    const ip = request.ip;
    const endpoint = request.routerPath;

    const key = `anti-spam:${endpoint}:${ip}:${Math.floor(Date.now() / windowMs)}`;
    const attempts = await redis.increment(key);

    // Set expiry on first attempt
    if (attempts === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }

    if (attempts > maxAttempts) {
      throw new AppError(
        'Too many requests. Please try again later.',
        429
      );
    }
  };
}

/**
 * Validate email address format
 */
export function validateEmailAddress() {
  const emailSchema = z.string().email();

  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const body = request.body as any;
    const emails: string[] = [];

    // Collect all email fields
    if (body.email) emails.push(body.email);
    if (body.recipientEmail) emails.push(body.recipientEmail);
    if (body.fromEmail) emails.push(body.fromEmail);
    if (body.replyTo) emails.push(body.replyTo);
    if (body.testEmails) emails.push(...body.testEmails);

    // Validate all emails
    for (const email of emails) {
      try {
        emailSchema.parse(email);
      } catch (error) {
        throw new AppError(`Invalid email address: ${email}`, 400);
      }
    }
  };
}
