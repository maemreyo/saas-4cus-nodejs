[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.dto](../README.md) / ExportUsageDataDTO

# Class: ExportUsageDataDTO

Defined in: [src/modules/api-usage/api-usage.dto.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L30)

## Constructors

### Constructor

> **new ExportUsageDataDTO**(): `ExportUsageDataDTO`

#### Returns

`ExportUsageDataDTO`

## Properties

### endDate

> **endDate**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L38)

***

### format

> **format**: `"csv"` \| `"json"`

Defined in: [src/modules/api-usage/api-usage.dto.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L39)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `endDate`: `ZodString`; `format`: `ZodEnum`\<\[`"csv"`, `"json"`\]\>; `startDate`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endDate?`: `string`; `format?`: `"csv"` \| `"json"`; `startDate?`: `string`; \}, \{ `endDate?`: `string`; `format?`: `"csv"` \| `"json"`; `startDate?`: `string`; \}\>

Defined in: [src/modules/api-usage/api-usage.dto.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L31)

***

### startDate

> **startDate**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L37)
