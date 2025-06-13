[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/analytics.service](../README.md) / AnalyticsService

# Class: AnalyticsService

Defined in: [src/modules/analytics/analytics.service.ts:63](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L63)

## Constructors

### Constructor

> **new AnalyticsService**(`eventBus`): `AnalyticsService`

Defined in: [src/modules/analytics/analytics.service.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L66)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`AnalyticsService`

## Methods

### calculateMetricData()

> `private` **calculateMetricData**(`current`, `previous`): [`MetricData`](../interfaces/MetricData.md)

Defined in: [src/modules/analytics/analytics.service.ts:253](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L253)

Calculate metric data with change

#### Parameters

##### current

`number`

##### previous

`number`

#### Returns

[`MetricData`](../interfaces/MetricData.md)

***

### getActiveUsersCount()

> `private` **getActiveUsersCount**(`tenantId`, `startDate`, `endDate`): `Promise`\<`number`\>

Defined in: [src/modules/analytics/analytics.service.ts:268](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L268)

Get active users count

#### Parameters

##### tenantId

`string`

##### startDate

`Date`

##### endDate

`Date`

#### Returns

`Promise`\<`number`\>

***

### getActiveUsersTimeSeries()

> `private` **getActiveUsersTimeSeries**(`tenantId`, `dates`): `Promise`\<[`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]\>

Defined in: [src/modules/analytics/analytics.service.ts:417](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L417)

Get active users time series

#### Parameters

##### tenantId

`string`

##### dates

`Date`[]

#### Returns

`Promise`\<[`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]\>

***

### getBreakdownMetrics()

> `private` **getBreakdownMetrics**(`tenantId?`): `Promise`\<\{ `revenueByPlan`: `object`[]; `topFeatures`: `object`[]; `usersByPlan`: `object`[]; \}\>

Defined in: [src/modules/analytics/analytics.service.ts:236](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L236)

Get breakdown metrics

#### Parameters

##### tenantId?

`string`

#### Returns

`Promise`\<\{ `revenueByPlan`: `object`[]; `topFeatures`: `object`[]; `usersByPlan`: `object`[]; \}\>

***

### getChurnedUsers()

> `private` **getChurnedUsers**(`tenantId`, `startDate`, `endDate`): `Promise`\<`number`\>

Defined in: [src/modules/analytics/analytics.service.ts:321](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L321)

Get churned users

#### Parameters

##### tenantId

`string`

##### startDate

`Date`

##### endDate

`Date`

#### Returns

`Promise`\<`number`\>

***

### getCohortRetention()

> **getCohortRetention**(`options`): `Promise`\<\{ `cohorts`: `object`[]; \}\>

Defined in: [src/modules/analytics/analytics.service.ts:669](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L669)

Get cohort retention

#### Parameters

##### options

###### cohortSize?

`"month"` \| `"day"` \| `"week"`

###### periods?

`number`

###### tenantId?

`string`

#### Returns

`Promise`\<\{ `cohorts`: `object`[]; \}\>

***

### getDashboardMetrics()

> **getDashboardMetrics**(`tenantId?`, `dateRange?`): `Promise`\<[`DashboardMetrics`](../interfaces/DashboardMetrics.md)\>

Defined in: [src/modules/analytics/analytics.service.ts:150](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L150)

Get dashboard metrics

#### Parameters

##### tenantId?

`string`

##### dateRange?

`number` = `30`

#### Returns

`Promise`\<[`DashboardMetrics`](../interfaces/DashboardMetrics.md)\>

***

### getFunnelAnalytics()

> **getFunnelAnalytics**(`steps`, `options`): `Promise`\<\{ `overall`: \{ `completedUsers`: `number`; `conversionRate`: `number`; `totalUsers`: `number`; \}; `steps`: `object`[]; \}\>

Defined in: [src/modules/analytics/analytics.service.ts:588](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L588)

Get funnel analytics

#### Parameters

##### steps

`string`[]

##### options

###### endDate?

`Date`

###### groupBy?

`string`

###### startDate?

`Date`

###### tenantId?

`string`

#### Returns

`Promise`\<\{ `overall`: \{ `completedUsers`: `number`; `conversionRate`: `number`; `totalUsers`: `number`; \}; `steps`: `object`[]; \}\>

***

### getOverviewMetrics()

> `private` **getOverviewMetrics**(`tenantId`, `startDate`, `endDate`): `Promise`\<\{ `activeUsers`: [`MetricData`](../interfaces/MetricData.md); `churnRate`: [`MetricData`](../interfaces/MetricData.md); `revenue`: [`MetricData`](../interfaces/MetricData.md); `totalUsers`: [`MetricData`](../interfaces/MetricData.md); \}\>

Defined in: [src/modules/analytics/analytics.service.ts:170](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L170)

Get overview metrics

#### Parameters

##### tenantId

`string`

##### startDate

`Date`

##### endDate

`Date`

#### Returns

