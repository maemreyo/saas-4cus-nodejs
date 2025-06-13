// Controller for email campaign management

import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET, POST, PUT, DELETE, PATCH } from '@/shared/decorators';
import { EmailCampaignService } from '../services/email-campaign.service';
import { EmailAnalyticsService } from '../services/email-analytics.service';
import { ABTestingService } from '../services/ab-testing.service';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import { getTenantId } from '@/modules/tenant/tenant.context';
import {
  createCampaignSchema,
  updateCampaignSchema,
  campaignFiltersSchema,
  scheduleCampaignSchema,
  sendCampaignSchema
} from '../dto/email-campaign.dto';
import { z } from 'zod';

const duplicateCampaignSchema = z.object({
  name: z.string().optional()
});

@Controller('/api/email-marketing/campaigns')
export class EmailCampaignController {
  constructor(
    private readonly campaignService: EmailCampaignService,
    private readonly analytics: EmailAnalyticsService,
    private readonly abTesting: ABTestingService
  ) {}

  /**
   * Create campaign
   */
  @POST('/', {
    preHandler: [authenticate, requireTenant]
  })
  async createCampaign(
    request: FastifyRequest<{
      Body: z.infer<typeof createCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const data = createCampaignSchema.parse(request.body);

    const campaign = await this.campaignService.createCampaign(tenantId, data);

    reply.code(201).send({
      success: true,
      data: campaign
    });
  }

  /**
   * Get campaigns
   */
  @GET('/', {
    preHandler: [authenticate, requireTenant]
  })
  async getCampaigns(
    request: FastifyRequest<{
      Querystring: z.infer<typeof campaignFiltersSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const filters = campaignFiltersSchema.parse(request.query);

    const result = await this.campaignService.listCampaigns(tenantId, filters);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Get single campaign
   */
  @GET('/:campaignId', {
    preHandler: [authenticate, requireTenant]
  })
  async getCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    const campaign = await this.campaignService.getCampaign(tenantId, campaignId);

    reply.send({
      success: true,
      data: campaign
    });
  }

  /**
   * Update campaign
   */
  @PUT('/:campaignId', {
    preHandler: [authenticate, requireTenant]
  })
  async updateCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string },
      Body: z.infer<typeof updateCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const data = updateCampaignSchema.parse(request.body);

    const campaign = await this.campaignService.updateCampaign(
      tenantId,
      campaignId,
      data
    );

    reply.send({
      success: true,
      data: campaign
    });
  }

  /**
   * Delete campaign
   */
  @DELETE('/:campaignId', {
    preHandler: [authenticate, requireTenant]
  })
  async deleteCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    await this.campaignService.deleteCampaign(tenantId, campaignId);

    reply.send({
      success: true,
      message: 'Campaign deleted successfully'
    });
  }

  /**
   * Schedule campaign
   */
  @POST('/:campaignId/schedule', {
    preHandler: [authenticate, requireTenant]
  })
  async scheduleCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string },
      Body: z.infer<typeof scheduleCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const data = scheduleCampaignSchema.parse(request.body);

    const campaign = await this.campaignService.scheduleCampaign(
      tenantId,
      campaignId,
      data
    );

    reply.send({
      success: true,
      data: campaign
    });
  }

  /**
   * Send campaign
   */
  @POST('/:campaignId/send', {
    preHandler: [authenticate, requireTenant]
  })
  async sendCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string },
      Body: z.infer<typeof sendCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const options = sendCampaignSchema.parse(request.body);

    await this.campaignService.sendCampaign(tenantId, campaignId, options);

    reply.send({
      success: true,
      message: 'Campaign sending initiated'
    });
  }

  /**
   * Pause campaign
   */
  @PATCH('/:campaignId/pause', {
    preHandler: [authenticate, requireTenant]
  })
  async pauseCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    await this.campaignService.pauseCampaign(tenantId, campaignId);

    reply.send({
      success: true,
      message: 'Campaign paused successfully'
    });
  }

  /**
   * Resume campaign
   */
  @PATCH('/:campaignId/resume', {
    preHandler: [authenticate, requireTenant]
  })
  async resumeCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    await this.campaignService.resumeCampaign(tenantId, campaignId);

    reply.send({
      success: true,
      message: 'Campaign resumed successfully'
    });
  }

  /**
   * Cancel campaign
   */
  @PATCH('/:campaignId/cancel', {
    preHandler: [authenticate, requireTenant]
  })
  async cancelCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    await this.campaignService.cancelCampaign(tenantId, campaignId);

    reply.send({
      success: true,
      message: 'Campaign cancelled successfully'
    });
  }

  /**
   * Duplicate campaign
   */
  @POST('/:campaignId/duplicate', {
    preHandler: [authenticate, requireTenant]
  })
  async duplicateCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string },
      Body: z.infer<typeof duplicateCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const { name } = duplicateCampaignSchema.parse(request.body);

    const campaign = await this.campaignService.duplicateCampaign(
      tenantId,
      campaignId,
      name
    );

    reply.send({
      success: true,
      data: campaign
    });
  }

  /**
   * Get campaign analytics
   */
  @GET('/:campaignId/analytics', {
    preHandler: [authenticate, requireTenant]
  })
  async getCampaignAnalytics(
    request: FastifyRequest<{
      Params: { campaignId: string },
      Querystring: {
        includeHourlyMetrics?: boolean;
        includeClickMap?: boolean;
        includeDeviceStats?: boolean;
        includeLocationStats?: boolean;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { campaignId } = request.params;

    const analytics = await this.analytics.getCampaignAnalytics(
      campaignId,
      request.query
    );

    reply.send({
      success: true,
      data: analytics
    });
  }

  /**
   * Get A/B test results
   */
  @GET('/:campaignId/ab-test', {
    preHandler: [authenticate, requireTenant]
  })
  async getABTestResults(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { campaignId } = request.params;

    const summary = await this.abTesting.getTestSummary(campaignId);

    reply.send({
      success: true,
      data: summary
    });
  }

  /**
   * Get campaign recipients
   */
  @GET('/:campaignId/recipients', {
    preHandler: [authenticate, requireTenant]
  })
  async getCampaignRecipients(
    request: FastifyRequest<{
      Params: { campaignId: string },
      Querystring: {
        status?: string;
        page?: number;
        limit?: number;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { campaignId } = request.params;
    const { status, page = 1, limit = 20 } = request.query;

    // This would need implementation in the service
    reply.send({
      success: true,
      data: {
        recipients: [],
        total: 0,
        page,
        pages: 0
      }
    });
  }
}