import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable } from '@/shared/decorators';
import { EmailCampaignService } from '../services/email-campaign.service';
import { EmailAnalyticsService } from '../services/email-analytics.service';
import { ABTestingService } from '../services/ab-testing.service';
import { getTenantId } from '@/modules/tenant/tenant.utils';
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

@Injectable()
export class EmailCampaignController {
  constructor(
    private readonly campaignService: EmailCampaignService,
    private readonly analytics: EmailAnalyticsService,
    private readonly abTesting: ABTestingService
  ) {}

  /**
   * Create campaign
   */
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
  async getCampaigns(
    request: FastifyRequest<{
      Querystring: z.infer<typeof campaignFiltersSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const filters = campaignFiltersSchema.parse(request.query);

    const result = await this.campaignService.getCampaigns(tenantId, filters);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Get single campaign
   */
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
  async updateCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
      Body: z.infer<typeof updateCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const data = updateCampaignSchema.parse(request.body);

    const campaign = await this.campaignService.updateCampaign(tenantId, campaignId, data);

    reply.send({
      success: true,
      data: campaign
    });
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    await this.campaignService.deleteCampaign(tenantId, campaignId);

    reply.code(204).send();
  }

  /**
   * Schedule campaign
   */
  async scheduleCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
      Body: z.infer<typeof scheduleCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const data = scheduleCampaignSchema.parse(request.body);

    const campaign = await this.campaignService.scheduleCampaign(tenantId, campaignId, data);

    reply.send({
      success: true,
      data: campaign
    });
  }

  /**
   * Send campaign immediately
   */
  async sendCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
      Body: z.infer<typeof sendCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const data = sendCampaignSchema.parse(request.body);

    const result = await this.campaignService.sendCampaign(tenantId, campaignId, data);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Pause campaign
   */
  async pauseCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    const campaign = await this.campaignService.pauseCampaign(tenantId, campaignId);

    reply.send({
      success: true,
      data: campaign
    });
  }

  /**
   * Resume campaign
   */
  async resumeCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    const campaign = await this.campaignService.resumeCampaign(tenantId, campaignId);

    reply.send({
      success: true,
      data: campaign
    });
  }

  /**
   * Duplicate campaign
   */
  async duplicateCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
      Body: z.infer<typeof duplicateCampaignSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const data = duplicateCampaignSchema.parse(request.body);

    const campaign = await this.campaignService.duplicateCampaign(tenantId, campaignId, data.name);

    reply.code(201).send({
      success: true,
      data: campaign
    });
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    const analytics = await this.analytics.getCampaignAnalytics(campaignId, {});

    reply.send({
      success: true,
      data: analytics
    });
  }

  /**
   * Get campaign performance over time
   */
  async getCampaignPerformance(
    request: FastifyRequest<{
      Params: { campaignId: string }
      Querystring: {
        interval?: 'hourly' | 'daily' | 'weekly';
        startDate?: string;
        endDate?: string;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const { interval = 'daily', startDate, endDate } = request.query;

    const performance = await this.analytics.getCampaignPerformance(
      tenantId,
      campaignId,
      interval,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    reply.send({
      success: true,
      data: performance
    });
  }

  /**
   * Preview campaign
   */
  async previewCampaign(
    request: FastifyRequest<{
      Params: { campaignId: string }
      Querystring: {
        subscriberId?: string;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const { subscriberId } = request.query;

    const preview = await this.campaignService.previewCampaign(tenantId, campaignId, subscriberId);

    reply.send({
      success: true,
      data: preview
    });
  }

  /**
   * Send test email
   */
  async sendTestEmail(
    request: FastifyRequest<{
      Params: { campaignId: string }
      Body: {
        recipientEmail: string;
        subscriberId?: string;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const { recipientEmail, subscriberId } = request.body;

    await this.campaignService.sendTestEmail(tenantId, campaignId, recipientEmail, subscriberId);

    reply.send({
      success: true,
      message: 'Test email sent successfully'
    });
  }

  /**
   * Create A/B test
   */
  async createABTest(
    request: FastifyRequest<{
      Params: { campaignId: string }
      Body: {
        variantB: {
          subject?: string;
          content?: string;
          senderName?: string;
        };
        testPercentage: number;
        winnerCriteria: 'open_rate' | 'click_rate' | 'conversion_rate';
        testDuration: number; // hours
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;
    const data = request.body;

    const abTest = await this.abTesting.createABTest(tenantId, campaignId, data);

    reply.code(201).send({
      success: true,
      data: abTest
    });
  }

  /**
   * Get A/B test results
   */
  async getABTestResults(
    request: FastifyRequest<{
      Params: { campaignId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId } = request.params;

    const results = await this.abTesting.getABTestResults(tenantId, campaignId);

    reply.send({
      success: true,
      data: results
    });
  }
}
