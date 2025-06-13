// Routes registration for email marketing module

import { FastifyInstance } from 'fastify';
import { container } from '@/infrastructure/container';
import { EmailMarketingController } from './controllers/email-marketing.controller';
import { EmailListController } from './controllers/email-list.controller';
import { EmailCampaignController } from './controllers/email-campaign.controller';
import { EmailAutomationController } from './controllers/email-automation.controller';
import { EmailTemplateController } from './controllers/email-template.controller';
import { EmailTrackingController } from './controllers/email-tracking.controller';
import { EmailSegmentController } from './controllers/email-segment.controller';
import { EmailWebhookController } from './controllers/email-webhook.controller';
import {
  requireEmailMarketing,
  emailSendRateLimit,
  checkDailyEmailQuota,
  trackEmailUsage,
  validateCampaignOwnership,
  validateListOwnership,
  validateTemplateOwnership,
  validateAutomationOwnership,
  checkCampaignSendPermission,
  validateEmailContent,
  checkSubscriberLimit,
  validateBulkOperation,
  antiSpamCheck,
  validateEmailAddress,
} from './middleware/email-marketing.middleware';

export async function registerEmailMarketingRoutes(app: FastifyInstance): Promise<void> {
  // Add global email marketing middleware
  app.addHook('preHandler', requireEmailMarketing);

  // Register main controller
  const emailMarketingController = container.resolve(EmailMarketingController);
  emailMarketingController.register(app);

  // Register list controller with middleware
  const listController = container.resolve(EmailListController);
  listController.register(app);

  // Add list-specific middleware
  app.addHook('preHandler', async (request, reply) => {
    // Apply to list import endpoints
    if (request.routerPath?.includes('/lists/:listId/import')) {
      await validateBulkOperation(10000)(request, reply);
      await checkSubscriberLimit(request, reply);
    }
  });

  // Register campaign controller with middleware
  const campaignController = container.resolve(EmailCampaignController);
  campaignController.register(app);

  // Add campaign-specific middleware
  app.addHook('preHandler', async (request, reply) => {
    // Apply to campaign send endpoints
    if (request.routerPath?.includes('/campaigns/:campaignId/send')) {
      await validateCampaignOwnership()(request, reply);
      await checkCampaignSendPermission(request, reply);
      await emailSendRateLimit()(request, reply);
      await checkDailyEmailQuota(request, reply);
      await trackEmailUsage(request, reply);
    }

    // Apply to campaign update endpoints
    if (request.routerPath?.includes('/campaigns/:campaignId') && ['PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      await validateCampaignOwnership()(request, reply);
    }
  });

  // Register automation controller
  const automationController = container.resolve(EmailAutomationController);
  automationController.register(app);

  // Add automation-specific middleware
  app.addHook('preHandler', async (request, reply) => {
    if (request.routerPath?.includes('/automations/:automationId')) {
      await validateAutomationOwnership()(request, reply);
    }
  });

  // Register template controller
  const templateController = container.resolve(EmailTemplateController);
  templateController.register(app);

  // Add template-specific middleware
  app.addHook('preHandler', async (request, reply) => {
    if (request.routerPath?.includes('/templates/:templateId')) {
      await validateTemplateOwnership()(request, reply);
    }
  });

  // Register tracking controller (public endpoints)
  const trackingController = container.resolve(EmailTrackingController);
  trackingController.register(app);

  // Register webhook controller (public endpoints)
  const webhookController = container.resolve(EmailWebhookController);
  webhookController.register(app);

  // Register segment controller
  const segmentController = container.resolve(EmailSegmentController);
  segmentController.register(app);

  // Public endpoints middleware
  app.addHook('preHandler', async (request, reply) => {
    // Anti-spam for public subscription endpoints
    if (request.routerPath?.includes('/subscribe') && request.method === 'POST') {
      await antiSpamCheck(5, 3600000)(request, reply); // 5 attempts per hour
      await validateEmailAddress()(request, reply);
    }

    // Anti-spam for unsubscribe
    if (request.routerPath?.includes('/unsubscribe') && request.method === 'POST') {
      await antiSpamCheck(10, 3600000)(request, reply); // 10 attempts per hour
      await validateEmailAddress()(request, reply);
    }
  });

  // Validate email content for all endpoints that accept it
  app.addHook('preHandler', async (request, reply) => {
    if (
      ['POST', 'PUT', 'PATCH'].includes(request.method) &&
      (request.routerPath?.includes('/campaigns') ||
        request.routerPath?.includes('/templates') ||
        request.routerPath?.includes('/automations'))
    ) {
      await validateEmailContent()(request, reply);
    }
  });
}

// src/modules/email-marketing/controllers/email-tracking.controller.ts
// Controller for email tracking endpoints

import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET } from '@/shared/decorators';
import { EmailTrackingService } from '../services/email-tracking.service';

