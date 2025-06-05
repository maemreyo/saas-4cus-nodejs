import { z } from 'zod';

export class CreateFeatureDTO {
  static schema = z.object({
    name: z.string().min(1).max(100),
    key: z.string().min(1).max(50).regex(/^[a-z0-9_]+$/),
    description: z.string().max(500).optional(),
    category: z.string().max(50).optional()
  });

  name!: string;
  key!: string;
  description?: string;
  category?: string;
}

export class CreatePlanDTO {
  static schema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
    description: z.string().max(500).optional(),
    stripePriceId: z.string().optional(),
    stripeProductId: z.string().optional(),
    price: z.number().int().min(0),
    currency: z.string().length(3).default('usd'),
    interval: z.enum(['month', 'year']).default('month'),
    trialDays: z.number().int().min(0).default(0),
    popular: z.boolean().default(false),
    features: z.array(z.object({
      featureId: z.string(),
      included: z.boolean(),
      limitValue: z.number().int().positive().optional()
    }))
  });

  name!: string;
  slug!: string;
  description?: string;
  stripePriceId?: string;
  stripeProductId?: string;
  price!: number;
  currency?: string;
  interval?: string;
  trialDays?: number;
  popular?: boolean;
  features!: Array<{
    featureId: string;
    included: boolean;
    limitValue?: number;
  }>;
}

export class UpdatePlanDTO {
  static schema = CreatePlanDTO.schema.partial();
}

export class UpdateFeatureFlagDTO {
  static schema = z.object({
    enabled: z.boolean().optional(),
    rolloutPercentage: z.number().min(0).max(100).optional(),
    userWhitelist: z.array(z.string()).optional(),
    userBlacklist: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional()
  });

  enabled?: boolean;
  rolloutPercentage?: number;
  userWhitelist?: string[];
  userBlacklist?: string[];
  metadata?: Record<string, any>;
}

export class CheckEntitlementDTO {
  static schema = z.object({
    feature: z.string()
  });

  feature!: string;
}

export class ConsumeEntitlementDTO {
  static schema = z.object({
    feature: z.string(),
    amount: z.number().int().positive().default(1)
  });

  feature!: string;
  amount?: number;
}