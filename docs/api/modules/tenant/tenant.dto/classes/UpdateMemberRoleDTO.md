[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/tenant/tenant.dto](../README.md) / UpdateMemberRoleDTO

# Class: UpdateMemberRoleDTO

Defined in: [src/modules/tenant/tenant.dto.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.dto.ts#L56)

## Constructors

### Constructor

> **new UpdateMemberRoleDTO**(): `UpdateMemberRoleDTO`

#### Returns

`UpdateMemberRoleDTO`

## Properties

### role

> **role**: `TenantMemberRole`

Defined in: [src/modules/tenant/tenant.dto.ts:61](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.dto.ts#L61)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `role`: `ZodNativeEnum`\<\{ \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `role?`: `"ADMIN"` \| `"OWNER"` \| `"MEMBER"` \| `"VIEWER"`; \}, \{ `role?`: `"ADMIN"` \| `"OWNER"` \| `"MEMBER"` \| `"VIEWER"`; \}\>

Defined in: [src/modules/tenant/tenant.dto.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.dto.ts#L57)
