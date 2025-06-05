# Setting Up the Billing Module

## 1. Stripe Account Setup

### Create Stripe Account
1. Sign up at [https://stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Set up your products and prices

### Create Products in Stripe Dashboard
```javascript
// Example: Create these in Stripe Dashboard
// Product: "Pro Plan"
// Price: $29/month (price_xxxxx)
//
// Product: "Enterprise Plan"
// Price: $99/month (price_yyyyy)
```

## 2. Environment Variables

Add to your `.env` file:
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Your app URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

## 3. Database Migration

Create a new migration for billing tables:

```bash
npx prisma migrate dev --name add_billing_tables
```

## 4. Webhook Setup

### Local Development with Stripe CLI
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/v1/billing/webhook

# Copy the webhook signing secret and add to .env
```

### Production Webhook
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/v1/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 5. Add Billing Routes

Create `src/modules/billing/billing.route.ts`:

```typescript
// src/modules/billing/billing.route.ts
import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { BillingController } from './billing.controller';

export default async function billingRoutes(fastify: FastifyInstance) {
  const billingController = Container.get(BillingController);

  // Public webhook endpoint
  fastify.post('/webhook', {
    config: {
      rawBody: true, // Important for Stripe signature verification
    },
  }, billingController.handleWebhook.bind(billingController));

  // Protected routes
  fastify.register(async function protectedRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyJWT(request, reply);
    });

    // Get available plans
    fastify.get('/plans', billingController.getPlans.bind(billingController));

    // Get current subscription
    fastify.get('/subscription', billingController.getCurrentSubscription.bind(billingController));

    // Create checkout session
    fastify.post('/checkout', billingController.createCheckoutSession.bind(billingController));

    // Cancel subscription
    fastify.post('/cancel', billingController.cancelSubscription.bind(billingController));
  });
}
```

## 6. Frontend Integration

### React Example

```tsx
// CheckoutButton.tsx
import { useState } from 'react';

function CheckoutButton({ priceId, planName }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/v1/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const { data } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Loading...' : `Subscribe to ${planName}`}
    </button>
  );
}

// PricingPage.tsx
function PricingPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('/api/v1/billing/plans')
      .then(res => res.json())
      .then(({ data }) => setPlans(data));
  }, []);

  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>${plan.price}/month</p>
          <ul>
            {plan.features.map(feature => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <CheckoutButton priceId={plan.stripePriceId} planName={plan.name} />
        </div>
      ))}
    </div>
  );
}
```

## 7. Testing the Flow

### 1. Create Test User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### 3. Get Plans
```bash
curl http://localhost:3000/api/v1/billing/plans \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Create Checkout Session
```bash
curl -X POST http://localhost:3000/api/v1/billing/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "priceId": "price_xxxxx",
    "successUrl": "http://localhost:3001/success",
    "cancelUrl": "http://localhost:3001/cancel"
  }'
```

### 5. Test Card Numbers
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## 8. Feature Gating

### Middleware for Feature Access

```typescript
// src/shared/middleware/feature-check.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { SubscriptionService } from '@modules/billing/subscription.service';

export function requireFeature(feature: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const subscriptionService = Container.get(SubscriptionService);
    const userId = request.customUser!.id;

    const hasAccess = await subscriptionService.hasFeature(userId, feature);

    if (!hasAccess) {
      reply.code(403).send({
        error: 'Feature not available',
        message: 'Upgrade your plan to access this feature',
        feature,
      });
    }
  };
}

// Usage in routes
fastify.get('/api/analytics', {
  preHandler: [requireFeature('Advanced analytics')],
}, analyticsController.getAnalytics);
```

### React Hook for Feature Access

```tsx
// useFeature.ts
import { useEffect, useState } from 'react';

export function useFeature(feature: string): {
  hasAccess: boolean;
  loading: boolean;
} {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/billing/features/check?feature=${feature}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then(res => res.json())
      .then(({ hasAccess }) => setHasAccess(hasAccess))
      .finally(() => setLoading(false));
  }, [feature]);

  return { hasAccess, loading };
}

// Usage
function AdvancedAnalytics() {
  const { hasAccess, loading } = useFeature('Advanced analytics');

  if (loading) return <div>Loading...</div>;

  if (!hasAccess) {
    return <UpgradePrompt feature="Advanced analytics" />;
  }

  return <AnalyticsDashboard />;
}
```

## 9. Monitoring & Analytics

### Key Metrics to Track

```typescript
// Track these events
logger.metric('subscription.created', 1, { plan: 'pro' });
logger.metric('subscription.cancelled', 1, { plan: 'pro' });
logger.metric('revenue.mrr', 29, { currency: 'usd' });
logger.metric('payment.failed', 1, { reason: 'insufficient_funds' });
```

### Dashboard Queries

```sql
-- Monthly Recurring Revenue (MRR)
SELECT
  SUM(CASE
    WHEN s.stripe_price_id = 'price_xxxxx' THEN 29
    WHEN s.stripe_price_id = 'price_yyyyy' THEN 99
    ELSE 0
  END) as mrr
FROM subscriptions s
WHERE s.status IN ('active', 'trialing');

-- Churn Rate
SELECT
  COUNT(CASE WHEN status = 'canceled' THEN 1 END)::float /
  COUNT(*)::float * 100 as churn_rate
FROM subscriptions
WHERE created_at >= NOW() - INTERVAL '30 days';
```

## 10. Common Issues & Solutions

### Issue: Webhook not receiving events
**Solution**: Check that rawBody is preserved in Fastify config

### Issue: Customer already exists
**Solution**: Check for existing Stripe customer before creating

### Issue: Subscription status not updating
**Solution**: Ensure webhook events are properly handled

### Issue: Currency mismatch
**Solution**: Always use consistent currency across your app

## Next Steps

1. Add usage-based billing for API calls
2. Implement coupon/discount system
3. Add invoice PDF generation
4. Set up revenue analytics dashboard
5. Implement dunning emails for failed payments
6. Add team billing (multiple seats)
7. Implement annual billing with discount
