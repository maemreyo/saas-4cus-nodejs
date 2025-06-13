[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/tenant/tenant.utils](../README.md) / getTenantId

# Function: getTenantId()

> **getTenantId**(`request`): `string`

Defined in: [src/modules/tenant/tenant.utils.ts:8](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.utils.ts#L8)

Extract tenant ID from request
The tenant ID is set by requireTenant middleware in (request as any).tenant.id

## Parameters

### request

`FastifyRequest`

## Returns

`string`
