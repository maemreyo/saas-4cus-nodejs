[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / UpdateTicketDTO

# Class: UpdateTicketDTO

Defined in: [src/modules/support/support.dto.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L25)

## Constructors

### Constructor

> **new UpdateTicketDTO**(): `UpdateTicketDTO`

#### Returns

`UpdateTicketDTO`

## Properties

### assignedToId?

> `optional` **assignedToId**: `string`

Defined in: [src/modules/support/support.dto.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L43)

***

### categoryId?

> `optional` **categoryId**: `string`

Defined in: [src/modules/support/support.dto.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L42)

***

### description?

> `optional` **description**: `string`

Defined in: [src/modules/support/support.dto.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L38)

***

### priority?

> `optional` **priority**: `TicketPriority`

Defined in: [src/modules/support/support.dto.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L40)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `assignedToId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `categoryId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `description`: `ZodOptional`\<`ZodString`\>; `priority`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `subject`: `ZodOptional`\<`ZodString`\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `type`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `assignedToId?`: `string`; `categoryId?`: `string`; `description?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `subject?`: `string`; `tags?`: `string`[]; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}, \{ `assignedToId?`: `string`; `categoryId?`: `string`; `description?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `subject?`: `string`; `tags?`: `string`[]; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}\>

Defined in: [src/modules/support/support.dto.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L26)

***

### status?

> `optional` **status**: `TicketStatus`

Defined in: [src/modules/support/support.dto.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L41)

***

### subject?

> `optional` **subject**: `string`

Defined in: [src/modules/support/support.dto.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L37)

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [src/modules/support/support.dto.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L44)

***

### type?

> `optional` **type**: `TicketType`

Defined in: [src/modules/support/support.dto.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L39)
