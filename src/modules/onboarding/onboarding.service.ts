import { Service } from 'typedi';
import { OnboardingFlow, OnboardingStep, OnboardingProgress } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { NotFoundException, BadRequestException } from '@shared/exceptions';

export interface OnboardingFlowTemplate {
  id: string;
  name: string;
  description: string;
  targetAudience: 'new_user' | 'new_tenant' | 'invited_member' | 'upgrade';
  steps: OnboardingStepTemplate[];
  metadata?: Record<string, any>;
}

export interface OnboardingStepTemplate {
  id: string;
  title: string;
  description: string;
  type: 'welcome' | 'profile' | 'tour' | 'task' | 'custom';
  order: number;
  required: boolean;
  content?: any;
  action?: {
    type: 'click' | 'input' | 'navigation' | 'api_call';
    target?: string;
    validation?: any;
  };
  skipCondition?: any;
  metadata?: Record<string, any>;
}

export interface OnboardingContext {
  userId: string;
  tenantId?: string;
  role?: string;
  plan?: string;
  source?: string;
  [key: string]: any;
}

@Service()
export class OnboardingService {
  private flowTemplates: Map<string, OnboardingFlowTemplate> = new Map();

  constructor(
    private eventBus: EventBus,
    private analyticsService: AnalyticsService,
  ) {
    this.initializeFlowTemplates();
  }

  /**
   * Initialize onboarding flow templates
   */
  private initializeFlowTemplates() {
    const templates: OnboardingFlowTemplate[] = [
      {
        id: 'new_user_basic',
        name: 'New User Onboarding',
        description: 'Basic onboarding flow for new users',
        targetAudience: 'new_user',
        steps: [
          {
            id: 'welcome',
            title: 'Welcome to Our Platform!',
            description: "Let's get you started with a quick tour",
            type: 'welcome',
            order: 1,
            required: true,
            content: {
              image: '/images/welcome.png',
              video: '/videos/welcome.mp4',
            },
          },
          {
            id: 'complete_profile',
            title: 'Complete Your Profile',
            description: 'Add your name and profile picture',
            type: 'profile',
            order: 2,
            required: true,
            action: {
              type: 'navigation',
              target: '/settings/profile',
            },
          },
          {
            id: 'create_first_project',
            title: 'Create Your First Project',
            description: 'Projects help you organize your work',
            type: 'task',
            order: 3,
            required: false,
            action: {
              type: 'navigation',
              target: '/projects/new',
            },
          },
          {
            id: 'invite_team',
            title: 'Invite Your Team',
            description: 'Collaborate with your team members',
            type: 'task',
            order: 4,
            required: false,
            action: {
              type: 'navigation',
              target: '/team/invite',
            },
            skipCondition: {
              plan: ['free'],
            },
          },
          {
            id: 'explore_features',
            title: 'Explore Key Features',
            description: 'Take a guided tour of our main features',
            type: 'tour',
            order: 5,
            required: false,
            content: {
              tour: [
                { element: '#dashboard', content: 'This is your dashboard' },
                { element: '#projects', content: 'Manage your projects here' },
                { element: '#analytics', content: 'View your analytics' },
              ],
            },
          },
        ],
      },
      {
        id: 'new_tenant',
        name: 'Organization Setup',
        description: 'Setup flow for new organizations',
        targetAudience: 'new_tenant',
        steps: [
          {
            id: 'org_details',
            title: 'Organization Details',
            description: 'Tell us about your organization',
            type: 'profile',
            order: 1,
            required: true,
            action: {
              type: 'navigation',
              target: '/organization/settings',
            },
          },
          {
            id: 'billing_setup',
            title: 'Setup Billing',
            description: 'Add your payment method',
            type: 'task',
            order: 2,
            required: true,
            action: {
              type: 'navigation',
              target: '/billing/setup',
            },
          },
          {
            id: 'invite_members',
            title: 'Invite Team Members',
            description: 'Add your team to the organization',
            type: 'task',
            order: 3,
            required: false,
            action: {
              type: 'navigation',
              target: '/organization/members/invite',
            },
          },
        ],
      },
    ];

    templates.forEach(template => {
      this.flowTemplates.set(template.id, template);
    });
  }

