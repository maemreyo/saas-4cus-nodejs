[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/monitoring/health-aggregator](../README.md) / HealthAggregator

# Class: HealthAggregator

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L45)

## Constructors

### Constructor

> **new HealthAggregator**(): `HealthAggregator`

#### Returns

`HealthAggregator`

## Methods

### checkDatabase()

> `private` **checkDatabase**(): `Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:108](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L108)

#### Returns

`Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

***

### checkElasticsearch()

> `private` **checkElasticsearch**(): `Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:188](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L188)

#### Returns

`Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

***

### checkExternalServices()

> `private` **checkExternalServices**(): `Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:218](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L218)

#### Returns

`Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

***

### checkHealth()

> **checkHealth**(): `Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L46)

#### Returns

`Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

***

### checkQueues()

> `private` **checkQueues**(): `Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:160](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L160)

#### Returns

`Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

***

### checkRedis()

> `private` **checkRedis**(): `Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:131](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L131)

#### Returns

`Promise`\<\{ `details?`: `any`; `error?`: `string`; `responseTime?`: `number`; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}\>

***

### getLiveMetrics()

> **getLiveMetrics**(): `Promise`\<\{ `activeUsers`: `number`; `averageResponseTime`: `number`; `errorRate`: `number`; `requestsPerMinute`: `number`; \}\>

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:292](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L292)

#### Returns

`Promise`\<\{ `activeUsers`: `number`; `averageResponseTime`: `number`; `errorRate`: `number`; `requestsPerMinute`: `number`; \}\>

***

### getSystemMetrics()

> `private` **getSystemMetrics**(): `Promise`\<\{ `cpu`: \{ `cores`: `number`; `usage`: `number`; \}; `disk?`: \{ `free`: `number`; `percentage`: `number`; `total`: `number`; `used`: `number`; \}; `memory`: \{ `free`: `number`; `percentage`: `number`; `total`: `number`; `used`: `number`; \}; \}\>

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:259](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L259)

#### Returns

`Promise`\<\{ `cpu`: \{ `cores`: `number`; `usage`: `number`; \}; `disk?`: \{ `free`: `number`; `percentage`: `number`; `total`: `number`; `used`: `number`; \}; `memory`: \{ `free`: `number`; `percentage`: `number`; `total`: `number`; `used`: `number`; \}; \}\>
