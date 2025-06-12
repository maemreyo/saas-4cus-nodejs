# Email Marketing Module

A comprehensive email marketing solution with campaigns, automations, segmentation, and analytics.

## Features

### 📧 Email Campaigns
- **Campaign Management**: Create, schedule, and send email campaigns
- **A/B Testing**: Test different subject lines, content, and sender names
- **Templates**: Reusable email templates with Handlebars support
- **Personalization**: Dynamic content based on subscriber data
- **Tracking**: Open and click tracking with detailed analytics

### 📋 List Management
- **Subscriber Management**: Add, import, and manage subscribers
- **Double Opt-in**: Optional confirmation for new subscribers
- **Custom Fields**: Store additional subscriber data
- **Tags**: Organize subscribers with tags
- **Import/Export**: Bulk operations via CSV

### 🎯 Segmentation
- **Dynamic Segments**: Create segments based on subscriber attributes
- **Behavioral Segmentation**: Based on engagement and activity
- **Conditions**: Complex AND/OR logic for precise targeting
- **Real-time Updates**: Automatic segment recalculation

### 🤖 Automation
- **Drip Campaigns**: Multi-step email sequences
- **Triggers**: User signup, list subscribe, tag added, date-based, custom events
- **Conditional Steps**: Branch logic based on subscriber behavior
- **Delays**: Configurable delays between steps
- **Enrollment Management**: Track and manage automation participants

### 📊 Analytics & Tracking
- **Campaign Statistics**: Delivery, open, click, bounce, and unsubscribe rates
- **Subscriber Engagement**: Activity tracking and engagement scoring
- **Link Tracking**: Track which links are clicked
- **Revenue Tracking**: Connect email performance to revenue (when integrated)
- **Real-time Updates**: Live campaign performance data

### 🛡️ Compliance
- **GDPR Compliant**: Data export, deletion, and consent management
- **CAN-SPAM Compliant**: Required unsubscribe links and sender info
- **Bounce Handling**: Automatic hard/soft bounce management
- **Suppression Lists**: Global unsubscribe management

## API Endpoints

### Campaign Management
```
POST   /api/v1/email-marketing/campaigns              # Create campaign
GET    /api/v1/email-marketing/campaigns              # List campaigns
GET    /api/v1/email-marketing/campaigns/:id          # Get campaign
PUT    /api/v1/email-marketing/campaigns/:id          # Update campaign
DELETE /api/v1/email-marketing/campaigns/:id          # Delete campaign
POST   /api/v1/email-marketing/campaigns/:id/schedule # Schedule campaign
POST   /api/v1/email-marketing/campaigns/:id/send     # Send campaign
POST   /api/v1/email-marketing/campaigns/:id/pause    # Pause campaign
POST   /api/v1/email-marketing/campaigns/:id/resume   # Resume campaign
POST   /api/v1/email-marketing/campaigns/:id/cancel   # Cancel campaign
POST   /api/v1/email-marketing/campaigns/:id/clone    # Clone campaign
GET    /api/v1/email-marketing/campaigns/:id/stats    # Get statistics
```

### List Management
```
POST   /api/v1/email-marketing/lists                  # Create list
GET    /api/v1/email-marketing/lists                  # List email lists
GET    /api/v1/email-marketing/lists/:id              # Get list
PUT    /api/v1/email-marketing/lists/:id              # Update list
PATCH  /api/v1/email-marketing/lists/:id/status       # Update status
DELETE /api/v1/email-marketing/lists/:id              # Delete list
GET    /api/v1/email-marketing/lists/:id/stats        # Get statistics

# Subscriber Management
POST   /api/v1/email-marketing/lists/:id/subscribers           # Add subscriber
POST   /api/v1/email-marketing/lists/:id/subscribers/import    # Import subscribers
GET    /api/v1/email-marketing/lists/:id/subscribers           # List subscribers
PUT    /api/v1/email-marketing/lists/:id/subscribers/:subId    # Update subscriber
DELETE /api/v1/email-marketing/lists/:id/subscribers/:subId    # Remove subscriber
PATCH  /api/v1/email-marketing/lists/:id/subscribers/:subId/tags # Update tags
POST   /api/v1/email-marketing/lists/:id/subscribers/bulk      # Bulk operations
GET    /api/v1/email-marketing/lists/confirm?token=xxx         # Confirm subscription
```

