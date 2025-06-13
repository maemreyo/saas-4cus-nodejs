[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/webhooks/webhook.controller](../README.md) / WebhookController

# Class: WebhookController

Defined in: [src/modules/webhooks/webhook.controller.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L13)

## Constructors

### Constructor

> **new WebhookController**(`webhookService`): `WebhookController`

Defined in: [src/modules/webhooks/webhook.controller.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L14)

#### Parameters

##### webhookService

[`WebhookService`](../../webhook.service/classes/WebhookService.md)

#### Returns

`WebhookController`

## Methods

### createWebhook()

> **createWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L19)

Create webhook endpoint

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateWebhookDTO`](../../webhook.dto/classes/CreateWebhookDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteWebhook()

> **deleteWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:95](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L95)

Delete webhook endpoint

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `webhookId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getAvailableEvents()

> **getAvailableEvents**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:187](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L187)

Get available webhook events

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getWebhook()

> **getWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L58)

Get webhook endpoint

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `webhookId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getWebhookEvents()

> **getWebhookEvents**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:146](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L146)

Get webhook events/deliveries

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `webhookId`: `string`; \}; `Querystring`: [`GetWebhookEventsDTO`](../../webhook.dto/classes/GetWebhookEventsDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getWebhookStats()

> **getWebhookStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:128](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L128)

Get webhook statistics

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `webhookId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### listWebhooks()

> **listWebhooks**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L38)

List webhook endpoints

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`ListWebhooksDTO`](../../webhook.dto/classes/ListWebhooksDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### replayDelivery()

> **replayDelivery**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:172](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L172)

Replay webhook delivery

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `deliveryId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### testWebhook()

> **testWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:110](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L110)

Test webhook endpoint

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `webhookId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateWebhook()

> **updateWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/webhooks/webhook.controller.ts:73](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L73)

Update webhook endpoint

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdateWebhookDTO`](../../webhook.dto/classes/UpdateWebhookDTO.md); `Params`: \{ `webhookId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### webhookService

> `private` **webhookService**: [`WebhookService`](../../webhook.service/classes/WebhookService.md)

Defined in: [src/modules/webhooks/webhook.controller.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/webhooks/webhook.controller.ts#L14)
