[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.middleware](../README.md) / rateLimitMiddleware

# Function: rateLimitMiddleware()

> **rateLimitMiddleware**(`options?`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.middleware.ts:73](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.middleware.ts#L73)

Rate limiting middleware

## Parameters

### options?

#### endpoint?

`string`

#### limit?

`number`

#### windowMs?

`number`

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
