[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/controllers/email-automation.controller](../README.md) / EmailAutomationController

# Class: EmailAutomationController

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L19)

## Constructors

### Constructor

> **new EmailAutomationController**(`automationService`): `EmailAutomationController`

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L20)

#### Parameters

##### automationService

[`EmailAutomationService`](../../../services/email-automation.service/classes/EmailAutomationService.md)

#### Returns

`EmailAutomationController`

## Methods

### activateAutomation()

> **activateAutomation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:124](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L124)

Activate automation

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `automationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### addAutomationStep()

> **addAutomationStep**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:164](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L164)

Add automation step

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `action?`: `"WEBHOOK"` \| `"SEND_EMAIL"` \| `"WAIT"` \| `"CONDITION"` \| `"TAG"` \| `"UNTAG"`; `actionConfig?`: `Record`\<`string`, `any`\>; `conditions?`: `object`[]; `delayAmount?`: `number`; `delayUnit?`: `"MINUTES"` \| `"HOURS"` \| `"DAYS"`; `htmlContent?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `order?`: `number`; `subject?`: `string`; `templateId?`: `string`; `textContent?`: `string`; \}; `Params`: \{ `automationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createAutomation()

> **createAutomation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L25)

Create automation

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `active?`: `boolean`; `description?`: `string`; `listId?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `trigger?`: `"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"`; `triggerConfig?`: `Record`\<`string`, `any`\>; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deactivateAutomation()

> **deactivateAutomation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:144](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L144)

Deactivate automation

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `automationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteAutomation()

> **deleteAutomation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:107](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L107)

Delete automation

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `automationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteAutomationStep()

> **deleteAutomationStep**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:208](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L208)

Delete automation step

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `automationId`: `string`; `stepId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### enrollSubscriber()

> **enrollSubscriber**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:225](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L225)

Enroll subscriber in automation

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `metadata?`: `Record`\<`string`, `any`\>; `subscriberId?`: `string`; \}; `Params`: \{ `automationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getAutomation()

> **getAutomation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L65)

Get single automation

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `automationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getAutomationAnalytics()

> **getAutomationAnalytics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:247](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L247)

Get automation analytics

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `automationId`: `string`; \}; `Querystring`: \{ `endDate?`: `string`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getAutomations()

> **getAutomations**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L45)

Get automations

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `active?`: `boolean`; `limit?`: `number`; `listId?`: `string`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"totalEnrolled"`; `sortOrder?`: `"asc"` \| `"desc"`; `trigger?`: `"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateAutomation()

> **updateAutomation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:85](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L85)

Update automation

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `active?`: `boolean`; `description?`: `string`; `listId?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `trigger?`: `"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"`; `triggerConfig?`: `Record`\<`string`, `any`\>; \}; `Params`: \{ `automationId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateAutomationStep()

> **updateAutomationStep**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:186](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L186)

Update automation step

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `action?`: `"WEBHOOK"` \| `"SEND_EMAIL"` \| `"WAIT"` \| `"CONDITION"` \| `"TAG"` \| `"UNTAG"`; `actionConfig?`: `Record`\<`string`, `any`\>; `conditions?`: `object`[]; `delayAmount?`: `number`; `delayUnit?`: `"MINUTES"` \| `"HOURS"` \| `"DAYS"`; `htmlContent?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `order?`: `number`; `subject?`: `string`; `templateId?`: `string`; `textContent?`: `string`; \}; `Params`: \{ `automationId`: `string`; `stepId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### automationService

> `private` `readonly` **automationService**: [`EmailAutomationService`](../../../services/email-automation.service/classes/EmailAutomationService.md)

Defined in: [src/modules/email-marketing/controllers/email-automation.controller.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-automation.controller.ts#L20)