### Segmentation
```
POST   /api/v1/email-marketing/lists/:id/segments             # Create segment
GET    /api/v1/email-marketing/lists/:id/segments             # List segments
PUT    /api/v1/email-marketing/lists/:id/segments/:segId      # Update segment
DELETE /api/v1/email-marketing/lists/:id/segments/:segId      # Delete segment
POST   /api/v1/email-marketing/lists/:id/segments/:segId/test # Test segment
GET    /api/v1/email-marketing/lists/:id/segments/:segId/subscribers # Get subscribers
```

### Automation
```
POST   /api/v1/email-marketing/automations            # Create automation
GET    /api/v1/email-marketing/automations            # List automations
GET    /api/v1/email-marketing/automations/:id        # Get automation
PUT    /api/v1/email-marketing/automations/:id        # Update automation
DELETE /api/v1/email-marketing/automations/:id        # Delete automation
POST   /api/v1/email-marketing/automations/:id/activate   # Activate
POST   /api/v1/email-marketing/automations/:id/deactivate # Deactivate

# Steps
POST   /api/v1/email-marketing/automations/:id/steps        # Add step
PUT    /api/v1/email-marketing/automations/:id/steps/:stepId # Update step
DELETE /api/v1/email-marketing/automations/:id/steps/:stepId # Delete step

# Enrollments
POST   /api/v1/email-marketing/automations/:id/enroll       # Enroll subscriber
GET    /api/v1/email-marketing/automations/:id/enrollments  # List enrollments
POST   /api/v1/email-marketing/automations/:id/enrollments/:eId/cancel # Cancel
```

### Templates
```
POST   /api/v1/email-marketing/templates              # Create template
GET    /api/v1/email-marketing/templates              # List templates
GET    /api/v1/email-marketing/templates/categories   # Get categories
GET    /api/v1/email-marketing/templates/:id          # Get template
PUT    /api/v1/email-marketing/templates/:id          # Update template
DELETE /api/v1/email-marketing/templates/:id          # Delete template
POST   /api/v1/email-marketing/templates/:id/preview  # Preview template
POST   /api/v1/email-marketing/templates/:id/duplicate # Duplicate
```

### Tracking
```
GET    /api/v1/email-marketing/track/open/:messageId  # Track open (pixel)
GET    /api/v1/email-marketing/track/click/:messageId # Track click (redirect)
POST   /api/v1/email-marketing/track/webhook          # Webhook endpoint
GET    /api/v1/email-marketing/unsubscribe            # Unsubscribe page
POST   /api/v1/email-marketing/unsubscribe            # Process unsubscribe
```

## Usage Examples

### Create and Send a Campaign

```typescript
// 1. Create an email list
const list = await fetch('/api/v1/email-marketing/lists', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Newsletter Subscribers',
    description: 'Main newsletter list',
    doubleOptIn: true
  })
});

// 2. Add subscribers
await fetch(`/api/v1/email-marketing/lists/${list.id}/subscribers`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    tags: ['newsletter', 'new']
  })
});

// 3. Create a campaign
const campaign = await fetch('/api/v1/email-marketing/campaigns', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    listId: list.id,
    name: 'March Newsletter',
    subject: 'Our March Updates',
    fromName: 'Your Company',
    fromEmail: 'news@company.com',
    htmlContent: '<h1>Hello {{firstName}}!</h1><p>Check out our updates...</p>'
  })
});

// 4. Send the campaign
await fetch(`/api/v1/email-marketing/campaigns/${campaign.id}/send`, {
  method: 'POST'
});
```

