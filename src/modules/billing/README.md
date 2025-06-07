# Billing Module

A comprehensive billing and subscription management system integrated with Stripe for handling payments, subscriptions, and usage-based billing.

## Features

### Core Features
- **Subscription Management**: Create, update, cancel, and resume subscriptions
- **Payment Processing**: Secure payment handling via Stripe
- **Plan Management**: Multiple subscription tiers with different features
- **Usage Tracking**: Monitor and enforce usage limits per plan
- **Invoice Management**: Automatic invoice generation and history
- **Customer Portal**: Self-service billing management

### Advanced Features
- **Trial Periods**: Configurable trial periods for plans
- **Proration**: Automatic proration for plan changes
- **Coupons & Discounts**: Apply promotional codes
- **Webhook Handling**: Real-time Stripe event processing
- **Usage-based Billing**: Metered billing for API calls, storage
- **Multi-currency Support**: Handle payments in different currencies

## API Endpoints

### Public Endpoints
```
GET    /api/billing/plans             - Get available subscription plans
POST   /api/billing/webhook           - Stripe webhook endpoint
```

### Protected Endpoints
```
GET    /api/billing/subscription      - Get current subscription
GET    /api/billing/subscription/stats - Get subscription statistics
POST   /api/billing/subscription/update - Update subscription
POST   /api/billing/subscription/cancel - Cancel subscription
POST   /api/billing/subscription/resume - Resume cancelled subscription
POST   /api/billing/subscription/coupon - Apply coupon
POST   /api/billing/checkout          - Create checkout session
POST   /api/billing/portal            - Create customer portal session
GET    /api/billing/features/check    - Check feature access
GET    /api/billing/usage/check       - Check usage limits
GET    /api/billing/history           - Get billing history
POST   /api/billing/proration/calculate - Calculate plan change proration
```

## Subscription Plans

### Default Plans
```typescript
{
  free: {
    price: 0,
    features: {
      maxProjects: 3,
      maxUsers: 1,
      maxStorage: 1024, // 1 GB
      maxApiCalls: 1000,
      maxFileUploads: 10
    }
  },
  starter: {
    price: 19,
    features: {
      maxProjects: 10,
      maxUsers: 5,
      maxStorage: 10240, // 10 GB
      maxApiCalls: 10000,
      maxFileUploads: 100
    }
  },
  pro: {
    price: 49,
    features: {
      maxProjects: 50,
      maxUsers: 20,
      maxStorage: 102400, // 100 GB
      maxApiCalls: 100000,
      maxFileUploads: 1000
    }
  },
  enterprise: {
    price: 199,
    features: {
      maxProjects: -1, // Unlimited
      maxUsers: -1,
      maxStorage: -1,
      maxApiCalls: -1,
      maxFileUploads: -1
    }
  }
}
```

## Usage Examples

### Create Checkout Session
```typescript
POST /api/billing/checkout
{
  "priceId": "price_starter",
  "successUrl": "https://app.example.com/billing/success",
  "cancelUrl": "https://app.example.com/billing/cancel",
  "couponId": "LAUNCH20",
  "trialDays": 14
}

Response:
{
  "data": {
    "url": "https://checkout.stripe.com/pay/cs_..."
  }
}
```

### Update Subscription
```typescript
POST /api/billing/subscription/update
{
  "priceId": "price_pro",
  "prorationBehavior": "always_invoice"
}
```

### Check Feature Access
```typescript
GET /api/billing/features/check?feature=api_access

Response:
{
  "data": {
    "hasAccess": true,
    "feature": "api_access"
  }
}
```

### Check Usage Limits
```typescript
GET /api/billing/usage/check?resource=maxProjects

Response:
{
  "data": {
    "allowed": true,
    "limit": 50,
    "used": 12,
    "remaining": 38,
    "unlimited": false
  }
}
```

