# Admin Dashboard API Module

A comprehensive admin dashboard API module for managing users, monitoring system health, tracking revenue, moderating content, and configuring the system.

## Features

### User Management
- **Search & Filter**: Advanced user search with filters for status, role, verification, etc.
- **Bulk Actions**: Suspend, activate, delete, or reset passwords for multiple users
- **User Details**: Comprehensive user information including subscriptions, activity, and metrics
- **Impersonation**: Debug user issues by temporarily accessing their account
- **Activity Tracking**: Monitor user login patterns and API usage

### System Metrics & Monitoring
- **Real-time Metrics**: Live dashboard with active users, requests per minute, error rates
- **Performance Monitoring**: CPU, memory, response times, and database health
- **Revenue Analytics**: MRR, ARR, churn rate, LTV, growth trends
- **Usage Statistics**: API calls, feature adoption, storage usage
- **Health Checks**: Automated monitoring with alerts for degraded performance

### Content Moderation
- **Review Queue**: Approve, reject, or flag user-generated content
- **Bulk Moderation**: Process multiple items at once
- **Automated Rules**: Keyword filters, regex patterns for automatic moderation
- **Compliance Reports**: GDPR, COPPA, CCPA compliance tracking
- **Audit Trail**: Complete history of moderation actions

### System Configuration
- **Feature Flags**: Toggle features on/off without deployment
- **Rate Limits**: Configure API rate limits per plan
- **Security Settings**: Password policies, session timeouts, IP whitelisting
- **Maintenance Mode**: Enable/disable with custom messages
- **Email Templates**: Manage transactional email settings

### Announcements
- **System-wide Messages**: Create announcements for all users
- **Targeted Announcements**: Target specific user groups or tenants
- **Scheduling**: Schedule announcements for future dates
- **Analytics**: Track views, dismissals, and engagement

### Data Export
- **Multiple Formats**: Export data as CSV, JSON, or XLSX
- **Async Processing**: Large exports processed in background
- **Filtered Exports**: Apply date ranges and custom filters
- **Email Delivery**: Send export links via email when complete

### Audit & Compliance
- **Audit Logs**: Track all admin actions with full context
- **GDPR Tools**: Handle data access, deletion, and portability requests
- **Compliance Reports**: Generate reports for regulatory requirements
- **Data Retention**: Automated cleanup based on retention policies

## API Endpoints

### User Management
```
GET    /api/admin/users                      - Search and list users
GET    /api/admin/users/:userId              - Get user details
PUT    /api/admin/users/:userId              - Update user
POST   /api/admin/users/bulk-action          - Bulk user actions
GET    /api/admin/users/statistics           - User statistics
GET    /api/admin/users/:userId/activity     - User activity timeline
POST   /api/admin/users/:userId/impersonate  - Impersonate user
```

### System Metrics
```
GET    /api/admin/metrics                    - System metrics dashboard
GET    /api/admin/metrics/revenue            - Revenue metrics
GET    /api/admin/metrics/usage              - Usage metrics
GET    /api/admin/metrics/health             - System health
GET    /api/admin/metrics/realtime           - Real-time metrics
```

### Content Moderation
```
POST   /api/admin/moderation/review          - Review content
POST   /api/admin/moderation/bulk            - Bulk moderation
GET    /api/admin/moderation/reports         - Content reports
GET    /api/admin/moderation/statistics      - Moderation stats
GET    /api/admin/moderation/rules           - Get rules
PUT    /api/admin/moderation/rules/:id       - Update rule
```

### System Configuration
```
GET    /api/admin/config                     - Get configuration
PUT    /api/admin/config                     - Update configuration
POST   /api/admin/maintenance                - Enable maintenance
DELETE /api/admin/maintenance                - Disable maintenance
```

### Other Endpoints
```
GET    /api/admin/audit-logs                 - Query audit logs
POST   /api/admin/announcements              - Create announcement
GET    /api/admin/announcements              - List announcements
POST   /api/admin/export                     - Export data
POST   /api/admin/compliance/report          - Generate compliance report
POST   /api/admin/compliance/gdpr            - Handle GDPR request
```

## Usage Examples

### User Search with Filters
```typescript
GET /api/admin/users?status=ACTIVE&role=USER&verified=true&page=1&limit=20

Response:
{
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Bulk User Action
```typescript
POST /api/admin/users/bulk-action
{
  "userIds": ["user1", "user2", "user3"],
  "action": "suspend",
  "reason": "Terms of service violation",
  "notifyUsers": true
}
```

### System Metrics
```typescript
GET /api/admin/metrics?startDate=2024-01-01&endDate=2024-01-31

