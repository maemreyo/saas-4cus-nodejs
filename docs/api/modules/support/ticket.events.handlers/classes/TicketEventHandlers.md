[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.events.handlers](../README.md) / TicketEventHandlers

# Class: TicketEventHandlers

Defined in: [src/modules/support/ticket.events.handlers.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L12)

## Constructors

### Constructor

> **new TicketEventHandlers**(`analyticsService`, `webhookService`): `TicketEventHandlers`

Defined in: [src/modules/support/ticket.events.handlers.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L13)

#### Parameters

##### analyticsService

[`AnalyticsService`](../../../analytics/analytics.service/classes/AnalyticsService.md)

##### webhookService

[`WebhookService`](../../../webhooks/webhook.service/classes/WebhookService.md)

#### Returns

`TicketEventHandlers`

## Methods

### createFollowUpTask()

> `private` **createFollowUpTask**(`ticketId`, `rating`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:292](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L292)

#### Parameters

##### ticketId

`string`

##### rating

`number`

#### Returns

`Promise`\<`void`\>

***

### escalateToManagement()

> `private` **escalateToManagement**(`ticket`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:276](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L276)

#### Parameters

##### ticket

`any`

#### Returns

`Promise`\<`void`\>

***

### handleSLABreached()

> **handleSLABreached**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:167](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L167)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleSLAWarning()

> **handleSLAWarning**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:141](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L141)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketAssigned()

> **handleTicketAssigned**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:95](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L95)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketAutoClosed()

> **handleTicketAutoClosed**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:222](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L222)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketClosed()

> **handleTicketClosed**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L55)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketCreated()

> **handleTicketCreated**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L19)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketEscalated()

> **handleTicketEscalated**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:208](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L208)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketMessageAdded()

> **handleTicketMessageAdded**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:113](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L113)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketRated()

> **handleTicketRated**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:185](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L185)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketReopened()

> **handleTicketReopened**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:87](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L87)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTicketUpdated()

> **handleTicketUpdated**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L37)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### updateAgentWorkloadMetrics()

> `private` **updateAgentWorkloadMetrics**(`agentId`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:236](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L236)

#### Parameters

##### agentId

`string`

#### Returns

`Promise`\<`void`\>

***

### updateSatisfactionMetrics()

> `private` **updateSatisfactionMetrics**(`rating`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:268](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L268)

#### Parameters

##### rating

`number`

#### Returns

`Promise`\<`void`\>

***

### updateSLAMetrics()

> `private` **updateSLAMetrics**(`ticketId`, `slaType`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.events.handlers.ts:260](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L260)

#### Parameters

##### ticketId

`string`

##### slaType

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### analyticsService

> `private` **analyticsService**: [`AnalyticsService`](../../../analytics/analytics.service/classes/AnalyticsService.md)

Defined in: [src/modules/support/ticket.events.handlers.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L14)

***

### webhookService

> `private` **webhookService**: [`WebhookService`](../../../webhooks/webhook.service/classes/WebhookService.md)

Defined in: [src/modules/support/ticket.events.handlers.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.events.handlers.ts#L15)
