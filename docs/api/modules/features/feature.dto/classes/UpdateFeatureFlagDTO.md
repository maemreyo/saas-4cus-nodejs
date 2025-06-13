[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/features/feature.dto](../README.md) / UpdateFeatureFlagDTO

# Class: UpdateFeatureFlagDTO

Defined in: [src/modules/features/feature.dto.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/features/feature.dto.ts#L57)

## Constructors

### Constructor

> **new UpdateFeatureFlagDTO**(): `UpdateFeatureFlagDTO`

#### Returns

`UpdateFeatureFlagDTO`

## Properties

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [src/modules/features/feature.dto.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/features/feature.dto.ts#L66)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [src/modules/features/feature.dto.ts:70](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/features/feature.dto.ts#L70)

***

### rolloutPercentage?

> `optional` **rolloutPercentage**: `number`

Defined in: [src/modules/features/feature.dto.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/features/feature.dto.ts#L67)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `enabled`: `ZodOptional`\<`ZodBoolean`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `rolloutPercentage`: `ZodOptional`\<`ZodNumber`\>; `userBlacklist`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `userWhitelist`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `enabled?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `rolloutPercentage?`: `number`; `userBlacklist?`: `string`[]; `userWhitelist?`: `string`[]; \}, \{ `enabled?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `rolloutPercentage?`: `number`; `userBlacklist?`: `string`[]; `userWhitelist?`: `string`[]; \}\>

Defined in: [src/modules/features/feature.dto.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/features/feature.dto.ts#L58)

***

### userBlacklist?

> `optional` **userBlacklist**: `string`[]

Defined in: [src/modules/features/feature.dto.ts:69](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/features/feature.dto.ts#L69)

***

### userWhitelist?

> `optional` **userWhitelist**: `string`[]

Defined in: [src/modules/features/feature.dto.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/features/feature.dto.ts#L68)
