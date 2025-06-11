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
import { CronExpression } from '@shared/utils/cron';

@Service()
export class AutomationService {
  constructor(
    private tenantContext: TenantContextService
  ) {}

  /**
   * Create automation workflow
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
          triggerConfig: data.triggerConfig as any,
          active: false,
          metadata: data.metadata
        },
        include: {
          list: true,
          steps: {
            orderBy: { order: 'asc' }
          }
        }
      });

      // Create steps if provided
      if (data.steps && data.steps.length > 0) {
        await this.createSteps(automation.id, data.steps);
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

    // Cannot update active automations
    if (automation.active && (data.trigger || data.triggerConfig)) {
      throw new BadRequestException('Cannot update trigger for active automation');
    }

    try {
      const updated = await prisma.client.emailAutomation.update({
        where: { id: automationId },
        data: {
          name: data.name,
          description: data.description,
          trigger: data.trigger,
          triggerConfig: data.triggerConfig as any,
          metadata: data.metadata
        },
        include: {
          list: true,
          steps: {
            orderBy: { order: 'asc' }
          }
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
    if (automation.steps.length === 0) {
      throw new BadRequestException('Cannot activate automation without steps');
    }

    try {
      const updated = await prisma.client.emailAutomation.update({
        where: { id: automationId },
        data: { active: true }
      });

      // Register automation triggers
      await this.registerTriggers(automation);

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

      // Unregister automation triggers
      await this.unregisterTriggers(automation);

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
   * Find automation by ID
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
          orderBy: { order: 'asc' },
          include: {
            template: true
          }
        },
        _count: {
          select: {
            enrollments: {
              where: { status: 'active' }
            }
          }
        }
      }
    });

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    return automation;
  }

  /**
   * Find automations
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
              enrollments: {
                where: { status: 'active' }
              }
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
   * Create automation steps
   */
  async createSteps(
    automationId: string,
    steps: CreateAutomationStepDto[]
  ): Promise<any[]> {
    const automation = await this.findById(automationId);

    if (automation.active) {
      throw new BadRequestException('Cannot add steps to active automation');
    }

    const createdSteps = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const created = await prisma.client.emailAutomationStep.create({
        data: {
          automationId,
          name: step.name,
          order: i + 1,
          delayAmount: step.delayAmount,
          delayUnit: step.delayUnit,
          templateId: step.templateId,
          subject: step.subject,
          htmlContent: step.htmlContent,
          textContent: step.textContent,
          conditions: step.conditions as any,
          metadata: step.metadata
        }
      });
      createdSteps.push(created);
    }

    await eventBus.emit(EmailMarketingEvents.AUTOMATION_STEPS_UPDATED, {
      automationId,
      steps: createdSteps.length
    });

