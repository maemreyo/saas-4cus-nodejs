[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/analytics.dto](../README.md) / GenerateReportDTO

# Class: GenerateReportDTO

Defined in: [src/modules/analytics/analytics.dto.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L58)

## Constructors

### Constructor

> **new GenerateReportDTO**(): `GenerateReportDTO`

#### Returns

`GenerateReportDTO`

## Properties

### customQuery?

> `optional` **customQuery**: `any`

Defined in: [src/modules/analytics/analytics.dto.ts:81](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L81)

***

### filters?

> `optional` **filters**: `object`

Defined in: [src/modules/analytics/analytics.dto.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L75)

#### dateRange?

> `optional` **dateRange**: `number`

#### endDate?

> `optional` **endDate**: `string`

#### startDate?

> `optional` **startDate**: `string`

#### tenantId?

> `optional` **tenantId**: `string`

***

### format

> **format**: `"csv"` \| `"json"` \| `"pdf"`

Defined in: [src/modules/analytics/analytics.dto.ts:73](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L73)

***

### recipients?

> `optional` **recipients**: `string`[]

Defined in: [src/modules/analytics/analytics.dto.ts:74](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L74)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `customQuery`: `ZodOptional`\<`ZodAny`\>; `filters`: `ZodOptional`\<`ZodObject`\<\{ `dateRange`: `ZodOptional`\<`ZodNumber`\>; `endDate`: `ZodOptional`\<`ZodString`\>; `startDate`: `ZodOptional`\<`ZodString`\>; `tenantId`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `dateRange?`: `number`; `endDate?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}, \{ `dateRange?`: `number`; `endDate?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}\>\>; `format`: `ZodEnum`\<\[`"pdf"`, `"csv"`, `"json"`\]\>; `recipients`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `type`: `ZodEnum`\<\[`"dashboard"`, `"revenue"`, `"users"`, `"custom"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `customQuery?`: `any`; `filters?`: \{ `dateRange?`: `number`; `endDate?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}; `format?`: `"csv"` \| `"json"` \| `"pdf"`; `recipients?`: `string`[]; `type?`: `"custom"` \| `"revenue"` \| `"users"` \| `"dashboard"`; \}, \{ `customQuery?`: `any`; `filters?`: \{ `dateRange?`: `number`; `endDate?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}; `format?`: `"csv"` \| `"json"` \| `"pdf"`; `recipients?`: `string`[]; `type?`: `"custom"` \| `"revenue"` \| `"users"` \| `"dashboard"`; \}\>

Defined in: [src/modules/analytics/analytics.dto.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L59)

***

### type

> **type**: `"custom"` \| `"revenue"` \| `"users"` \| `"dashboard"`

Defined in: [src/modules/analytics/analytics.dto.ts:72](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L72)
