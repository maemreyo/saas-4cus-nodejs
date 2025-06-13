[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/tenant/tenant.controller](../README.md) / TenantController

# Class: TenantController

Defined in: [src/modules/tenant/tenant.controller.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L15)

## Constructors

### Constructor

> **new TenantController**(`tenantService`): `TenantController`

Defined in: [src/modules/tenant/tenant.controller.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L16)

#### Parameters

##### tenantService

[`TenantService`](../../tenant.service/classes/TenantService.md)

#### Returns

`TenantController`

## Methods

### acceptInvitation()

> **acceptInvitation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:155](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L155)

Accept invitation

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `token`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createTenant()

> **createTenant**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L21)

Create new tenant

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateTenantDTO`](../../tenant.dto/classes/CreateTenantDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteTenant()

> **deleteTenant**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:98](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L98)

Delete tenant

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCurrentTenant()

> **getCurrentTenant**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/tenant/tenant.controller.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L39)

Get current tenant

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### getTenant()

> **getTenant**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:62](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L62)

Get tenant by ID

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTenantMembers()

> **getTenantMembers**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:110](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L110)

Get tenant members

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `tenantId`: `string`; \}; `Querystring`: \{ `limit?`: `number`; `offset?`: `number`; `role?`: `TenantMemberRole`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTenantStats()

> **getTenantStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:237](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L237)

Get tenant statistics

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserTenants()

> **getUserTenants**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L52)

Get user's tenants

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### inviteMember()

> **inviteMember**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:133](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L133)

Invite member

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`InviteMemberDTO`](../../tenant.dto/classes/InviteMemberDTO.md); `Params`: \{ `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### leaveTenant()

> **leaveTenant**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:206](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L206)

Leave tenant

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### removeMember()

> **removeMember**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:189](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L189)

Remove member

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `memberId`: `string`; `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### transferOwnership()

> **transferOwnership**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:218](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L218)

Transfer ownership

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`TransferOwnershipDTO`](../../tenant.dto/classes/TransferOwnershipDTO.md); `Params`: \{ `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateMemberRole()

> **updateMemberRole**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:170](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L170)

Update member role

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdateMemberRoleDTO`](../../tenant.dto/classes/UpdateMemberRoleDTO.md); `Params`: \{ `memberId`: `string`; `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateTenant()

> **updateTenant**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.controller.ts:76](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L76)

Update tenant

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdateTenantDTO`](../../tenant.dto/classes/UpdateTenantDTO.md); `Params`: \{ `tenantId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### tenantService

> `private` **tenantService**: [`TenantService`](../../tenant.service/classes/TenantService.md)

Defined in: [src/modules/tenant/tenant.controller.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.controller.ts#L16)
