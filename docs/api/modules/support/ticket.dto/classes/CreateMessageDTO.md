[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.dto](../README.md) / CreateMessageDTO

# Class: CreateMessageDTO

Defined in: [src/modules/support/ticket.dto.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L44)

## Constructors

### Constructor

> **new CreateMessageDTO**(): `CreateMessageDTO`

#### Returns

`CreateMessageDTO`

## Properties

### attachments?

> `optional` **attachments**: `string`[]

Defined in: [src/modules/support/ticket.dto.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L52)

***

### content

> **content**: `string`

Defined in: [src/modules/support/ticket.dto.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L51)

***

### internal?

> `optional` **internal**: `boolean`

Defined in: [src/modules/support/ticket.dto.ts:53](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L53)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `attachments`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `content`: `ZodString`; `internal`: `ZodDefault`\<`ZodOptional`\<`ZodBoolean`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `attachments?`: `string`[]; `content?`: `string`; `internal?`: `boolean`; \}, \{ `attachments?`: `string`[]; `content?`: `string`; `internal?`: `boolean`; \}\>

Defined in: [src/modules/support/ticket.dto.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L45)
