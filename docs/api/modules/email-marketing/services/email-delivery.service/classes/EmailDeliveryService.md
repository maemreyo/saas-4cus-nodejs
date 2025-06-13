[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-delivery.service](../README.md) / EmailDeliveryService

# Class: EmailDeliveryService

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L47)

## Constructors

### Constructor

> **new EmailDeliveryService**(`prisma`, `emailService`, `queue`, `tracking`, `templates`, `redis`): `EmailDeliveryService`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L54)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### emailService

[`EmailService`](../../../../../shared/services/email.service/classes/EmailService.md)

##### queue

[`QueueService`](../../../../../shared/queue/queue.service/classes/QueueService.md)

##### tracking

[`EmailTrackingService`](../../email-tracking.service/classes/EmailTrackingService.md)

##### templates

[`EmailTemplateService`](../../email-template.service/classes/EmailTemplateService.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

#### Returns

`EmailDeliveryService`

## Methods

### delay()

> `private` **delay**(`ms`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:553](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L553)

Delay helper

#### Parameters

##### ms

`number`

#### Returns

`Promise`\<`void`\>

***

### generatePreferencesUrl()

> `private` **generatePreferencesUrl**(`email`): `string`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:499](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L499)

Generate preferences URL

#### Parameters

##### email

`string`

#### Returns

`string`

***

### generateTextFromHtml()

> `private` **generateTextFromHtml**(`html`): `string`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:525](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L525)

Generate text content from HTML

#### Parameters

##### html

`string`

#### Returns

`string`

***

### generateUnsubscribeHeader()

> `private` **generateUnsubscribeHeader**(`listId`, `email`): `string`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:516](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L516)

Generate unsubscribe header

#### Parameters

##### listId

`string`

##### email

`string`

#### Returns

`string`

***

### generateUnsubscribeUrl()

> `private` **generateUnsubscribeUrl**(`listId`, `email`): `string`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:491](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L491)

Generate unsubscribe URL

#### Parameters

##### listId

`string`

##### email

`string`

#### Returns

`string`

***

### generateViewInBrowserUrl()

> `private` **generateViewInBrowserUrl**(`campaignId`, `subscriberId?`): `string`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:507](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L507)

Generate view in browser URL

#### Parameters

##### campaignId

`string`

##### subscriberId?

`string`

#### Returns

`string`

***

### getSubscriberData()

> `private` **getSubscriberData**(`subscriber`): `Record`\<`string`, `any`\>

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:476](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L476)

Get subscriber data for templates

#### Parameters

##### subscriber

#### Returns

`Record`\<`string`, `any`\>

***

### initializeTransporter()

> `private` **initializeTransporter**(): `void`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:70](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L70)

Initialize email transporter based on provider

#### Returns

`void`

***

### isRetryableError()

> `private` **isRetryableError**(`error`): `boolean`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:537](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L537)

Check if error is retryable

#### Parameters

##### error

`any`

#### Returns

`boolean`

***

### renderEmail()

> **renderEmail**(`campaign`, `subscriber?`): `Promise`\<[`EmailContent`](../interfaces/EmailContent.md)\>

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:388](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L388)

Render email content with personalization

#### Parameters

##### campaign

##### subscriber?

#### Returns

`Promise`\<[`EmailContent`](../interfaces/EmailContent.md)\>

***

### sendAutomationEmail()

> **sendAutomationEmail**(`step`, `subscriber`, `metadata?`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:317](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L317)

Send automation email

#### Parameters

##### step

`object` & `object`

##### subscriber

##### metadata?

`any`

#### Returns

`Promise`\<`void`\>

***

### sendCampaignBatch()

> **sendCampaignBatch**(`campaignId`, `recipientIds`, `options?`): `Promise`\<\{ `errors`: `object`[]; `failed`: `number`; `sent`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:145](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L145)

Send campaign emails in batches

#### Parameters

##### campaignId

`string`

##### recipientIds

`string`[]

##### options?

###### batchSize?

`number`

###### delayBetweenBatches?

`number`

#### Returns

`Promise`\<\{ `errors`: `object`[]; `failed`: `number`; `sent`: `number`; \}\>

***

### sendCampaignEmail()

> `private` **sendCampaignEmail**(`campaign`, `recipientId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:213](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L213)

Send a single campaign email

#### Parameters

##### campaign

##### recipientId

`string`

#### Returns

`Promise`\<`void`\>

***

### sendEmail()

> `private` **sendEmail**(`options`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:434](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L434)

Send email via transporter

#### Parameters

##### options

[`SendEmailOptions`](../interfaces/SendEmailOptions.md)

#### Returns

`Promise`\<`void`\>

***

### sendTestEmail()

> **sendTestEmail**(`campaign`, `recipientEmail`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:109](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L109)

Send a test email for a campaign

#### Parameters

##### campaign

##### recipientEmail

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### batchDelay

> `private` `readonly` **batchDelay**: `100` = `100`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L52)

***

### defaultFromEmail

> `private` `readonly` **defaultFromEmail**: `string`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L50)

***

### emailService

> `private` `readonly` **emailService**: [`EmailService`](../../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L56)

***

### maxRetries

> `private` `readonly` **maxRetries**: `3` = `3`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L51)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L55)

***

### queue

> `private` `readonly` **queue**: [`QueueService`](../../../../../shared/queue/queue.service/classes/QueueService.md)

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L57)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:60](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L60)

***

### sendingDomain

> `private` `readonly` **sendingDomain**: `string`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L49)

***

### templates

> `private` `readonly` **templates**: [`EmailTemplateService`](../../email-template.service/classes/EmailTemplateService.md)

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L59)

***

### tracking

> `private` `readonly` **tracking**: [`EmailTrackingService`](../../email-tracking.service/classes/EmailTrackingService.md)

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L58)

***

### transporter

> `private` **transporter**: `Transporter`

Defined in: [src/modules/email-marketing/services/email-delivery.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-delivery.service.ts#L48)
