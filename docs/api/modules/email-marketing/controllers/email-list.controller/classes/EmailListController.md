[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/controllers/email-list.controller](../README.md) / EmailListController

# Class: EmailListController

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L24)

## Constructors

### Constructor

> **new EmailListController**(`listService`): `EmailListController`

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L25)

#### Parameters

##### listService

[`EmailListService`](../../../services/email-list.service/classes/EmailListService.md)

#### Returns

`EmailListController`

## Methods

### cleanList()

> **cleanList**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:268](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L268)

Clean list (remove inactive, bounced, etc.)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `inactiveDays?`: `number`; `removeBounced?`: `boolean`; `removeInactive?`: `boolean`; `removeUnconfirmed?`: `boolean`; \}; `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createList()

> **createList**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L32)

Create email list

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `confirmationPageUrl?`: `string`; `customFields?`: `Record`\<`string`, `any`\>; `defaultFromEmail?`: `string`; `defaultFromName?`: `string`; `defaultReplyTo?`: `string`; `description?`: `string`; `doubleOptIn?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `welcomeEmailId?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteList()

> **deleteList**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:114](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L114)

Delete list

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### exportSubscribers()

> **exportSubscribers**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:320](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L320)

Export list subscribers

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; \}; `Querystring`: \{ `format?`: `"csv"` \| `"json"`; `status?`: `"subscribed"` \| `"all"` \| `"unsubscribed"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getList()

> **getList**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:72](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L72)

Get single list

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getListAnalytics()

> **getListAnalytics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:290](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L290)

Get list analytics

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; \}; `Querystring`: \{ `endDate?`: `string`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getLists()

> **getLists**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L52)

Get email lists

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `hasSubscribers?`: `boolean`; `limit?`: `number`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"subscriberCount"`; `sortOrder?`: `"asc"` \| `"desc"`; `status?`: `"ACTIVE"` \| `"INACTIVE"` \| `"DELETED"` \| `"ARCHIVED"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getListSubscribers()

> **getListSubscribers**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:131](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L131)

Get list subscribers

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; \}; `Querystring`: \{ `limit?`: `number`; `page?`: `number`; `search?`: `string`; `status?`: `"subscribed"` \| `"pending"` \| `"unsubscribed"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### importSubscribers()

> **importSubscribers**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:207](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L207)

Import subscribers

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `csvContent?`: `string`; `skipConfirmation?`: `boolean`; `subscribers?`: `object`[]; `tags?`: `string`[]; `updateExisting?`: `boolean`; \}; `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### removeSubscriber()

> **removeSubscriber**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:251](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L251)

Remove subscriber from list

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; `subscriberId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### subscribe()

> **subscribe**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:163](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L163)

Subscribe to list

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `customData?`: `Record`\<`string`, `any`\>; `email?`: `string`; `firstName?`: `string`; `ipAddress?`: `string`; `lastName?`: `string`; `tags?`: `string`[]; \}; `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### unsubscribe()

> **unsubscribe**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:185](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L185)

Unsubscribe from list

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `email?`: `string`; `feedback?`: `string`; `globalUnsubscribe?`: `boolean`; `listId?`: `string`; `reason?`: `string`; `tenantId?`: `string`; \}; `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateList()

> **updateList**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:92](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L92)

Update list

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `confirmationPageUrl?`: `string`; `customFields?`: `Record`\<`string`, `any`\>; `defaultFromEmail?`: `string`; `defaultFromName?`: `string`; `defaultReplyTo?`: `string`; `description?`: `string`; `doubleOptIn?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `status?`: `"ACTIVE"` \| `"INACTIVE"` \| `"DELETED"` \| `"ARCHIVED"`; `welcomeEmailId?`: `string`; \}; `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateSubscriber()

> **updateSubscriber**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:229](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L229)

Update subscriber

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `customData?`: `Record`\<`string`, `any`\>; `firstName?`: `string`; `lastName?`: `string`; `tags?`: `string`[]; \}; `Params`: \{ `listId`: `string`; `subscriberId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### listService

> `private` `readonly` **listService**: [`EmailListService`](../../../services/email-list.service/classes/EmailListService.md)

Defined in: [src/modules/email-marketing/controllers/email-list.controller.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-list.controller.ts#L26)
