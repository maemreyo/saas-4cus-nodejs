// New file - Template controller

import { Container } from 'typedi';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TemplateService } from './template.service';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  TemplateQueryDto,
  PreviewTemplateDto,
  createTemplateSchema,
  updateTemplateSchema,
  templateQuerySchema,
  previewTemplateSchema
} from './email-marketing.dto';
import { validateDto } from '@shared/utils/validation';
import { logger } from '@shared/logger';

export class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = Container.get(TemplateService);
  }

  /**
   * Create template
   */
  async create(
    request: FastifyRequest<{ Body: CreateTemplateDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(createTemplateSchema, request.body);
      const template = await this.templateService.create(data);

      reply.code(201).send({
        success: true,
        data: template
      });
    } catch (error) {
      logger.error('Failed to create template', error as Error);
      throw error;
    }
  }

  /**
   * Update template
   */
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateTemplateDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(updateTemplateSchema, request.body);
      const template = await this.templateService.update(request.params.id, data);

      reply.send({
        success: true,
        data: template
      });
    } catch (error) {
      logger.error('Failed to update template', error as Error);
      throw error;
    }
  }

  /**
   * Get template by ID
   */
  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const template = await this.templateService.findById(request.params.id);

      reply.send({
        success: true,
        data: template
      });
    } catch (error) {
      logger.error('Failed to get template', error as Error);
      throw error;
    }
  }

  /**
   * List templates
   */
  async find(
    request: FastifyRequest<{ Querystring: TemplateQueryDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = await validateDto(templateQuerySchema, request.query);
      const result = await this.templateService.find(query);

      reply.send({
        success: true,
        data: result.templates,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Failed to list templates', error as Error);
      throw error;
    }
  }

  /**
   * Delete template
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.templateService.delete(request.params.id);

      reply.send({
        success: true,
        message: 'Template archived successfully'
      });
    } catch (error) {
      logger.error('Failed to delete template', error as Error);
      throw error;
    }
  }

  /**
   * Preview template
   */
  async preview(
    request: FastifyRequest<{
      Params: { id: string };
      Body: PreviewTemplateDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(previewTemplateSchema, request.body);
      const preview = await this.templateService.preview(request.params.id, data);

      reply.send({
        success: true,
        data: preview
      });
    } catch (error) {
      logger.error('Failed to preview template', error as Error);
      throw error;
    }
  }

  /**
   * Duplicate template
   */
  async duplicate(
    request: FastifyRequest<{
      Params: { id: string };
      Body?: { name?: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const template = await this.templateService.duplicate(
        request.params.id,
        request.body?.name
      );

      reply.code(201).send({
        success: true,
        data: template
      });
    } catch (error) {
      logger.error('Failed to duplicate template', error as Error);
      throw error;
    }
  }

  /**
   * Get template categories
   */
  async getCategories(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const categories = await this.templateService.getCategories();

      reply.send({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Failed to get template categories', error as Error);
      throw error;
    }
  }
}