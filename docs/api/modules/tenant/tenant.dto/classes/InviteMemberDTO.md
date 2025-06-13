[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/tenant/tenant.dto](../README.md) / InviteMemberDTO

# Class: InviteMemberDTO

Defined in: [src/modules/tenant/tenant.dto.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.dto.ts#L44)

## Constructors

### Constructor

> **new InviteMemberDTO**(): `InviteMemberDTO`

#### Returns

`InviteMemberDTO`

## Properties

### email

> **email**: `string`

Defined in: [src/modules/tenant/tenant.dto.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.dto.ts#L51)

***

### role?

> `optional` **role**: `TenantMemberRole`

Defined in: [src/modules/tenant/tenant.dto.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.dto.ts#L52)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `email`: `ZodString`; `role`: `ZodDefault`\<`ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>\>; `sendEmail`: `ZodDefault`\<`ZodOptional`\<`ZodBoolean`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `role?`: `"ADMIN"` \| `"OWNER"` \| `"MEMBER"` \| `"VIEWER"`; `sendEmail?`: `boolean`; \}, \{ `email?`: `string`; `role?`: `"ADMIN"` \| `"OWNER"` \| `"MEMBER"` \| `"VIEWER"`; `sendEmail?`: `boolean`; \}\>

Defined in: [src/modules/tenant/tenant.dto.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.dto.ts#L45)

***

### sendEmail?

> `optional` **sendEmail**: `boolean`

Defined in: [src/modules/tenant/tenant.dto.ts:53](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/tenant/tenant.dto.ts#L53)
