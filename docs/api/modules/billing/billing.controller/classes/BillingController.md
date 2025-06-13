[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/billing/billing.controller](../README.md) / BillingController

# Class: BillingController

Defined in: [src/modules/billing/billing.controller.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L10)

## Constructors

### Constructor

> **new BillingController**(`billingService`, `subscriptionService`): `BillingController`

Defined in: [src/modules/billing/billing.controller.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L11)

#### Parameters

##### billingService

[`BillingService`](../../billing.service/classes/BillingService.md)

##### subscriptionService

[`SubscriptionService`](../../subscription.service/classes/SubscriptionService.md)

#### Returns

`BillingController`

## Methods

### applyCoupon()

> **applyCoupon**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/billing/billing.controller.ts:157](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L157)

Apply coupon to subscription

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`ApplyCouponDTO`](../../billing.dto/classes/ApplyCouponDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### calculateProration()

> **calculateProration**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:175](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L175)

Calculate proration for plan change

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CalculateProrationDTO`](../../billing.dto/classes/CalculateProrationDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### cancelSubscription()

> **cancelSubscription**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/billing/billing.controller.ts:114](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L114)

Cancel subscription

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `immediately?`: `boolean`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### checkFeature()

> **checkFeature**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:187](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L187)

Check feature access

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `feature`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### checkUsageLimit()

> **checkUsageLimit**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:199](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L199)

Check usage limit

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `resource`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createCheckoutSession()

> **createCheckoutSession**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:62](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L62)

Create checkout session for new subscription or upgrade

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateCheckoutDTO`](../../billing.dto/classes/CreateCheckoutDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createPortalSession()

> **createPortalSession**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:84](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L84)

Create customer portal session

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `returnUrl`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getBillingHistory()

> **getBillingHistory**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/billing/billing.controller.ts:223](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L223)

Get billing history

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `limit?`: `number`; `offset?`: `number`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### getCurrentSubscription()

> **getCurrentSubscription**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L42)

Get current subscription details

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getPlans()

> **getPlans**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L19)

Get available subscription plans

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSubscriptionStats()

> **getSubscriptionStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L52)

Get subscription statistics and usage

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### handleWebhook()

> **handleWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.controller.ts:211](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L211)

Handle Stripe webhook

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### resumeSubscription()

> **resumeSubscription**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/billing/billing.controller.ts:136](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L136)

Resume cancelled subscription

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### updateSubscription()

> **updateSubscription**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/billing/billing.controller.ts:96](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L96)

Update subscription (upgrade/downgrade)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdateSubscriptionDTO`](../../billing.dto/classes/UpdateSubscriptionDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

## Properties

### billingService

> `private` **billingService**: [`BillingService`](../../billing.service/classes/BillingService.md)

Defined in: [src/modules/billing/billing.controller.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L12)

***

### subscriptionService

> `private` **subscriptionService**: [`SubscriptionService`](../../subscription.service/classes/SubscriptionService.md)

Defined in: [src/modules/billing/billing.controller.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.controller.ts#L13)
