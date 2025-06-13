[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.dto](../README.md) / LoginDTO

# Class: LoginDTO

Defined in: [src/modules/auth/auth.dto.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L20)

## Constructors

### Constructor

> **new LoginDTO**(): `LoginDTO`

#### Returns

`LoginDTO`

## Properties

### email

> **email**: `string`

Defined in: [src/modules/auth/auth.dto.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L27)

***

### ip?

> `optional` **ip**: `string`

Defined in: [src/modules/auth/auth.dto.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L30)

***

### password

> **password**: `string`

Defined in: [src/modules/auth/auth.dto.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L28)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `email`: `ZodString`; `password`: `ZodString`; `twoFactorCode`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `password?`: `string`; `twoFactorCode?`: `string`; \}, \{ `email?`: `string`; `password?`: `string`; `twoFactorCode?`: `string`; \}\>

Defined in: [src/modules/auth/auth.dto.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L21)

***

### twoFactorCode?

> `optional` **twoFactorCode**: `string`

Defined in: [src/modules/auth/auth.dto.ts:29](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L29)
