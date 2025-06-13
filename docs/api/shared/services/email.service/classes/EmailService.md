[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/services/email.service](../README.md) / EmailService

# Class: EmailService

Defined in: [src/shared/services/email.service.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L33)

## Constructors

### Constructor

> **new EmailService**(`queueService`): `EmailService`

Defined in: [src/shared/services/email.service.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L37)

#### Parameters

##### queueService

[`QueueService`](../../../queue/queue.service/classes/QueueService.md)

#### Returns

`EmailService`

## Methods

### loadTemplates()

> `private` **loadTemplates**(): `Promise`\<`void`\>

Defined in: [src/shared/services/email.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L51)

#### Returns

`Promise`\<`void`\>

***

### queue()

> **queue**(`options`, `delay?`): `Promise`\<`void`\>

Defined in: [src/shared/services/email.service.ts:149](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L149)

#### Parameters

##### options

[`EmailOptions`](../interfaces/EmailOptions.md)

##### delay?

`number`

#### Returns

`Promise`\<`void`\>

***

### renderTemplate()

> `private` **renderTemplate**(`template`, `context`): `string`

Defined in: [src/shared/services/email.service.ts:207](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L207)

#### Parameters

##### template

`string`

##### context

`Record`\<`string`, `any`\>

#### Returns

`string`

***

### send()

> **send**(`options`): `Promise`\<`void`\>

Defined in: [src/shared/services/email.service.ts:109](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L109)

#### Parameters

##### options

[`EmailOptions`](../interfaces/EmailOptions.md)

#### Returns

`Promise`\<`void`\>

***

### send2FAEnabledEmail()

> **send2FAEnabledEmail**(`email`, `backupCodes`): `Promise`\<`void`\>

Defined in: [src/shared/services/email.service.ts:194](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L194)

#### Parameters

##### email

`string`

##### backupCodes

`string`[]

#### Returns

`Promise`\<`void`\>

***

### sendPasswordChangedEmail()

> **sendPasswordChangedEmail**(`email`): `Promise`\<`void`\>

Defined in: [src/shared/services/email.service.ts:183](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L183)

#### Parameters

##### email

`string`

#### Returns

`Promise`\<`void`\>

***

### sendPasswordResetEmail()

> **sendPasswordResetEmail**(`email`, `token`): `Promise`\<`void`\>

Defined in: [src/shared/services/email.service.ts:169](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L169)

#### Parameters

##### email

`string`

##### token

`string`

#### Returns

`Promise`\<`void`\>

***

### sendVerificationEmail()

> **sendVerificationEmail**(`email`, `token`): `Promise`\<`void`\>

Defined in: [src/shared/services/email.service.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L154)

#### Parameters

##### email

`string`

##### token

`string`

#### Returns

`Promise`\<`void`\>

***

### verify()

> **verify**(): `Promise`\<`boolean`\>

Defined in: [src/shared/services/email.service.ts:214](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L214)

#### Returns

`Promise`\<`boolean`\>

## Properties

### queueService

> `private` **queueService**: [`QueueService`](../../../queue/queue.service/classes/QueueService.md)

Defined in: [src/shared/services/email.service.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L37)

***

### templates

> `private` **templates**: `Map`\<`string`, [`EmailTemplate`](../-internal-/interfaces/EmailTemplate.md)\>

Defined in: [src/shared/services/email.service.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L35)

***

### transporter

> `private` **transporter**: `Transporter`

Defined in: [src/shared/services/email.service.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/email.service.ts#L34)
