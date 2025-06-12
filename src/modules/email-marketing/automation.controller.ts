import { Container } from 'typedi';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AutomationService } from './automation.service';
import {
  CreateAutomationDto,
  UpdateAutomationDto,
  CreateAutomationStepDto,
  UpdateAutomationStepDto,
  AutomationQueryDto,
  EnrollmentQueryDto,
  TriggerAutomationDto,
  createAutomationSchema,
  updateAutomationSchema,
  createAutomationStepSchema,
  updateAutomationStepSchema,
  automationQuerySchema,
  enrollmentQuerySchema,
  triggerAutomationSchema
} from './email-marketing.dto';
import { validateDto } from '@shared/utils/validation';
import { logger } from '@shared/logger';

export class AutomationController {
  private automationService: AutomationService;

  constructor() {
    this.automationService = Container.get(AutomationService);
  }

  /**
   * Create automation
   */
  async create(
    request: FastifyRequest<{ Body: CreateAutomationDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(createAutomationSchema, request.body);
      const automation = await this.automationService.create(data);

      reply.code(201).send({
        success: true,
        data: automation
      });
    } catch (error) {
      logger.error('Failed to create automation', error as Error);
      throw error;
    }
  }

  /**
   * Update automation
   */
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateAutomationDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(updateAutomationSchema, request.body);
      const automation = await this.automationService.update(
        request.params.id,
        data
      );

      reply.send({
        success: true,
        data: automation
      });
    } catch (error) {
      logger.error('Failed to update automation', error as Error);
      throw error;
    }
  }

  /**
   * Get automation by ID
   */
  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const automation = await this.automationService.findById(request.params.id);

      reply.send({
        success: true,
        data: automation
      });
    } catch (error) {
      logger.error('Failed to get automation', error as Error);
      throw error;
    }
  }

  /**
   * List automations
   */
  async find(
    request: FastifyRequest<{ Querystring: AutomationQueryDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = await validateDto(automationQuerySchema, request.query);
      const result = await this.automationService.find(query);

      reply.send({
        success: true,
        data: result.automations,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Failed to list automations', error as Error);
      throw error;
    }
  }

  /**
   * Activate automation
   */
  async activate(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const automation = await this.automationService.activate(request.params.id);

      reply.send({
        success: true,
        data: automation
      });
    } catch (error) {
      logger.error('Failed to activate automation', error as Error);
      throw error;
    }
  }

  /**
   * Deactivate automation
   */
  async deactivate(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const automation = await this.automationService.deactivate(request.params.id);

      reply.send({
        success: true,
        data: automation
      });
    } catch (error) {
      logger.error('Failed to deactivate automation', error as Error);
      throw error;
    }
  }

  /**
   * Delete automation
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.automationService.delete(request.params.id);

      reply.send({
        success: true,
        message: 'Automation deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete automation', error as Error);
      throw error;
    }
  }

  // ==================== Automation Steps ====================

  /**
   * Add step to automation
   */
  async addStep(
    request: FastifyRequest<{
      Params: { id: string };
      Body: CreateAutomationStepDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(createAutomationStepSchema, request.body);
      const step = await this.automationService.addStep(request.params.id, data);

      reply.code(201).send({
        success: true,
        data: step
      });
    } catch (error) {
      logger.error('Failed to add automation step', error as Error);
      throw error;
    }
  }

  /**
   * Update automation step
   */
  async updateStep(
    request: FastifyRequest<{
      Params: { id: string; stepId: string };
      Body: UpdateAutomationStepDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(updateAutomationStepSchema, request.body);
      const step = await this.automationService.updateStep(
        request.params.stepId,
        data
      );

      reply.send({
        success: true,
        data: step
      });
    } catch (error) {
      logger.error('Failed to update automation step', error as Error);
      throw error;
    }
  }

  /**
   * Delete automation step
   */
  async deleteStep(
    request: FastifyRequest<{
      Params: { id: string; stepId: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.automationService.deleteStep(request.params.stepId);

      reply.send({
        success: true,
        message: 'Automation step deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete automation step', error as Error);
      throw error;
    }
  }

  // ==================== Enrollments ====================

  /**
   * Enroll subscriber in automation
   */
  async enrollSubscriber(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { subscriberId: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const enrollment = await this.automationService.enrollSubscriber(
        request.params.id,
        request.body.subscriberId
      );

      reply.code(201).send({
        success: true,
        data: enrollment
      });
    } catch (error) {
      logger.error('Failed to enroll subscriber', error as Error);
      throw error;
    }
  }

  /**
   * Cancel enrollment
   */
  async cancelEnrollment(
    request: FastifyRequest<{
      Params: { id: string; enrollmentId: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const enrollment = await this.automationService.cancelEnrollment(
        request.params.enrollmentId
      );

      reply.send({
        success: true,
        data: enrollment
      });
    } catch (error) {
      logger.error('Failed to cancel enrollment', error as Error);
      throw error;
    }
  }

  /**
   * Get enrollments
   */
  async getEnrollments(
    request: FastifyRequest<{
      Params: { id: string };
      Querystring: EnrollmentQueryDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = await validateDto(enrollmentQuerySchema, request.query);
      const result = await this.automationService.getEnrollments(
        request.params.id,
        query
      );

      reply.send({
        success: true,
        data: result.enrollments,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Failed to get enrollments', error as Error);
      throw error;
    }
  }

  /**
   * Trigger automation manually
   */
  async trigger(
    request: FastifyRequest<{ Body: TriggerAutomationDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(triggerAutomationSchema, request.body);
      const result = await this.automationService.trigger(data);

      reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Failed to trigger automation', error as Error);
      throw error;
    }
  }
}
