[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.controller](../README.md) / ApiUsageController

# Class: ApiUsageController

Defined in: [src/modules/api-usage/api-usage.controller.ts:8](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L8)

## Constructors

### Constructor

> **new ApiUsageController**(`apiUsageService`): `ApiUsageController`

Defined in: [src/modules/api-usage/api-usage.controller.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L9)

#### Parameters

##### apiUsageService

[`ApiUsageService`](../../api-usage.service/classes/ApiUsageService.md)

#### Returns

`ApiUsageController`

## Methods

### exportUsageData()

> **exportUsageData**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:105](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L105)

Export usage data

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`ExportUsageDataDTO`](../../api-usage.dto/classes/ExportUsageDataDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getEndpointAnalytics()

> **getEndpointAnalytics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:82](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L82)

Get endpoint analytics

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `endpoint`: `string`; \}; `Querystring`: [`GetEndpointAnalyticsDTO`](../../api-usage.dto/classes/GetEndpointAnalyticsDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getHealthStatus()

> **getHealthStatus**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:127](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L127)

Get API health status

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getRateLimit()

> **getRateLimit**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L59)

Get current rate limit info

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `endpoint?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSystemMetrics()

> **getSystemMetrics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:157](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L157)

Get system-wide API metrics (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `period?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTopUsers()

> **getTopUsers**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:138](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L138)

Get top users by API usage (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `endDate?`: `string`; `limit?`: `number`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUsageQuota()

> **getUsageQuota**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:71](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L71)

Get usage quota

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUsageStats()

> **getUsageStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L14)

Get usage statistics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`GetUsageStatsDTO`](../../api-usage.dto/classes/GetUsageStatsDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUsageTimeSeries()

> **getUsageTimeSeries**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.controller.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L34)

Get usage time series

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`GetUsageTimeSeriesDTO`](../../api-usage.dto/classes/GetUsageTimeSeriesDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### apiUsageService

> `private` **apiUsageService**: [`ApiUsageService`](../../api-usage.service/classes/ApiUsageService.md)

Defined in: [src/modules/api-usage/api-usage.controller.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.controller.ts#L9)
