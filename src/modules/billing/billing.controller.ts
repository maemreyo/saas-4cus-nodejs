import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { BillingService } from './billing.service';
import { SubscriptionService } from './subscription.service';
import { validateSchema } from '@shared/validators';
import { CreateCheckoutDTO, UpdateSubscriptionDTO, ApplyCouponDTO, CalculateProrationDTO } from './billing.dto';
import { prisma } from '@/infrastructure/database/prisma.service';

@Service()
export class BillingController {
  constructor(
    private billingService: BillingService,
    private subscriptionService: SubscriptionService,
  ) {}

  /**
   * Get available subscription plans
   */
  async getPlans(request: FastifyRequest, reply: FastifyReply) {
    const plans = this.subscriptionService.getPlans();

    // Get current user's plan for comparison
    const userId = request.customUser?.id;
    let currentPlanId = 'free';

    if (userId) {
      const { plan } = await this.subscriptionService.getUserSubscription(userId);
      currentPlanId = plan?.id || 'free';
    }

    reply.send({
      data: {
        plans,
        currentPlanId,
      },
    });
  }

  /**
   * Get current subscription details
   */
  async getCurrentSubscription(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const subscription = await this.subscriptionService.getUserSubscription(userId);

    reply.send({ data: subscription });
  }

  /**
   * Get subscription statistics and usage
   */
  async getSubscriptionStats(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const stats = await this.subscriptionService.getSubscriptionStats(userId);

    reply.send({ data: stats });
  }

  /**
   * Create checkout session for new subscription or upgrade
   */
  async createCheckoutSession(request: FastifyRequest<{ Body: CreateCheckoutDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(CreateCheckoutDTO.schema, request.body);
    const userId = request.customUser!.id;

    const checkoutUrl = await this.billingService.createCheckoutSession(
      userId,
      dto.priceId,
      dto.successUrl,
      dto.cancelUrl,
      {
        couponId: dto.couponId,
        trialDays: dto.trialDays,
        metadata: dto.metadata,
      },
    );

    reply.send({ data: { url: checkoutUrl } });
  }

  /**
   * Create customer portal session
   */
  async createPortalSession(request: FastifyRequest<{ Body: { returnUrl: string } }>, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const { returnUrl } = request.body;

    const portalUrl = await this.billingService.createPortalSession(userId, returnUrl);

    reply.send({ data: { url: portalUrl } });
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  async updateSubscription(request: FastifyRequest<{ Body: UpdateSubscriptionDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(UpdateSubscriptionDTO.schema, request.body);
    const userId = request.customUser!.id;

    const { subscription } = await this.subscriptionService.getUserSubscription(userId);

    if (!subscription) {
      return reply.code(404).send({ error: 'No active subscription found' });
    }

    await this.billingService.updateSubscription(subscription.id, dto.priceId, dto.prorationBehavior);

    reply.send({ message: 'Subscription updated successfully' });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(request: FastifyRequest<{ Body: { immediately?: boolean } }>, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const { immediately = false } = request.body;

    const { subscription } = await this.subscriptionService.getUserSubscription(userId);

    if (!subscription) {
      return reply.code(404).send({ error: 'No active subscription found' });
    }

    await this.billingService.cancelSubscription(subscription.id, immediately);

    reply.send({
      message: immediately
        ? 'Subscription cancelled immediately'
        : 'Subscription will be cancelled at the end of the billing period',
    });
  }

  /**
   * Resume cancelled subscription
   */
  async resumeSubscription(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;

    const { subscription } = await this.subscriptionService.getUserSubscription(userId);

    if (!subscription) {
      return reply.code(404).send({ error: 'No subscription found' });
    }

    if (!subscription.cancelAtPeriodEnd) {
      return reply.code(400).send({ error: 'Subscription is not scheduled for cancellation' });
    }

    await this.billingService.resumeSubscription(subscription.id);

    reply.send({ message: 'Subscription resumed successfully' });
  }

  /**
   * Apply coupon to subscription
   */
  async applyCoupon(request: FastifyRequest<{ Body: ApplyCouponDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(ApplyCouponDTO.schema, request.body);
    const userId = request.customUser!.id;

    const { subscription } = await this.subscriptionService.getUserSubscription(userId);

    if (!subscription) {
      return reply.code(404).send({ error: 'No active subscription found' });
    }

    await this.billingService.applyCoupon(subscription.id, dto.couponId);

    reply.send({ message: 'Coupon applied successfully' });
  }

  /**
   * Calculate proration for plan change
   */
  async calculateProration(request: FastifyRequest<{ Body: CalculateProrationDTO }>, reply: FastifyReply) {
    const dto = await validateSchema(CalculateProrationDTO.schema, request.body);
    const userId = request.customUser!.id;

    const proration = await this.subscriptionService.calculateProration(userId, dto.newPlanId);

    reply.send({ data: proration });
  }

  /**
   * Check feature access
   */
  async checkFeature(request: FastifyRequest<{ Querystring: { feature: string } }>, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const { feature } = request.query;

    const hasAccess = await this.subscriptionService.hasFeature(userId, feature);

    reply.send({ data: { hasAccess, feature } });
  }

  /**
   * Check usage limit
   */
  async checkUsageLimit(request: FastifyRequest<{ Querystring: { resource: string } }>, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const { resource } = request.query;

    const usage = await this.subscriptionService.checkUsageLimit(userId, resource as any);

    reply.send({ data: usage });
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(request: FastifyRequest, reply: FastifyReply) {
    const signature = request.headers['stripe-signature'] as string;
    const payload = (request as any).rawBody!;

    await this.billingService.handleWebhook(payload, signature);

    reply.send({ received: true });
  }

  /**
   * Get billing history
   */
  async getBillingHistory(
    request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>,
    reply: FastifyReply,
  ) {
    const userId = request.customUser!.id;
    const { limit = 20, offset = 0 } = request.query;

    const { subscription } = await this.subscriptionService.getUserSubscription(userId);

    if (!subscription) {
      return reply.send({ data: { invoices: [], total: 0 } });
    }

    const [invoices, total] = await Promise.all([
      prisma.client.invoice.findMany({
        where: { subscriptionId: subscription.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.client.invoice.count({
        where: { subscriptionId: subscription.id },
      }),
    ]);

    reply.send({
      data: {
        invoices,
        total,
        limit,
        offset,
      },
    });
  }
}
