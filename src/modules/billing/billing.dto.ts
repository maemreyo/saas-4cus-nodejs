import { z } from 'zod';

export class CreateCheckoutDTO {
  static schema = z.object({
    priceId: z.string(),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
    couponId: z.string().optional(),
    trialDays: z.number().int().positive().optional(),
    metadata: z.record(z.string()).optional(),
  });

  priceId!: string;
  successUrl!: string;
  cancelUrl!: string;
  couponId?: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}

export class UpdateSubscriptionDTO {
  static schema = z.object({
    priceId: z.string(),
    prorationBehavior: z.enum(['create_prorations', 'none', 'always_invoice']).optional(),
  });

  priceId!: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export class ApplyCouponDTO {
  static schema = z.object({
    couponId: z.string(),
  });

  couponId!: string;
}

export class CalculateProrationDTO {
  static schema = z.object({
    newPlanId: z.string(),
  });

  newPlanId!: string;
}
