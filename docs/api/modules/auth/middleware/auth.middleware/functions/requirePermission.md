[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/auth/middleware/auth.middleware](../README.md) / requirePermission

# Function: requirePermission()

> **requirePermission**(...`permissions`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/auth/middleware/auth.middleware.ts:101](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/auth/middleware/auth.middleware.ts#L101)

Require specific permissions
Compatible with Fastify's preHandler hook

## Parameters

### permissions

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
