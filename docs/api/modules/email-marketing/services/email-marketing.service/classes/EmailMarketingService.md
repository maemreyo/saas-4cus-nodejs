[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-marketing.service](../README.md) / EmailMarketingService

# Class: EmailMarketingService

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L40)

## Constructors

### Constructor

> **new EmailMarketingService**(`prisma`, `eventBus`, `redis`, `listService`, `campaignService`, `automationService`, `analyticsService`, `deliveryService`, `segmentService`, `templateService`): `EmailMarketingService`

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L41)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

##### listService

[`EmailListService`](../../email-list.service/classes/EmailListService.md)

##### campaignService

[`EmailCampaignService`](../../email-campaign.service/classes/EmailCampaignService.md)

##### automationService

[`EmailAutomationService`](../../email-automation.service/classes/EmailAutomationService.md)

##### analyticsService

[`EmailAnalyticsService`](../../email-analytics.service/classes/EmailAnalyticsService.md)

##### deliveryService

[`EmailDeliveryService`](../../email-delivery.service/classes/EmailDeliveryService.md)

##### segmentService

[`EmailSegmentService`](../../email-segment.service/classes/EmailSegmentService.md)

##### templateService

[`EmailTemplateService`](../../email-template.service/classes/EmailTemplateService.md)

#### Returns

`EmailMarketingService`

## Methods

### addToSuppressionList()

> **addToSuppressionList**(`tenantId`, `email`, `reason`, `note?`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:744](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L744)

Add email to suppression list

#### Parameters

##### tenantId

`string`

##### email

`string`

##### reason

`"manual"` | `"bounce"` | `"unsubscribe"` | `"complaint"`

##### note?

`string`

#### Returns

`Promise`\<`void`\>

***

### exportData()

> **exportData**(`tenantId`, `options`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:363](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L363)

Export email marketing data

#### Parameters

##### tenantId

`string`

##### options

###### dateFrom?

`Date`

###### dateTo?

`Date`

###### format?

`"csv"` \| `"json"`

###### includeAnalytics?

`boolean`

###### includeCampaigns?

`boolean`

###### includeSubscribers?

`boolean`

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### getCurrentUsage()

> **getCurrentUsage**(`tenantId`, `period`): `Promise`\<\{ `bounced`: `number`; `clicked`: `number`; `complained`: `number`; `delivered`: `number`; `endDate`: `Date`; `opened`: `number`; `period`: `"month"` \| `"year"` \| `"day"`; `previousPeriodComparison?`: \{ `clicked`: `number`; `delivered`: `number`; `opened`: `number`; `percentageChange`: \{ `clicked`: `number`; `delivered`: `number`; `opened`: `number`; `sent`: `number`; \}; `sent`: `number`; \}; `sent`: `number`; `startDate`: `Date`; `unsubscribed`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:845](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L845)

Get current usage

#### Parameters

##### tenantId

`string`

##### period

`"month"` | `"year"` | `"day"`

#### Returns

`Promise`\<\{ `bounced`: `number`; `clicked`: `number`; `complained`: `number`; `delivered`: `number`; `endDate`: `Date`; `opened`: `number`; `period`: `"month"` \| `"year"` \| `"day"`; `previousPeriodComparison?`: \{ `clicked`: `number`; `delivered`: `number`; `opened`: `number`; `percentageChange`: \{ `clicked`: `number`; `delivered`: `number`; `opened`: `number`; `sent`: `number`; \}; `sent`: `number`; \}; `sent`: `number`; `startDate`: `Date`; `unsubscribed`: `number`; \}\>

***

### getDashboard()

> **getDashboard**(`tenantId`): `Promise`\<[`EmailMarketingDashboard`](../interfaces/EmailMarketingDashboard.md)\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L57)

Get comprehensive email marketing dashboard data

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<[`EmailMarketingDashboard`](../interfaces/EmailMarketingDashboard.md)\>

***

### getDeliveryRates()

