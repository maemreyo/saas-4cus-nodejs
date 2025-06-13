[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/billing/billing.service](../README.md) / BillingService

# Class: BillingService

Defined in: [src/modules/billing/billing.service.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L28)

## Constructors

### Constructor

> **new BillingService**(`eventBus`): `BillingService`

Defined in: [src/modules/billing/billing.service.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L31)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`BillingService`

## Methods

### applyCoupon()

> **applyCoupon**(`subscriptionId`, `couponId`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:398](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L398)

Apply coupon to subscription

#### Parameters

##### subscriptionId

`string`

##### couponId

`string`

#### Returns

`Promise`\<`void`\>

***

### cancelSubscription()

> **cancelSubscription**(`subscriptionId`, `immediately`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:280](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L280)

Cancel subscription

#### Parameters

##### subscriptionId

`string`

##### immediately

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

***

### createCheckoutSession()

> **createCheckoutSession**(`userId`, `priceId`, `successUrl`, `cancelUrl`, `options?`): `Promise`\<`string`\>

Defined in: [src/modules/billing/billing.service.ts:103](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L103)

Create a checkout session for subscription

#### Parameters

##### userId

`string`

##### priceId

`string`

##### successUrl

`string`

##### cancelUrl

`string`

##### options?

###### couponId?

`string`

###### metadata?

`Record`\<`string`, `string`\>

###### trialDays?

`number`

#### Returns

`Promise`\<`string`\>

***

### createPortalSession()

> **createPortalSession**(`userId`, `returnUrl`): `Promise`\<`string`\>

Defined in: [src/modules/billing/billing.service.ts:206](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L206)

Create customer portal session

#### Parameters

##### userId

`string`

##### returnUrl

`string`

#### Returns

`Promise`\<`string`\>

***

### getOrCreateCustomer()

> **getOrCreateCustomer**(`options`): `Promise`\<`string`\>

Defined in: [src/modules/billing/billing.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L41)

Create or get existing Stripe customer

#### Parameters

##### options

[`CreateCustomerOptions`](../interfaces/CreateCustomerOptions.md)

#### Returns

`Promise`\<`string`\>

***

### handleCheckoutSessionCompleted()

> `private` **handleCheckoutSessionCompleted**(`session`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:412](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L412)

#### Parameters

##### session

`Session`

#### Returns

`Promise`\<`void`\>

***

### handleInvoicePaymentFailed()

> `private` **handleInvoicePaymentFailed**(`invoice`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:603](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L603)

#### Parameters

##### invoice

`Invoice`

#### Returns

`Promise`\<`void`\>

***

### handleInvoicePaymentSucceeded()

> `private` **handleInvoicePaymentSucceeded**(`invoice`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:564](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L564)

#### Parameters

##### invoice

`Invoice`

#### Returns

`Promise`\<`void`\>

***

### handleSubscriptionCreated()

> `private` **handleSubscriptionCreated**(`subscription`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:430](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L430)

#### Parameters

##### subscription

`Subscription`

#### Returns

`Promise`\<`void`\>

***

### handleSubscriptionDeleted()

> `private` **handleSubscriptionDeleted**(`subscription`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:530](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L530)

#### Parameters

##### subscription

`Subscription`

#### Returns

`Promise`\<`void`\>

***

### handleSubscriptionUpdated()

> `private` **handleSubscriptionUpdated**(`subscription`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:489](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L489)

#### Parameters

##### subscription

`Subscription`

#### Returns

`Promise`\<`void`\>

***

### handleTrialWillEnd()

> `private` **handleTrialWillEnd**(`subscription`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:635](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L635)

#### Parameters

##### subscription

`Subscription`

#### Returns

`Promise`\<`void`\>

***

### handleWebhook()

> **handleWebhook**(`payload`, `signature`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:231](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L231)

Handle Stripe webhook events

#### Parameters

##### payload

`string`

##### signature

`string`

#### Returns

`Promise`\<`void`\>

***

### resumeSubscription()

> **resumeSubscription**(`subscriptionId`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:374](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L374)

Resume a cancelled subscription

#### Parameters

##### subscriptionId

`string`

#### Returns

`Promise`\<`void`\>

***

### updateSubscription()

> **updateSubscription**(`subscriptionId`, `newPriceId`, `prorationBehavior`): `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.service.ts:326](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L326)

Update subscription (upgrade/downgrade)

#### Parameters

##### subscriptionId

`string`

##### newPriceId

`string`

##### prorationBehavior

`"none"` | `"create_prorations"` | `"always_invoice"`

#### Returns

`Promise`\<`void`\>

## Properties

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/billing/billing.service.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L31)

***

### stripe

> `private` **stripe**: `Stripe`

Defined in: [src/modules/billing/billing.service.ts:29](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.service.ts#L29)
