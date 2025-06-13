// DTOs for email campaign management

import { z } from 'zod';
import {
  EmailCampaignStatus,
  EmailCampaignType
} from '@prisma/client';

// Create Campaign
export const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  subject: z.string().min(1).max(500),
  preheader: z.string().max(255).optional(),
  fromName: z.string().min(1).max(255),
  fromEmail: z.string().email(),
  replyTo: z.string().email().optional(),
  type: z.nativeEnum(EmailCampaignType).optional(),
  listId: z.string().optional(),
  templateId: z.string().optional(),
  htmlContent: z.string(),
  textContent: z.string().optional(),
  segmentIds: z.array(z.string()).optional(),
  excludeSegmentIds: z.array(z.string()).optional(),
  trackOpens: z.boolean().optional(),
  trackClicks: z.boolean().optional(),
  googleAnalytics: z.boolean().optional(),
  utmParams: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    term: z.string().optional(),
    content: z.string().optional()
  }).optional(),
  isABTest: z.boolean().optional(),
  abTestConfig: z.object({
    testPercentage: z.number().min(10).max(50).optional(),
    winningMetric: z.enum(['opens', 'clicks', 'conversions']).optional(),
    testDuration: z.number().min(1).max(24).optional(),
    variants: z.array(z.object({
      name: z.string(),
      weight: z.number().min(0).max(100),
      subject: z.string().optional(),
      fromName: z.string().optional(),
      content: z.string().optional()
    })).optional()
  }).optional(),
  metadata: z.record(z.any()).optional()
});

export type CreateCampaignDTO = z.infer<typeof createCampaignSchema>;

// Update Campaign
export const updateCampaignSchema = createCampaignSchema.partial();

export type UpdateCampaignDTO = z.infer<typeof updateCampaignSchema>;

// Schedule Campaign
export const scheduleCampaignSchema = z.object({
  scheduledAt: z.coerce.date().refine(
    date => date > new Date(),
    'Schedule date must be in the future'
  )
});

export type ScheduleCampaignDTO = z.infer<typeof scheduleCampaignSchema>;

// Send Campaign
export const sendCampaignSchema = z.object({
  testMode: z.boolean().optional(),
  testEmails: z.array(z.string().email()).optional(),
  batchSize: z.number().min(1).max(1000).optional(),
  delayBetweenBatches: z.number().min(0).optional(),
  limit: z.number().min(1).optional()
});

export type SendCampaignDTO = z.infer<typeof sendCampaignSchema>;

// Campaign Filters
export const campaignFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(EmailCampaignStatus).optional(),
  type: z.nativeEnum(EmailCampaignType).optional(),
  listId: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'createdAt', 'sentAt', 'openRate', 'clickRate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type CampaignFiltersDTO = z.infer<typeof campaignFiltersSchema>;