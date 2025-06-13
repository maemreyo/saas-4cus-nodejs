[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin-metrics.service](../README.md) / AdminMetricsService

# Class: AdminMetricsService

Defined in: [src/modules/admin/admin-metrics.service.ts:74](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L74)

## Constructors

### Constructor

> **new AdminMetricsService**(): `AdminMetricsService`

#### Returns

`AdminMetricsService`

## Methods

### calculateRevenueGrowth()

> `private` **calculateRevenueGrowth**(`invoices`, `periods`): `Promise`\<`Record`\<`string`, `number`\>\>

Defined in: [src/modules/admin/admin-metrics.service.ts:567](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L567)

#### Parameters

##### invoices

`any`[]

##### periods

`Record`\<`string`, `Date`\>

#### Returns

`Promise`\<`Record`\<`string`, `number`\>\>

***

### checkDatabaseHealth()

> `private` **checkDatabaseHealth**(): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/admin-metrics.service.ts:727](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L727)

#### Returns

`Promise`\<`boolean`\>

***

### checkQueueHealth()

> `private` **checkQueueHealth**(): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/admin-metrics.service.ts:747](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L747)

#### Returns

`Promise`\<`boolean`\>

***

### checkRedisHealth()

> `private` **checkRedisHealth**(): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/admin-metrics.service.ts:737](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L737)

#### Returns

`Promise`\<`boolean`\>

***

### getApiUsageMetrics()

> `private` **getApiUsageMetrics**(`startDate`): `Promise`\<\{ `byEndpoint`: `object`[]; `errorsByEndpoint`: `object`[]; `totalCalls`: `number`; `uniqueUsers`: `number`; \}\>

Defined in: [src/modules/admin/admin-metrics.service.ts:593](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L593)

#### Parameters

##### startDate

`Date`

#### Returns

`Promise`\<\{ `byEndpoint`: `object`[]; `errorsByEndpoint`: `object`[]; `totalCalls`: `number`; `uniqueUsers`: `number`; \}\>

***

### getApiUsageTrend()

> `private` **getApiUsageTrend**(`dates`): `Promise`\<`any`[]\>

Defined in: [src/modules/admin/admin-metrics.service.ts:488](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L488)

#### Parameters

##### dates

`Date`[]

#### Returns

`Promise`\<`any`[]\>

***

### getAverageQueryTime()

> `private` **getAverageQueryTime**(): `Promise`\<`number`\>

Defined in: [src/modules/admin/admin-metrics.service.ts:764](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L764)

#### Returns

`Promise`\<`number`\>

***

### getErrorRate()

> `private` **getErrorRate**(): `Promise`\<`number`\>

Defined in: [src/modules/admin/admin-metrics.service.ts:770](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L770)

#### Returns

`Promise`\<`number`\>

***

### getErrorTrend()

> `private` **getErrorTrend**(`dates`): `Promise`\<`any`[]\>

Defined in: [src/modules/admin/admin-metrics.service.ts:507](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L507)

#### Parameters

##### dates

`Date`[]

#### Returns

`Promise`\<`any`[]\>

***

### getFeatureUsageMetrics()

> `private` **getFeatureUsageMetrics**(`startDate`): `Promise`\<\{ `adoptionRate`: `Record`\<`string`, `number`\>; `byFeature`: `object`[]; \}\>

Defined in: [src/modules/admin/admin-metrics.service.ts:646](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L646)

#### Parameters

##### startDate

`Date`

#### Returns

`Promise`\<\{ `adoptionRate`: `Record`\<`string`, `number`\>; `byFeature`: `object`[]; \}\>

***

### getHealthMetrics()

> **getHealthMetrics**(): `Promise`\<\{ `errors`: \{ `errorRate`: `number`; `last1Hour`: `number`; \}; `performance`: \{ `averageQueryTime`: `number`; `slowQueries`: `number`; \}; `services`: \{ `database`: `string`; `queue`: `string`; `redis`: `string`; \}; `status`: `string`; `timestamp`: `Date`; \}\>

Defined in: [src/modules/admin/admin-metrics.service.ts:232](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L232)

Get system health metrics

#### Returns

`Promise`\<\{ `errors`: \{ `errorRate`: `number`; `last1Hour`: `number`; \}; `performance`: \{ `averageQueryTime`: `number`; `slowQueries`: `number`; \}; `services`: \{ `database`: `string`; `queue`: `string`; `redis`: `string`; \}; `status`: `string`; `timestamp`: `Date`; \}\>

***

### getOverviewMetrics()

> `private` **getOverviewMetrics**(`dateRange`): `Promise`\<\{ `activeSubscriptions`: `number`; `activeUsers`: `number`; `avgResponseTime`: `number`; `mrr`: `number`; `openTickets`: `number`; `totalRevenue`: `number`; `totalTickets`: `number`; `totalUsers`: `number`; \}\>

Defined in: [src/modules/admin/admin-metrics.service.ts:328](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L328)

#### Parameters

##### dateRange

###### end

`Date`

###### start

`Date`

#### Returns

`Promise`\<\{ `activeSubscriptions`: `number`; `activeUsers`: `number`; `avgResponseTime`: `number`; `mrr`: `number`; `openTickets`: `number`; `totalRevenue`: `number`; `totalTickets`: `number`; `totalUsers`: `number`; \}\>

***

### getPerformanceMetrics()

