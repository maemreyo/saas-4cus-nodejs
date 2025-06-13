[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / FeatureUsageQueryDTO

# Class: FeatureUsageQueryDTO

Defined in: [src/modules/admin/admin.dto.ts:194](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L194)

## Constructors

### Constructor

> **new FeatureUsageQueryDTO**(): `FeatureUsageQueryDTO`

#### Returns

`FeatureUsageQueryDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `endDate`: `ZodString`; `featureId`: `ZodOptional`\<`ZodString`\>; `groupBy`: `ZodDefault`\<`ZodEnum`\<\[`"feature"`, `"user"`, `"tenant"`, `"day"`\]\>\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `startDate`: `ZodString`; `tenantId`: `ZodOptional`\<`ZodString`\>; `userId`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `endDate?`: `string`; `featureId?`: `string`; `groupBy?`: `"user"` \| `"tenant"` \| `"feature"` \| `"day"`; `limit?`: `number`; `startDate?`: `string`; `tenantId?`: `string`; `userId?`: `string`; \}, \{ `endDate?`: `string`; `featureId?`: `string`; `groupBy?`: `"user"` \| `"tenant"` \| `"feature"` \| `"day"`; `limit?`: `number`; `startDate?`: `string`; `tenantId?`: `string`; `userId?`: `string`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:195](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L195)
