[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-list.service](../README.md) / EmailListService

# Class: EmailListService

Defined in: [src/modules/email-marketing/services/email-list.service.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L23)

## Constructors

### Constructor

> **new EmailListService**(`prisma`, `eventBus`, `redis`, `emailService`): `EmailListService`

Defined in: [src/modules/email-marketing/services/email-list.service.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L24)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

##### emailService

[`EmailService`](../../../../../shared/services/email.service/classes/EmailService.md)

#### Returns

`EmailListService`

## Methods

### cleanList()

> **cleanList**(`tenantId`, `listId`, `options`): `Promise`\<\{ `archived`: `number`; `removed`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:467](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L467)

Clean list by removing inactive subscribers

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### options

###### inactiveDays?

`number`

###### removeBounced?

`boolean`

###### removeInactive?

`boolean`

###### removeUnconfirmed?

`boolean`

#### Returns

`Promise`\<\{ `archived`: `number`; `removed`: `number`; \}\>

***

### confirmSubscription()

> **confirmSubscription**(`token`): `Promise`\<\{ `list`: \{ \}; `subscriber`: \{ \}; \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:238](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L238)

Confirm subscription

#### Parameters

##### token

`string`

#### Returns

`Promise`\<\{ `list`: \{ \}; `subscriber`: \{ \}; \}\>

***

### createList()

> **createList**(`tenantId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L34)

Create a new email list

#### Parameters

##### tenantId

`string`

##### data

###### confirmationPageUrl?

`string` = `...`

###### customFields?

`Record`\<`string`, `any`\> = `...`

###### defaultFromEmail?

`string` = `...`

###### defaultFromName?

`string` = `...`

###### defaultReplyTo?

`string` = `...`

###### description?

`string` = `...`

###### doubleOptIn?

`boolean` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### welcomeEmailId?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

***

### deleteList()

> **deleteList**(`tenantId`, `listId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:707](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L707)

Delete an email list (soft delete)

#### Parameters

##### tenantId

`string`

##### listId

`string`

#### Returns

`Promise`\<`void`\>

***

### exportSubscribers()

> **exportSubscribers**(`tenantId`, `listId`, `options`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:1053](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L1053)

Export list subscribers

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### options

###### format?

`"csv"` \| `"json"`

###### status?

`"subscribed"` \| `"all"` \| `"unsubscribed"`

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### getList()

> **getList**(`tenantId`, `listId`): `Promise`\<`object` & `object`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:89](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L89)

Get email list with statistics

#### Parameters

##### tenantId

`string`

##### listId

`string`

#### Returns

`Promise`\<`object` & `object`\>

***

### getListAnalytics()

> **getListAnalytics**(`tenantId`, `listId`, `startDate?`, `endDate?`): `Promise`\<\{ `demographics?`: \{ `locations?`: `object`[]; `topDomains`: `object`[]; \}; `engagement`: \{ `averageClickRate`: `number`; `averageOpenRate`: `number`; `clicks`: `number`; `opens`: `number`; \}; `growth`: `object`[]; `sources`: `object`[]; \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:867](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L867)

Get list analytics

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### startDate?

`Date`

##### endDate?

`Date`

#### Returns

`Promise`\<\{ `demographics?`: \{ `locations?`: `object`[]; `topDomains`: `object`[]; \}; `engagement`: \{ `averageClickRate`: `number`; `averageOpenRate`: `number`; `clicks`: `number`; `opens`: `number`; \}; `growth`: `object`[]; `sources`: `object`[]; \}\>

***

### getLists()

