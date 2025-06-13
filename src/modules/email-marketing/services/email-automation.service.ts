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
  Prisma,
  EmailAutomationStatus,
  EmailAutomationDelayUnit,
  EmailAutomationAction,
} from '@prisma/client';
import {
  CreateAutomationDTO,
  UpdateAutomationDTO,
  CreateAutomationStepDTO,
  AutomationFiltersDTO,
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
    private readonly deliveryService: EmailDeliveryService,
  ) {
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for automation triggers
   */
  private setupEventListeners(): void {
    // User signup trigger
    this.eventBus.on('user.created', async data => {
      await this.handleTrigger(EmailAutomationTrigger.USER_SIGNUP, data);
    });

    // List subscription trigger
    this.eventBus.on('email.subscriber.confirmed', async data => {
      await this.handleTrigger(EmailAutomationTrigger.LIST_SUBSCRIBE, data);
    });

    // Custom event trigger
    this.eventBus.on('automation.custom', async data => {
      await this.handleTrigger(EmailAutomationTrigger.CUSTOM_EVENT, data);
    });
  }

  /**
   * Create a new automation workflow
   */
  async createAutomation(tenantId: string, data: CreateAutomationDTO): Promise<EmailAutomation> {
    // Validate list if provided
    if (data.listId) {
      const list = await this.prisma.client.emailList.findFirst({
        where: {
          id: data.listId,
          tenantId,
          deletedAt: null,
        },
      });

      if (!list) {
        throw new AppError('Email list not found', 404);
      }
    }

    const automation = await this.prisma.client.emailAutomation.create({
      data: {
        tenant: { connect: { id: tenantId } }, // Use relation instead of direct tenantId
        name: data.name || 'Untitled Automation',
        description: data.description || null,
        list: data.listId ? { connect: { id: data.listId } } : undefined,
        trigger: data.trigger || EmailAutomationTrigger.LIST_SUBSCRIBE,
        triggerConfig: data.triggerConfig || {},
        active: data.active ?? false,
        metadata: data.metadata || null,
      },
    });

    await this.eventBus.emit('email.automation.created', {
      tenantId,
      automationId: automation.id,
      name: automation.name,
      trigger: automation.trigger,
    });

    logger.info('Email automation created', {
      tenantId,
      automationId: automation.id,
    });

    return automation;
  }

  /**
   * Update an automation
   */
  async updateAutomation(tenantId: string, automationId: string, data: UpdateAutomationDTO): Promise<EmailAutomation> {
    const automation = await this.getAutomation(tenantId, automationId);

    const updated = await this.prisma.client.emailAutomation.update({
      where: { id: automationId },
      data,
    });

    await this.invalidateAutomationCache(automationId);

    await this.eventBus.emit('email.automation.updated', {
      tenantId,
      automationId,
      changes: data,
    });

    return updated;
  }

  /**
   * Get automation with steps
   */
  async getAutomation(tenantId: string, automationId: string): Promise<AutomationWithSteps> {
    const cacheKey = `email-automation:${automationId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const automation = await this.prisma.client.emailAutomation.findFirst({
      where: {
        id: automationId,
        tenantId,
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
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
    filters: AutomationFiltersDTO,
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
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [automations, total] = await Promise.all([
      this.prisma.client.emailAutomation.findMany({
        where,
        include: {
          steps: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      this.prisma.client.emailAutomation.count({ where }),
    ]);

    return {
      automations,
      total,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    };
  }

  /**
   * Add a step to an automation
   */
  private async addStep(tenantId: string, automationId: string, data: CreateAutomationStepDTO): Promise<EmailAutomationStep> {
    const automation = await this.getAutomation(tenantId, automationId);

    // Reorder existing steps if necessary
    if (data.order !== undefined) {
      await this.prisma.client.emailAutomationStep.updateMany({
        where: {
          automationId,
          order: { gte: data.order },
        },
        data: {
          order: { increment: 1 },
        },
      });
    }

    const step = await this.prisma.client.emailAutomationStep.create({
      data: {
        automation: { connect: { id: automationId } }, // Use relation instead of direct automationId
        name: data.name || 'Untitled Step',
        subject: data.subject || null,
        template: data.templateId ? { connect: { id: data.templateId } } : undefined,
        htmlContent: data.htmlContent || null,
        textContent: data.textContent || null,
        conditions: data.conditions || [],
        order: data.order !== undefined ? data.order : 0,
        delayAmount: data.delayAmount || 0,
        delayUnit: data.delayUnit || EmailAutomationDelayUnit.HOURS,
        action: data.action || EmailAutomationAction.SEND_EMAIL,
        actionConfig: data.actionConfig || {},
        metadata: data.metadata || null,
      },
    });

    await this.invalidateAutomationCache(automationId);

    await this.eventBus.emit('email.automation.step.added', {
      tenantId,
      automationId,
      stepId: step.id,
      name: step.name,
    });

    return step;
  }

  /**
   * Update an automation step
   */
  private async updateStep(
    tenantId: string,
    automationId: string,
    stepId: string,
    data: Partial<CreateAutomationStepDTO>,
  ): Promise<EmailAutomationStep> {
    await this.getAutomation(tenantId, automationId);

    const step = await this.prisma.client.emailAutomationStep.update({
      where: {
        id: stepId,
        automationId,
      },
      data,
    });

    await this.invalidateAutomationCache(automationId);

    return step;
  }

  /**
   * Delete an automation step
   */
  private async deleteStep(tenantId: string, automationId: string, stepId: string): Promise<void> {
    await this.getAutomation(tenantId, automationId);

    const step = await this.prisma.client.emailAutomationStep.delete({
      where: {
        id: stepId,
        automationId,
      },
    });

    // Reorder remaining steps
    await this.prisma.client.emailAutomationStep.updateMany({
      where: {
        automationId,
        order: { gt: step.order },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    await this.invalidateAutomationCache(automationId);
  }

  /**
   * Activate an automation
   */
  async activateAutomation(tenantId: string, automationId: string): Promise<EmailAutomation> {
    const automation = await this.getAutomation(tenantId, automationId);

    if (automation.steps.length === 0) {
      throw new AppError('Cannot activate automation without steps', 400);
    }

    const updatedAutomation = await this.prisma.client.emailAutomation.update({
      where: { id: automationId },
      data: { active: true },
    });

    await this.invalidateAutomationCache(automationId);

    // Schedule date-based triggers
    if (automation.trigger === EmailAutomationTrigger.DATE_BASED) {
      await this.scheduleDateBasedAutomation(automation);
    }

    await this.eventBus.emit('email.automation.activated', {
      tenantId,
      automationId,
    });

    return updatedAutomation;
  }

  /**
   * Deactivate an automation
   */
  async deactivateAutomation(tenantId: string, automationId: string): Promise<EmailAutomation> {
    await this.getAutomation(tenantId, automationId);

    const updatedAutomation = await this.prisma.client.emailAutomation.update({
      where: { id: automationId },
      data: { active: false },
    });

    await this.invalidateAutomationCache(automationId);

    // Cancel scheduled jobs
    await this.queue.removeJobs('email:automation:process', {
      automationId,
    });

    await this.eventBus.emit('email.automation.deactivated', {
      tenantId,
      automationId,
    });

    return updatedAutomation;
  }

  /**
   * Enroll a subscriber in an automation
   */
  async enrollSubscriber(
    automationId: string,
    subscriberId: string,
    metadata?: any,
  ): Promise<EmailAutomationEnrollment> {
    // Check if already enrolled
    const existing = await this.prisma.client.emailAutomationEnrollment.findUnique({
      where: {
        automationId_subscriberId: {
          automationId,
          subscriberId,
        },
      },
    });

    if (existing && existing.status === EmailAutomationStatus.ACTIVE) {
      throw new AppError('Subscriber already enrolled in this automation', 409);
    }

    const enrollment = await this.prisma.client.emailAutomationEnrollment.upsert({
      where: {
        automationId_subscriberId: {
          automationId,
          subscriberId,
        },
      },
      create: {
        automationId,
        subscriberId,
        status: EmailAutomationStatus.ACTIVE,
        metadata,
      },
      update: {
        status: EmailAutomationStatus.ACTIVE,
        enrolledAt: new Date(),
        completedAt: null,
        cancelledAt: null,
        metadata,
      },
    });

    // Update automation stats
    await this.prisma.client.emailAutomation.update({
      where: { id: automationId },
      data: {
        totalEnrolled: { increment: 1 },
      },
    });

    // Process first step immediately
    await this.processNextStep(enrollment.id);

    await this.eventBus.emit('email.automation.enrolled', {
      automationId,
      subscriberId,
      enrollmentId: enrollment.id,
    });

    return enrollment;
  }

  /**
   * Cancel an enrollment
   */
  async cancelEnrollment(enrollmentId: string): Promise<void> {
    const enrollment = await this.prisma.client.emailAutomationEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: EmailAutomationStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    // Cancel scheduled jobs
    await this.queue.removeJobs('email:automation:step', {
      enrollmentId,
    });

    await this.eventBus.emit('email.automation.cancelled', {
      automationId: enrollment.automationId,
      subscriberId: enrollment.subscriberId,
      enrollmentId,
    });
  }

  /**
   * Process the next step in an automation
   */
  async processNextStep(enrollmentId: string): Promise<void> {
    const enrollment = await this.prisma.client.emailAutomationEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        automation: {
          include: {
            steps: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!enrollment || enrollment.status !== EmailAutomationStatus.ACTIVE) {
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
      const meetsConditions = await this.evaluateConditionsForSubscriber(enrollment.subscriberId, nextStep.conditions as any);

      if (!meetsConditions) {
        // Skip to next step
        await this.prisma.client.emailAutomationEnrollment.update({
          where: { id: enrollmentId },
          data: { currentStepId: nextStep.id },
        });

        await this.processNextStep(enrollmentId);
        return;
      }
    }

    // Schedule step execution
    const delayMs = this.calculateDelay(nextStep.delayAmount, nextStep.delayUnit);

    if (delayMs > 0) {
      await this.queue.add(
        'email:automation:step',
        {
          enrollmentId,
          stepId: nextStep.id,
        },
        {
          delay: delayMs,
          jobId: `automation_step_${enrollmentId}_${nextStep.id}`,
        },
      );
    } else {
      await this.executeStep(enrollmentId, nextStep.id);
    }

    // Update current step
    await this.prisma.client.emailAutomationEnrollment.update({
      where: { id: enrollmentId },
      data: { currentStepId: nextStep.id },
    });
  }

  /**
   * Execute an automation step
   */
  async executeStep(enrollmentId: string, stepId: string): Promise<void> {
    const step = await this.prisma.client.emailAutomationStep.findUnique({
      where: { id: stepId },
      include: {
        automation: true,
        template: true,
      },
    });

    if (!step) {
      return;
    }

    const enrollment = await this.prisma.client.emailAutomationEnrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment || enrollment.status !== EmailAutomationStatus.ACTIVE) {
      return;
    }

    // Get subscriber
    const subscriber = await this.prisma.client.emailListSubscriber.findUnique({
      where: { id: enrollment.subscriberId },
    });

    if (!subscriber || !subscriber.subscribed) {
      await this.cancelEnrollment(enrollmentId);
      return;
    }

    // Send email
    try {
      await this.deliveryService.sendAutomationEmail(step, subscriber, enrollment.metadata);

      await this.eventBus.emit('email.automation.step.sent', {
        automationId: step.automationId,
        stepId: step.id,
        subscriberId: subscriber.id,
        email: subscriber.email,
      });

      // Process next step
      await this.processNextStep(enrollmentId);
    } catch (error) {
      logger.error('Failed to send automation email', {
        enrollmentId,
        stepId,
        error,
      });

      // Retry logic could be implemented here
    }
  }

  /**
   * Check if data matches trigger configuration
   */
  private matchesTriggerConfig(config: any, data: any): boolean {
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
   * Evaluate step conditions for a specific subscriber
   * @deprecated Use the more general evaluateConditions(data, conditions) instead
   */
  private async evaluateConditionsForSubscriber(subscriberId: string, conditions: any[]): Promise<boolean> {
    // Get subscriber data
    const subscriber = await this.prisma.client.emailListSubscriber.findUnique({
      where: { id: subscriberId },
    });

    if (!subscriber) {
      return false;
    }

    // Use the general condition evaluator with subscriber data
    return this.evaluateConditions(subscriber, conditions);
  }

  /**
   * Calculate delay in milliseconds
   */
  private calculateDelay(amount: number, unit: string): number {
    const multipliers: Record<string, number> = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    };

    return amount * (multipliers[unit] || 0);
  }

  /**
   * Invalidate automation cache
   */
  private async invalidateAutomationCache(automationId: string): Promise<void> {
    await this.redis.delete(`email-automation:${automationId}`);
  }

  /**
   * Get automations with pagination and filtering
   */
  async getAutomations(
    tenantId: string,
    filters: AutomationFiltersDTO
  ): Promise<{
    automations: AutomationWithSteps[];
    total: number;
    page: number;
    pages: number;
  }> {
    return this.listAutomations(tenantId, filters);
  }

  /**
   * Delete an automation
   */
  async deleteAutomation(tenantId: string, automationId: string): Promise<void> {
    const automation = await this.getAutomation(tenantId, automationId);

    // First deactivate if active
    if (automation.active) {
      await this.deactivateAutomation(tenantId, automationId);
    }

    // Delete all steps
    await this.prisma.client.emailAutomationStep.deleteMany({
      where: { automationId },
    });

    // Delete all enrollments
    await this.prisma.client.emailAutomationEnrollment.deleteMany({
      where: { automationId },
    });

    // Delete the automation
    await this.prisma.client.emailAutomation.delete({
      where: { id: automationId },
    });

    await this.invalidateAutomationCache(automationId);

    await this.eventBus.emit('email.automation.deleted', {
      tenantId,
      automationId,
    });

    logger.info('Email automation deleted', {
      tenantId,
      automationId,
    });
  }

  /**
   * Add a step to an automation
   */
  async addAutomationStep(
    tenantId: string,
    automationId: string,
    data: CreateAutomationStepDTO
  ): Promise<EmailAutomationStep> {
    return this.addStep(tenantId, automationId, data);
  }

  /**
   * Update an automation step
   */
  async updateAutomationStep(
    tenantId: string,
    automationId: string,
    stepId: string,
    data: CreateAutomationStepDTO
  ): Promise<EmailAutomationStep> {
    return this.updateStep(tenantId, automationId, stepId, data);
  }

  /**
   * Delete an automation step
   */
  async deleteAutomationStep(
    tenantId: string,
    automationId: string,
    stepId: string
  ): Promise<void> {
    return this.deleteStep(tenantId, automationId, stepId);
  }

  /**
   * Enroll a subscriber in an automation with tenant context
   */
  async enrollSubscriberWithTenant(
    tenantId: string,
    automationId: string,
    subscriberId: string,
    metadata?: any
  ): Promise<EmailAutomationEnrollment> {
    // Verify automation belongs to tenant
    await this.getAutomation(tenantId, automationId);

    // Verify subscriber exists
    const subscriber = await this.prisma.client.emailListSubscriber.findUnique({
      where: { id: subscriberId },
    });

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    return this.enrollSubscriber(automationId, subscriberId, metadata);
  }

  /**
   * Get automation analytics
   */
  async getAutomationAnalytics(
    tenantId: string,
    automationId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    overview: {
      totalEnrolled: number;
      completed: number;
      active: number;
      cancelled: number;
      completionRate: number;
      averageTimeToComplete: number; // in hours
    };
    steps: {
      stepId: string;
      name: string;
      order: number;
      delivered: number;
      opened: number;
      clicked: number;
      openRate: number;
      clickRate: number;
    }[];
    timeline: {
      date: string;
      enrolled: number;
      completed: number;
      cancelled: number;
    }[];
    performance: {
      averageOpenRate: number;
      averageClickRate: number;
      topPerformingStep: string;
      bottomPerformingStep: string;
    };
  }> {
    // Verify automation belongs to tenant
    const automation = await this.getAutomation(tenantId, automationId);

    // Default to last 30 days if no dates provided
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    // Get enrollments
    const enrollments = await this.prisma.client.emailAutomationEnrollment.findMany({
      where: {
        automationId,
        enrolledAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        subscriber: true,
      },
    });

    // Calculate overview metrics
    const completed = enrollments.filter(e => e.status === EmailAutomationStatus.COMPLETED).length;
    const active = enrollments.filter(e => e.status === EmailAutomationStatus.ACTIVE).length;
    const cancelled = enrollments.filter(e => e.status === EmailAutomationStatus.CANCELLED).length;
    const totalEnrolled = enrollments.length;

    // Calculate average time to complete
    const completedEnrollments = enrollments.filter(
      e => e.status === EmailAutomationStatus.COMPLETED && e.completedAt
    );

    let averageTimeToComplete = 0;
    if (completedEnrollments.length > 0) {
      const totalTimeMs = completedEnrollments.reduce((sum, e) => {
        return sum + (e.completedAt!.getTime() - e.enrolledAt.getTime());
      }, 0);
      averageTimeToComplete = totalTimeMs / completedEnrollments.length / (1000 * 60 * 60); // convert to hours
    }

    // Get step performance
    const stepPerformance = await Promise.all(
      automation.steps.map(async step => {
        // Count step runs with different statuses
        const deliveredCount = await this.prisma.client.emailAutomationStepRun.count({
          where: {
            stepId: step.id,
            executedAt: {
              gte: start,
              lte: end,
            },
            delivered: true
          }
        });

        const openedCount = await this.prisma.client.emailAutomationStepRun.count({
          where: {
            stepId: step.id,
            executedAt: {
              gte: start,
              lte: end,
            },
            opened: true
          }
        });

        const clickedCount = await this.prisma.client.emailAutomationStepRun.count({
          where: {
            stepId: step.id,
            executedAt: {
              gte: start,
              lte: end,
            },
            clicked: true
          }
        });

        const totalCount = await this.prisma.client.emailAutomationStepRun.count({
          where: {
            stepId: step.id,
            executedAt: {
              gte: start,
              lte: end,
            }
          }
        });

        const delivered = deliveredCount;
        const opened = openedCount;
        const clicked = clickedCount;

        return {
          stepId: step.id,
          name: step.name,
          order: step.order,
          delivered,
          opened,
          clicked,
          openRate: delivered > 0 ? opened / delivered : 0,
          clickRate: delivered > 0 ? clicked / delivered : 0,
        };
      })
    );

    // Calculate timeline data
    const enrollmentsByDay: { [date: string]: { enrolled: number; completed: number; cancelled: number } } = {};

    // Initialize all dates in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      enrollmentsByDay[dateStr] = { enrolled: 0, completed: 0, cancelled: 0 };
    }

    // Fill in enrollment data
    enrollments.forEach(enrollment => {
      const enrolledDateStr = enrollment.enrolledAt.toISOString().split('T')[0];
      if (enrollmentsByDay[enrolledDateStr]) {
        enrollmentsByDay[enrolledDateStr].enrolled++;
      }

      if (enrollment.completedAt) {
        const completedDateStr = enrollment.completedAt.toISOString().split('T')[0];
        if (enrollmentsByDay[completedDateStr]) {
          enrollmentsByDay[completedDateStr].completed++;
        }
      }

      if (enrollment.cancelledAt) {
        const cancelledDateStr = enrollment.cancelledAt.toISOString().split('T')[0];
        if (enrollmentsByDay[cancelledDateStr]) {
          enrollmentsByDay[cancelledDateStr].cancelled++;
        }
      }
    });

    // Calculate performance metrics
    const totalOpenRate = stepPerformance.reduce((sum, step) => sum + step.openRate, 0);
    const totalClickRate = stepPerformance.reduce((sum, step) => sum + step.clickRate, 0);
    const averageOpenRate = stepPerformance.length > 0 ? totalOpenRate / stepPerformance.length : 0;
    const averageClickRate = stepPerformance.length > 0 ? totalClickRate / stepPerformance.length : 0;

    // Find top and bottom performing steps
    let topPerformingStep = '';
    let bottomPerformingStep = '';

    if (stepPerformance.length > 0) {
      const sortedByEngagement = [...stepPerformance].sort(
        (a, b) => (b.openRate * 0.5 + b.clickRate * 0.5) - (a.openRate * 0.5 + a.clickRate * 0.5)
      );

      topPerformingStep = sortedByEngagement[0].name;
      bottomPerformingStep = sortedByEngagement[sortedByEngagement.length - 1].name;
    }

    return {
      overview: {
        totalEnrolled,
        completed,
        active,
        cancelled,
        completionRate: totalEnrolled > 0 ? completed / totalEnrolled : 0,
        averageTimeToComplete,
      },
      steps: stepPerformance,
      timeline: Object.entries(enrollmentsByDay).map(([date, data]) => ({
        date,
        ...data,
      })),
      performance: {
        averageOpenRate,
        averageClickRate,
        topPerformingStep,
        bottomPerformingStep,
      },
    };
  }

  /**
   * Handle automation trigger
   */
  private async handleTrigger(trigger: EmailAutomationTrigger, data: any): Promise<void> {
    // Find automations with this trigger
    const automations = await this.prisma.client.emailAutomation.findMany({
      where: {
        trigger,
        active: true,
      },
    });

    if (automations.length === 0) {
      return;
    }

    // Process each matching automation
    await Promise.all(
      automations.map(async automation => {
        try {
          // Check if there's a list filter
          if (automation.listId && data.listId && automation.listId !== data.listId) {
            return;
          }

          // Check if there are custom conditions in triggerConfig
          const conditions = (automation.triggerConfig as any)?.conditions;
          if (conditions) {
            const meetsConditions = await this.evaluateConditions(data, conditions);
            if (!meetsConditions) {
              return;
            }
          }

          // Find subscriber ID based on trigger type
          let subscriberId: string | null = null;

          if (trigger === EmailAutomationTrigger.LIST_SUBSCRIBE) {
            subscriberId = data.subscriberId;
          } else if (trigger === EmailAutomationTrigger.USER_SIGNUP && data.email) {
            const subscriber = await this.prisma.client.emailListSubscriber.findFirst({
              where: {
                email: data.email,
                listId: automation.listId!,
              },
            });
            subscriberId = subscriber?.id || null;
          } else {
            subscriberId = data.subscriberId || data.userId;
          }

          // Enroll the subscriber if found
          if (subscriberId) {
            await this.enrollSubscriber(automation.id, subscriberId, data);
          }

        } catch (error) {
          logger.error('Error processing automation trigger', {
            automationId: automation.id,
            trigger,
            error,
          });
        }
      })
    );
  }

  /**
   * Evaluate conditions for automation or step
   */
  private async evaluateConditions(data: any, conditions: any): Promise<boolean> {
    // Simple condition evaluation
    // In a real implementation, this would be more sophisticated
    if (!conditions || Object.keys(conditions).length === 0) {
      return true;
    }

    // Example: Check if user is in a segment
    if (conditions.segment && data.segments) {
      return data.segments.includes(conditions.segment);
    }

    // Example: Check if user has a specific tag
    if (conditions.tag && data.tags) {
      return data.tags.includes(conditions.tag);
    }

    // Example: Check custom field value
    if (conditions.field && conditions.value && data.customData) {
      return data.customData[conditions.field] === conditions.value;
    }

    return true;
  }

  /**
   * Schedule date-based automation
   */
  private async scheduleDateBasedAutomation(automation: AutomationWithSteps): Promise<void> {
    // Schedule job to process this automation daily
    await this.queue.add(
      'email:automation:process',
      {
        automationId: automation.id,
        type: 'date-based',
      },
      {
        repeat: {
          cron: '0 0 * * *', // Run daily at midnight
        },
        jobId: `automation:${automation.id}:date-based`,
      }
    );
  }

  /**
   * Complete an enrollment
   */
  private async completeEnrollment(enrollmentId: string): Promise<void> {
    const enrollment = await this.prisma.client.emailAutomationEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: EmailAutomationStatus.COMPLETED,
        completedAt: new Date(),
      },
      include: {
        automation: true,
        subscriber: true, // Use the correct relation name
      },
    });

    await this.eventBus.emit('email.automation.completed', {
      automationId: enrollment.automationId,
      subscriberId: enrollment.subscriberId,
      enrollmentId,
    });

    // Update automation stats
    await this.prisma.client.emailAutomation.update({
      where: { id: enrollment.automationId },
      data: {
        totalCompleted: { increment: 1 },
      },
    });
  }
}
