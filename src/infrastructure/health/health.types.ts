/**
 * Health status enum
 */
export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy'
}

/**
 * Health check result interface
 */
export interface HealthCheckResult {
  status: HealthStatus;
  message: string;
  details?: Record<string, any>;
  error?: string;
  timestamp?: string;
}

/**
 * Health check function type
 */
export type HealthCheckFn = () => Promise<HealthCheckResult>;

/**
 * Health check registry entry
 */
export interface HealthCheckEntry {
  name: string;
  check: HealthCheckFn;
  description?: string;
  tags?: string[];
}

/**
 * Health check summary
 */
export interface HealthSummary {
  status: HealthStatus;
  checks: Record<string, HealthCheckResult>;
  timestamp: string;
}
