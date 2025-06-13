[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.queue](../README.md) / TicketQueueProcessor

# Class: TicketQueueProcessor

Defined in: [src/modules/support/ticket.queue.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L12)

## Constructors

### Constructor

> **new TicketQueueProcessor**(`emailService`, `eventBus`): `TicketQueueProcessor`

Defined in: [src/modules/support/ticket.queue.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L13)

#### Parameters

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`TicketQueueProcessor`

## Methods

### autoCloseInactiveTickets()

> **autoCloseInactiveTickets**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:186](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L186)

Auto-close inactive tickets

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<`void`\>

***

### checkFirstResponseSLA()

> **checkFirstResponseSLA**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L43)

Check first response SLA

#### Parameters

##### job

`Job`\<\{ `ticketId`: `string`; `type`: `"warning"` \| `"breach"`; \}\>

#### Returns

`Promise`\<`void`\>

***

### checkResolutionSLA()

> **checkResolutionSLA**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:119](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L119)

Check resolution SLA

#### Parameters

##### job

`Job`\<\{ `ticketId`: `string`; `type`: `"warning"` \| `"breach"`; \}\>

#### Returns

`Promise`\<`void`\>

***

### escalateTicket()

> `private` **escalateTicket**(`ticketId`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:532](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L532)

Escalate ticket

#### Parameters

##### ticketId

`string`

#### Returns

`Promise`\<`void`\>

***

### getManagementEmails()

> `private` **getManagementEmails**(): `Promise`\<`string`[]\>

Defined in: [src/modules/support/ticket.queue.ts:597](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L597)

Get management emails

#### Returns

`Promise`\<`string`[]\>

***

### getSupportTeamEmails()

> `private` **getSupportTeamEmails**(`categoryId?`): `Promise`\<`string`[]\>

Defined in: [src/modules/support/ticket.queue.ts:580](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L580)

Get support team emails for category

#### Parameters

##### categoryId?

`string`

#### Returns

`Promise`\<`string`[]\>

***

### notifyTicketAssigned()

> **notifyTicketAssigned**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:359](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L359)

Notify ticket assigned

#### Parameters

##### job

`Job`\<\{ `assignedBy`: `string`; `assigneeId`: `string`; `ticketId`: `string`; \}\>

#### Returns

`Promise`\<`void`\>

***

### notifyTicketCreated()

> **notifyTicketCreated**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:305](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L305)

Notify ticket created

#### Parameters

##### job

`Job`\<\{ `ticketId`: `string`; `userId`: `string`; \}\>

#### Returns

`Promise`\<`void`\>

***

### notifyTicketMessageAdded()

> **notifyTicketMessageAdded**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:394](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L394)

Notify ticket message added

#### Parameters

##### job

`Job`\<\{ `messageId`: `string`; `ticketId`: `string`; `userId`: `string`; \}\>

#### Returns

`Promise`\<`void`\>

***

### registerProcessors()

> `private` **registerProcessors**(): `void`

Defined in: [src/modules/support/ticket.queue.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L20)

#### Returns

`void`

***

### sendSatisfactionSurvey()

> **sendSatisfactionSurvey**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:497](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L497)

Send satisfaction survey

#### Parameters

##### job

`Job`\<\{ `ticketId`: `string`; \}\>

#### Returns

`Promise`\<`void`\>

***

### sendTicketReminder()

> **sendTicketReminder**(`job`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.queue.ts:451](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L451)

Send ticket reminder

#### Parameters

##### job

`Job`\<\{ `reminderType`: `string`; `ticketId`: `string`; \}\>

#### Returns

`Promise`\<`void`\>

## Properties

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/support/ticket.queue.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L14)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/support/ticket.queue.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.queue.ts#L15)
