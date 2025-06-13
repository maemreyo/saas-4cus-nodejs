[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/user/user.service](../README.md) / UserService

# Class: UserService

Defined in: [src/modules/user/user.service.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L45)

## Constructors

### Constructor

> **new UserService**(`eventBus`, `auditService`): `UserService`

Defined in: [src/modules/user/user.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L46)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### auditService

[`AuditService`](../../../../shared/services/audit.service/classes/AuditService.md)

#### Returns

`UserService`

## Methods

### changePassword()

> **changePassword**(`userId`, `currentPassword`, `newPassword`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.service.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L152)

Change user password

#### Parameters

##### userId

`string`

##### currentPassword

`string`

##### newPassword

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteAccount()

> **deleteAccount**(`userId`, `password`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.service.ts:362](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L362)

Delete user account

#### Parameters

##### userId

`string`

##### password

`string`

#### Returns

`Promise`\<`void`\>

***

### getPublicProfile()

> **getPublicProfile**(`userId`): `Promise`\<`Partial`\<\{ \}\>\>

Defined in: [src/modules/user/user.service.ts:220](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L220)

Get public profile

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`Partial`\<\{ \}\>\>

***

### getUserActivity()

> **getUserActivity**(`userId`, `days`): `Promise`\<\{ `actions`: \{ `logs`: `object`[]; `summary`: `Record`\<`string`, `number`\>; `total`: `number`; \}; `apiUsage`: `PickEnumerable`\<`ApiUsageGroupByOutputType`, `"createdAt"`[]\> & `object`[]; `loginHistory`: `object`[]; \}\>

Defined in: [src/modules/user/user.service.ts:409](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L409)

Get user activity

#### Parameters

##### userId

`string`

##### days

`number` = `30`

#### Returns

`Promise`\<\{ `actions`: \{ `logs`: `object`[]; `summary`: `Record`\<`string`, `number`\>; `total`: `number`; \}; `apiUsage`: `PickEnumerable`\<`ApiUsageGroupByOutputType`, `"createdAt"`[]\> & `object`[]; `loginHistory`: `object`[]; \}\>

***

### getUserByEmail()

> **getUserByEmail**(`email`): `Promise`\<\{ \}\>

Defined in: [src/modules/user/user.service.ts:70](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L70)

Get user by email

#### Parameters

##### email

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getUserById()

> **getUserById**(`userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/user/user.service.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L55)

Get user by ID

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getUserByUsername()

> **getUserByUsername**(`username`): `Promise`\<\{ \}\>

Defined in: [src/modules/user/user.service.ts:79](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L79)

Get user by username

#### Parameters

##### username

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getUserSessions()

> **getUserSessions**(`userId`): `Promise`\<`object`[]\>

Defined in: [src/modules/user/user.service.ts:449](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L449)

Get user sessions

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`object`[]\>

***

### invalidateUserSessions()

> `private` **invalidateUserSessions**(`userId`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.service.ts:487](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L487)

Invalidate all user sessions

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### revokeSession()

> **revokeSession**(`userId`, `sessionId`): `Promise`\<`void`\>

Defined in: [src/modules/user/user.service.ts:462](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L462)

Revoke session

#### Parameters

##### userId

`string`

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

***

### searchUsers()

> **searchUsers**(`options`): `Promise`\<\{ `pagination`: \{ `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}; `users`: `object`[]; \}\>

Defined in: [src/modules/user/user.service.ts:247](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L247)

Search users

#### Parameters

##### options

[`SearchUsersOptions`](../interfaces/SearchUsersOptions.md)

#### Returns

`Promise`\<\{ `pagination`: \{ `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}; `users`: `object`[]; \}\>

***

### updatePreferences()

> **updatePreferences**(`userId`, `preferences`): `Promise`\<[`UserPreferences`](../interfaces/UserPreferences.md)\>

Defined in: [src/modules/user/user.service.ts:196](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L196)

Update user preferences

#### Parameters

##### userId

`string`

##### preferences

`Partial`\<[`UserPreferences`](../interfaces/UserPreferences.md)\>

#### Returns

`Promise`\<[`UserPreferences`](../interfaces/UserPreferences.md)\>

***

### updateProfile()

> **updateProfile**(`userId`, `options`): `Promise`\<\{ \}\>

Defined in: [src/modules/user/user.service.ts:89](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L89)

Update user profile

#### Parameters

##### userId

`string`

##### options

[`UpdateProfileOptions`](../interfaces/UpdateProfileOptions.md)

#### Returns

`Promise`\<\{ \}\>

***

### uploadAvatar()

> **uploadAvatar**(`userId`, `file`): `Promise`\<`string`\>

Defined in: [src/modules/user/user.service.ts:309](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L309)

Upload user avatar

#### Parameters

##### userId

`string`

##### file

`any`

#### Returns

`Promise`\<`string`\>

## Properties

### auditService

> `private` **auditService**: [`AuditService`](../../../../shared/services/audit.service/classes/AuditService.md)

Defined in: [src/modules/user/user.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L48)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/user/user.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.service.ts#L47)
