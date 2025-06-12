import { Service } from 'typedi';
import {
  EmailList,
  EmailSubscriber,
  EmailCampaign,
  EmailTemplate,
  EmailSegment,
  EmailAutomation,
  SubscriberStatus,
  CampaignStatus,
  ListStatus,
  SegmentType,
  AutomationType,
  Prisma
} from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { queueService } from '@shared/queue/queue.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException
} from '@shared/exceptions';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';
import { parse } from 'csv-parse';
import { Transform } from 'stream';

// Import required services
import { AuthService } from '@modules/auth/auth.service';
import { TenantService } from '@modules/tenant/tenant.service';
import { NotificationService } from '@modules/notification/notification.service';

import { EmailMarketingEvents } from './email-marketing.events';
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
  EmailActivityDTO,
  ListStatistics,
  CampaignStatistics,
  SubscriberActivity,
  AutomationStatistics
} from './email-marketing.dto';

@Service()
export class EmailMarketingService {
  constructor(
    private eventBus: EventBus,
    private authService: AuthService,
    private tenantService: TenantService,
    private notificationService: NotificationService
  ) {}

  // ===== LIST MANAGEMENT =====

  /**
   * Create a new email list
   */
  async createList(userId: string, tenantId: string, dto: CreateListDTO): Promise<EmailList> {
    // Verify user has access to tenant
    const tenant = await this.tenantService.getTenant(tenantId, userId);
    if (!tenant) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    // Check for duplicate list name within tenant
    const existingList = await prisma.client.emailList.findFirst({
      where: {
        tenantId,
        name: dto.name,
        deletedAt: null
      }
    });

    if (existingList) {
      throw new ConflictException('List with this name already exists');
    }

    // Create the list
    const list = await prisma.client.emailList.create({
      data: {
        ...dto,
        tenantId,
        createdById: userId,
        status: ListStatus.ACTIVE,
        settings: dto.settings || {}
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.LIST_CREATED, {
      listId: list.id,
      tenantId,
      userId,
      timestamp: new Date()
    });

    // Send notification
    await this.notificationService.create({
      userId,
      type: 'SUCCESS',
      title: 'Email List Created',
      content: `Your email list "${list.name}" has been created successfully.`,
      metadata: {
        listId: list.id,
        tenantId
      }
    });

    logger.info('Email list created', { listId: list.id, tenantId, userId });

    return list;
  }

  /**
   * Get email lists for a tenant
   */
  async getLists(
    userId: string,
    tenantId: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: ListStatus;
      search?: string;
    }
  ): Promise<{ lists: EmailList[]; total: number }> {
    // Verify user has access to tenant
    const member = await this.tenantService.getTenantMembers(tenantId, userId, { limit: 1 });
    if (!member || member.total === 0) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    const { limit = 20, offset = 0, status, search } = options || {};

    const where: Prisma.EmailListWhereInput = {
      tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [lists, total] = await Promise.all([
      prisma.client.emailList.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { subscribers: true }
          }
        }
      }),
      prisma.client.emailList.count({ where })
    ]);

    return { lists, total };
  }

  /**
   * Update email list
   */
  async updateList(
    userId: string,
    tenantId: string,
    listId: string,
    dto: UpdateListDTO
  ): Promise<EmailList> {
    // Verify user has admin/owner access to tenant
    const member = await this.tenantService.getTenantMembers(tenantId, userId, { limit: 1 });
    if (!member || member.total === 0) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    // Get the list
    const list = await this.getListById(listId, tenantId);

    // Update the list
    const updatedList = await prisma.client.emailList.update({
      where: { id: listId },
      data: {
        ...dto,
        updatedAt: new Date()
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.LIST_UPDATED, {
      listId,
      tenantId,
      userId,
      changes: dto,
      timestamp: new Date()
    });

    logger.info('Email list updated', { listId, tenantId, userId });

    return updatedList;
  }

  /**
   * Delete email list (soft delete)
   */
  async deleteList(userId: string, tenantId: string, listId: string): Promise<void> {
    // Verify user has admin/owner access to tenant
    const member = await this.tenantService.getTenantMembers(tenantId, userId, { limit: 1 });
    if (!member || member.total === 0) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    // Get the list
    const list = await this.getListById(listId, tenantId);

    // Check if list has active campaigns
    const activeCampaigns = await prisma.client.emailCampaign.count({
      where: {
        listId,
        status: { in: [CampaignStatus.DRAFT, CampaignStatus.SCHEDULED, CampaignStatus.SENDING] }
      }
    });

    if (activeCampaigns > 0) {
      throw new BadRequestException('Cannot delete list with active campaigns');
    }

    // Soft delete the list
    await prisma.client.emailList.update({
      where: { id: listId },
      data: {
        deletedAt: new Date(),
        status: ListStatus.DELETED
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.LIST_DELETED, {
      listId,
      tenantId,
      userId,
      timestamp: new Date()
    });

    // Send notification
    await this.notificationService.create({
      userId,
      type: 'INFO',
      title: 'Email List Deleted',
      content: `The email list "${list.name}" has been deleted.`,
      metadata: {
        listId,
        tenantId
      }
    });

    logger.info('Email list deleted', { listId, tenantId, userId });
  }

  // ===== SUBSCRIBER MANAGEMENT =====

  /**
   * Add subscriber to list
   */
  async addSubscriber(
    userId: string,
    tenantId: string,
    listId: string,
    dto: CreateSubscriberDTO
  ): Promise<EmailSubscriber> {
    // Verify access
    await this.verifyListAccess(listId, tenantId, userId);

    // Check if subscriber already exists
    const existingSubscriber = await prisma.client.emailSubscriber.findFirst({
      where: {
        listId,
        email: dto.email.toLowerCase()
      }
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === SubscriberStatus.UNSUBSCRIBED) {
        // Resubscribe
        return await prisma.client.emailSubscriber.update({
          where: { id: existingSubscriber.id },
          data: {
            status: dto.requireConfirmation ? SubscriberStatus.PENDING : SubscriberStatus.ACTIVE,
            subscribedAt: new Date(),
            unsubscribedAt: null,
            customFields: dto.customFields || {},
            tags: dto.tags || []
          }
        });
      }
      throw new ConflictException('Subscriber already exists in this list');
    }

    // Create subscriber
    const subscriber = await prisma.client.emailSubscriber.create({
      data: {
        listId,
        email: dto.email.toLowerCase(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        status: dto.requireConfirmation ? SubscriberStatus.PENDING : SubscriberStatus.ACTIVE,
        customFields: dto.customFields || {},
        tags: dto.tags || [],
        source: dto.source || 'manual',
        ipAddress: dto.ipAddress,
        subscribedAt: dto.requireConfirmation ? null : new Date()
      }
    });

    // Send confirmation email if required
    if (dto.requireConfirmation) {
      await this.sendConfirmationEmail(subscriber, tenantId);
    }

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.SUBSCRIBER_ADDED, {
      subscriberId: subscriber.id,
      listId,
      tenantId,
      userId,
      requiresConfirmation: dto.requireConfirmation,
      timestamp: new Date()
    });

    // Update list statistics
    await this.updateListStatistics(listId);

    logger.info('Subscriber added', {
      subscriberId: subscriber.id,
      listId,
      email: subscriber.email
    });

    return subscriber;
  }

  /**
   * Import subscribers in bulk
   */
  async importSubscribers(
    userId: string,
    tenantId: string,
    listId: string,
    dto: ImportSubscribersDTO
  ): Promise<{
    imported: number;
    failed: number;
    errors: Array<{ row: number; email: string; error: string }>;
  }> {
    // Verify access
    await this.verifyListAccess(listId, tenantId, userId);

    const results = {
      imported: 0,
      failed: 0,
      errors: [] as Array<{ row: number; email: string; error: string }>
    };

    // Process CSV data
    const subscribers = await this.parseCSVData(dto.csvData);

    // Batch process subscribers
    const batchSize = 100;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (sub, index) => {
          try {
            await this.addSubscriber(userId, tenantId, listId, {
              ...sub,
              requireConfirmation: dto.sendConfirmation,
              source: 'import'
            });
            results.imported++;
          } catch (error: any) {
            results.failed++;
            results.errors.push({
              row: i + index + 1,
              email: sub.email,
              error: error.message
            });
          }
        })
      );
    }

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.SUBSCRIBERS_IMPORTED, {
      listId,
      tenantId,
      userId,
      imported: results.imported,
      failed: results.failed,
      timestamp: new Date()
    });

    // Send notification
    await this.notificationService.create({
      userId,
      type: results.failed > 0 ? 'WARNING' : 'SUCCESS',
      title: 'Subscriber Import Completed',
      content: `Imported ${results.imported} subscribers. ${results.failed} failed.`,
      metadata: {
        listId,
        tenantId,
        results
      }
    });

    logger.info('Subscribers imported', {
      listId,
      tenantId,
      imported: results.imported,
      failed: results.failed
    });

    return results;
  }

  /**
   * Update subscriber
   */
  async updateSubscriber(
    userId: string,
    tenantId: string,
    subscriberId: string,
    dto: Partial<CreateSubscriberDTO>
  ): Promise<EmailSubscriber> {
    const subscriber = await this.getSubscriberById(subscriberId);

    // Verify access
    await this.verifyListAccess(subscriber.listId, tenantId, userId);

    const updatedSubscriber = await prisma.client.emailSubscriber.update({
      where: { id: subscriberId },
      data: {
        ...dto,
        email: dto.email?.toLowerCase(),
        updatedAt: new Date()
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.SUBSCRIBER_UPDATED, {
      subscriberId,
      listId: subscriber.listId,
      tenantId,
      userId,
      changes: dto,
      timestamp: new Date()
    });

    return updatedSubscriber;
  }

  /**
   * Unsubscribe
   */
  async unsubscribe(
    subscriberId: string,
    reason?: string,
    feedback?: string
  ): Promise<void> {
    const subscriber = await this.getSubscriberById(subscriberId);

    await prisma.client.emailSubscriber.update({
      where: { id: subscriberId },
      data: {
        status: SubscriberStatus.UNSUBSCRIBED,
        unsubscribedAt: new Date(),
        unsubscribeReason: reason,
        unsubscribeFeedback: feedback
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.SUBSCRIBER_UNSUBSCRIBED, {
      subscriberId,
      listId: subscriber.listId,
      reason,
      timestamp: new Date()
    });

    // Update list statistics
    await this.updateListStatistics(subscriber.listId);

    logger.info('Subscriber unsubscribed', {
      subscriberId,
      listId: subscriber.listId,
      reason
    });
  }

  // ===== CAMPAIGN MANAGEMENT =====

  /**
   * Create email campaign
   */
  async createCampaign(
    userId: string,
    tenantId: string,
    dto: CreateCampaignDTO
  ): Promise<EmailCampaign> {
    // Verify list access
    await this.verifyListAccess(dto.listId, tenantId, userId);

    // Verify template access if provided
    if (dto.templateId) {
      await this.getTemplateById(dto.templateId, tenantId);
    }

    // Verify segment access if provided
    if (dto.segmentId) {
      await this.getSegmentById(dto.segmentId, tenantId);
    }

    const campaign = await prisma.client.emailCampaign.create({
      data: {
        ...dto,
        tenantId,
        createdById: userId,
        status: CampaignStatus.DRAFT,
        settings: dto.settings || {}
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.CAMPAIGN_CREATED, {
      campaignId: campaign.id,
      tenantId,
      userId,
      timestamp: new Date()
    });

    // Send notification
    await this.notificationService.create({
      userId,
      type: 'INFO',
      title: 'Campaign Created',
      content: `Your campaign "${campaign.name}" has been created as a draft.`,
      metadata: {
        campaignId: campaign.id,
        tenantId
      }
    });

    logger.info('Campaign created', {
      campaignId: campaign.id,
      tenantId,
      userId
    });

    return campaign;
  }

  /**
   * Update campaign
   */
  async updateCampaign(
    userId: string,
    tenantId: string,
    campaignId: string,
    dto: UpdateCampaignDTO
  ): Promise<EmailCampaign> {
    const campaign = await this.getCampaignById(campaignId, tenantId);

    // Can't update sent campaigns
    if (campaign.status === CampaignStatus.SENT) {
      throw new BadRequestException('Cannot update sent campaigns');
    }

    // Verify list access if changing list
    if (dto.listId && dto.listId !== campaign.listId) {
      await this.verifyListAccess(dto.listId, tenantId, userId);
    }

    const updatedCampaign = await prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        ...dto,
        updatedAt: new Date()
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.CAMPAIGN_UPDATED, {
      campaignId,
      tenantId,
      userId,
      changes: dto,
      timestamp: new Date()
    });

    return updatedCampaign;
  }

  /**
   * Schedule campaign
   */
  async scheduleCampaign(
    userId: string,
    tenantId: string,
    campaignId: string,
    scheduledAt: Date
  ): Promise<EmailCampaign> {
    const campaign = await this.getCampaignById(campaignId, tenantId);

    // Verify campaign is ready
    if (!campaign.subject || !campaign.htmlContent) {
      throw new BadRequestException('Campaign content is not complete');
    }

    if (campaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Only draft campaigns can be scheduled');
    }

    if (scheduledAt <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    const updatedCampaign = await prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: CampaignStatus.SCHEDULED,
        scheduledAt,
        updatedAt: new Date()
      }
    });

    // Queue the campaign
    await queueService.addJob(
      'email-marketing',
      'send-campaign',
      { campaignId, tenantId },
      { delay: scheduledAt.getTime() - Date.now() }
    );

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.CAMPAIGN_SCHEDULED, {
      campaignId,
      tenantId,
      userId,
      scheduledAt,
      timestamp: new Date()
    });

    // Send notification
    await this.notificationService.create({
      userId,
      type: 'SUCCESS',
      title: 'Campaign Scheduled',
      content: `Your campaign "${campaign.name}" has been scheduled for ${scheduledAt.toLocaleString()}.`,
      metadata: {
        campaignId,
        tenantId,
        scheduledAt
      },
      actions: [
        {
          label: 'View Campaign',
          url: `/campaigns/${campaignId}`
        }
      ]
    });

    logger.info('Campaign scheduled', {
      campaignId,
      tenantId,
      scheduledAt
    });

    return updatedCampaign;
  }

  /**
   * Send campaign immediately
   */
  async sendCampaign(
    userId: string,
    tenantId: string,
    campaignId: string
  ): Promise<void> {
    const campaign = await this.getCampaignById(campaignId, tenantId);

    // Verify campaign is ready
    if (!campaign.subject || !campaign.htmlContent) {
      throw new BadRequestException('Campaign content is not complete');
    }

    if (campaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Only draft campaigns can be sent');
    }

    // Update status
    await prisma.client.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: CampaignStatus.SENDING,
        sentAt: new Date()
      }
    });

    // Queue for immediate sending
    await queueService.addJob(
      'email-marketing',
      'send-campaign',
      { campaignId, tenantId },
      { priority: 1 }
    );

    // Send notification
    await this.notificationService.create({
      userId,
      type: 'INFO',
      title: 'Campaign Sending',
      content: `Your campaign "${campaign.name}" is being sent.`,
      metadata: {
        campaignId,
        tenantId
      }
    });

    logger.info('Campaign send initiated', {
      campaignId,
      tenantId
    });
  }

  // ===== TEMPLATE MANAGEMENT =====

  /**
   * Create email template
   */
  async createTemplate(
    userId: string,
    tenantId: string,
    dto: CreateTemplateDTO
  ): Promise<EmailTemplate> {
    // Verify tenant access
    await this.tenantService.getTenant(tenantId, userId);

    // Check for duplicate template name
    const existing = await prisma.client.emailTemplate.findFirst({
      where: {
        tenantId,
        name: dto.name,
        deletedAt: null
      }
    });

    if (existing) {
      throw new ConflictException('Template with this name already exists');
    }

    const template = await prisma.client.emailTemplate.create({
      data: {
        ...dto,
        tenantId,
        createdById: userId,
        variables: dto.variables || []
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.TEMPLATE_CREATED, {
      templateId: template.id,
      tenantId,
      userId,
      timestamp: new Date()
    });

    logger.info('Template created', {
      templateId: template.id,
      tenantId,
      userId
    });

    return template;
  }

  // ===== AUTOMATION MANAGEMENT =====

  /**
   * Create automation workflow
   */
  async createAutomation(
    userId: string,
    tenantId: string,
    dto: CreateAutomationDTO
  ): Promise<EmailAutomation> {
    // Verify list access
    await this.verifyListAccess(dto.listId, tenantId, userId);

    const automation = await prisma.client.emailAutomation.create({
      data: {
        ...dto,
        tenantId,
        createdById: userId,
        isActive: false,
        settings: dto.settings || {}
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.AUTOMATION_CREATED, {
      automationId: automation.id,
      tenantId,
      userId,
      timestamp: new Date()
    });

    // Send notification
    await this.notificationService.create({
      userId,
      type: 'SUCCESS',
      title: 'Automation Created',
      content: `Your automation "${automation.name}" has been created.`,
      metadata: {
        automationId: automation.id,
        tenantId
      }
    });

    logger.info('Automation created', {
      automationId: automation.id,
      tenantId,
      userId
    });

    return automation;
  }

  /**
   * Activate automation
   */
  async activateAutomation(
    userId: string,
    tenantId: string,
    automationId: string
  ): Promise<void> {
    const automation = await this.getAutomationById(automationId, tenantId);

    // Verify automation has steps
    const steps = await prisma.client.automationStep.count({
      where: { automationId }
    });

    if (steps === 0) {
      throw new BadRequestException('Automation must have at least one step');
    }

    await prisma.client.emailAutomation.update({
      where: { id: automationId },
      data: {
        isActive: true,
        activatedAt: new Date()
      }
    });

    // Emit event
    await this.eventBus.emit(EmailMarketingEvents.AUTOMATION_ACTIVATED, {
      automationId,
      tenantId,
      userId,
      timestamp: new Date()
    });

    // Send notification
    await this.notificationService.create({
      userId,
      type: 'SUCCESS',
      title: 'Automation Activated',
      content: `Your automation "${automation.name}" is now active.`,
      metadata: {
        automationId,
        tenantId
      }
    });

    logger.info('Automation activated', {
      automationId,
      tenantId
    });
  }

  // ===== STATISTICS & REPORTING =====

  /**
   * Get list statistics
   */
  async getListStatistics(
    userId: string,
    tenantId: string,
    listId: string
  ): Promise<ListStatistics> {
    await this.verifyListAccess(listId, tenantId, userId);

    const stats = await prisma.client.$queryRaw<ListStatistics[]>`
      SELECT
        COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_count,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_count,
        COUNT(*) FILTER (WHERE status = 'UNSUBSCRIBED') as unsubscribed_count,
        COUNT(*) FILTER (WHERE status = 'BOUNCED') as bounced_count,
        COUNT(*) as total_count,
        AVG(EXTRACT(EPOCH FROM (NOW() - subscribed_at))/86400)::int as avg_subscription_age_days
      FROM email_subscribers
      WHERE list_id = ${listId}
    `;

    const growthData = await this.getListGrowthData(listId, 30);

    return {
      ...stats[0],
      growth: growthData
    };
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStatistics(
    userId: string,
    tenantId: string,
    campaignId: string
  ): Promise<CampaignStatistics> {
    const campaign = await this.getCampaignById(campaignId, tenantId);

    const stats = await prisma.client.$queryRaw<CampaignStatistics[]>`
      SELECT
        COUNT(*) as total_sent,
        COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as opened,
        COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as clicked,
        COUNT(*) FILTER (WHERE bounced_at IS NOT NULL) as bounced,
        COUNT(*) FILTER (WHERE unsubscribed_at IS NOT NULL) as unsubscribed,
        COUNT(*) FILTER (WHERE complained_at IS NOT NULL) as complained
      FROM campaign_recipients
      WHERE campaign_id = ${campaignId}
    `;

    const result = stats[0];

    return {
      ...result,
      openRate: result.total_sent > 0 ? (result.opened / result.total_sent) * 100 : 0,
      clickRate: result.total_sent > 0 ? (result.clicked / result.total_sent) * 100 : 0,
      bounceRate: result.total_sent > 0 ? (result.bounced / result.total_sent) * 100 : 0,
      unsubscribeRate: result.total_sent > 0 ? (result.unsubscribed / result.total_sent) * 100 : 0
    };
  }

  // ===== HELPER METHODS =====

  /**
   * Verify user has access to list
   */
  private async verifyListAccess(
    listId: string,
    tenantId: string,
    userId: string
  ): Promise<void> {
    const list = await this.getListById(listId, tenantId);

    // Verify user is member of tenant
    const member = await this.tenantService.getTenantMembers(tenantId, userId, { limit: 1 });
    if (!member || member.total === 0) {
      throw new ForbiddenException('Access denied to this list');
    }
  }

  /**
   * Get list by ID
   */
  private async getListById(listId: string, tenantId: string): Promise<EmailList> {
    const list = await prisma.client.emailList.findFirst({
      where: {
        id: listId,
        tenantId,
        deletedAt: null
      }
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    return list;
  }

  /**
   * Get subscriber by ID
   */
  private async getSubscriberById(subscriberId: string): Promise<EmailSubscriber> {
    const subscriber = await prisma.client.emailSubscriber.findUnique({
      where: { id: subscriberId }
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    return subscriber;
  }

  /**
   * Get template by ID
   */
  private async getTemplateById(templateId: string, tenantId: string): Promise<EmailTemplate> {
    const template = await prisma.client.emailTemplate.findFirst({
      where: {
        id: templateId,
        tenantId,
        deletedAt: null
      }
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  /**
   * Get segment by ID
   */
  private async getSegmentById(segmentId: string, tenantId: string): Promise<EmailSegment> {
    const segment = await prisma.client.emailSegment.findFirst({
      where: {
        id: segmentId,
        tenantId,
        deletedAt: null
      }
    });

    if (!segment) {
      throw new NotFoundException('Segment not found');
    }

    return segment;
  }

  /**
   * Get campaign by ID
   */
  private async getCampaignById(campaignId: string, tenantId: string): Promise<EmailCampaign> {
    const campaign = await prisma.client.emailCampaign.findFirst({
      where: {
        id: campaignId,
        tenantId,
        deletedAt: null
      }
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  /**
   * Get automation by ID
   */
  private async getAutomationById(automationId: string, tenantId: string): Promise<EmailAutomation> {
    const automation = await prisma.client.emailAutomation.findFirst({
      where: {
        id: automationId,
        tenantId,
        deletedAt: null
      }
    });

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    return automation;
  }

  /**
   * Send confirmation email
   */
  private async sendConfirmationEmail(
    subscriber: EmailSubscriber,
    tenantId: string
  ): Promise<void> {
    const confirmToken = nanoid(32);

    // Store token in Redis with 48h expiry
    await redis.setex(
      `email:confirm:${confirmToken}`,
      48 * 3600,
      JSON.stringify({ subscriberId: subscriber.id, tenantId })
    );

    // Queue confirmation email
    await queueService.addJob(
      'email-marketing',
      'send-confirmation',
      {
        subscriberId: subscriber.id,
        email: subscriber.email,
        confirmToken,
        tenantId
      }
    );

    logger.info('Confirmation email queued', {
      subscriberId: subscriber.id,
      email: subscriber.email
    });
  }

  /**
   * Update list statistics cache
   */
  private async updateListStatistics(listId: string): Promise<void> {
    // Invalidate cached statistics
    await redis.delete(`email:list:stats:${listId}`);
  }

  /**
   * Parse CSV data
   */
  private async parseCSVData(csvData: string): Promise<CreateSubscriberDTO[]> {
    return new Promise((resolve, reject) => {
      const subscribers: CreateSubscriberDTO[] = [];

      parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      })
        .on('data', (row) => {
          if (row.email) {
            subscribers.push({
              email: row.email,
              firstName: row.firstName || row.first_name,
              lastName: row.lastName || row.last_name,
              customFields: row
            });
          }
        })
        .on('error', reject)
        .on('end', () => resolve(subscribers));
    });
  }

  /**
   * Get list growth data
   */
  private async getListGrowthData(
    listId: string,
    days: number
  ): Promise<Array<{ date: string; subscribers: number; unsubscribes: number }>> {
    const data = await prisma.client.$queryRaw<any[]>`
      WITH date_series AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '${days} days',
          CURRENT_DATE,
          '1 day'::interval
        )::date AS date
      )
      SELECT
        ds.date::text,
        COALESCE(s.subscribers, 0) as subscribers,
        COALESCE(u.unsubscribes, 0) as unsubscribes
      FROM date_series ds
      LEFT JOIN (
        SELECT
          DATE(subscribed_at) as date,
          COUNT(*) as subscribers
        FROM email_subscribers
        WHERE list_id = ${listId}
          AND subscribed_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(subscribed_at)
      ) s ON ds.date = s.date
      LEFT JOIN (
        SELECT
          DATE(unsubscribed_at) as date,
          COUNT(*) as unsubscribes
        FROM email_subscribers
        WHERE list_id = ${listId}
          AND unsubscribed_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(unsubscribed_at)
      ) u ON ds.date = u.date
      ORDER BY ds.date
    `;

    return data;
  }
}
