[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/billing/subscription.service](../README.md) / SubscriptionService

# Class: SubscriptionService

Defined in: [src/modules/billing/subscription.service.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L38)

## Constructors

### Constructor

> **new SubscriptionService**(): `SubscriptionService`

Defined in: [src/modules/billing/subscription.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L41)

#### Returns

`SubscriptionService`

## Methods

### calculateProration()

> **calculateProration**(`userId`, `newPlanId`): `Promise`\<\{ `amount`: `number`; `credits`: `number`; `description`: `string`; \}\>

Defined in: [src/modules/billing/subscription.service.ts:391](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L391)

Calculate proration for plan change

#### Parameters

##### userId

`string`

##### newPlanId

`string`

#### Returns

`Promise`\<\{ `amount`: `number`; `credits`: `number`; `description`: `string`; \}\>

***

### checkUsageLimit()

> **checkUsageLimit**(`userId`, `resource`, `currentUsage?`): `Promise`\<\{ `allowed`: `boolean`; `limit`: `number`; `remaining`: `number`; `unlimited`: `boolean`; `used`: `number`; \}\>

Defined in: [src/modules/billing/subscription.service.ts:244](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L244)

Check usage limit for a resource

#### Parameters

##### userId

`string`

##### resource

keyof [`PlanLimits`](../interfaces/PlanLimits.md)

##### currentUsage?

`number`

#### Returns

`Promise`\<\{ `allowed`: `boolean`; `limit`: `number`; `remaining`: `number`; `unlimited`: `boolean`; `used`: `number`; \}\>

***

### enforceUsageLimit()

> **enforceUsageLimit**(`userId`, `resource`): `Promise`\<`void`\>

Defined in: [src/modules/billing/subscription.service.ts:330](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L330)

Enforce usage limit - throws exception if limit exceeded

#### Parameters

##### userId

`string`

##### resource

keyof [`PlanLimits`](../interfaces/PlanLimits.md)

#### Returns

`Promise`\<`void`\>

***

### getCurrentUsage()

> `private` **getCurrentUsage**(`userId`, `resource`): `Promise`\<`number`\>

Defined in: [src/modules/billing/subscription.service.ts:290](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L290)

Get current usage for a resource

#### Parameters

##### userId

`string`

##### resource

keyof [`PlanLimits`](../interfaces/PlanLimits.md)

#### Returns

`Promise`\<`number`\>

***

### getPlan()

> **getPlan**(`planId`): [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md)

Defined in: [src/modules/billing/subscription.service.ts:171](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L171)

Get plan by ID

#### Parameters

##### planId

`string`

#### Returns

[`SubscriptionPlan`](../interfaces/SubscriptionPlan.md)

***

### getPlanByPriceId()

> **getPlanByPriceId**(`stripePriceId`): [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md)

Defined in: [src/modules/billing/subscription.service.ts:178](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L178)

Get plan by Stripe price ID

#### Parameters

##### stripePriceId

`string`

#### Returns

[`SubscriptionPlan`](../interfaces/SubscriptionPlan.md)

***

### getPlans()

> **getPlans**(): [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md)[]

Defined in: [src/modules/billing/subscription.service.ts:164](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L164)

Get all available plans

#### Returns

[`SubscriptionPlan`](../interfaces/SubscriptionPlan.md)[]

***

### getSubscriptionStats()

> **getSubscriptionStats**(`userId`): `Promise`\<\{ `billing`: \{ `invoiceCount`: `number`; `lastPayment`: `Date`; `nextPayment`: `any`; `totalSpent`: `number`; \}; `plan`: [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md); `subscription`: `any`; `usage`: `Record`\<`string`, `any`\>; \}\>

Defined in: [src/modules/billing/subscription.service.ts:349](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L349)

Get subscription statistics

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `billing`: \{ `invoiceCount`: `number`; `lastPayment`: `Date`; `nextPayment`: `any`; `totalSpent`: `number`; \}; `plan`: [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md); `subscription`: `any`; `usage`: `Record`\<`string`, `any`\>; \}\>

***

### getUserSubscription()

> **getUserSubscription**(`userId`): `Promise`\<\{ `isActive`: `boolean`; `isTrial`: `boolean`; `plan`: [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md); `subscription`: `any`; `willCancelAt?`: `undefined`; \} \| \{ `isActive`: `boolean`; `isTrial`: `boolean`; `plan`: [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md); `subscription`: \{ \}; `willCancelAt`: `Date`; \}\>

Defined in: [src/modules/billing/subscription.service.ts:186](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L186)

Get user's current subscription with caching

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `isActive`: `boolean`; `isTrial`: `boolean`; `plan`: [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md); `subscription`: `any`; `willCancelAt?`: `undefined`; \} \| \{ `isActive`: `boolean`; `isTrial`: `boolean`; `plan`: [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md); `subscription`: \{ \}; `willCancelAt`: `Date`; \}\>

***

### hasAllFeatures()

> **hasAllFeatures**(`userId`, `featureIds`): `Promise`\<`boolean`\>

Defined in: [src/modules/billing/subscription.service.ts:231](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L231)

Check if user has access to multiple features

#### Parameters

##### userId

`string`

##### featureIds

`string`[]

#### Returns

`Promise`\<`boolean`\>

***

### hasFeature()

> **hasFeature**(`userId`, `featureId`): `Promise`\<`boolean`\>

Defined in: [src/modules/billing/subscription.service.ts:220](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L220)

Check if user has access to a feature

#### Parameters

##### userId

`string`

##### featureId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### initializePlans()

> `private` **initializePlans**(): `void`

Defined in: [src/modules/billing/subscription.service.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L45)

#### Returns

`void`

## Properties

### plans

> `private` **plans**: `Map`\<`string`, [`SubscriptionPlan`](../interfaces/SubscriptionPlan.md)\>

Defined in: [src/modules/billing/subscription.service.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/subscription.service.ts#L39)
