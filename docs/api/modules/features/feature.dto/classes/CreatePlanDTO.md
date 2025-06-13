[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/features/feature.dto](../README.md) / CreatePlanDTO

# Class: CreatePlanDTO

Defined in: [src/modules/features/feature.dto.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L17)

## Constructors

### Constructor

> **new CreatePlanDTO**(): `CreatePlanDTO`

#### Returns

`CreatePlanDTO`

## Properties

### currency?

> `optional` **currency**: `string`

Defined in: [src/modules/features/feature.dto.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L42)

***

### description?

> `optional` **description**: `string`

Defined in: [src/modules/features/feature.dto.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L38)

***

### features

> **features**: `object`[]

Defined in: [src/modules/features/feature.dto.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L46)

#### featureId

> **featureId**: `string`

#### included

> **included**: `boolean`

#### limitValue?

> `optional` **limitValue**: `number`

***

### interval?

> `optional` **interval**: `string`

Defined in: [src/modules/features/feature.dto.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L43)

***

### name

> **name**: `string`

Defined in: [src/modules/features/feature.dto.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L36)

***

### popular?

> `optional` **popular**: `boolean`

Defined in: [src/modules/features/feature.dto.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L45)

***

### price

> **price**: `number`

Defined in: [src/modules/features/feature.dto.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L41)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `currency`: `ZodDefault`\<`ZodString`\>; `description`: `ZodOptional`\<`ZodString`\>; `features`: `ZodArray`\<`ZodObject`\<\{ `featureId`: `ZodString`; `included`: `ZodBoolean`; `limitValue`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `featureId?`: `string`; `included?`: `boolean`; `limitValue?`: `number`; \}, \{ `featureId?`: `string`; `included?`: `boolean`; `limitValue?`: `number`; \}\>, `"many"`\>; `interval`: `ZodDefault`\<`ZodEnum`\<\[`"month"`, `"year"`\]\>\>; `name`: `ZodString`; `popular`: `ZodDefault`\<`ZodBoolean`\>; `price`: `ZodNumber`; `slug`: `ZodString`; `stripePriceId`: `ZodOptional`\<`ZodString`\>; `stripeProductId`: `ZodOptional`\<`ZodString`\>; `trialDays`: `ZodDefault`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `currency?`: `string`; `description?`: `string`; `features?`: `object`[]; `interval?`: `"month"` \| `"year"`; `name?`: `string`; `popular?`: `boolean`; `price?`: `number`; `slug?`: `string`; `stripePriceId?`: `string`; `stripeProductId?`: `string`; `trialDays?`: `number`; \}, \{ `currency?`: `string`; `description?`: `string`; `features?`: `object`[]; `interval?`: `"month"` \| `"year"`; `name?`: `string`; `popular?`: `boolean`; `price?`: `number`; `slug?`: `string`; `stripePriceId?`: `string`; `stripeProductId?`: `string`; `trialDays?`: `number`; \}\>

Defined in: [src/modules/features/feature.dto.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L18)

***

### slug

> **slug**: `string`

Defined in: [src/modules/features/feature.dto.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L37)

***

### stripePriceId?

> `optional` **stripePriceId**: `string`

Defined in: [src/modules/features/feature.dto.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L39)

***

### stripeProductId?

> `optional` **stripeProductId**: `string`

Defined in: [src/modules/features/feature.dto.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L40)

***

### trialDays?

> `optional` **trialDays**: `number`

Defined in: [src/modules/features/feature.dto.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.dto.ts#L44)
