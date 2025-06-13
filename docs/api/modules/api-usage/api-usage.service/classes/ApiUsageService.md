[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.service](../README.md) / ApiUsageService

# Class: ApiUsageService

Defined in: [src/modules/api-usage/api-usage.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L47)

## Constructors

### Constructor

> **new ApiUsageService**(`eventBus`, `subscriptionService`): `ApiUsageService`

Defined in: [src/modules/api-usage/api-usage.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L51)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### subscriptionService

[`SubscriptionService`](../../../billing/subscription.service/classes/SubscriptionService.md)

#### Returns

`ApiUsageService`

## Methods

### checkAndUpdateQuota()

> `private` **checkAndUpdateQuota**(`userId`, `endpoint`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.service.ts:382](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L382)

Check and update quota

#### Parameters

##### userId

`string`

##### endpoint

`string`

#### Returns

`Promise`\<`void`\>

***

### checkRateLimit()

> **checkRateLimit**(`userId`, `endpoint`, `limit?`): `Promise`\<[`RateLimitInfo`](../interfaces/RateLimitInfo.md)\>

Defined in: [src/modules/api-usage/api-usage.service.ts:342](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L342)

Check rate limit for user

#### Parameters

##### userId

`string`

##### endpoint

`string`

##### limit?

`number`

#### Returns

`Promise`\<[`RateLimitInfo`](../interfaces/RateLimitInfo.md)\>

***

### exportUsageData()

> **exportUsageData**(`userId`, `options`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/modules/api-usage/api-usage.service.ts:638](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L638)

Export usage data

#### Parameters

##### userId

`string`

##### options

###### endDate

`Date`

###### format

`"csv"` \| `"json"`

###### startDate

`Date`

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### getEndpointAnalytics()

> **getEndpointAnalytics**(`endpoint`, `options?`): `Promise`\<\{ `averageResponseTime`: `number`; `endpoint`: `string`; `errorRate`: `number`; `methods`: `Record`\<`string`, `number`\>; `p95ResponseTime`: `number`; `p99ResponseTime`: `number`; `statusCodes`: `Record`\<`string`, `number`\>; `topErrors`: `object`[]; `totalRequests`: `number`; `uniqueUsers`: `number`; \}\>

Defined in: [src/modules/api-usage/api-usage.service.ts:488](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L488)

Get endpoint analytics

#### Parameters

##### endpoint

`string`

##### options?

###### endDate?

`Date`

###### startDate?

`Date`

###### tenantId?

`string`

#### Returns

`Promise`\<\{ `averageResponseTime`: `number`; `endpoint`: `string`; `errorRate`: `number`; `methods`: `Record`\<`string`, `number`\>; `p95ResponseTime`: `number`; `p99ResponseTime`: `number`; `statusCodes`: `Record`\<`string`, `number`\>; `topErrors`: `object`[]; `totalRequests`: `number`; `uniqueUsers`: `number`; \}\>

***

### getResponseTimePercentiles()

> `private` **getResponseTimePercentiles**(`where`): `Promise`\<\{ `averageResponseTime`: `number`; `p95ResponseTime`: `number`; `p99ResponseTime`: `number`; \}\>

Defined in: [src/modules/api-usage/api-usage.service.ts:579](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L579)

Get response time percentiles

#### Parameters

##### where

`any`

#### Returns

`Promise`\<\{ `averageResponseTime`: `number`; `p95ResponseTime`: `number`; `p99ResponseTime`: `number`; \}\>

***

### getTopEndpoints()

> `private` **getTopEndpoints**(`where`, `limit`): `Promise`\<[`ApiUsageMetrics`](../interfaces/ApiUsageMetrics.md)[]\>

Defined in: [src/modules/api-usage/api-usage.service.ts:231](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L231)

Get top endpoints by usage

#### Parameters

##### where

`any`

##### limit

`number` = `10`

#### Returns

`Promise`\<[`ApiUsageMetrics`](../interfaces/ApiUsageMetrics.md)[]\>

