import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { BillingController } from './billing.controller';

export default async function billingRoutes(fastify: FastifyInstance) {
  const billingController = Container.get(BillingController);

  // Public webhook endpoint - MUST be before auth middleware
  fastify.post(
    '/webhook',
    {
      config: {
        rawBody: true, // Important for Stripe signature verification
      },
    },
    billingController.handleWebhook.bind(billingController),
  );

  // Public plans endpoint
  fastify.get('/plans', billingController.getPlans.bind(billingController));

  // Protected routes
  fastify.register(async function protectedRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyJWT(request, reply);
    });

    // Subscription management
    fastify.get('/subscription', billingController.getCurrentSubscription.bind(billingController));
    fastify.get('/subscription/stats', billingController.getSubscriptionStats.bind(billingController));
    fastify.post('/subscription/update', billingController.updateSubscription.bind(billingController));
    fastify.post('/subscription/cancel', billingController.cancelSubscription.bind(billingController));
    fastify.post('/subscription/resume', billingController.resumeSubscription.bind(billingController));
    fastify.post('/subscription/coupon', billingController.applyCoupon.bind(billingController));

    // Checkout and portal
    fastify.post('/checkout', billingController.createCheckoutSession.bind(billingController));
    fastify.post('/portal', billingController.createPortalSession.bind(billingController));

    // Usage and features
    fastify.get('/features/check', billingController.checkFeature.bind(billingController));
    fastify.get('/usage/check', billingController.checkUsageLimit.bind(billingController));

    // Billing history
    fastify.get('/history', billingController.getBillingHistory.bind(billingController));

    // Proration calculation
    fastify.post('/proration/calculate', billingController.calculateProration.bind(billingController));
  });
}
