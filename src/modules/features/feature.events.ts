export const FeatureEvents = {
  // Feature management
  FEATURE_CREATED: 'feature.created',
  FEATURE_UPDATED: 'feature.updated',
  FEATURE_DELETED: 'feature.deleted',

  // Plan management
  PLAN_CREATED: 'plan.created',
  PLAN_UPDATED: 'plan.updated',
  PLAN_DELETED: 'plan.deleted',

  // Feature flags
  FEATURE_FLAG_UPDATED: 'feature.flag.updated',

  // Usage
  FEATURE_USED: 'feature.used',
  USAGE_LIMIT_REACHED: 'feature.usage.limit_reached',
  USAGE_LIMIT_WARNING: 'feature.usage.limit_warning'
} as const;

export type FeatureEventName = typeof FeatureEvents[keyof typeof FeatureEvents];