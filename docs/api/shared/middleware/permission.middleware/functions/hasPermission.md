[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/middleware/permission.middleware](../README.md) / hasPermission

# Function: hasPermission()

> **hasPermission**(...`requiredPermissions`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/shared/middleware/permission.middleware.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/permission.middleware.ts#L10)

Check if user has required permissions

## Parameters

### requiredPermissions

...`string`[]

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
