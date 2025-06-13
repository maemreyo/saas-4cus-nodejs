[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.events.handlers](../README.md) / ApiUsageEventHandlers

# Class: ApiUsageEventHandlers

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L11)

## Constructors

### Constructor

> **new ApiUsageEventHandlers**(`emailService`, `webhookService`, `notificationService`): `ApiUsageEventHandlers`

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L12)

#### Parameters

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

##### webhookService

[`WebhookService`](../../../webhooks/webhook.service/classes/WebhookService.md)

##### notificationService

[`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

#### Returns

`ApiUsageEventHandlers`

## Methods

### handleApiHealthDegraded()

> **handleApiHealthDegraded**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:157](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L157)

#### Parameters

##### payload

###### issues

`string`[]

###### metrics

`any`

###### status

`string`

#### Returns

`Promise`\<`void`\>

***

### handleApiHealthRecovered()

> **handleApiHealthRecovered**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:237](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L237)

#### Parameters

##### payload

###### currentStatus

`string`

###### downtime

`number`

###### metrics

`any`

###### previousStatus

`string`

#### Returns

`Promise`\<`void`\>

***

### handleApiHealthUnhealthy()

> **handleApiHealthUnhealthy**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:187](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L187)

#### Parameters

##### payload

###### issues

`string`[]

###### metrics

`any`

###### status

`string`

#### Returns

`Promise`\<`void`\>

***

### handleApiUsageTracked()

> **handleApiUsageTracked**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:424](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L424)

#### Parameters

##### payload

###### endpoint

`string`

###### metadata?

`Record`\<`string`, `any`\>

###### method

`string`

###### responseTime

`number`

###### statusCode

`number`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleEndpointDown()

> **handleEndpointDown**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:440](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L440)

#### Parameters

##### payload

###### consecutiveFailures

`number`

###### endpoint

`string`

###### error?

`string`

###### lastChecked

`Date`

#### Returns

`Promise`\<`void`\>

***

### handleHighErrorRate()

> **handleHighErrorRate**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:84](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L84)

#### Parameters

##### payload

###### endpoint

`string`

###### errorRate

`number`

###### errors

`number`

###### timeWindow

`string`

###### total

`number`

#### Returns

`Promise`\<`void`\>

***

### handleQuotaExceeded()

> **handleQuotaExceeded**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L39)

#### Parameters

##### payload

###### limit

`number`

###### resetAt

`Date`

###### resource

`string`

###### used

`number`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleQuotaReset()

> **handleQuotaReset**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:399](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L399)

#### Parameters

##### payload

###### limit

`number`

###### resetDate

`Date`

###### resource

`string`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleQuotaWarning()

> **handleQuotaWarning**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:351](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L351)

#### Parameters

##### payload

###### limit

`number`

###### percentage

`number`

###### resource

`string`

###### used

`number`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleRateLimitExceeded()

> **handleRateLimitExceeded**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:313](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L313)

#### Parameters

##### payload

###### endpoint

`string`

###### limit

`number`

###### resetAt

`Date`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleRateLimitWarning()

> **handleRateLimitWarning**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L19)

#### Parameters

##### payload

###### endpoint

`string`

###### limit

`number`

###### percentage

`number`

###### used

`number`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleSlowResponseTime()

> **handleSlowResponseTime**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:121](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L121)

#### Parameters

##### payload

###### averageResponseTime

`number`

###### endpoint

`string`

###### p95ResponseTime

`number`

###### p99ResponseTime

`number`

###### timeWindow

`string`

#### Returns

`Promise`\<`void`\>

***

### handleUsageExported()

> **handleUsageExported**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:487](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L487)

#### Parameters

##### payload

###### exportType

`string`

###### fileUrl

`string`

###### format

`string`

###### period

`string`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleUsageLimitReached()

> **handleUsageLimitReached**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:578](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L578)

#### Parameters

##### payload

###### feature

`string`

###### limit

`number`

###### plan

`string`

###### tenantId?

`string`

###### upgradeOptions

`object`[]

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleUsageLimitWarning()

> **handleUsageLimitWarning**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:527](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L527)

#### Parameters

##### payload

###### feature

`string`

###### limit

`number`

###### percentage

`number`

###### plan

`string`

###### tenantId?

`string`

###### used

`number`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### handleUsageReportGenerated()

> **handleUsageReportGenerated**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:275](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L275)

#### Parameters

##### payload

###### fileUrl

`string`

###### period

`string`

###### reportType

`string`

###### userId

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L13)

***

### notificationService

> `private` **notificationService**: [`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L15)

***

### webhookService

> `private` **webhookService**: [`WebhookService`](../../../webhooks/webhook.service/classes/WebhookService.md)

Defined in: [src/modules/api-usage/api-usage.events.handlers.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.events.handlers.ts#L14)
