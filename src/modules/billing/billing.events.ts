export const BillingEvents = {
  // Customer events
  CUSTOMER_CREATED: 'billing.customer.created',
  CUSTOMER_UPDATED: 'billing.customer.updated',

  // Subscription events
  SUBSCRIPTION_CREATED: 'billing.subscription.created',
  SUBSCRIPTION_UPDATED: 'billing.subscription.updated',
  SUBSCRIPTION_CANCELLED: 'billing.subscription.cancelled',
  SUBSCRIPTION_RESUMED: 'billing.subscription.resumed',

  // Payment events
  PAYMENT_SUCCEEDED: 'billing.payment.succeeded',
  PAYMENT_FAILED: 'billing.payment.failed',

  // Checkout events
  CHECKOUT_STARTED: 'billing.checkout.started',
  CHECKOUT_COMPLETED: 'billing.checkout.completed',

  // Trial events
  TRIAL_STARTED: 'billing.trial.started',
  TRIAL_WILL_END: 'billing.trial.will_end',
  TRIAL_ENDED: 'billing.trial.ended',

  // Usage events
  USAGE_LIMIT_REACHED: 'billing.usage.limit_reached',
  USAGE_LIMIT_WARNING: 'billing.usage.limit_warning',
} as const;

export type BillingEventName = (typeof BillingEvents)[keyof typeof BillingEvents];
