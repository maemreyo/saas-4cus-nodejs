[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / BulkUpdateTicketsDTO

# Class: BulkUpdateTicketsDTO

Defined in: [src/modules/support/support.dto.ts:173](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L173)

## Constructors

### Constructor

> **new BulkUpdateTicketsDTO**(): `BulkUpdateTicketsDTO`

#### Returns

`BulkUpdateTicketsDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `ticketIds`: `ZodArray`\<`ZodString`, `"many"`\>; `updates`: `ZodObject`\<\{ `assignedToId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `categoryId`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `priority`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `assignedToId?`: `string`; `categoryId?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; \}, \{ `assignedToId?`: `string`; `categoryId?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `ticketIds?`: `string`[]; `updates?`: \{ `assignedToId?`: `string`; `categoryId?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; \}; \}, \{ `ticketIds?`: `string`[]; `updates?`: \{ `assignedToId?`: `string`; `categoryId?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; \}; \}\>

Defined in: [src/modules/support/support.dto.ts:174](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L174)

***

### ticketIds

> **ticketIds**: `string`[]

Defined in: [src/modules/support/support.dto.ts:185](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L185)

***

### updates

> **updates**: `object`

Defined in: [src/modules/support/support.dto.ts:186](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L186)

#### assignedToId?

> `optional` **assignedToId**: `string`

#### categoryId?

> `optional` **categoryId**: `string`

#### priority?

> `optional` **priority**: `TicketPriority`

#### status?

> `optional` **status**: `TicketStatus`

#### tags?

> `optional` **tags**: `string`[]
