[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-automation.service](../README.md) / EmailAutomationService

# Class: EmailAutomationService

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L34)

## Constructors

### Constructor

> **new EmailAutomationService**(`prisma`, `eventBus`, `redis`, `queue`, `deliveryService`): `EmailAutomationService`

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L35)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

##### queue

[`QueueService`](../../../../../shared/queue/queue.service/classes/QueueService.md)

##### deliveryService

[`EmailDeliveryService`](../../email-delivery.service/classes/EmailDeliveryService.md)

#### Returns

`EmailAutomationService`

## Methods

### activateAutomation()

> **activateAutomation**(`tenantId`, `automationId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:329](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L329)

Activate an automation

#### Parameters

##### tenantId

`string`

##### automationId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### addAutomationStep()

> **addAutomationStep**(`tenantId`, `automationId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:716](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L716)

Add a step to an automation

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### data

###### action?

`"WEBHOOK"` \| `"SEND_EMAIL"` \| `"WAIT"` \| `"CONDITION"` \| `"TAG"` \| `"UNTAG"` = `...`

###### actionConfig?

`Record`\<`string`, `any`\> = `...`

###### conditions?

`object`[] = `...`

###### delayAmount?

`number` = `...`

###### delayUnit?

`"MINUTES"` \| `"HOURS"` \| `"DAYS"` = `...`

###### htmlContent?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### order?

`number` = `...`

###### subject?

`string` = `...`

###### templateId?

`string` = `...`

###### textContent?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

***

### addStep()

> `private` **addStep**(`tenantId`, `automationId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:229](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L229)

Add a step to an automation

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### data

###### action?

`"WEBHOOK"` \| `"SEND_EMAIL"` \| `"WAIT"` \| `"CONDITION"` \| `"TAG"` \| `"UNTAG"` = `...`

###### actionConfig?

`Record`\<`string`, `any`\> = `...`

###### conditions?

`object`[] = `...`

###### delayAmount?

`number` = `...`

###### delayUnit?

`"MINUTES"` \| `"HOURS"` \| `"DAYS"` = `...`

###### htmlContent?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### order?

`number` = `...`

###### subject?

`string` = `...`

###### templateId?

`string` = `...`

###### textContent?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

***

### calculateDelay()

> `private` **calculateDelay**(`amount`, `unit`): `number`

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:642](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L642)

Calculate delay in milliseconds

#### Parameters

##### amount

`number`

##### unit

`string`

#### Returns

`number`

***

### cancelEnrollment()

> **cancelEnrollment**(`enrollmentId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:449](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L449)

Cancel an enrollment

#### Parameters

##### enrollmentId

`string`

#### Returns

`Promise`\<`void`\>

***

### completeEnrollment()

> `private` **completeEnrollment**(`enrollmentId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:1106](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L1106)

Complete an enrollment

#### Parameters

##### enrollmentId

`string`

#### Returns

`Promise`\<`void`\>

***

### createAutomation()

> **createAutomation**(`tenantId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L68)

Create a new automation workflow

#### Parameters

##### tenantId

`string`

##### data

###### active?

`boolean` = `...`

###### description?

`string` = `...`

###### listId?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### trigger?

`"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"` = `...`

###### triggerConfig?

`Record`\<`string`, `any`\> = `...`

#### Returns

`Promise`\<\{ \}\>

***

### deactivateAutomation()

> **deactivateAutomation**(`tenantId`, `automationId`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:359](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L359)

Deactivate an automation

#### Parameters

##### tenantId

`string`

##### automationId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### deleteAutomation()

> **deleteAutomation**(`tenantId`, `automationId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:677](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L677)

Delete an automation

#### Parameters

##### tenantId

`string`

##### automationId

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteAutomationStep()

> **deleteAutomationStep**(`tenantId`, `automationId`, `stepId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:739](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L739)

Delete an automation step

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### stepId

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteStep()

