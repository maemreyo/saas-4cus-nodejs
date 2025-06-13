[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/features/feature.service](../README.md) / FeatureService

# Class: FeatureService

Defined in: [src/modules/features/feature.service.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L64)

## Constructors

### Constructor

> **new FeatureService**(`eventBus`): `FeatureService`

Defined in: [src/modules/features/feature.service.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L67)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`FeatureService`

## Methods

### comparePlans()

> **comparePlans**(`planIds`): `Promise`\<\{ `features`: `object`[]; `plans`: `object`[]; \}\>

Defined in: [src/modules/features/feature.service.ts:564](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L564)

Compare plans

#### Parameters

##### planIds

`string`[]

#### Returns

`Promise`\<\{ `features`: `object`[]; `plans`: `object`[]; \}\>

***

### createFeature()

> **createFeature**(`options`): `Promise`\<\{ \}\>

Defined in: [src/modules/features/feature.service.ts:101](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L101)

Create a new feature

#### Parameters

##### options

[`CreateFeatureOptions`](../interfaces/CreateFeatureOptions.md)

#### Returns

`Promise`\<\{ \}\>

***

### createPlan()

> **createPlan**(`options`): `Promise`\<\{ \}\>

Defined in: [src/modules/features/feature.service.ts:186](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L186)

Create a new plan

#### Parameters

##### options

[`CreatePlanOptions`](../interfaces/CreatePlanOptions.md)

#### Returns

`Promise`\<\{ \}\>

***

### getFeatureByKey()

> **getFeatureByKey**(`key`): `Promise`\<\{ \}\>

Defined in: [src/modules/features/feature.service.ts:170](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L170)

Get feature by key

#### Parameters

##### key

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getFeatures()

> **getFeatures**(`options?`): `Promise`\<`object`[]\>

Defined in: [src/modules/features/feature.service.ts:136](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L136)

Get all features

#### Parameters

##### options?

###### category?

`string`

###### includeUsage?

`boolean`

#### Returns

`Promise`\<`object`[]\>

***

### getFeatureUsageStats()

> **getFeatureUsageStats**(`featureKey`, `options?`): `Promise`\<\{ `dailyUsage`: `object`[]; `totalUsage`: `number`; `totalUsers`: `number`; \}\>

Defined in: [src/modules/features/feature.service.ts:475](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L475)

Get feature usage statistics

#### Parameters

##### featureKey

`string`

##### options?

###### endDate?

`Date`

###### startDate?

`Date`

###### tenantId?

`string`

#### Returns

`Promise`\<\{ `dailyUsage`: `object`[]; `totalUsage`: `number`; `totalUsers`: `number`; \}\>

***

### getPlanBySlug()

> **getPlanBySlug**(`slug`): `Promise`\<`object` & `object`\>

Defined in: [src/modules/features/feature.service.ts:269](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L269)

Get plan by slug

#### Parameters

##### slug

`string`

#### Returns

`Promise`\<`object` & `object`\>

***

### getPlans()

> **getPlans**(`options?`): `Promise`\<`object` & `object`[]\>

Defined in: [src/modules/features/feature.service.ts:245](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L245)

Get all plans with features

#### Parameters

##### options?

###### active?

`boolean`

###### includeFeatures?

`boolean`

#### Returns

`Promise`\<`object` & `object`[]\>

***

### getUserFeatureFlags()

> **getUserFeatureFlags**(`userId`): `Promise`\<`Record`\<`string`, `boolean`\>\>

Defined in: [src/modules/features/feature.service.ts:382](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L382)

Get all feature flags for user

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`Record`\<`string`, `boolean`\>\>

***

### hashUserId()

> `private` **hashUserId**(`userId`, `featureKey`): `number`

Defined in: [src/modules/features/feature.service.ts:548](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L548)

Hash user ID for consistent feature flag rollout

#### Parameters

##### userId

`string`

##### featureKey

`string`

#### Returns

`number`

***

### initializeFeatureFlags()

> `private` **initializeFeatureFlags**(): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.service.ts:74](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L74)

Initialize feature flags from config or database

#### Returns

`Promise`\<`void`\>

***

### isFeatureFlagEnabled()

> **isFeatureFlagEnabled**(`key`, `userId?`, `attributes?`): `Promise`\<`boolean`\>

Defined in: [src/modules/features/feature.service.ts:339](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L339)

Check if feature flag is enabled for user

#### Parameters

##### key

`string`

##### userId?

`string`

##### attributes?

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`boolean`\>

***

### trackFeatureUsage()

> **trackFeatureUsage**(`userId`, `featureKey`, `tenantId?`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.service.ts:422](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L422)

Track feature usage

#### Parameters

##### userId

`string`

##### featureKey

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<`void`\>

***

### updateFeatureFlag()

> **updateFeatureFlag**(`key`, `updates`): `Promise`\<`void`\>

Defined in: [src/modules/features/feature.service.ts:395](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L395)

Update feature flag

#### Parameters

##### key

`string`

##### updates

`Partial`\<[`FeatureFlag`](../interfaces/FeatureFlag.md)\>

#### Returns

`Promise`\<`void`\>

***

### updatePlan()

> **updatePlan**(`planId`, `updates`): `Promise`\<\{ \}\>

Defined in: [src/modules/features/feature.service.ts:292](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L292)

Update plan

#### Parameters

##### planId

`string`

##### updates

[`UpdatePlanOptions`](../interfaces/UpdatePlanOptions.md)

#### Returns

`Promise`\<\{ \}\>

## Properties

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/features/feature.service.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L67)

***

### featureFlags

> `private` **featureFlags**: `Map`\<`string`, [`FeatureFlag`](../interfaces/FeatureFlag.md)\>

Defined in: [src/modules/features/feature.service.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/feature.service.ts#L65)
