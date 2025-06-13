[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.dto](../README.md) / BulkUpdateTicketsDTO

# Class: BulkUpdateTicketsDTO

Defined in: [src/modules/support/ticket.dto.ts:128](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L128)

## Constructors

### Constructor

> **new BulkUpdateTicketsDTO**(): `BulkUpdateTicketsDTO`

#### Returns

`BulkUpdateTicketsDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `ticketIds`: `ZodArray`\<`ZodString`, `"many"`\>; `updates`: `ZodObject`\<\{ `assigneeId`: `ZodOptional`\<`ZodString`\>; `categoryId`: `ZodOptional`\<`ZodString`\>; `priority`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `assigneeId?`: `string`; `categoryId?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; \}, \{ `assigneeId?`: `string`; `categoryId?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `ticketIds?`: `string`[]; `updates?`: \{ `assigneeId?`: `string`; `categoryId?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; \}; \}, \{ `ticketIds?`: `string`[]; `updates?`: \{ `assigneeId?`: `string`; `categoryId?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; \}; \}\>

Defined in: [src/modules/support/ticket.dto.ts:129](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L129)

***

### ticketIds

> **ticketIds**: `string`[]

Defined in: [src/modules/support/ticket.dto.ts:140](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L140)

***

### updates

> **updates**: `object`

Defined in: [src/modules/support/ticket.dto.ts:141](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.dto.ts#L141)

#### assigneeId?

> `optional` **assigneeId**: `string`

#### categoryId?

> `optional` **categoryId**: `string`

#### priority?

> `optional` **priority**: `TicketPriority`

#### status?

> `optional` **status**: `TicketStatus`

#### tags?

> `optional` **tags**: `string`[]
