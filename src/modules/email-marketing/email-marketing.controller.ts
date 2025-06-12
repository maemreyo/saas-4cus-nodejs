// Controller for email marketing endpoints with proper auth and tenant context

import { Service } from 'typedi';
import { FastifyRequest, FastifyReply } from 'fastify';
import { EmailMarketingService } from './email-marketing.service';
import { validateSchema } from '@shared/utils/validation';
import {
  CreateListDTO,
  UpdateListDTO,
  CreateSubscriberDTO,
  ImportSubscribersDTO,
  CreateCampaignDTO,
  UpdateCampaignDTO,
  CreateTemplateDTO,
  UpdateTemplateDTO,
  CreateSegmentDTO,
  UpdateSegmentDTO,
  CreateAutomationDTO,
  UpdateAutomationDTO,
  AddAutomationStepDTO,
  UpdateAutomationStepDTO,
  EmailActivityDTO
} from './email-marketing.dto';
import { ListStatus, CampaignStatus, SubscriberStatus, SegmentType, AutomationType } from '@prisma/client';

// Custom request interface with tenant context
interface TenantRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    tenantId?: string;
  };
  tenantId?: string;
}

@Service()
export class EmailMarketingController {
  constructor(private emailMarketingService: EmailMarketingService) {}

  // ===== LIST MANAGEMENT =====