    return createdSteps;
  }

  /**
   * Update automation step
   */
  async updateStep(
    automationId: string,
    stepId: string,
    data: UpdateAutomationStepDto
  ): Promise<any> {
    const automation = await this.findById(automationId);

    if (automation.active) {
      throw new BadRequestException('Cannot update steps in active automation');
    }

    const step = automation.steps.find(s => s.id === stepId);
    if (!step) {
      throw new NotFoundException('Step not found');
    }

    try {
      const updated = await prisma.client.emailAutomationStep.update({
        where: { id: stepId },
        data: {
          name: data.name,
          delayAmount: data.delayAmount,
          delayUnit: data.delayUnit,
          templateId: data.templateId,
          subject: data.subject,
          htmlContent: data.htmlContent,
          textContent: data.textContent,
          conditions: data.conditions as any,
          metadata: data.metadata
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_STEP_UPDATED, {
        automationId,
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
  async deleteStep(automationId: string, stepId: string): Promise<void> {
    const automation = await this.findById(automationId);

    if (automation.active) {
      throw new BadRequestException('Cannot delete steps from active automation');
    }

    const step = automation.steps.find(s => s.id === stepId);
    if (!step) {
      throw new NotFoundException('Step not found');
    }

    try {
      await prisma.client.emailAutomationStep.delete({
        where: { id: stepId }
      });

      // Reorder remaining steps
      const remainingSteps = automation.steps
        .filter(s => s.id !== stepId)
        .sort((a, b) => a.order - b.order);

      for (let i = 0; i < remainingSteps.length; i++) {
        await prisma.client.emailAutomationStep.update({
          where: { id: remainingSteps[i].id },
          data: { order: i + 1 }
        });
      }

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_STEP_DELETED, {
        automationId,
        stepId
      });

      logger.info('Automation step deleted', { automationId, stepId });
    } catch (error) {
      logger.error('Failed to delete automation step', error as Error);
      throw error;
    }
  }

  /**
   * Manually enroll subscriber in automation
   */
  async enrollSubscriber(
    automationId: string,
    subscriberId: string
  ): Promise<any> {
    const automation = await this.findById(automationId);

    if (!automation.active) {
      throw new BadRequestException('Cannot enroll in inactive automation');
    }

    // Check if subscriber exists and is subscribed
    const subscriber = await prisma.client.emailListSubscriber.findFirst({
      where: {
        id: subscriberId,
        listId: automation.listId!,
        subscribed: true,
        confirmed: true
      }
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found or not active');
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
      throw new BadRequestException('Subscriber already enrolled in this automation');
    }

    try {
      const enrollment = await prisma.client.emailAutomationEnrollment.create({
        data: {
          automationId,
          subscriberId,
          status: 'active',
          currentStepId: automation.steps[0]?.id
        }
      });

      // Queue first step if exists
      if (automation.steps.length > 0) {
        const firstStep = automation.steps[0];
        const delay = this.calculateDelay(firstStep.delayAmount, firstStep.delayUnit);

        await queueService.addJob(
          'email-marketing',
          'process-automation-step',
          {
            enrollmentId: enrollment.id,
            stepId: firstStep.id
          },
          { delay }
        );
      }

      // Update automation stats
      await prisma.client.emailAutomation.update({
        where: { id: automationId },
        data: {
          totalEnrolled: { increment: 1 }
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_SUBSCRIBER_ENROLLED, {
        automationId,
        subscriberId,
        enrollmentId: enrollment.id
      });

      logger.info('Subscriber enrolled in automation', {
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
   * Unenroll subscriber from automation
   */
  async unenrollSubscriber(
    automationId: string,
    subscriberId: string
  ): Promise<void> {
    const enrollment = await prisma.client.emailAutomationEnrollment.findUnique({
      where: {
        automationId_subscriberId: {
          automationId,
          subscriberId
        }
      }
    });

    if (!enrollment || enrollment.status !== 'active') {
      throw new NotFoundException('Active enrollment not found');
    }

    try {
      await prisma.client.emailAutomationEnrollment.update({
        where: { id: enrollment.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date()
        }
      });

      await eventBus.emit(EmailMarketingEvents.AUTOMATION_SUBSCRIBER_UNENROLLED, {
        automationId,
        subscriberId,
        enrollmentId: enrollment.id
      });

      logger.info('Subscriber unenrolled from automation', {
        automationId,
        subscriberId
      });
    } catch (error) {
      logger.error('Failed to unenroll subscriber', error as Error);
      throw error;
    }
  }

  /**
   * Get automation enrollments
   */
  async getEnrollments(
    automationId: string,
    query: EnrollmentQueryDto
  ): Promise<any> {
    await this.findById(automationId);

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
   * Get automation statistics
   */
  async getStats(automationId: string): Promise<any> {
    const automation = await this.findById(automationId);

    const [
      activeEnrollments,
      completedEnrollments,
      cancelledEnrollments,
      stepStats
    ] = await Promise.all([
      prisma.client.emailAutomationEnrollment.count({
        where: { automationId, status: 'active' }
      }),
      prisma.client.emailAutomationEnrollment.count({
        where: { automationId, status: 'completed' }
      }),
      prisma.client.emailAutomationEnrollment.count({
        where: { automationId, status: 'cancelled' }
      }),
      this.getStepStats(automationId)
    ]);

    return {
      totalEnrolled: automation.totalEnrolled,
      activeEnrollments,
      completedEnrollments,
      cancelledEnrollments,
      completionRate: automation.totalEnrolled > 0
        ? (completedEnrollments / automation.totalEnrolled) * 100
        : 0,
      steps: stepStats
    };
  }

  /**
   * Trigger automation manually
   */
  async trigger(data: TriggerAutomationDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const automation = await prisma.client.emailAutomation.findFirst({
      where: {
        id: data.automationId,
        tenantId,
        active: true
      }
    });

    if (!automation) {
      throw new NotFoundException('Active automation not found');
    }

    // Queue trigger processing
    const job = await queueService.addJob(
      'email-marketing',
      'trigger-automation',
      {
        automationId: automation.id,
        triggerData: data.triggerData
      }
    );

    logger.info('Automation triggered manually', {
      automationId: automation.id,
      jobId: job.id
    });

    return {
      message: 'Automation triggered',
      jobId: job.id
    };
  }

  /**
   * Register automation triggers
   */
  private async registerTriggers(automation: any): Promise<void> {
    switch (automation.trigger) {
      case EmailAutomationTrigger.USER_SIGNUP:
        // Listen to user signup events
        eventBus.on('user.registered', async (data) => {
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
    if (data.listId === automation.listId) {
      await this.enrollSubscriber(automation.id, data.subscriberId);
    }
  }

  /**
   * Handle tag added trigger
   */
  private async handleTagAddedTrigger(automation: any, data: any): Promise<void> {
    const requiredTags = automation.triggerConfig.tags || [];
    const hasAllTags = requiredTags.every(tag => data.tags.includes(tag));

    if (hasAllTags) {
      await this.enrollSubscriber(automation.id, data.subscriberId);
    }
  }

  /**
   * Handle custom event trigger
   */
  private async handleCustomEventTrigger(automation: any, data: any): Promise<void> {
    // Match event data with automation criteria
    const criteria = automation.triggerConfig.criteria || {};

    // Simple matching logic - could be more sophisticated
    const matches = Object.keys(criteria).every(key => {
      return data[key] === criteria[key];
    });

    if (matches && data.subscriberId) {
      await this.enrollSubscriber(automation.id, data.subscriberId);
    }
  }

  /**
   * Calculate delay in milliseconds
   */
  private calculateDelay(amount: number, unit: string): number {
    switch (unit) {
      case 'minutes':
        return amount * 60 * 1000;
      case 'hours':
        return amount * 60 * 60 * 1000;
      case 'days':
        return amount * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }

  /**
   * Get step statistics
   */
  private async getStepStats(automationId: string): Promise<any[]> {
    const steps = await prisma.client.emailAutomationStep.findMany({
      where: { automationId },
      orderBy: { order: 'asc' }
    });

    const stats = [];

    for (const step of steps) {
      // Get email campaign stats for this step
      const sentCount = await prisma.client.emailActivity.count({
        where: {
          type: 'sent',
          metadata: {
            path: ['automationStepId'],
            equals: step.id
          }
        }
      });

      const openCount = await prisma.client.emailActivity.count({
        where: {
          type: 'opened',
          metadata: {
            path: ['automationStepId'],
            equals: step.id
          }
        }
      });

      const clickCount = await prisma.client.emailActivity.count({
        where: {
          type: 'clicked',
          metadata: {
            path: ['automationStepId'],
            equals: step.id
          }
        }
      });

      stats.push({
        stepId: step.id,
        name: step.name,
        order: step.order,
        sent: sentCount,
        opened: openCount,
        clicked: clickCount,
        openRate: sentCount > 0 ? (openCount / sentCount) * 100 : 0,
        clickRate: sentCount > 0 ? (clickCount / sentCount) * 100 : 0
      });
    }

    return stats;
  }
}