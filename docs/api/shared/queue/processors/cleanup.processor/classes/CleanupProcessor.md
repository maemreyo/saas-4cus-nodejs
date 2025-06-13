[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [shared/queue/processors/cleanup.processor](../README.md) / CleanupProcessor

# Class: CleanupProcessor

Defined in: [src/shared/queue/processors/cleanup.processor.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/cleanup.processor.ts#L9)

## Constructors

### Constructor

> **new CleanupProcessor**(): `CleanupProcessor`

Defined in: [src/shared/queue/processors/cleanup.processor.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/cleanup.processor.ts#L10)

#### Returns

`CleanupProcessor`

## Methods

### cleanExpiredTokens()

> **cleanExpiredTokens**(`job`): `Promise`\<\{ `deleted`: `number`; \}\>

Defined in: [src/shared/queue/processors/cleanup.processor.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/cleanup.processor.ts#L20)

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `deleted`: `number`; \}\>

***

### cleanOldSessions()

> **cleanOldSessions**(`job`): `Promise`\<\{ `deleted`: `number`; \}\>

Defined in: [src/shared/queue/processors/cleanup.processor.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/cleanup.processor.ts#L34)

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `deleted`: `number`; \}\>

***

### cleanTempFiles()

> **cleanTempFiles**(`job`): `Promise`\<\{ `deleted`: `number`; \}\>

Defined in: [src/shared/queue/processors/cleanup.processor.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/cleanup.processor.ts#L48)

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<\{ `deleted`: `number`; \}\>

***

### registerProcessors()

> `private` **registerProcessors**(): `void`

Defined in: [src/shared/queue/processors/cleanup.processor.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/cleanup.processor.ts#L14)

#### Returns

`void`
