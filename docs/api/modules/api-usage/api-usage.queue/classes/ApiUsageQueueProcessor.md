[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.queue](../README.md) / ApiUsageQueueProcessor

# Class: ApiUsageQueueProcessor

Defined in: [src/modules/api-usage/api-usage.queue.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L12)

## Constructors

### Constructor

> **new ApiUsageQueueProcessor**(`apiUsageService`): `ApiUsageQueueProcessor`

Defined in: [src/modules/api-usage/api-usage.queue.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L13)

#### Parameters

##### apiUsageService

[`ApiUsageService`](../../api-usage.service/classes/ApiUsageService.md)

#### Returns

`ApiUsageQueueProcessor`

## Methods

### processAggregateMetrics()

> **processAggregateMetrics**(`job`): `Promise`\<\{ `aggregated`: `number`; `timestamp`: `number`; `timeWindow`: `any`; \}\>

Defined in: [src/modules/api-usage/api-usage.queue.ts:80](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L80)

Process metrics aggregation

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `aggregated`: `number`; `timestamp`: `number`; `timeWindow`: `any`; \}\>

***

### processCheckAlerts()

> **processCheckAlerts**(`job`): `Promise`\<\{ `usersChecked`: `number`; `warningsSent`: `number`; \}\>

Defined in: [src/modules/api-usage/api-usage.queue.ts:166](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L166)

Process alert checking

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `usersChecked`: `number`; `warningsSent`: `number`; \}\>

***

### processCleanup()

> **processCleanup**(`job`): `Promise`\<\{ `cutoffDate`: `Date`; `deleted`: `number`; \}\>

Defined in: [src/modules/api-usage/api-usage.queue.ts:252](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L252)

Process cleanup of old data

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `cutoffDate`: `Date`; `deleted`: `number`; \}\>

***

### processGenerateReport()

> **processGenerateReport**(`job`): `Promise`\<\{ `fileUrl`: `string`; `size`: `number`; \}\>

Defined in: [src/modules/api-usage/api-usage.queue.ts:288](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L288)

Process report generation

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `fileUrl`: `string`; `size`: `number`; \}\>

***

### processHealthCheck()

> **processHealthCheck**(`job`): `Promise`\<\{ `health`: \{ `issues`: `string`[]; `metrics`: \{ `activeEndpoints`: `number`; `averageResponseTime`: `number`; `errorRate`: `number`; `requestsPerMinute`: `number`; \}; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}; `timestamp`: `number`; \}\>

Defined in: [src/modules/api-usage/api-usage.queue.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L40)

Process health check

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `health`: \{ `issues`: `string`[]; `metrics`: \{ `activeEndpoints`: `number`; `averageResponseTime`: `number`; `errorRate`: `number`; `requestsPerMinute`: `number`; \}; `status`: `"healthy"` \| `"degraded"` \| `"unhealthy"`; \}; `timestamp`: `number`; \}\>

***

### processResetQuotas()

> **processResetQuotas**(`job`): `Promise`\<\{ `message`: `string`; `resetAt?`: `undefined`; \} \| \{ `message`: `string`; `resetAt`: `Date`; \}\>

Defined in: [src/modules/api-usage/api-usage.queue.ts:215](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L215)

Process quota resets

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `message`: `string`; `resetAt?`: `undefined`; \} \| \{ `message`: `string`; `resetAt`: `Date`; \}\>

***

### registerProcessors()

> `private` **registerProcessors**(): `void`

Defined in: [src/modules/api-usage/api-usage.queue.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L17)

#### Returns

`void`

## Properties

### apiUsageService

> `private` **apiUsageService**: [`ApiUsageService`](../../api-usage.service/classes/ApiUsageService.md)

Defined in: [src/modules/api-usage/api-usage.queue.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.queue.ts#L13)
