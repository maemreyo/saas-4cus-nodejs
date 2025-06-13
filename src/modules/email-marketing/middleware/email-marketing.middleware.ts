import { FastifyRequest, FastifyReply } from 'fastify';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AppError } from '@/shared/exceptions';
import { getTenantId } from '@/modules/tenant/tenant.utils';
import { Container } from 'typedi';
import { z } from 'zod';
import { EmailCampaignStatus } from '@prisma/client';

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
    const redis = Container.get(RedisService);
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
  };
}

/**
 * Check daily email quota
 */
export async function checkDailyEmailQuota(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const redis = Container.get(RedisService);
  const tenantId = getTenantId(request);

  // Get tenant's daily limit from database or config
  const dailyLimit = 10000; // Default limit, should be fetched from tenant settings

  const dailyKey = `email-daily-quota:${tenantId}:${new Date().toISOString().split('T')[0]}`;
  const currentCount = await redis.get(dailyKey) || 0;

  if (Number(currentCount) >= dailyLimit) {
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
  // Track after response
  const tenantId = getTenantId(request);
  const redis = Container.get(RedisService);

  // Set up tracking after response is sent
  request.raw.on('end', () => {
    // Only track on successful sends
    if (reply.statusCode >= 200 && reply.statusCode < 300) {
      const dailyKey = `email-daily-quota:${tenantId}:${new Date().toISOString().split('T')[0]}`;
      const monthlyKey = `email-monthly-quota:${tenantId}:${new Date().toISOString().slice(0, 7)}`;

      // Use Promise.all but don't await in the callback
      Promise.all([
        redis.increment(dailyKey),
        redis.increment(monthlyKey)
      ]).then(() => {
        // Set expiry after increment
        redis.expire(dailyKey, 86400); // 24 hours
        redis.expire(monthlyKey, 2592000); // 30 days
      }).catch(err => {
        console.error('Error tracking email usage:', err);
      });
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
  const prisma = Container.get(PrismaService);
  const tenantId = getTenantId(request);

  // Get tenant's plan limits
  const tenant = await prisma.client.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      subscriptionId: true
    }
  });

  if (!tenant?.subscriptionId) {
    return; // No limits if no subscription
  }

  // Get subscription details
  const subscription = await prisma.client.subscription.findUnique({
    where: { id: tenant.subscriptionId }
  });

  if (!subscription) {
    return; // No limits if no subscription
  }

  // Get plan limits from subscription metadata
  const planLimits = subscription.metadata as any;
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
        `Subscriber limit reached. Maximum ${maxSubscribers} subscribers allowed.`,
        403
      );
    }
  }
}

/**
 * Validate campaign ownership
 */
export function validateCampaignOwnership() {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const prisma = Container.get(PrismaService);
    const tenantId = getTenantId(request);
    const campaignId = (request.params as any)?.campaignId;

    if (!campaignId) {
      return; // Skip if no campaign ID in params
    }

    const campaign = await prisma.client.emailCampaign.findFirst({
      where: {
        id: campaignId,
        tenantId
      }
    });

    if (!campaign) {
      throw new AppError('Campaign not found or access denied', 404);
    }
  };
}

/**
 * Validate automation ownership
 */
export function validateAutomationOwnership() {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const prisma = Container.get(PrismaService);
    const tenantId = getTenantId(request);
    const automationId = (request.params as any)?.automationId;

    if (!automationId) {
      return; // Skip if no automation ID in params
    }

    const automation = await prisma.client.emailAutomation.findFirst({
      where: {
        id: automationId,
        tenantId
      }
    });

    if (!automation) {
      throw new AppError('Automation not found or access denied', 404);
    }
  };
}

/**
 * Validate template ownership
 */
export function validateTemplateOwnership() {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const prisma = Container.get(PrismaService);
    const tenantId = getTenantId(request);
    const templateId = (request.params as any)?.templateId;

    if (!templateId) {
      return; // Skip if no template ID in params
    }

    const template = await prisma.client.emailTemplate.findFirst({
      where: {
        id: templateId,
        tenantId
      }
    });

    if (!template) {
      throw new AppError('Template not found or access denied', 404);
    }
  };
}

/**
 * Validate list ownership
 */
export function validateListOwnership() {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const prisma = Container.get(PrismaService);
    const tenantId = getTenantId(request);
    const listId = (request.params as any)?.listId;

    if (!listId) {
      return; // Skip if no list ID in params
    }

    const list = await prisma.client.emailList.findFirst({
      where: {
        id: listId,
        tenantId
      }
    });

    if (!list) {
      throw new AppError('Email list not found or access denied', 404);
    }
  };
}

/**
 * Check campaign send permission
 */
export async function checkCampaignSendPermission(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const prisma = Container.get(PrismaService);
  const tenantId = getTenantId(request);
  const campaignId = (request.params as any)?.campaignId;

  if (!campaignId) {
    return; // Skip if no campaign ID
  }

  const campaign = await prisma.client.emailCampaign.findFirst({
    where: {
      id: campaignId,
      tenantId
    }
  });

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  // Check if campaign is in sendable state
  if (campaign.status === EmailCampaignStatus.SENT) {
    throw new AppError('Campaign has already been sent', 400);
  }

  if (campaign.status === EmailCampaignStatus.CANCELLED) {
    throw new AppError('Cannot send cancelled campaign', 400);
  }

  // Check if campaign has required fields
  if (!campaign.subject || !campaign.htmlContent) {
    throw new AppError('Campaign missing required fields (subject, htmlContent)', 400);
  }
}

/**
 * Anti-spam check
 */
export function antiSpamCheck(limit: number = 5, windowMs: number = 3600000) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const redis = Container.get(RedisService);
    const ip = request.ip;

    const key = `anti-spam:${ip}:${Math.floor(Date.now() / windowMs)}`;
    const current = await redis.increment(key);

    // Set expiry on first increment
    if (current === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }

    if (current > limit) {
      throw new AppError('Too many requests from this IP', 429);
    }
  };
}

/**
 * Validate email address format
 */
export function validateEmailAddress() {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const body = request.body as any;

    if (body.email) {
      const emailSchema = z.string().email();
      const result = emailSchema.safeParse(body.email);

      if (!result.success) {
        throw new AppError('Invalid email address format', 400);
      }
    }
  };
}

/**
 * Check if email is in suppression list
 */
export async function checkSuppressionList(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const prisma = Container.get(PrismaService);
  const tenantId = getTenantId(request);
  const body = request.body as any;

  if (body.email) {
    const suppressed = await prisma.client.emailUnsubscribe.findFirst({
      where: {
        tenantId,
        email: body.email.toLowerCase()
      }
    });

    if (suppressed) {
      throw new AppError(
        `Email ${body.email} is in suppression list (reason: ${suppressed.reason})`,
        400
      );
    }
  }
}
