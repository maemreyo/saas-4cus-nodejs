import { z } from 'zod';
import {
  EmailListStatus,
  EmailCampaignStatus,
  EmailCampaignType,
  EmailAutomationTrigger,
  EmailSegmentOperator,
  EmailDeliveryStatus
} from '@prisma/client';

// Common schemas
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  skip: z.number().optional()
}).transform(data => ({
  ...data,
  skip: data.skip ?? (data.page - 1) * data.limit
}));

// ========================= EMAIL LIST DTOs =========================

export const createEmailListSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  doubleOptIn: z.boolean().optional(),
  welcomeEmailId: z.string().optional(),
  confirmationPageUrl: z.string().url().optional(),
  defaultFromName: z.string().optional(),
  defaultFromEmail: z.string().email().optional(),
  defaultReplyTo: z.string().email().optional(),
  customFields: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
});

export const updateEmailListSchema = createEmailListSchema.partial();

export const emailListQuerySchema = paginationSchema.extend({
  status: z.nativeEnum(EmailListStatus).optional(),
  search: z.string().optional()
});

export const addSubscriberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  customData: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().optional(),
  ipAddress: z.string().optional(),
  location: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const importSubscribersSchema = z.object({
  subscribers: z.array(addSubscriberSchema).optional(),
  csv: z.string().optional(),
  updateExisting: z.boolean().default(false),
  skipConfirmation: z.boolean().default(false)
}).refine(data => data.subscribers || data.csv, {
  message: 'Either subscribers array or CSV data is required'
});

export const updateSubscriberSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  customData: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
});

export const subscriberTagsSchema = z.object({
  add: z.array(z.string()).optional(),
  remove: z.array(z.string()).optional()
}).refine(data => data.add || data.remove, {
  message: 'Either add or remove tags must be specified'
});

export const subscriberQuerySchema = paginationSchema.extend({
  subscribed: z.coerce.boolean().optional(),
  confirmed: z.coerce.boolean().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional()
});

export const bulkOperationSchema = z.object({
  subscriberIds: z.array(z.string()),
  action: z.enum(['delete', 'unsubscribe', 'add_tags', 'remove_tags']),
  tags: z.array(z.string()).optional()
});

// ========================= CAMPAIGN DTOs =========================

export const createCampaignSchema = z.object({
  listId: z.string().optional(),
  name: z.string().min(1).max(255),
  subject: z.string().min(1).max(500),
  preheader: z.string().max(255).optional(),
  fromName: z.string().min(1).max(255),
  fromEmail: z.string().email(),
  replyTo: z.string().email().optional(),
  type: z.nativeEnum(EmailCampaignType).optional(),
  templateId: z.string().optional(),
  htmlContent: z.string().optional(),
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
    testSize: z.number().min(10).max(50),
    winnerCriteria: z.enum(['open_rate', 'click_rate', 'conversion_rate']),
    testDuration: z.number().min(1).max(24), // hours
    variants: z.array(z.object({
      name: z.string(),
      weight: z.number().min(1).max(100),
      subject: z.string().optional(),
      fromName: z.string().optional()
    }))
  }).optional(),
  metadata: z.record(z.any()).optional()
});

export const updateCampaignSchema = createCampaignSchema.partial().omit({
  type: true,
  isABTest: true
});

export const sendCampaignSchema = z.object({
  testMode: z.boolean().optional(),
  testEmails: z.array(z.string().email()).optional()
});

export const campaignQuerySchema = paginationSchema.extend({
  listId: z.string().optional(),
  status: z.nativeEnum(EmailCampaignStatus).optional(),
  type: z.nativeEnum(EmailCampaignType).optional(),
  search: z.string().optional()
});

// ========================= SEGMENT DTOs =========================

export const segmentConditionSchema = z.object({
  field: z.string(),
  operator: z.nativeEnum(EmailSegmentOperator),
  value: z.any(),
  logic: z.enum(['AND', 'OR']).optional()
});

export const createSegmentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  conditions: z.array(segmentConditionSchema).min(1),
  metadata: z.record(z.any()).optional()
});

export const updateSegmentSchema = createSegmentSchema.partial();

export const segmentQuerySchema = paginationSchema.extend({
  search: z.string().optional()
});

export const testSegmentSchema = z.object({
  conditions: z.array(segmentConditionSchema).optional(),
  limit: z.number().max(100).optional()
});

// ========================= TEMPLATE DTOs =========================

export const templateVariablesSchema = z.record(z.enum(['string', 'number', 'boolean', 'array', 'object']));

export const createTemplateSchema = z.object({
  tenantId: z.string().optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().optional(),
  subject: z.string().min(1).max(500),
  preheader: z.string().max(255).optional(),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  variables: templateVariablesSchema.optional(),
  thumbnail: z.string().optional(),
  isPublic: z.boolean().optional(),
  metadata: z.record(z.any()).optional()
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const templateQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  search: z.string().optional(),
  includeArchived: z.coerce.boolean().optional()
});