> **getDeliveryRates**(`tenantId`, `startDate?`, `endDate?`, `interval?`): `Promise`\<`any`[]\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:433](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L433)

Get delivery rates over time

#### Parameters

##### tenantId

`string`

##### startDate?

`Date`

##### endDate?

`Date`

##### interval?

`"daily"` | `"weekly"` | `"monthly"` | `"hourly"`

#### Returns

`Promise`\<`any`[]\>

***

### getEngagementMetrics()

> **getEngagementMetrics**(`tenantId`, `startDate?`, `endDate?`, `segmentBy?`): `Promise`\<`any`\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:468](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L468)

Get engagement metrics

#### Parameters

##### tenantId

`string`

##### startDate?

`Date`

##### endDate?

`Date`

##### segmentBy?

`"list"` | `"automation"` | `"campaign"`

#### Returns

`Promise`\<`any`\>

***

### getHealthStatus()

> **getHealthStatus**(`tenantId`): `Promise`\<\{ `issues`: `string`[]; `recommendations`: `string`[]; `status`: `"critical"` \| `"warning"` \| `"healthy"`; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:304](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L304)

Get email marketing health status

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<\{ `issues`: `string`[]; `recommendations`: `string`[]; `status`: `"critical"` \| `"warning"` \| `"healthy"`; \}\>

***

### getRecentCampaigns()

> **getRecentCampaigns**(`tenantId`, `limit`): `Promise`\<`any`[]\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:163](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L163)

Get recent campaigns

#### Parameters

##### tenantId

`string`

##### limit

`number` = `10`

#### Returns

`Promise`\<`any`[]\>

***

### getReputationScore()

> **getReputationScore**(`tenantId`): `Promise`\<\{ `components`: \{ `compliance`: `number`; `deliverability`: `number`; `engagement`: `number`; `infrastructure`: `number`; \}; `issues`: `string`[]; `overall`: `number`; `recommendations`: `string`[]; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:542](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L542)

Get sender reputation score

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<\{ `components`: \{ `compliance`: `number`; `deliverability`: `number`; `engagement`: `number`; `infrastructure`: `number`; \}; `issues`: `string`[]; `overall`: `number`; `recommendations`: `string`[]; \}\>

***

### getSenderDomains()

> **getSenderDomains**(`tenantId`): `Promise`\<\{ `domains`: `object`[]; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:593](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L593)

Get sender domains

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<\{ `domains`: `object`[]; \}\>

***

### getStats()

> **getStats**(`tenantId`): `Promise`\<[`EmailMarketingStats`](../interfaces/EmailMarketingStats.md)\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:90](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L90)

Get overall email marketing statistics

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<[`EmailMarketingStats`](../interfaces/EmailMarketingStats.md)\>

***

### getSuppressionList()

> **getSuppressionList**(`tenantId`, `options`): `Promise`\<\{ `items`: `object`[]; `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:693](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L693)

Get suppression list

#### Parameters

##### tenantId

`string`

##### options

###### limit?

`number`

###### page?

`number`

###### reason?

`"manual"` \| `"bounce"` \| `"unsubscribe"` \| `"complaint"`

#### Returns

`Promise`\<\{ `items`: `object`[]; `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

***

### getTopPerformingCampaigns()

> **getTopPerformingCampaigns**(`tenantId`, `limit`): `Promise`\<`any`[]\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:182](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L182)

Get top performing campaigns

#### Parameters

##### tenantId

`string`

##### limit

`number` = `10`

#### Returns

`Promise`\<`any`[]\>

***

### getUsageLimits()

> **getUsageLimits**(`tenantId`): `Promise`\<\{ `currentUsage`: \{ `dailyEmailsSent`: `number`; `monthlyEmailsSent`: `number`; `totalLists`: `number`; `totalSubscribers`: `number`; \}; `percentages`: \{ `dailyEmails`: `number`; `lists`: `number`; `monthlyEmails`: `number`; `subscribers`: `number`; \}; `plan`: \{ `dailyEmailLimit`: `number`; `features`: `string`[]; `maxLists`: `number`; `maxSubscribers`: `number`; `monthlyEmailLimit`: `number`; `name`: `string`; \}; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:783](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L783)

