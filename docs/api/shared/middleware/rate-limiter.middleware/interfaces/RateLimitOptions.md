[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/middleware/rate-limiter.middleware](../README.md) / RateLimitOptions

# Interface: RateLimitOptions

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L9)

## Properties

### keyGenerator()?

> `optional` **keyGenerator**: (`request`) => `string`

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L16)

#### Parameters

##### request

`FastifyRequest`

#### Returns

`string`

***

### legacyHeaders?

> `optional` **legacyHeaders**: `boolean`

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L14)

***

### max

> **max**: `number`

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L11)

***

### skipSuccessfulRequests?

> `optional` **skipSuccessfulRequests**: `boolean`

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L15)

***

### standardHeaders?

> `optional` **standardHeaders**: `boolean`

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L13)

***

### timeWindow?

> `optional` **timeWindow**: `string`

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L12)

***

### windowMs

> **windowMs**: `number`

Defined in: [src/shared/middleware/rate-limiter.middleware.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/middleware/rate-limiter.middleware.ts#L10)
