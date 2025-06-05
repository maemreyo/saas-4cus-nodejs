import { z } from 'zod';

export class TrackEventDTO {
  static schema = z.object({
    event: z.string(),
    properties: z.record(z.any()).optional(),
    sessionId: z.string().optional(),
    deviceId: z.string().optional(),
    utm: z.object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional()
    }).optional()
  });

  event!: string;
  properties?: Record<string, any>;
  sessionId?: string;
  deviceId?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

export class GetDashboardDTO {
  dateRange?: number = 30;
  tenantId?: string;
}

export class GetFunnelDTO {
  static schema = z.object({
    steps: z.array(z.string()).min(2),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    groupBy: z.string().optional(),
    tenantId: z.string().optional()
  });

  steps!: string[];
  startDate?: string;
  endDate?: string;
  groupBy?: string;
  tenantId?: string;
}

export class GetCohortDTO {
  cohortSize?: 'day' | 'week' | 'month' = 'week';
  periods?: number = 8;
  tenantId?: string;
}

export class GenerateReportDTO {
  static schema = z.object({
    type: z.enum(['dashboard', 'revenue', 'users', 'custom']),
    format: z.enum(['pdf', 'csv', 'json']),
    recipients: z.array(z.string().email()).optional(),
    filters: z.object({
      tenantId: z.string().optional(),
      dateRange: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional()
    }).optional(),
    customQuery: z.any().optional()
  });

  type!: 'dashboard' | 'revenue' | 'users' | 'custom';
  format!: 'pdf' | 'csv' | 'json';
  recipients?: string[];
  filters?: {
    tenantId?: string;
    dateRange?: number;
    startDate?: string;
    endDate?: string;
  };
  customQuery?: any;
}

export class ScheduleReportDTO {
  static schema = GenerateReportDTO.schema.extend({
    name: z.string(),
    schedule: z.object({
      frequency: z.enum(['daily', 'weekly', 'monthly']),
      dayOfWeek: z.number().min(0).max(6).optional(),
      dayOfMonth: z.number().min(1).max(31).optional(),
      hour: z.number().min(0).max(23).optional()
    })
  });

  name!: string;
  type!: 'dashboard' | 'revenue' | 'users' | 'custom';
  format!: 'pdf' | 'csv' | 'json';
  recipients?: string[];
  schedule!: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    hour?: number;
  };
  filters?: any;
}