> `private` **getPerformanceMetrics**(): `Promise`\<\{ `averageResponseTime`: `number`; `cpu`: `number`; `errorRate`: `number`; `memory`: \{ `percentage`: `number`; `total`: `number`; `used`: `number`; \}; `requestsPerMinute`: `number`; `uptime`: `number`; \}\>

Defined in: [src/modules/admin/admin-metrics.service.ts:394](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L394)

#### Returns

`Promise`\<\{ `averageResponseTime`: `number`; `cpu`: `number`; `errorRate`: `number`; `memory`: \{ `percentage`: `number`; `total`: `number`; `used`: `number`; \}; `requestsPerMinute`: `number`; `uptime`: `number`; \}\>

***

### getRealTimeMetrics()

> **getRealTimeMetrics**(): `Promise`\<\{ `activeUsers`: `number`; `averageResponseTime`: `number`; `errorRate`: `number`; `errorsPerMinute`: `number`; `recentEndpoints`: `object`[]; `requestsPerMinute`: `number`; `timestamp`: `Date`; \}\>

Defined in: [src/modules/admin/admin-metrics.service.ts:272](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L272)

Get real-time metrics

#### Returns

`Promise`\<\{ `activeUsers`: `number`; `averageResponseTime`: `number`; `errorRate`: `number`; `errorsPerMinute`: `number`; `recentEndpoints`: `object`[]; `requestsPerMinute`: `number`; `timestamp`: `Date`; \}\>

***

### getRevenueByPlan()

> `private` **getRevenueByPlan**(): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/admin-metrics.service.ts:527](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L527)

#### Returns

`Promise`\<`object`[]\>

***

### getRevenueGrowthTrend()

> `private` **getRevenueGrowthTrend**(`dates`): `Promise`\<`any`[]\>

Defined in: [src/modules/admin/admin-metrics.service.ts:464](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L464)

#### Parameters

##### dates

`Date`[]

#### Returns

`Promise`\<`any`[]\>

***

### getRevenueMetrics()

> **getRevenueMetrics**(): `Promise`\<[`RevenueMetrics`](../interfaces/RevenueMetrics.md)\>

Defined in: [src/modules/admin/admin-metrics.service.ts:107](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L107)

Get revenue metrics

#### Returns

`Promise`\<[`RevenueMetrics`](../interfaces/RevenueMetrics.md)\>

***

### getSlowQueries()

> `private` **getSlowQueries**(): `Promise`\<`any`[]\>

Defined in: [src/modules/admin/admin-metrics.service.ts:758](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L758)

#### Returns

`Promise`\<`any`[]\>

***

### getStorageMetrics()

> `private` **getStorageMetrics**(): `Promise`\<\{ `byType`: `Record`\<`string`, \{ `count`: `number`; `size`: `number`; \}\>; `totalFiles`: `number`; `totalSize`: `number`; \}\>

Defined in: [src/modules/admin/admin-metrics.service.ts:697](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L697)

#### Returns

`Promise`\<\{ `byType`: `Record`\<`string`, \{ `count`: `number`; `size`: `number`; \}\>; `totalFiles`: `number`; `totalSize`: `number`; \}\>

***

### getSystemMetrics()

> **getSystemMetrics**(`startDate?`, `endDate?`): `Promise`\<[`SystemMetrics`](../interfaces/SystemMetrics.md)\>

Defined in: [src/modules/admin/admin-metrics.service.ts:81](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L81)

Get comprehensive system metrics

#### Parameters

##### startDate?

`Date`

##### endDate?

`Date`

#### Returns

`Promise`\<[`SystemMetrics`](../interfaces/SystemMetrics.md)\>

***

### getTrendMetrics()

> `private` **getTrendMetrics**(`dateRange`): `Promise`\<\{ `apiUsage`: `any`[]; `errorTrend`: `any`[]; `revenueGrowth`: `any`[]; `userGrowth`: `any`[]; \}\>

Defined in: [src/modules/admin/admin-metrics.service.ts:425](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L425)

#### Parameters

##### dateRange

###### end

`Date`

###### start

`Date`

#### Returns

`Promise`\<\{ `apiUsage`: `any`[]; `errorTrend`: `any`[]; `revenueGrowth`: `any`[]; `userGrowth`: `any`[]; \}\>

***

### getUsageMetrics()

> **getUsageMetrics**(`days`): `Promise`\<[`UsageMetrics`](../interfaces/UsageMetrics.md)\>

Defined in: [src/modules/admin/admin-metrics.service.ts:213](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L213)

Get API and feature usage metrics

#### Parameters

##### days

`number` = `30`

#### Returns

`Promise`\<[`UsageMetrics`](../interfaces/UsageMetrics.md)\>

***

### getUserGrowthTrend()

> `private` **getUserGrowthTrend**(`dates`): `Promise`\<`any`[]\>

Defined in: [src/modules/admin/admin-metrics.service.ts:448](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L448)

#### Parameters

##### dates

`Date`[]

#### Returns

`Promise`\<`any`[]\>

***

### groupEndpointActivity()

> `private` **groupEndpointActivity**(`apiCalls`): `object`[]

Defined in: [src/modules/admin/admin-metrics.service.ts:788](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L788)

#### Parameters

##### apiCalls

`any`[]

#### Returns

`object`[]

## Properties

### CACHE\_TTL

> `private` `readonly` **CACHE\_TTL**: `300` = `300`

Defined in: [src/modules/admin/admin-metrics.service.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L75)
