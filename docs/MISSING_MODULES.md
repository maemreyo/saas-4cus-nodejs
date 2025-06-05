# Missing SaaS Modules for Complete Template

## 🏦 1. Payment & Billing Module

### Core Features Needed:
```typescript
// src/modules/billing/
├── billing.service.ts       // Stripe integration
├── subscription.service.ts  // Subscription management
├── invoice.service.ts      // Invoice generation
├── payment-method.service.ts
├── webhook.controller.ts   // Stripe webhooks
└── models/
    ├── subscription.model.ts
    ├── invoice.model.ts
    └── payment-method.model.ts
```

### Key Components:
- Stripe integration for payments
- Subscription lifecycle management (create, upgrade, downgrade, cancel)
- Usage-based billing support
- Invoice generation and management
- Payment method management
- Dunning management (failed payments)
- Tax calculation (Stripe Tax or similar)
- Refund handling

## 🏢 2. Multi-Tenancy Module

### Structure:
```typescript
// src/modules/tenant/
├── tenant.service.ts
├── tenant.middleware.ts    // Tenant isolation
├── tenant.repository.ts
└── models/
    ├── tenant.model.ts
    ├── tenant-member.model.ts
    └── tenant-settings.model.ts
```

### Features:
- Tenant (organization/workspace) creation
- User-to-tenant relationships
- Tenant-based data isolation
- Tenant settings and customization
- Invitation system for team members
- Role-based permissions per tenant

## 📊 3. Analytics & Reporting Module

```typescript
// src/modules/analytics/
├── analytics.service.ts
├── metrics.collector.ts
├── report.generator.ts
└── dashboards/
    ├── admin.dashboard.ts
    ├── user.dashboard.ts
    └── revenue.dashboard.ts
```

### Features:
- User activity tracking
- Revenue analytics
- Feature usage metrics
- Custom event tracking
- Report generation (PDF/CSV)
- Real-time dashboards
- Retention metrics

## 🎯 4. Feature Flags & Plans Module

```typescript
// src/modules/features/
├── feature-flag.service.ts
├── plan.service.ts
├── entitlement.service.ts
└── models/
    ├── plan.model.ts
    ├── feature.model.ts
    └── plan-feature.model.ts
```

### Features:
- Feature flag management
- Plan definitions (Free, Pro, Enterprise)
- Feature-to-plan mapping
- Usage limits per plan
- Feature rollout controls
- A/B testing support

## 🎫 5. Support Ticket System

```typescript
// src/modules/support/
├── ticket.service.ts
├── ticket.controller.ts
├── ticket.queue.ts
└── models/
    ├── ticket.model.ts
    ├── ticket-message.model.ts
    └── ticket-category.model.ts
```

### Features:
- Ticket creation and management
- Priority levels
- Assignment to support agents
- Email integration
- Knowledge base integration
- SLA tracking

## 📧 6. Advanced Email Marketing Module

```typescript
// src/modules/marketing/
├── campaign.service.ts
├── email-list.service.ts
├── automation.service.ts
└── templates/
    ├── drip-campaigns/
    ├── newsletters/
    └── transactional/
```

### Features:
- Email campaign management
- Drip campaigns
- Segmentation
- A/B testing
- Analytics and tracking
- Unsubscribe management
- Email templates

## 🔌 7. Webhook Management Module

```typescript
// src/modules/webhooks/
├── webhook.service.ts
├── webhook-delivery.service.ts
├── webhook-retry.queue.ts
└── models/
    ├── webhook-endpoint.model.ts
    └── webhook-event.model.ts
```

### Features:
- Webhook endpoint management
- Event subscription
- Delivery with retry logic
- Signature verification
- Event logs
- Failed delivery handling

## 👤 8. User Onboarding Module

```typescript
// src/modules/onboarding/
├── onboarding.service.ts
├── onboarding-flow.service.ts
├── progress-tracker.service.ts
└── flows/
    ├── user-onboarding.flow.ts
    └── team-onboarding.flow.ts
```

### Features:
- Step-by-step onboarding flows
- Progress tracking
- Interactive tours
- Checklist management
- Personalized onboarding based on user type

## 📜 9. Compliance & Legal Module

```typescript
// src/modules/compliance/
├── gdpr.service.ts
├── data-export.service.ts
├── consent.service.ts
└── audit-trail.service.ts
```

### Features:
- GDPR compliance (data export, deletion)
- Terms of Service acceptance tracking
- Privacy policy management
- Cookie consent management
- Data retention policies
- Audit trail for compliance

## 🔄 10. Integration Hub Module

```typescript
// src/modules/integrations/
├── integration.service.ts
├── oauth-app.service.ts
├── providers/
│   ├── slack/
│   ├── google-workspace/
│   ├── microsoft/
│   └── zapier/
└── models/
    ├── integration.model.ts
    └── integration-config.model.ts
```

### Features:
- Third-party integrations
- OAuth app management
- Webhook receivers
- API key management for integrations
- Integration marketplace

## 📱 11. Admin Dashboard API Module