  /**
   * Create email list
   */
  async createList(request: TenantRequest, reply: FastifyReply) {
    const dto = await validateSchema(CreateListDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;

    const list = await this.emailMarketingService.createList(userId, tenantId, dto);

    return reply.status(201).send({
      message: 'Email list created successfully',
      data: list
    });
  }

  /**
   * Get email lists
   */
  async getLists(
    request: TenantRequest<{
      Querystring: {
        limit?: number;
        offset?: number;
        status?: ListStatus;
        search?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { limit, offset, status, search } = request.query;

    const result = await this.emailMarketingService.getLists(userId, tenantId, {
      limit,
      offset,
      status,
      search
    });

    return reply.send({
      data: result.lists,
      meta: {
        total: result.total,
        limit: limit || 20,
        offset: offset || 0
      }
    });
  }

  /**
   * Get single list
   */
  async getList(
    request: TenantRequest<{
      Params: { listId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { listId } = request.params;

    const list = await this.emailMarketingService.getListDetails(userId, tenantId, listId);

    return reply.send({ data: list });
  }

  /**
   * Update list
   */
  async updateList(
    request: TenantRequest<{
      Params: { listId: string };
      Body: UpdateListDTO;
    }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(UpdateListDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { listId } = request.params;

    const list = await this.emailMarketingService.updateList(userId, tenantId, listId, dto);

    return reply.send({
      message: 'Email list updated successfully',
      data: list
    });
  }

  /**
   * Delete list
   */
  async deleteList(
    request: TenantRequest<{
      Params: { listId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { listId } = request.params;

    await this.emailMarketingService.deleteList(userId, tenantId, listId);

    return reply.status(204).send();
  }

  /**
   * Get list statistics
   */
  async getListStatistics(
    request: TenantRequest<{
      Params: { listId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { listId } = request.params;

    const stats = await this.emailMarketingService.getListStatistics(userId, tenantId, listId);

    return reply.send({ data: stats });
  }

  // ===== SUBSCRIBER MANAGEMENT =====

  /**
   * Add subscriber
   */
  async addSubscriber(
    request: TenantRequest<{
      Params: { listId: string };
      Body: CreateSubscriberDTO;
    }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(CreateSubscriberDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { listId } = request.params;

    const subscriber = await this.emailMarketingService.addSubscriber(
      userId,
      tenantId,
      listId,
      dto
    );

    return reply.status(201).send({
      message: dto.requireConfirmation
        ? 'Subscriber added. Confirmation email sent.'
        : 'Subscriber added successfully',
      data: subscriber
    });
  }

  /**
   * Import subscribers
   */
  async importSubscribers(
    request: TenantRequest<{
      Params: { listId: string };
      Body: ImportSubscribersDTO;
    }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(ImportSubscribersDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { listId } = request.params;

    const result = await this.emailMarketingService.importSubscribers(
      userId,
      tenantId,
      listId,
      dto
    );

    return reply.send({
      message: 'Import completed',
      data: result
    });
  }

  /**
   * Get subscribers
   */
  async getSubscribers(
    request: TenantRequest<{
      Params: { listId: string };
      Querystring: {
        limit?: number;
        offset?: number;
        status?: SubscriberStatus;
        search?: string;
        tags?: string[];
      };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { listId } = request.params;
    const { limit, offset, status, search, tags } = request.query;

    const result = await this.emailMarketingService.getSubscribers(
      userId,
      tenantId,
      listId,
      { limit, offset, status, search, tags }
    );

    return reply.send({
      data: result.subscribers,
      meta: {
        total: result.total,
        limit: limit || 20,
        offset: offset || 0
      }
    });
  }

  /**
   * Update subscriber
   */
  async updateSubscriber(
    request: TenantRequest<{
      Params: { subscriberId: string };
      Body: Partial<CreateSubscriberDTO>;
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { subscriberId } = request.params;

    const subscriber = await this.emailMarketingService.updateSubscriber(
      userId,
      tenantId,
      subscriberId,
      request.body
    );

    return reply.send({
      message: 'Subscriber updated successfully',
      data: subscriber
    });
  }

  /**
   * Delete subscriber
   */
  async deleteSubscriber(
    request: TenantRequest<{
      Params: { subscriberId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { subscriberId } = request.params;

    await this.emailMarketingService.deleteSubscriber(userId, tenantId, subscriberId);

    return reply.status(204).send();
  }

  /**
   * Handle unsubscribe
   */
  async unsubscribe(
    request: FastifyRequest<{
      Params: { token: string };
      Body: {
        reason?: string;
        feedback?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const { token } = request.params;
    const { reason, feedback } = request.body;

    await this.emailMarketingService.handleUnsubscribe(token, reason, feedback);

    return reply.send({
      message: 'You have been unsubscribed successfully'
    });
  }

  // ===== CAMPAIGN MANAGEMENT =====

  /**
   * Create campaign
   */
  async createCampaign(
    request: TenantRequest<{
      Body: CreateCampaignDTO;
    }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(CreateCampaignDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;

    const campaign = await this.emailMarketingService.createCampaign(userId, tenantId, dto);

    return reply.status(201).send({
      message: 'Campaign created successfully',
      data: campaign
    });
  }

  /**
   * Get campaigns
   */
  async getCampaigns(
    request: TenantRequest<{
      Querystring: {
        limit?: number;
        offset?: number;
        status?: CampaignStatus;
        listId?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { limit, offset, status, listId } = request.query;

    const result = await this.emailMarketingService.getCampaigns(userId, tenantId, {
      limit,
      offset,
      status,
      listId
    });

    return reply.send({
      data: result.campaigns,
      meta: {
        total: result.total,
        limit: limit || 20,
        offset: offset || 0
      }
    });
  }

  /**
   * Get single campaign
   */
  async getCampaign(
    request: TenantRequest<{
      Params: { campaignId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { campaignId } = request.params;

    const campaign = await this.emailMarketingService.getCampaignDetails(
      userId,
      tenantId,
      campaignId
    );

    return reply.send({ data: campaign });
  }

  /**
   * Update campaign
   */
  async updateCampaign(
    request: TenantRequest<{
      Params: { campaignId: string };
      Body: UpdateCampaignDTO;
    }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(UpdateCampaignDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { campaignId } = request.params;

    const campaign = await this.emailMarketingService.updateCampaign(
      userId,
      tenantId,
      campaignId,
      dto
    );

    return reply.send({
      message: 'Campaign updated successfully',
      data: campaign
    });
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(
    request: TenantRequest<{
      Params: { campaignId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { campaignId } = request.params;

    await this.emailMarketingService.deleteCampaign(userId, tenantId, campaignId);

    return reply.status(204).send();
  }

  /**
   * Schedule campaign
   */
  async scheduleCampaign(
    request: TenantRequest<{
      Params: { campaignId: string };
      Body: { scheduledAt: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { campaignId } = request.params;
    const { scheduledAt } = request.body;

    const campaign = await this.emailMarketingService.scheduleCampaign(
      userId,
      tenantId,
      campaignId,
      new Date(scheduledAt)
    );

    return reply.send({
      message: 'Campaign scheduled successfully',
      data: campaign
    });
  }

  /**
   * Send campaign now
   */
  async sendCampaign(
    request: TenantRequest<{
      Params: { campaignId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { campaignId } = request.params;

    await this.emailMarketingService.sendCampaign(userId, tenantId, campaignId);

    return reply.send({
      message: 'Campaign is being sent'
    });
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStatistics(
    request: TenantRequest<{
      Params: { campaignId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { campaignId } = request.params;

    const stats = await this.emailMarketingService.getCampaignStatistics(
      userId,
      tenantId,
      campaignId
    );

    return reply.send({ data: stats });
  }

  // ===== TEMPLATE MANAGEMENT =====

  /**
   * Create template
   */
  async createTemplate(
    request: TenantRequest<{
      Body: CreateTemplateDTO;
    }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(CreateTemplateDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;

    const template = await this.emailMarketingService.createTemplate(userId, tenantId, dto);

    return reply.status(201).send({
      message: 'Template created successfully',
      data: template
    });
  }

  /**
   * Get templates
   */
  async getTemplates(
    request: TenantRequest<{
      Querystring: {
        limit?: number;
        offset?: number;
        category?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { limit, offset, category } = request.query;

    const result = await this.emailMarketingService.getTemplates(userId, tenantId, {
      limit,
      offset,
      category
    });

    return reply.send({
      data: result.templates,
      meta: {
        total: result.total,
        limit: limit || 20,
        offset: offset || 0
      }
    });
  }

  /**
   * Update template
   */
  async updateTemplate(
    request: TenantRequest<{
      Params: { templateId: string };
      Body: UpdateTemplateDTO;
    }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(UpdateTemplateDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { templateId } = request.params;

    const template = await this.emailMarketingService.updateTemplate(
      userId,
      tenantId,
      templateId,
      dto
    );

    return reply.send({
      message: 'Template updated successfully',
      data: template
    });
  }

  /**
   * Delete template
   */
  async deleteTemplate(
    request: TenantRequest<{
      Params: { templateId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { templateId } = request.params;

    await this.emailMarketingService.deleteTemplate(userId, tenantId, templateId);

    return reply.status(204).send();
  }

  // ===== AUTOMATION MANAGEMENT =====

  /**
   * Create automation
   */
  async createAutomation(
    request: TenantRequest<{
      Body: CreateAutomationDTO;
    }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(CreateAutomationDTO.schema, request.body);
    const userId = request.user!.id;
    const tenantId = request.tenantId!;

    const automation = await this.emailMarketingService.createAutomation(userId, tenantId, dto);

    return reply.status(201).send({
      message: 'Automation created successfully',
      data: automation
    });
  }

  /**
   * Get automations
   */
  async getAutomations(
    request: TenantRequest<{
      Querystring: {
        limit?: number;
        offset?: number;
        type?: AutomationType;
        isActive?: boolean;
      };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { limit, offset, type, isActive } = request.query;

    const result = await this.emailMarketingService.getAutomations(userId, tenantId, {
      limit,
      offset,
      type,
      isActive
    });

    return reply.send({
      data: result.automations,
      meta: {
        total: result.total,
        limit: limit || 20,
        offset: offset || 0
      }
    });
  }

  /**
   * Activate automation
   */
  async activateAutomation(
    request: TenantRequest<{
      Params: { automationId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { automationId } = request.params;

    await this.emailMarketingService.activateAutomation(userId, tenantId, automationId);

    return reply.send({
      message: 'Automation activated successfully'
    });
  }

  /**
   * Deactivate automation
   */
  async deactivateAutomation(
    request: TenantRequest<{
      Params: { automationId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { automationId } = request.params;

    await this.emailMarketingService.deactivateAutomation(userId, tenantId, automationId);

    return reply.send({
      message: 'Automation deactivated successfully'
    });
  }

  /**
   * Get automation statistics
   */
  async getAutomationStatistics(
    request: TenantRequest<{
      Params: { automationId: string };
    }>,
    reply: FastifyReply
  ) {
    const userId = request.user!.id;
    const tenantId = request.tenantId!;
    const { automationId } = request.params;

    const stats = await this.emailMarketingService.getAutomationStatistics(
      userId,
      tenantId,
      automationId
    );

    return reply.send({ data: stats });
  }

  // ===== EMAIL ACTIVITY TRACKING =====

  /**
   * Track email open
   */
  async trackOpen(
    request: FastifyRequest<{
      Params: { trackingId: string };
    }>,
    reply: FastifyReply
  ) {
    const { trackingId } = request.params;
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    await this.emailMarketingService.trackEmailActivity({
      trackingId,
      type: 'open',
      ipAddress,
      userAgent
    });

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return reply
      .type('image/gif')
      .header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .header('Pragma', 'no-cache')
      .header('Expires', '0')
      .send(pixel);
  }

  /**
   * Track email click
   */
  async trackClick(
    request: FastifyRequest<{
      Params: { trackingId: string };
      Querystring: { url: string };
    }>,
    reply: FastifyReply
  ) {
    const { trackingId } = request.params;
    const { url } = request.query;
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    await this.emailMarketingService.trackEmailActivity({
      trackingId,
      type: 'click',
      ipAddress,
      userAgent,
      metadata: { url }
    });

    // Redirect to original URL
    return reply.redirect(302, url);
  }

  /**
   * Handle email bounce webhook
   */
  async handleBounce(
    request: FastifyRequest<{
      Body: {
        messageId: string;
        recipientEmail: string;
        bounceType: 'hard' | 'soft';
        bounceSubType?: string;
        bouncedAt: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const { messageId, recipientEmail, bounceType, bounceSubType, bouncedAt } = request.body;

    await this.emailMarketingService.handleEmailBounce({
      messageId,
      recipientEmail,
      bounceType,
      bounceSubType,
      bouncedAt: new Date(bouncedAt)
    });

    return reply.status(200).send({ received: true });
  }

  /**
   * Handle email complaint webhook
   */
  async handleComplaint(
    request: FastifyRequest<{
      Body: {
        messageId: string;
        recipientEmail: string;
        complaintType: string;
        complainedAt: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const { messageId, recipientEmail, complaintType, complainedAt } = request.body;

    await this.emailMarketingService.handleEmailComplaint({
      messageId,
      recipientEmail,
      complaintType,
      complainedAt: new Date(complainedAt)
    });

    return reply.status(200).send({ received: true });
  }
}