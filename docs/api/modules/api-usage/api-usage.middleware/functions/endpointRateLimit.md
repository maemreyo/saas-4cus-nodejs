[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.middleware](../README.md) / endpointRateLimit

# Function: endpointRateLimit()

> **endpointRateLimit**(`endpoint`, `limit`, `windowMs`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.middleware.ts:151](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/api-usage/api-usage.middleware.ts#L151)

Endpoint-specific rate limiting

## Parameters

### endpoint

`string`

### limit

`number`

### windowMs

`number` = `60000`

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