  /**
   * Start onboarding for user
   */
  async startOnboarding(userId: string, flowId: string, context?: OnboardingContext): Promise<OnboardingFlow> {
    const template = this.flowTemplates.get(flowId);
    if (!template) {
      throw new NotFoundException('Onboarding flow template not found');
    }

    // Check if user already has an active flow
    const existingFlow = await prisma.client.onboardingFlow.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
    });

    if (existingFlow) {
      return existingFlow;
    }

    // Create flow
    const flow = await prisma.client.onboardingFlow.create({
      data: {
        userId,
        flowTemplateId: flowId,
        status: 'IN_PROGRESS',
        context: context || {},
        totalSteps: template.steps.length,
        completedSteps: 0,
      },
    });

    // Create steps
    const steps = await Promise.all(
      template.steps.map(stepTemplate =>
        prisma.client.onboardingStep.create({
          data: {
            flowId: flow.id,
            stepId: stepTemplate.id,
            title: stepTemplate.title,
            description: stepTemplate.description,
            type: stepTemplate.type,
            order: stepTemplate.order,
            required: stepTemplate.required,
            status: 'PENDING',
            content: stepTemplate.content,
            action: stepTemplate.action,
            metadata: stepTemplate.metadata,
          },
        }),
      ),
    );

    // Track analytics
    await this.analyticsService.track({
      userId,
      event: 'onboarding.started',
      properties: {
        flowId,
        flowName: template.name,
        totalSteps: template.steps.length,
      },
    });

    logger.info('Onboarding started', { userId, flowId });

    await this.eventBus.emit('onboarding.started', {
      userId,
      flowId,
      timestamp: new Date(),
    });

    return flow;
  }

  /**
   * Get user's onboarding progress
   */
  async getProgress(userId: string): Promise<{
    flow: OnboardingFlow | null;
    steps: OnboardingStep[];
    progress: OnboardingProgress | null;
  }> {
    const flow = await prisma.client.onboardingFlow.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
    });

    if (!flow) {
      return {
        flow: null,
        steps: [],
        progress: null,
      };
    }

    const [steps, progress] = await Promise.all([
      prisma.client.onboardingStep.findMany({
        where: { flowId: flow.id },
        orderBy: { order: 'asc' },
      }),
      this.calculateProgress(flow.id),
    ]);

    return { flow, steps, progress };
  }

  /**
   * Complete onboarding step
   */
  async completeStep(userId: string, stepId: string, data?: any): Promise<void> {
    // Get active flow
    const flow = await prisma.client.onboardingFlow.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
    });

    if (!flow) {
      throw new NotFoundException('No active onboarding flow found');
    }

    // Get step
    const step = await prisma.client.onboardingStep.findFirst({
      where: {
        flowId: flow.id,
        stepId,
      },
    });

    if (!step) {
      throw new NotFoundException('Onboarding step not found');
    }

    if (step.status === 'COMPLETED') {
      return; // Already completed
    }

    // Update step
    await prisma.client.onboardingStep.update({
      where: { id: step.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        completionData: data,
      },
    });

    // Update flow progress
    const completedCount = await prisma.client.onboardingStep.count({
      where: {
        flowId: flow.id,
        status: 'COMPLETED',
      },
    });

    const allCompleted = completedCount === flow.totalSteps;
    const requiredCompleted = await this.checkRequiredStepsCompleted(flow.id);

    await prisma.client.onboardingFlow.update({
      where: { id: flow.id },
      data: {
        completedSteps: completedCount,
        ...(allCompleted && {
          status: 'COMPLETED',
          completedAt: new Date(),
        }),
      },
    });

    // Track analytics
    await this.analyticsService.track({
      userId,
      event: 'onboarding.step_completed',
      properties: {
        flowId: flow.flowTemplateId,
        stepId,
        stepOrder: step.order,
        stepsCompleted: completedCount,
        totalSteps: flow.totalSteps,
      },
    });

    // Clear cache
    await redis.delete(`onboarding:${userId}`);

    logger.info('Onboarding step completed', { userId, stepId });

    await this.eventBus.emit('onboarding.step_completed', {
      userId,
      flowId: flow.id,
      stepId,
      timestamp: new Date(),
    });

    // Check if onboarding is complete
    if (allCompleted || (requiredCompleted && flow.allowSkip)) {
      await this.completeOnboarding(userId, flow.id);
    }
  }

  /**
   * Skip onboarding step
   */
  async skipStep(userId: string, stepId: string): Promise<void> {
    const flow = await prisma.client.onboardingFlow.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
    });

    if (!flow) {
      throw new NotFoundException('No active onboarding flow found');
    }

    const step = await prisma.client.onboardingStep.findFirst({
      where: {
        flowId: flow.id,
        stepId,
      },
    });

    if (!step) {
      throw new NotFoundException('Onboarding step not found');
    }

    if (step.required) {
      throw new BadRequestException('Cannot skip required step');
    }

    await prisma.client.onboardingStep.update({
      where: { id: step.id },
      data: {
        status: 'SKIPPED',
        skippedAt: new Date(),
      },
    });

    // Track analytics
    await this.analyticsService.track({
      userId,
      event: 'onboarding.step_skipped',
      properties: {
        flowId: flow.flowTemplateId,
        stepId,
      },
    });
  }

  /**
   * Skip entire onboarding
   */
  async skipOnboarding(userId: string): Promise<void> {
    const flow = await prisma.client.onboardingFlow.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
    });

    if (!flow) {
      throw new NotFoundException('No active onboarding flow found');
    }

    await prisma.client.onboardingFlow.update({
      where: { id: flow.id },
      data: {
        status: 'SKIPPED',
        skippedAt: new Date(),
      },
    });

    // Track analytics
    await this.analyticsService.track({
      userId,
      event: 'onboarding.skipped',
      properties: {
        flowId: flow.flowTemplateId,
        stepsCompleted: flow.completedSteps,
        totalSteps: flow.totalSteps,
      },
    });

    await this.eventBus.emit('onboarding.skipped', {
      userId,
      flowId: flow.id,
      timestamp: new Date(),
    });
  }

  /**
   * Get onboarding checklist
   */
  async getChecklist(userId: string): Promise<{
    items: Array<{
      id: string;
      title: string;
      description: string;
      completed: boolean;
      required: boolean;
      action?: any;
    }>;
    progress: number;
  }> {
    const { flow, steps } = await this.getProgress(userId);

    if (!flow || !steps.length) {
      return { items: [], progress: 0 };
    }

    const items = steps.map(step => ({
      id: step.stepId,
      title: step.title,
      description: step.description,
      completed: step.status === 'COMPLETED',
      required: step.required,
      action: step.action,
    }));

    const completedCount = items.filter(item => item.completed).length;
    const progress = (completedCount / items.length) * 100;

    return {
      items,
      progress: Math.round(progress),
    };
  }

  /**
   * Get onboarding hints/tooltips
   */
  async getHints(
    userId: string,
    page: string,
  ): Promise<
    Array<{
      id: string;
      target: string;
      content: string;
      position: string;
      show: boolean;
    }>
  > {
    const { flow, steps } = await this.getProgress(userId);

    if (!flow) {
      return [];
    }

    // Get hints for current page
    const hints = steps
      .filter(
        step =>
          step.type === 'tour' &&
          step.status === 'PENDING' &&
          step.content &&
          typeof step.content === 'object' &&
          'tour' in step.content,
      )
      .flatMap(step => {
        const content = step.content as any;
        if (Array.isArray(content.tour)) {
          return content.tour
            .filter((tour: any) => tour.page === page)
            .map((tour: any) => ({
              id: `${step.stepId}-${tour.element}`,
              target: tour.element,
              content: tour.content,
              position: tour.position || 'bottom',
              show: true,
            }));
        }
        return [];
      });

    return hints;
  }
  /**
   * Complete onboarding flow
   */
  private async completeOnboarding(userId: string, flowId: string): Promise<void> {
    const flow = await prisma.client.onboardingFlow.findUnique({
      where: { id: flowId },
    });

    if (!flow) return;

    // Get flow template
    const template = this.flowTemplates.get(flow.flowTemplateId);

    // Track analytics
    await this.analyticsService.track({
      userId,
      event: 'onboarding.completed',
      properties: {
        flowId: flow.flowTemplateId,
        flowName: template?.name,
        duration: flow.createdAt ? Date.now() - flow.createdAt.getTime() : 0,
        stepsCompleted: flow.completedSteps,
        totalSteps: flow.totalSteps,
      },
    });

    await this.eventBus.emit('onboarding.completed', {
      userId,
      flowId: flow.id,
      timestamp: new Date(),
    });

    // Clear cache
    await redis.delete(`onboarding:${userId}`);
  }

  /**
   * Check if all required steps are completed
   */
  private async checkRequiredStepsCompleted(flowId: string): Promise<boolean> {
    const requiredSteps = await prisma.client.onboardingStep.count({
      where: {
        flowId,
        required: true,
        status: { not: 'COMPLETED' },
      },
    });

    return requiredSteps === 0;
  }

  /**
   * Calculate onboarding progress
   */
  private async calculateProgress(flowId: string): Promise<OnboardingProgress> {
    const flow = await prisma.client.onboardingFlow.findUnique({
      where: { id: flowId },
    });

    if (!flow) {
      throw new NotFoundException('Onboarding flow not found');
    }

    const steps = await prisma.client.onboardingStep.findMany({
      where: { flowId },
    });

    const completed = steps.filter(s => s.status === 'COMPLETED').length;
    const skipped = steps.filter(s => s.status === 'SKIPPED').length;
    const required = steps.filter(s => s.required).length;
    const requiredCompleted = steps.filter(s => s.required && s.status === 'COMPLETED').length;

    return {
      flowId,
      totalSteps: steps.length,
      completedSteps: completed,
      skippedSteps: skipped,
      requiredSteps: required,
      requiredCompleted,
      percentComplete: Math.round((completed / steps.length) * 100),
      isComplete: flow.status === 'COMPLETED',
      estimatedTimeRemaining: (steps.length - completed) * 2, // 2 minutes per step estimate
    };
  }

  /**
   * Get onboarding analytics
   */
  async getOnboardingAnalytics(
    options: {
      flowId?: string;
      dateRange?: number;
    } = {},
  ): Promise<{
    overview: {
      totalStarted: number;
      totalCompleted: number;
      totalSkipped: number;
      averageCompletion: number;
      averageDuration: number;
    };
    stepAnalytics: Array<{
      stepId: string;
      completionRate: number;
      skipRate: number;
      averageTime: number;
    }>;
    dropoffFunnel: Array<{
      step: string;
      users: number;
      dropoff: number;
    }>;
  }> {
    const where = {
      ...(options.flowId && { flowTemplateId: options.flowId }),
      ...(options.dateRange && {
        createdAt: {
          gte: new Date(Date.now() - options.dateRange * 24 * 60 * 60 * 1000),
        },
      }),
    };

    // Get overview metrics
    const [started, completed, skipped] = await Promise.all([
      prisma.client.onboardingFlow.count({ where }),
      prisma.client.onboardingFlow.count({
        where: { ...where, status: 'COMPLETED' },
      }),
      prisma.client.onboardingFlow.count({
        where: { ...where, status: 'SKIPPED' },
      }),
    ]);

    // Get average completion and duration
    const flows = await prisma.client.onboardingFlow.findMany({
      where: { ...where, status: 'COMPLETED' },
    });

    const averageCompletion =
      flows.length > 0 ? flows.reduce((sum, f) => sum + (f.completedSteps / f.totalSteps) * 100, 0) / flows.length : 0;

    const averageDuration =
      flows.length > 0
        ? flows.reduce((sum, f) => {
            const duration = f.completedAt && f.createdAt ? f.completedAt.getTime() - f.createdAt.getTime() : 0;
            return sum + duration;
          }, 0) / flows.length
        : 0;

    return {
      overview: {
        totalStarted: started,
        totalCompleted: completed,
        totalSkipped: skipped,
        averageCompletion: Math.round(averageCompletion),
        averageDuration: Math.round(averageDuration / 1000 / 60), // in minutes
      },
      stepAnalytics: [], // Would need more complex query
      dropoffFunnel: [], // Would need funnel analysis
    };
  }
}
