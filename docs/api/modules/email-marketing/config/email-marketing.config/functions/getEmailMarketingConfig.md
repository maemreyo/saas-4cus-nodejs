[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/config/email-marketing.config](../README.md) / getEmailMarketingConfig

# Function: getEmailMarketingConfig()

> **getEmailMarketingConfig**(): `object`

Defined in: [src/modules/email-marketing/config/email-marketing.config.ts:115](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/config/email-marketing.config.ts#L115)

Get email marketing configuration

## Returns

`object`

### abTesting?

> `optional` **abTesting**: `object`

#### abTesting.confidenceThreshold?

> `optional` **confidenceThreshold**: `number`

#### abTesting.defaultTestPercentage?

> `optional` **defaultTestPercentage**: `number`

#### abTesting.minSampleSize?

> `optional` **minSampleSize**: `number`

#### abTesting.minTestDuration?

> `optional` **minTestDuration**: `number`

### analytics?

> `optional` **analytics**: `object`

#### analytics.aggregationInterval?

> `optional` **aggregationInterval**: `number`

#### analytics.enableRealtimeStats?

> `optional` **enableRealtimeStats**: `boolean`

#### analytics.retentionDays?

> `optional` **retentionDays**: `number`

### antiSpam?

> `optional` **antiSpam**: `object`

#### antiSpam.blockSuspiciousIPs?

> `optional` **blockSuspiciousIPs**: `boolean`

#### antiSpam.honeypotField?

> `optional` **honeypotField**: `string`

#### antiSpam.maxSubscribeAttemptsPerHour?

> `optional` **maxSubscribeAttemptsPerHour**: `number`

#### antiSpam.maxUnsubscribeAttemptsPerHour?

> `optional` **maxUnsubscribeAttemptsPerHour**: `number`

### automations?

> `optional` **automations**: `object`

#### automations.maxActiveAutomations?

> `optional` **maxActiveAutomations**: `number`

#### automations.maxEnrollmentsPerDay?

> `optional` **maxEnrollmentsPerDay**: `number`

#### automations.maxStepsPerAutomation?

> `optional` **maxStepsPerAutomation**: `number`

### campaigns?

> `optional` **campaigns**: `object`

#### campaigns.defaultFromEmail?

> `optional` **defaultFromEmail**: `string`

#### campaigns.defaultFromName?

> `optional` **defaultFromName**: `string`

#### campaigns.defaultReplyTo?

> `optional` **defaultReplyTo**: `string`

#### campaigns.maxTestEmails?

> `optional` **maxTestEmails**: `number`

### compliance?

> `optional` **compliance**: `object`

#### compliance.canSpamCompliant?

> `optional` **canSpamCompliant**: `boolean`

#### compliance.gdprEnabled?

> `optional` **gdprEnabled**: `boolean`

#### compliance.requirePhysicalAddress?

> `optional` **requirePhysicalAddress**: `boolean`

#### compliance.requireUnsubscribeLink?

> `optional` **requireUnsubscribeLink**: `boolean`

### enabled?

> `optional` **enabled**: `boolean`

### limits?

> `optional` **limits**: `object`

#### limits.batchSize?

> `optional` **batchSize**: `number`

#### limits.delayBetweenBatches?

> `optional` **delayBetweenBatches**: `number`

#### limits.maxPerDay?

> `optional` **maxPerDay**: `number`

#### limits.maxPerHour?

> `optional` **maxPerHour**: `number`

#### limits.maxRecipientsPerCampaign?

> `optional` **maxRecipientsPerCampaign**: `number`

### lists?

> `optional` **lists**: `object`

#### lists.cleanupInactiveDays?

> `optional` **cleanupInactiveDays**: `number`

#### lists.defaultDoubleOptIn?

> `optional` **defaultDoubleOptIn**: `boolean`

#### lists.importBatchSize?

> `optional` **importBatchSize**: `number`

#### lists.maxSubscribersPerList?

> `optional` **maxSubscribersPerList**: `number`

### provider?

> `optional` **provider**: `"smtp"` \| `"sendgrid"` \| `"ses"` \| `"mailgun"` \| `"postmark"`

### sendgridApiKey?

> `optional` **sendgridApiKey**: `string`

### sesRegion?

> `optional` **sesRegion**: `string`

### smtp?

> `optional` **smtp**: `object`

#### smtp.host?

> `optional` **host**: `string`

#### smtp.pass?

> `optional` **pass**: `string`

#### smtp.port?

> `optional` **port**: `number`

#### smtp.secure?

> `optional` **secure**: `boolean`

#### smtp.user?

> `optional` **user**: `string`

### templates?

> `optional` **templates**: `object`

#### templates.allowPublicTemplates?

> `optional` **allowPublicTemplates**: `boolean`

#### templates.maxTemplates?

> `optional` **maxTemplates**: `number`

#### templates.maxTemplateSize?

> `optional` **maxTemplateSize**: `number`

### tracking?

> `optional` **tracking**: `object`

#### tracking.domain?

> `optional` **domain**: `string`

#### tracking.enableClickTracking?

> `optional` **enableClickTracking**: `boolean`

#### tracking.enableOpenTracking?

> `optional` **enableOpenTracking**: `boolean`

#### tracking.secret?

> `optional` **secret**: `string`

### webhooks?

> `optional` **webhooks**: `object`

#### webhooks.maxRetries?

> `optional` **maxRetries**: `number`

#### webhooks.retryFailedWebhooks?

> `optional` **retryFailedWebhooks**: `boolean`

#### webhooks.sendgridPublicKey?

> `optional` **sendgridPublicKey**: `string`

#### webhooks.verifySignatures?

> `optional` **verifySignatures**: `boolean`
