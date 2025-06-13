[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin-user.service](../README.md) / AdminUserService

# Class: AdminUserService

Defined in: [src/modules/admin/admin-user.service.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L45)

## Constructors

### Constructor

> **new AdminUserService**(`eventBus`, `emailService`, `auditService`): `AdminUserService`

Defined in: [src/modules/admin/admin-user.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L46)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

##### auditService

[`AuditService`](../../../../shared/services/audit.service/classes/AuditService.md)

#### Returns

`AdminUserService`

## Methods

### activateUser()

> **activateUser**(`adminId`, `userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/admin/admin-user.service.ts:429](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L429)

Activate user account

#### Parameters

##### adminId

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### bulkUserAction()

> **bulkUserAction**(`adminId`, `userIds`, `action`, `options?`): `Promise`\<\{ `failed`: `object`[]; `succeeded`: `string`[]; \}\>

Defined in: [src/modules/admin/admin-user.service.ts:299](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L299)

Bulk user actions

#### Parameters

##### adminId

`string`

##### userIds

`string`[]

##### action

`"delete"` | `"suspend"` | `"activate"` | `"verify_email"` | `"reset_password"`

##### options?

###### notifyUsers?

`boolean`

###### reason?

`string`

#### Returns

`Promise`\<\{ `failed`: `object`[]; `succeeded`: `string`[]; \}\>

***

### deleteUser()

> **deleteUser**(`adminId`, `userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/admin/admin-user.service.ts:462](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L462)

Delete user account (soft delete)

#### Parameters

##### adminId

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### exportUserData()

> **exportUserData**(`userId`): `Promise`\<\{ `exportedAt`: `Date`; `exportedBy`: `string`; `user`: \{ `_count`: \{ `auditLogs`: `number`; `files`: `number`; `notifications`: `number`; `projects`: `number`; \}; `apiUsage`: `object`[]; `authProviders`: `object`[]; `metrics`: \{ `activeSessions`: `number`; `apiUsageByEndpoint`: `Record`\<`string`, `number`\>; `totalApiCalls`: `number`; `totalRevenue`: `number`; \}; `sessions`: `object`[]; `subscriptions`: `object` & `object`[]; `tenantMembers`: `object` & `object`[]; `tickets`: `object`[]; \}; \}\>

Defined in: [src/modules/admin/admin-user.service.ts:711](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L711)

Export user data

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `exportedAt`: `Date`; `exportedBy`: `string`; `user`: \{ `_count`: \{ `auditLogs`: `number`; `files`: `number`; `notifications`: `number`; `projects`: `number`; \}; `apiUsage`: `object`[]; `authProviders`: `object`[]; `metrics`: \{ `activeSessions`: `number`; `apiUsageByEndpoint`: `Record`\<`string`, `number`\>; `totalApiCalls`: `number`; `totalRevenue`: `number`; \}; `sessions`: `object`[]; `subscriptions`: `object` & `object`[]; `tenantMembers`: `object` & `object`[]; `tickets`: `object`[]; \}; \}\>

***

### getUserActivity()

> **getUserActivity**(`userId`, `days`): `Promise`\<\{ `apiUsage`: `PickEnumerable`\<`ApiUsageGroupByOutputType`, (`"endpoint"` \| `"method"`)[]\> & `object`[]; `auditLogs`: `object`[]; `logins`: `object`[]; `tickets`: `object`[]; \}\>

Defined in: [src/modules/admin/admin-user.service.ts:640](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L640)

Get user activity timeline

#### Parameters

##### userId

`string`

##### days

`number` = `30`

#### Returns

`Promise`\<\{ `apiUsage`: `PickEnumerable`\<`ApiUsageGroupByOutputType`, (`"endpoint"` \| `"method"`)[]\> & `object`[]; `auditLogs`: `object`[]; `logins`: `object`[]; `tickets`: `object`[]; \}\>

***

### getUserDetails()

