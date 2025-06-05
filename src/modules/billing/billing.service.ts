import { Service } from 'typedi';
import Stripe from 'stripe';
import { config } from '@infrastructure/config';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { redis } from '@infrastructure/cache/redis.service';
import { EventBus } from '@shared/events/event-bus';
import { BadRequestException, NotFoundException } from '@shared/exceptions';
import { BillingEvents } from './billing.events';

export interface CreateCustomerOptions {
  userId: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionOptions {
  userId: string;
  priceId: string;
  couponId?: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}

@Service()
export class BillingService {
  private stripe: Stripe;

  constructor(private eventBus: EventBus) {
    this.stripe = new Stripe(config.external.stripe.secretKey!, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }

  /**
   * Create or get existing Stripe customer
   */
  async getOrCreateCustomer(options: CreateCustomerOptions): Promise<string> {
    const user = await prisma.client.user.findUnique({
      where: { id: options.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has a Stripe customer ID
    let customerId = (user.metadata as any)?.stripeCustomerId;

    if (customerId) {
      // Verify customer exists in Stripe
      try {
        await this.stripe.customers.retrieve(customerId);
        return customerId;
      } catch (error) {
        // Customer doesn't exist in Stripe, create new one
        logger.warn('Stripe customer not found, creating new one', { customerId });
      }
    }

    // Create new customer
    const customer = await this.stripe.customers.create({
      email: options.email,
      name: options.name,
      phone: options.phone,
      metadata: {
        userId: options.userId,
        ...options.metadata,
      },
    });

    // Update user with Stripe customer ID
    await prisma.client.user.update({
      where: { id: options.userId },
      data: {
        metadata: {
          ...((user.metadata as any) || {}),
          stripeCustomerId: customer.id,
        },
      },
    });

    // Cache customer ID
    await redis.set(`stripe:customer:${options.userId}`, customer.id, { ttl: 86400 });

    logger.info('Stripe customer created', { userId: options.userId, customerId: customer.id });

    await this.eventBus.emit(BillingEvents.CUSTOMER_CREATED, {
      userId: options.userId,
      customerId: customer.id,
      timestamp: new Date(),
    });

    return customer.id;
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    options?: {
      couponId?: string;
      trialDays?: number;
      metadata?: Record<string, string>;
    },
  ): Promise<string> {
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get or create Stripe customer
    const customerId = await this.getOrCreateCustomer({
      userId,
      email: user.email,
      name: user.displayName || undefined,
    });

    // Check for existing active subscription
    const existingSubscription = await prisma.client.subscription.findFirst({
      where: {
        userId,
        status: { in: ['ACTIVE', 'TRIALING'] },
      },
    });

    if (existingSubscription) {
      throw new BadRequestException('User already has an active subscription');
    }

    // Create checkout session configuration
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        ...options?.metadata,
      },
      subscription_data: {
        metadata: {
          userId,
          ...options?.metadata,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
      },
    };

    // Add trial period if specified
    if (options?.trialDays && options.trialDays > 0) {
      sessionConfig.subscription_data!.trial_period_days = options.trialDays;
    }

    // Add coupon if specified
    if (options?.couponId) {
      sessionConfig.discounts = [
        {
          coupon: options.couponId,
        },
      ];
    }

    const session = await this.stripe.checkout.sessions.create(sessionConfig);

    logger.info('Checkout session created', {
      userId,
      sessionId: session.id,
      priceId,
    });

    await this.eventBus.emit(BillingEvents.CHECKOUT_STARTED, {
      userId,
      sessionId: session.id,
      priceId,
      timestamp: new Date(),
    });

    return session.url!;
  }

  /**
   * Create customer portal session
   */
  async createPortalSession(userId: string, returnUrl: string): Promise<string> {
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const customerId = (user.metadata as any)?.stripeCustomerId;
    if (!customerId) {
      throw new BadRequestException('No billing account found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(payload: string, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, config.external.stripe.webhookSecret!);
    } catch (error) {
      logger.error('Webhook signature verification failed', error as Error);
      throw new BadRequestException('Invalid webhook signature');
    }

    logger.info('Processing webhook event', { type: event.type, id: event.id });

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await this.handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        logger.warn('Unhandled webhook event type', { type: event.type });
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<void> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      if (immediately) {
        await this.stripe.subscriptions.cancel(subscriptionId);
      } else {
        await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
          metadata: {
            ...subscription.metadata,
            cancelledAt: new Date().toISOString(),
            cancelReason: 'user_requested',
          },
        });
      }

      // Update local database
      await prisma.client.subscription.update({
        where: { id: subscriptionId },
        data: {
          cancelAtPeriodEnd: !immediately,
          canceledAt: immediately ? new Date() : null,
          metadata: {
            cancelReason: 'user_requested',
            cancelledAt: new Date().toISOString(),
          },
        },
      });

      logger.info('Subscription cancelled', { subscriptionId, immediately });

      await this.eventBus.emit(BillingEvents.SUBSCRIPTION_CANCELLED, {
        subscriptionId,
        immediately,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to cancel subscription', error as Error);
      throw error;
    }
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  async updateSubscription(
    subscriptionId: string,
    newPriceId: string,
    prorationBehavior: 'create_prorations' | 'none' | 'always_invoice' = 'always_invoice',
  ): Promise<void> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      // Update subscription with new price
      const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: prorationBehavior,
      });

      // Update local database
      await prisma.client.subscription.update({
        where: { id: subscriptionId },
        data: {
          stripePriceId: newPriceId,
          metadata: {
            previousPriceId: subscription.items.data[0].price.id,
            updatedAt: new Date().toISOString(),
          },
        },
      });

      logger.info('Subscription updated', { subscriptionId, newPriceId });

      await this.eventBus.emit(BillingEvents.SUBSCRIPTION_UPDATED, {
        subscriptionId,
        oldPriceId: subscription.items.data[0].price.id,
        newPriceId,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to update subscription', error as Error);
      throw error;
    }
  }

  /**
   * Resume a cancelled subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      await prisma.client.subscription.update({
        where: { id: subscriptionId },
        data: {
          cancelAtPeriodEnd: false,
          canceledAt: null,
        },
      });

      logger.info('Subscription resumed', { subscriptionId });
    } catch (error) {
      logger.error('Failed to resume subscription', error as Error);
      throw error;
    }
  }

  /**
   * Apply coupon to subscription
   */
  async applyCoupon(subscriptionId: string, couponId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        coupon: couponId,
      });

      logger.info('Coupon applied to subscription', { subscriptionId, couponId });
    } catch (error) {
      logger.error('Failed to apply coupon', error as Error);
      throw error;
    }
  }

