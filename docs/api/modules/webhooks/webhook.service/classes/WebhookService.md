[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/webhooks/webhook.service](../README.md) / WebhookService

# Class: WebhookService

Defined in: [src/modules/webhooks/webhook.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L41)

## Constructors

### Constructor

> **new WebhookService**(`eventBus`): `WebhookService`

Defined in: [src/modules/webhooks/webhook.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L46)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`WebhookService`

## Methods

### createWebhook()

> **createWebhook**(`userId`, `tenantId`, `options`): `Promise`\<\{ \}\>

Defined in: [src/modules/webhooks/webhook.service.ts:91](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L91)

Create webhook endpoint

#### Parameters

##### userId

`string`

##### tenantId

`string`

##### options

[`CreateWebhookOptions`](../interfaces/CreateWebhookOptions.md)

#### Returns

`Promise`\<\{ \}\>

***

### deleteWebhook()

> **deleteWebhook**(`webhookId`, `userId`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.service.ts:182](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L182)

Delete webhook endpoint

#### Parameters

##### webhookId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### deliverWebhook()

> `private` **deliverWebhook**(`webhook`, `payload`): `Promise`\<[`WebhookDeliveryResult`](../interfaces/WebhookDeliveryResult.md)\>

Defined in: [src/modules/webhooks/webhook.service.ts:437](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L437)

Deliver webhook

#### Parameters

##### webhook

##### payload

[`WebhookPayload`](../interfaces/WebhookPayload.md)

#### Returns

`Promise`\<[`WebhookDeliveryResult`](../interfaces/WebhookDeliveryResult.md)\>

***

### generateSignature()

> `private` **generateSignature**(`secret`, `payload`): `string`

Defined in: [src/modules/webhooks/webhook.service.ts:500](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L500)

Generate webhook signature

#### Parameters

##### secret

`string`

##### payload

[`WebhookPayload`](../interfaces/WebhookPayload.md)

#### Returns

`string`

***

### getWebhook()

> **getWebhook**(`webhookId`, `userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/webhooks/webhook.service.ts:196](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L196)

Get webhook endpoint

#### Parameters

##### webhookId

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getWebhookEvents()

> **getWebhookEvents**(`webhookId`, `options?`): `Promise`\<\{ `events`: `object` & `object`[]; `total`: `number`; \}\>

Defined in: [src/modules/webhooks/webhook.service.ts:573](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L573)

Get webhook events

#### Parameters

##### webhookId

`string`

##### options?

###### limit?

`number`

###### offset?

`number`

###### status?

`WebhookDeliveryStatus`

#### Returns

`Promise`\<\{ `events`: `object` & `object`[]; `total`: `number`; \}\>

***

### getWebhookStats()

> **getWebhookStats**(`webhookId`): `Promise`\<\{ `failedDeliveries`: `number`; `recentDeliveries`: `object`[]; `successfulDeliveries`: `number`; `successRate`: `number`; `totalDeliveries`: `number`; \}\>

Defined in: [src/modules/webhooks/webhook.service.ts:538](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L538)

Get webhook statistics

#### Parameters

##### webhookId

`string`

#### Returns

`Promise`\<\{ `failedDeliveries`: `number`; `recentDeliveries`: `object`[]; `successfulDeliveries`: `number`; `successRate`: `number`; `totalDeliveries`: `number`; \}\>

***

### handleEvent()

> `private` **handleEvent**(`eventName`, `payload`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.service.ts:286](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L286)

Handle event for webhook delivery

#### Parameters

##### eventName

`string`

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### listWebhooks()

> **listWebhooks**(`userId`, `tenantId?`, `options?`): `Promise`\<\{ `total`: `number`; `webhooks`: `object`[]; \}\>

Defined in: [src/modules/webhooks/webhook.service.ts:215](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L215)

List webhook endpoints

#### Parameters

##### userId

`string`

##### tenantId?

`string`

##### options?

###### event?

`string`

###### limit?

`number`

###### offset?

`number`

#### Returns

`Promise`\<\{ `total`: `number`; `webhooks`: `object`[]; \}\>

***

### processWebhookDelivery()

> `private` **processWebhookDelivery**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.service.ts:323](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L323)

Process webhook delivery job

#### Parameters

##### job

`any`

#### Returns

`Promise`\<`void`\>

***

### processWebhookRetry()

> `private` **processWebhookRetry**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.service.ts:386](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L386)

Process webhook retry job

#### Parameters

##### job

`any`

#### Returns

`Promise`\<`void`\>

***

### registerQueueProcessors()

> `private` **registerQueueProcessors**(): `void`

Defined in: [src/modules/webhooks/webhook.service.ts:83](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L83)

Register queue processors

#### Returns

`void`

***

### replayDelivery()

> **replayDelivery**(`deliveryId`, `userId`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.service.ts:615](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L615)

Replay webhook delivery

#### Parameters

##### deliveryId

`string`

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### setupEventListeners()

> `private` **setupEventListeners**(): `void`

Defined in: [src/modules/webhooks/webhook.service.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L54)

Setup event listeners for webhook triggers

#### Returns

`void`

***

### testWebhook()

> **testWebhook**(`webhookId`, `userId`): `Promise`\<[`WebhookDeliveryResult`](../interfaces/WebhookDeliveryResult.md)\>

Defined in: [src/modules/webhooks/webhook.service.ts:250](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L250)

Test webhook endpoint

#### Parameters

##### webhookId

`string`

##### userId

`string`

#### Returns

`Promise`\<[`WebhookDeliveryResult`](../interfaces/WebhookDeliveryResult.md)\>

***

### trigger()

> **trigger**(`eventName`, `payload`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.service.ts:646](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L646)

Manually trigger a webhook event
This method allows other services to directly trigger webhook events
without going through the event bus

#### Parameters

##### eventName

`string`

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### updateWebhook()

> **updateWebhook**(`webhookId`, `userId`, `updates`): `Promise`\<\{ \}\>

Defined in: [src/modules/webhooks/webhook.service.ts:146](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L146)

Update webhook endpoint

#### Parameters

##### webhookId

`string`

##### userId

`string`

##### updates

`Partial`\<[`CreateWebhookOptions`](../interfaces/CreateWebhookOptions.md)\>

#### Returns

`Promise`\<\{ \}\>

***

### updateWebhookStats()

> `private` **updateWebhookStats**(`webhookId`, `success`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.service.ts:517](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L517)

Update webhook statistics

#### Parameters

##### webhookId

`string`

##### success

`boolean`

#### Returns

`Promise`\<`void`\>

***

### verifySignature()

> **verifySignature**(`secret`, `payload`, `signature`): `boolean`

Defined in: [src/modules/webhooks/webhook.service.ts:509](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L509)

Verify webhook signature

#### Parameters

##### secret

`string`

##### payload

`any`

##### signature

`string`

#### Returns

`boolean`

## Properties

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/webhooks/webhook.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L46)

***

### MAX\_RETRIES

> `private` `readonly` **MAX\_RETRIES**: `3` = `3`

Defined in: [src/modules/webhooks/webhook.service.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L42)

***

### RETRY\_DELAYS

> `private` `readonly` **RETRY\_DELAYS**: `number`[]

Defined in: [src/modules/webhooks/webhook.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L43)

***

### TIMEOUT

> `private` `readonly` **TIMEOUT**: `30000` = `30000`

Defined in: [src/modules/webhooks/webhook.service.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.service.ts#L44)
