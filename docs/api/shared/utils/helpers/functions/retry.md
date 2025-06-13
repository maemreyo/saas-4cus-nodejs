[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/utils/helpers](../README.md) / retry

# Function: retry()

> **retry**\<`T`\>(`fn`, `options`): `Promise`\<`T`\>

Defined in: [src/shared/utils/helpers.ts:110](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/utils/helpers.ts#L110)

## Type Parameters

### T

`T`

## Parameters

### fn

() => `Promise`\<`T`\>

### options

#### attempts?

`number`

#### backoff?

`boolean`

#### delay?

`number`

## Returns

`Promise`\<`T`\>
