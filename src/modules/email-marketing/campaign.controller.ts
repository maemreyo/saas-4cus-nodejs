import { Container } from 'typedi';
import { FastifyRequest, FastifyReply } from 'fastify';
import { CampaignService } from './campaign.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  SendCampaignDto,
  CampaignQueryDto,
  createCampaignSchema,
  updateCampaignSchema,
  sendCampaignSchema,
  campaignQuerySchema
} from './email-marketing.dto';
import { validateDto } from '@shared/utils/validation';
import { logger } from '@shared/logger';

export class CampaignController {
  private campaignService: CampaignService;

  constructor() {
    this.campaignService = Container.get(CampaignService);
  }

  /**
   * Create campaign
   */
  async create(
    request: FastifyRequest<{ Body: CreateCampaignDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(createCampaignSchema, request.body);
      const campaign = await this.campaignService.create(data);

      reply.code(201).send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to create campaign', error as Error);
      throw error;
    }
  }

  /**
   * Update campaign
   */
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateCampaignDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(updateCampaignSchema, request.body);
      const campaign = await this.campaignService.update(request.params.id, data);

      reply.send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to update campaign', error as Error);
      throw error;
    }
  }

  /**
   * Get campaign by ID
   */
  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const campaign = await this.campaignService.findById(request.params.id);

      reply.send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to get campaign', error as Error);
      throw error;
    }
  }

  /**
   * List campaigns
   */
  async find(
    request: FastifyRequest<{ Querystring: CampaignQueryDto }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = await validateDto(campaignQuerySchema, request.query);
      const result = await this.campaignService.find(query);

      reply.send({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Failed to list campaigns', error as Error);
      throw error;
    }
  }

  /**
   * Schedule campaign
   */
  async schedule(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { scheduledAt: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const scheduledAt = new Date(request.body.scheduledAt);
      const campaign = await this.campaignService.schedule(request.params.id, scheduledAt);

      reply.send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to schedule campaign', error as Error);
      throw error;
    }
  }

  /**
   * Send campaign
   */
  async send(
    request: FastifyRequest<{
      Params: { id: string };
      Body: SendCampaignDto;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const data = await validateDto(sendCampaignSchema, request.body);
      const result = await this.campaignService.send(request.params.id, data);

      reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Failed to send campaign', error as Error);
      throw error;
    }
  }

  /**
   * Pause campaign
   */
  async pause(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const campaign = await this.campaignService.pause(request.params.id);

      reply.send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to pause campaign', error as Error);
      throw error;
    }
  }

  /**
   * Resume campaign
   */
  async resume(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const campaign = await this.campaignService.resume(request.params.id);

      reply.send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to resume campaign', error as Error);
      throw error;
    }
  }

  /**
   * Cancel campaign
   */
  async cancel(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const campaign = await this.campaignService.cancel(request.params.id);

      reply.send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to cancel campaign', error as Error);
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.campaignService.delete(request.params.id);

      reply.send({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete campaign', error as Error);
      throw error;
    }
  }

  /**
   * Get campaign statistics
   */
  async getStats(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const stats = await this.campaignService.getStats(request.params.id);

      reply.send({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Failed to get campaign stats', error as Error);
      throw error;
    }
  }

  /**
   * Clone campaign
   */
  async clone(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const campaign = await this.campaignService.clone(request.params.id);

      reply.code(201).send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to clone campaign', error as Error);
      throw error;
    }
  }

  /**
   * Select A/B test winner
   */
  async selectABTestWinner(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { variantId: string };
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const campaign = await this.campaignService.selectABTestWinner(
        request.params.id,
        request.body.variantId
      );

      reply.send({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Failed to select A/B test winner', error as Error);
      throw error;
    }
  }
}
