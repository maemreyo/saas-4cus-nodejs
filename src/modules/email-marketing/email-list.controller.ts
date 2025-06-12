import { Container } from 'typedi';
import { FastifyRequest, FastifyReply } from 'fastify';
import { EmailListService } from './email-list.service';
import { SegmentationService } from './segmentation.service';
import {
  CreateEmailListDto,
  UpdateEmailListDto,
  EmailListQueryDto,
  AddSubscriberDto,
  ImportSubscribersDto,
  UpdateSubscriberDto,
  SubscriberQueryDto,
  SubscriberTagsDto,
  BulkOperationDto,
  CreateSegmentDto,
  UpdateSegmentDto,
  SegmentQueryDto,
  TestSegmentDto,
  createEmailListSchema,
  updateEmailListSchema,
  emailListQuerySchema,
  addSubscriberSchema,
  importSubscribersSchema,
  updateSubscriberSchema,
  subscriberQuerySchema,
  subscriberTagsSchema,
  bulkOperationSchema,
  createSegmentSchema,
  updateSegmentSchema,
  segmentQuerySchema,
  testSegmentSchema
} from './email-marketing.dto';
import { EmailListStatus } from '@prisma/client';
import { validateDto } from '@shared/utils/validation';
import { logger } from '@shared/logger';

export class EmailListController {
  private emailListService: EmailListService;
  private segmentationService: SegmentationService;

  constructor() {
    this.emailListService = Container.get(EmailListService);
    this.segmentationService = Container.get(SegmentationService);
  }

  /**
   * Create email list
   */
  async create(
    request: FastifyRequest<{ Body: CreateEmailListDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(createEmailListSchema, request.body);
      const list = await this.emailListService.create(data);

      reply.code(201).send({
        success: true,
        data: list
      });
    } catch (error) {
      logger.error('Failed to create email list', error as Error);
      throw error;
    }
  }

  /**
   * Update email list
   */
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateEmailListDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(updateEmailListSchema, request.body);
      const list = await this.emailListService.update(request.params.id, data);

