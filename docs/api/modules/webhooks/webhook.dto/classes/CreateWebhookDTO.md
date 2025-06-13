[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/webhooks/webhook.dto](../README.md) / CreateWebhookDTO

# Class: CreateWebhookDTO

Defined in: [src/modules/webhooks/webhook.dto.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L4)

## Constructors

### Constructor

> **new CreateWebhookDTO**(): `CreateWebhookDTO`

#### Returns

`CreateWebhookDTO`

## Properties

### description?

> `optional` **description**: `string`

Defined in: [src/modules/webhooks/webhook.dto.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L16)

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [src/modules/webhooks/webhook.dto.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L18)

***

### events

> **events**: `string`[]

Defined in: [src/modules/webhooks/webhook.dto.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L15)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [src/modules/webhooks/webhook.dto.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L19)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\>; `enabled`: `ZodDefault`\<`ZodOptional`\<`ZodBoolean`\>\>; `events`: `ZodArray`\<`ZodString`, `"many"`\>; `headers`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>; `secret`: `ZodOptional`\<`ZodString`\>; `url`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `description?`: `string`; `enabled?`: `boolean`; `events?`: `string`[]; `headers?`: `Record`\<`string`, `string`\>; `secret?`: `string`; `url?`: `string`; \}, \{ `description?`: `string`; `enabled?`: `boolean`; `events?`: `string`[]; `headers?`: `Record`\<`string`, `string`\>; `secret?`: `string`; `url?`: `string`; \}\>

Defined in: [src/modules/webhooks/webhook.dto.ts:5](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L5)

***

### secret?

> `optional` **secret**: `string`

Defined in: [src/modules/webhooks/webhook.dto.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L17)

***

### url

> **url**: `string`

Defined in: [src/modules/webhooks/webhook.dto.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L14)
