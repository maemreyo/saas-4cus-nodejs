[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/utils/validation](../README.md) / validateDtoSync

# Function: validateDtoSync()

> **validateDtoSync**\<`T`\>(`schema`, `data`): `T`

Defined in: [src/shared/utils/validation.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/utils/validation.ts#L45)

Validate DTO synchronously

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

`T`

Validated and typed data

## Throws

ValidationException if validation fails
