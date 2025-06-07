# Tenant Module

A comprehensive multi-tenancy system supporting organizations, team management, invitations, and tenant-scoped data isolation.

## Features

### Core Features
- **Tenant Management**: Create and manage organizations/tenants
- **Team Members**: Invite and manage team members with roles
- **Role-based Access**: Owner, Admin, and Member roles
- **Invitations**: Email-based invitation system
- **Tenant Context**: Automatic tenant scoping for data
- **Subdomain Support**: Each tenant can have its own subdomain

### Advanced Features
- **Ownership Transfer**: Transfer tenant ownership
- **Member Permissions**: Granular role-based permissions
- **Tenant Statistics**: Usage metrics per tenant
- **Custom Domains**: Support for custom domains (optional)
- **Tenant Isolation**: Data isolation between tenants
- **Bulk Invitations**: Invite multiple members at once

## API Endpoints

### Tenant Management
```
GET    /api/tenants/my-tenants        - List user's tenants
POST   /api/tenants                   - Create new tenant
GET    /api/tenants/current           - Get current tenant (from context)
GET    /api/tenants/:tenantId         - Get tenant details
PUT    /api/tenants/:tenantId         - Update tenant
DELETE /api/tenants/:tenantId         - Delete tenant
GET    /api/tenants/:tenantId/stats   - Get tenant statistics
```

### Member Management
```
GET    /api/tenants/:tenantId/members              - List members
POST   /api/tenants/:tenantId/members/invite       - Invite member
PUT    /api/tenants/:tenantId/members/:id/role     - Update member role
DELETE /api/tenants/:tenantId/members/:id          - Remove member
POST   /api/tenants/:tenantId/leave                - Leave tenant
POST   /api/tenants/invitations/:token/accept      - Accept invitation
```

### Ownership
```
POST   /api/tenants/:tenantId/transfer-ownership   - Transfer ownership
```

## Usage Examples

### Create Tenant
```typescript
POST /api/tenants
{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "description": "Leading software company",
  "logo": "https://example.com/logo.png"
}

Response:
{
  "message": "Tenant created successfully",
  "data": {
    "id": "tenant-123",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "ownerId": "user-123",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Invite Team Members
```typescript
POST /api/tenants/tenant-123/members/invite
{
  "email": "john@example.com",
  "role": "ADMIN",
  "sendEmail": true
}

Response:
{
  "message": "Invitation sent successfully"
}
```

### Get Tenant Members
```typescript
GET /api/tenants/tenant-123/members?role=ADMIN&limit=20

Response:
{
  "data": {
    "members": [
      {
        "id": "member-123",
        "userId": "user-456",
        "role": "ADMIN",
        "joinedAt": "2024-01-10T10:00:00Z",
        "user": {
          "id": "user-456",
          "email": "john@example.com",
          "displayName": "John Doe",
          "avatar": "https://..."
        }
      }
    ],
    "total": 5
  }
}
```

### Update Member Role
```typescript
PUT /api/tenants/tenant-123/members/user-456/role
{
  "role": "ADMIN"
}
```

### Transfer Ownership
```typescript
POST /api/tenants/tenant-123/transfer-ownership
{
  "newOwnerId": "user-789"
}
```

## Member Roles

### OWNER
- Full control over tenant
- Can delete tenant
- Can transfer ownership
- Can manage all members
- Cannot be removed

### ADMIN
- Can manage tenant settings
- Can invite/remove members (except owner)
- Can manage member roles (except owner)
- Cannot delete tenant

### MEMBER
- Basic access to tenant resources
- Cannot manage other members
- Cannot change tenant settings

## Tenant Context

The module provides automatic tenant context for requests:

### Subdomain Detection
```
https://acme-corp.app.com → Tenant: acme-corp
```

### Header Detection
```
X-Tenant-Id: tenant-123
X-Tenant-Slug: acme-corp
```

### Middleware Usage
```typescript
import { requireTenant, requireTenantRole } from '@modules/tenant/tenant.middleware';

// Require tenant context
app.get('/api/projects', {
  preHandler: [requireTenant()]
}, handler);

// Require specific role
app.post('/api/projects', {
  preHandler: [requireTenantRole(['OWNER', 'ADMIN'])]
}, handler);
```

## Invitation Flow

1. **Send Invitation**
   - Admin invites user by email
   - System creates invitation with token
   - Email sent with invitation link

2. **Accept Invitation**
   - User clicks invitation link
   - System validates token and email
   - User added to tenant with specified role

3. **Invitation Expiry**
   - Invitations expire after 7 days
   - Expired invitations can be resent

## Tenant Statistics

Get comprehensive statistics for a tenant:
```typescript
GET /api/tenants/tenant-123/stats

Response:
{
  "data": {
    "members": 25,
    "projects": 12,
    "storage": {
      "used": 5368709120,      // bytes
      "usedMB": 5120          // MB
    },
    "apiCalls": 45678
  }
}
```

## Events

The tenant module emits:
- `tenant.created`
- `tenant.updated`
- `tenant.deleted`
- `tenant.member.invited`
- `tenant.member.joined`
- `tenant.member.left`
- `tenant.member.removed`
- `tenant.member.role_updated`
- `tenant.ownership.transferred`

## Configuration

### Environment Variables
```env
# Tenant Settings
TENANT_SUBDOMAIN_ENABLED=true
TENANT_CUSTOM_DOMAIN_ENABLED=false
TENANT_MAX_MEMBERS=100
TENANT_INVITATION_EXPIRY_DAYS=7

# Default Limits
MAX_TENANTS_PER_USER=5
MAX_PROJECTS_PER_TENANT=50
```

## Best Practices

1. **Unique Slugs**: Ensure tenant slugs are unique and URL-safe
2. **Role Hierarchy**: Respect role hierarchy in permissions
3. **Data Isolation**: Always filter by tenant ID in queries
4. **Invitation Security**: Use secure random tokens
5. **Ownership Transfer**: Require confirmation for ownership transfers
6. **Soft Deletes**: Implement soft deletes for data recovery

## Security Considerations

1. **Data Isolation**: Ensure queries are always scoped to tenant
2. **Permission Checks**: Verify user has access to tenant
3. **Invitation Tokens**: Use cryptographically secure tokens
4. **Rate Limiting**: Limit invitation sending to prevent spam
5. **Audit Trail**: Log all tenant-related actions

## Multi-tenancy Patterns

### Database Isolation
- Shared database with tenant_id column
- Row-level security for data isolation
- Indexed tenant_id for performance

### Request Context
- Tenant context available throughout request
- Automatic tenant filtering in queries
- Middleware for tenant validation

### Caching Strategy
- Cache keys include tenant ID
- Tenant-specific cache invalidation
- Shared cache for public data

## Troubleshooting

### Common Issues

1. **"No tenant context" errors**
   - Ensure tenant middleware is applied
   - Check subdomain configuration
   - Verify headers are being sent

2. **Members not appearing**
   - Check invitation was accepted
   - Verify user email matches invitation
   - Ensure member wasn't removed

3. **Permission denied**
   - Verify user's role in tenant
   - Check required permissions
   - Ensure tenant context is set

4. **Invitation not received**
   - Check email configuration
   - Verify email address
   - Check spam folder
   - Resend invitation if expired