### Create an Automation

```typescript
// Create a welcome email automation
const automation = await fetch('/api/v1/email-marketing/automations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    listId: list.id,
    name: 'Welcome Series',
    trigger: 'LIST_SUBSCRIBE',
    triggerConfig: {},
    steps: [
      {
        name: 'Welcome Email',
        delayAmount: 0,
        delayUnit: 'hours',
        subject: 'Welcome to {{companyName}}!',
        htmlContent: '<p>Welcome aboard, {{firstName}}!</p>'
      },
      {
        name: 'Getting Started',
        delayAmount: 1,
        delayUnit: 'days',
        subject: 'Getting Started Guide',
        htmlContent: '<p>Here\'s how to get started...</p>'
      },
      {
        name: 'First Week Check-in',
        delayAmount: 7,
        delayUnit: 'days',
        subject: 'How\'s your first week going?',
        htmlContent: '<p>We\'d love to hear from you...</p>'
      }
    ]
  })
});

// Activate the automation
await fetch(`/api/v1/email-marketing/automations/${automation.id}/activate`, {
  method: 'POST'
});
```

### Create a Segment

```typescript
// Create a segment for engaged subscribers
const segment = await fetch(`/api/v1/email-marketing/lists/${list.id}/segments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Highly Engaged',
    description: 'Subscribers who open and click frequently',
    conditions: [
      {
        field: 'engagementScore',
        operator: 'GREATER_THAN',
        value: 80
      },
      {
        field: 'lastEngagedAt',
        operator: 'GREATER_THAN',
        value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
        logic: 'AND'
      }
    ]
  })
});
```

## Configuration

### Environment Variables

```env
# Email Service Provider
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-api-key

# Email Limits
EMAIL_MAX_RECIPIENTS_PER_CAMPAIGN=100000
EMAIL_MAX_PER_HOUR=10000
EMAIL_MAX_PER_DAY=100000
EMAIL_BATCH_SIZE=100

# Tracking
EMAIL_TRACKING_DOMAIN=https://track.yourdomain.com
EMAIL_WEBHOOK_SECRET=your-webhook-secret
EMAIL_ENABLE_OPEN_TRACKING=true
EMAIL_ENABLE_CLICK_TRACKING=true