> `private` **deleteStep**(`tenantId`, `automationId`, `stepId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:302](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L302)

Delete an automation step

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### stepId

`string`

#### Returns

`Promise`\<`void`\>

***

### enrollSubscriber()

> **enrollSubscriber**(`automationId`, `subscriberId`, `metadata?`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:385](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L385)

Enroll a subscriber in an automation

#### Parameters

##### automationId

`string`

##### subscriberId

`string`

##### metadata?

`any`

#### Returns

`Promise`\<\{ \}\>

***

### enrollSubscriberWithTenant()

> **enrollSubscriberWithTenant**(`tenantId`, `automationId`, `subscriberId`, `metadata?`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:750](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L750)

Enroll a subscriber in an automation with tenant context

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### subscriberId

`string`

##### metadata?

`any`

#### Returns

`Promise`\<\{ \}\>

***

### evaluateConditions()

> `private` **evaluateConditions**(`data`, `conditions`): `Promise`\<`boolean`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:1058](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L1058)

Evaluate conditions for automation or step

#### Parameters

##### data

`any`

##### conditions

`any`

#### Returns

`Promise`\<`boolean`\>

***

### ~~evaluateConditionsForSubscriber()~~

> `private` **evaluateConditionsForSubscriber**(`subscriberId`, `conditions`): `Promise`\<`boolean`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:625](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L625)

Evaluate step conditions for a specific subscriber

#### Parameters

##### subscriberId

`string`

##### conditions

`any`[]

#### Returns

`Promise`\<`boolean`\>

#### Deprecated

Use the more general evaluateConditions(data, conditions) instead

***

### executeStep()

> **executeStep**(`enrollmentId`, `stepId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:549](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L549)

Execute an automation step

#### Parameters

##### enrollmentId

`string`

##### stepId

`string`

#### Returns

`Promise`\<`void`\>

***

### getAutomation()

> **getAutomation**(`tenantId`, `automationId`): `Promise`\<[`AutomationWithSteps`](../interfaces/AutomationWithSteps.md)\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:137](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L137)

Get automation with steps

#### Parameters

##### tenantId

`string`

##### automationId

`string`

#### Returns

`Promise`\<[`AutomationWithSteps`](../interfaces/AutomationWithSteps.md)\>

***

### getAutomationAnalytics()

> **getAutomationAnalytics**(`tenantId`, `automationId`, `startDate?`, `endDate?`): `Promise`\<\{ `overview`: \{ `active`: `number`; `averageTimeToComplete`: `number`; `cancelled`: `number`; `completed`: `number`; `completionRate`: `number`; `totalEnrolled`: `number`; \}; `performance`: \{ `averageClickRate`: `number`; `averageOpenRate`: `number`; `bottomPerformingStep`: `string`; `topPerformingStep`: `string`; \}; `steps`: `object`[]; `timeline`: `object`[]; \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:774](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L774)

Get automation analytics

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### startDate?

`Date`

##### endDate?

`Date`

#### Returns

`Promise`\<\{ `overview`: \{ `active`: `number`; `averageTimeToComplete`: `number`; `cancelled`: `number`; `completed`: `number`; `completionRate`: `number`; `totalEnrolled`: `number`; \}; `performance`: \{ `averageClickRate`: `number`; `averageOpenRate`: `number`; `bottomPerformingStep`: `string`; `topPerformingStep`: `string`; \}; `steps`: `object`[]; `timeline`: `object`[]; \}\>

***

### getAutomations()

> **getAutomations**(`tenantId`, `filters`): `Promise`\<\{ `automations`: [`AutomationWithSteps`](../interfaces/AutomationWithSteps.md)[]; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:662](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L662)

Get automations with pagination and filtering

#### Parameters

##### tenantId

`string`

##### filters

###### active?

`boolean` = `...`

###### limit?

`number` = `...`

###### listId?

`string` = `...`

###### page?

`number` = `...`

###### search?

`string` = `...`

###### sortBy?

`"name"` \| `"createdAt"` \| `"totalEnrolled"` = `...`

###### sortOrder?

`"asc"` \| `"desc"` = `...`

###### trigger?

`"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"` = `...`

#### Returns

