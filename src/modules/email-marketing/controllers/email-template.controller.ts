// Controller for email template management

import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET, POST, PUT, DELETE } from '@/shared/decorators';
import { EmailTemplateService } from '../services/email-template.service';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import { getTenantId } from '@/modules/tenant/tenant.context';
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateFiltersSchema
} from '../dto/email-template.dto';
import { z } from 'zod';

const renderTemplateSchema = z.object({
  templateId: z.string(),
  data: z.record(z.any())
});

const cloneTemplateSchema = z.object({
  name: z.string().optional()
});

@Controller('/api/email-marketing/templates')
export class EmailTemplateController {
  constructor(
    private readonly templateService: EmailTemplateService
  ) {}

  /**
   * Create template
   */
  @POST('/', {
    preHandler: [authenticate, requireTenant]
  })
  async createTemplate(
    request: FastifyRequest<{
      Body: z.infer<typeof createTemplateSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const data = createTemplateSchema.parse(request.body);

    const template = await this.templateService.createTemplate(tenantId, data);

    reply.code(201).send({
      success: true,
      data: template
    });
  }

  /**
   * Get templates
   */
  @GET('/', {
    preHandler: [authenticate, requireTenant]
  })
  async getTemplates(
    request: FastifyRequest<{
      Querystring: z.infer<typeof templateFiltersSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const filters = templateFiltersSchema.parse(request.query);

    const result = await this.templateService.listTemplates(tenantId, filters);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Get single template
   */
  @GET('/:templateId', {
    preHandler: [authenticate, requireTenant]
  })
  async getTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;

    const template = await this.templateService.getTemplate(tenantId, templateId);

    reply.send({
      success: true,
      data: template
    });
  }

  /**
   * Update template
   */
  @PUT('/:templateId', {
    preHandler: [authenticate, requireTenant]
  })
  async updateTemplate(
    request: FastifyRequest<{
      Params: { templateId: string },
      Body: z.infer<typeof updateTemplateSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;
    const data = updateTemplateSchema.parse(request.body);

    const template = await this.templateService.updateTemplate(
      tenantId,
      templateId,
      data
    );

    reply.send({
      success: true,
      data: template
    });
  }

  /**
   * Delete template
   */
  @DELETE('/:templateId', {
    preHandler: [authenticate, requireTenant]
  })
  async deleteTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;

    await this.templateService.deleteTemplate(tenantId, templateId);

    reply.send({
      success: true,
      message: 'Template deleted successfully'
    });
  }

  /**
   * Clone template
   */
  @POST('/:templateId/clone', {
    preHandler: [authenticate, requireTenant]
  })
  async cloneTemplate(
    request: FastifyRequest<{
      Params: { templateId: string },
      Body: z.infer<typeof cloneTemplateSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;
    const { name } = cloneTemplateSchema.parse(request.body);

    const template = await this.templateService.cloneTemplate(
      tenantId,
      templateId,
      name
    );

    reply.send({
      success: true,
      data: template
    });
  }

  /**
   * Archive template
   */
  @PUT('/:templateId/archive', {
    preHandler: [authenticate, requireTenant]
  })
  async archiveTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;

    await this.templateService.archiveTemplate(tenantId, templateId);

    reply.send({
      success: true,
      message: 'Template archived successfully'
    });
  }

  /**
   * Render template
   */
  @POST('/render', {
    preHandler: [authenticate, requireTenant]
  })
  async renderTemplate(
    request: FastifyRequest<{
      Body: z.infer<typeof renderTemplateSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId, data } = renderTemplateSchema.parse(request.body);

    const rendered = await this.templateService.renderTemplate(
      templateId,
      data,
      tenantId
    );

    reply.send({
      success: true,
      data: rendered
    });
  }

  /**
   * Get template categories
   */
  @GET('/categories', {
    preHandler: [authenticate, requireTenant]
  })
  async getCategories(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);

    const categories = await this.templateService.getCategories(tenantId);

    reply.send({
      success: true,
      data: categories
    });
  }
}