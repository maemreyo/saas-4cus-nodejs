[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/webhooks/webhook.dto](../README.md) / UpdateWebhookDTO

# Class: UpdateWebhookDTO

Defined in: [src/modules/webhooks/webhook.dto.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L22)

## Constructors

### Constructor

> **new UpdateWebhookDTO**(): `UpdateWebhookDTO`

#### Returns

`UpdateWebhookDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `description`: `ZodOptional`\<`ZodOptional`\<`ZodString`\>\>; `enabled`: `ZodOptional`\<`ZodDefault`\<`ZodOptional`\<`ZodBoolean`\>\>\>; `events`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `headers`: `ZodOptional`\<`ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>\>; `secret`: `ZodOptional`\<`ZodOptional`\<`ZodString`\>\>; `url`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `description?`: `string`; `enabled?`: `boolean`; `events?`: `string`[]; `headers?`: `Record`\<`string`, `string`\>; `secret?`: `string`; `url?`: `string`; \}, \{ `description?`: `string`; `enabled?`: `boolean`; `events?`: `string`[]; `headers?`: `Record`\<`string`, `string`\>; `secret?`: `string`; `url?`: `string`; \}\>

Defined in: [src/modules/webhooks/webhook.dto.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.dto.ts#L23)
