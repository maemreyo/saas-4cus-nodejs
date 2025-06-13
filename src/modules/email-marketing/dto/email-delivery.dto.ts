// DTOs for email delivery

import { z } from 'zod';
import { EmailDeliveryStatus } from '@prisma/client';

// Email Delivery Status Update
export const deliveryStatusUpdateSchema = z.object({
  messageId: z.string(),
  status: z.nativeEnum(EmailDeliveryStatus),
  details: z.record(z.any()).optional(),
  timestamp: z.coerce.date().default(() => new Date())
});

export type DeliveryStatusUpdateDTO = z.infer<typeof deliveryStatusUpdateSchema>;

// Delivery Webhook Payload
export const deliveryWebhookSchema = z.object({
  event: z.string(),
  messageId: z.string(),
  email: z.string().email(),
  timestamp: z.coerce.date().optional(),
  metadata: z.record(z.any()).optional(),

  // For click events
  url: z.string().optional(),

  // For bounce/complaint events
  reason: z.string().optional(),
  bounceType: z.string().optional(),
  diagnosticCode: z.string().optional()
});

export type DeliveryWebhookDTO = z.infer<typeof deliveryWebhookSchema>;

// Delivery Stats
export const deliveryStatsSchema = z.object({
  campaignId: z.string(),
  period: z.enum(['hour', 'day', 'week', 'month', 'total']).default('total'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
});

export type DeliveryStatsDTO = z.infer<typeof deliveryStatsSchema>;