Get usage limits

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<\{ `currentUsage`: \{ `dailyEmailsSent`: `number`; `monthlyEmailsSent`: `number`; `totalLists`: `number`; `totalSubscribers`: `number`; \}; `percentages`: \{ `dailyEmails`: `number`; `lists`: `number`; `monthlyEmails`: `number`; `subscribers`: `number`; \}; `plan`: \{ `dailyEmailLimit`: `number`; `features`: `string`[]; `maxLists`: `number`; `maxSubscribers`: `number`; `monthlyEmailLimit`: `number`; `name`: `string`; \}; \}\>

***

### previewEmail()

> **previewEmail**(`tenantId`, `campaignId`, `subscriberId?`): `Promise`\<\{ `html`: `string`; `subject`: `string`; `text?`: `string`; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:218](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L218)

Preview email content with personalization

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### subscriberId?

`string`

#### Returns

`Promise`\<\{ `html`: `string`; `subject`: `string`; `text?`: `string`; \}\>

***

### removeFromSuppressionList()

> **removeFromSuppressionList**(`tenantId`, `email`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:767](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L767)

Remove email from suppression list

#### Parameters

##### tenantId

`string`

##### email

`string`

#### Returns

`Promise`\<`void`\>

***

### sendTestEmail()

> **sendTestEmail**(`tenantId`, `campaignId`, `recipientEmail`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:198](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L198)

Send test email for a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### recipientEmail

`string`

#### Returns

`Promise`\<`void`\>

***

### validateEmailContent()

> **validateEmailContent**(`html`, `text?`): `Promise`\<\{ `errors`: `string`[]; `spamScore?`: `number`; `valid`: `boolean`; `warnings`: `string`[]; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:245](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L245)

Validate email content

#### Parameters

##### html

`string`

##### text?

`string`

#### Returns

`Promise`\<\{ `errors`: `string`[]; `spamScore?`: `number`; `valid`: `boolean`; `warnings`: `string`[]; \}\>

***

### verifySenderDomain()

> **verifySenderDomain**(`tenantId`, `domain`): `Promise`\<\{ `domain`: `string`; `nextSteps?`: `string`[]; `success`: `boolean`; `verificationRecords`: `object`[]; \}\>

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:642](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L642)

Verify sender domain

#### Parameters

##### tenantId

`string`

##### domain

`string`

#### Returns

`Promise`\<\{ `domain`: `string`; `nextSteps?`: `string`[]; `success`: `boolean`; `verificationRecords`: `object`[]; \}\>

## Properties

### analyticsService

> `private` `readonly` **analyticsService**: [`EmailAnalyticsService`](../../email-analytics.service/classes/EmailAnalyticsService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L48)

***

### automationService

> `private` `readonly` **automationService**: [`EmailAutomationService`](../../email-automation.service/classes/EmailAutomationService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L47)

***

### campaignService

> `private` `readonly` **campaignService**: [`EmailCampaignService`](../../email-campaign.service/classes/EmailCampaignService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L46)

***

### deliveryService

> `private` `readonly` **deliveryService**: [`EmailDeliveryService`](../../email-delivery.service/classes/EmailDeliveryService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L49)

***

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L43)

***

### listService

> `private` `readonly` **listService**: [`EmailListService`](../../email-list.service/classes/EmailListService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L45)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L42)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L44)

***

### segmentService

> `private` `readonly` **segmentService**: [`EmailSegmentService`](../../email-segment.service/classes/EmailSegmentService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L50)

***

### templateService

> `private` `readonly` **templateService**: [`EmailTemplateService`](../../email-template.service/classes/EmailTemplateService.md)

Defined in: [src/modules/email-marketing/services/email-marketing.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-marketing.service.ts#L51)
