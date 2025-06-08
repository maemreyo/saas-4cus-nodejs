# Features Module

A comprehensive feature management system with entitlements, feature flags, and usage tracking.

## Features

### Core Features
- **Feature Management**: Define and manage application features
- **Plan Management**: Create subscription plans with feature sets
- **Entitlements**: Check and enforce feature access based on plans
- **Feature Flags**: Control feature rollout with percentage-based deployment
- **Usage Tracking**: Monitor feature usage and enforce limits
- **Plan Comparison**: Compare features across different plans

### Advanced Features
- **Usage Limits**: Set and enforce usage quotas per feature
- **Feature Categories**: Organize features by category
- **Popular Plans**: Highlight recommended plans
- **Trial Periods**: Support trial periods for plans
- **Rollout Control**: Gradual feature rollout with user targeting

## API Endpoints

### Public Endpoints
```
GET    /api/features/plans             - Get all plans
GET    /api/features/plans/:slug       - Get plan details
GET    /api/features/plans/compare     - Compare multiple plans
```

### Protected Endpoints
```
GET    /api/features/features          - Get all features
GET    /api/features/flags             - Get user's feature flags
GET    /api/features/flags/:key        - Check specific feature flag
GET    /api/features/entitlements      - Get user's entitlements
POST   /api/features/entitlements/check - Check feature entitlement
POST   /api/features/entitlements/consume - Consume feature usage
POST   /api/features/track             - Track feature usage
```

### Admin Endpoints
```
POST   /api/features/features          - Create feature
POST   /api/features/plans             - Create plan
PUT    /api/features/plans/:planId     - Update plan
PUT    /api/features/flags/:key        - Update feature flag
GET    /api/features/features/:key/stats - Get feature usage statistics
```

## Usage Examples

### Check Feature Entitlement
```typescript
POST /api/features/entitlements/check
{
  "feature": "api_calls"
}

Response:
{
  "data": {
    "feature": "api_calls",
    "access": true,
    "limit": 10000,
    "used": 2500,
    "remaining": 7500
  }
}
```

### Consume Feature Usage
```typescript
POST /api/features/entitlements/consume
{
  "feature": "api_calls",
  "amount": 100
}
```

### Create Plan
```typescript
POST /api/features/plans
{
  "name": "Professional",
  "slug": "professional",
  "price": 4900, // in cents
  "interval": "month",
  "features": [
    { "featureId": "feature-1", "included": true },
    { "featureId": "feature-2", "included": true, "limitValue": 10000 }
  ]
}
```

### Update Feature Flag
```typescript
PUT /api/features/flags/new_dashboard
{
  "enabled": true,
  "rolloutPercentage": 50,
  "userWhitelist": ["user-123", "user-456"]
}
```

## Middleware Usage

```typescript
import { requireFeature, consumeFeature, featureFlag } from '@modules/features/feature.middleware';

// Require feature access
fastify.get('/api/advanced-analytics',
  { preHandler: [requireFeature('advanced_analytics')] },
  handler
);

// Consume feature on use
fastify.post('/api/reports/generate',
  { preHandler: [consumeFeature('report_generation', 1)] },
  handler
);

// Check feature flag
fastify.get('/api/v2/dashboard',
  { preHandler: [featureFlag('new_dashboard')] },
  handler
);
```

## Feature Flag Configuration

```typescript
{
  "key": "new_feature",
  "enabled": true,
  "rolloutPercentage": 25,      // 25% of users
  "userWhitelist": ["user-123"], // Always enabled for these users
  "userBlacklist": ["user-456"], // Always disabled for these users
  "metadata": {
    "description": "New experimental feature",
    "owner": "product-team"
  }
}
```

## Events

The features module emits:
- `feature.created`
- `feature.updated`
- `feature.deleted`
- `plan.created`
- `plan.updated`
- `plan.deleted`
- `feature.flag.updated`
- `feature.used`
- `feature.usage.limit_reached`
- `feature.usage.limit_warning`

## Best Practices

1. **Feature Keys**: Use lowercase with underscores (e.g., `api_calls`)
2. **Plan Slugs**: Use lowercase with hyphens (e.g., `professional-plan`)
3. **Usage Tracking**: Track usage for metered features only
4. **Cache Strategy**: Cache entitlements with appropriate TTL
5. **Gradual Rollout**: Start with small percentages for new features

## Configuration

```env
# Feature Flags
FEATURE_FLAGS_ENABLED=true
FEATURE_FLAGS_CACHE_TTL=300

# Usage Tracking
USAGE_TRACKING_ENABLED=true
USAGE_TRACKING_BATCH_SIZE=100
```
