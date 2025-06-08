import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { OnboardingService } from './onboarding.service';
import { validateSchema } from '@shared/validators';
import {
  StartOnboardingDTO,
  CompleteStepDTO,
  GetHintsDTO
} from './onboarding.dto';

@Service()
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  /**
   * Start onboarding flow
   */
  async startOnboarding(
    request: FastifyRequest<{ Body: StartOnboardingDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(StartOnboardingDTO.schema, request.body);
    const userId = request.customUser!.id;

    const flow = await this.onboardingService.startOnboarding(
      userId,
      dto.flowId,
      dto.context ? { ...dto.context, userId } : { userId }
    );

    reply.send({
      message: 'Onboarding started',
      data: flow
    });
  }

  /**
   * Get onboarding progress
   */
  async getProgress(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const progress = await this.onboardingService.getProgress(userId);

    reply.send({ data: progress });
  }

  /**
   * Complete onboarding step
   */
  async completeStep(
    request: FastifyRequest<{ Body: CompleteStepDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(CompleteStepDTO.schema, request.body);
    const userId = request.customUser!.id;

    await this.onboardingService.completeStep(userId, dto.stepId, dto.data);

    reply.send({ message: 'Step completed' });
  }

  /**
   * Skip onboarding step
   */
  async skipStep(
    request: FastifyRequest<{ Body: { stepId: string } }>,
    reply: FastifyReply
  ) {
    const { stepId } = request.body;
    const userId = request.customUser!.id;

    await this.onboardingService.skipStep(userId, stepId);

    reply.send({ message: 'Step skipped' });
  }

  /**
   * Skip entire onboarding
   */
  async skipOnboarding(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;

    await this.onboardingService.skipOnboarding(userId);

    reply.send({ message: 'Onboarding skipped' });
  }

  /**
   * Get onboarding checklist
   */
  async getChecklist(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const checklist = await this.onboardingService.getChecklist(userId);

    reply.send({ data: checklist });
  }

  /**
   * Get onboarding hints for page
   */
  async getHints(
    request: FastifyRequest<{ Querystring: GetHintsDTO }>,
    reply: FastifyReply
  ) {
    const { page } = request.query;
    const userId = request.customUser!.id;

    const hints = await this.onboardingService.getHints(userId, page);

    reply.send({ data: hints });
  }

  /**
   * Get onboarding analytics (admin)
   */
  async getAnalytics(
    request: FastifyRequest<{
      Querystring: { flowId?: string; dateRange?: number };
    }>,
    reply: FastifyReply
  ) {
    const { flowId, dateRange } = request.query;

    const analytics = await this.onboardingService.getOnboardingAnalytics({
      flowId,
      dateRange
    });

    reply.send({ data: analytics });
  }
}
