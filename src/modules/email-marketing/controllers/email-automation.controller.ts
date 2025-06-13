// Controller for email automation workflows

import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET, POST, PUT, DELETE, PATCH } from '@/shared/decorators';
import { EmailAutomationService } from '../services/email-automation.service';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import { getTenantId } from '@/modules/tenant/tenant.context';
import {
  createAutomationSchema,
  updateAutomationSchema,
  createAutomationStepSchema,
  automationFiltersSchema
} from '../dto/email-automation.dto';
import { z } from 'zod';

const enrollSubscriberSchema = z.object({
  subscriberId: z.string(),
  metadata: z.record(z.any()).optional()
});

@Controller('/api/email-marketing/automations')
export class EmailAutomationController {
  constructor(
    private readonly automationService: EmailAutomationService
  ) {}

  /**
   * Create automation
   */
  @POST('/', {
    preHandler: [authenticate, requireTenant]
  })
  async createAutomation(
    request: FastifyRequest<{
      Body: z.infer<typeof createAutomationSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const data = createAutomationSchema.parse(request.body);

    const automation = await this.automationService.createAutomation(tenantId, data);

    reply.code(201).send({
      success: true,
      data: automation
    });
  }

  /**
   * Get automations
   */
  @GET('/', {
    preHandler: [authenticate, requireTenant]
  })
  async getAutomations(
    request: FastifyRequest<{
      Querystring: z.infer<typeof automationFiltersSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const filters = automationFiltersSchema.parse(request.query);

    const result = await this.automationService.listAutomations(tenantId, filters);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Get single automation
   */
  @GET('/:automationId', {
    preHandler: [authenticate, requireTenant]
  })
  async getAutomation(
    request: FastifyRequest<{
      Params: { automationId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;

    const automation = await this.automationService.getAutomation(tenantId, automationId);

    reply.send({
      success: true,
      data: automation
    });
  }

  /**
   * Update automation
   */
  @PUT('/:automationId', {
    preHandler: [authenticate, requireTenant]
  })
  async updateAutomation(
    request: FastifyRequest<{
      Params: { automationId: string },
      Body: z.infer<typeof updateAutomationSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;
    const data = updateAutomationSchema.parse(request.body);

    const automation = await this.automationService.updateAutomation(
      tenantId,
      automationId,
      data
    );

    reply.send({
      success: true,
      data: automation
    });
  }

  /**
   * Activate automation
   */
  @PATCH('/:automationId/activate', {
    preHandler: [authenticate, requireTenant]
  })
  async activateAutomation(
    request: FastifyRequest<{
      Params: { automationId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;

    await this.automationService.activateAutomation(tenantId, automationId);

    reply.send({
      success: true,
      message: 'Automation activated successfully'
    });
  }

  /**
   * Deactivate automation
   */
  @PATCH('/:automationId/deactivate', {
    preHandler: [authenticate, requireTenant]
  })
  async deactivateAutomation(
    request: FastifyRequest<{
      Params: { automationId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;

    await this.automationService.deactivateAutomation(tenantId, automationId);

    reply.send({
      success: true,
      message: 'Automation deactivated successfully'
    });
  }

  /**
   * Add automation step
   */
  @POST('/:automationId/steps', {
    preHandler: [authenticate, requireTenant]
  })
  async addStep(
    request: FastifyRequest<{
      Params: { automationId: string },
      Body: z.infer<typeof createAutomationStepSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId } = request.params;
    const data = createAutomationStepSchema.parse(request.body);

    const step = await this.automationService.addStep(
      tenantId,
      automationId,
      data
    );

    reply.send({
      success: true,
      data: step
    });
  }

  /**
   * Update automation step
   */
  @PUT('/:automationId/steps/:stepId', {
    preHandler: [authenticate, requireTenant]
  })
  async updateStep(
    request: FastifyRequest<{
      Params: { automationId: string, stepId: string },
      Body: Partial<z.infer<typeof createAutomationStepSchema>>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId, stepId } = request.params;
    const data = request.body;

    const step = await this.automationService.updateStep(
      tenantId,
      automationId,
      stepId,
      data
    );

    reply.send({
      success: true,
      data: step
    });
  }

  /**
   * Delete automation step
   */
  @DELETE('/:automationId/steps/:stepId', {
    preHandler: [authenticate, requireTenant]
  })
  async deleteStep(
    request: FastifyRequest<{
      Params: { automationId: string, stepId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { automationId, stepId } = request.params;

    await this.automationService.deleteStep(tenantId, automationId, stepId);

    reply.send({
      success: true,
      message: 'Step deleted successfully'
    });
  }

  /**
   * Enroll subscriber manually
   */
  @POST('/:automationId/enroll', {
    preHandler: [authenticate, requireTenant]
  })
  async enrollSubscriber(
    request: FastifyRequest<{
      Params: { automationId: string },
      Body: z.infer<typeof enrollSubscriberSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { automationId } = request.params;
    const { subscriberId, metadata } = enrollSubscriberSchema.parse(request.body);

    const enrollment = await this.automationService.enrollSubscriber(
      automationId,
      subscriberId,
      metadata
    );

    reply.send({
      success: true,
      data: enrollment
    });
  }

  /**
   * Cancel enrollment
   */
  @DELETE('/enrollments/:enrollmentId', {
    preHandler: [authenticate, requireTenant]
  })
  async cancelEnrollment(
    request: FastifyRequest<{
      Params: { enrollmentId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { enrollmentId } = request.params;

    await this.automationService.cancelEnrollment(enrollmentId);

    reply.send({
      success: true,
      message: 'Enrollment cancelled successfully'
    });
  }
}