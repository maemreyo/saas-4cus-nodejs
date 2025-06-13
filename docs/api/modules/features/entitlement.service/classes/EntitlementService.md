[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/features/entitlement.service](../README.md) / EntitlementService

# Class: EntitlementService

Defined in: [src/modules/features/entitlement.service.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L18)

## Constructors

### Constructor

> **new EntitlementService**(`subscriptionService`, `tenantContext`): `EntitlementService`

Defined in: [src/modules/features/entitlement.service.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L19)

#### Parameters

##### subscriptionService

[`SubscriptionService`](../../../billing/subscription.service/classes/SubscriptionService.md)

##### tenantContext

[`TenantContextService`](../../../tenant/tenant.context/classes/TenantContextService.md)

#### Returns

`EntitlementService`

## Methods

### check()

> **check**(`userId`, `featureKey`): `Promise`\<`boolean`\>

Defined in: [src/modules/features/entitlement.service.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L27)

Check if user has access to a feature

#### Parameters

##### userId

`string`

##### featureKey

`string`

#### Returns

`Promise`\<`boolean`\>

***

### consume()

> **consume**(`userId`, `featureKey`, `amount`): `Promise`\<`void`\>

Defined in: [src/modules/features/entitlement.service.ts:144](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L144)

Consume an entitlement

#### Parameters

##### userId

`string`

##### featureKey

`string`

##### amount

`number` = `1`

#### Returns

`Promise`\<`void`\>

***

### getAllEntitlements()

> **getAllEntitlements**(`userId`): `Promise`\<[`Entitlement`](../interfaces/Entitlement.md)[]\>

Defined in: [src/modules/features/entitlement.service.ts:101](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L101)

Get all entitlements for user

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<[`Entitlement`](../interfaces/Entitlement.md)[]\>

***

### getEntitlement()

> **getEntitlement**(`userId`, `featureKey`): `Promise`\<[`Entitlement`](../interfaces/Entitlement.md)\>

Defined in: [src/modules/features/entitlement.service.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L36)

Get entitlement details for a feature

#### Parameters

##### userId

`string`

##### featureKey

`string`

#### Returns

`Promise`\<[`Entitlement`](../interfaces/Entitlement.md)\>

***

### getFeatureUsage()

> `private` **getFeatureUsage**(`userId`, `featureId`, `tenantId?`): `Promise`\<`number`\>

Defined in: [src/modules/features/entitlement.service.ts:176](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L176)

Get feature usage for current period

#### Parameters

##### userId

`string`

##### featureId

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<`number`\>

***

### incrementUsage()

> `private` **incrementUsage**(`userId`, `featureId`, `tenantId`, `amount`): `Promise`\<`void`\>

Defined in: [src/modules/features/entitlement.service.ts:203](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L203)

Increment feature usage

#### Parameters

##### userId

`string`

##### featureId

`string`

##### tenantId

`string`

##### amount

`number`

#### Returns

`Promise`\<`void`\>

***

### resetUsage()

> **resetUsage**(`userId`, `featureKey`): `Promise`\<`void`\>

Defined in: [src/modules/features/entitlement.service.ts:244](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L244)

Reset usage for a feature

#### Parameters

##### userId

`string`

##### featureKey

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### subscriptionService

> `private` **subscriptionService**: [`SubscriptionService`](../../../billing/subscription.service/classes/SubscriptionService.md)

Defined in: [src/modules/features/entitlement.service.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L20)

***

### tenantContext

> `private` **tenantContext**: [`TenantContextService`](../../../tenant/tenant.context/classes/TenantContextService.md)

Defined in: [src/modules/features/entitlement.service.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/features/entitlement.service.ts#L21)
