// DTOs for email template management

import { z } from 'zod';
import { EmailVariableType } from '@prisma/client';

// Create Template
export const createTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  subject: z.string().min(1).max(500),
  preheader: z.string().max(255).optional(),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  variables: z.array(z.object({
    name: z.string(),
    type: z.nativeEnum(EmailVariableType),
    defaultValue: z.any().optional(),
    required: z.boolean().optional()
  })).optional(),
  thumbnail: z.string().optional(),
  isPublic: z.boolean().default(false),
  metadata: z.record(z.any()).optional()
});

export type CreateTemplateDTO = z.infer<typeof createTemplateSchema>;

// Update Template
export const updateTemplateSchema = createTemplateSchema.partial().extend({
  isArchived: z.boolean().optional()
});

export type UpdateTemplateDTO = z.infer<typeof updateTemplateSchema>;

// Template Filters
export const templateFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type TemplateFiltersDTO = z.infer<typeof templateFiltersSchema>;