export const previewTemplateSchema = z.object({
  variables: z.record(z.any()).optional()
});

// ========================= AUTOMATION DTOs =========================

export const createAutomationStepSchema = z.object({
  name: z.string().min(1).max(255),
  delayAmount: z.number().min(0),
  delayUnit: z.enum(['minutes', 'hours', 'days']),
  templateId: z.string().optional(),
  subject: z.string().min(1).max(500),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  conditions: z.array(segmentConditionSchema).optional(),
  metadata: z.record(z.any()).optional()
});

export const updateAutomationStepSchema = createAutomationStepSchema.partial();

export const createAutomationSchema = z.object({
  listId: z.string().optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  trigger: z.nativeEnum(EmailAutomationTrigger),
  triggerConfig: z.record(z.any()),
  steps: z.array(createAutomationStepSchema).optional(),
  metadata: z.record(z.any()).optional()
});

export const updateAutomationSchema = createAutomationSchema.partial().omit({
  steps: true
});

export const automationQuerySchema = paginationSchema.extend({
  listId: z.string().optional(),
  active: z.coerce.boolean().optional(),
  trigger: z.nativeEnum(EmailAutomationTrigger).optional(),
  search: z.string().optional()
});

export const enrollmentQuerySchema = paginationSchema.extend({
  status: z.enum(['active', 'completed', 'cancelled']).optional()
});

export const triggerAutomationSchema = z.object({
  automationId: z.string(),
  triggerData: z.record(z.any()).optional()
});

// ========================= TRACKING DTOs =========================

export const trackingEventSchema = z.object({
  messageId: z.string(),
  event: z.enum(['sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'complained']),
  timestamp: z.string().datetime(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  url: z.string().optional(),
  bounceType: z.enum(['hard', 'soft']).optional(),
  reason: z.string().optional()
});

// ========================= TYPE EXPORTS =========================

export type CreateEmailListDto = z.infer<typeof createEmailListSchema>;
export type UpdateEmailListDto = z.infer<typeof updateEmailListSchema>;
export type EmailListQueryDto = z.infer<typeof emailListQuerySchema>;
export type AddSubscriberDto = z.infer<typeof addSubscriberSchema>;
export type ImportSubscribersDto = z.infer<typeof importSubscribersSchema>;
export type UpdateSubscriberDto = z.infer<typeof updateSubscriberSchema>;
export type SubscriberTagsDto = z.infer<typeof subscriberTagsSchema>;
export type SubscriberQueryDto = z.infer<typeof subscriberQuerySchema>;
export type BulkOperationDto = z.infer<typeof bulkOperationSchema>;

export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignDto = z.infer<typeof updateCampaignSchema>;
export type SendCampaignDto = z.infer<typeof sendCampaignSchema>;
export type CampaignQueryDto = z.infer<typeof campaignQuerySchema>;

export type SegmentCondition = z.infer<typeof segmentConditionSchema>;
export type CreateSegmentDto = z.infer<typeof createSegmentSchema>;
export type UpdateSegmentDto = z.infer<typeof updateSegmentSchema>;
export type SegmentQueryDto = z.infer<typeof segmentQuerySchema>;
export type TestSegmentDto = z.infer<typeof testSegmentSchema>;

export type TemplateVariables = z.infer<typeof templateVariablesSchema>;
export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateDto = z.infer<typeof updateTemplateSchema>;
export type TemplateQueryDto = z.infer<typeof templateQuerySchema>;
export type PreviewTemplateDto = z.infer<typeof previewTemplateSchema>;

export type CreateAutomationStepDto = z.infer<typeof createAutomationStepSchema>;
export type UpdateAutomationStepDto = z.infer<typeof updateAutomationStepSchema>;
export type CreateAutomationDto = z.infer<typeof createAutomationSchema>;
export type UpdateAutomationDto = z.infer<typeof updateAutomationSchema>;
export type AutomationQueryDto = z.infer<typeof automationQuerySchema>;
export type EnrollmentQueryDto = z.infer<typeof enrollmentQuerySchema>;
export type TriggerAutomationDto = z.infer<typeof triggerAutomationSchema>;

export type TrackingEventDto = z.infer<typeof trackingEventSchema>;

// Campaign stats interface
export interface CampaignStatsDto {
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  bouncedCount: number;
  openCount: number;
  uniqueOpenCount: number;
  clickCount: number;
  uniqueClickCount: number;
  unsubscribeCount: number;
  complaintCount: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  clickToOpenRate: number;
  unsubscribeRate: number;
  complaintRate: number;
  revenue?: number;
  orderCount?: number;
  conversionRate?: number;
  recipientStats?: Record<EmailDeliveryStatus, number>;
  topClickedLinks?: Array<{ url: string; clicks: number }>;
}

// A/B test config
export interface ABTestConfigDto {
  testSize: number;
  winnerCriteria: 'open_rate' | 'click_rate' | 'conversion_rate';
  testDuration: number;
  variants: Array<{
    name: string;
    weight: number;
    subject?: string;
    fromName?: string;
  }>;
}