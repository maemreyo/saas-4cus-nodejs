// DTOs for email automation

import { z } from 'zod';
import { EmailAutomationTrigger } from '@prisma/client';

// Create Automation
export const createAutomationSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  listId: z.string().optional(),
  trigger: z.nativeEnum(EmailAutomationTrigger),
  triggerConfig: z.record(z.any()),
  active: z.boolean().default(false),
  metadata: z.record(z.any()).optional()
});

export type CreateAutomationDTO = z.infer<typeof createAutomationSchema>;

// Create Automation Step
export const createAutomationStepSchema = z.object({
  name: z.string().min(1).max(255),
  order: z.number().min(0),
  delayAmount: z.number().min(0).default(0),
  delayUnit: z.enum(['minutes', 'hours', 'days']).default('hours'),
  templateId: z.string().optional(),
  subject: z.string().min(1).max(500),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
    value: z.any()
  })).optional()
});

export type CreateAutomationStepDTO = z.infer<typeof createAutomationStepSchema>;

// Update Automation
export const updateAutomationSchema = createAutomationSchema.partial();

export type UpdateAutomationDTO = z.infer<typeof updateAutomationSchema>;

// Automation Filters
export const automationFiltersSchema = z.object({
  search: z.string().optional(),
  trigger: z.nativeEnum(EmailAutomationTrigger).optional(),
  active: z.boolean().optional(),
  listId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'createdAt', 'totalEnrolled']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type AutomationFiltersDTO = z.infer<typeof automationFiltersSchema>;