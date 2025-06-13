[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.rate-limiter](../README.md) / AiRateLimiter

# Class: AiRateLimiter

Defined in: [src/modules/ai/ai.rate-limiter.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L27)

## Constructors

### Constructor

> **new AiRateLimiter**(`entitlementService`): `AiRateLimiter`

Defined in: [src/modules/ai/ai.rate-limiter.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L36)

#### Parameters

##### entitlementService

[`EntitlementService`](../../../features/entitlement.service/classes/EntitlementService.md)

#### Returns

`AiRateLimiter`

## Methods

### costBasedLimiter()

> **costBasedLimiter**(`costPerRequest`): `Promise`\<(`request`, `reply`) => `Promise`\<`void`\>\>

Defined in: [src/modules/ai/ai.rate-limiter.ts:214](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L214)

#### Parameters

##### costPerRequest

`number`

#### Returns

`Promise`\<(`request`, `reply`) => `Promise`\<`void`\>\>

***

### createLimiter()

> **createLimiter**(`operation`): `Promise`\<(`request`, `reply`) => `Promise`\<`void`\>\>

Defined in: [src/modules/ai/ai.rate-limiter.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L40)

#### Parameters

##### operation

keyof [`UserRateLimits`](../-internal-/interfaces/UserRateLimits.md)

#### Returns

`Promise`\<(`request`, `reply`) => `Promise`\<`void`\>\>

***

### generateKey()

> `private` **generateKey**(`operation`, `userId`, `tenantId?`): `string`

Defined in: [src/modules/ai/ai.rate-limiter.ts:142](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L142)

#### Parameters

##### operation

`string`

##### userId

`string`

##### tenantId?

`string`

#### Returns

`string`

***

### getAllLimits()

> **getAllLimits**(`userId`, `tenantId?`): `Promise`\<`Record`\<keyof [`UserRateLimits`](../-internal-/interfaces/UserRateLimits.md), \{ `current`: `number`; `limit`: `number`; `resetAt`: `Date`; \}\>\>

Defined in: [src/modules/ai/ai.rate-limiter.ts:199](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L199)

#### Parameters

##### userId

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<`Record`\<keyof [`UserRateLimits`](../-internal-/interfaces/UserRateLimits.md), \{ `current`: `number`; `limit`: `number`; `resetAt`: `Date`; \}\>\>

***

### getCurrentMonthCost()

> `private` **getCurrentMonthCost**(`userId`): `Promise`\<`number`\>

Defined in: [src/modules/ai/ai.rate-limiter.ts:240](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L240)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`number`\>

***

### getCurrentUsage()

> **getCurrentUsage**(`userId`, `operation`, `tenantId?`): `Promise`\<\{ `current`: `number`; `limit`: `number`; `resetAt`: `Date`; \}\>

Defined in: [src/modules/ai/ai.rate-limiter.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L154)

#### Parameters

##### userId

`string`

##### operation

keyof [`UserRateLimits`](../-internal-/interfaces/UserRateLimits.md)

##### tenantId?

`string`

#### Returns

`Promise`\<\{ `current`: `number`; `limit`: `number`; `resetAt`: `Date`; \}\>

***

### getUserRateLimits()

> `private` **getUserRateLimits**(`userId`, `operation`): `Promise`\<\{ `max`: `number`; `windowMs`: `number`; \}\>

Defined in: [src/modules/ai/ai.rate-limiter.ts:107](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L107)

#### Parameters

##### userId

`string`

##### operation

keyof [`UserRateLimits`](../-internal-/interfaces/UserRateLimits.md)

#### Returns

`Promise`\<\{ `max`: `number`; `windowMs`: `number`; \}\>

***

### resetLimit()

> **resetLimit**(`userId`, `operation?`, `tenantId?`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.rate-limiter.ts:178](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L178)

#### Parameters

##### userId

`string`

##### operation?

keyof [`UserRateLimits`](../-internal-/interfaces/UserRateLimits.md)

##### tenantId?

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### defaultLimits

> `private` **defaultLimits**: [`UserRateLimits`](../-internal-/interfaces/UserRateLimits.md)

Defined in: [src/modules/ai/ai.rate-limiter.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L28)

***

### entitlementService

> `private` **entitlementService**: [`EntitlementService`](../../../features/entitlement.service/classes/EntitlementService.md)

Defined in: [src/modules/ai/ai.rate-limiter.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.rate-limiter.ts#L37)
