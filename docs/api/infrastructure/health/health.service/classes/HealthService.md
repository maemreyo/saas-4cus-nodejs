[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/health/health.service](../README.md) / HealthService

# Class: HealthService

Defined in: [src/infrastructure/health/health.service.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L12)

## Constructors

### Constructor

> **new HealthService**(): `HealthService`

#### Returns

`HealthService`

## Methods

### check()

> **check**(`name`): `Promise`\<[`HealthCheckResult`](../../health.types/interfaces/HealthCheckResult.md)\>

Defined in: [src/infrastructure/health/health.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L48)

Run a specific health check

#### Parameters

##### name

`string`

#### Returns

`Promise`\<[`HealthCheckResult`](../../health.types/interfaces/HealthCheckResult.md)\>

***

### checkAll()

> **checkAll**(): `Promise`\<[`HealthSummary`](../../health.types/interfaces/HealthSummary.md)\>

Defined in: [src/infrastructure/health/health.service.ts:93](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L93)

Run all health checks

#### Returns

`Promise`\<[`HealthSummary`](../../health.types/interfaces/HealthSummary.md)\>

***

### getRegisteredChecks()

> **getRegisteredChecks**(): [`HealthCheckEntry`](../../health.types/interfaces/HealthCheckEntry.md)[]

Defined in: [src/infrastructure/health/health.service.ts:121](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L121)

Get all registered health checks

#### Returns

[`HealthCheckEntry`](../../health.types/interfaces/HealthCheckEntry.md)[]

***

### register()

> **register**(`name`, `check`, `description?`, `tags?`): `void`

Defined in: [src/infrastructure/health/health.service.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L23)

Register a health check

#### Parameters

##### name

`string`

##### check

[`HealthCheckFn`](../../health.types/type-aliases/HealthCheckFn.md)

##### description?

`string`

##### tags?

`string`[]

#### Returns

`void`

***

### setCacheTime()

> **setCacheTime**(`milliseconds`): `void`

Defined in: [src/infrastructure/health/health.service.ts:128](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L128)

Set cache time for health check results

#### Parameters

##### milliseconds

`number`

#### Returns

`void`

***

### unregister()

> **unregister**(`name`): `boolean`

Defined in: [src/infrastructure/health/health.service.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L35)

Unregister a health check

#### Parameters

##### name

`string`

#### Returns

`boolean`

## Properties

### cacheTime

> `private` **cacheTime**: `number`

Defined in: [src/infrastructure/health/health.service.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L18)

***

### checks

> `private` **checks**: `Map`\<`string`, [`HealthCheckEntry`](../../health.types/interfaces/HealthCheckEntry.md)\>

Defined in: [src/infrastructure/health/health.service.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L13)

***

### lastCheckTime

> `private` **lastCheckTime**: `Map`\<`string`, `number`\>

Defined in: [src/infrastructure/health/health.service.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L15)

***

### lastResults

> `private` **lastResults**: `Map`\<`string`, [`HealthCheckResult`](../../health.types/interfaces/HealthCheckResult.md)\>

Defined in: [src/infrastructure/health/health.service.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/health/health.service.ts#L14)
