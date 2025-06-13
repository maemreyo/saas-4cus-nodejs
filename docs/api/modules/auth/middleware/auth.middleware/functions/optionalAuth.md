[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/auth/middleware/auth.middleware](../README.md) / optionalAuth

# Function: optionalAuth()

> **optionalAuth**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/middleware/auth.middleware.ts:129](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/middleware/auth.middleware.ts#L129)

Optional authentication - sets user if token present but doesn't require it
Compatible with Fastify's preHandler hook

## Parameters

### request

`FastifyRequest`

### reply

`FastifyReply`

## Returns

`Promise`\<`void`\>
