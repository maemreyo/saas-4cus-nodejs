[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/ab-testing.service](../README.md) / ABTestingService

# Class: ABTestingService

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L47)

## Constructors

### Constructor

> **new ABTestingService**(`prisma`, `eventBus`, `redis`): `ABTestingService`

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L48)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

#### Returns

`ABTestingService`

## Methods

### assignRecipientsToVariants()

> **assignRecipientsToVariants**(`campaignId`, `recipientIds`, `testPercentage`): `Promise`\<`Map`\<`string`, `string`[]\>\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:112](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L112)

Assign recipients to variants

#### Parameters

##### campaignId

`string`

##### recipientIds

`string`[]

##### testPercentage

`number` = `100`

#### Returns

`Promise`\<`Map`\<`string`, `string`[]\>\>

***

### calculateConfidence()

> `private` **calculateConfidence**(`variantA`, `variantB`): `number`

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:477](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L477)

Calculate statistical confidence between two variants

#### Parameters

##### variantA

[`ABTestResults`](../interfaces/ABTestResults.md)

##### variantB

[`ABTestResults`](../interfaces/ABTestResults.md)

#### Returns

`number`

***

### calculateImprovement()

> `private` **calculateImprovement**(`results`): `number`

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:511](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L511)

Calculate improvement percentage

#### Parameters

##### results

[`ABTestResults`](../interfaces/ABTestResults.md)[]

#### Returns

`number`

***

### calculateResults()

> **calculateResults**(`campaignId`): `Promise`\<[`ABTestResults`](../interfaces/ABTestResults.md)[]\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:214](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L214)

Calculate A/B test results

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<[`ABTestResults`](../interfaces/ABTestResults.md)[]\>

***

### createABTest()

> **createABTest**(`tenantId`, `campaignId`, `data`): `Promise`\<`any`\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:543](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L543)

Create A/B test for a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

##### data

###### testDuration

`number`

###### testPercentage

`number`

###### variantB

\{ `content?`: `string`; `senderName?`: `string`; `subject?`: `string`; \}

###### variantB.content?

`string`

###### variantB.senderName?

`string`

###### variantB.subject?

`string`

###### winnerCriteria

`"conversion_rate"` \| `"open_rate"` \| `"click_rate"`

#### Returns

`Promise`\<`any`\>

***

### createVariants()

> **createVariants**(`campaignId`, `variants`): `Promise`\<`object`[]\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L57)

Create A/B test variants for a campaign

#### Parameters

##### campaignId

`string`

##### variants

`object`[]

#### Returns

`Promise`\<`object`[]\>

***

### determineWinner()

> **determineWinner**(`campaignId`, `config`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:289](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L289)

Determine and set winning variant

#### Parameters

##### campaignId

`string`

##### config

[`ABTestConfig`](../interfaces/ABTestConfig.md)

#### Returns

`Promise`\<\{ \}\>

***

### getABTestResults()

> **getABTestResults**(`tenantId`, `campaignId`): `Promise`\<\{ `completedAt?`: `Date`; `improvement?`: `number`; `results`: [`ABTestResults`](../interfaces/ABTestResults.md)[]; `startedAt?`: `Date`; `status`: `"completed"` \| `"pending"` \| `"running"`; `winningVariant?`: `string`; \}\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:648](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L648)

Get A/B test results for a campaign

#### Parameters

##### tenantId

`string`

##### campaignId

`string`

#### Returns

`Promise`\<\{ `completedAt?`: `Date`; `improvement?`: `number`; `results`: [`ABTestResults`](../interfaces/ABTestResults.md)[]; `startedAt?`: `Date`; `status`: `"completed"` \| `"pending"` \| `"running"`; `winningVariant?`: `string`; \}\>

***

### getRecipientVariant()

> **getRecipientVariant**(`campaignId`, `recipientId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:180](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L180)

Get variant for a recipient

#### Parameters

##### campaignId

`string`

##### recipientId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getTestSummary()

> **getTestSummary**(`campaignId`): `Promise`\<\{ `completedAt?`: `Date`; `improvement?`: `number`; `results`: [`ABTestResults`](../interfaces/ABTestResults.md)[]; `startedAt?`: `Date`; `status`: `"completed"` \| `"pending"` \| `"running"`; `winningVariant?`: `string`; \}\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:435](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L435)

Get A/B test summary

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<\{ `completedAt?`: `Date`; `improvement?`: `number`; `results`: [`ABTestResults`](../interfaces/ABTestResults.md)[]; `startedAt?`: `Date`; `status`: `"completed"` \| `"pending"` \| `"running"`; `winningVariant?`: `string`; \}\>

***

### getVariantMessage()

> **getVariantMessage**(`campaignId`, `variantId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:202](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L202)

Get campaign message for a variant

#### Parameters

##### campaignId

`string`

##### variantId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### sendToControlGroup()

> **sendToControlGroup**(`campaignId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:389](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L389)

Send to control group with winning variant

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<`void`\>

***

### shuffleArray()

> `private` **shuffleArray**\<`T`\>(`array`): `T`[]

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:531](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L531)

Shuffle array helper

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

#### Returns

`T`[]

## Properties

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L50)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L49)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L51)
