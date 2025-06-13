// DTOs for subscriber management

import { z } from 'zod';
import { EmailActivityType, EmailEngagementLevel } from '@prisma/client';

// Subscriber Activity
export const subscriberActivitySchema = z.object({
  subscriberId: z.string(),
  type: z.nativeEnum(EmailActivityType),
  campaignId: z.string().optional(),
  clickedUrl: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export type SubscriberActivityDTO = z.infer<typeof subscriberActivitySchema>;

// Subscriber Filters
export const subscriberFiltersSchema = z.object({
  search: z.string().optional(),
  listId: z.string().optional(),
  subscribed: z.boolean().optional(),
  confirmed: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  engagementLevel: z.nativeEnum(EmailEngagementLevel).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['email', 'subscribedAt', 'lastEngagedAt', 'engagementScore']).default('subscribedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type SubscriberFiltersDTO = z.infer<typeof subscriberFiltersSchema>;
