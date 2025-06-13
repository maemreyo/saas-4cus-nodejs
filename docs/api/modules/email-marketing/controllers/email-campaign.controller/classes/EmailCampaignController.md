[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/controllers/email-campaign.controller](../README.md) / EmailCampaignController

# Class: EmailCampaignController

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L21)

## Constructors

### Constructor

> **new EmailCampaignController**(`campaignService`, `analytics`, `abTesting`): `EmailCampaignController`

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L22)

#### Parameters

##### campaignService

[`EmailCampaignService`](../../../services/email-campaign.service/classes/EmailCampaignService.md)

##### analytics

[`EmailAnalyticsService`](../../../services/email-analytics.service/classes/EmailAnalyticsService.md)

##### abTesting

[`ABTestingService`](../../../services/ab-testing.service/classes/ABTestingService.md)

#### Returns

`EmailCampaignController`

## Methods

### createABTest()

> **createABTest**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:337](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L337)

Create A/B test

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `testDuration`: `number`; `testPercentage`: `number`; `variantB`: \{ `content?`: `string`; `senderName?`: `string`; `subject?`: `string`; \}; `winnerCriteria`: `"conversion_rate"` \| `"open_rate"` \| `"click_rate"`; \}; `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createCampaign()

> **createCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L31)

Create campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `abTestConfig?`: \{ `testDuration?`: `number`; `testPercentage?`: `number`; `variants?`: `object`[]; `winningMetric?`: `"opens"` \| `"clicks"` \| `"conversions"`; \}; `excludeSegmentIds?`: `string`[]; `fromEmail?`: `string`; `fromName?`: `string`; `googleAnalytics?`: `boolean`; `htmlContent?`: `string`; `isABTest?`: `boolean`; `listId?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `preheader?`: `string`; `replyTo?`: `string`; `segmentIds?`: `string`[]; `subject?`: `string`; `templateId?`: `string`; `textContent?`: `string`; `trackClicks?`: `boolean`; `trackOpens?`: `boolean`; `type?`: `"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"`; `utmParams?`: \{ `campaign?`: `string`; `content?`: `string`; `medium?`: `string`; `source?`: `string`; `term?`: `string`; \}; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteCampaign()

> **deleteCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:113](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L113)

Delete campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### duplicateCampaign()

> **duplicateCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:214](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L214)

Duplicate campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `name?`: `string`; \}; `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getABTestResults()

> **getABTestResults**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:368](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L368)

Get A/B test results

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCampaign()

> **getCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:71](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L71)

Get single campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCampaignAnalytics()

> **getCampaignAnalytics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:236](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L236)

Get campaign analytics

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCampaignPerformance()

> **getCampaignPerformance**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:256](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L256)

Get campaign performance over time

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `campaignId`: `string`; \}; `Querystring`: \{ `endDate?`: `string`; `interval?`: `"daily"` \| `"weekly"` \| `"hourly"`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCampaigns()

> **getCampaigns**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L51)

Get campaigns

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `dateFrom?`: `Date`; `dateTo?`: `Date`; `limit?`: `number`; `listId?`: `string`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"sentAt"` \| `"openRate"` \| `"clickRate"`; `sortOrder?`: `"asc"` \| `"desc"`; `status?`: `"PAUSED"` \| `"CANCELLED"` \| `"DRAFT"` \| `"SCHEDULED"` \| `"SENDING"` \| `"SENT"` \| `"FAILED"`; `type?`: `"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### pauseCampaign()

> **pauseCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:174](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L174)

Pause campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### previewCampaign()

> **previewCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:288](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L288)

Preview campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `campaignId`: `string`; \}; `Querystring`: \{ `subscriberId?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### resumeCampaign()

> **resumeCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:194](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L194)

Resume campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### scheduleCampaign()

> **scheduleCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:130](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L130)

Schedule campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `scheduledAt?`: `Date`; \}; `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### sendCampaign()

> **sendCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L152)

Send campaign immediately

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `batchSize?`: `number`; `delayBetweenBatches?`: `number`; `limit?`: `number`; `testEmails?`: `string`[]; `testMode?`: `boolean`; \}; `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### sendTestEmail()

> **sendTestEmail**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:312](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L312)

Send test email

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `recipientEmail`: `string`; `subscriberId?`: `string`; \}; `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateCampaign()

> **updateCampaign**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:91](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L91)

Update campaign

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `abTestConfig?`: \{ `testDuration?`: `number`; `testPercentage?`: `number`; `variants?`: `object`[]; `winningMetric?`: `"opens"` \| `"clicks"` \| `"conversions"`; \}; `excludeSegmentIds?`: `string`[]; `fromEmail?`: `string`; `fromName?`: `string`; `googleAnalytics?`: `boolean`; `htmlContent?`: `string`; `isABTest?`: `boolean`; `listId?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `preheader?`: `string`; `replyTo?`: `string`; `segmentIds?`: `string`[]; `subject?`: `string`; `templateId?`: `string`; `textContent?`: `string`; `trackClicks?`: `boolean`; `trackOpens?`: `boolean`; `type?`: `"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"`; `utmParams?`: \{ `campaign?`: `string`; `content?`: `string`; `medium?`: `string`; `source?`: `string`; `term?`: `string`; \}; \}; `Params`: \{ `campaignId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### abTesting

> `private` `readonly` **abTesting**: [`ABTestingService`](../../../services/ab-testing.service/classes/ABTestingService.md)

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L25)

***

### analytics

> `private` `readonly` **analytics**: [`EmailAnalyticsService`](../../../services/email-analytics.service/classes/EmailAnalyticsService.md)

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L24)

***

### campaignService

> `private` `readonly` **campaignService**: [`EmailCampaignService`](../../../services/email-campaign.service/classes/EmailCampaignService.md)

Defined in: [src/modules/email-marketing/controllers/email-campaign.controller.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-campaign.controller.ts#L23)
