[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/queue/queue.service](../README.md) / QueueService

# Class: QueueService

Defined in: [src/shared/queue/queue.service.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L38)

## Constructors

### Constructor

> **new QueueService**(): `QueueService`

Defined in: [src/shared/queue/queue.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L43)

#### Returns

`QueueService`

## Methods

### add()

> **add**\<`T`\>(`jobName`, `data`, `options?`): `Promise`\<`Job`\<`T`, `any`, `string`\>\>

Defined in: [src/shared/queue/queue.service.ts:234](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L234)

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### jobName

`string`

##### data

`T`

##### options?

[`JobOptions`](../interfaces/JobOptions.md)

#### Returns

`Promise`\<`Job`\<`T`, `any`, `string`\>\>

***

### addBulkJobs()

> **addBulkJobs**\<`T`\>(`queueName`, `jobs`): `Promise`\<`Job`\<`T`, `any`, `string`\>[]\>

Defined in: [src/shared/queue/queue.service.ts:274](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L274)

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### queueName

`string`

##### jobs

`object`[]

#### Returns

`Promise`\<`Job`\<`T`, `any`, `string`\>[]\>

***

### addJob()

> **addJob**\<`T`\>(`queueName`, `jobName`, `data`, `options?`): `Promise`\<`Job`\<`T`, `any`, `string`\>\>

Defined in: [src/shared/queue/queue.service.ts:198](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L198)

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### queueName

`string`

##### jobName

`string`

##### data

`T`

##### options?

[`JobOptions`](../interfaces/JobOptions.md)

#### Returns

`Promise`\<`Job`\<`T`, `any`, `string`\>\>

***

### cleanQueue()

> **cleanQueue**(`queueName`, `grace`, `limit`, `status?`): `Promise`\<`string`[]\>

Defined in: [src/shared/queue/queue.service.ts:373](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L373)

#### Parameters

##### queueName

`string`

##### grace

`number` = `0`

##### limit

`number` = `100`

##### status?

`"completed"` | `"failed"`

#### Returns

`Promise`\<`string`[]\>

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [src/shared/queue/queue.service.ts:402](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L402)

#### Returns

`Promise`\<`void`\>

***

### createQueue()

> **createQueue**(`name`): `Queue`

Defined in: [src/shared/queue/queue.service.ts:62](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L62)

#### Parameters

##### name

`string`

#### Returns

`Queue`

***

### getJob()

> **getJob**(`queueName`, `jobId`): `Promise`\<`Job`\<`any`, `any`, `string`\>\>

Defined in: [src/shared/queue/queue.service.ts:310](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L310)

#### Parameters

##### queueName

`string`

##### jobId

`string`

#### Returns

`Promise`\<`Job`\<`any`, `any`, `string`\>\>

***

### getJobCounts()

> **getJobCounts**(`queueName`): `Promise`\<\{[`index`: `string`]: `number`; \}\>

Defined in: [src/shared/queue/queue.service.ts:320](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L320)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<\{[`index`: `string`]: `number`; \}\>

***

### getMetrics()

> **getMetrics**(`queueName`): `Promise`\<\{ `completed`: `number`; `failed`: `number`; `queueName`: `string`; \}\>

Defined in: [src/shared/queue/queue.service.ts:330](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L330)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<\{ `completed`: `number`; `failed`: `number`; `queueName`: `string`; \}\>

***

### getProcessor()

> `private` **getProcessor**(`queueName`, `jobName`): [`JobProcessor`](../type-aliases/JobProcessor.md)\<`any`\>

Defined in: [src/shared/queue/queue.service.ts:184](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L184)

#### Parameters

##### queueName

`string`

##### jobName

`string`

#### Returns

[`JobProcessor`](../type-aliases/JobProcessor.md)\<`any`\>

***

### getQueues()

> **getQueues**(): `string`[]

Defined in: [src/shared/queue/queue.service.ts:412](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L412)

#### Returns

`string`[]

***

### healthCheck()

> **healthCheck**(): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [src/shared/queue/queue.service.ts:417](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L417)

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

***

### initializeDefaultQueues()

> `private` **initializeDefaultQueues**(): `void`

Defined in: [src/shared/queue/queue.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L47)

#### Returns

`void`

***

### obliterateQueue()

> **obliterateQueue**(`queueName`): `Promise`\<`void`\>

Defined in: [src/shared/queue/queue.service.ts:391](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L391)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<`void`\>

***

### pauseQueue()

> **pauseQueue**(`queueName`): `Promise`\<`void`\>

Defined in: [src/shared/queue/queue.service.ts:351](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L351)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<`void`\>

***

### process()

> **process**\<`T`, `R`\>(`jobName`, `concurrencyOrProcessor`, `processor?`): `void`

Defined in: [src/shared/queue/queue.service.ts:444](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L444)

Register a processor for a specific job

#### Type Parameters

##### T

`T` = `any`

##### R

`R` = `any`

#### Parameters

##### jobName

`string`

The name of the job (format: 'queueName:jobType')

##### concurrencyOrProcessor

The concurrency level or the job processor function

`number` | [`JobProcessor`](../type-aliases/JobProcessor.md)\<`T`\>

##### processor?

[`JobProcessor`](../type-aliases/JobProcessor.md)\<`T`\>

The job processor function (if concurrency is provided)

#### Returns

`void`

***

### registerProcessor()

> **registerProcessor**\<`T`\>(`queueName`, `jobName`, `processor`): `void`

Defined in: [src/shared/queue/queue.service.ts:170](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L170)

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### queueName

`string`

##### jobName

`string`

##### processor

[`JobProcessor`](../type-aliases/JobProcessor.md)\<`T`\>

#### Returns

`void`

***

### removeJobs()

> **removeJobs**(`queueName`, `filter`): `Promise`\<`number`\>

Defined in: [src/shared/queue/queue.service.ts:493](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L493)

Remove jobs from a queue based on a filter

#### Parameters

##### queueName

`string`

The name of the queue

##### filter

[`JobFilter`](../interfaces/JobFilter.md)

Filter criteria to match jobs

#### Returns

`Promise`\<`number`\>

***

### resumeQueue()

> **resumeQueue**(`queueName`): `Promise`\<`void`\>

Defined in: [src/shared/queue/queue.service.ts:362](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L362)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<`void`\>

***

### setupWorkerEvents()

> `private` **setupWorkerEvents**(`worker`, `queueName`): `void`

Defined in: [src/shared/queue/queue.service.ts:127](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L127)

#### Parameters

##### worker

`Worker`

##### queueName

`string`

#### Returns

`void`

## Properties

### processors

> `private` **processors**: `Map`\<`string`, `Map`\<`string`, [`JobProcessor`](../type-aliases/JobProcessor.md)\<`any`\>\>\>

Defined in: [src/shared/queue/queue.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L41)

***

### queues

> `private` **queues**: `Map`\<`string`, `Queue`\<`any`, `any`, `string`, `any`, `any`, `string`\>\>

Defined in: [src/shared/queue/queue.service.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L39)

***

### workers

> `private` **workers**: `Map`\<`string`, `Worker`\<`any`, `any`, `string`\>\>

Defined in: [src/shared/queue/queue.service.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/queue.service.ts#L40)