***

### getTopErrors()

> `private` **getTopErrors**(`where`, `limit`): `Promise`\<`object`[]\>

Defined in: [src/modules/api-usage/api-usage.service.ts:613](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L613)

Get top errors

#### Parameters

##### where

`any`

##### limit

`number` = `5`

#### Returns

`Promise`\<`object`[]\>

***

### getUsageQuota()

> **getUsageQuota**(`userId`): `Promise`\<[`UsageQuota`](../interfaces/UsageQuota.md)[]\>

Defined in: [src/modules/api-usage/api-usage.service.ts:432](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L432)

Get usage quota for user

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<[`UsageQuota`](../interfaces/UsageQuota.md)[]\>

***

### getUsageStats()

> **getUsageStats**(`userId?`, `tenantId?`, `options?`): `Promise`\<[`ApiUsageStats`](../interfaces/ApiUsageStats.md)\>

Defined in: [src/modules/api-usage/api-usage.service.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L152)

Get API usage statistics

#### Parameters

##### userId?

`string`

##### tenantId?

`string`

##### options?

###### endDate?

`Date`

###### groupBy?

`"month"` \| `"hour"` \| `"day"`

###### startDate?

`Date`

#### Returns

`Promise`\<[`ApiUsageStats`](../interfaces/ApiUsageStats.md)\>

***

### getUsageTimeSeries()

> **getUsageTimeSeries**(`options`, `userId?`, `tenantId?`): `Promise`\<`object`[]\>

Defined in: [src/modules/api-usage/api-usage.service.ts:276](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L276)

Get usage time series

#### Parameters

##### options

###### endDate

`Date`

###### endpoint?

`string`

###### groupBy

`"month"` \| `"hour"` \| `"day"`

###### startDate

`Date`

##### userId?

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<`object`[]\>

***

### healthCheck()

> **healthCheck**(): `Promise`\<\{ `issues`: `string`[]; `metrics`: \{ `activeEndpoints`: `number`; `averageResponseTime`: `number`; `errorRate`: `number`; `requestsPerMinute`: `number`; \}; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

Defined in: [src/modules/api-usage/api-usage.service.ts:671](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L671)

Health check for API monitoring

#### Returns

`Promise`\<\{ `issues`: `string`[]; `metrics`: \{ `activeEndpoints`: `number`; `averageResponseTime`: `number`; `errorRate`: `number`; `requestsPerMinute`: `number`; \}; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

***

### trackRealTimeMetrics()

> `private` **trackRealTimeMetrics**(`userId`, `endpoint`, `method`, `statusCode`, `responseTime`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.service.ts:111](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L111)

Track real-time metrics in Redis

#### Parameters

##### userId

`string`

##### endpoint

`string`

##### method

`string`

##### statusCode

`number`

##### responseTime

`number`

#### Returns

`Promise`\<`void`\>

***

### trackUsage()

> **trackUsage**(`userId`, `endpoint`, `method`, `statusCode`, `responseTime`, `options?`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.service.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L59)

Track API usage

#### Parameters

##### userId

`string`

##### endpoint

`string`

##### method

`string`

##### statusCode

`number`

##### responseTime

`number`

##### options?

###### ipAddress?

`string`

###### metadata?

`Record`\<`string`, `any`\>

###### tenantId?

`string`

###### userAgent?

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/api-usage/api-usage.service.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L52)

***

### METRICS\_WINDOW

> `private` `readonly` **METRICS\_WINDOW**: `60` = `60`

Defined in: [src/modules/api-usage/api-usage.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L48)

***

### subscriptionService

> `private` **subscriptionService**: [`SubscriptionService`](../../../billing/subscription.service/classes/SubscriptionService.md)

Defined in: [src/modules/api-usage/api-usage.service.ts:53](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L53)

***

### USAGE\_CACHE\_TTL

> `private` `readonly` **USAGE\_CACHE\_TTL**: `300` = `300`

Defined in: [src/modules/api-usage/api-usage.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.service.ts#L49)
