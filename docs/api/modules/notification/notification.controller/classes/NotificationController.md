[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/notification/notification.controller](../README.md) / NotificationController

# Class: NotificationController

Defined in: [src/modules/notification/notification.controller.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L12)

## Constructors

### Constructor

> **new NotificationController**(`notificationService`): `NotificationController`

Defined in: [src/modules/notification/notification.controller.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L13)

#### Parameters

##### notificationService

[`NotificationService`](../../notification.service/classes/NotificationService.md)

#### Returns

`NotificationController`

## Methods

### createNotification()

> **createNotification**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L45)

Create notification (internal/admin use)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateNotificationDTO`](../../notification.dto/classes/CreateNotificationDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteNotification()

> **deleteNotification**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:102](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L102)

Delete notification

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `notificationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getNotifications()

> **getNotifications**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L18)

Get user notifications

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `limit?`: `number`; `offset?`: `number`; `type?`: `string`; `unreadOnly?`: `boolean`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getPreferences()

> **getPreferences**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:119](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L119)

Get notification preferences

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getStatistics()

> **getStatistics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:146](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L146)

Get notification statistics

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUnreadCount()

> **getUnreadCount**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:156](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L156)

Get unread count

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### markAsRead()

> **markAsRead**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:62](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L62)

Mark notification as read

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `notificationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### markMultipleAsRead()

> **markMultipleAsRead**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:79](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L79)

Mark multiple notifications as read

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`MarkNotificationsReadDTO`](../../notification.dto/classes/MarkNotificationsReadDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updatePreferences()

> **updatePreferences**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/notification/notification.controller.ts:129](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L129)

Update notification preferences

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdatePreferencesDTO`](../../notification.dto/classes/UpdatePreferencesDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### notificationService

> `private` **notificationService**: [`NotificationService`](../../notification.service/classes/NotificationService.md)

Defined in: [src/modules/notification/notification.controller.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.controller.ts#L13)
