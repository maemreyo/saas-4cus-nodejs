[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/user/user.dto](../README.md) / SearchUsersDTO

# Class: SearchUsersDTO

Defined in: [src/modules/user/user.dto.ts:63](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L63)

## Constructors

### Constructor

> **new SearchUsersDTO**(): `SearchUsersDTO`

#### Returns

`SearchUsersDTO`

## Properties

### limit?

> `optional` **limit**: `number`

Defined in: [src/modules/user/user.dto.ts:78](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L78)

***

### page?

> `optional` **page**: `number`

Defined in: [src/modules/user/user.dto.ts:77](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L77)

***

### query?

> `optional` **query**: `string`

Defined in: [src/modules/user/user.dto.ts:73](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L73)

***

### role?

> `optional` **role**: `string`

Defined in: [src/modules/user/user.dto.ts:74](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L74)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `limit`: `ZodDefault`\<`ZodNumber`\>; `page`: `ZodDefault`\<`ZodNumber`\>; `query`: `ZodOptional`\<`ZodString`\>; `role`: `ZodOptional`\<`ZodEnum`\<\[`"USER"`, `"ADMIN"`, `"SUPER_ADMIN"`\]\>\>; `status`: `ZodOptional`\<`ZodEnum`\<\[`"ACTIVE"`, `"SUSPENDED"`, `"DELETED"`\]\>\>; `verified`: `ZodOptional`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `limit?`: `number`; `page?`: `number`; `query?`: `string`; `role?`: `"USER"` \| `"ADMIN"` \| `"SUPER_ADMIN"`; `status?`: `"ACTIVE"` \| `"SUSPENDED"` \| `"DELETED"`; `verified?`: `boolean`; \}, \{ `limit?`: `number`; `page?`: `number`; `query?`: `string`; `role?`: `"USER"` \| `"ADMIN"` \| `"SUPER_ADMIN"`; `status?`: `"ACTIVE"` \| `"SUSPENDED"` \| `"DELETED"`; `verified?`: `boolean`; \}\>

Defined in: [src/modules/user/user.dto.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L64)

***

### status?

> `optional` **status**: `string`

Defined in: [src/modules/user/user.dto.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L75)

***

### verified?

> `optional` **verified**: `boolean`

Defined in: [src/modules/user/user.dto.ts:76](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L76)