Response:
{
  "data": {
    "overview": {
      "totalUsers": 1250,
      "activeUsers": 890,
      "totalRevenue": 125000,
      "mrr": 45000,
      "activeSubscriptions": 420
    },
    "performance": {
      "cpu": 45,
      "memory": {
        "used": 2048,
        "total": 4096,
        "percentage": 50
      },
      "requestsPerMinute": 1250,
      "averageResponseTime": 145,
      "errorRate": 0.5
    },
    "trends": {
      "userGrowth": [...],
      "revenueGrowth": [...],
      "apiUsage": [...],
      "errorTrend": [...]
    }
  }
}
```

### Create Announcement
```typescript
POST /api/admin/announcements
{
  "title": "Scheduled Maintenance",
  "content": "We will be performing maintenance on Saturday...",
  "type": "maintenance",
  "targetAudience": "all",
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-02-02T00:00:00Z",
  "dismissible": true
}
```

### Export Data
```typescript
POST /api/admin/export
{
  "entityType": "users",
  "format": "xlsx",
  "filters": {
    "status": "ACTIVE"
  },
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "includeRelations": true,
  "async": true,
  "recipientEmail": "admin@example.com"
}
```

## Security

### Authentication & Authorization
- All endpoints require admin authentication (ADMIN or SUPER_ADMIN role)
- Some endpoints require SUPER_ADMIN role (system reset, dangerous operations)
- JWT-based authentication with role verification

### Rate Limiting
- Admin endpoints have separate rate limits
- Configurable per-endpoint limits
- IP-based and user-based limiting

### IP Whitelisting
- Optional IP whitelist for admin access
- Configurable per environment
- Bypass for super admins

### Audit Trail
- All admin actions are logged
- Includes user, action, timestamp, and context
- Immutable audit log with retention policies

## Configuration

### Environment Variables
```env
# Admin Features
ADMIN_REGISTRATION_ENABLED=true
ADMIN_IP_WHITELIST=192.168.1.0/24,10.0.0.0/8
ADMIN_SESSION_TIMEOUT=3600
ADMIN_RATE_LIMIT=1000
ADMIN_SUPER_ADMIN_EMAILS=super@example.com

# Audit & Compliance
AUDIT_LOG_RETENTION_DAYS=90
COMPLIANCE_REPORT_SCHEDULE=0 0 1 * *
GDPR_DATA_RETENTION_DAYS=1825

# Export Settings
EXPORT_MAX_RECORDS=100000
EXPORT_ASYNC_THRESHOLD=10000
EXPORT_STORAGE_PATH=exports/
```

### System Configuration (Dynamic)
The admin module allows dynamic configuration through the API:

```typescript
PUT /api/admin/config
{
  "features": {
    "registration": true,
    "oauth": true,
    "emailVerification": true
  },
  "limits": {
    "maxUsersPerTenant": 100,
    "apiRateLimit": 1000
  },
  "security": {
    "passwordMinLength": 10,
    "require2FAForAdmins": true
  }
}
```

## Middleware

### Admin Authentication
```typescript
import { adminAuth } from '@modules/admin/admin.middleware';

// Basic admin auth
fastify.addHook('onRequest', adminAuth());

// Super admin only
fastify.addHook('onRequest', adminAuth({ requireSuperAdmin: true }));

// With custom options
fastify.addHook('onRequest', adminAuth({
  allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
  checkIpWhitelist: true,
  rateLimit: { max: 100, window: 60 }
}));
```

### Permission-based Access
```typescript
import { requirePermission } from '@modules/admin/admin.middleware';

// Specific permission
fastify.addHook('onRequest', requirePermission('users.delete'));
```

### Audit Actions
```typescript
import { auditAction } from '@modules/admin/admin.middleware';

// Audit sensitive actions
fastify.addHook('onRequest', auditAction('user.delete'));
```

## Background Jobs

The admin module includes several background jobs:

1. **Metrics Aggregation** - Every 5 minutes
2. **Audit Log Cleanup** - Daily at 3 AM
3. **Health Checks** - Every 5 minutes
4. **Export Processing** - On demand

## Events

The admin module emits various events:

- `admin.user.suspended`
- `admin.user.activated`
- `admin.user.deleted`
- `admin.config.updated`
- `admin.announcement.created`
- `admin.content.reviewed`
- `system.maintenance.enabled`
- `system.maintenance.disabled`

## Best Practices

1. **Use Bulk Operations**: For multiple items, use bulk endpoints to reduce API calls
2. **Enable Audit Logging**: Always audit sensitive operations
3. **Set Up Alerts**: Configure alerts for critical metrics
4. **Regular Backups**: Export data regularly for backup
5. **Monitor Performance**: Use the metrics dashboard to identify issues
6. **Review Audit Logs**: Regularly review logs for suspicious activity

## Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**
   - Check current limits in config
   - Consider increasing limits for admin operations
   - Use bulk operations where possible

2. **Export Timeout**
   - Use async export for large datasets
   - Apply filters to reduce data size
   - Check background job queue status

3. **Missing Metrics**
   - Ensure Redis is running
   - Check metrics aggregation job
   - Verify time range parameters

4. **Permission Denied**
   - Verify user role (ADMIN vs SUPER_ADMIN)
   - Check IP whitelist settings
   - Review audit logs for details

## Future Enhancements

- [ ] Custom admin dashboards
- [ ] Webhook notifications for critical events
- [ ] Advanced analytics with ML insights
- [ ] Automated threat detection
- [ ] Multi-language support for announcements
- [ ] Custom report builder
- [ ] API versioning for admin endpoints
