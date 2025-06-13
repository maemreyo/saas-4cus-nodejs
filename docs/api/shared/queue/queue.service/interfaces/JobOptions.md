[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/queue/queue.service](../README.md) / JobOptions

# Interface: JobOptions

Defined in: [src/shared/queue/queue.service.ts:7](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L7)

## Properties

### attempts?

> `optional` **attempts**: `number`

Defined in: [src/shared/queue/queue.service.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L9)

***

### backoff?

> `optional` **backoff**: `object`

Defined in: [src/shared/queue/queue.service.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L10)

#### delay

> **delay**: `number`

#### type

> **type**: `"fixed"` \| `"exponential"`

***

### delay?

> `optional` **delay**: `number`

Defined in: [src/shared/queue/queue.service.ts:8](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L8)

***

### jobId?

> `optional` **jobId**: `string`

Defined in: [src/shared/queue/queue.service.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L22)

***

### priority?

> `optional` **priority**: `number`

Defined in: [src/shared/queue/queue.service.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L16)

***

### removeOnComplete?

> `optional` **removeOnComplete**: `number` \| `boolean`

Defined in: [src/shared/queue/queue.service.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L14)

***

### removeOnFail?

> `optional` **removeOnFail**: `number` \| `boolean`

Defined in: [src/shared/queue/queue.service.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L15)

***

### repeat?

> `optional` **repeat**: `object`

Defined in: [src/shared/queue/queue.service.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L17)

#### cron?

> `optional` **cron**: `string`

#### every?

> `optional` **every**: `number`

#### limit?

> `optional` **limit**: `number`