  // Private webhook handlers
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) {
      logger.error('No userId in checkout session metadata', { sessionId: session.id });
      return;
    }

    logger.info('Checkout session completed', { userId, sessionId: session.id });

    await this.eventBus.emit(BillingEvents.CHECKOUT_COMPLETED, {
      userId,
      sessionId: session.id,
      customerId: session.customer as string,
      subscriptionId: session.subscription as string,
      timestamp: new Date(),
    });
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      logger.error('No userId in subscription metadata', { subscriptionId: subscription.id });
      return;
    }

    // Check if subscription already exists
    const existingSubscription = await prisma.client.subscription.findUnique({
      where: { id: subscription.id },
    });

    if (existingSubscription) {
      logger.warn('Subscription already exists', { subscriptionId: subscription.id });
      return;
    }

    // Get price details
    const priceId = subscription.items.data[0].price.id;
    const price = await this.stripe.prices.retrieve(priceId);
    const product = await this.stripe.products.retrieve(price.product as string);

    // Create subscription in database
    await prisma.client.subscription.create({
      data: {
        id: subscription.id,
        userId,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: priceId,
        stripeProductId: product.id,
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        metadata: {
          productName: product.name,
          priceAmount: price.unit_amount,
          priceCurrency: price.currency,
          priceInterval: price.recurring?.interval,
          ...subscription.metadata,
        },
      },
    });

    // Clear cache
    await redis.delete(`subscription:${userId}`);

    logger.info('Subscription created in database', { userId, subscriptionId: subscription.id });

    await this.eventBus.emit(BillingEvents.SUBSCRIPTION_CREATED, {
      userId,
      subscriptionId: subscription.id,
      priceId,
      status: subscription.status,
      timestamp: new Date(),
    });
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const existing = await prisma.client.subscription.findUnique({
      where: { id: subscription.id },
    });

    if (!existing) {
      logger.error('Subscription not found for update', { subscriptionId: subscription.id });
      return;
    }

    const priceId = subscription.items.data[0].price.id;

    await prisma.client.subscription.update({
      where: { id: subscription.id },
      data: {
        stripePriceId: priceId,
        status: subscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        metadata: {
          ...(existing.metadata as any),
          lastUpdated: new Date().toISOString(),
        },
      },
    });

    // Clear cache
    await redis.delete(`subscription:${existing.userId}`);

    logger.info('Subscription updated in database', { subscriptionId: subscription.id });

    await this.eventBus.emit(BillingEvents.SUBSCRIPTION_UPDATED, {
      subscriptionId: subscription.id,
      status: subscription.status,
      timestamp: new Date(),
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const existing = await prisma.client.subscription.findUnique({
      where: { id: subscription.id },
    });

    if (!existing) {
      logger.error('Subscription not found for deletion', { subscriptionId: subscription.id });
      return;
    }

    await prisma.client.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        metadata: {
          ...(existing.metadata as any),
          cancelledAt: new Date().toISOString(),
        },
      },
    });

    // Clear cache
    await redis.delete(`subscription:${existing.userId}`);

    logger.info('Subscription cancelled in database', { subscriptionId: subscription.id });

    await this.eventBus.emit(BillingEvents.SUBSCRIPTION_CANCELLED, {
      userId: existing.userId,
      subscriptionId: subscription.id,
      timestamp: new Date(),
    });
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    if (!invoice.subscription) return;

    // Record successful payment
    await prisma.client.invoice.create({
      data: {
        stripeInvoiceId: invoice.id,
        subscriptionId: invoice.subscription as string,
        customerId: invoice.customer as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'PAID',
        paidAt: new Date(),
        periodStart: new Date(invoice.period_start * 1000),
        periodEnd: new Date(invoice.period_end * 1000),
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
        metadata: {
          number: invoice.number,
          billingReason: invoice.billing_reason,
          lineItems: invoice.lines.data.map(item => ({
            description: item.description,
            amount: item.amount,
            quantity: item.quantity,
          })),
        },
      },
    });

    logger.info('Invoice payment succeeded', { invoiceId: invoice.id });

    await this.eventBus.emit(BillingEvents.PAYMENT_SUCCEEDED, {
      invoiceId: invoice.id,
      subscriptionId: invoice.subscription as string,
      amount: invoice.amount_paid,
      timestamp: new Date(),
    });
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    logger.warn('Invoice payment failed', {
      invoiceId: invoice.id,
      customerId: invoice.customer,
      attemptCount: invoice.attempt_count,
    });

    await prisma.client.invoice.create({
      data: {
        stripeInvoiceId: invoice.id,
        subscriptionId: invoice.subscription as string,
        customerId: invoice.customer as string,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'FAILED',
        periodStart: new Date(invoice.period_start * 1000),
        periodEnd: new Date(invoice.period_end * 1000),
        metadata: {
          attemptCount: invoice.attempt_count,
          nextPaymentAttempt: invoice.next_payment_attempt,
        },
      },
    });

    await this.eventBus.emit(BillingEvents.PAYMENT_FAILED, {
      invoiceId: invoice.id,
      subscriptionId: invoice.subscription as string,
      attemptCount: invoice.attempt_count,
      timestamp: new Date(),
    });
  }

  private async handleTrialWillEnd(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    logger.info('Trial will end soon', {
      subscriptionId: subscription.id,
      trialEnd: subscription.trial_end,
    });

    await this.eventBus.emit(BillingEvents.TRIAL_WILL_END, {
      userId,
      subscriptionId: subscription.id,
      trialEndDate: new Date(subscription.trial_end! * 1000),
      timestamp: new Date(),
    });
  }
}
