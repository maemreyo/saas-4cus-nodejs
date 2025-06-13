[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/utils/validation](../README.md) / safeParse

# Function: safeParse()

> **safeParse**\<`T`\>(`schema`, `data`): `Promise`\<\{ `data`: `T`; `success`: `true`; \} \| \{ `error`: `ZodError`; `success`: `false`; \}\>

Defined in: [src/shared/utils/validation.ts:90](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/utils/validation.ts#L90)

Safe parse - returns result object instead of throwing

## Type Parameters

### T

`T`

## Parameters

### schema

`ZodType`\<`T`\>

Zod schema

### data

`unknown`

Data to validate

## Returns

`Promise`\<\{ `data`: `T`; `success`: `true`; \} \| \{ `error`: `ZodError`; `success`: `false`; \}\>

Result object with success flag and data/error