> **getUserDetails**(`userId`): `Promise`\<\{ `_count`: \{ `auditLogs`: `number`; `files`: `number`; `notifications`: `number`; `projects`: `number`; \}; `apiUsage`: `object`[]; `authProviders`: `object`[]; `metrics`: \{ `activeSessions`: `number`; `apiUsageByEndpoint`: `Record`\<`string`, `number`\>; `totalApiCalls`: `number`; `totalRevenue`: `number`; \}; `sessions`: `object`[]; `subscriptions`: `object` & `object`[]; `tenantMembers`: `object` & `object`[]; `tickets`: `object`[]; \}\>

Defined in: [src/modules/admin/admin-user.service.ts:136](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L136)

Get detailed user information

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `_count`: \{ `auditLogs`: `number`; `files`: `number`; `notifications`: `number`; `projects`: `number`; \}; `apiUsage`: `object`[]; `authProviders`: `object`[]; `metrics`: \{ `activeSessions`: `number`; `apiUsageByEndpoint`: `Record`\<`string`, `number`\>; `totalApiCalls`: `number`; `totalRevenue`: `number`; \}; `sessions`: `object`[]; `subscriptions`: `object` & `object`[]; `tenantMembers`: `object` & `object`[]; `tickets`: `object`[]; \}\>

***

### getUserStatistics()

> **getUserStatistics**(): `Promise`\<[`UserStatistics`](../interfaces/UserStatistics.md)\>

Defined in: [src/modules/admin/admin-user.service.ts:576](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L576)

Get user statistics

#### Returns

`Promise`\<[`UserStatistics`](../interfaces/UserStatistics.md)\>

***

### notifyBulkAction()

> `private` **notifyBulkAction**(`user`, `action`, `reason?`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin-user.service.ts:760](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L760)

Notify user about bulk action

#### Parameters

##### user

##### action

`string`

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### notifyUserStatusChange()

> `private` **notifyUserStatusChange**(`user`, `newStatus`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin-user.service.ts:727](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L727)

Notify user about status change

#### Parameters

##### user

##### newStatus

`UserStatus`

#### Returns

`Promise`\<`void`\>

***

### resetUserPassword()

> **resetUserPassword**(`adminId`, `userId`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [src/modules/admin/admin-user.service.ts:538](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L538)

Force reset user password

#### Parameters

##### adminId

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### searchUsers()

> **searchUsers**(`options`): `Promise`\<\{ `pagination`: \{ `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}; `users`: `object`[]; \}\>

Defined in: [src/modules/admin/admin-user.service.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L55)

Search and list users with advanced filters

#### Parameters

##### options

[`UserSearchOptions`](../interfaces/UserSearchOptions.md)

#### Returns

`Promise`\<\{ `pagination`: \{ `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}; `users`: `object`[]; \}\>

***

### suspendUser()

> **suspendUser**(`adminId`, `userId`, `reason?`): `Promise`\<\{ \}\>

Defined in: [src/modules/admin/admin-user.service.ts:385](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L385)

Suspend user account

#### Parameters

##### adminId

`string`

##### userId

`string`

##### reason?

`string`

#### Returns

`Promise`\<\{ \}\>

***

### updateUser()

> **updateUser**(`adminId`, `userId`, `updates`): `Promise`\<\{ \}\>

Defined in: [src/modules/admin/admin-user.service.ts:227](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L227)

Update user information

#### Parameters

##### adminId

`string`

##### userId

`string`

##### updates

###### displayName?

`string`

###### email?

`string`

###### emailVerified?

`boolean`

###### firstName?

`string`

###### lastName?

`string`

###### metadata?

`any`

###### role?

`UserRole`

###### status?

`UserStatus`

#### Returns

`Promise`\<\{ \}\>

***

### verifyUserEmail()

> **verifyUserEmail**(`adminId`, `userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/admin/admin-user.service.ts:515](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L515)

Force verify user email

#### Parameters

##### adminId

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

## Properties

### auditService

> `private` **auditService**: [`AuditService`](../../../../shared/services/audit.service/classes/AuditService.md)

Defined in: [src/modules/admin/admin-user.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L49)

***

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/admin/admin-user.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L48)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/admin/admin-user.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-user.service.ts#L47)
