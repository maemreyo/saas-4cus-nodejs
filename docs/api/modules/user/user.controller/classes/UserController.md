[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/user/user.controller](../README.md) / UserController

# Class: UserController

Defined in: [src/modules/user/user.controller.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L13)

## Constructors

### Constructor

> **new UserController**(`userService`): `UserController`

Defined in: [src/modules/user/user.controller.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L14)

#### Parameters

##### userService

[`UserService`](../../user.service/classes/UserService.md)

#### Returns

`UserController`

## Methods

### changePassword()

> **changePassword**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L66)

Change password

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`ChangePasswordDTO`](../../user.dto/classes/ChangePasswordDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteAccount()

> **deleteAccount**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:146](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L146)

Delete account

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `password`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getProfile()

> **getProfile**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L19)

Get current user profile

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserActivity()

> **getUserActivity**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:163](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L163)

Get user activity

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `days?`: `number`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserById()

> **getUserById**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:101](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L101)

Get user by ID (public profile)

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `userId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserSessions()

> **getUserSessions**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:178](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L178)

Get user sessions

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### revokeSession()

> **revokeSession**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:188](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L188)

Revoke session

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `sessionId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### searchUsers()

> **searchUsers**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:114](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L114)

Search users

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`SearchUsersDTO`](../../user.dto/classes/SearchUsersDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updatePreferences()

> **updatePreferences**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:83](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L83)

Update preferences

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdatePreferencesDTO`](../../user.dto/classes/UpdatePreferencesDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateProfile()

> **updateProfile**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.controller.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L48)

Update user profile

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdateProfileDTO`](../../user.dto/classes/UpdateProfileDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### uploadAvatar()

> **uploadAvatar**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/user/user.controller.ts:127](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L127)

Upload avatar

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

## Properties

### userService

> `private` **userService**: [`UserService`](../../user.service/classes/UserService.md)

Defined in: [src/modules/user/user.controller.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.controller.ts#L14)
