[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/controllers/email-webhook.controller](../README.md) / EmailWebhookController

# Class: EmailWebhookController

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L43)

## Constructors

### Constructor

> **new EmailWebhookController**(`tracking`, `analytics`, `prisma`, `eventBus`): `EmailWebhookController`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L44)

#### Parameters

##### tracking

[`EmailTrackingService`](../../../services/email-tracking.service/classes/EmailTrackingService.md)

##### analytics

[`EmailAnalyticsService`](../../../services/email-analytics.service/classes/EmailAnalyticsService.md)

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`EmailWebhookController`

## Methods

### handleBounce()

> `private` **handleBounce**(`event`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:226](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L226)

Handle bounce events

#### Parameters

##### event

`any`

#### Returns

`Promise`\<`void`\>

***

### handleComplaint()

> `private` **handleComplaint**(`event`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:261](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L261)

Handle complaint/spam reports

#### Parameters

##### event

`any`

#### Returns

`Promise`\<`void`\>

***

### handleGenericWebhook()

> **handleGenericWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:190](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L190)

Generic webhook handler (for custom implementations)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: `any`; `Headers`: `any`; `Params`: \{ `provider`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### handleMailgunWebhook()

> **handleMailgunWebhook**(`data`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:389](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L389)

Handle Mailgun webhook

#### Parameters

##### data

`any`

#### Returns

`Promise`\<`void`\>

***

### handlePostmarkWebhook()

> **handlePostmarkWebhook**(`data`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:413](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L413)

Handle Postmark webhook

#### Parameters

##### data

`any`

#### Returns

`Promise`\<`void`\>

***

### handleSendGridWebhook()

> **handleSendGridWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L54)

SendGrid webhook handler

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`SendGridEvent`](../-internal-/interfaces/SendGridEvent.md)[]; `Headers`: \{ `x-twilio-email-event-webhook-signature`: `string`; `x-twilio-email-event-webhook-timestamp`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### handleSESBounce()

> `private` **handleSESBounce**(`message`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:340](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L340)

Handle SES bounce notification

#### Parameters

##### message

`any`

#### Returns

`Promise`\<`void`\>

***

### handleSESComplaint()

> `private` **handleSESComplaint**(`message`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:355](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L355)

Handle SES complaint notification

#### Parameters

##### message

`any`

#### Returns

`Promise`\<`void`\>

***

### handleSESDelivery()

> `private` **handleSESDelivery**(`message`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:369](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L369)

Handle SES delivery notification

#### Parameters

##### message

`any`

#### Returns

`Promise`\<`void`\>

***

### handleSESWebhook()

> **handleSESWebhook**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:139](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L139)

AWS SES webhook handler

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`SESNotification`](../-internal-/interfaces/SESNotification.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### handleUnsubscribe()

> `private` **handleUnsubscribe**(`event`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:296](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L296)

Handle unsubscribe events

#### Parameters

##### event

`any`

#### Returns

`Promise`\<`void`\>

***

### verifySendGridSignature()

> `private` **verifySendGridSignature**(`request`): `boolean`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:434](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L434)

Verify SendGrid webhook signature

#### Parameters

##### request

`FastifyRequest`

#### Returns

`boolean`

***

### verifySNSSignature()

> `private` **verifySNSSignature**(`notification`): `boolean`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:457](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L457)

Verify AWS SNS signature

#### Parameters

##### notification

[`SESNotification`](../-internal-/interfaces/SESNotification.md)

#### Returns

`boolean`

## Properties

### analytics

> `private` `readonly` **analytics**: [`EmailAnalyticsService`](../../../services/email-analytics.service/classes/EmailAnalyticsService.md)

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L46)

***

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L48)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L47)

***

### tracking

> `private` `readonly` **tracking**: [`EmailTrackingService`](../../../services/email-tracking.service/classes/EmailTrackingService.md)

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L45)
