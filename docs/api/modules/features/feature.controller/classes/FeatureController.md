[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/features/feature.controller](../README.md) / FeatureController

# Class: FeatureController

Defined in: [src/modules/features/feature.controller.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L16)

## Constructors

### Constructor

> **new FeatureController**(`featureService`, `entitlementService`): `FeatureController`

Defined in: [src/modules/features/feature.controller.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L17)

#### Parameters

##### featureService

[`FeatureService`](../../feature.service/classes/FeatureService.md)

##### entitlementService

[`EntitlementService`](../../entitlement.service/classes/EntitlementService.md)

#### Returns

`FeatureController`

## Methods

### checkEntitlement()

> **checkEntitlement**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:165](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L165)

Check entitlement

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CheckEntitlementDTO`](../../feature.dto/classes/CheckEntitlementDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### checkFeatureFlag()

> **checkFeatureFlag**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:127](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L127)

Check specific feature flag

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `key`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### comparePlans()

> **comparePlans**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:107](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L107)

Compare plans

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `ids`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### consumeEntitlement()

> **consumeEntitlement**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:176](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L176)

Consume entitlement

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`ConsumeEntitlementDTO`](../../feature.dto/classes/ConsumeEntitlementDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createFeature()

> **createFeature**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L38)

Create feature (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateFeatureDTO`](../../feature.dto/classes/CreateFeatureDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createPlan()

> **createPlan**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:74](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L74)

Create plan (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreatePlanDTO`](../../feature.dto/classes/CreatePlanDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getFeatures()

> **getFeatures**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L25)

Get all features

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `category?`: `string`; `includeUsage?`: `boolean`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getFeatureUsageStats()

> **getFeatureUsageStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:200](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L200)

Get feature usage statistics (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `featureKey`: `string`; \}; `Querystring`: \{ `endDate?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getPlan()

> **getPlan**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L64)

Get plan by slug

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `slug`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getPlans()

> **getPlans**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L51)

Get all plans

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `active?`: `boolean`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserEntitlements()

> **getUserEntitlements**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:155](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L155)

Get user's entitlements

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserFeatureFlags()

> **getUserFeatureFlags**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:117](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L117)

Get user's feature flags

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### trackUsage()

> **trackUsage**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:187](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L187)

Track feature usage

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `feature`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateFeatureFlag()

> **updateFeatureFlag**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:138](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L138)

Update feature flag (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdateFeatureFlagDTO`](../../feature.dto/classes/UpdateFeatureFlagDTO.md); `Params`: \{ `key`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updatePlan()

> **updatePlan**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.controller.ts:87](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L87)

Update plan (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdatePlanDTO`](../../feature.dto/classes/UpdatePlanDTO.md); `Params`: \{ `planId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### entitlementService

> `private` **entitlementService**: [`EntitlementService`](../../entitlement.service/classes/EntitlementService.md)

Defined in: [src/modules/features/feature.controller.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L19)

***

### featureService

> `private` **featureService**: [`FeatureService`](../../feature.service/classes/FeatureService.md)

Defined in: [src/modules/features/feature.controller.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.controller.ts#L18)
