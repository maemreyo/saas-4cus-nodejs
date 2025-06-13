[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [shared/queue/processors/email.processor](../README.md) / EmailProcessor

# Class: EmailProcessor

Defined in: [src/shared/queue/processors/email.processor.ts:7](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/email.processor.ts#L7)

## Constructors

### Constructor

> **new EmailProcessor**(`emailService`): `EmailProcessor`

Defined in: [src/shared/queue/processors/email.processor.ts:8](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/email.processor.ts#L8)

#### Parameters

##### emailService

[`EmailService`](../../../../services/email.service/classes/EmailService.md)

#### Returns

`EmailProcessor`

## Methods

### processSendBulkEmail()

> **processSendBulkEmail**(`job`): `Promise`\<`any`[]\>

Defined in: [src/shared/queue/processors/email.processor.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/email.processor.ts#L27)

#### Parameters

##### job

`Job`\<\{ `emails`: [`EmailOptions`](../../../../services/email.service/interfaces/EmailOptions.md)[]; \}\>

#### Returns

`Promise`\<`any`[]\>

***

### processSendEmail()

> **processSendEmail**(`job`): `Promise`\<\{ `sent`: `boolean`; `to`: `string` \| `string`[]; \}\>

Defined in: [src/shared/queue/processors/email.processor.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/email.processor.ts#L17)

#### Parameters

##### job

`Job`\<[`EmailOptions`](../../../../services/email.service/interfaces/EmailOptions.md)\>

#### Returns

`Promise`\<\{ `sent`: `boolean`; `to`: `string` \| `string`[]; \}\>

***

### registerProcessors()

> `private` **registerProcessors**(): `void`

Defined in: [src/shared/queue/processors/email.processor.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/email.processor.ts#L12)

#### Returns

`void`

## Properties

### emailService

> `private` **emailService**: [`EmailService`](../../../../services/email.service/classes/EmailService.md)

Defined in: [src/shared/queue/processors/email.processor.ts:8](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/queue/processors/email.processor.ts#L8)
