[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/auth/middleware/permission.middleware](../README.md) / hasPermission

# Function: hasPermission()

> **hasPermission**(...`requiredPermissions`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/auth/middleware/permission.middleware.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/auth/middleware/permission.middleware.ts#L10)

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
