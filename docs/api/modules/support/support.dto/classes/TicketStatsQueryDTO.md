[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / TicketStatsQueryDTO

# Class: TicketStatsQueryDTO

Defined in: [src/modules/support/support.dto.ts:195](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L195)

## Constructors

### Constructor

> **new TicketStatsQueryDTO**(): `TicketStatsQueryDTO`

#### Returns

`TicketStatsQueryDTO`

## Properties

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/modules/support/support.dto.ts:204](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L204)

***

### groupBy?

> `optional` **groupBy**: `"type"` \| `"status"` \| `"priority"` \| `"category"` \| `"agent"`

Defined in: [src/modules/support/support.dto.ts:205](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L205)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `endDate`: `ZodOptional`\<`ZodString`\>; `groupBy`: `ZodOptional`\<`ZodEnum`\<\[`"status"`, `"priority"`, `"type"`, `"category"`, `"agent"`\]\>\>; `startDate`: `ZodOptional`\<`ZodString`\>; `tenantId`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `endDate?`: `string`; `groupBy?`: `"type"` \| `"status"` \| `"priority"` \| `"category"` \| `"agent"`; `startDate?`: `string`; `tenantId?`: `string`; \}, \{ `endDate?`: `string`; `groupBy?`: `"type"` \| `"status"` \| `"priority"` \| `"category"` \| `"agent"`; `startDate?`: `string`; `tenantId?`: `string`; \}\>

Defined in: [src/modules/support/support.dto.ts:196](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L196)

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/modules/support/support.dto.ts:203](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L203)

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [src/modules/support/support.dto.ts:206](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L206)
