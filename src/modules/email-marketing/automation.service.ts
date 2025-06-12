import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { queueService } from '@shared/queue/queue.service';
import { TenantContextService } from '@modules/tenant/tenant.context';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@shared/exceptions';
import {
  CreateAutomationDto,
  UpdateAutomationDto,
  CreateAutomationStepDto,
  UpdateAutomationStepDto,
  AutomationQueryDto,
  EnrollmentQueryDto,
  TriggerAutomationDto
} from './email-marketing.dto';
import {
  EmailAutomationTrigger,
  Prisma
} from '@prisma/client';
import { EmailMarketingEvents } from './email-marketing.events';
import { TemplateService } from './template.service';
import { SegmentationService } from './segmentation.service';

@Service()
export class AutomationService {
  constructor(
    private tenantContext: TenantContextService,
    private templateService: TemplateService,
    private segmentationService: SegmentationService
  ) {}

  /**
   * Create a new automation
   */
  async create(data: CreateAutomationDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    // Validate list if provided
    if (data.listId) {
      const list = await prisma.client.emailList.findFirst({
        where: {
          id: data.listId,
          tenantId,
          deletedAt: null
        }
      });

      if (!list) {
        throw new NotFoundException('Email list not found');
      }
    }

    try {
      const automation = await prisma.client.emailAutomation.create({
        data: {
          tenantId,
          listId: data.listId,
          name: data.name,
          description: data.description,
          trigger: data.trigger,
          triggerConfig: data.triggerConfig,
          metadata: data.metadata
        }
      });

      // Create steps if provided
      if (data.steps && data.steps.length > 0) {
        for (let i = 0; i < data.steps.length; i++) {
          await this.addStep(automation.id, {
            ...data.steps[i],
            order: i + 1
          });
        }
      }

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_CREATED, {
        automationId: automation.id,
        tenantId
      });

      logger.info('Automation created', { automationId: automation.id, tenantId });

      return automation;
    } catch (error) {
      logger.error('Failed to create automation', error as Error);
      throw error;
    }
  }

  /**
   * Update automation
   */
  async update(automationId: string, data: UpdateAutomationDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const automation = await this.findById(automationId);

    if (automation.active) {
      throw new BadRequestException('Cannot update active automation');
    }

    try {
      const updated = await prisma.client.emailAutomation.update({
        where: { id: automationId },
        data: {
          name: data.name,
          description: data.description,
          trigger: data.trigger,
          triggerConfig: data.triggerConfig,
          metadata: data.metadata
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_UPDATED, {
        automationId: updated.id,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update automation', error as Error);
      throw error;
    }
  }

  /**
   * Activate automation
   */
  async activate(automationId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const automation = await this.findById(automationId);

    if (automation.active) {
      throw new BadRequestException('Automation is already active');
    }

    // Validate automation has steps
    const stepCount = await prisma.client.emailAutomationStep.count({
      where: { automationId }
    });

    if (stepCount === 0) {
      throw new BadRequestException('Automation must have at least one step');
    }

    try {
      const updated = await prisma.client.emailAutomation.update({
        where: { id: automationId },
        data: { active: true }
      });

      // Register triggers
      await this.registerTriggers(updated);

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_ACTIVATED, {
        automationId: updated.id,
        tenantId
      });

      logger.info('Automation activated', { automationId });

      return updated;
    } catch (error) {
      logger.error('Failed to activate automation', error as Error);
      throw error;
    }
  }

  /**
   * Deactivate automation
   */
  async deactivate(automationId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const automation = await this.findById(automationId);

    if (!automation.active) {
      throw new BadRequestException('Automation is already inactive');
    }

    try {
      const updated = await prisma.client.emailAutomation.update({
        where: { id: automationId },
        data: { active: false }
      });

      // Unregister triggers
      await this.unregisterTriggers(updated);

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_DEACTIVATED, {
        automationId: updated.id,
        tenantId
      });

      logger.info('Automation deactivated', { automationId });

      return updated;
    } catch (error) {
      logger.error('Failed to deactivate automation', error as Error);
      throw error;
    }
  }

  /**
   * Delete automation
   */
  async delete(automationId: string): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const automation = await this.findById(automationId);

    if (automation.active) {
      throw new BadRequestException('Cannot delete active automation');
    }

    try {
      await prisma.client.emailAutomation.delete({
        where: { id: automationId }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_DELETED, {
        automationId,
        tenantId
      });

      logger.info('Automation deleted', { automationId });
    } catch (error) {
      logger.error('Failed to delete automation', error as Error);
      throw error;
    }
  }

  /**
   * Get automation by ID
   */
  async findById(automationId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const automation = await prisma.client.emailAutomation.findFirst({
      where: {
        id: automationId,
        tenantId
      },
      include: {
        list: true,
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    return automation;
  }

  /**
   * Find automations with filtering
   */
  async find(query: AutomationQueryDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const where: Prisma.EmailAutomationWhereInput = {
      tenantId,
      ...(query.listId && { listId: query.listId }),
      ...(query.active !== undefined && { active: query.active }),
      ...(query.trigger && { trigger: query.trigger }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } }
        ]
      })
    };

    const [automations, total] = await Promise.all([
      prisma.client.emailAutomation.findMany({
        where,
        include: {
          list: true,
          _count: {
            select: {
              steps: true,
              enrollments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit
      }),
      prisma.client.emailAutomation.count({ where })
    ]);

    return {
      automations,
      pagination: {
        total,
        page: Math.floor(query.skip / query.limit) + 1,
        limit: query.limit,
        pages: Math.ceil(total / query.limit)
      }
    };
  }

  /**
   * Add step to automation
   */
  async addStep(automationId: string, data: CreateAutomationStepDto): Promise<any> {
    const automation = await this.findById(automationId);

    if (automation.active) {
      throw new BadRequestException('Cannot modify active automation');
    }

    // Validate template if provided
    if (data.templateId) {
      await this.templateService.findById(data.templateId);
    }

    try {
      const step = await prisma.client.emailAutomationStep.create({
        data: {
          automationId,
          name: data.name,
          order: data.order,
          delayAmount: data.delayAmount,
          delayUnit: data.delayUnit,
          templateId: data.templateId,
          subject: data.subject,
          htmlContent: data.htmlContent || '',
          textContent: data.textContent,
          conditions: data.conditions,
          metadata: data.metadata
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_STEP_ADDED, {
        automationId,
        stepId: step.id
      });

      return step;
    } catch (error) {
      logger.error('Failed to add automation step', error as Error);
      throw error;
    }
  }

  /**
   * Update automation step
   */
  async updateStep(stepId: string, data: UpdateAutomationStepDto): Promise<any> {
    const step = await prisma.client.emailAutomationStep.findUnique({
      where: { id: stepId },
      include: { automation: true }
    });

    if (!step) {
      throw new NotFoundException('Automation step not found');
    }

    if (step.automation.active) {
      throw new BadRequestException('Cannot modify active automation');
    }

    try {
      const updated = await prisma.client.emailAutomationStep.update({
        where: { id: stepId },
        data: {
          name: data.name,
          order: data.order,
          delayAmount: data.delayAmount,
          delayUnit: data.delayUnit,
          templateId: data.templateId,
          subject: data.subject,
          htmlContent: data.htmlContent,
          textContent: data.textContent,
          conditions: data.conditions,
          metadata: data.metadata
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_STEP_UPDATED, {
        automationId: step.automationId,
        stepId: updated.id
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update automation step', error as Error);
      throw error;
    }
  }

  /**
   * Delete automation step
   */
  async deleteStep(stepId: string): Promise<void> {
    const step = await prisma.client.emailAutomationStep.findUnique({
      where: { id: stepId },
      include: { automation: true }
    });

    if (!step) {
      throw new NotFoundException('Automation step not found');
    }

    if (step.automation.active) {
      throw new BadRequestException('Cannot modify active automation');
    }

    try {
      await prisma.client.emailAutomationStep.delete({
        where: { id: stepId }
      });

      // Reorder remaining steps
      await this.reorderSteps(step.automationId);

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_STEP_DELETED, {
        automationId: step.automationId,
        stepId
      });
    } catch (error) {
      logger.error('Failed to delete automation step', error as Error);
      throw error;
    }
  }

  /**
   * Enroll subscriber in automation
   */
  async enrollSubscriber(automationId: string, subscriberId: string): Promise<any> {
    const automation = await this.findById(automationId);

    if (!automation.active) {
      throw new BadRequestException('Automation is not active');
    }

    // Check if already enrolled
    const existing = await prisma.client.emailAutomationEnrollment.findUnique({
      where: {
        automationId_subscriberId: {
          automationId,
          subscriberId
        }
      }
    });

    if (existing && existing.status === 'active') {
      throw new BadRequestException('Subscriber already enrolled');
    }

    try {
      const enrollment = await prisma.client.emailAutomationEnrollment.upsert({
        where: {
          automationId_subscriberId: {
            automationId,
            subscriberId
          }
        },
        create: {
          automationId,
          subscriberId,
          status: 'active'
        },
        update: {
          status: 'active',
          enrolledAt: new Date(),
          completedAt: null,
          cancelledAt: null
        }
      });

      // Queue first step
      const firstStep = await prisma.client.emailAutomationStep.findFirst({
        where: { automationId },
        orderBy: { order: 'asc' }
      });

      if (firstStep) {
        await this.queueStep(enrollment.id, firstStep.id);
      }

      // Update automation stats
      await prisma.client.emailAutomation.update({
        where: { id: automationId },
        data: {
          totalEnrolled: { increment: 1 }
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_ENROLLMENT_STARTED, {
        automationId,
        subscriberId,
        enrollmentId: enrollment.id
      });

      return enrollment;
    } catch (error) {
      logger.error('Failed to enroll subscriber', error as Error);
      throw error;
    }
  }

  /**
   * Cancel enrollment
   */
  async cancelEnrollment(enrollmentId: string): Promise<any> {
    const enrollment = await prisma.client.emailAutomationEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { automation: true }
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status !== 'active') {
      throw new BadRequestException('Enrollment is not active');
    }

    try {
      const updated = await prisma.client.emailAutomationEnrollment.update({
        where: { id: enrollmentId },
        data: {
          status: 'cancelled',
          cancelledAt: new Date()
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_ENROLLMENT_CANCELLED, {
        automationId: enrollment.automationId,
        enrollmentId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to cancel enrollment', error as Error);
      throw error;
    }
  }

  /**
   * Get enrollments for automation
   */
  async getEnrollments(
    automationId: string,
    query: EnrollmentQueryDto
  ): Promise<any> {
    const automation = await this.findById(automationId);

    const where: Prisma.EmailAutomationEnrollmentWhereInput = {
      automationId,
      ...(query.status && { status: query.status })
    };

    const [enrollments, total] = await Promise.all([
      prisma.client.emailAutomationEnrollment.findMany({
        where,
        orderBy: { enrolledAt: 'desc' },
        skip: query.skip,
        take: query.limit
      }),
      prisma.client.emailAutomationEnrollment.count({ where })
    ]);

    return {
      enrollments,
      pagination: {
        total,
        page: Math.floor(query.skip / query.limit) + 1,
        limit: query.limit,
        pages: Math.ceil(total / query.limit)
      }
    };
  }

  /**
   * Trigger automation manually
   */
  async trigger(data: TriggerAutomationDto): Promise<any> {
    const automation = await this.findById(data.automationId);

    if (!automation.active) {
      throw new BadRequestException('Automation is not active');
    }

    // Queue trigger processing
    await queueService.addJob(
      'email-marketing',
      'process-automation-trigger',
      {
        automationId: data.automationId,
        triggerData: data.triggerData
      }
    );

    return { message: 'Automation triggered' };
  }

  /**
   * Register automation triggers
   */
  private async registerTriggers(automation: any): Promise<void> {
    switch (automation.trigger) {
      case EmailAutomationTrigger.USER_SIGNUP:
        // Listen to user signup events
        eventBus.on('user.created', async (data) => {
          await this.handleUserSignupTrigger(automation, data);
        });
        break;

      case EmailAutomationTrigger.LIST_SUBSCRIBE:
        // Listen to list subscribe events
        eventBus.on(EmailMarketingEvents.SUBSCRIBER_ADDED, async (data) => {
          if (data.listId === automation.listId) {
            await this.handleListSubscribeTrigger(automation, data);
          }
        });
        break;

      case EmailAutomationTrigger.TAG_ADDED:
        // Listen to tag update events
        eventBus.on(EmailMarketingEvents.SUBSCRIBER_TAGS_UPDATED, async (data) => {
          await this.handleTagAddedTrigger(automation, data);
        });
        break;

      case EmailAutomationTrigger.DATE_BASED:
        // Schedule cron job for date-based triggers
        const cronExpression = automation.triggerConfig.cronExpression;
        await queueService.addJob(
          'email-marketing',
          'check-date-triggers',
          { automationId: automation.id },
          {
            repeat: { cron: cronExpression }
          }
        );
        break;

      case EmailAutomationTrigger.CUSTOM_EVENT:
        // Listen to custom events
        const eventName = automation.triggerConfig.eventName;
        eventBus.on(eventName, async (data) => {
          await this.handleCustomEventTrigger(automation, data);
        });
        break;
    }
  }

  /**
   * Unregister automation triggers
   */
  private async unregisterTriggers(automation: any): Promise<void> {
    // This would need to store handler references to properly unregister
    // For now, the handlers will check if automation is active
  }

  /**
   * Handle user signup trigger
   */
  private async handleUserSignupTrigger(automation: any, data: any): Promise<void> {
    // Check if user's email exists in the automation's list
    if (automation.listId) {
      const subscriber = await prisma.client.emailListSubscriber.findFirst({
        where: {
          listId: automation.listId,
          email: data.email,
          subscribed: true,
          confirmed: true
        }
      });

      if (subscriber) {
        await this.enrollSubscriber(automation.id, subscriber.id);
      }
    }
  }

  /**
   * Handle list subscribe trigger
   */
  private async handleListSubscribeTrigger(automation: any, data: any): Promise<void> {
    if (automation.active) {
      await this.enrollSubscriber(automation.id, data.subscriberId);
    }
  }

  /**
   * Handle tag added trigger
   */
  private async handleTagAddedTrigger(automation: any, data: any): Promise<void> {
    const requiredTags = automation.triggerConfig.tags || [];
    const subscriberTags = data.tags || [];

    const hasAllTags = requiredTags.every((tag: string) =>
      subscriberTags.includes(tag)
    );

    if (hasAllTags && automation.active) {
      await this.enrollSubscriber(automation.id, data.subscriberId);
    }
  }

  /**
   * Handle custom event trigger
   */
  private async handleCustomEventTrigger(automation: any, data: any): Promise<void> {
    if (automation.active && data.subscriberId) {
      await this.enrollSubscriber(automation.id, data.subscriberId);
    }
  }

  /**
   * Queue automation step
   */
  private async queueStep(enrollmentId: string, stepId: string): Promise<void> {
    const step = await prisma.client.emailAutomationStep.findUnique({
      where: { id: stepId }
    });

    if (!step) return;

    // Calculate delay in milliseconds
    const delayMs = this.calculateDelay(step.delayAmount, step.delayUnit);

    await queueService.addJob(
      'email-marketing',
      'process-automation-step',
      {
        enrollmentId,
        stepId
      },
      {
        delay: delayMs
      }
    );
  }

  /**
   * Calculate delay in milliseconds
   */
  private calculateDelay(amount: number, unit: string): number {
    const multipliers: Record<string, number> = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000
    };

    return amount * (multipliers[unit] || multipliers.hours);
  }

  /**
   * Reorder steps after deletion
   */
  private async reorderSteps(automationId: string): Promise<void> {
    const steps = await prisma.client.emailAutomationStep.findMany({
      where: { automationId },
      orderBy: { order: 'asc' }
    });

    for (let i = 0; i < steps.length; i++) {
      await prisma.client.emailAutomationStep.update({
        where: { id: steps[i].id },
        data: { order: i + 1 }
      });
    }
  }
}
