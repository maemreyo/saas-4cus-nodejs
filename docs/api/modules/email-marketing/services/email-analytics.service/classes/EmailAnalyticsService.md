[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-analytics.service](../README.md) / EmailAnalyticsService

# Class: EmailAnalyticsService

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:84](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L84)

## Constructors

### Constructor

> **new EmailAnalyticsService**(`prisma`, `redis`): `EmailAnalyticsService`

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:85](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L85)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

#### Returns

`EmailAnalyticsService`

## Methods

### getCampaignAnalytics()

> **getCampaignAnalytics**(`campaignId`, `options?`): `Promise`\<[`CampaignAnalytics`](../interfaces/CampaignAnalytics.md)\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:93](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L93)

Get campaign analytics

#### Parameters

##### campaignId

`string`

##### options?

###### includeClickMap?

`boolean`

###### includeDeviceStats?

`boolean`

###### includeHourlyMetrics?

`boolean`

###### includeLocationStats?

`boolean`

#### Returns

`Promise`\<[`CampaignAnalytics`](../interfaces/CampaignAnalytics.md)\>

***

### getCampaignPerformance()

> **getCampaignPerformance**(`tenantId`, `campaignId`, `interval`, `startDate?`, `endDate?`): `Promise`\<`object`[]\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:820](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L820)

Get campaign performance over time

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### interval

`"daily"` | `"weekly"` | `"hourly"`

##### startDate?

`Date`

##### endDate?

`Date`

#### Returns

`Promise`\<`object`[]\>

***

### getClickMap()

> `private` **getClickMap**(`campaignId`): `Promise`\<[`ClickMapEntry`](../interfaces/ClickMapEntry.md)[]\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:639](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L639)

Get click map for a campaign

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<[`ClickMapEntry`](../interfaces/ClickMapEntry.md)[]\>

***

### getComprehensiveAnalytics()

> **getComprehensiveAnalytics**(`tenantId`, `startDate`, `endDate`): `Promise`\<\{ `engagementTrends`: [`EngagementTrend`](../interfaces/EngagementTrend.md)[]; `overview`: \{ `averageClickRate`: `number`; `averageOpenRate`: `number`; `totalCampaigns`: `number`; `totalEmailsSent`: `number`; `totalRevenue`: `number`; \}; `subscriberGrowth`: [`GrowthMetric`](../interfaces/GrowthMetric.md)[]; `topCampaigns`: [`CampaignAnalytics`](../interfaces/CampaignAnalytics.md)[]; \}\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:502](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L502)

Get comprehensive analytics for a date range

#### Parameters

##### tenantId

`string`

##### startDate

`Date`

##### endDate

`Date`

#### Returns

`Promise`\<\{ `engagementTrends`: [`EngagementTrend`](../interfaces/EngagementTrend.md)[]; `overview`: \{ `averageClickRate`: `number`; `averageOpenRate`: `number`; `totalCampaigns`: `number`; `totalEmailsSent`: `number`; `totalRevenue`: `number`; \}; `subscriberGrowth`: [`GrowthMetric`](../interfaces/GrowthMetric.md)[]; `topCampaigns`: [`CampaignAnalytics`](../interfaces/CampaignAnalytics.md)[]; \}\>

***

### getDeviceStats()

> `private` **getDeviceStats**(`campaignId`): `Promise`\<[`DeviceStats`](../interfaces/DeviceStats.md)\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:666](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L666)

Get device statistics

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<[`DeviceStats`](../interfaces/DeviceStats.md)\>

***

### getEngagementTrends()

> **getEngagementTrends**(`tenantId`, `days`): `Promise`\<[`EngagementTrend`](../interfaces/EngagementTrend.md)[]\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:449](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L449)

Get engagement trends

#### Parameters

##### tenantId

`string`

##### days

`number` = `30`

#### Returns

`Promise`\<[`EngagementTrend`](../interfaces/EngagementTrend.md)[]\>

***

### getHourlyMetrics()

> `private` **getHourlyMetrics**(`campaignId`): `Promise`\<[`HourlyMetric`](../interfaces/HourlyMetric.md)[]\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:591](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L591)

Get hourly metrics for a campaign

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<[`HourlyMetric`](../interfaces/HourlyMetric.md)[]\>

***

### getLocationFromIP()

> `private` **getLocationFromIP**(`ipAddress`): `Promise`\<`string`\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:811](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L811)

Get location from IP address

#### Parameters

##### ipAddress

`string`

#### Returns

`Promise`\<`string`\>

***

### getLocationStats()

> `private` **getLocationStats**(`campaignId`): `Promise`\<[`LocationStats`](../interfaces/LocationStats.md)[]\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:707](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L707)

Get location statistics

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<[`LocationStats`](../interfaces/LocationStats.md)[]\>

***

### getSubscriberGrowth()

> **getSubscriberGrowth**(`tenantId`, `days`): `Promise`\<[`GrowthMetric`](../interfaces/GrowthMetric.md)[]\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:387](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L387)

Get subscriber growth metrics

#### Parameters

##### tenantId

`string`

##### days

`number` = `30`

#### Returns

`Promise`\<[`GrowthMetric`](../interfaces/GrowthMetric.md)[]\>

***

### parseUserAgent()

> `private` **parseUserAgent**(`userAgent`): `object`

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:775](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L775)

Parse user agent string

#### Parameters

##### userAgent

`string`

#### Returns

`object`

##### browser?

> `optional` **browser**: `string`

##### device?

> `optional` **device**: `string`

##### os?

> `optional` **os**: `string`

***

### trackActivity()

> **trackActivity**(`type`, `data`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:289](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L289)

Track email activity

#### Parameters

##### type

`EmailActivityType`

##### data

###### campaignId?

`string`

###### clickedUrl?

`string`

###### ipAddress?

`string`

###### subscriberId

`string`

###### userAgent?

`string`

#### Returns

`Promise`\<`void`\>

***

### updateCampaignStats()

> **updateCampaignStats**(`campaignId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:153](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L153)

Update campaign statistics

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<`void`\>

***

### updateSubscriberEngagement()

> `private` **updateSubscriberEngagement**(`subscriberId`, `activityType`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:751](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L751)

Update subscriber engagement score

#### Parameters

##### subscriberId

`string`

##### activityType

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:86](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L86)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-analytics.service.ts:87](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-analytics.service.ts#L87)
