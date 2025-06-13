# Webhooks Module

A robust webhook system for real-time event notifications with retry logic and delivery tracking.

## Features

### Core Features
- **Webhook Endpoints**: Register multiple webhook URLs per user
- **Event Subscriptions**: Subscribe to specific events
- **Secure Delivery**: HMAC signature verification
- **Retry Logic**: Automatic retries with exponential backoff
- **Delivery Tracking**: Monitor webhook delivery status
- **Test Webhooks**: Test endpoint connectivity

### Advanced Features
- **Custom Headers**: Add custom headers to webhook requests
- **Event Filtering**: Subscribe to specific event types
- **Delivery Stats**: Success rate and performance metrics
- **Replay Delivery**: Manually retry failed deliveries
- **Bulk Operations**: Manage multiple webhooks efficiently

## API Endpoints

### Protected Endpoints
```
GET    /api/webhooks/events           - Get available webhook events
POST   /api/webhooks                  - Create webhook endpoint
GET    /api/webhooks                  - List webhook endpoints
GET    /api/webhooks/:webhookId       - Get webhook details
PUT    /api/webhooks/:webhookId       - Update webhook
DELETE /api/webhooks/:webhookId       - Delete webhook
POST   /api/webhooks/:webhookId/test  - Test webhook
GET    /api/webhooks/:webhookId/stats - Get webhook statistics
GET    /api/webhooks/:webhookId/deliveries - Get delivery history
POST   /api/webhooks/deliveries/:deliveryId/replay - Replay delivery
```

## Usage Examples

### Create Webhook
```typescript
POST /api/webhooks
{
  "url": "https://example.com/webhook",
  "events": ["user.created", "subscription.created", "payment.succeeded"],
  "description": "Production webhook",
  "headers": {
    "X-Custom-Header": "value"
  }
}

Response:
{
  "data": {
    "id": "webhook-123",
    "url": "https://example.com/webhook",
    "secret": "whsec_abc123...",
    "events": ["user.created", "subscription.created", "payment.succeeded"],
    "enabled": true
  }
}
```

### Test Webhook
```typescript
POST /api/webhooks/webhook-123/test

Response:
{
  "message": "Test webhook delivered successfully",
  "data": {
    "success": true,
    "statusCode": 200,
    "duration": 245,
    "response": { "ok": true }
  }
}
```

### Get Webhook Stats
```typescript
GET /api/webhooks/webhook-123/stats

Response:
{
  "data": {
    "totalDeliveries": 1543,
    "successfulDeliveries": 1502,
    "failedDeliveries": 41,
    "successRate": 97.34,
    "recentDeliveries": [...]
  }
}
```

## Webhook Payload Format

```json
{
  "id": "evt_1234567890",
  "event": "user.created",
  "data": {
    // Event-specific data
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "webhookId": "webhook-123"
}
```

## Signature Verification

Webhooks are signed using HMAC-SHA256. Verify the signature:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')}`;

  return signature === expectedSignature;
}

// In your webhook handler
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, webhookSecret);

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook...
});
```

## Available Events

- `user.created` - New user registration
- `user.updated` - User profile updated
- `user.deleted` - User account deleted
- `subscription.created` - New subscription
- `subscription.updated` - Subscription modified
- `subscription.cancelled` - Subscription cancelled
- `payment.succeeded` - Successful payment
- `payment.failed` - Failed payment
- `tenant.member.added` - Team member added
- `tenant.member.removed` - Team member removed

## Retry Logic

Failed deliveries are retried with exponential backoff:
- 1st retry: After 1 minute
- 2nd retry: After 5 minutes
- 3rd retry: After 15 minutes

## Best Practices

1. **Idempotency**: Make webhook handlers idempotent
2. **Quick Response**: Respond quickly (< 5 seconds)
3. **Async Processing**: Process webhooks asynchronously
4. **Error Handling**: Return appropriate status codes
5. **Security**: Always verify signatures
6. **Monitoring**: Track delivery success rates

## Configuration

```env
# Webhook Settings
WEBHOOK_TIMEOUT=30000          # 30 seconds
WEBHOOK_MAX_RETRIES=3
WEBHOOK_RETRY_DELAY=60000      # 1 minute

# Delivery Settings
WEBHOOK_BATCH_SIZE=10
WEBHOOK_CONCURRENT_DELIVERIES=5
```

## Error Handling

### Common Status Codes
- `200-299`: Success - delivery marked as successful
- `400-499`: Client error - no retry (except 429)
- `429`: Rate limited - retry with backoff
- `500-599`: Server error - automatic retry

### Failed Delivery Response
```json
{
  "id": "delivery-123",
  "status": "FAILED",
  "statusCode": 500,
  "error": "Internal Server Error",
  "attemptNumber": 2,
  "nextRetryAt": "2024-01-01T12:05:00.000Z"
}
```
