[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/announcement.service](../README.md) / AnnouncementService

# Class: AnnouncementService

Defined in: [src/modules/admin/announcement.service.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L42)

## Constructors

### Constructor

> **new AnnouncementService**(`eventBus`, `notificationService`, `emailService`): `AnnouncementService`

Defined in: [src/modules/admin/announcement.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L46)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### notificationService

[`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

#### Returns

`AnnouncementService`

## Methods

### clearAnnouncementCache()

> `private` **clearAnnouncementCache**(): `Promise`\<`void`\>

Defined in: [src/modules/admin/announcement.service.ts:540](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L540)

#### Returns

`Promise`\<`void`\>

***

### create()

> **create**(`data`): `Promise`\<[`Announcement`](../interfaces/Announcement.md)\>

Defined in: [src/modules/admin/announcement.service.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L56)

Create a new announcement

#### Parameters

##### data

###### content

`string`

###### createdBy

`string`

###### ctaText?

`string`

###### ctaUrl?

`string`

###### dismissible?

`boolean`

###### endDate?

`Date`

###### priority?

`number`

###### sendEmail?

`boolean`

###### sendNotification?

`boolean`

###### startDate?

`Date`

###### targetAudience?

`"users"` \| `"all"` \| `"admins"` \| `"specific"`

###### targetTenantIds?

`string`[]

###### targetUserIds?

`string`[]

###### title

`string`

###### type

`"info"` \| `"critical"` \| `"warning"` \| `"maintenance"`

#### Returns

`Promise`\<[`Announcement`](../interfaces/Announcement.md)\>

***

### delete()

> **delete**(`announcementId`): `Promise`\<`void`\>

Defined in: [src/modules/admin/announcement.service.ts:290](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L290)

Delete announcement

#### Parameters

##### announcementId

`string`

#### Returns

`Promise`\<`void`\>

***

### dismiss()

> **dismiss**(`announcementId`, `userId`): `Promise`\<`void`\>

Defined in: [src/modules/admin/announcement.service.ts:327](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L327)

Dismiss announcement

#### Parameters

##### announcementId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### distributeAnnouncement()

> `private` **distributeAnnouncement**(`announcement`, `options?`): `Promise`\<`void`\>

Defined in: [src/modules/admin/announcement.service.ts:390](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L390)

Distribute announcement to users

#### Parameters

##### announcement

[`Announcement`](../interfaces/Announcement.md)

##### options?

###### sendEmail?

`boolean`

###### sendNotification?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### generateAnnouncementId()

> `private` **generateAnnouncementId**(): `string`

Defined in: [src/modules/admin/announcement.service.ts:494](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L494)

#### Returns

`string`

***

### getActive()

> **getActive**(): `Promise`\<[`Announcement`](../interfaces/Announcement.md)[]\>

Defined in: [src/modules/admin/announcement.service.ts:218](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L218)

Get all active announcements

#### Returns

`Promise`\<[`Announcement`](../interfaces/Announcement.md)[]\>

***

### getActiveForUser()

> **getActiveForUser**(`userId`, `options?`): `Promise`\<[`Announcement`](../interfaces/Announcement.md)[]\>

Defined in: [src/modules/admin/announcement.service.ts:136](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L136)

Get active announcements for a user

#### Parameters

##### userId

`string`

##### options?

###### includeDismissed?

`boolean`

###### includeViewed?

`boolean`

#### Returns

`Promise`\<[`Announcement`](../interfaces/Announcement.md)[]\>

***

### getColorByType()

> `private` **getColorByType**(`type`): `string`

Defined in: [src/modules/admin/announcement.service.ts:518](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L518)

#### Parameters

##### type

`string`

#### Returns

`string`

***

### getIconByType()

> `private` **getIconByType**(`type`): `string`

Defined in: [src/modules/admin/announcement.service.ts:508](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L508)

#### Parameters

##### type

`string`

#### Returns

`string`

***

### getPriorityByType()

> `private` **getPriorityByType**(`type`): `number`

Defined in: [src/modules/admin/announcement.service.ts:498](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L498)

#### Parameters

##### type

`string`

#### Returns

`number`

***

### getStatistics()

> **getStatistics**(`announcementId`): `Promise`\<\{ `ctaClicks`: `number`; `dismissals`: `number`; `totalViews`: `number`; `uniqueViews`: `number`; `viewsByDay`: `object`[]; \}\>

Defined in: [src/modules/admin/announcement.service.ts:348](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L348)

Get announcement statistics

#### Parameters

##### announcementId

`string`

#### Returns

`Promise`\<\{ `ctaClicks`: `number`; `dismissals`: `number`; `totalViews`: `number`; `uniqueViews`: `number`; `viewsByDay`: `object`[]; \}\>

***

### getTargetUsers()

> `private` **getTargetUsers**(`announcement`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/announcement.service.ts:447](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L447)

Get users targeted by announcement

#### Parameters

##### announcement

[`Announcement`](../interfaces/Announcement.md)

#### Returns

`Promise`\<`object`[]\>

***

### mapAnnouncementTypeToNotificationType()

> `private` **mapAnnouncementTypeToNotificationType**(`type`): `"CRITICAL"` \| `"SUCCESS"` \| `"INFO"` \| `"WARNING"` \| `"ERROR"` \| `"ALERT"`

Defined in: [src/modules/admin/announcement.service.ts:528](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L528)

#### Parameters

##### type

`string`

#### Returns

`"CRITICAL"` \| `"SUCCESS"` \| `"INFO"` \| `"WARNING"` \| `"ERROR"` \| `"ALERT"`

***

### markAsViewed()

> **markAsViewed**(`announcementId`, `userId`): `Promise`\<`void`\>

Defined in: [src/modules/admin/announcement.service.ts:308](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L308)

Mark announcement as viewed

#### Parameters

##### announcementId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### schedule()

> **schedule**(`announcement`, `scheduledFor`): `Promise`\<`void`\>

Defined in: [src/modules/admin/announcement.service.ts:369](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L369)

Schedule announcement

#### Parameters

##### announcement

`Partial`\<[`Announcement`](../interfaces/Announcement.md)\>

##### scheduledFor

`Date`

#### Returns

`Promise`\<`void`\>

***

### update()

> **update**(`announcementId`, `updates`): `Promise`\<[`Announcement`](../interfaces/Announcement.md)\>

Defined in: [src/modules/admin/announcement.service.ts:249](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L249)

Update announcement

#### Parameters

##### announcementId

`string`

##### updates

`Partial`\<[`Announcement`](../interfaces/Announcement.md)\>

#### Returns

`Promise`\<[`Announcement`](../interfaces/Announcement.md)\>

## Properties

### CACHE\_KEY

> `private` `readonly` **CACHE\_KEY**: `"announcements:active"` = `'announcements:active'`

Defined in: [src/modules/admin/announcement.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L43)

***

### CACHE\_TTL

> `private` `readonly` **CACHE\_TTL**: `300` = `300`

Defined in: [src/modules/admin/announcement.service.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L44)

***

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/admin/announcement.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L49)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/admin/announcement.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L47)

***

### notificationService

> `private` **notificationService**: [`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

Defined in: [src/modules/admin/announcement.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/announcement.service.ts#L48)
