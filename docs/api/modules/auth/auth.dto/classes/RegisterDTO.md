[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.dto](../README.md) / RegisterDTO

# Class: RegisterDTO

Defined in: [src/modules/auth/auth.dto.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L4)

## Constructors

### Constructor

> **new RegisterDTO**(): `RegisterDTO`

#### Returns

`RegisterDTO`

## Properties

### email

> **email**: `string`

Defined in: [src/modules/auth/auth.dto.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L13)

***

### firstName?

> `optional` **firstName**: `string`

Defined in: [src/modules/auth/auth.dto.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L15)

***

### lastName?

> `optional` **lastName**: `string`

Defined in: [src/modules/auth/auth.dto.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L16)

***

### password

> **password**: `string`

Defined in: [src/modules/auth/auth.dto.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L14)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `email`: `ZodString`; `firstName`: `ZodOptional`\<`ZodString`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `password`: `ZodString`; `username`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `firstName?`: `string`; `lastName?`: `string`; `password?`: `string`; `username?`: `string`; \}, \{ `email?`: `string`; `firstName?`: `string`; `lastName?`: `string`; `password?`: `string`; `username?`: `string`; \}\>

Defined in: [src/modules/auth/auth.dto.ts:5](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L5)

***

### username?

> `optional` **username**: `string`

Defined in: [src/modules/auth/auth.dto.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.dto.ts#L17)
