[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / TicketStatsQueryDTO

# Class: TicketStatsQueryDTO

Defined in: [src/modules/admin/admin.dto.ts:181](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L181)

## Constructors

### Constructor

> **new TicketStatsQueryDTO**(): `TicketStatsQueryDTO`

#### Returns

`TicketStatsQueryDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `assigneeId`: `ZodOptional`\<`ZodString`\>; `categoryId`: `ZodOptional`\<`ZodString`\>; `endDate`: `ZodOptional`\<`ZodString`\>; `groupBy`: `ZodOptional`\<`ZodEnum`\<\[`"status"`, `"priority"`, `"category"`, `"assignee"`, `"day"`\]\>\>; `priority`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `startDate`: `ZodOptional`\<`ZodString`\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `assigneeId?`: `string`; `categoryId?`: `string`; `endDate?`: `string`; `groupBy?`: `"status"` \| `"priority"` \| `"category"` \| `"assignee"` \| `"day"`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `startDate?`: `string`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; \}, \{ `assigneeId?`: `string`; `categoryId?`: `string`; `endDate?`: `string`; `groupBy?`: `"status"` \| `"priority"` \| `"category"` \| `"assignee"` \| `"day"`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `startDate?`: `string`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:182](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L182)