# Features
EMAIL_DEFAULT_DOUBLE_OPT_IN=true
EMAIL_MARKETING_ENABLED=true
```

### Configuration Object

```typescript
{
  sending: {
    maxRecipientsPerCampaign: 100000,
    maxEmailsPerHour: 10000,
    maxEmailsPerDay: 100000,
    batchSize: 100,
    retryAttempts: 3,
    retryDelay: 5000
  },
  lists: {
    maxListsPerTenant: 100,
    maxSubscribersPerList: 1000000,
    defaultDoubleOptIn: true,
    importBatchSize: 1000,
    confirmationTokenExpiry: 604800000 // 7 days
  },
  campaigns: {
    maxCampaignsPerMonth: 1000,
    maxTestEmails: 10,
    abTestMinRecipients: 1000,
    abTestMaxDuration: 24
  },
  templates: {
    maxTemplatesPerTenant: 500,
    maxTemplateSize: 1048576, // 1MB
    maxPublicTemplates: 50
  },
  automations: {
    maxAutomationsPerTenant: 100,
    maxStepsPerAutomation: 50,
    maxActiveAutomations: 20,
    minStepDelay: 5, // minutes
    maxStepDelay: 525600 // 1 year
  },
  tracking: {
    enableOpenTracking: true,
    enableClickTracking: true,
    activityRetentionDays: 90
  },
  compliance: {
    requireUnsubscribeLink: true,
    requirePhysicalAddress: true,
    gdprEnabled: true,
    canSpamCompliant: true
  }
}
```

## Template Variables

Templates support Handlebars syntax with these default variables:

### Subscriber Variables
- `{{email}}` - Subscriber's email address
- `{{firstName}}` - First name
- `{{lastName}}` - Last name
- `{{fullName}}` - Full name
- `{{subscribedAt}}` - Subscription date
- Custom fields as defined

### Campaign Variables
- `{{subject}}` - Email subject
- `{{preheader}}` - Preheader text
- `{{companyName}}` - Your company name
- `{{companyAddress}}` - Physical address
- `{{unsubscribeUrl}}` - Unsubscribe link
- `{{viewInBrowserUrl}}` - Web version link

### Helpers
- `{{formatDate date "format"}}` - Format dates
- `{{ifEquals value1 value2}}` - Conditional content
- `{{default value fallback}}` - Default values
- `{{capitalize string}}` - Capitalize text
- `{{currency amount "USD"}}` - Format currency

## Events

The module emits these events:

### List Events
- `email.list.created`
- `email.list.updated`
- `email.list.deleted`
- `email.list.status_changed`

### Subscriber Events
- `email.subscriber.added`
- `email.subscriber.updated`
- `email.subscriber.removed`
- `email.subscriber.confirmed`
- `email.subscriber.resubscribed`
- `email.subscriber.tags_updated`
- `email.subscribers.imported`

### Campaign Events
- `email.campaign.created`
- `email.campaign.updated`
- `email.campaign.deleted`
- `email.campaign.scheduled`
- `email.campaign.sending`
- `email.campaign.completed`

### Email Activity Events
- `email.activity.sent`
- `email.activity.delivered`
- `email.activity.opened`
- `email.activity.clicked`
- `email.activity.bounced`
- `email.activity.unsubscribed`
- `email.activity.complained`

### Automation Events
- `email.automation.created`
- `email.automation.activated`
- `email.automation.deactivated`
- `email.automation.enrollment_started`
- `email.automation.enrollment_completed`
- `email.automation.step_sent`

## Best Practices

### List Management
1. **Use Double Opt-in**: Improves deliverability and compliance
2. **Regular Cleaning**: Remove inactive subscribers periodically
3. **Segment Lists**: Better targeting improves engagement
4. **Tag Subscribers**: Use tags for easy organization
5. **Monitor Bounces**: Remove hard bounces automatically

### Campaign Creation
1. **Test First**: Always send test emails before campaigns
2. **Mobile-Friendly**: Design for mobile devices
3. **Clear CTAs**: Make calls-to-action prominent
4. **Personalize**: Use merge tags for personalization
5. **Preview Text**: Use preheader text effectively

### Deliverability
1. **Authenticate**: Set up SPF, DKIM, and DMARC
2. **Warm IPs**: Gradually increase sending volume
3. **Monitor Reputation**: Track bounce and complaint rates
4. **Clean Lists**: Remove inactive subscribers
5. **Consistent Sending**: Maintain regular sending patterns

### Compliance
1. **Include Unsubscribe**: Always include unsubscribe links
2. **Physical Address**: Include sender's physical address
3. **Honor Unsubscribes**: Process immediately
4. **Get Consent**: Use double opt-in when possible
5. **Keep Records**: Maintain consent records

## Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check email service provider credentials
   - Verify sender domain authentication
   - Check sending limits
   - Review error logs

2. **Low Open Rates**
   - Improve subject lines
   - Check sender reputation
   - Verify deliverability
   - Segment better

3. **High Bounce Rates**
   - Clean email lists
   - Use double opt-in
   - Verify email addresses
   - Check for typos

4. **Tracking Not Working**
   - Verify tracking domain
   - Check tracking settings
   - Test with different email clients
   - Review CSP headers

## Future Enhancements

- [ ] Visual email builder
- [ ] Advanced personalization with AI
- [ ] SMS marketing integration
- [ ] Landing page builder
- [ ] Marketing automation workflows UI
- [ ] Advanced analytics dashboards
- [ ] Multi-channel campaigns
- [ ] Dynamic content blocks
- [ ] Email preview for multiple clients
- [ ] Spam score checking
