import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable } from '@/shared/decorators';
import { EmailTemplateService } from '../services/email-template.service';
import { getTenantId } from '@/modules/tenant/tenant.utils';
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

@Injectable()
export class EmailTemplateController {
  constructor(
    private readonly templateService: EmailTemplateService
  ) {}

  /**
   * Create template
   */
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
  async updateTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
      Body: z.infer<typeof updateTemplateSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;
    const data = updateTemplateSchema.parse(request.body);

    const template = await this.templateService.updateTemplate(tenantId, templateId, data);

    reply.send({
      success: true,
      data: template
    });
  }

  /**
   * Delete template
   */
  async deleteTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;

    await this.templateService.deleteTemplate(tenantId, templateId);

    reply.code(204).send();
  }

  /**
   * Clone template
   */
  async cloneTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
      Body: z.infer<typeof cloneTemplateSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;
    const data = cloneTemplateSchema.parse(request.body);

    const template = await this.templateService.cloneTemplate(tenantId, templateId, data.name);

    reply.code(201).send({
      success: true,
      data: template
    });
  }

  /**
   * Render template with data
   */
  async renderTemplate(
    request: FastifyRequest<{
      Body: z.infer<typeof renderTemplateSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId, data } = renderTemplateSchema.parse(request.body);

    const rendered = await this.templateService.renderTemplate(templateId, data, tenantId);

    reply.send({
      success: true,
      data: rendered
    });
  }

  /**
   * Get template preview
   */
  async previewTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
      Querystring: {
        subscriberId?: string;
        sampleData?: string; // JSON string
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;
    const { subscriberId, sampleData } = request.query;

    let data = {};
    if (sampleData) {
      try {
        data = JSON.parse(sampleData);
      } catch (error) {
        reply.code(400).send({
          success: false,
          error: 'Invalid JSON in sampleData parameter'
        });
        return;
      }
    }

    const preview = await this.templateService.previewTemplate(tenantId, templateId, subscriberId, data);

    reply.send({
      success: true,
      data: preview
    });
  }

  /**
   * Get template usage statistics
   */
  async getTemplateStats(
    request: FastifyRequest<{
      Params: { templateId: string }
      Querystring: {
        startDate?: string;
        endDate?: string;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;
    const { startDate, endDate } = request.query;

    const stats = await this.templateService.getTemplateStats(
      tenantId,
      templateId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    reply.send({
      success: true,
      data: stats
    });
  }

  /**
   * Test template rendering
   */
  async testTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
      Body: {
        recipientEmail: string;
        sampleData?: Record<string, any>;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;
    const { recipientEmail, sampleData = {} } = request.body;

    await this.templateService.sendTestTemplate(tenantId, templateId, recipientEmail, sampleData);

    reply.send({
      success: true,
      message: 'Test email sent successfully'
    });
  }

  /**
   * Export template
   */
  async exportTemplate(
    request: FastifyRequest<{
      Params: { templateId: string }
      Querystring: {
        format?: 'json' | 'html';
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;
    const { format = 'json' } = request.query;

    const exported = await this.templateService.exportTemplate(tenantId, templateId, format);

    const filename = `template-${templateId}.${format}`;
    const contentType = format === 'json' ? 'application/json' : 'text/html';

    reply
      .header('Content-Type', contentType)
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(exported);
  }

  /**
   * Import template
   */
  async importTemplate(
    request: FastifyRequest<{
      Body: {
        name: string;
        templateData: string; // JSON string
        format: 'json';
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { name, templateData, format } = request.body;

    if (format !== 'json') {
      reply.code(400).send({
        success: false,
        error: 'Only JSON format is supported for import'
      });
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(templateData);
    } catch (error) {
      reply.code(400).send({
        success: false,
        error: 'Invalid JSON in templateData'
      });
      return;
    }

    const template = await this.templateService.importTemplate(tenantId, name, parsedData);

    reply.code(201).send({
      success: true,
      data: template
    });
  }

  /**
   * Get template variables
   */
  async getTemplateVariables(
    request: FastifyRequest<{
      Params: { templateId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { templateId } = request.params;

    const variables = await this.templateService.getTemplateVariables(tenantId, templateId);

    reply.send({
      success: true,
      data: variables
    });
  }
}
