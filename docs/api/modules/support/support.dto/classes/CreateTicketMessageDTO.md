[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / CreateTicketMessageDTO

# Class: CreateTicketMessageDTO

Defined in: [src/modules/support/support.dto.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L47)

## Constructors

### Constructor

> **new CreateTicketMessageDTO**(): `CreateTicketMessageDTO`

#### Returns

`CreateTicketMessageDTO`

## Properties

### attachmentIds?

> `optional` **attachmentIds**: `string`[]

Defined in: [src/modules/support/support.dto.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L56)

***

### content

> **content**: `string`

Defined in: [src/modules/support/support.dto.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L54)

***

### internal?

> `optional` **internal**: `boolean`

Defined in: [src/modules/support/support.dto.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L55)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `attachmentIds`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `content`: `ZodString`; `internal`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `attachmentIds?`: `string`[]; `content?`: `string`; `internal?`: `boolean`; \}, \{ `attachmentIds?`: `string`[]; `content?`: `string`; `internal?`: `boolean`; \}\>

Defined in: [src/modules/support/support.dto.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L48)
