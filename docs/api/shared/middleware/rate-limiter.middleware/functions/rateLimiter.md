[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/middleware/rate-limiter.middleware](../README.md) / rateLimiter

# Function: rateLimiter()

> **rateLimiter**(`options`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L32)

Rate limiter middleware factory
Creates a rate limiter middleware with the given options

## Parameters

### options

`Partial`\<[`RateLimitOptions`](../interfaces/RateLimitOptions.md)\> = `{}`

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
