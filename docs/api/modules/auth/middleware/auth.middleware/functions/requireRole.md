[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/auth/middleware/auth.middleware](../README.md) / requireRole

# Function: requireRole()

> **requireRole**(...`roles`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/auth/middleware/auth.middleware.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/auth/middleware/auth.middleware.ts#L75)

Require specific roles
Compatible with Fastify's preHandler hook

## Parameters

### roles

...`UserRole`[]

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
