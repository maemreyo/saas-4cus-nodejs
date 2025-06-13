// DTOs for email segmentation

import { z } from 'zod';
import { EmailSegmentOperator } from '@prisma/client';

// Segment Condition
const segmentConditionSchema = z.object({
  field: z.string(),
  operator: z.nativeEnum(EmailSegmentOperator),
  value: z.any(),
  type: z.enum(['subscriber', 'engagement', 'campaign', 'custom']).optional()
});

// Create Segment
export const createSegmentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  conditions: z.object({
    operator: z.enum(['AND', 'OR']),
    groups: z.array(z.object({
      operator: z.enum(['AND', 'OR']),
      conditions: z.array(segmentConditionSchema)
    }))
  }),
  metadata: z.record(z.any()).optional()
});

export type CreateSegmentDTO = z.infer<typeof createSegmentSchema>;

// Update Segment
export const updateSegmentSchema = createSegmentSchema.partial();

export type UpdateSegmentDTO = z.infer<typeof updateSegmentSchema>;

// Test Segment
export const testSegmentSchema = z.object({
  conditions: createSegmentSchema.shape.conditions,
  limit: z.number().min(1).max(100).default(10)
});

export type TestSegmentDTO = z.infer<typeof testSegmentSchema>;