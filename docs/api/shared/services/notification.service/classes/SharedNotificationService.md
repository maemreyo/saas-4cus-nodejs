[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/services/notification.service](../README.md) / SharedNotificationService

# Class: SharedNotificationService

Defined in: [src/shared/services/notification.service.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L28)

## Constructors

### Constructor

> **new SharedNotificationService**(): `SharedNotificationService`

#### Returns

`SharedNotificationService`

## Methods

### createNotificationRecord()

> `private` **createNotificationRecord**(`data`): `Promise`\<`void`\>

Defined in: [src/shared/services/notification.service.ts:168](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L168)

Create notification record in database

#### Parameters

##### data

[`NotificationData`](../interfaces/NotificationData.md)

#### Returns

`Promise`\<`void`\>

***

### getUnreadCount()

> **getUnreadCount**(`userId`): `Promise`\<`number`\>

Defined in: [src/shared/services/notification.service.ts:261](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L261)

Get unread notification count for a user

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`number`\>

***

### markAllAsRead()

> **markAllAsRead**(`userId`): `Promise`\<`void`\>

Defined in: [src/shared/services/notification.service.ts:232](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L232)

Mark all notifications as read for a user

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### markAsRead()

> **markAsRead**(`notificationId`, `userId`): `Promise`\<`void`\>

Defined in: [src/shared/services/notification.service.ts:202](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L202)

Mark notification as read

#### Parameters

##### notificationId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### send()

> **send**(`data`): `Promise`\<`void`\>

Defined in: [src/shared/services/notification.service.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L32)

Send notification to a specific user

#### Parameters

##### data

[`NotificationData`](../interfaces/NotificationData.md)

#### Returns

`Promise`\<`void`\>

***

### sendBulk()

> **sendBulk**(`userIds`, `data`): `Promise`\<`void`\>

Defined in: [src/shared/services/notification.service.ts:82](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L82)

Send notification to multiple users

#### Parameters

##### userIds

`string`[]

##### data

`Omit`\<[`NotificationData`](../interfaces/NotificationData.md), `"userId"`\>

#### Returns

`Promise`\<`void`\>

***

### sendToAdmins()

> **sendToAdmins**(`data`): `Promise`\<`void`\>

Defined in: [src/shared/services/notification.service.ts:93](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L93)

Send notification to all admin users

#### Parameters

##### data

[`AdminNotificationData`](../interfaces/AdminNotificationData.md)

#### Returns

`Promise`\<`void`\>

***

### sendToTenant()

> **sendToTenant**(`tenantId`, `data`, `filter?`): `Promise`\<`void`\>

Defined in: [src/shared/services/notification.service.ts:130](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L130)

Send notification to tenant members

#### Parameters

##### tenantId

`string`

##### data

`Omit`\<[`NotificationData`](../interfaces/NotificationData.md), `"userId"`\>

##### filter?

###### roles?

`string`[]

#### Returns

`Promise`\<`void`\>
