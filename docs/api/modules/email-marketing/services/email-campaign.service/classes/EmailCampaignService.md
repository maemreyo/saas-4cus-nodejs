[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-campaign.service](../README.md) / EmailCampaignService

# Class: EmailCampaignService

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L35)

## Constructors

### Constructor

> **new EmailCampaignService**(`prisma`, `eventBus`, `redis`, `queue`, `segmentService`, `deliveryService`, `abTestingService`): `EmailCampaignService`

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L36)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

##### queue

[`QueueService`](../../../../../shared/queue/queue.service/classes/QueueService.md)

##### segmentService

[`EmailSegmentService`](../../email-segment.service/classes/EmailSegmentService.md)

##### deliveryService

[`EmailDeliveryService`](../../email-delivery.service/classes/EmailDeliveryService.md)

##### abTestingService

[`ABTestingService`](../../ab-testing.service/classes/ABTestingService.md)

#### Returns

`EmailCampaignService`

## Methods

### cancelCampaign()

> **cancelCampaign**(`tenantId`, `campaignId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:488](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L488)

Cancel a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

#### Returns

`Promise`\<`void`\>

***

### createCampaign()

> **createCampaign**(`tenantId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L49)

Create a new campaign

#### Parameters

##### tenantId

`string`

##### data

###### abTestConfig?

\{ `testDuration?`: `number`; `testPercentage?`: `number`; `variants?`: `object`[]; `winningMetric?`: `"opens"` \| `"clicks"` \| `"conversions"`; \} = `...`

###### abTestConfig.testDuration?

`number` = `...`

###### abTestConfig.testPercentage?

`number` = `...`

###### abTestConfig.variants?

`object`[] = `...`

###### abTestConfig.winningMetric?

`"opens"` \| `"clicks"` \| `"conversions"` = `...`

###### excludeSegmentIds?

`string`[] = `...`

###### fromEmail?

`string` = `...`

###### fromName?

`string` = `...`

###### googleAnalytics?

`boolean` = `...`

###### htmlContent?

`string` = `...`

###### isABTest?

`boolean` = `...`

###### listId?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### preheader?

`string` = `...`

###### replyTo?

`string` = `...`

###### segmentIds?

`string`[] = `...`

###### subject?

`string` = `...`

###### templateId?

`string` = `...`

###### textContent?

`string` = `...`

###### trackClicks?

`boolean` = `...`

###### trackOpens?

`boolean` = `...`

###### type?

`"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"` = `...`

###### utmParams?

\{ `campaign?`: `string`; `content?`: `string`; `medium?`: `string`; `source?`: `string`; `term?`: `string`; \} = `...`

###### utmParams.campaign?

`string` = `...`

###### utmParams.content?

`string` = `...`

###### utmParams.medium?

`string` = `...`

###### utmParams.source?

`string` = `...`

###### utmParams.term?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

***

### createRecipientRecords()

> `private` **createRecipientRecords**(`campaignId`, `recipients`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:640](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L640)

Create recipient records for tracking

#### Parameters

##### campaignId

`string`

##### recipients

`object`[]

#### Returns

`Promise`\<`void`\>

***

### deleteCampaign()

> **deleteCampaign**(`tenantId`, `campaignId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:566](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L566)

Delete a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

#### Returns

`Promise`\<`void`\>

***

### duplicateCampaign()

> **duplicateCampaign**(`tenantId`, `campaignId`, `name?`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:519](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L519)

Duplicate a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### name?

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getCampaign()

> **getCampaign**(`tenantId`, `campaignId`): `Promise`\<[`CampaignWithStats`](../interfaces/CampaignWithStats.md)\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:184](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L184)

Get campaign with stats

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

#### Returns

`Promise`\<[`CampaignWithStats`](../interfaces/CampaignWithStats.md)\>

***

### getCampaigns()

> **getCampaigns**(`tenantId`, `filters`): `Promise`\<\{ `campaigns`: [`CampaignWithStats`](../interfaces/CampaignWithStats.md)[]; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:222](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L222)

Get campaigns with pagination and filtering

#### Parameters

##### tenantId

`string`

##### filters

###### dateFrom?

`Date` = `...`

###### dateTo?

`Date` = `...`

###### limit?

`number` = `...`

###### listId?

`string` = `...`

###### page?

`number` = `...`

###### search?

`string` = `...`

###### sortBy?

`"name"` \| `"createdAt"` \| `"sentAt"` \| `"openRate"` \| `"clickRate"` = `...`

###### sortOrder?

`"asc"` \| `"desc"` = `...`

###### status?

`"PAUSED"` \| `"CANCELLED"` \| `"DRAFT"` \| `"SCHEDULED"` \| `"SENDING"` \| `"SENT"` \| `"FAILED"` = `...`

###### type?

`"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"` = `...`

#### Returns

`Promise`\<\{ `campaigns`: [`CampaignWithStats`](../interfaces/CampaignWithStats.md)[]; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

***

### getRecipients()

> `private` **getRecipients**(`campaign`, `options?`): `Promise`\<`object`[]\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:588](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L588)

Get campaign recipients based on segments

#### Parameters

##### campaign

##### options?

###### batchSize?

`number` = `...`

###### delayBetweenBatches?

`number` = `...`

###### limit?

`number` = `...`

###### testEmails?

`string`[] = `...`

###### testMode?

`boolean` = `...`

#### Returns

`Promise`\<`object`[]\>

***

### invalidateCampaignCache()

> `private` **invalidateCampaignCache**(`campaignId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:664](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L664)

