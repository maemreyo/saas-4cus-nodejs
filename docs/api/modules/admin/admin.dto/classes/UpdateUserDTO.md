[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / UpdateUserDTO

# Class: UpdateUserDTO

Defined in: [src/modules/admin/admin.dto.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L22)

## Constructors

### Constructor

> **new UpdateUserDTO**(): `UpdateUserDTO`

#### Returns

`UpdateUserDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `displayName`: `ZodOptional`\<`ZodString`\>; `email`: `ZodOptional`\<`ZodString`\>; `emailVerified`: `ZodOptional`\<`ZodBoolean`\>; `firstName`: `ZodOptional`\<`ZodString`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `role`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `displayName?`: `string`; `email?`: `string`; `emailVerified?`: `boolean`; `firstName?`: `string`; `lastName?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `role?`: `"USER"` \| `"ADMIN"` \| `"SUPER_ADMIN"`; `status?`: `"ACTIVE"` \| `"INACTIVE"` \| `"SUSPENDED"` \| `"DELETED"`; \}, \{ `displayName?`: `string`; `email?`: `string`; `emailVerified?`: `boolean`; `firstName?`: `string`; `lastName?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `role?`: `"USER"` \| `"ADMIN"` \| `"SUPER_ADMIN"`; `status?`: `"ACTIVE"` \| `"INACTIVE"` \| `"SUSPENDED"` \| `"DELETED"`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L23)
