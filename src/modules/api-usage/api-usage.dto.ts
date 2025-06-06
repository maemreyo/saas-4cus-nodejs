import { z } from 'zod';

export class GetUsageStatsDTO {
  startDate?: string;
  endDate?: string;
  groupBy?: 'hour' | 'day' | 'month';
}

export class GetUsageTimeSeriesDTO {
  static schema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    groupBy: z.enum(['hour', 'day', 'month']),
    endpoint: z.string().optional(),
    userId: z.string().uuid().optional() // For admin to query specific user
  });

  startDate!: string;
  endDate!: string;
  groupBy!: 'hour' | 'day' | 'month';
  endpoint?: string;
  userId?: string;
}

export class GetEndpointAnalyticsDTO {
  startDate?: string;
  endDate?: string;
}

export class ExportUsageDataDTO {
  static schema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    format: z.enum(['csv', 'json'])
  });

  startDate!: string;
  endDate!: string;
  format!: 'csv' | 'json';
}

export class ApiUsageTrackingDTO {
  static schema = z.object({
    endpoint: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
    statusCode: z.number().int().min(100).max(599),
    responseTime: z.number().int().min(0),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    metadata: z.record(z.any()).optional()
  });

  endpoint!: string;
  method!: string;
  statusCode!: number;
  responseTime!: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}
