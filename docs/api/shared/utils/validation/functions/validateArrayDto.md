[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/utils/validation](../README.md) / validateArrayDto

# Function: validateArrayDto()

> **validateArrayDto**\<`T`\>(`schema`, `data`): `Promise`\<`T`[]\>

Defined in: [src/shared/utils/validation.ts:136](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/utils/validation.ts#L136)

Validate array of DTOs

## Type Parameters

### T

`T`

## Parameters

### schema

`ZodType`\<`T`\>

Zod schema for single item

### data

`unknown`

Array of data to validate

## Returns

`Promise`\<`T`[]\>

Array of validated items
