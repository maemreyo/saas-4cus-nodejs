// Main controller for email marketing overview and dashboard

import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET, POST } from '@/shared/decorators';
import { EmailMarketingService } from '../services/email-marketing.service';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import { getTenantId } from '@/modules/tenant/tenant.context';
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

@Controller('/api/email-marketing')
export class EmailMarketingController {
  constructor(
    private readonly emailMarketing: EmailMarketingService
  ) {}

  /**
   * Get email marketing dashboard
   */
  @GET('/dashboard', {
    preHandler: [authenticate, requireTenant]
  })
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
  @GET('/stats', {
    preHandler: [authenticate, requireTenant]
  })
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
  @GET('/health', {
    preHandler: [authenticate, requireTenant]
  })
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
  @POST('/export', {
    preHandler: [authenticate, requireTenant]
  })
  async exportData(
    request: FastifyRequest<{
      Body: z.infer<typeof exportDataSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const options = exportDataSchema.parse(request.body);

    const data = await this.emailMarketing.exportData(tenantId, options);

    reply
      .header('Content-Type', options.format === 'csv' ? 'text/csv' : 'application/json')
      .header('Content-Disposition', `attachment; filename="email-marketing-export.${options.format || 'json'}"`)
      .send(data);
  }

  /**
   * Send test email
   */
  @POST('/test-email', {
    preHandler: [authenticate, requireTenant]
  })
  async sendTestEmail(
    request: FastifyRequest<{
      Body: z.infer<typeof testEmailSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId, recipientEmail } = testEmailSchema.parse(request.body);

    await this.emailMarketing.sendTestEmail(tenantId, campaignId, recipientEmail);

    reply.send({
      success: true,
      message: 'Test email sent successfully'
    });
  }

  /**
   * Preview email
   */
  @POST('/preview', {
    preHandler: [authenticate, requireTenant]
  })
  async previewEmail(
    request: FastifyRequest<{
      Body: z.infer<typeof previewEmailSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { campaignId, subscriberId } = previewEmailSchema.parse(request.body);

    const preview = await this.emailMarketing.previewEmail(
      tenantId,
      campaignId,
      subscriberId
    );

    reply.send({
      success: true,
      data: preview
    });
  }

  /**
   * Validate email content
   */
  @POST('/validate-content', {
    preHandler: [authenticate]
  })
  async validateContent(
    request: FastifyRequest<{
      Body: z.infer<typeof validateContentSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { html, text } = validateContentSchema.parse(request.body);

    const validation = await this.emailMarketing.validateEmailContent(html, text);

    reply.send({
      success: true,
      data: validation
    });
  }
}