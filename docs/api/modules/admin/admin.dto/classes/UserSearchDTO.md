[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / UserSearchDTO

# Class: UserSearchDTO

Defined in: [src/modules/admin/admin.dto.ts:5](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/admin/admin.dto.ts#L5)

## Constructors

### Constructor

> **new UserSearchDTO**(): `UserSearchDTO`

#### Returns

`UserSearchDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `createdAfter`: `ZodOptional`\<`ZodString`\>; `createdBefore`: `ZodOptional`\<`ZodString`\>; `email`: `ZodOptional`\<`ZodString`\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `order`: `ZodDefault`\<`ZodEnum`\<\[`"asc"`, `"desc"`\]\>\>; `page`: `ZodDefault`\<`ZodNumber`\>; `query`: `ZodOptional`\<`ZodString`\>; `role`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `sort`: `ZodDefault`\<`ZodEnum`\<\[`"createdAt"`, `"lastLoginAt"`, `"loginCount"`\]\>\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `tenantId`: `ZodOptional`\<`ZodString`\>; `verified`: `ZodOptional`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `createdAfter?`: `string`; `createdBefore?`: `string`; `email?`: `string`; `limit?`: `number`; `order?`: `"asc"` \| `"desc"`; `page?`: `number`; `query?`: `string`; `role?`: `"USER"` \| `"ADMIN"` \| `"SUPER_ADMIN"`; `sort?`: `"createdAt"` \| `"lastLoginAt"` \| `"loginCount"`; `status?`: `"ACTIVE"` \| `"INACTIVE"` \| `"SUSPENDED"` \| `"DELETED"`; `tenantId?`: `string`; `verified?`: `boolean`; \}, \{ `createdAfter?`: `string`; `createdBefore?`: `string`; `email?`: `string`; `limit?`: `number`; `order?`: `"asc"` \| `"desc"`; `page?`: `number`; `query?`: `string`; `role?`: `"USER"` \| `"ADMIN"` \| `"SUPER_ADMIN"`; `sort?`: `"createdAt"` \| `"lastLoginAt"` \| `"loginCount"`; `status?`: `"ACTIVE"` \| `"INACTIVE"` \| `"SUSPENDED"` \| `"DELETED"`; `tenantId?`: `string`; `verified?`: `boolean`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:6](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/admin/admin.dto.ts#L6)
