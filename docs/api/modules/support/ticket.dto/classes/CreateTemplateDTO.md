[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.dto](../README.md) / CreateTemplateDTO

# Class: CreateTemplateDTO

Defined in: [src/modules/support/ticket.dto.ts:110](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L110)

## Constructors

### Constructor

> **new CreateTemplateDTO**(): `CreateTemplateDTO`

#### Returns

`CreateTemplateDTO`

## Properties

### category?

> `optional` **category**: `string`

Defined in: [src/modules/support/ticket.dto.ts:124](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L124)

***

### content

> **content**: `string`

Defined in: [src/modules/support/ticket.dto.ts:123](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L123)

***

### description?

> `optional` **description**: `string`

Defined in: [src/modules/support/ticket.dto.ts:121](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L121)

***

### name

> **name**: `string`

Defined in: [src/modules/support/ticket.dto.ts:120](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L120)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `content`: `ZodString`; `description`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `subject`: `ZodString`; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `category?`: `string`; `content?`: `string`; `description?`: `string`; `name?`: `string`; `subject?`: `string`; `tags?`: `string`[]; \}, \{ `category?`: `string`; `content?`: `string`; `description?`: `string`; `name?`: `string`; `subject?`: `string`; `tags?`: `string`[]; \}\>

Defined in: [src/modules/support/ticket.dto.ts:111](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L111)

***

### subject

> **subject**: `string`

Defined in: [src/modules/support/ticket.dto.ts:122](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L122)

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [src/modules/support/ticket.dto.ts:125](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L125)
