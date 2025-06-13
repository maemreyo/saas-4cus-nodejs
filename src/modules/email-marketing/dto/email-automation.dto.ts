// DTOs for email automation

import { z } from 'zod';
import {
  EmailAutomationTrigger,
  EmailAutomationStatus,
  EmailSegmentOperator,
  EmailAutomationDelayUnit,
  EmailAutomationAction
} from '@prisma/client';

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
  delayUnit: z.nativeEnum(EmailAutomationDelayUnit).default(EmailAutomationDelayUnit.HOURS),
  templateId: z.string().optional(),
  subject: z.string().min(1).max(500),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.nativeEnum(EmailSegmentOperator),
    value: z.any()
  })).optional(),
  action: z.nativeEnum(EmailAutomationAction).default(EmailAutomationAction.SEND_EMAIL),
  actionConfig: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
});

export type CreateAutomationStepDTO = z.infer<typeof createAutomationStepSchema>;

// Update Automation
export const updateAutomationSchema = createAutomationSchema.partial();

export type UpdateAutomationDTO = z.infer<typeof updateAutomationSchema>;

// Automation Enrollment
export const automationEnrollmentSchema = z.object({
  subscriberId: z.string(),
  status: z.nativeEnum(EmailAutomationStatus).default('ACTIVE')
});

export type AutomationEnrollmentDTO = z.infer<typeof automationEnrollmentSchema>;

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
