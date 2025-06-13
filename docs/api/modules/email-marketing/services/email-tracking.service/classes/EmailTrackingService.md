[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-tracking.service](../README.md) / EmailTrackingService

# Class: EmailTrackingService

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L25)

## Constructors

### Constructor

> **new EmailTrackingService**(`prisma`, `redis`, `analytics`): `EmailTrackingService`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:29](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L29)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

##### analytics

[`EmailAnalyticsService`](../../email-analytics.service/classes/EmailAnalyticsService.md)

#### Returns

`EmailTrackingService`

## Methods

### addTrackingPixel()

> **addTrackingPixel**(`html`, `data`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:203](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L203)

Add tracking pixel to email content

#### Parameters

##### html

`string`

##### data

[`TrackingPixelData`](../interfaces/TrackingPixelData.md)

#### Returns

`string`

***

### addUTMParameters()

> **addUTMParameters**(`url`, `params`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:219](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L219)

Generate UTM parameters for a URL

#### Parameters

##### url

`string`

##### params

###### campaign?

`string`

###### content?

`string`

###### medium?

`string`

###### source?

`string`

###### term?

`string`

#### Returns

`string`

***

### addUTMParametersToLinks()

> `private` **addUTMParametersToLinks**(`html`, `utmParams`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:514](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L514)

Add UTM parameters to all links in HTML

#### Parameters

##### html

`string`

##### utmParams

`any`

#### Returns

`string`

***

### batchTrackEvents()

> **batchTrackEvents**(`events`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:297](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L297)

Batch track email events (for webhook processing)

#### Parameters

##### events

`object`[]

#### Returns

`Promise`\<`void`\>

***

### decodeTrackingData()

> `private` **decodeTrackingData**\<`T`\>(`encoded`): `T`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:446](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L446)

Decode tracking data

#### Type Parameters

##### T

`T`

#### Parameters

##### encoded

`string`

#### Returns

`T`

***

### decrypt()

> `private` **decrypt**(`text`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:476](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L476)

Decrypt data

#### Parameters

##### text

`string`

#### Returns

`string`

***

### encodeTrackingData()

> `private` **encodeTrackingData**(`data`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:437](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L437)

Encode tracking data

#### Parameters

##### data

`any`

#### Returns

`string`

***

### encrypt()

> `private` **encrypt**(`text`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:459](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L459)

Encrypt data

#### Parameters

##### text

`string`

#### Returns

`string`

***

### generateTrackedLink()

> **generateTrackedLink**(`originalUrl`, `data`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L49)

Generate tracked link

#### Parameters

##### originalUrl

`string`

##### data

`Omit`\<[`TrackingLinkData`](../interfaces/TrackingLinkData.md), `"originalUrl"` \| `"linkId"`\>

#### Returns

`string`

***

### generateTrackingPixel()

> **generateTrackingPixel**(`data`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L41)

Generate tracking pixel URL

#### Parameters

##### data

[`TrackingPixelData`](../interfaces/TrackingPixelData.md)

#### Returns

`string`

***

### getTrackingStats()

> **getTrackingStats**(`campaignId`): `Promise`\<\{ `clickedLinks`: `object`[]; `totalClicks`: `number`; `totalDelivered`: `number`; `totalOpens`: `number`; `totalSent`: `number`; `uniqueClicks`: `number`; `uniqueOpens`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:345](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L345)

Get tracking statistics for a campaign

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<\{ `clickedLinks`: `object`[]; `totalClicks`: `number`; `totalDelivered`: `number`; `totalOpens`: `number`; `totalSent`: `number`; `uniqueClicks`: `number`; `uniqueOpens`: `number`; \}\>

***

### processEmailForTracking()

> **processEmailForTracking**(`html`, `options`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:258](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L258)

Process email content for tracking

#### Parameters

##### html

`string`

##### options

###### campaignId

`string`

###### recipientId

`string`

###### trackClicks

`boolean`

###### trackOpens

`boolean`

###### utmParams?

`any`

#### Returns

`string`

***

### replaceLinksWithTracking()

> **replaceLinksWithTracking**(`html`, `data`): `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:179](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L179)

Replace links in email content with tracked versions

#### Parameters

##### html

`string`

##### data

###### campaignId

`string`

###### recipientId

`string`

#### Returns

`string`

***

### shouldSkipTracking()

> `private` **shouldSkipTracking**(`url`): `boolean`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:497](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L497)

Check if URL should skip tracking

#### Parameters

##### url

`string`

#### Returns

`boolean`

***

### trackClick()

> **trackClick**(`encoded`, `metadata`): `Promise`\<`string`\>

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:117](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L117)

Process link click tracking

#### Parameters

##### encoded

`string`

##### metadata

###### ipAddress?

`string`

###### userAgent?

`string`

#### Returns

`Promise`\<`string`\>

***

### trackOpen()

> **trackOpen**(`encoded`, `metadata`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L65)

Process tracking pixel request

#### Parameters

##### encoded

`string`

##### metadata

###### ipAddress?

`string`

###### userAgent?

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### analytics

> `private` `readonly` **analytics**: [`EmailAnalyticsService`](../../email-analytics.service/classes/EmailAnalyticsService.md)

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L32)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L30)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L31)

***

### secretKey

> `private` `readonly` **secretKey**: `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L27)

***

### trackingDomain

> `private` `readonly` **trackingDomain**: `string`

Defined in: [src/modules/email-marketing/services/email-tracking.service.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-tracking.service.ts#L26)
