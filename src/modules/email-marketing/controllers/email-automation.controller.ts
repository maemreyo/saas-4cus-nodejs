import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable } from '@/shared/decorators';
import { EmailAutomationService } from '../services/email-automation.service';
import { getTenantId } from '@/modules/tenant/tenant.utils';
import {
  createAutomationSchema,
  updateAutomationSchema,
  createAutomationStepSchema,
  automationFiltersSchema,
} from '../dto/email-automation.dto';
import { z } from 'zod';

const enrollSubscriberSchema = z.object({
  subscriberId: z.string(),
  metadata: z.record(z.any()).optional(),
});

@Injectable()
export class EmailAutomationController {
  constructor(private readonly automationService: EmailAutomationService) {}

  /**
   * Create automation
   */
  async createAutomation(
    request: FastifyRequest<{
      Body: z.infer<typeof createAutomationSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const data = createAutomationSchema.parse(request.body);

    const automation = await this.automationService.createAutomation(tenantId, data);

    reply.code(201).send({
      success: true,
      data: automation,
    });
  }

  /**
   * Get automations
   */
  async getAutomations(
    request: FastifyRequest<{
      Querystring: z.infer<typeof automationFiltersSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const filters = automationFiltersSchema.parse(request.query);

    const result = await this.automationService.getAutomations(tenantId, filters);

    reply.send({
      success: true,
      data: result,
    });
  }

  /**
   * Get single automation
   */
  async getAutomation(
    request: FastifyRequest<{
      Params: { automationId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;

    const automation = await this.automationService.getAutomation(tenantId, automationId);

    reply.send({
      success: true,
      data: automation,
    });
  }

  /**
   * Update automation
   */
  async updateAutomation(
    request: FastifyRequest<{
      Params: { automationId: string };
      Body: z.infer<typeof updateAutomationSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;
    const data = updateAutomationSchema.parse(request.body);

    const automation = await this.automationService.updateAutomation(tenantId, automationId, data);

    reply.send({
      success: true,
      data: automation,
    });
  }

  /**
   * Delete automation
   */
  async deleteAutomation(
    request: FastifyRequest<{
      Params: { automationId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;

    await this.automationService.deleteAutomation(tenantId, automationId);

    reply.code(204).send();
  }

  /**
   * Activate automation
   */
  async activateAutomation(
    request: FastifyRequest<{
      Params: { automationId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;

    const automation = await this.automationService.activateAutomation(tenantId, automationId);

    reply.send({
      success: true,
      data: automation,
    });
  }

  /**
   * Deactivate automation
   */
  async deactivateAutomation(
    request: FastifyRequest<{
      Params: { automationId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;

    const automation = await this.automationService.deactivateAutomation(tenantId, automationId);

    reply.send({
      success: true,
      data: automation,
    });
  }

  /**
   * Add automation step
   */
  async addAutomationStep(
    request: FastifyRequest<{
      Params: { automationId: string };
      Body: z.infer<typeof createAutomationStepSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;
    const data = createAutomationStepSchema.parse(request.body);

    const step = await this.automationService.addAutomationStep(tenantId, automationId, data);

    reply.code(201).send({
      success: true,
      data: step,
    });
  }

  /**
   * Update automation step
   */
  async updateAutomationStep(
    request: FastifyRequest<{
      Params: { automationId: string; stepId: string };
      Body: z.infer<typeof createAutomationStepSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId, stepId } = request.params;
    const data = createAutomationStepSchema.parse(request.body);

    const step = await this.automationService.updateAutomationStep(tenantId, automationId, stepId, data);

    reply.send({
      success: true,
      data: step,
    });
  }

  /**
   * Delete automation step
   */
  async deleteAutomationStep(
    request: FastifyRequest<{
      Params: { automationId: string; stepId: string };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId, stepId } = request.params;

    await this.automationService.deleteAutomationStep(tenantId, automationId, stepId);

    reply.code(204).send();
  }

  /**
   * Enroll subscriber in automation
   */
  async enrollSubscriber(
    request: FastifyRequest<{
      Params: { automationId: string };
      Body: z.infer<typeof enrollSubscriberSchema>;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;
    const data = enrollSubscriberSchema.parse(request.body);

    await this.automationService.enrollSubscriberWithTenant(tenantId, automationId, data.subscriberId, data.metadata);

    reply.send({
      success: true,
      message: 'Subscriber enrolled successfully',
    });
  }

  /**
   * Get automation analytics
   */
  async getAutomationAnalytics(
    request: FastifyRequest<{
      Params: { automationId: string };
      Querystring: {
        startDate?: string;
        endDate?: string;
      };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;
    const { startDate, endDate } = request.query;

    const analytics = await this.automationService.getAutomationAnalytics(
      tenantId,
      automationId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    reply.send({
      success: true,
      data: analytics,
    });
  }
}
