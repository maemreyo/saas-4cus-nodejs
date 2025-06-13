[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.controller](../README.md) / AuthController

# Class: AuthController

Defined in: [src/modules/auth/auth.controller.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L17)

## Constructors

### Constructor

> **new AuthController**(`authService`): `AuthController`

Defined in: [src/modules/auth/auth.controller.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L18)

#### Parameters

##### authService

[`AuthService`](../../auth.service/classes/AuthService.md)

#### Returns

`AuthController`

## Methods

### disable2FA()

> **disable2FA**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L154)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `password`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### enable2FA()

> **enable2FA**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:136](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L136)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### forgotPassword()

> **forgotPassword**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:88](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L88)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`ResetPasswordRequestDTO`](../../auth.dto/classes/ResetPasswordRequestDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCurrentUser()

> **getCurrentUser**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:114](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L114)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### googleAuth()

> **googleAuth**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:162](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L162)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### googleCallback()

> **googleCallback**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:167](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L167)

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `code`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### login()

> **login**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L38)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`LoginDTO`](../../auth.dto/classes/LoginDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:79](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L79)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### refreshToken()

> **refreshToken**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:69](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L69)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`RefreshTokenDTO`](../../auth.dto/classes/RefreshTokenDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### register()

> **register**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L20)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`RegisterDTO`](../../auth.dto/classes/RegisterDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### resetPassword()

> **resetPassword**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:97](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L97)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`ResetPasswordDTO`](../../auth.dto/classes/ResetPasswordDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### verify2FA()

> **verify2FA**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:145](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L145)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`Verify2FADTO`](../../auth.dto/classes/Verify2FADTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### verifyEmail()

> **verifyEmail**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.controller.ts:106](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L106)

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `token`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### authService

> `private` **authService**: [`AuthService`](../../auth.service/classes/AuthService.md)

Defined in: [src/modules/auth/auth.controller.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.controller.ts#L18)
