[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/user/user.dto](../README.md) / ChangePasswordDTO

# Class: ChangePasswordDTO

Defined in: [src/modules/user/user.dto.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/user/user.dto.ts#L26)

## Constructors

### Constructor

> **new ChangePasswordDTO**(): `ChangePasswordDTO`

#### Returns

`ChangePasswordDTO`

## Properties

### currentPassword

> **currentPassword**: `string`

Defined in: [src/modules/user/user.dto.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/user/user.dto.ts#L37)

***

### newPassword

> **newPassword**: `string`

Defined in: [src/modules/user/user.dto.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/user/user.dto.ts#L38)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `currentPassword`: `ZodString`; `newPassword`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `currentPassword?`: `string`; `newPassword?`: `string`; \}, \{ `currentPassword?`: `string`; `newPassword?`: `string`; \}\>

Defined in: [src/modules/user/user.dto.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/user/user.dto.ts#L27)
