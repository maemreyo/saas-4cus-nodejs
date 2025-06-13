[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/billing/billing.middleware](../README.md) / requirePlan

# Function: requirePlan()

> **requirePlan**(`minPlanId`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/billing/billing.middleware.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/billing/billing.middleware.ts#L28)

Middleware to check if user has required plan

## Parameters

### minPlanId

`string`

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
