[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.dto](../README.md) / GetUsageTimeSeriesDTO

# Class: GetUsageTimeSeriesDTO

Defined in: [src/modules/api-usage/api-usage.dto.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L9)

## Constructors

### Constructor

> **new GetUsageTimeSeriesDTO**(): `GetUsageTimeSeriesDTO`

#### Returns

`GetUsageTimeSeriesDTO`

## Properties

### endDate

> **endDate**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L19)

***

### endpoint?

> `optional` **endpoint**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L21)

***

### groupBy

> **groupBy**: `"month"` \| `"hour"` \| `"day"`

Defined in: [src/modules/api-usage/api-usage.dto.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L20)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `endDate`: `ZodString`; `endpoint`: `ZodOptional`\<`ZodString`\>; `groupBy`: `ZodEnum`\<\[`"hour"`, `"day"`, `"month"`\]\>; `startDate`: `ZodString`; `userId`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `endDate?`: `string`; `endpoint?`: `string`; `groupBy?`: `"month"` \| `"hour"` \| `"day"`; `startDate?`: `string`; `userId?`: `string`; \}, \{ `endDate?`: `string`; `endpoint?`: `string`; `groupBy?`: `"month"` \| `"hour"` \| `"day"`; `startDate?`: `string`; `userId?`: `string`; \}\>

Defined in: [src/modules/api-usage/api-usage.dto.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L10)

***

### startDate

> **startDate**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L18)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L22)