### Get Subscription Statistics
```typescript
GET /api/billing/subscription/stats

Response:
{
  "data": {
    "plan": {
      "id": "pro",
      "name": "Professional",
      "price": 49
    },
    "subscription": {
      "status": "active",
      "currentPeriodEnd": "2024-02-15T00:00:00Z"
    },
    "usage": {
      "maxProjects": {
        "allowed": true,
        "limit": 50,
        "used": 12,
        "remaining": 38
      },
      "maxApiCalls": {
        "allowed": true,
        "limit": 100000,
        "used": 45678,
        "remaining": 54322
      }
    },
    "billing": {
      "totalSpent": 245.00,
      "invoiceCount": 5,
      "lastPayment": "2024-01-15T00:00:00Z",
      "nextPayment": "2024-02-15T00:00:00Z"
    }
  }
}
```

## Webhook Events

The module handles these Stripe webhook events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.trial_will_end`

## Middleware

### Feature Access Control
```typescript
import { requireFeature } from '@modules/billing/billing.middleware';

// Protect route by feature
app.get('/api/advanced-analytics', {
  preHandler: [requireFeature('advanced_analytics')]
}, handler);
```

### Plan-based Access
```typescript
import { requirePlan } from '@modules/billing/billing.middleware';

// Require specific plan
app.post('/api/bulk-export', {
  preHandler: [requirePlan('pro')]
}, handler);
```

### Usage Limit Enforcement
```typescript
import { checkUsageLimit } from '@modules/billing/billing.middleware';

// Check usage before allowing action
app.post('/api/projects', {
  preHandler: [checkUsageLimit('maxProjects')]
}, handler);
```

## Configuration

### Environment Variables
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# Product IDs
STRIPE_STARTER_PRODUCT_ID=prod_...
STRIPE_PRO_PRODUCT_ID=prod_...
STRIPE_ENTERPRISE_PRODUCT_ID=prod_...
```

### Webhook Setup
1. Configure webhook endpoint in Stripe Dashboard
2. Set endpoint URL: `https://api.example.com/api/billing/webhook`
3. Select events to listen for
4. Copy webhook secret to environment

## Events

The billing module emits:
- `billing.customer.created`
- `billing.subscription.created`
- `billing.subscription.updated`
- `billing.subscription.cancelled`
- `billing.payment.succeeded`
- `billing.payment.failed`
- `billing.trial.will_end`
- `billing.usage.limit_reached`

## Error Handling

### Common Errors
```typescript
// Insufficient permissions
{
  "error": "Forbidden",
  "message": "This feature is not available in your current plan",
  "statusCode": 403,
  "details": {
    "feature": "advanced_analytics",
    "upgrade_url": "/billing/upgrade"
  }
}

// Usage limit exceeded
{
  "error": "Forbidden",
  "message": "You have reached the maxProjects limit (10) for your current plan",
  "statusCode": 403,
  "details": {
    "resource": "maxProjects",
    "limit": 10,
    "used": 10,
    "upgrade_url": "/billing/upgrade"
  }
}
```

## Testing

### Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Webhook Events
Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

## Best Practices

1. **Always verify webhooks**: Use webhook secret for signature verification
2. **Handle failures gracefully**: Implement retry logic for failed payments
3. **Monitor usage**: Set up alerts for approaching limits
4. **Clear pricing**: Display pricing clearly before checkout
5. **Proration transparency**: Show proration amounts before plan changes
6. **Regular audits**: Reconcile Stripe data with local database

## Troubleshooting

### Common Issues

1. **Webhook not received**
   - Check webhook endpoint URL
   - Verify webhook secret
   - Check Stripe dashboard for failures
   - Ensure raw body parsing for webhook route

2. **Payment failures**
   - Check card details
   - Verify customer has sufficient funds
   - Check for 3D Secure requirements
   - Review Stripe dashboard for details

3. **Subscription sync issues**
   - Manually sync from Stripe dashboard
   - Check webhook event processing
   - Verify database consistency

4. **Feature access denied**
   - Clear subscription cache
   - Verify plan features configuration
   - Check subscription status
