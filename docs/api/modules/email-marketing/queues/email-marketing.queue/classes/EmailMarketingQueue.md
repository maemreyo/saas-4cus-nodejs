[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/queues/email-marketing.queue](../README.md) / EmailMarketingQueue

# Class: EmailMarketingQueue

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L55)

## Constructors

### Constructor

> **new EmailMarketingQueue**(`queue`, `prisma`, `delivery`, `campaigns`, `automations`, `analytics`, `abTesting`, `eventBus`): `EmailMarketingQueue`

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L56)

#### Parameters

##### queue

[`QueueService`](../../../../../shared/queue/queue.service/classes/QueueService.md)

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### delivery

[`EmailDeliveryService`](../../../services/email-delivery.service/classes/EmailDeliveryService.md)

##### campaigns

[`EmailCampaignService`](../../../services/email-campaign.service/classes/EmailCampaignService.md)

##### automations

[`EmailAutomationService`](../../../services/email-automation.service/classes/EmailAutomationService.md)

##### analytics

[`EmailAnalyticsService`](../../../services/email-analytics.service/classes/EmailAnalyticsService.md)

##### abTesting

[`ABTestingService`](../../../services/ab-testing.service/classes/ABTestingService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`EmailMarketingQueue`

## Methods

### calculateCampaignProgress()

> `private` **calculateCampaignProgress**(`campaignId`): `Promise`\<`number`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:392](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L392)

Calculate campaign progress

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<`number`\>

***

### checkABTestProgress()

> `private` **checkABTestProgress**(`campaign`): `Promise`\<`boolean`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:411](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L411)

Check if A/B test should determine winner

#### Parameters

##### campaign

`any`

#### Returns

`Promise`\<`boolean`\>

***

### determineABTestWinner()

> `private` **determineABTestWinner**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:331](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L331)

Determine A/B test winner

#### Parameters

##### job

`Job`\<[`ABTestWinnerJob`](../interfaces/ABTestWinnerJob.md)\>

#### Returns

`Promise`\<`void`\>

***

### finalizeCampaign()

> `private` **finalizeCampaign**(`campaignId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:369](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L369)

Finalize campaign

#### Parameters

##### campaignId

`string`

#### Returns

`Promise`\<`void`\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:70](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L70)

Initialize queue processors

#### Returns

`Promise`\<`void`\>

***

### processAutomationStep()

> `private` **processAutomationStep**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:252](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L252)

Process automation step

#### Parameters

##### job

`Job`\<[`AutomationStepJob`](../interfaces/AutomationStepJob.md)\>

#### Returns

`Promise`\<`void`\>

***

### processCampaign()

> `private` **processCampaign**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:144](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L144)

Process campaign (send emails in batches)

#### Parameters

##### job

`Job`\<[`CampaignProcessJob`](../interfaces/CampaignProcessJob.md)\>

#### Returns

`Promise`\<`void`\>

***

### processCampaignSend()

> `private` **processCampaignSend**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:110](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L110)

Process campaign send (initialize sending)

#### Parameters

##### job

`Job`\<[`CampaignSendJob`](../interfaces/CampaignSendJob.md)\>

#### Returns

`Promise`\<`void`\>

***

### processListCleanup()

> `private` **processListCleanup**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:300](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L300)

Process list cleanup

#### Parameters

##### job

`Job`\<[`ListCleanupJob`](../interfaces/ListCleanupJob.md)\>

#### Returns

`Promise`\<`void`\>

***

### setupRecurringJobs()

> `private` **setupRecurringJobs**(): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:444](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L444)

Setup recurring jobs

#### Returns

`Promise`\<`void`\>

***

### updateCampaignStats()

> `private` **updateCampaignStats**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:281](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L281)

Update campaign statistics

#### Parameters

##### job

`Job`\<[`CampaignStatsUpdateJob`](../interfaces/CampaignStatsUpdateJob.md)\>

#### Returns

`Promise`\<`void`\>

## Properties

### abTesting

> `private` `readonly` **abTesting**: [`ABTestingService`](../../../services/ab-testing.service/classes/ABTestingService.md)

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:63](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L63)

***

### analytics

> `private` `readonly` **analytics**: [`EmailAnalyticsService`](../../../services/email-analytics.service/classes/EmailAnalyticsService.md)

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:62](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L62)

***

### automations

> `private` `readonly` **automations**: [`EmailAutomationService`](../../../services/email-automation.service/classes/EmailAutomationService.md)

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:61](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L61)

***

### campaigns

> `private` `readonly` **campaigns**: [`EmailCampaignService`](../../../services/email-campaign.service/classes/EmailCampaignService.md)

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:60](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L60)

***

### delivery

> `private` `readonly` **delivery**: [`EmailDeliveryService`](../../../services/email-delivery.service/classes/EmailDeliveryService.md)

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L59)

***

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L64)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L58)

***

### queue

> `private` `readonly` **queue**: [`QueueService`](../../../../../shared/queue/queue.service/classes/QueueService.md)

Defined in: [src/modules/email-marketing/queues/email-marketing.queue.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/queues/email-marketing.queue.ts#L57)
