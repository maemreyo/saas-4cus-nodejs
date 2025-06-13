[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/tenant/tenant.context](../README.md) / TenantContextService

# Class: TenantContextService

Defined in: [src/modules/tenant/tenant.context.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L13)

## Constructors

### Constructor

> **new TenantContextService**(): `TenantContextService`

#### Returns

`TenantContextService`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/modules/tenant/tenant.context.ts:85](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L85)

Clear tenant context

#### Returns

`void`

***

### get()

> **get**(): [`TenantContext`](../interfaces/TenantContext.md)

Defined in: [src/modules/tenant/tenant.context.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L26)

Get current tenant context

#### Returns

[`TenantContext`](../interfaces/TenantContext.md)

***

### getTenantId()

> **getTenantId**(): `string`

Defined in: [src/modules/tenant/tenant.context.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L33)

Get current tenant ID

#### Returns

`string`

***

### require()

> **require**(): [`TenantContext`](../interfaces/TenantContext.md)

Defined in: [src/modules/tenant/tenant.context.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L40)

Require tenant context

#### Returns

[`TenantContext`](../interfaces/TenantContext.md)

***

### run()

> **run**\<`T`\>(`context`, `fn`): `T`

Defined in: [src/modules/tenant/tenant.context.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L19)

Run code with tenant context

#### Type Parameters

##### T

`T`

#### Parameters

##### context

[`TenantContext`](../interfaces/TenantContext.md)

##### fn

() => `T`

#### Returns

`T`

***

### setMemberRole()

> **setMemberRole**(`role`): `void`

Defined in: [src/modules/tenant/tenant.context.ts:69](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L69)

Set member role in tenant

#### Parameters

##### role

`string`

#### Returns

`void`

***

### setTenant()

> **setTenant**(`tenant`): `void`

Defined in: [src/modules/tenant/tenant.context.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L51)

Set tenant information

#### Parameters

##### tenant

###### id

`string`

###### name

`string`

###### slug

`string`

#### Returns

`void`

## Properties

### storage

> `private` **storage**: `AsyncLocalStorage`\<[`TenantContext`](../interfaces/TenantContext.md)\>

Defined in: [src/modules/tenant/tenant.context.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.context.ts#L14)
