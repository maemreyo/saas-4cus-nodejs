import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable } from '@/shared/decorators';
import { EmailMarketingService } from '../services/email-marketing.service';
import { getTenantId } from '@/modules/tenant/tenant.utils';
import { z } from 'zod';

const exportDataSchema = z.object({
  includeSubscribers: z.boolean().optional(),
  includeCampaigns: z.boolean().optional(),
  includeAnalytics: z.boolean().optional(),
  format: z.enum(['json', 'csv']).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional()
});

const testEmailSchema = z.object({
  campaignId: z.string(),
  recipientEmail: z.string().email()
});

const previewEmailSchema = z.object({
  campaignId: z.string(),
  subscriberId: z.string().optional()
});

const validateContentSchema = z.object({
  html: z.string(),
  text: z.string().optional()
});

@Injectable()
export class EmailMarketingController {
  constructor(
    private readonly emailMarketing: EmailMarketingService
  ) {}

  /**
   * Get email marketing dashboard
   */
  async getDashboard(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const dashboard = await this.emailMarketing.getDashboard(tenantId);

    reply.send({
      success: true,
      data: dashboard
    });
  }

  /**
   * Get email marketing statistics
   */
  async getStats(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const stats = await this.emailMarketing.getStats(tenantId);

    reply.send({
      success: true,
      data: stats
    });
  }

  /**
   * Get health status
   */
  async getHealthStatus(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const health = await this.emailMarketing.getHealthStatus(tenantId);

    reply.send({
      success: true,
      data: health
    });
  }

  /**
   * Export email marketing data
   */
  async exportData(
    request: FastifyRequest<{
      Body: z.infer<typeof exportDataSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const options = exportDataSchema.parse(request.body);

    const data = await this.emailMarketing.exportData(tenantId, options);

    const filename = `email-marketing-export-${new Date().toISOString().split('T')[0]}.${options.format || 'json'}`;
    const contentType = options.format === 'csv' ? 'text/csv' : 'application/json';

    reply
      .header('Content-Type', contentType)
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(data);
  }

  /**
   * Test email configuration
   */
  async testEmail(
    request: FastifyRequest<{
      Body: z.infer<typeof testEmailSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const data = testEmailSchema.parse(request.body);

    await this.emailMarketing.sendTestEmail(tenantId, data.campaignId, data.recipientEmail);

    reply.send({
      success: true,
      message: 'Test email sent successfully'
    });
  }

  /**
   * Preview email
   */
  async previewEmail(
    request: FastifyRequest<{
      Body: z.infer<typeof previewEmailSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const data = previewEmailSchema.parse(request.body);

    const preview = await this.emailMarketing.previewEmail(tenantId, data.campaignId, data.subscriberId);

    reply.send({
      success: true,
      data: preview
    });
  }

  /**
   * Validate email content
   */
  async validateContent(
    request: FastifyRequest<{
      Body: z.infer<typeof validateContentSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const data = validateContentSchema.parse(request.body);

    const validation = await this.emailMarketing.validateEmailContent(data.html, data.text);

    reply.send({
      success: true,
      data: validation
    });
  }

  /**
   * Get delivery rates
   */
  async getDeliveryRates(
    request: FastifyRequest<{
      Querystring: {
        startDate?: string;
        endDate?: string;
        interval?: 'hourly' | 'daily' | 'weekly' | 'monthly';
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { startDate, endDate, interval = 'daily' } = request.query;

    const rates = await this.emailMarketing.getDeliveryRates(
      tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      interval
    );

    reply.send({
      success: true,
      data: rates
    });
  }

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(
    request: FastifyRequest<{
      Querystring: {
        startDate?: string;
        endDate?: string;
        segmentBy?: 'campaign' | 'list' | 'automation';
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { startDate, endDate, segmentBy } = request.query;

    const engagement = await this.emailMarketing.getEngagementMetrics(
      tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      segmentBy
    );

    reply.send({
      success: true,
      data: engagement
    });
  }

  /**
   * Get reputation score
   */
  async getReputationScore(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const reputation = await this.emailMarketing.getReputationScore(tenantId);

    reply.send({
      success: true,
      data: reputation
    });
  }

  /**
   * Get sender domains
   */
  async getSenderDomains(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const domains = await this.emailMarketing.getSenderDomains(tenantId);

    reply.send({
      success: true,
      data: domains
    });
  }

  /**
   * Verify sender domain
   */
  async verifySenderDomain(
    request: FastifyRequest<{
      Params: { domain: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { domain } = request.params;

    const verification = await this.emailMarketing.verifySenderDomain(tenantId, domain);

    reply.send({
      success: true,
      data: verification
    });
  }

  /**
   * Get suppression list
   */
  async getSuppressionList(
    request: FastifyRequest<{
      Querystring: {
        page?: number;
        limit?: number;
        reason?: 'bounce' | 'complaint' | 'unsubscribe' | 'manual';
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { page = 1, limit = 50, reason } = request.query;

    const result = await this.emailMarketing.getSuppressionList(tenantId, {
      page,
      limit,
      reason
    });

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Add to suppression list
   */
  async addToSuppressionList(
    request: FastifyRequest<{
      Body: {
        email: string;
        reason: 'bounce' | 'complaint' | 'unsubscribe' | 'manual';
        note?: string;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { email, reason, note } = request.body;

    await this.emailMarketing.addToSuppressionList(tenantId, email, reason, note);

    reply.send({
      success: true,
      message: 'Email added to suppression list'
    });
  }

  /**
   * Remove from suppression list
   */
  async removeFromSuppressionList(
    request: FastifyRequest<{
      Params: { email: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { email } = request.params;

    await this.emailMarketing.removeFromSuppressionList(tenantId, email);

    reply.send({
      success: true,
      message: 'Email removed from suppression list'
    });
  }

  /**
   * Get usage limits
   */
  async getUsageLimits(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const limits = await this.emailMarketing.getUsageLimits(tenantId);

    reply.send({
      success: true,
      data: limits
    });
  }

  /**
   * Get current usage
   */
  async getCurrentUsage(
    request: FastifyRequest<{
      Querystring: {
        period?: 'day' | 'month' | 'year';
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { period = 'month' } = request.query;

    const usage = await this.emailMarketing.getCurrentUsage(tenantId, period);

    reply.send({
      success: true,
      data: usage
    });
  }
}
