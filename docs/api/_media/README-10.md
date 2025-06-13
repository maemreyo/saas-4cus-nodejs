# API Usage & Metering Module

A comprehensive API usage tracking and metering system for monitoring, rate limiting, and billing integration.

## Features

### Core Features
- **Usage Tracking**: Track every API call with detailed metrics
- **Rate Limiting**: Flexible rate limiting per endpoint and plan
- **Quota Management**: Monthly quotas with automatic reset
- **Real-time Metrics**: Live monitoring of API performance
- **Usage Analytics**: Detailed analytics and reporting
- **Health Monitoring**: Automatic health checks with alerts

### Advanced Features
- **Plan-based Limits**: Different limits for each subscription plan
- **Endpoint Analytics**: Per-endpoint performance metrics
- **Alert System**: Automatic alerts for high error rates, slow responses
- **Usage Export**: Export usage data in CSV or JSON format
- **Incident Management**: Automatic incident creation for critical issues
- **Cost Tracking**: Integration with billing for usage-based pricing

## Architecture

### Database Schema
```prisma
- ApiUsage: Tracks individual API calls
- FeatureUsage: Tracks feature-specific usage
- Incident: Tracks system incidents
- IncidentUpdate: Incident timeline updates
```

### Services
- **ApiUsageService**: Core usage tracking and analytics
- **NotificationService**: Alert and notification delivery
- **Queue Processors**: Background jobs for aggregation and cleanup
- **Event Handlers**: React to usage events and triggers

## API Endpoints

### User Endpoints
```
GET    /api/api-usage/stats                      - Get usage statistics
POST   /api/api-usage/time-series                - Get time series data
GET    /api/api-usage/rate-limit                 - Check current rate limits
GET    /api/api-usage/quota                      - Get usage quotas
POST   /api/api-usage/export                     - Export usage data
GET    /api/api-usage/endpoints/:endpoint/analytics - Get endpoint analytics
```

### Admin Endpoints
```
GET    /api/api-usage/top-users                  - Get top API users
GET    /api/api-usage/system-metrics             - Get system-wide metrics
```

### Health Endpoint (Public)
```
GET    /api/api-usage/health                     - API health status
```

## Usage Examples

### Tracking API Usage (Automatic)
The middleware automatically tracks all API calls:
```typescript
// In your Fastify server setup
app.addHook('onRequest', trackApiUsage);
```

### Manual Usage Tracking
```typescript
await apiUsageService.trackUsage(
  userId,
  '/api/users',
  'GET',
  200,
  45, // response time in ms
  {
    tenantId: 'tenant-123',
    metadata: { filtered: true }
  }
);
```

### Rate Limiting Middleware
```typescript
// Global rate limiting
app.addHook('onRequest', planBasedRateLimit);

// Endpoint-specific rate limiting
app.get('/api/expensive-operation', {
  preHandler: [endpointRateLimit('/api/expensive-operation', 10, 60000)]
}, handler);
```

### Checking Usage Quota
```typescript
const quotas = await apiUsageService.getUsageQuota(userId);
// Returns array of quotas with usage info
```

### Getting Analytics
```typescript
const stats = await apiUsageService.getUsageStats(userId, tenantId, {
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  groupBy: 'day'
});
```

## Rate Limiting

### Default Limits by Plan
- **Free**: 1,000 requests/month, 100/hour
- **Starter**: 10,000 requests/month, 500/hour
- **Pro**: 100,000 requests/month, 2,000/hour
- **Enterprise**: Unlimited

