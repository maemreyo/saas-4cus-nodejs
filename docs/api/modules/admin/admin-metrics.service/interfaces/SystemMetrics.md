[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin-metrics.service](../README.md) / SystemMetrics

# Interface: SystemMetrics

Defined in: [src/modules/admin/admin-metrics.service.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L9)

## Properties

### overview

> **overview**: `object`

Defined in: [src/modules/admin/admin-metrics.service.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L10)

#### activeSubscriptions

> **activeSubscriptions**: `number`

#### activeUsers

> **activeUsers**: `number`

#### avgResponseTime

> **avgResponseTime**: `number`

#### mrr

> **mrr**: `number`

#### openTickets

> **openTickets**: `number`

#### totalRevenue

> **totalRevenue**: `number`

#### totalTickets

> **totalTickets**: `number`

#### totalUsers

> **totalUsers**: `number`

***

### performance

> **performance**: `object`

Defined in: [src/modules/admin/admin-metrics.service.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L20)

#### averageResponseTime

> **averageResponseTime**: `number`

#### cpu

> **cpu**: `number`

#### errorRate

> **errorRate**: `number`

#### memory

> **memory**: `object`

##### memory.percentage

> **percentage**: `number`

##### memory.total

> **total**: `number`

##### memory.used

> **used**: `number`

#### requestsPerMinute

> **requestsPerMinute**: `number`

#### uptime

> **uptime**: `number`

***

### trends

> **trends**: `object`

Defined in: [src/modules/admin/admin-metrics.service.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L32)

#### apiUsage

> **apiUsage**: `object`[]

#### errorTrend

> **errorTrend**: `object`[]

#### revenueGrowth

> **revenueGrowth**: `object`[]

#### userGrowth

> **userGrowth**: `object`[]
