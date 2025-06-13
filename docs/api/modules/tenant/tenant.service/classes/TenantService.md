[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/tenant/tenant.service](../README.md) / TenantService

# Class: TenantService

Defined in: [src/modules/tenant/tenant.service.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L39)

## Constructors

### Constructor

> **new TenantService**(`eventBus`, `emailService`): `TenantService`

Defined in: [src/modules/tenant/tenant.service.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L40)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

#### Returns

`TenantService`

## Methods

### acceptInvitation()

> **acceptInvitation**(`token`, `userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/tenant/tenant.service.ts:380](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L380)

Accept invitation

#### Parameters

##### token

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### checkTenantPermission()

> **checkTenantPermission**(`tenantId`, `userId`, `allowedRoles?`): `Promise`\<\{ \}\>

Defined in: [src/modules/tenant/tenant.service.ts:662](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L662)

Check tenant permission

#### Parameters

##### tenantId

`string`

##### userId

`string`

##### allowedRoles?

`TenantMemberRole`[]

#### Returns

`Promise`\<\{ \}\>

***

### clearTenantCache()

> `private` **clearTenantCache**(`tenantId`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.service.ts:690](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L690)

Clear tenant cache

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<`void`\>

***

### createTenant()

> **createTenant**(`options`): `Promise`\<\{ \}\>

Defined in: [src/modules/tenant/tenant.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L48)

Create a new tenant

#### Parameters

##### options

[`CreateTenantOptions`](../interfaces/CreateTenantOptions.md)

#### Returns

`Promise`\<\{ \}\>

***

### deleteTenant()

> **deleteTenant**(`tenantId`, `userId`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.service.ts:197](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L197)

Delete tenant (soft delete)

#### Parameters

##### tenantId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### getMember()

> **getMember**(`tenantId`, `userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/tenant/tenant.service.ts:138](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L138)

Get tenant member

#### Parameters

##### tenantId

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getTenant()

> **getTenant**(`tenantId`): `Promise`\<\{ \}\>

Defined in: [src/modules/tenant/tenant.service.ts:108](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L108)

Get tenant by ID

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getTenantBySlug()

> **getTenantBySlug**(`slug`): `Promise`\<\{ \}\>

Defined in: [src/modules/tenant/tenant.service.ts:123](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L123)

Get tenant by slug

#### Parameters

##### slug

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getTenantMembers()

> **getTenantMembers**(`tenantId`, `userId`, `options?`): `Promise`\<\{ `members`: `object` & `object`[]; `total`: `number`; \}\>

Defined in: [src/modules/tenant/tenant.service.ts:248](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L248)

Get tenant members

#### Parameters

##### tenantId

`string`

##### userId

`string`

##### options?

###### limit?

`number`

###### offset?

`number`

###### role?

`TenantMemberRole`

#### Returns

`Promise`\<\{ `members`: `object` & `object`[]; `total`: `number`; \}\>

***

### getTenantStats()

> **getTenantStats**(`tenantId`, `userId`): `Promise`\<`any`\>

Defined in: [src/modules/tenant/tenant.service.ts:697](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L697)

Get tenant statistics

#### Parameters

##### tenantId

`string`

##### userId

`string`

#### Returns

`Promise`\<`any`\>

***

### getUserTenants()

> **getUserTenants**(`userId`): `Promise`\<`object`[]\>

Defined in: [src/modules/tenant/tenant.service.ts:224](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L224)

Get user's tenants

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`object`[]\>

***

### inviteMember()

> **inviteMember**(`tenantId`, `inviterId`, `options`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.service.ts:296](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L296)

Invite member to tenant

#### Parameters

##### tenantId

`string`

##### inviterId

`string`

##### options

[`InviteMemberOptions`](../interfaces/InviteMemberOptions.md)

#### Returns

`Promise`\<`void`\>

***

### leaveTenant()

> **leaveTenant**(`tenantId`, `userId`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.service.ts:556](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L556)

Leave tenant

#### Parameters

##### tenantId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### removeMember()

> **removeMember**(`tenantId`, `memberId`, `removedBy`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.service.ts:503](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L503)

Remove member from tenant

#### Parameters

##### tenantId

`string`

##### memberId

`string`

##### removedBy

`string`

#### Returns

`Promise`\<`void`\>

***

### transferOwnership()

> **transferOwnership**(`tenantId`, `currentOwnerId`, `newOwnerId`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.service.ts:596](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L596)

Transfer ownership

#### Parameters

##### tenantId

`string`

##### currentOwnerId

`string`

##### newOwnerId

`string`

#### Returns

`Promise`\<`void`\>

***

### updateMemberRole()

> **updateMemberRole**(`tenantId`, `memberId`, `newRole`, `updatedBy`): `Promise`\<`void`\>

Defined in: [src/modules/tenant/tenant.service.ts:441](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L441)

Update member role

#### Parameters

##### tenantId

`string`

##### memberId

`string`

##### newRole

`TenantMemberRole`

##### updatedBy

`string`

#### Returns

`Promise`\<`void`\>

***

### updateTenant()

> **updateTenant**(`tenantId`, `userId`, `options`): `Promise`\<\{ \}\>

Defined in: [src/modules/tenant/tenant.service.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L152)

Update tenant

#### Parameters

##### tenantId

`string`

##### userId

`string`

##### options

[`UpdateTenantOptions`](../interfaces/UpdateTenantOptions.md)

#### Returns

`Promise`\<\{ \}\>

## Properties

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/tenant/tenant.service.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L42)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/tenant/tenant.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.service.ts#L41)