```typescript
// src/modules/admin/
├── admin.controller.ts
├── admin-user.service.ts
├── admin-metrics.service.ts
├── admin-moderation.service.ts
└── dashboards/
    ├── system-health.dashboard.ts
    ├── user-management.dashboard.ts
    └── revenue.dashboard.ts
```

### Features:
- User management (suspend, delete, modify)
- System health monitoring
- Revenue tracking
- Content moderation
- Feature usage statistics
- System configuration

## 💰 12. Revenue Optimization Module

```typescript
// src/modules/revenue/
├── pricing.service.ts
├── discount.service.ts
├── coupon.service.ts
├── trial.service.ts
└── models/
    ├── discount.model.ts
    ├── coupon.model.ts
    └── trial-config.model.ts
```

### Features:
- Dynamic pricing
- Discount codes and coupons
- Trial period management
- Promotional campaigns
- Revenue experiments
- Churn prevention

## 🔍 13. Search & Discovery Module

```typescript
// src/modules/search/
├── search.service.ts
├── elasticsearch.service.ts
├── indexing.service.ts
└── filters/
    ├── user.filter.ts
    ├── content.filter.ts
    └── tenant.filter.ts
```

### Features:
- Full-text search (Elasticsearch/Algolia)
- Faceted search
- Search analytics
- Auto-complete
- Search result ranking

## 📈 14. API Usage & Metering Module

```typescript
// src/modules/api-usage/
├── usage-tracking.service.ts
├── rate-limit.service.ts
├── quota.service.ts
└── models/
    ├── api-usage.model.ts
    └── usage-quota.model.ts
```

### Features:
- API call tracking
- Usage-based billing
- Rate limiting per plan
- Quota management
- Usage alerts
- API analytics

## 🔐 15. Advanced Security Module

```typescript
// src/modules/security/
├── fraud-detection.service.ts
├── ip-blocking.service.ts
├── suspicious-activity.service.ts
└── models/
    ├── security-event.model.ts
    └── blocked-ip.model.ts
```

### Features:
- Fraud detection
- IP blocking/allowlisting
- Suspicious activity monitoring
- Security alerts
- Device fingerprinting
- Geographic restrictions

## Implementation Priority

### Phase 1 (MVP - Monetization Ready):
1. **Payment & Billing Module** ⭐
2. **Feature Flags & Plans Module** ⭐
3. **Multi-Tenancy Module** ⭐
4. **Trial Management** (part of Revenue module) ⭐

### Phase 2 (Growth):
5. **Analytics & Reporting Module**
6. **Webhook Management Module**
7. **User Onboarding Module**
8. **Support Ticket System**

### Phase 3 (Scale):
9. **Integration Hub Module**
10. **Advanced Email Marketing**
11. **API Usage & Metering**
12. **Admin Dashboard API**

### Phase 4 (Enterprise):
13. **Compliance & Legal Module**
14. **Advanced Security Module**
15. **Search & Discovery Module**

## Database Schema Additions

```prisma
// Additional models needed

model Tenant {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  ownerId       String
  subscription  Subscription?
  // ... more fields
}

model Subscription {
  id                String   @id @default(cuid())
  tenantId          String   @unique
  stripeCustomerId  String
  stripePriceId     String
  status            SubscriptionStatus
  currentPeriodEnd  DateTime
  // ... more fields
}

model Plan {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  stripePriceId String?
  features    PlanFeature[]
  // ... more fields
}

model Invoice {
  id              String   @id @default(cuid())
  subscriptionId  String
  stripeInvoiceId String
  amount          Int
  status          InvoiceStatus
  // ... more fields
}

model Feature {
  id          String   @id @default(cuid())
  name        String
  key         String   @unique
  description String?
  plans       PlanFeature[]
  // ... more fields
}
```

## Environment Variables Additions

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Multi-tenancy
TENANT_SUBDOMAIN_ENABLED=true
TENANT_CUSTOM_DOMAIN_ENABLED=false

# Analytics
MIXPANEL_TOKEN=...
SEGMENT_WRITE_KEY=...
GOOGLE_ANALYTICS_ID=...

# Email Marketing
SENDGRID_API_KEY=...
MAILCHIMP_API_KEY=...

# Search
ELASTICSEARCH_URL=http://localhost:9200
ALGOLIA_APP_ID=...
ALGOLIA_API_KEY=...

# Integrations
SLACK_CLIENT_ID=...
SLACK_CLIENT_SECRET=...
```

## Recommended NPM Packages

```json
{
  "dependencies": {
    // Payments
    "stripe": "^14.0.0",

    // Analytics
    "mixpanel": "^0.18.0",
    "analytics-node": "^6.2.0",

    // Search
    "@elastic/elasticsearch": "^8.11.0",
    "algoliasearch": "^4.22.0",

    // Email
    "@sendgrid/mail": "^8.1.0",

    // Multi-tenancy
    "cls-hooked": "^4.2.2",

    // Feature Flags
    "unleash-client": "^5.1.0",

    // Monitoring
    "@sentry/profiling-node": "^7.0.0"
  }
}
```

This roadmap will transform your template into a full-featured SaaS platform ready for monetization and scale!
