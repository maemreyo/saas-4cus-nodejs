import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { FeatureService } from './feature.service';
import { EntitlementService } from './entitlement.service';
import { validateSchema } from '@shared/validators';
import {
  CreateFeatureDTO,
  CreatePlanDTO,
  UpdatePlanDTO,
  UpdateFeatureFlagDTO,
  CheckEntitlementDTO,
  ConsumeEntitlementDTO,
} from './feature.dto';

@Service()
export class FeatureController {
  constructor(
    private featureService: FeatureService,
    private entitlementService: EntitlementService,
  ) {}

  /**
   * Get all features
   */
  async getFeatures(
    request: FastifyRequest<{ Querystring: { category?: string; includeUsage?: boolean } }>,
    reply: FastifyReply,
  ) {
    const { category, includeUsage } = request.query;
    const features = await this.featureService.getFeatures({ category, includeUsage });

    reply.send({ data: features });
  }

  /**
   * Create feature (admin only)
   */
  async createFeature(request: FastifyRequest<{ Body: CreateFeatureDTO }>, reply: FastifyReply) {
    const dto = (await validateSchema(CreateFeatureDTO.schema, request.body)) as any;
    const feature = await this.featureService.createFeature(dto);

    reply.code(201).send({
      message: 'Feature created successfully',
      data: feature,
    });
  }

  /**
   * Get all plans
   */
  async getPlans(request: FastifyRequest<{ Querystring: { active?: boolean } }>, reply: FastifyReply) {
    const { active } = request.query;
    const plans = await this.featureService.getPlans({
      active,
      includeFeatures: true,
    });

    reply.send({ data: plans });
  }

  /**
   * Get plan by slug
   */
  async getPlan(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    const { slug } = request.params;
    const plan = await this.featureService.getPlanBySlug(slug);

    reply.send({ data: plan });
  }

  /**
   * Create plan (admin only)
   */
  async createPlan(request: FastifyRequest<{ Body: CreatePlanDTO }>, reply: FastifyReply) {
    const dto = (await validateSchema(CreatePlanDTO.schema, request.body)) as any;
    const plan = await this.featureService.createPlan(dto);

    reply.code(201).send({
      message: 'Plan created successfully',
      data: plan,
    });
  }

  /**
   * Update plan (admin only)
   */
  async updatePlan(
    request: FastifyRequest<{
      Params: { planId: string };
      Body: UpdatePlanDTO;
    }>,
    reply: FastifyReply,
  ) {
    const { planId } = request.params;
    const dto = (await validateSchema(UpdatePlanDTO.schema, request.body)) as any;
    const plan = await this.featureService.updatePlan(planId, dto);

    reply.send({
      message: 'Plan updated successfully',
      data: plan,
    });
  }

  /**
   * Compare plans
   */
  async comparePlans(request: FastifyRequest<{ Querystring: { ids: string } }>, reply: FastifyReply) {
    const planIds = request.query.ids.split(',');
    const comparison = await this.featureService.comparePlans(planIds);

    reply.send({ data: comparison });
  }

  /**
   * Get user's feature flags
   */
  async getUserFeatureFlags(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const flags = await this.featureService.getUserFeatureFlags(userId);

    reply.send({ data: flags });
  }

  /**
   * Check specific feature flag
   */
  async checkFeatureFlag(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    const { key } = request.params;
    const userId = request.customUser?.id;
    const enabled = await this.featureService.isFeatureFlagEnabled(key, userId);

    reply.send({ data: { key, enabled } });
  }

  /**
   * Update feature flag (admin only)
   */
  async updateFeatureFlag(
    request: FastifyRequest<{
      Params: { key: string };
      Body: UpdateFeatureFlagDTO;
    }>,
    reply: FastifyReply,
  ) {
    const { key } = request.params;
    const dto = await validateSchema(UpdateFeatureFlagDTO.schema, request.body);
    await this.featureService.updateFeatureFlag(key, dto);

    reply.send({ message: 'Feature flag updated successfully' });
  }

  /**
   * Get user's entitlements
   */
  async getUserEntitlements(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const entitlements = await this.entitlementService.getAllEntitlements(userId);

    reply.send({ data: entitlements });
  }

  /**
   * Check entitlement
   */
  async checkEntitlement(request: FastifyRequest<{ Body: CheckEntitlementDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(CheckEntitlementDTO.schema, request.body);
    const userId = request.customUser!.id;
    const entitlement = await this.entitlementService.getEntitlement(userId, dto.feature);

    reply.send({ data: entitlement });
  }

  /**
   * Consume entitlement
   */
  async consumeEntitlement(request: FastifyRequest<{ Body: ConsumeEntitlementDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(ConsumeEntitlementDTO.schema, request.body);
    const userId = request.customUser!.id;
    await this.entitlementService.consume(userId, dto.feature, dto.amount);

    reply.send({ message: 'Entitlement consumed successfully' });
  }

  /**
   * Track feature usage
   */
  async trackUsage(request: FastifyRequest<{ Body: { feature: string } }>, reply: FastifyReply) {
    const { feature } = request.body;
    const userId = request.customUser!.id;
    const tenantId = (request as any).tenant?.id;

    await this.featureService.trackFeatureUsage(userId, feature, tenantId);

    reply.send({ message: 'Usage tracked' });
  }

  /**
   * Get feature usage statistics (admin only)
   */
  async getFeatureUsageStats(
    request: FastifyRequest<{
      Params: { featureKey: string };
      Querystring: { startDate?: string; endDate?: string; tenantId?: string };
    }>,
    reply: FastifyReply,
  ) {
    const { featureKey } = request.params;
    const { startDate, endDate, tenantId } = request.query;

    const stats = await this.featureService.getFeatureUsageStats(featureKey, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      tenantId,
    });

    reply.send({ data: stats });
  }
}
