[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / RevenueQueryDTO

# Class: RevenueQueryDTO

Defined in: [src/modules/admin/admin.dto.ts:159](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L159)

## Constructors

### Constructor

> **new RevenueQueryDTO**(): `RevenueQueryDTO`

#### Returns

`RevenueQueryDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `endDate`: `ZodString`; `groupBy`: `ZodDefault`\<`ZodEnum`\<\[`"day"`, `"week"`, `"month"`, `"plan"`, `"tenant"`\]\>\>; `includeChurn`: `ZodDefault`\<`ZodBoolean`\>; `includeMRR`: `ZodDefault`\<`ZodBoolean`\>; `planId`: `ZodOptional`\<`ZodString`\>; `startDate`: `ZodString`; `tenantId`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `endDate?`: `string`; `groupBy?`: `"tenant"` \| `"plan"` \| `"month"` \| `"day"` \| `"week"`; `includeChurn?`: `boolean`; `includeMRR?`: `boolean`; `planId?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}, \{ `endDate?`: `string`; `groupBy?`: `"tenant"` \| `"plan"` \| `"month"` \| `"day"` \| `"week"`; `includeChurn?`: `boolean`; `includeMRR?`: `boolean`; `planId?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:160](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L160)