      reply.send({
        success: true,
        data: list
      });
    } catch (error) {
      logger.error('Failed to update email list', error as Error);
      throw error;
    }
  }

  /**
   * Get email list by ID
   */
  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const list = await this.emailListService.findById(request.params.id);

      reply.send({
        success: true,
        data: list
      });
    } catch (error) {
      logger.error('Failed to get email list', error as Error);
      throw error;
    }
  }

  /**
   * List email lists
   */
  async find(
    request: FastifyRequest<{ Querystring: EmailListQueryDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = await validateDto(emailListQuerySchema, request.query);
      const result = await this.emailListService.find(query);

      reply.send({
        success: true,
        data: result.lists,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Failed to list email lists', error as Error);
      throw error;
    }
  }

  /**
   * Update list status
   */
  async updateStatus(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { status: EmailListStatus };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const list = await this.emailListService.updateStatus(
        request.params.id,
        request.body.status
      );

      reply.send({
        success: true,
        data: list
      });
    } catch (error) {
      logger.error('Failed to update list status', error as Error);
      throw error;
    }
  }

  /**
   * Delete email list
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.emailListService.delete(request.params.id);

      reply.send({
        success: true,
        message: 'Email list deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete email list', error as Error);
      throw error;
    }
  }

  /**
   * Get list statistics
   */
  async getStats(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const stats = await this.emailListService.getStats(request.params.id);

      reply.send({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Failed to get list stats', error as Error);
      throw error;
    }
  }

  // ==================== Subscriber Management ====================

  /**
   * Add subscriber to list
   */
  async addSubscriber(
    request: FastifyRequest<{
      Params: { id: string };
      Body: AddSubscriberDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(addSubscriberSchema, request.body);
      const subscriber = await this.emailListService.addSubscriber(
        request.params.id,
        data
      );

      reply.code(201).send({
        success: true,
        data: subscriber
      });
    } catch (error) {
      logger.error('Failed to add subscriber', error as Error);
      throw error;
    }
  }

  /**
   * Import subscribers
   */
  async importSubscribers(
    request: FastifyRequest<{
      Params: { id: string };
      Body: ImportSubscribersDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(importSubscribersSchema, request.body);
      const result = await this.emailListService.importSubscribers(
        request.params.id,
        data
      );

      reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Failed to import subscribers', error as Error);
      throw error;
    }
  }

  /**
   * Update subscriber
   */
  async updateSubscriber(
    request: FastifyRequest<{
      Params: { id: string; subscriberId: string };
      Body: UpdateSubscriberDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(updateSubscriberSchema, request.body);
      const subscriber = await this.emailListService.updateSubscriber(
        request.params.subscriberId,
        data
      );

      reply.send({
        success: true,
        data: subscriber
      });
    } catch (error) {
      logger.error('Failed to update subscriber', error as Error);
      throw error;
    }
  }

  /**
   * Remove subscriber from list
   */
  async removeSubscriber(
    request: FastifyRequest<{
      Params: { id: string; subscriberId: string };
      Body?: { reason?: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.emailListService.removeSubscriber(
        request.params.subscriberId,
        request.body?.reason
      );

      reply.send({
        success: true,
        message: 'Subscriber removed successfully'
      });
    } catch (error) {
      logger.error('Failed to remove subscriber', error as Error);
      throw error;
    }
  }

  /**
   * Get subscribers
   */
  async getSubscribers(
    request: FastifyRequest<{
      Params: { id: string };
      Querystring: SubscriberQueryDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = await validateDto(subscriberQuerySchema, request.query);
      const result = await this.emailListService.getSubscribers(
        request.params.id,
        query
      );

      reply.send({
        success: true,
        data: result.subscribers,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Failed to get subscribers', error as Error);
      throw error;
    }
  }

  /**
   * Update subscriber tags
   */
  async updateSubscriberTags(
    request: FastifyRequest<{
      Params: { id: string; subscriberId: string };
      Body: SubscriberTagsDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(subscriberTagsSchema, request.body);
      const subscriber = await this.emailListService.updateSubscriberTags(
        request.params.subscriberId,
        data
      );

      reply.send({
        success: true,
        data: subscriber
      });
    } catch (error) {
      logger.error('Failed to update subscriber tags', error as Error);
      throw error;
    }
  }

  /**
   * Bulk operation on subscribers
   */
  async bulkOperation(
    request: FastifyRequest<{
      Params: { id: string };
      Body: BulkOperationDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(bulkOperationSchema, request.body);
      const result = await this.emailListService.bulkOperation(
        request.params.id,
        data
      );

      reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Failed to perform bulk operation', error as Error);
      throw error;
    }
  }

  /**
   * Confirm subscription
   */
  async confirmSubscription(
    request: FastifyRequest<{
      Querystring: { token: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const subscriber = await this.emailListService.confirmSubscription(
        request.query.token
      );

      reply.send({
        success: true,
        data: subscriber
      });
    } catch (error) {
      logger.error('Failed to confirm subscription', error as Error);
      throw error;
    }
  }

  // ==================== Segment Management ====================

  /**
   * Create segment
   */
  async createSegment(
    request: FastifyRequest<{
      Params: { id: string };
      Body: CreateSegmentDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(createSegmentSchema, request.body);
      const segment = await this.segmentationService.create(request.params.id, data);

      reply.code(201).send({
        success: true,
        data: segment
      });
    } catch (error) {
      logger.error('Failed to create segment', error as Error);
      throw error;
    }
  }

  /**
   * Update segment
   */
  async updateSegment(
    request: FastifyRequest<{
      Params: { id: string; segmentId: string };
      Body: UpdateSegmentDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(updateSegmentSchema, request.body);
      const segment = await this.segmentationService.update(
        request.params.segmentId,
        data
      );

      reply.send({
        success: true,
        data: segment
      });
    } catch (error) {
      logger.error('Failed to update segment', error as Error);
      throw error;
    }
  }

  /**
   * Get segments
   */
  async getSegments(
    request: FastifyRequest<{
      Params: { id: string };
      Querystring: SegmentQueryDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = await validateDto(segmentQuerySchema, request.query);
      const result = await this.segmentationService.find(request.params.id, query);

      reply.send({
        success: true,
        data: result.segments,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Failed to get segments', error as Error);
      throw error;
    }
  }

  /**
   * Delete segment
   */
  async deleteSegment(
    request: FastifyRequest<{
      Params: { id: string; segmentId: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.segmentationService.delete(request.params.segmentId);

      reply.send({
        success: true,
        message: 'Segment deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete segment', error as Error);
      throw error;
    }
  }

  /**
   * Test segment
   */
  async testSegment(
    request: FastifyRequest<{
      Params: { id: string; segmentId: string };
      Body: TestSegmentDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(testSegmentSchema, request.body);
      const result = await this.segmentationService.test(
        request.params.segmentId,
        data
      );

      reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Failed to test segment', error as Error);
      throw error;
    }
  }

  /**
   * Get segment subscribers
   */
  async getSegmentSubscribers(
    request: FastifyRequest<{
      Params: { id: string; segmentId: string };
      Querystring: { limit?: number; offset?: number };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const result = await this.segmentationService.getSubscribers(
        request.params.segmentId,
        request.query.limit,
        request.query.offset
      );

      reply.send({
        success: true,
        data: result.subscribers,
        total: result.total
      });
    } catch (error) {
      logger.error('Failed to get segment subscribers', error as Error);
      throw error;
    }
  }
}