`Promise`\<\{ `activeUsers`: [`MetricData`](../interfaces/MetricData.md); `churnRate`: [`MetricData`](../interfaces/MetricData.md); `revenue`: [`MetricData`](../interfaces/MetricData.md); `totalUsers`: [`MetricData`](../interfaces/MetricData.md); \}\>

***

### getRevenue()

> `private` **getRevenue**(`tenantId`, `startDate`, `endDate`): `Promise`\<`number`\>

Defined in: [src/modules/analytics/analytics.service.ts:295](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L295)

Get revenue

#### Parameters

##### tenantId

`string`

##### startDate

`Date`

##### endDate

`Date`

#### Returns

`Promise`\<`number`\>

***

### getRevenueByPlan()

> `private` **getRevenueByPlan**(`tenantId?`): `Promise`\<`object`[]\>

Defined in: [src/modules/analytics/analytics.service.ts:499](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L499)

Get revenue by plan

#### Parameters

##### tenantId?

`string`

#### Returns

`Promise`\<`object`[]\>

***

### getRevenueTimeSeries()

> `private` **getRevenueTimeSeries**(`tenantId`, `dates`): `Promise`\<[`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]\>

Defined in: [src/modules/analytics/analytics.service.ts:382](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L382)

Get revenue time series

#### Parameters

##### tenantId

`string`

##### dates

`Date`[]

#### Returns

`Promise`\<[`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]\>

***

### getTenantUserIds()

> `private` **getTenantUserIds**(`tenantId`): `Promise`\<`string`[]\>

Defined in: [src/modules/analytics/analytics.service.ts:343](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L343)

Get tenant user IDs

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<`string`[]\>

***

### getTimeSeriesMetrics()

> `private` **getTimeSeriesMetrics**(`tenantId`, `startDate`, `endDate`): `Promise`\<\{ `activeUsers`: [`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]; `revenueGrowth`: [`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]; `userGrowth`: [`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]; \}\>

Defined in: [src/modules/analytics/analytics.service.ts:208](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L208)

Get time series metrics

#### Parameters

##### tenantId

`string`

##### startDate

`Date`

##### endDate

`Date`

#### Returns

`Promise`\<\{ `activeUsers`: [`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]; `revenueGrowth`: [`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]; `userGrowth`: [`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]; \}\>

***

### getTopFeatures()

> `private` **getTopFeatures**(`tenantId?`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/analytics/analytics.service.ts:544](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L544)

Get top features

#### Parameters

##### tenantId?

`string`

##### limit?

`number` = `10`

#### Returns

`Promise`\<`object`[]\>

***

### getUserGrowthTimeSeries()

> `private` **getUserGrowthTimeSeries**(`tenantId`, `dates`): `Promise`\<[`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]\>

Defined in: [src/modules/analytics/analytics.service.ts:355](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L355)

Get user growth time series

#### Parameters

##### tenantId

`string`

##### dates

`Date`[]

#### Returns

`Promise`\<[`TimeSeriesData`](../interfaces/TimeSeriesData.md)[]\>

***

### getUserJourney()

> **getUserJourney**(`userId`, `options`): `Promise`\<\{ `events`: `object`[]; `summary`: \{ `avgEventsPerSession`: `number`; `sessions`: `number`; `totalEvents`: `number`; `uniqueEvents`: `number`; \}; \}\>

Defined in: [src/modules/analytics/analytics.service.ts:777](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L777)

Get user journey

#### Parameters

##### userId

`string`

##### options

###### endDate?

`Date`

###### limit?

`number`

###### startDate?

`Date`

#### Returns

`Promise`\<\{ `events`: `object`[]; `summary`: \{ `avgEventsPerSession`: `number`; `sessions`: `number`; `totalEvents`: `number`; `uniqueEvents`: `number`; \}; \}\>

***

### getUsersByPlan()

> `private` **getUsersByPlan**(`tenantId?`): `Promise`\<`object`[]\>

Defined in: [src/modules/analytics/analytics.service.ts:441](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L441)

Get users by plan

#### Parameters

##### tenantId?

`string`

#### Returns

`Promise`\<`object`[]\>

***

### track()

> **track**(`event`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.service.ts:71](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L71)

Track analytics event

#### Parameters

##### event

[`AnalyticsEvent`](../interfaces/AnalyticsEvent.md)

#### Returns

`Promise`\<`void`\>

***

### trackPageView()

> **trackPageView**(`userId`, `page`, `properties?`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.service.ts:107](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L107)

Track page view

#### Parameters

##### userId

`string`

##### page

`string`

##### properties?

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### trackRealTimeMetric()

> `private` **trackRealTimeMetric**(`event`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.service.ts:121](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L121)

Track real-time metric in Redis

#### Parameters

##### event

[`AnalyticsEvent`](../interfaces/AnalyticsEvent.md)

#### Returns

`Promise`\<`void`\>

## Properties

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/analytics/analytics.service.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L66)

***

### METRICS\_CACHE\_TTL

> `private` `readonly` **METRICS\_CACHE\_TTL**: `300` = `300`

Defined in: [src/modules/analytics/analytics.service.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L64)