@Controller('/track')
export class EmailTrackingController {
  constructor(private readonly trackingService: EmailTrackingService) {}

  /**
   * Track email open
   */
  @GET('/pixel/:encoded.gif')
  async trackOpen(
    request: FastifyRequest<{
      Params: { encoded: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { encoded } = request.params;

    await this.trackingService.trackOpen(encoded, {
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip,
    });

    // Return 1x1 transparent GIF
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

    reply.type('image/gif').header('Cache-Control', 'no-store, no-cache, must-revalidate, private').send(pixel);
  }

  /**
   * Track link click
   */
  @GET('/click/:encoded')
  async trackClick(
    request: FastifyRequest<{
      Params: { encoded: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { encoded } = request.params;

    const originalUrl = await this.trackingService.trackClick(encoded, {
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip,
    });

    if (originalUrl) {
      reply.redirect(302, originalUrl);
    } else {
      reply.code(404).send({ error: 'Invalid tracking link' });
    }
  }
}

// src/modules/email-marketing/controllers/email-segment.controller.ts
// Controller for email segmentation

import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET, POST, PUT, DELETE } from '@/shared/decorators';
import { EmailSegmentService } from '../services/email-segment.service';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import { createSegmentSchema, updateSegmentSchema, testSegmentSchema } from '../dto/email-segment.dto';
import { z } from 'zod';

@Controller('/api/email-marketing/lists/:listId/segments')
export class EmailSegmentController {
  constructor(private readonly segmentService: EmailSegmentService) {}

  /**
   * Create segment
   */
  @POST('/', {
    preHandler: [authenticate, requireTenant],
  })
  async createSegment(
    request: FastifyRequest<{
      Params: { listId: string };
      Body: z.infer<typeof createSegmentSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { listId } = request.params;
    const data = createSegmentSchema.parse(request.body);

    const segment = await this.segmentService.createSegment(listId, data);

    reply.code(201).send({
      success: true,
      data: segment,
    });
  }

  /**
   * Get segments
   */
  @GET('/', {
    preHandler: [authenticate, requireTenant],
  })
  async getSegments(
    request: FastifyRequest<{
      Params: { listId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { listId } = request.params;

    const segments = await this.segmentService.getListSegments(listId);

    reply.send({
      success: true,
      data: segments,
    });
  }

  /**
   * Get segment
   */
  @GET('/:segmentId', {
    preHandler: [authenticate, requireTenant],
  })
  async getSegment(
    request: FastifyRequest<{
      Params: { listId: string; segmentId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { segmentId } = request.params;

    const segment = await this.segmentService.getSegment(segmentId);

    reply.send({
      success: true,
      data: segment,
    });
  }

  /**
   * Update segment
   */
  @PUT('/:segmentId', {
    preHandler: [authenticate, requireTenant],
  })
  async updateSegment(
    request: FastifyRequest<{
      Params: { listId: string; segmentId: string };
      Body: z.infer<typeof updateSegmentSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { segmentId } = request.params;
    const data = updateSegmentSchema.parse(request.body);

    const segment = await this.segmentService.updateSegment(segmentId, data);

    reply.send({
      success: true,
      data: segment,
    });
  }

  /**
   * Delete segment
   */
  @DELETE('/:segmentId', {
    preHandler: [authenticate, requireTenant],
  })
  async deleteSegment(
    request: FastifyRequest<{
      Params: { listId: string; segmentId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { segmentId } = request.params;

    await this.segmentService.deleteSegment(segmentId);

    reply.send({
      success: true,
      message: 'Segment deleted successfully',
    });
  }

  /**
   * Test segment
   */
  @POST('/test', {
    preHandler: [authenticate, requireTenant],
  })
  async testSegment(
    request: FastifyRequest<{
      Params: { listId: string };
      Body: z.infer<typeof testSegmentSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { listId } = request.params;
    const data = testSegmentSchema.parse(request.body);

    const result = await this.segmentService.testSegment(listId, data);

    reply.send({
      success: true,
      data: result,
    });
  }

  /**
   * Refresh segment
   */
  @POST('/:segmentId/refresh', {
    preHandler: [authenticate, requireTenant],
  })
  async refreshSegment(
    request: FastifyRequest<{
      Params: { listId: string; segmentId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { segmentId } = request.params;

    const segment = await this.segmentService.refreshSegment(segmentId);

    reply.send({
      success: true,
      data: segment,
    });
  }
}

// src/modules/email-marketing/events/email-marketing.events.ts
// Event definitions for email marketing module

export const EmailMarketingEvents = {
  // List events
  LIST_CREATED: 'email.list.created',
  LIST_UPDATED: 'email.list.updated',
  LIST_DELETED: 'email.list.deleted',
  LIST_CLEANED: 'email.list.cleaned',

  // Subscriber events
  SUBSCRIBER_ADDED: 'email.subscriber.added',
  SUBSCRIBER_CONFIRMED: 'email.subscriber.confirmed',
  SUBSCRIBER_UPDATED: 'email.subscriber.updated',
  SUBSCRIBER_UNSUBSCRIBED: 'email.subscriber.unsubscribed',
  SUBSCRIBERS_IMPORTED: 'email.subscribers.imported',

  // Campaign events
  CAMPAIGN_CREATED: 'email.campaign.created',
  CAMPAIGN_UPDATED: 'email.campaign.updated',
  CAMPAIGN_DELETED: 'email.campaign.deleted',
  CAMPAIGN_SCHEDULED: 'email.campaign.scheduled',
  CAMPAIGN_SENDING: 'email.campaign.sending',
  CAMPAIGN_SENT: 'email.campaign.sent',
  CAMPAIGN_PAUSED: 'email.campaign.paused',
  CAMPAIGN_RESUMED: 'email.campaign.resumed',
  CAMPAIGN_CANCELLED: 'email.campaign.cancelled',
  CAMPAIGN_COMPLETED: 'email.campaign.completed',
  CAMPAIGN_DUPLICATED: 'email.campaign.duplicated',

  // A/B Testing events
  ABTEST_CREATED: 'email.abtest.created',
  ABTEST_WINNER: 'email.abtest.winner',
  ABTEST_CONTROL_SENDING: 'email.abtest.control.sending',

  // Automation events
  AUTOMATION_CREATED: 'email.automation.created',
  AUTOMATION_UPDATED: 'email.automation.updated',
  AUTOMATION_ACTIVATED: 'email.automation.activated',
  AUTOMATION_DEACTIVATED: 'email.automation.deactivated',
  AUTOMATION_ENROLLED: 'email.automation.enrolled',
  AUTOMATION_COMPLETED: 'email.automation.completed',
  AUTOMATION_CANCELLED: 'email.automation.cancelled',
  AUTOMATION_STEP_ADDED: 'email.automation.step.added',
  AUTOMATION_STEP_SENT: 'email.automation.step.sent',

  // Template events
  TEMPLATE_CREATED: 'email.template.created',
  TEMPLATE_UPDATED: 'email.template.updated',
  TEMPLATE_DELETED: 'email.template.deleted',
  TEMPLATE_CLONED: 'email.template.cloned',
  TEMPLATE_ARCHIVED: 'email.template.archived',

  // Segment events
  SEGMENT_CREATED: 'email.segment.created',
  SEGMENT_UPDATED: 'email.segment.updated',
  SEGMENT_DELETED: 'email.segment.deleted',
  SEGMENT_SIZE_CHANGED: 'email.segment.size.changed',

  // Tracking events
  EMAIL_OPENED: 'email.opened',
  EMAIL_CLICKED: 'email.clicked',
  EMAIL_BOUNCED: 'email.bounced',
  EMAIL_COMPLAINED: 'email.complained',

  // Testing events
  TEST_EMAIL_SENT: 'email.test.sent',
} as const;

export type EmailMarketingEventType = (typeof EmailMarketingEvents)[keyof typeof EmailMarketingEvents];

// Event payload interfaces
export interface EmailListCreatedEvent {
  tenantId: string;
  listId: string;
  name: string;
}

export interface EmailSubscriberAddedEvent {
  listId: string;
  subscriberId: string;
  email: string;
  requiresConfirmation: boolean;
}

export interface EmailCampaignSendingEvent {
  tenantId: string;
  campaignId: string;
  recipientCount: number;
}

export interface EmailAutomationEnrolledEvent {
  automationId: string;
  subscriberId: string;
  enrollmentId: string;
}

export interface EmailABTestWinnerEvent {
  campaignId: string;
  variantId: string;
  variantName: string;
  metric: string;
  improvement: number;
}
