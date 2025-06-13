[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/utils/validation](../README.md) / coerceAndValidate

# Function: coerceAndValidate()

> **coerceAndValidate**\<`T`\>(`schema`, `data`): `T`

Defined in: [src/shared/utils/validation.ts:150](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/utils/validation.ts#L150)

Coerce and validate - useful for query parameters

## Type Parameters

### T

`T`

## Parameters

### schema

`ZodType`\<`T`\>

Zod schema

### data

`unknown`

Data to coerce and validate

## Returns

`T`

Coerced and validated data
