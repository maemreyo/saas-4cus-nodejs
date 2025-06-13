[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/utils/helpers](../README.md) / retry

# Function: retry()

> **retry**\<`T`\>(`fn`, `options`): `Promise`\<`T`\>

Defined in: [src/shared/utils/helpers.ts:110](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/utils/helpers.ts#L110)

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
