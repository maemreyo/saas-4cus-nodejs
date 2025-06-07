import { z } from 'zod';

export class CreateNotificationDTO {
  static schema = z.object({
    userId: z.string().uuid(),
    type: z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS', 'ALERT', 'CRITICAL']),
    title: z.string().min(1).max(200),
    content: z.string().min(1).max(1000),
    metadata: z.record(z.any()).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
    expiresAt: z.string().datetime().optional(),
    actions: z.array(z.object({
      label: z.string(),
      url: z.string().optional(),
      action: z.string().optional()
    })).optional()
  });

  userId!: string;
  type!: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'ALERT' | 'CRITICAL';
  title!: string;
  content!: string;
  metadata?: Record<string, any>;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expiresAt?: Date;
  actions?: Array<{
    label: string;
    url?: string;
    action?: string;
  }>;
}

export class UpdatePreferencesDTO {
  static schema = z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    inApp: z.boolean().optional(),
    sms: z.boolean().optional(),
    frequency: z.enum(['immediate', 'hourly', 'daily', 'weekly']).optional(),
    quietHours: z.object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    }).optional()
  });

  email?: boolean;
  push?: boolean;
  inApp?: boolean;
  sms?: boolean;
  frequency?: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours?: {
    start: string;
    end: string;
  };
}

export class MarkNotificationsReadDTO {
  static schema = z.object({
    notificationIds: z.array(z.string().uuid()).optional(),
    markAll: z.boolean().optional()
  }).refine(data => data.notificationIds || data.markAll, {
    message: 'Either notificationIds or markAll must be provided'
  });

  notificationIds?: string[];
  markAll?: boolean;
}

export class GetNotificationsDTO {
  static schema = z.object({
    limit: z.coerce.number().int().positive().max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
    unreadOnly: z.coerce.boolean().optional(),
    type: z.string().optional()
  });

  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: string;
}