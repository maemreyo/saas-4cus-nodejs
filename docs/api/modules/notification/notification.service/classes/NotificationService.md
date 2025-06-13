[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/notification/notification.service](../README.md) / NotificationService

# Class: NotificationService

Defined in: [src/modules/notification/notification.service.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L44)

## Constructors

### Constructor

> **new NotificationService**(`eventBus`, `emailService`): `NotificationService`

Defined in: [src/modules/notification/notification.service.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L45)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

#### Returns

`NotificationService`

## Methods

### cleanupOldNotifications()

> **cleanupOldNotifications**(`daysToKeep`): `Promise`\<`number`\>

Defined in: [src/modules/notification/notification.service.ts:403](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L403)

Clean up old notifications

#### Parameters

##### daysToKeep

`number` = `30`

#### Returns

`Promise`\<`number`\>

***

### create()

> **create**(`options`): `Promise`\<\{ \}\>

Defined in: [src/modules/notification/notification.service.ts:53](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L53)

Create a notification

#### Parameters

##### options

[`CreateNotificationOptions`](../interfaces/CreateNotificationOptions.md)

#### Returns

`Promise`\<\{ \}\>

***

### deleteNotification()

> **deleteNotification**(`notificationId`, `userId`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.service.ts:246](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L246)

Delete notification

#### Parameters

##### notificationId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### getStatistics()

> **getStatistics**(`userId`): `Promise`\<\{ `byPriority`: `Record`\<`string`, `number`\>; `byType`: `Record`\<`string`, `number`\>; `lastWeek`: `number`; `total`: `number`; `unread`: `number`; \}\>

Defined in: [src/modules/notification/notification.service.ts:353](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L353)

Get notification statistics

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `byPriority`: `Record`\<`string`, `number`\>; `byType`: `Record`\<`string`, `number`\>; `lastWeek`: `number`; `total`: `number`; `unread`: `number`; \}\>

***

### getUserNotifications()

> **getUserNotifications**(`userId`, `options?`): `Promise`\<\{ `notifications`: `object`[]; `total`: `number`; `unread`: `number`; \}\>

Defined in: [src/modules/notification/notification.service.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L154)

Get user notifications

#### Parameters

##### userId

`string`

##### options?

###### limit?

`number`

###### offset?

`number`

###### type?

`string`

###### unreadOnly?

`boolean`

#### Returns

`Promise`\<\{ `notifications`: `object`[]; `total`: `number`; `unread`: `number`; \}\>

***

### getUserPreferences()

> **getUserPreferences**(`userId`): `Promise`\<[`NotificationPreferences`](../interfaces/NotificationPreferences.md)\>

Defined in: [src/modules/notification/notification.service.ts:269](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L269)

Get user notification preferences

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<[`NotificationPreferences`](../interfaces/NotificationPreferences.md)\>

***

### markAllAsRead()

> **markAllAsRead**(`userId`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.service.ts:230](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L230)

Mark all notifications as read

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### markAsRead()

> **markAsRead**(`notificationId`, `userId`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.service.ts:201](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L201)

Mark notification as read

#### Parameters

##### notificationId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### queueEmailNotification()

> `private` **queueEmailNotification**(`notification`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.service.ts:324](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L324)

Queue email notification

#### Parameters

##### notification

#### Returns

`Promise`\<`void`\>

***

### queuePushNotification()

> `private` **queuePushNotification**(`notification`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.service.ts:333](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L333)

Queue push notification

#### Parameters

##### notification

#### Returns

`Promise`\<`void`\>

***

### sendRealTimeNotification()

> `private` **sendRealTimeNotification**(`notification`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.service.ts:342](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L342)

Send real-time notification

#### Parameters

##### notification

#### Returns

`Promise`\<`void`\>

***

### updateUserPreferences()

> **updateUserPreferences**(`userId`, `preferences`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.service.ts:295](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L295)

Update user notification preferences

#### Parameters

##### userId

`string`

##### preferences

`Partial`\<[`NotificationPreferences`](../interfaces/NotificationPreferences.md)\>

#### Returns

`Promise`\<`void`\>

## Properties

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/notification/notification.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L47)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/notification/notification.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.service.ts#L46)