`Promise`\<\{ `automations`: [`AutomationWithSteps`](../interfaces/AutomationWithSteps.md)[]; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

***

### handleTrigger()

> `private` **handleTrigger**(`trigger`, `data`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:991](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L991)

Handle automation trigger

#### Parameters

##### trigger

`EmailAutomationTrigger`

##### data

`any`

#### Returns

`Promise`\<`void`\>

***

### invalidateAutomationCache()

> `private` **invalidateAutomationCache**(`automationId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:655](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L655)

Invalidate automation cache

#### Parameters

##### automationId

`string`

#### Returns

`Promise`\<`void`\>

***

### listAutomations()

> **listAutomations**(`tenantId`, `filters`): `Promise`\<\{ `automations`: [`AutomationWithSteps`](../interfaces/AutomationWithSteps.md)[]; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:174](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L174)

List automations with filters

#### Parameters

##### tenantId

`string`

##### filters

###### active?

`boolean` = `...`

###### limit?

`number` = `...`

###### listId?

`string` = `...`

###### page?

`number` = `...`

###### search?

`string` = `...`

###### sortBy?

`"name"` \| `"createdAt"` \| `"totalEnrolled"` = `...`

###### sortOrder?

`"asc"` \| `"desc"` = `...`

###### trigger?

`"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"` = `...`

#### Returns

`Promise`\<\{ `automations`: [`AutomationWithSteps`](../interfaces/AutomationWithSteps.md)[]; `page`: `number`; `pages`: `number`; `total`: `number`; \}\>

***

### matchesTriggerConfig()

> `private` **matchesTriggerConfig**(`config`, `data`): `boolean`

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:607](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L607)

Check if data matches trigger configuration

#### Parameters

##### config

`any`

##### data

`any`

#### Returns

`boolean`

***

### processNextStep()

> **processNextStep**(`enrollmentId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:473](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L473)

Process the next step in an automation

#### Parameters

##### enrollmentId

`string`

#### Returns

`Promise`\<`void`\>

***

### scheduleDateBasedAutomation()

> `private` **scheduleDateBasedAutomation**(`automation`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:1086](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L1086)

Schedule date-based automation

#### Parameters

##### automation

[`AutomationWithSteps`](../interfaces/AutomationWithSteps.md)

#### Returns

`Promise`\<`void`\>

***

### setupEventListeners()

> `private` **setupEventListeners**(): `void`

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L48)

Setup event listeners for automation triggers

#### Returns

`void`

***

### updateAutomation()

> **updateAutomation**(`tenantId`, `automationId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:115](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L115)

Update an automation

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### data

###### active?

`boolean` = `...`

###### description?

`string` = `...`

###### listId?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### trigger?

`"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"` = `...`

###### triggerConfig?

`Record`\<`string`, `any`\> = `...`

#### Returns

`Promise`\<\{ \}\>

***

### updateAutomationStep()

> **updateAutomationStep**(`tenantId`, `automationId`, `stepId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:727](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L727)

Update an automation step

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### stepId

`string`

##### data

###### action?

`"WEBHOOK"` \| `"SEND_EMAIL"` \| `"WAIT"` \| `"CONDITION"` \| `"TAG"` \| `"UNTAG"` = `...`

###### actionConfig?

`Record`\<`string`, `any`\> = `...`

###### conditions?

`object`[] = `...`

###### delayAmount?

`number` = `...`

###### delayUnit?

`"MINUTES"` \| `"HOURS"` \| `"DAYS"` = `...`

###### htmlContent?

`string` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### order?

`number` = `...`

###### subject?

`string` = `...`

###### templateId?

`string` = `...`

###### textContent?

`string` = `...`

#### Returns

`Promise`\<\{ \}\>

***

### updateStep()

> `private` **updateStep**(`tenantId`, `automationId`, `stepId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:278](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L278)

Update an automation step

#### Parameters

##### tenantId

`string`

##### automationId

`string`

##### stepId

`string`

##### data

`Partial`\<[`CreateAutomationStepDTO`](../../../dto/email-automation.dto/type-aliases/CreateAutomationStepDTO.md)\>

#### Returns

`Promise`\<\{ \}\>

## Properties

### deliveryService

> `private` `readonly` **deliveryService**: [`EmailDeliveryService`](../../email-delivery.service/classes/EmailDeliveryService.md)

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L40)

***

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L37)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L36)

***

### queue

> `private` `readonly` **queue**: [`QueueService`](../../../../../shared/queue/queue.service/classes/QueueService.md)

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L39)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-automation.service.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-automation.service.ts#L38)
