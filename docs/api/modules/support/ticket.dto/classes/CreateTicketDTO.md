[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.dto](../README.md) / CreateTicketDTO

# Class: CreateTicketDTO

Defined in: [src/modules/support/ticket.dto.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L4)

## Constructors

### Constructor

> **new CreateTicketDTO**(): `CreateTicketDTO`

#### Returns

`CreateTicketDTO`

## Properties

### attachments?

> `optional` **attachments**: `string`[]

Defined in: [src/modules/support/ticket.dto.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L21)

***

### categoryId?

> `optional` **categoryId**: `string`

Defined in: [src/modules/support/ticket.dto.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L19)

***

### description

> **description**: `string`

Defined in: [src/modules/support/ticket.dto.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L16)

***

### priority?

> `optional` **priority**: `TicketPriority`

Defined in: [src/modules/support/ticket.dto.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L18)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `attachments`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `categoryId`: `ZodOptional`\<`ZodString`\>; `description`: `ZodString`; `priority`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `subject`: `ZodString`; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `type`: `ZodDefault`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `attachments?`: `string`[]; `categoryId?`: `string`; `description?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `subject?`: `string`; `tags?`: `string`[]; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}, \{ `attachments?`: `string`[]; `categoryId?`: `string`; `description?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `subject?`: `string`; `tags?`: `string`[]; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}\>

Defined in: [src/modules/support/ticket.dto.ts:5](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L5)

***

### subject

> **subject**: `string`

Defined in: [src/modules/support/ticket.dto.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L15)

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [src/modules/support/ticket.dto.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L20)

***

### type?

> `optional` **type**: `TicketType`

Defined in: [src/modules/support/ticket.dto.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L17)
