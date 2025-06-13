[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-segment.service](../README.md) / EmailSegmentService

# Class: EmailSegmentService

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L30)

## Constructors

### Constructor

> **new EmailSegmentService**(`prisma`, `eventBus`, `redis`): `EmailSegmentService`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L31)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

#### Returns

`EmailSegmentService`

## Methods

### buildArrayCondition()

> `private` **buildArrayCondition**(`field`, `operator`, `value`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:615](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L615)

Build array field conditions

#### Parameters

##### field

`string`

##### operator

`EmailSegmentOperator`

##### value

`any`

#### Returns

`EmailListSubscriberWhereInput`

***

### buildCampaignCondition()

> `private` **buildCampaignCondition**(`field`, `operator`, `value`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:437](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L437)

Build campaign interaction conditions

#### Parameters

##### field

`string`

##### operator

`EmailSegmentOperator`

##### value

`any`

#### Returns

`EmailListSubscriberWhereInput`

***

### buildConditionQuery()

> `private` **buildConditionQuery**(`condition`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:324](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L324)

Build query for a single condition

#### Parameters

##### condition

[`SegmentCondition`](../interfaces/SegmentCondition.md)

#### Returns

`EmailListSubscriberWhereInput`

***

### buildCustomDataCondition()

> `private` **buildCustomDataCondition**(`field`, `operator`, `value`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:478](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L478)

Build custom data conditions

#### Parameters

##### field

`string`

##### operator

`EmailSegmentOperator`

##### value

`any`

#### Returns

`EmailListSubscriberWhereInput`

***

### buildDateCondition()

> `private` **buildDateCondition**(`field`, `operator`, `value`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:579](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L579)

Build date field conditions

#### Parameters

##### field

`string`

##### operator

`EmailSegmentOperator`

##### value

`any`

#### Returns

`EmailListSubscriberWhereInput`

***

### buildEngagementCondition()

> `private` **buildEngagementCondition**(`field`, `operator`, `value`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:387](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L387)

Build engagement conditions

#### Parameters

##### field

`string`

##### operator

`EmailSegmentOperator`

##### value

`any`

#### Returns

`EmailListSubscriberWhereInput`

***

### buildGroupQuery()

> `private` **buildGroupQuery**(`group`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:307](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L307)

Build query for a condition group

#### Parameters

##### group

[`SegmentGroup`](../interfaces/SegmentGroup.md)

#### Returns

`EmailListSubscriberWhereInput`

***

### buildNumberCondition()

> `private` **buildNumberCondition**(`field`, `operator`, `value`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:551](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L551)

Build number field conditions

#### Parameters

##### field

`string`

##### operator

`EmailSegmentOperator`

##### value

`any`

#### Returns

`EmailListSubscriberWhereInput`

***

### buildSegmentQuery()

> `private` **buildSegmentQuery**(`listId`, `conditions`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:278](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L278)

Build Prisma query from segment conditions

#### Parameters

##### listId

`string`

##### conditions

[`SegmentConditions`](../interfaces/SegmentConditions.md)

#### Returns

`EmailListSubscriberWhereInput`

***

### buildStringCondition()

> `private` **buildStringCondition**(`field`, `operator`, `value`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:519](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L519)

Build string field conditions

#### Parameters

##### field

`string`

##### operator

`EmailSegmentOperator`

##### value

`any`

#### Returns

`EmailListSubscriberWhereInput`

***

### buildSubscriberCondition()

> `private` **buildSubscriberCondition**(`field`, `operator`, `value`): `EmailListSubscriberWhereInput`

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:352](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L352)

Build subscriber field conditions

#### Parameters

##### field

`string`

##### operator

`EmailSegmentOperator`

##### value

`any`

#### Returns

`EmailListSubscriberWhereInput`

***

### calculateSegmentSize()

> `private` **calculateSegmentSize**(`listId`, `conditions`): `Promise`\<`number`\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:642](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L642)

Calculate segment size

#### Parameters

##### listId

`string`

##### conditions

[`SegmentConditions`](../interfaces/SegmentConditions.md)

#### Returns

`Promise`\<`number`\>

***

### createSegment()

> **createSegment**(`listId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L40)

Create a new segment

#### Parameters

##### listId

`string`

##### data

###### conditions?

\{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \} = `...`

###### conditions.groups?

`object`[] = `...`

###### conditions.operator?

`"OR"` \| `"AND"` = `...`

###### description?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

***

### deleteSegment()

> **deleteSegment**(`segmentId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:249](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L249)

Delete a segment

#### Parameters

##### segmentId

`string`

#### Returns

`Promise`\<`void`\>

***

### getListSegments()

> **getListSegments**(`listId`): `Promise`\<`object`[]\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:142](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L142)

Get segments for a list

#### Parameters

##### listId

`string`

#### Returns

`Promise`\<`object`[]\>

***

### getSegment()

> **getSegment**(`segmentId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:115](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L115)

Get segment details

#### Parameters

##### segmentId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getSegmentSubscribers()

> **getSegmentSubscribers**(`segmentIds`): `Promise`\<`string`[]\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:179](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L179)

Get subscribers in a segment

#### Parameters

##### segmentIds

`string`[]

#### Returns

`Promise`\<`string`[]\>

***

### invalidateSegmentCache()

> `private` **invalidateSegmentCache**(`segmentId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:653](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L653)

Invalidate segment cache

#### Parameters

##### segmentId

`string`

#### Returns

`Promise`\<`void`\>

***

### refreshSegment()

> **refreshSegment**(`segmentId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:220](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L220)

Refresh segment subscriber count

#### Parameters

##### segmentId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### testSegment()

> **testSegment**(`listId`, `data`): `Promise`\<\{ `count`: `number`; `sample`: `any`[]; \}\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L152)

Test segment conditions

#### Parameters

##### listId

`string`

##### data

###### conditions?

\{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \} = `createSegmentSchema.shape.conditions`

###### conditions.groups?

`object`[] = `...`

###### conditions.operator?

`"OR"` \| `"AND"` = `...`

###### limit?

`number` = `...`

#### Returns

`Promise`\<\{ `count`: `number`; `sample`: `any`[]; \}\>

***

### updateSegment()

> **updateSegment**(`segmentId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:86](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L86)

Update a segment

#### Parameters

##### segmentId

`string`

##### data

###### conditions?

\{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \} = `...`

###### conditions.groups?

`object`[] = `...`

###### conditions.operator?

`"OR"` \| `"AND"` = `...`

###### description?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

## Properties

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L33)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L32)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-segment.service.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-segment.service.ts#L34)
