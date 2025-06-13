[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/utils/validation](../README.md) / sanitizeDto

# Function: sanitizeDto()

> **sanitizeDto**\<`T`\>(`schema`, `data`): `unknown`

Defined in: [src/shared/utils/validation.ts:104](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/utils/validation.ts#L104)

Sanitize data - strip unknown fields

## Type Parameters

### T

`T`

## Parameters

### schema

`ZodType`\<`T`\>

Zod schema

### data

`unknown`

Data to sanitize

## Returns

`unknown`

Sanitized data with only known fields
