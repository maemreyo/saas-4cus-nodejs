import { z } from 'zod';
import { UserRole, UserStatus, TicketStatus, TicketPriority } from '@prisma/client';

// User Management DTOs
export class UserSearchDTO {
  static schema = z.object({
    query: z.string().optional(),
    email: z.string().email().optional(),
    status: z.nativeEnum(UserStatus).optional(),
    role: z.nativeEnum(UserRole).optional(),
    verified: z.boolean().optional(),
    tenantId: z.string().optional(),
    createdAfter: z.string().datetime().optional(),
    createdBefore: z.string().datetime().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sort: z.enum(['createdAt', 'lastLoginAt', 'loginCount']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc')
  });
}

export class UpdateUserDTO {
  static schema = z.object({
    email: z.string().email().optional(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    displayName: z.string().max(100).optional(),
    role: z.nativeEnum(UserRole).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    emailVerified: z.boolean().optional(),
    metadata: z.record(z.any()).optional()
  });
}

export class BulkUserActionDTO {
  static schema = z.object({
    userIds: z.array(z.string()).min(1).max(100),
    action: z.enum(['suspend', 'activate', 'delete', 'verify_email', 'reset_password']),
    reason: z.string().optional(),
    notifyUsers: z.boolean().default(true)
  });
}

// System Configuration DTOs
export class SystemConfigDTO {
  static schema = z.object({
    maintenance: z.object({
      enabled: z.boolean(),
      message: z.string().optional(),
      allowedIps: z.array(z.string()).optional()
    }).optional(),
    features: z.object({
      registration: z.boolean().optional(),
      oauth: z.boolean().optional(),
      twoFactorAuth: z.boolean().optional(), // Changed from twoFactor to twoFactorAuth
      emailVerification: z.boolean().optional()
    }).optional(),
    limits: z.object({
      maxUsersPerTenant: z.number().int().positive().optional(),
      maxProjectsPerUser: z.number().int().positive().optional(),
      maxFileSize: z.number().int().positive().optional(),
      apiRateLimit: z.number().int().positive().optional()
    }).optional(),
    security: z.object({
      passwordMinLength: z.number().int().min(6).optional(),
      sessionTimeout: z.number().int().positive().optional(),
      maxLoginAttempts: z.number().int().positive().optional(),
      lockoutDuration: z.number().int().positive().optional()
    }).optional()
  });

  maintenance?: {
    enabled: boolean;
    message?: string;
    allowedIps?: string[];
  };
  features?: {
    registration?: boolean;
    oauth?: boolean;
    twoFactorAuth?: boolean;
    emailVerification?: boolean;
  };
  limits?: {
    maxUsersPerTenant?: number;
    maxProjectsPerUser?: number;
    maxFileSize?: number;
    apiRateLimit?: number;
  };
  security?: {
    passwordMinLength?: number;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
  };
}

// Analytics & Metrics DTOs
export class MetricsQueryDTO {
  static schema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    interval: z.enum(['hour', 'day', 'week', 'month']).default('day'),
    metrics: z.array(z.enum([
      'users', 'revenue', 'api_calls', 'errors', 'tickets',
      'subscriptions', 'churn_rate', 'conversion_rate'
    ])).optional()
  });
}

export class SystemHealthQueryDTO {
  static schema = z.object({
    includeMetrics: z.boolean().default(true),
    includeDependencies: z.boolean().default(true),
    includeErrors: z.boolean().default(true)
  });
}

// Content Moderation DTOs
export class ContentReviewDTO {
  static schema = z.object({
    entityType: z.enum(['user', 'project', 'file', 'ticket', 'comment']),
    entityId: z.string(),
    status: z.enum(['pending', 'approved', 'rejected', 'flagged']),
    reason: z.string().optional(),
    notes: z.string().optional()
  });
}

export class BulkContentActionDTO {
  static schema = z.object({
    items: z.array(z.object({
      entityType: z.string(),
      entityId: z.string()
    })).min(1).max(100),
    action: z.enum(['approve', 'reject', 'flag', 'delete']),
    reason: z.string().optional()
  });

  items!: Array<{ entityType: string; entityId: string }>;
  action!: 'approve' | 'reject' | 'flag' | 'delete';
  reason?: string;
}

// Audit & Compliance DTOs
export class AuditLogQueryDTO {
  static schema = z.object({
    userId: z.string().optional(),
    action: z.string().optional(),
    entity: z.string().optional(),
    entityId: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50)
  });
}

// Revenue & Billing DTOs
export class RevenueQueryDTO {
  static schema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    groupBy: z.enum(['day', 'week', 'month', 'plan', 'tenant']).default('month'),
    planId: z.string().optional(),
    tenantId: z.string().optional(),
    includeChurn: z.boolean().default(false),
    includeMRR: z.boolean().default(true)
  });
}

export class RefundDTO {
  static schema = z.object({
    subscriptionId: z.string(),
    amount: z.number().positive().optional(),
    reason: z.string(),
    notifyCustomer: z.boolean().default(true)
  });
}

// Support & Tickets DTOs
export class TicketStatsQueryDTO {
  static schema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    assigneeId: z.string().optional(),
    categoryId: z.string().optional(),
    status: z.nativeEnum(TicketStatus).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    groupBy: z.enum(['status', 'priority', 'category', 'assignee', 'day']).optional()
  });
}

// Feature Usage DTOs
export class FeatureUsageQueryDTO {
  static schema = z.object({
    featureId: z.string().optional(),
    userId: z.string().optional(),
    tenantId: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    groupBy: z.enum(['feature', 'user', 'tenant', 'day']).default('feature'),
    limit: z.number().int().positive().max(100).default(10)
  });
}

// Announcement DTOs
export class CreateAnnouncementDTO {
  static schema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1),
    type: z.enum(['info', 'warning', 'critical', 'maintenance']),
    targetAudience: z.enum(['all', 'users', 'admins', 'specific']).default('all'),
    targetUserIds: z.array(z.string()).optional(),
    targetTenantIds: z.array(z.string()).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    dismissible: z.boolean().default(true)
  });

  title!: string;
  content!: string;
  type!: 'info' | 'warning' | 'critical' | 'maintenance';
  targetAudience?: 'all' | 'users' | 'admins' | 'specific' = 'all';
  targetUserIds?: string[];
  targetTenantIds?: string[];
  startDate?: string;
  endDate?: string;
  dismissible?: boolean = true;
  createdBy?: string; // Added for the controller
}

// Export/Import DTOs
export class DataExportDTO {
  static schema = z.object({
    entityType: z.enum(['users', 'subscriptions', 'invoices', 'tickets', 'analytics']),
    format: z.enum(['csv', 'json', 'xlsx']),
    filters: z.record(z.any()).optional(),
    dateRange: z.object({
      start: z.string().datetime(),
      end: z.string().datetime()
    }).optional(),
    includeRelations: z.boolean().default(false)
  });

  entityType!: 'users' | 'subscriptions' | 'invoices' | 'tickets' | 'analytics';
  format!: 'csv' | 'json' | 'xlsx';
  filters?: Record<string, any>;
  dateRange?: {
    start: string;
    end: string;
  };
  includeRelations?: boolean;
  // Add these fields to match ExportOptions interface
  fields?: string[];
  limit?: number;
  async?: boolean;
  recipientEmail?: string;
}