### Rate Limit Headers
All responses include rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 2024-01-15T10:00:00Z
X-Quota-Limit: 10000
X-Quota-Remaining: 8456
X-Quota-Reset: 2024-02-01T00:00:00Z
```

## Monitoring & Alerts

### Automatic Alerts
- **High Error Rate**: > 10% errors trigger alert
- **Slow Response**: > 3s average response time
- **Quota Warning**: At 80%, 90%, and 95% usage
- **Health Degradation**: Automatic incident creation

### Health Check Response
```json
{
  "status": "healthy",
  "metrics": {
    "requestsPerMinute": 156,
    "errorRate": 0.5,
    "averageResponseTime": 245,
    "activeEndpoints": 23
  },
  "issues": []
}
```

## Background Jobs

### Scheduled Tasks
- **Health Check**: Every 5 minutes
- **Metrics Aggregation**: Every hour
- **Alert Checking**: Every 30 minutes
- **Quota Reset**: Monthly on the 1st
- **Data Cleanup**: Daily at 3 AM (90-day retention)

## Events

The module emits various events for integration:
- `api.usage.tracked`
- `api.rate_limit.exceeded`
- `api.quota.exceeded`
- `api.health.degraded`
- `api.health.unhealthy`
- `api.health.recovered`

## Configuration

### Environment Variables
```env
# API Rate Limiting
API_RATE_LIMIT_WINDOW_MS=60000
API_RATE_LIMIT_MAX_REQUESTS=100

# Usage Tracking
API_USAGE_RETENTION_DAYS=90
API_USAGE_AGGREGATION_INTERVAL=3600

# Alerts
API_ERROR_RATE_THRESHOLD=10
API_SLOW_RESPONSE_THRESHOLD=3000
OPS_ALERT_EMAIL=ops@example.com

# Health Monitoring
API_HEALTH_CHECK_INTERVAL=300
API_HEALTH_DEGRADED_THRESHOLD=10
API_HEALTH_UNHEALTHY_THRESHOLD=25
```

## Middleware Usage

### Global Middleware Setup
```typescript
// Track all API usage
app.addHook('onRequest', trackApiUsage);

// Enforce API quotas
app.addHook('onRequest', enforceApiQuota());

// Plan-based rate limiting
app.addHook('onRequest', planBasedRateLimit);
```

### Route-Specific Middleware
```typescript
// High-rate endpoint
app.post('/api/bulk-operation', {
  preHandler: [
    endpointRateLimit('/api/bulk-operation', 5, 60000) // 5 per minute
  ]
}, handler);

// Skip tracking for specific routes
app.get('/health', {
  config: { skipTracking: true }
}, handler);
```

## Performance Considerations

1. **Async Tracking**: Usage tracking is async to not impact response times
2. **Redis Caching**: Metrics are cached in Redis for fast access
3. **Batch Processing**: Aggregation done in batches for efficiency
4. **Selective Tracking**: Skip tracking for health/metrics endpoints

## Integration with Billing

The module integrates with the billing system:
- Enforces plan-based limits
- Tracks usage for usage-based billing
- Triggers upgrade prompts when limits reached
- Resets quotas based on billing cycle

## Troubleshooting

### Common Issues

1. **Rate Limit Not Working**
   - Check Redis connection
   - Verify middleware order
   - Check plan configuration

2. **Missing Usage Data**
   - Verify trackApiUsage middleware is registered
   - Check database write permissions
   - Look for errors in logs

3. **High Memory Usage**
   - Reduce aggregation window
   - Increase cleanup frequency
   - Check for metric cardinality

### Debug Mode
Enable detailed logging:
```env
LOG_LEVEL=debug
API_USAGE_DEBUG=true
```

## Best Practices

1. **Endpoint Design**: Use consistent, RESTful endpoints for better analytics
2. **Error Handling**: Return proper status codes for accurate metrics
3. **Rate Limit Design**: Set realistic limits based on actual usage patterns
4. **Monitoring**: Set up alerts for critical thresholds
5. **Data Retention**: Balance between insights and storage costs

## Security

- API keys and tokens are never logged
- User data is aggregated for privacy
- Rate limiting prevents abuse
- Quota enforcement prevents resource exhaustion

## Future Enhancements

- GraphQL query complexity tracking
- Cost estimation per API call
- Predictive scaling based on usage patterns
- Custom metrics and dimensions
- Real-time usage dashboards
- SLA monitoring and reporting
