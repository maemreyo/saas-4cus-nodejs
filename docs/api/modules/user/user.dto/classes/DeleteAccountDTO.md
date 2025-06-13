[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/user/user.dto](../README.md) / DeleteAccountDTO

# Class: DeleteAccountDTO

Defined in: [src/modules/user/user.dto.ts:81](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L81)

## Constructors

### Constructor

> **new DeleteAccountDTO**(): `DeleteAccountDTO`

#### Returns

`DeleteAccountDTO`

## Properties

### confirmation

> **confirmation**: `"DELETE"`

Defined in: [src/modules/user/user.dto.ts:88](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L88)

***

### password

> **password**: `string`

Defined in: [src/modules/user/user.dto.ts:87](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L87)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `confirmation`: `ZodLiteral`\<`"DELETE"`\>; `password`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `confirmation?`: `"DELETE"`; `password?`: `string`; \}, \{ `confirmation?`: `"DELETE"`; `password?`: `string`; \}\>

Defined in: [src/modules/user/user.dto.ts:82](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L82)
