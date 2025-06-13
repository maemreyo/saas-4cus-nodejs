[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / MetricsQueryDTO

# Class: MetricsQueryDTO

Defined in: [src/modules/admin/admin.dto.ts:98](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L98)

## Constructors

### Constructor

> **new MetricsQueryDTO**(): `MetricsQueryDTO`

#### Returns

`MetricsQueryDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `endDate`: `ZodString`; `interval`: `ZodDefault`\<`ZodEnum`\<\[`"hour"`, `"day"`, `"week"`, `"month"`\]\>\>; `metrics`: `ZodOptional`\<`ZodArray`\<`ZodEnum`\<\[`"users"`, `"revenue"`, `"api_calls"`, `"errors"`, `"tickets"`, `"subscriptions"`, `"churn_rate"`, `"conversion_rate"`\]\>, `"many"`\>\>; `startDate`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endDate?`: `string`; `interval?`: `"month"` \| `"hour"` \| `"day"` \| `"week"`; `metrics?`: (`"subscriptions"` \| `"tickets"` \| `"revenue"` \| `"api_calls"` \| `"users"` \| `"errors"` \| `"churn_rate"` \| `"conversion_rate"`)[]; `startDate?`: `string`; \}, \{ `endDate?`: `string`; `interval?`: `"month"` \| `"hour"` \| `"day"` \| `"week"`; `metrics?`: (`"subscriptions"` \| `"tickets"` \| `"revenue"` \| `"api_calls"` \| `"users"` \| `"errors"` \| `"churn_rate"` \| `"conversion_rate"`)[]; `startDate?`: `string`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:99](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L99)