Invalidate campaign cache

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<`void`\>

***

### listCampaigns()

> `private` **listCampaigns**(`tenantId`, `filters`): `Promise`\<\{ `campaigns`: [`CampaignWithStats`](../interfaces/CampaignWithStats.md)[]; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:238](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L238)

List campaigns with filters

#### Parameters

##### tenantId

`string`

##### filters

###### dateFrom?

`Date` = `...`

###### dateTo?

`Date` = `...`

###### limit?

`number` = `...`

###### listId?

`string` = `...`

###### page?

`number` = `...`

###### search?

`string` = `...`

###### sortBy?

`"name"` \| `"createdAt"` \| `"sentAt"` \| `"openRate"` \| `"clickRate"` = `...`

###### sortOrder?

`"asc"` \| `"desc"` = `...`

###### status?

`"PAUSED"` \| `"CANCELLED"` \| `"DRAFT"` \| `"SCHEDULED"` \| `"SENDING"` \| `"SENT"` \| `"FAILED"` = `...`

###### type?

`"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"` = `...`

#### Returns

`Promise`\<\{ `campaigns`: [`CampaignWithStats`](../interfaces/CampaignWithStats.md)[]; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

***

### pauseCampaign()

> **pauseCampaign**(`tenantId`, `campaignId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:426](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L426)

Pause a sending campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### previewCampaign()

> **previewCampaign**(`tenantId`, `campaignId`, `subscriberId?`): `Promise`\<\{ `htmlContent`: `string`; `subject`: `string`; `textContent`: `string`; \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:671](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L671)

Preview campaign content with subscriber data

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### subscriberId?

`string`

#### Returns

`Promise`\<\{ `htmlContent`: `string`; `subject`: `string`; `textContent`: `string`; \}\>

***

### resumeCampaign()

> **resumeCampaign**(`tenantId`, `campaignId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:456](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L456)

Resume a paused campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### scheduleCampaign()

> **scheduleCampaign**(`tenantId`, `campaignId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:299](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L299)

Schedule a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### data

###### scheduledAt?

`Date` = `...`

#### Returns

`Promise`\<\{ \}\>

***

### sendCampaign()

> **sendCampaign**(`tenantId`, `campaignId`, `options?`): `Promise`\<\{ `recipientCount`: `number`; `success`: `boolean`; \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:349](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L349)

Send a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### options?

###### batchSize?

`number` = `...`

###### delayBetweenBatches?

`number` = `...`

###### limit?

`number` = `...`

###### testEmails?

`string`[] = `...`

###### testMode?

`boolean` = `...`

#### Returns

`Promise`\<\{ `recipientCount`: `number`; `success`: `boolean`; \}\>

***

### sendTestEmail()

> **sendTestEmail**(`tenantId`, `campaignId`, `recipientEmail`, `subscriberId?`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:709](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L709)

Send a test email for a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### recipientEmail

`string`

##### subscriberId?

`string`

#### Returns

`Promise`\<`void`\>

***

### updateCampaign()

> **updateCampaign**(`tenantId`, `campaignId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:155](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L155)

Update a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### data

###### abTestConfig?

\{ `testDuration?`: `number`; `testPercentage?`: `number`; `variants?`: `object`[]; `winningMetric?`: `"opens"` \| `"clicks"` \| `"conversions"`; \} = `...`

###### abTestConfig.testDuration?

`number` = `...`

###### abTestConfig.testPercentage?

`number` = `...`

###### abTestConfig.variants?

`object`[] = `...`

###### abTestConfig.winningMetric?

`"opens"` \| `"clicks"` \| `"conversions"` = `...`

###### excludeSegmentIds?

`string`[] = `...`

###### fromEmail?

`string` = `...`

###### fromName?

`string` = `...`

###### googleAnalytics?

`boolean` = `...`

###### htmlContent?

`string` = `...`

###### isABTest?

`boolean` = `...`

###### listId?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### preheader?

`string` = `...`

###### replyTo?

`string` = `...`

###### segmentIds?

`string`[] = `...`

###### subject?

`string` = `...`

###### templateId?

`string` = `...`

###### textContent?

`string` = `...`

###### trackClicks?

`boolean` = `...`

###### trackOpens?

`boolean` = `...`

###### type?

`"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"` = `...`

###### utmParams?

\{ `campaign?`: `string`; `content?`: `string`; `medium?`: `string`; `source?`: `string`; `term?`: `string`; \} = `...`

###### utmParams.campaign?

`string` = `...`

###### utmParams.content?

`string` = `...`

###### utmParams.medium?

`string` = `...`

###### utmParams.source?

`string` = `...`

###### utmParams.term?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

## Properties

### abTestingService

> `private` `readonly` **abTestingService**: [`ABTestingService`](../../ab-testing.service/classes/ABTestingService.md)

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L43)

***

### deliveryService

> `private` `readonly` **deliveryService**: [`EmailDeliveryService`](../../email-delivery.service/classes/EmailDeliveryService.md)

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L42)

***

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L38)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L37)

***

### queue

> `private` `readonly` **queue**: [`QueueService`](../../../../../shared/queue/queue.service/classes/QueueService.md)

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L40)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L39)

***

### segmentService

> `private` `readonly` **segmentService**: [`EmailSegmentService`](../../email-segment.service/classes/EmailSegmentService.md)

Defined in: [src/modules/email-marketing/services/email-campaign.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-campaign.service.ts#L41)
