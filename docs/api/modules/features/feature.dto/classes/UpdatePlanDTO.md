[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/features/feature.dto](../README.md) / UpdatePlanDTO

# Class: UpdatePlanDTO

Defined in: [src/modules/features/feature.dto.ts:53](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L53)

## Constructors

### Constructor

> **new UpdatePlanDTO**(): `UpdatePlanDTO`

#### Returns

`UpdatePlanDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `currency`: `ZodOptional`\<`ZodDefault`\<`ZodString`\>\>; `description`: `ZodOptional`\<`ZodOptional`\<`ZodString`\>\>; `features`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `featureId`: `ZodString`; `included`: `ZodBoolean`; `limitValue`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `featureId?`: `string`; `included?`: `boolean`; `limitValue?`: `number`; \}, \{ `featureId?`: `string`; `included?`: `boolean`; `limitValue?`: `number`; \}\>, `"many"`\>\>; `interval`: `ZodOptional`\<`ZodDefault`\<`ZodEnum`\<\[`"month"`, `"year"`\]\>\>\>; `name`: `ZodOptional`\<`ZodString`\>; `popular`: `ZodOptional`\<`ZodDefault`\<`ZodBoolean`\>\>; `price`: `ZodOptional`\<`ZodNumber`\>; `slug`: `ZodOptional`\<`ZodString`\>; `stripePriceId`: `ZodOptional`\<`ZodOptional`\<`ZodString`\>\>; `stripeProductId`: `ZodOptional`\<`ZodOptional`\<`ZodString`\>\>; `trialDays`: `ZodOptional`\<`ZodDefault`\<`ZodNumber`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `currency?`: `string`; `description?`: `string`; `features?`: `object`[]; `interval?`: `"month"` \| `"year"`; `name?`: `string`; `popular?`: `boolean`; `price?`: `number`; `slug?`: `string`; `stripePriceId?`: `string`; `stripeProductId?`: `string`; `trialDays?`: `number`; \}, \{ `currency?`: `string`; `description?`: `string`; `features?`: `object`[]; `interval?`: `"month"` \| `"year"`; `name?`: `string`; `popular?`: `boolean`; `price?`: `number`; `slug?`: `string`; `stripePriceId?`: `string`; `stripeProductId?`: `string`; `trialDays?`: `number`; \}\>

Defined in: [src/modules/features/feature.dto.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L54)
