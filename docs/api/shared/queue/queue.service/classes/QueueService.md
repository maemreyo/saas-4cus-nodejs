[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/queue/queue.service](../README.md) / QueueService

# Class: QueueService

Defined in: [src/shared/queue/queue.service.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L33)

## Constructors

### Constructor

> **new QueueService**(): `QueueService`

Defined in: [src/shared/queue/queue.service.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L38)

#### Returns

`QueueService`

## Methods

### addBulkJobs()

> **addBulkJobs**\<`T`\>(`queueName`, `jobs`): `Promise`\<`Job`\<`T`, `any`, `string`\>[]\>

Defined in: [src/shared/queue/queue.service.ts:208](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L208)

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

Defined in: [src/shared/queue/queue.service.ts:173](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L173)

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

Defined in: [src/shared/queue/queue.service.ts:307](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L307)

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

Defined in: [src/shared/queue/queue.service.ts:336](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L336)

#### Returns

`Promise`\<`void`\>

***

### createQueue()

> **createQueue**(`name`): `Queue`

Defined in: [src/shared/queue/queue.service.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L57)

#### Parameters

##### name

`string`

#### Returns

`Queue`

***

### getJob()

> **getJob**(`queueName`, `jobId`): `Promise`\<`Job`\<`any`, `any`, `string`\>\>

Defined in: [src/shared/queue/queue.service.ts:244](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L244)

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

Defined in: [src/shared/queue/queue.service.ts:254](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L254)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<\{[`index`: `string`]: `number`; \}\>

***

### getMetrics()

> **getMetrics**(`queueName`): `Promise`\<\{ `completed`: `number`; `failed`: `number`; `queueName`: `string`; \}\>

Defined in: [src/shared/queue/queue.service.ts:264](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L264)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<\{ `completed`: `number`; `failed`: `number`; `queueName`: `string`; \}\>

***

### getProcessor()

> `private` **getProcessor**(`queueName`, `jobName`): [`JobProcessor`](../type-aliases/JobProcessor.md)\<`any`\>

Defined in: [src/shared/queue/queue.service.ts:168](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L168)

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

Defined in: [src/shared/queue/queue.service.ts:346](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L346)

#### Returns

`string`[]

***

### healthCheck()

> **healthCheck**(): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [src/shared/queue/queue.service.ts:351](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L351)

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

***

### initializeDefaultQueues()

> `private` **initializeDefaultQueues**(): `void`

Defined in: [src/shared/queue/queue.service.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L42)

#### Returns

`void`

***

### obliterateQueue()

> **obliterateQueue**(`queueName`): `Promise`\<`void`\>

Defined in: [src/shared/queue/queue.service.ts:325](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L325)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<`void`\>

***

### pauseQueue()

> **pauseQueue**(`queueName`): `Promise`\<`void`\>

Defined in: [src/shared/queue/queue.service.ts:285](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L285)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<`void`\>

***

### registerProcessor()

> **registerProcessor**\<`T`\>(`queueName`, `jobName`, `processor`): `void`

Defined in: [src/shared/queue/queue.service.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L154)

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

### resumeQueue()

> **resumeQueue**(`queueName`): `Promise`\<`void`\>

Defined in: [src/shared/queue/queue.service.ts:296](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L296)

#### Parameters

##### queueName

`string`

#### Returns

`Promise`\<`void`\>

***

### setupWorkerEvents()

> `private` **setupWorkerEvents**(`worker`, `queueName`): `void`

Defined in: [src/shared/queue/queue.service.ts:111](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L111)

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

Defined in: [src/shared/queue/queue.service.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L36)

***

### queues

> `private` **queues**: `Map`\<`string`, `Queue`\<`any`, `any`, `string`, `any`, `any`, `string`\>\>

Defined in: [src/shared/queue/queue.service.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L34)

***

### workers

> `private` **workers**: `Map`\<`string`, `Worker`\<`any`, `any`, `string`\>\>

Defined in: [src/shared/queue/queue.service.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/queue/queue.service.ts#L35)
