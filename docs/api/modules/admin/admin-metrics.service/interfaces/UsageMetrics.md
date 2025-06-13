[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin-metrics.service](../README.md) / UsageMetrics

# Interface: UsageMetrics

Defined in: [src/modules/admin/admin-metrics.service.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L55)

## Properties

### api

> **api**: `object`

Defined in: [src/modules/admin/admin-metrics.service.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L56)

#### byEndpoint

> **byEndpoint**: `object`[]

#### errorsByEndpoint

> **errorsByEndpoint**: `object`[]

#### totalCalls

> **totalCalls**: `number`

#### uniqueUsers

> **uniqueUsers**: `number`

***

### features

> **features**: `object`

Defined in: [src/modules/admin/admin-metrics.service.ts:62](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L62)

#### adoptionRate

> **adoptionRate**: `Record`\<`string`, `number`\>

#### byFeature

> **byFeature**: `object`[]

***

### storage

> **storage**: `object`

Defined in: [src/modules/admin/admin-metrics.service.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-metrics.service.ts#L66)

#### byType

> **byType**: `Record`\<`string`, \{ `count`: `number`; `size`: `number`; \}\>

#### totalFiles

> **totalFiles**: `number`

#### totalSize

> **totalSize**: `number`
