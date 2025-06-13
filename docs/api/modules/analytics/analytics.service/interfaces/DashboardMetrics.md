[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/analytics.service](../README.md) / DashboardMetrics

# Interface: DashboardMetrics

Defined in: [src/modules/analytics/analytics.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L43)

## Properties

### breakdown

> **breakdown**: `object`

Defined in: [src/modules/analytics/analytics.service.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L55)

#### revenueByPlan

> **revenueByPlan**: `object`[]

#### topFeatures

> **topFeatures**: `object`[]

#### usersByPlan

> **usersByPlan**: `object`[]

***

### overview

> **overview**: `object`

Defined in: [src/modules/analytics/analytics.service.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L44)

#### activeUsers

> **activeUsers**: [`MetricData`](MetricData.md)

#### churnRate

> **churnRate**: [`MetricData`](MetricData.md)

#### revenue

> **revenue**: [`MetricData`](MetricData.md)

#### totalUsers

> **totalUsers**: [`MetricData`](MetricData.md)

***

### timeSeries

> **timeSeries**: `object`

Defined in: [src/modules/analytics/analytics.service.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.service.ts#L50)

#### activeUsers

> **activeUsers**: [`TimeSeriesData`](TimeSeriesData.md)[]

#### revenueGrowth

> **revenueGrowth**: [`TimeSeriesData`](TimeSeriesData.md)[]

#### userGrowth

> **userGrowth**: [`TimeSeriesData`](TimeSeriesData.md)[]
