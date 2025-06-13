[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.dto](../README.md) / UpdateTicketDTO

# Class: UpdateTicketDTO

Defined in: [src/modules/support/ticket.dto.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L24)

## Constructors

### Constructor

> **new UpdateTicketDTO**(): `UpdateTicketDTO`

#### Returns

`UpdateTicketDTO`

## Properties

### categoryId?

> `optional` **categoryId**: `string`

Defined in: [src/modules/support/ticket.dto.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L40)

***

### description?

> `optional` **description**: `string`

Defined in: [src/modules/support/ticket.dto.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L36)

***

### priority?

> `optional` **priority**: `TicketPriority`

Defined in: [src/modules/support/ticket.dto.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L38)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `categoryId`: `ZodOptional`\<`ZodString`\>; `description`: `ZodOptional`\<`ZodString`\>; `priority`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `subject`: `ZodOptional`\<`ZodString`\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `type`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `categoryId?`: `string`; `description?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `subject?`: `string`; `tags?`: `string`[]; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}, \{ `categoryId?`: `string`; `description?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `subject?`: `string`; `tags?`: `string`[]; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}\>

Defined in: [src/modules/support/ticket.dto.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L25)

***

### status?

> `optional` **status**: `TicketStatus`

Defined in: [src/modules/support/ticket.dto.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L39)

***

### subject?

> `optional` **subject**: `string`

Defined in: [src/modules/support/ticket.dto.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L35)

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [src/modules/support/ticket.dto.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L41)

***

### type?

> `optional` **type**: `TicketType`

Defined in: [src/modules/support/ticket.dto.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.dto.ts#L37)
