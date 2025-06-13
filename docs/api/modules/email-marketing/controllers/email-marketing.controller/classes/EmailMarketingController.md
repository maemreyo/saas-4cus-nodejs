[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/controllers/email-marketing.controller](../README.md) / EmailMarketingController

# Class: EmailMarketingController

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L32)

## Constructors

### Constructor

> **new EmailMarketingController**(`emailMarketing`): `EmailMarketingController`

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L33)

#### Parameters

##### emailMarketing

[`EmailMarketingService`](../../../services/email-marketing.service/classes/EmailMarketingService.md)

#### Returns

`EmailMarketingController`

## Methods

### addToSuppressionList()

> **addToSuppressionList**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:309](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L309)

Add to suppression list

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `email`: `string`; `note?`: `string`; `reason`: `"manual"` \| `"bounce"` \| `"unsubscribe"` \| `"complaint"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### exportData()

> **exportData**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:88](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L88)

Export email marketing data

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `dateFrom?`: `Date`; `dateTo?`: `Date`; `format?`: `"csv"` \| `"json"`; `includeAnalytics?`: `boolean`; `includeCampaigns?`: `boolean`; `includeSubscribers?`: `boolean`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCurrentUsage()

> **getCurrentUsage**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:369](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L369)

Get current usage

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `period?`: `"month"` \| `"year"` \| `"day"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getDashboard()

> **getDashboard**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L40)

Get email marketing dashboard

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getDeliveryRates()

> **getDeliveryRates**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:171](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L171)

Get delivery rates

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `endDate?`: `string`; `interval?`: `"daily"` \| `"weekly"` \| `"monthly"` \| `"hourly"`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getEngagementMetrics()

> **getEngagementMetrics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:200](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L200)

Get engagement metrics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `endDate?`: `string`; `segmentBy?`: `"list"` \| `"automation"` \| `"campaign"`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getHealthStatus()

> **getHealthStatus**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:72](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L72)

Get health status

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getReputationScore()

> **getReputationScore**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:229](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L229)

Get reputation score

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSenderDomains()

> **getSenderDomains**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:245](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L245)

Get sender domains

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getStats()

> **getStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L56)

Get email marketing statistics

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSuppressionList()

> **getSuppressionList**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:281](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L281)

Get suppression list

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `limit?`: `number`; `page?`: `number`; `reason?`: `"manual"` \| `"bounce"` \| `"unsubscribe"` \| `"complaint"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUsageLimits()

> **getUsageLimits**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:353](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L353)

Get usage limits

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### previewEmail()

> **previewEmail**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:131](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L131)

Preview email

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `campaignId?`: `string`; `subscriberId?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### removeFromSuppressionList()

> **removeFromSuppressionList**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:333](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L333)

Remove from suppression list

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `email`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### testEmail()

> **testEmail**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:111](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L111)

Test email configuration

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `campaignId?`: `string`; `recipientEmail?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### validateContent()

> **validateContent**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:151](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L151)

Validate email content

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `html?`: `string`; `text?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### verifySenderDomain()

> **verifySenderDomain**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:261](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L261)

Verify sender domain

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `domain`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### emailMarketing

> `private` `readonly` **emailMarketing**: [`EmailMarketingService`](../../../services/email-marketing.service/classes/EmailMarketingService.md)

Defined in: [src/modules/email-marketing/controllers/email-marketing.controller.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-marketing.controller.ts#L34)
