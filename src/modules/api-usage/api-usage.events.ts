export const ApiUsageEvents = {
  // Usage tracking
  API_USAGE_TRACKED: 'api.usage.tracked',

  // Rate limiting
  RATE_LIMIT_WARNING: 'api.rate_limit.warning',
  RATE_LIMIT_EXCEEDED: 'api.rate_limit.exceeded',

  // Quota management
  QUOTA_WARNING: 'api.quota.warning',
  QUOTA_EXCEEDED: 'api.quota.exceeded',
  QUOTA_RESET: 'api.quota.reset',

  // Alerts
  HIGH_ERROR_RATE: 'api.alerts.high_error_rate',
  SLOW_RESPONSE_TIME: 'api.alerts.slow_response_time',
  ENDPOINT_DOWN: 'api.alerts.endpoint_down',

  // Analytics
  USAGE_REPORT_GENERATED: 'api.analytics.report_generated',
  USAGE_EXPORTED: 'api.analytics.exported',

  // Billing integration
  USAGE_LIMIT_REACHED: 'api.usage.limit_reached',
  USAGE_LIMIT_WARNING: 'api.usage.limit_warning',

  // System events
  API_HEALTH_DEGRADED: 'api.health.degraded',
  API_HEALTH_UNHEALTHY: 'api.health.unhealthy',
  API_HEALTH_RECOVERED: 'api.health.recovered'
} as const;

export type ApiUsageEventName = typeof ApiUsageEvents[keyof typeof ApiUsageEvents];