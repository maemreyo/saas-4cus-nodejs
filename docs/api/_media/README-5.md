# Notification Module

A comprehensive notification system supporting in-app notifications, email, push notifications, and SMS with user preferences and delivery tracking.

## Features

### Core Features
- **Multi-channel Delivery**: In-app, email, push, SMS notifications
- **User Preferences**: Granular control over notification channels
- **Priority Levels**: LOW, MEDIUM, HIGH, CRITICAL
- **Read Status Tracking**: Track read/unread notifications
- **Batch Operations**: Mark multiple notifications as read
- **Notification Types**: INFO, WARNING, ERROR, SUCCESS, ALERT, CRITICAL

### Advanced Features
- **Quiet Hours**: Respect user's quiet time preferences
- **Delivery Frequency**: Immediate, hourly, daily, or weekly digests
- **Action Buttons**: Add CTAs to notifications
- **Expiration**: Auto-expire old notifications
- **Real-time Updates**: WebSocket support for instant delivery
- **Delivery Tracking**: Monitor notification delivery status

## API Endpoints

### User Endpoints
```
GET    /api/notifications              - Get notifications
GET    /api/notifications/unread-count - Get unread count
GET    /api/notifications/statistics   - Get notification stats
POST   /api/notifications/:id/read     - Mark as read
POST   /api/notifications/mark-read    - Mark multiple as read
DELETE /api/notifications/:id          - Delete notification
GET    /api/notifications/preferences  - Get preferences
PUT    /api/notifications/preferences  - Update preferences
```

### Admin Endpoints
```
POST   /api/notifications              - Create notification
```

## Usage Examples

### Get Notifications
```typescript
GET /api/notifications?limit=20&offset=0&unreadOnly=true&type=INFO

Response:
{
  "data": {
    "notifications": [
      {
        "id": "notif-123",
        "type": "IN_APP",
        "title": "New feature available",
        "content": "Check out our new analytics dashboard!",
        "metadata": {
          "priority": "MEDIUM",
          "notificationType": "INFO",
          "actions": [
            {
              "label": "View Dashboard",
              "url": "/dashboard/analytics"
            }
          ]
        },
        "readAt": null,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 45,
    "unread": 12
  }
}
```

### Create Notification (Admin)
```typescript
POST /api/notifications
{
  "userId": "user-123",
  "type": "SUCCESS",
  "title": "Payment Received",
  "content": "Your payment of $49 has been successfully processed.",
  "priority": "HIGH",
  "actions": [
    {
      "label": "View Invoice",
      "url": "/billing/invoices/inv-123"
    }
  ]
}
```

### Update Preferences
```typescript
PUT /api/notifications/preferences
{
  "email": true,
  "push": false,
  "inApp": true,
  "sms": false,
  "frequency": "daily",
  "quietHours": {
    "start": "22:00",
    "end": "08:00"
  }
}
```

### Mark Notifications as Read
```typescript
POST /api/notifications/mark-read
{
  "notificationIds": ["notif-123", "notif-456"]
}

// Or mark all as read
{
  "markAll": true
}
```

## Notification Types

### INFO
General information, updates, tips
- Color: Blue
- Priority: Usually LOW to MEDIUM
- Example: "New feature available"

### WARNING
Important information requiring attention
- Color: Orange/Yellow
- Priority: Usually MEDIUM to HIGH
- Example: "Your subscription expires in 3 days"

### ERROR
System errors or failures
- Color: Red
- Priority: Usually HIGH
- Example: "Payment failed - please update payment method"

### SUCCESS
Successful operations or achievements
- Color: Green
- Priority: Usually MEDIUM
- Example: "Profile updated successfully"

### ALERT
Time-sensitive or security alerts
- Color: Red/Orange
- Priority: Usually HIGH to CRITICAL
- Example: "New login from unknown device"

### CRITICAL
Urgent issues requiring immediate action
- Color: Red with emphasis
- Priority: Always CRITICAL
- Example: "Account suspended due to security breach"

## User Preferences

### Channels
- **email**: Receive email notifications
- **push**: Receive push notifications (mobile/desktop)
- **inApp**: Show in-app notifications
- **sms**: Receive SMS notifications (if phone verified)

### Frequency Options
- **immediate**: Send notifications as they occur
- **hourly**: Batch and send every hour
- **daily**: Daily digest at specified time
- **weekly**: Weekly summary

### Quiet Hours
Define time periods when notifications should be held:
```json
{
  "quietHours": {
    "start": "22:00",  // 10 PM
    "end": "08:00"     // 8 AM
  }
}
```

## Real-time Notifications

The module publishes notifications to Redis for WebSocket delivery:

```typescript
// Client-side subscription
socket.on('notification', (notification) => {
  // Handle new notification
  showNotification(notification);
});
```

## Events

The notification module emits:
- `notification.created`
- `notification.sent`
- `notification.read`
- `notification.deleted`

## Background Jobs

### Email Notification Queue
- Processes email notifications
- Retries on failure
- Respects user preferences

### Push Notification Queue
- Sends push notifications
- Handles device tokens
- Tracks delivery status

### Cleanup Job
- Runs daily at 3 AM
- Removes notifications older than 30 days
- Keeps unread notifications

## Configuration

### Environment Variables
```env
# Notification Settings
NOTIFICATION_RETENTION_DAYS=30
NOTIFICATION_MAX_PER_USER=1000
NOTIFICATION_BATCH_SIZE=100

# Email Settings
EMAIL_NOTIFICATIONS_ENABLED=true
EMAIL_FROM_NAME="Your App"
EMAIL_FROM_ADDRESS=notifications@example.com

# Push Notifications
PUSH_NOTIFICATIONS_ENABLED=true
FCM_SERVER_KEY=your-fcm-key
APNS_KEY_ID=your-apns-key
```

## Best Practices

1. **Use Appropriate Types**: Choose the right notification type for the message
2. **Set Correct Priority**: Reserve CRITICAL for truly urgent matters
3. **Keep Messages Concise**: Short, clear titles and content
4. **Add Relevant Actions**: Include helpful CTAs when appropriate
5. **Respect Preferences**: Always honor user notification preferences
6. **Batch When Possible**: Group related notifications to reduce noise

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check user preferences
   - Verify notification type is enabled
   - Check quiet hours settings
   - Ensure WebSocket connection for real-time

2. **Email notifications not sent**
   - Verify SMTP configuration
   - Check email queue processing
   - Review user email preferences
   - Check spam folders

3. **Push notifications failing**
   - Verify device tokens are valid
   - Check push service credentials
   - Review delivery logs
   - Ensure app permissions

4. **High notification volume**
   - Implement notification grouping
   - Use digest mode for non-urgent items
   - Set reasonable rate limits
   - Allow users to customize frequency

## Performance Considerations

1. **Caching**: Unread counts are cached for 5 minutes
2. **Pagination**: Use limit/offset for large notification lists
3. **Cleanup**: Old notifications auto-deleted after 30 days
4. **Indexing**: Database indexed on userId, createdAt, readAt
