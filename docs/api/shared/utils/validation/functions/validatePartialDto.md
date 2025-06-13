[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/utils/validation](../README.md) / validatePartialDto

# Function: validatePartialDto()

> **validatePartialDto**\<`T`\>(`schema`, `data`): `Promise`\<`Partial`\<`T`\>\>

Defined in: [src/shared/utils/validation.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/utils/validation.ts#L75)

Partial validation - only validate provided fields

## Type Parameters

### T

`T`

## Parameters

### schema

`ZodType`\<`T`\>

Zod schema

### data

`unknown`

Partial data to validate

## Returns

`Promise`\<`Partial`\<`T`\>\>

Validated partial data