> **getLists**(`tenantId`, `filters`): `Promise`\<\{ `items`: `object`[]; `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:635](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L635)

Get email lists with pagination and filtering

#### Parameters

##### tenantId

`string`

##### filters

###### limit?

`number`

###### page?

`number`

###### search?

`string`

###### sortBy?

`string`

###### sortOrder?

`"asc"` \| `"desc"`

###### status?

`EmailListStatus`

#### Returns

`Promise`\<\{ `items`: `object`[]; `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

***

### getListStats()

> **getListStats**(`listId`): `Promise`\<\{ `activeSubscribers`: `number`; `averageEngagementScore`: `number`; `growthRate`: `number`; `totalSubscribers`: `number`; `unconfirmedSubscribers`: `number`; `unsubscribed`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:120](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L120)

Get list statistics

#### Parameters

##### listId

`string`

#### Returns

`Promise`\<\{ `activeSubscribers`: `number`; `averageEngagementScore`: `number`; `growthRate`: `number`; `totalSubscribers`: `number`; `unconfirmedSubscribers`: `number`; `unsubscribed`: `number`; \}\>

***

### getListSubscribers()

> **getListSubscribers**(`tenantId`, `listId`, `options`): `Promise`\<\{ `items`: `object`[]; `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:744](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L744)

Get list subscribers with pagination and filtering

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### options

###### limit?

`number`

###### page?

`number`

###### search?

`string`

###### status?

`"subscribed"` \| `"pending"` \| `"unsubscribed"`

#### Returns

`Promise`\<\{ `items`: `object`[]; `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

***

### globalUnsubscribe()

> `private` **globalUnsubscribe**(`email`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:612](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L612)

Global unsubscribe from all lists

#### Parameters

##### email

`string`

#### Returns

`Promise`\<`void`\>

***

### importSubscribers()

> **importSubscribers**(`tenantId`, `listId`, `data`): `Promise`\<\{ `errors`: `object`[]; `failed`: `number`; `imported`: `number`; `updated`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:335](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L335)

Import subscribers in bulk

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### data

###### csvContent?

`string` = `...`

###### skipConfirmation?

`boolean` = `...`

###### subscribers?

`object`[] = `...`

###### tags?

`string`[] = `...`

###### updateExisting?

`boolean` = `...`

#### Returns

`Promise`\<\{ `errors`: `object`[]; `failed`: `number`; `imported`: `number`; `updated`: `number`; \}\>

***

### invalidateListCache()

> `private` **invalidateListCache**(`listId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:628](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L628)

Invalidate list cache

#### Parameters

##### listId

`string`

#### Returns

`Promise`\<`void`\>

***

### removeSubscriber()

> **removeSubscriber**(`tenantId`, `listId`, `subscriberId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:818](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L818)

Remove a subscriber from a list

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### subscriberId

`string`

#### Returns

`Promise`\<`void`\>

***

### resubscribe()

> `private` **resubscribe**(`subscriberId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:598](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L598)

Resubscribe a previously unsubscribed email

#### Parameters

##### subscriberId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### sendConfirmationEmail()

> `private` **sendConfirmationEmail**(`list`, `subscriber`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:566](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L566)

Send confirmation email

#### Parameters

##### list

##### subscriber

#### Returns

`Promise`\<`void`\>

***

### sendWelcomeEmail()

> `private` **sendWelcomeEmail**(`list`, `subscriber`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:586](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L586)

Send welcome email

#### Parameters

##### list

##### subscriber

#### Returns

`Promise`\<`void`\>

***

### subscribe()

> **subscribe**(`listId`, `data`, `source?`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:171](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L171)

Subscribe to a list

#### Parameters

##### listId

`string`

##### data

###### customData?

`Record`\<`string`, `any`\> = `...`

###### email?

`string` = `...`

###### firstName?

`string` = `...`

###### ipAddress?

`string` = `...`

###### lastName?

`string` = `...`

###### tags?

`string`[] = `...`

##### source?

`string`

#### Returns

`Promise`\<\{ \}\>

***

### subscribeWithTenant()

> **subscribeWithTenant**(`tenantId`, `listId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:1123](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L1123)

Subscribe to a list with tenant context

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### data

###### customData?

`Record`\<`string`, `any`\> = `...`

###### email?

`string` = `...`

###### firstName?

`string` = `...`

###### ipAddress?

`string` = `...`

###### lastName?

`string` = `...`

###### tags?

`string`[] = `...`

#### Returns

`Promise`\<\{ \}\>

***

### unsubscribe()

> **unsubscribe**(`data`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:284](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L284)

Unsubscribe from a list

#### Parameters

##### data

###### email?

`string` = `...`

###### feedback?

`string` = `...`

###### globalUnsubscribe?

`boolean` = `...`

###### listId?

`string` = `...`

###### reason?

`string` = `...`

###### tenantId?

`string` = `...`

#### Returns

`Promise`\<`void`\>

***

### unsubscribeWithTenant()

> **unsubscribeWithTenant**(`tenantId`, `listId`, `email`, `reason?`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:1143](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L1143)

Unsubscribe from a list with tenant context

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### email

`string`

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### updateList()

> **updateList**(`tenantId`, `listId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L66)

Update an email list

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### data

###### confirmationPageUrl?

`string` = `...`

###### customFields?

`Record`\<`string`, `any`\> = `...`

###### defaultFromEmail?

`string` = `...`

###### defaultFromName?

`string` = `...`

###### defaultReplyTo?

`string` = `...`

###### description?

`string` = `...`

###### doubleOptIn?

`boolean` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### status?

`"ACTIVE"` \| `"INACTIVE"` \| `"DELETED"` \| `"ARCHIVED"` = `...`

###### welcomeEmailId?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

***

### updateSubscriber()

> **updateSubscriber**(`subscriberId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:445](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L445)

Update subscriber data

#### Parameters

##### subscriberId

`string`

##### data

###### customData?

`Record`\<`string`, `any`\> = `...`

###### firstName?

`string` = `...`

###### lastName?

`string` = `...`

###### tags?

`string`[] = `...`

#### Returns

`Promise`\<\{ \}\>

***

### updateSubscriberWithTenant()

> **updateSubscriberWithTenant**(`tenantId`, `listId`, `subscriberId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-list.service.ts:1168](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L1168)

Update subscriber with tenant context

#### Parameters

##### tenantId

`string`

##### listId

`string`

##### subscriberId

`string`

##### data

###### customData?

`Record`\<`string`, `any`\> = `...`

###### firstName?

`string` = `...`

###### lastName?

`string` = `...`

###### tags?

`string`[] = `...`

#### Returns

`Promise`\<\{ \}\>

## Properties

### emailService

> `private` `readonly` **emailService**: [`EmailService`](../../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/email-marketing/services/email-list.service.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L28)

***

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/services/email-list.service.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L26)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-list.service.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L25)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-list.service.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-list.service.ts#L27)
