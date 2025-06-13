import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { QueueService } from '@/shared/queue/queue.service';
import { AppError } from '@/shared/exceptions';
import { logger } from '@/shared/logger';
import {
  EmailAutomation,
  EmailAutomationStep,
  EmailAutomationTrigger,
  EmailAutomationEnrollment,
  Prisma
} from '@prisma/client';
import {
  CreateAutomationDTO,
  UpdateAutomationDTO,
  CreateAutomationStepDTO,
  AutomationFiltersDTO
} from '../dto/email-automation.dto';
import { EmailDeliveryService } from './email-delivery.service';

export interface AutomationWithSteps extends EmailAutomation {
  steps: EmailAutomationStep[];
  _count?: {
    enrollments: number;
  };
}

@Injectable()
export class EmailAutomationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly redis: RedisService,
    private readonly queue: QueueService,
    private readonly deliveryService: EmailDeliveryService
  ) {
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for automation triggers
   */
  private setupEventListeners(): void {
    // User signup trigger
    this.eventBus.on('user.created', async (data) => {
      await this.handleTrigger(EmailAutomationTrigger.USER_SIGNUP, data);
    });

    // List subscription trigger
    this.eventBus.on('email.subscriber.confirmed', async (data) => {
      await this.handleTrigger(EmailAutomationTrigger.LIST_SUBSCRIBE, data);
    });

    // Custom event trigger
    this.eventBus.on('automation.custom', async (data) => {
      await this.handleTrigger(EmailAutomationTrigger.CUSTOM_EVENT, data);
    });
  }

  /**
   * Create a new automation workflow
   */
  async createAutomation(
    tenantId: string,
    data: CreateAutomationDTO
  ): Promise<EmailAutomation> {
    // Validate list if provided
    if (data.listId) {
      const list = await this.prisma.emailList.findFirst({
        where: {
          id: data.listId,
          tenantId,
          deletedAt: null
        }
      });

      if (!list) {
        throw new AppError('Email list not found', 404);
      }
    }

    const automation = await this.prisma.emailAutomation.create({
      data: {
        tenantId,
        ...data
      }
    });

    await this.eventBus.emit('email.automation.created', {
      tenantId,
      automationId: automation.id,
      name: automation.name,
      trigger: automation.trigger
    });

    logger.info('Email automation created', {
      tenantId,
      automationId: automation.id
    });

    return automation;
  }

  /**
   * Update an automation
   */
  async updateAutomation(
    tenantId: string,
    automationId: string,
    data: UpdateAutomationDTO
  ): Promise<EmailAutomation> {
    const automation = await this.getAutomation(tenantId, automationId);

    const updated = await this.prisma.emailAutomation.update({
      where: { id: automationId },
      data
    });

    await this.invalidateAutomationCache(automationId);

    await this.eventBus.emit('email.automation.updated', {
      tenantId,
      automationId,
      changes: data
    });

    return updated;
  }

  /**
   * Get automation with steps
   */
  async getAutomation(
    tenantId: string,
    automationId: string
  ): Promise<AutomationWithSteps> {
    const cacheKey = `email-automation:${automationId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const automation = await this.prisma.emailAutomation.findFirst({
      where: {
        id: automationId,
        tenantId
      },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!automation) {
      throw new AppError('Automation not found', 404);
    }

    await this.redis.set(cacheKey, automation, { ttl: 300 });

    return automation;
  }

  /**
   * List automations with filters
   */
  async listAutomations(
    tenantId: string,
    filters: AutomationFiltersDTO
  ): Promise<{
    automations: AutomationWithSteps[];
    total: number;
    page: number;
    pages: number;
  }> {
    const where: Prisma.EmailAutomationWhereInput = {
      tenantId,
      ...(filters.trigger && { trigger: filters.trigger }),
      ...(filters.active !== undefined && { active: filters.active }),
      ...(filters.listId && { listId: filters.listId }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    };

    const [automations, total] = await Promise.all([
      this.prisma.emailAutomation.findMany({
        where,
        include: {
          steps: {
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              enrollments: true
            }
          }
        },
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc'
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit
      }),
      this.prisma.emailAutomation.count({ where })
    ]);

    return {
      automations,
      total,
      page: filters.page,
      pages: Math.ceil(total / filters.limit)
    };
  }

  /**
   * Add a step to an automation
   */
  async addStep(
    tenantId: string,
    automationId: string,
    data: CreateAutomationStepDTO
  ): Promise<EmailAutomationStep> {
    const automation = await this.getAutomation(tenantId, automationId);

    // Reorder existing steps if necessary
    if (data.order !== undefined) {
      await this.prisma.emailAutomationStep.updateMany({
        where: {
          automationId,
          order: { gte: data.order }
        },
        data: {
          order: { increment: 1 }
        }
      });
    }

    const step = await this.prisma.emailAutomationStep.create({
      data: {
        automationId,
        ...data
      }
    });

    await this.invalidateAutomationCache(automationId);

    await this.eventBus.emit('email.automation.step.added', {
      tenantId,
      automationId,
      stepId: step.id,
      name: step.name
    });

    return step;
  }

  /**
   * Update an automation step
   */
  async updateStep(
    tenantId: string,
    automationId: string,
    stepId: string,
    data: Partial<CreateAutomationStepDTO>
  ): Promise<EmailAutomationStep> {
    await this.getAutomation(tenantId, automationId);

    const step = await this.prisma.emailAutomationStep.update({
      where: {
        id: stepId,
        automationId
      },
      data
    });

    await this.invalidateAutomationCache(automationId);

    return step;
  }

  /**
   * Delete an automation step
   */
  async deleteStep(
    tenantId: string,
    automationId: string,
    stepId: string
  ): Promise<void> {
    await this.getAutomation(tenantId, automationId);

    const step = await this.prisma.emailAutomationStep.delete({
      where: {
        id: stepId,
        automationId
      }
    });

    // Reorder remaining steps
    await this.prisma.emailAutomationStep.updateMany({
      where: {
        automationId,
        order: { gt: step.order }
      },
      data: {
        order: { decrement: 1 }
      }
    });

    await this.invalidateAutomationCache(automationId);
  }

  /**
   * Activate an automation
   */
  async activateAutomation(
    tenantId: string,
    automationId: string
  ): Promise<void> {
    const automation = await this.getAutomation(tenantId, automationId);

    if (automation.steps.length === 0) {
      throw new AppError('Cannot activate automation without steps', 400);
    }

    await this.prisma.emailAutomation.update({
      where: { id: automationId },
      data: { active: true }
    });

    await this.invalidateAutomationCache(automationId);

    // Schedule date-based triggers
    if (automation.trigger === EmailAutomationTrigger.DATE_BASED) {
      await this.scheduleDateBasedAutomation(automation);
    }

    await this.eventBus.emit('email.automation.activated', {
      tenantId,
      automationId
    });
  }

  /**
   * Deactivate an automation
   */
  async deactivateAutomation(
    tenantId: string,
    automationId: string
  ): Promise<void> {
    await this.getAutomation(tenantId, automationId);

    await this.prisma.emailAutomation.update({
      where: { id: automationId },
      data: { active: false }
    });

    await this.invalidateAutomationCache(automationId);

    // Cancel scheduled jobs
    await this.queue.removeJobs('email:automation:process', {
      automationId
    });

    await this.eventBus.emit('email.automation.deactivated', {
      tenantId,
      automationId
    });
  }

  /**
   * Enroll a subscriber in an automation
   */
  async enrollSubscriber(
    automationId: string,
    subscriberId: string,
    metadata?: any
  ): Promise<EmailAutomationEnrollment> {
    // Check if already enrolled
    const existing = await this.prisma.emailAutomationEnrollment.findUnique({
      where: {
        automationId_subscriberId: {
          automationId,
          subscriberId
        }
      }
    });

    if (existing && existing.status === 'active') {
      throw new AppError('Subscriber already enrolled in this automation', 409);
    }

    const enrollment = await this.prisma.emailAutomationEnrollment.upsert({
      where: {
        automationId_subscriberId: {
          automationId,
          subscriberId
        }
      },
      create: {
        automationId,
        subscriberId,
        status: 'active',
        metadata
      },
      update: {
        status: 'active',
        enrolledAt: new Date(),
        completedAt: null,
        cancelledAt: null,
        metadata
      }
    });

    // Update automation stats
    await this.prisma.emailAutomation.update({
      where: { id: automationId },
      data: {
        totalEnrolled: { increment: 1 }
      }
    });

    // Process first step immediately
    await this.processNextStep(enrollment.id);

    await this.eventBus.emit('email.automation.enrolled', {
      automationId,
      subscriberId,
      enrollmentId: enrollment.id
    });

    return enrollment;
  }

  /**
   * Cancel an enrollment
   */
  async cancelEnrollment(
    enrollmentId: string
  ): Promise<void> {
    const enrollment = await this.prisma.emailAutomationEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date()
      }
    });

    // Cancel scheduled jobs
    await this.queue.removeJobs('email:automation:step', {
      enrollmentId
    });

    await this.eventBus.emit('email.automation.cancelled', {
      automationId: enrollment.automationId,
      subscriberId: enrollment.subscriberId,
      enrollmentId
    });
  }

  /**
   * Process the next step in an automation
   */
  async processNextStep(
    enrollmentId: string
  ): Promise<void> {
    const enrollment = await this.prisma.emailAutomationEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        automation: {
          include: {
            steps: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!enrollment || enrollment.status !== 'active') {
      return;
    }

    // Find next step
    const currentStepIndex = enrollment.currentStepId
      ? enrollment.automation.steps.findIndex(s => s.id === enrollment.currentStepId)
      : -1;

    const nextStep = enrollment.automation.steps[currentStepIndex + 1];

    if (!nextStep) {
      // Automation completed
      await this.completeEnrollment(enrollmentId);
      return;
    }

    // Check conditions
    if (nextStep.conditions) {
      const meetsConditions = await this.evaluateConditions(
        enrollment.subscriberId,
        nextStep.conditions as any
      );

      if (!meetsConditions) {
        // Skip to next step
        await this.prisma.emailAutomationEnrollment.update({
          where: { id: enrollmentId },
          data: { currentStepId: nextStep.id }
        });

        await this.processNextStep(enrollmentId);
        return;
      }
    }

    // Schedule step execution
    const delayMs = this.calculateDelay(
      nextStep.delayAmount,
      nextStep.delayUnit
    );

    if (delayMs > 0) {
      await this.queue.add(
        'email:automation:step',
        {
          enrollmentId,
          stepId: nextStep.id
        },
        {
          delay: delayMs,
          jobId: `automation_step_${enrollmentId}_${nextStep.id}`
        }
      );
    } else {
      await this.executeStep(enrollmentId, nextStep.id);
    }

    // Update current step
    await this.prisma.emailAutomationEnrollment.update({
      where: { id: enrollmentId },
      data: { currentStepId: nextStep.id }
    });
  }

  /**
   * Execute an automation step
   */
  async executeStep(
    enrollmentId: string,
    stepId: string
  ): Promise<void> {
    const step = await this.prisma.emailAutomationStep.findUnique({
      where: { id: stepId },
      include: {
        automation: true,
        template: true
      }
    });

    if (!step) {
      return;
    }

    const enrollment = await this.prisma.emailAutomationEnrollment.findUnique({
      where: { id: enrollmentId }
    });

    if (!enrollment || enrollment.status !== 'active') {
      return;
    }

    // Get subscriber
    const subscriber = await this.prisma.emailListSubscriber.findUnique({
      where: { id: enrollment.subscriberId }
    });

    if (!subscriber || !subscriber.subscribed) {
      await this.cancelEnrollment(enrollmentId);
      return;
    }

    // Send email
    try {
      await this.deliveryService.sendAutomationEmail(
        step,
        subscriber,
        enrollment.metadata
      );

      await this.eventBus.emit('email.automation.step.sent', {
        automationId: step.automationId,
        stepId: step.id,
        subscriberId: subscriber.id,
        email: subscriber.email
      });

      // Process next step
      await this.processNextStep(enrollmentId);
    } catch (error) {
      logger.error('Failed to send automation email', {
        enrollmentId,
        stepId,
        error
      });

      // Retry logic could be implemented here
    }
  }

  /**
   * Complete an enrollment
   */
  private async completeEnrollment(
    enrollmentId: string
  ): Promise<void> {
    const enrollment = await this.prisma.emailAutomationEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    });

    // Update automation stats
    await this.prisma.emailAutomation.update({
      where: { id: enrollment.automationId },
      data: {
        totalCompleted: { increment: 1 }
      }
    });

    await this.eventBus.emit('email.automation.completed', {
      automationId: enrollment.automationId,
      subscriberId: enrollment.subscriberId,
      enrollmentId
    });
  }

  /**
   * Handle automation triggers
   */
  private async handleTrigger(
    trigger: EmailAutomationTrigger,
    data: any
  ): Promise<void> {
    // Find active automations with this trigger
    const automations = await this.prisma.emailAutomation.findMany({
      where: {
        trigger,
        active: true
      }
    });

    for (const automation of automations) {
      try {
        // Check trigger config matches
        if (this.matchesTriggerConfig(automation.triggerConfig as any, data)) {
          // Find subscriber
          let subscriberId: string | null = null;

          if (trigger === EmailAutomationTrigger.LIST_SUBSCRIBE) {
            subscriberId = data.subscriberId;
          } else if (trigger === EmailAutomationTrigger.USER_SIGNUP && data.email) {
            const subscriber = await this.prisma.emailListSubscriber.findFirst({
              where: {
                email: data.email,
                listId: automation.listId!
              }
            });
            subscriberId = subscriber?.id || null;
          }

          if (subscriberId) {
            await this.enrollSubscriber(
              automation.id,
              subscriberId,
              data
            );
          }
        }
      } catch (error) {
        logger.error('Failed to handle automation trigger', {
          automationId: automation.id,
          trigger,
          error
        });
      }
    }
  }

  /**
   * Check if data matches trigger configuration
   */
  private matchesTriggerConfig(
    config: any,
    data: any
  ): boolean {
    // Implementation would check specific trigger conditions
    // For example, list ID for LIST_SUBSCRIBE trigger
    if (config.listId && data.listId) {
      return config.listId === data.listId;
    }

    if (config.eventName && data.eventName) {
      return config.eventName === data.eventName;
    }

    return true;
  }

  /**
   * Evaluate step conditions
   */
  private async evaluateConditions(
    subscriberId: string,
    conditions: any[]
  ): Promise<boolean> {
    // Implementation would evaluate conditions against subscriber data
    // This is a simplified version
    return true;
  }

  /**
   * Calculate delay in milliseconds
   */
  private calculateDelay(
    amount: number,
    unit: string
  ): number {
    const multipliers: Record<string, number> = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000
    };

    return amount * (multipliers[unit] || 0);
  }

  /**
   * Schedule date-based automation
   */
  private async scheduleDateBasedAutomation(
    automation: EmailAutomation
  ): Promise<void> {
    // Implementation would schedule based on date trigger config
    // For example, birthday emails, anniversary emails, etc.
    logger.info('Date-based automation scheduling not yet implemented', {
      automationId: automation.id
    });
  }

  /**
   * Invalidate automation cache
   */
  private async invalidateAutomationCache(
    automationId: string
  ): Promise<void> {
    await this.redis.delete(`email-automation:${automationId}`);
  }
}
