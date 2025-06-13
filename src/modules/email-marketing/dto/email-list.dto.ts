// DTOs for email list management

import { z } from 'zod';
import {
  EmailListStatus,
  TenantMemberRole
} from '@prisma/client';

// Create Email List
export const createEmailListSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  doubleOptIn: z.boolean().default(true),
  welcomeEmailId: z.string().optional(),
  confirmationPageUrl: z.string().url().optional(),
  defaultFromName: z.string().max(255).optional(),
  defaultFromEmail: z.string().email().optional(),
  defaultReplyTo: z.string().email().optional(),
  customFields: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
});

export type CreateEmailListDTO = z.infer<typeof createEmailListSchema>;

// Update Email List
export const updateEmailListSchema = createEmailListSchema.partial().extend({
  status: z.nativeEnum(EmailListStatus).optional()
});

export type UpdateEmailListDTO = z.infer<typeof updateEmailListSchema>;

// Subscribe to List
export const subscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  customData: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  ipAddress: z.string().optional()
});

export type SubscribeDTO = z.infer<typeof subscribeSchema>;

// Unsubscribe from List
export const unsubscribeSchema = z.object({
  email: z.string().email(),
  listId: z.string().optional(),
  tenantId: z.string().optional(),
  reason: z.string().optional(),
  feedback: z.string().optional(),
  globalUnsubscribe: z.boolean().optional()
});

export type UnsubscribeDTO = z.infer<typeof unsubscribeSchema>;

// Update Subscriber
export const updateSubscriberSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  customData: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional()
});

export type UpdateSubscriberDTO = z.infer<typeof updateSubscriberSchema>;

// Import Subscribers
export const importSubscribersSchema = z.object({
  subscribers: z.array(subscribeSchema).optional(),
  csvContent: z.string().optional(),
  updateExisting: z.boolean().default(false),
  skipConfirmation: z.boolean().default(false),
  tags: z.array(z.string()).optional()
}).refine(
  data => data.subscribers || data.csvContent,
  'Either subscribers array or CSV content must be provided'
);

export type ImportSubscribersDTO = z.infer<typeof importSubscribersSchema>;

// List Filters
export const listFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(EmailListStatus).optional(),
  hasSubscribers: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'createdAt', 'subscriberCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type ListFiltersDTO = z.infer<typeof listFiltersSchema>;
