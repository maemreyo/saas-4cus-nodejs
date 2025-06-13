[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/analytics.dto](../README.md) / GetFunnelDTO

# Class: GetFunnelDTO

Defined in: [src/modules/analytics/analytics.dto.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L36)

## Constructors

### Constructor

> **new GetFunnelDTO**(): `GetFunnelDTO`

#### Returns

`GetFunnelDTO`

## Properties

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/modules/analytics/analytics.dto.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L47)

***

### groupBy?

> `optional` **groupBy**: `string`

Defined in: [src/modules/analytics/analytics.dto.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L48)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `endDate`: `ZodOptional`\<`ZodString`\>; `groupBy`: `ZodOptional`\<`ZodString`\>; `startDate`: `ZodOptional`\<`ZodString`\>; `steps`: `ZodArray`\<`ZodString`, `"many"`\>; `tenantId`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `endDate?`: `string`; `groupBy?`: `string`; `startDate?`: `string`; `steps?`: `string`[]; `tenantId?`: `string`; \}, \{ `endDate?`: `string`; `groupBy?`: `string`; `startDate?`: `string`; `steps?`: `string`[]; `tenantId?`: `string`; \}\>

Defined in: [src/modules/analytics/analytics.dto.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L37)

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/modules/analytics/analytics.dto.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L46)

***

### steps

> **steps**: `string`[]

Defined in: [src/modules/analytics/analytics.dto.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L45)

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [src/modules/analytics/analytics.dto.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L49)
