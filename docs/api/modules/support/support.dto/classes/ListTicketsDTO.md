[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / ListTicketsDTO

# Class: ListTicketsDTO

Defined in: [src/modules/support/support.dto.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L67)

## Constructors

### Constructor

> **new ListTicketsDTO**(): `ListTicketsDTO`

#### Returns

`ListTicketsDTO`

## Properties

### assignedToId?

> `optional` **assignedToId**: `string`

Defined in: [src/modules/support/support.dto.ts:90](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L90)

***

### categoryId?

> `optional` **categoryId**: `string`

Defined in: [src/modules/support/support.dto.ts:89](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L89)

***

### dateFrom?

> `optional` **dateFrom**: `string`

Defined in: [src/modules/support/support.dto.ts:94](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L94)

***

### dateTo?

> `optional` **dateTo**: `string`

Defined in: [src/modules/support/support.dto.ts:95](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L95)

***

### includeDeleted?

> `optional` **includeDeleted**: `boolean`

Defined in: [src/modules/support/support.dto.ts:96](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L96)

***

### limit?

> `optional` **limit**: `number`

Defined in: [src/modules/support/support.dto.ts:83](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L83)

***

### order?

> `optional` **order**: `"asc"` \| `"desc"`

Defined in: [src/modules/support/support.dto.ts:85](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L85)

***

### page?

> `optional` **page**: `number`

Defined in: [src/modules/support/support.dto.ts:82](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L82)

***

### priority?

> `optional` **priority**: `TicketPriority`

Defined in: [src/modules/support/support.dto.ts:87](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L87)

***

### schema

> `static` **schema**: `ZodObject`\<`object` & `object`, `"strip"`, `ZodTypeAny`, \{ `assignedToId?`: `string`; `categoryId?`: `string`; `dateFrom?`: `string`; `dateTo?`: `string`; `includeDeleted?`: `boolean`; `limit?`: `number`; `order?`: `"asc"` \| `"desc"`; `page?`: `number`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `search?`: `string`; `sort?`: `string`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; `userId?`: `string`; \}, \{ `assignedToId?`: `string`; `categoryId?`: `string`; `dateFrom?`: `string`; `dateTo?`: `string`; `includeDeleted?`: `boolean`; `limit?`: `number`; `order?`: `"asc"` \| `"desc"`; `page?`: `number`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `search?`: `string`; `sort?`: `string`; `status?`: `"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`; `tags?`: `string`[]; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; `userId?`: `string`; \}\>

Defined in: [src/modules/support/support.dto.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L68)

***

### search?

> `optional` **search**: `string`

Defined in: [src/modules/support/support.dto.ts:92](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L92)

***

### sort?

> `optional` **sort**: `string`

Defined in: [src/modules/support/support.dto.ts:84](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L84)

***

### status?

> `optional` **status**: `TicketStatus`

Defined in: [src/modules/support/support.dto.ts:86](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L86)

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [src/modules/support/support.dto.ts:93](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L93)

***

### type?

> `optional` **type**: `TicketType`

Defined in: [src/modules/support/support.dto.ts:88](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L88)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/modules/support/support.dto.ts:91](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L91)
