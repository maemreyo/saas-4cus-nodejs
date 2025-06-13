[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.service](../README.md) / TicketService

# Class: TicketService

Defined in: [src/modules/support/ticket.service.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L75)

## Constructors

### Constructor

> **new TicketService**(`eventBus`, `emailService`): `TicketService`

Defined in: [src/modules/support/ticket.service.ts:92](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L92)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

#### Returns

`TicketService`

## Methods

### addMessage()

> **addMessage**(`ticketId`, `userId`, `content`, `options?`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/ticket.service.ts:509](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L509)

Add message to ticket

#### Parameters

##### ticketId

`string`

##### userId

`string`

##### content

`string`

##### options?

###### attachments?

`string`[]

###### internal?

`boolean`

#### Returns

`Promise`\<\{ \}\>

***

### assignTicket()

> **assignTicket**(`ticketId`, `assigneeId`, `assignedBy`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/ticket.service.ts:445](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L445)

Assign ticket to agent

#### Parameters

##### ticketId

`string`

##### assigneeId

`string`

##### assignedBy

`string`

#### Returns

`Promise`\<\{ \}\>

***

### bulkUpdateTickets()

> **bulkUpdateTickets**(`ticketIds`, `updates`, `userId`): `Promise`\<`number`\>

Defined in: [src/modules/support/ticket.service.ts:930](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L930)

Bulk update tickets

#### Parameters

##### ticketIds

`string`[]

##### updates

###### assigneeId?

`string`

###### categoryId?

`string`

###### priority?

`TicketPriority`

###### status?

`TicketStatus`

###### tags?

`string`[]

##### userId

`string`

#### Returns

`Promise`\<`number`\>

***

### closeTicket()

> **closeTicket**(`ticketId`, `userId`, `isAgent`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/ticket.service.ts:691](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L691)

Close ticket

#### Parameters

##### ticketId

`string`

##### userId

`string`

##### isAgent

`boolean` = `false`

#### Returns

`Promise`\<\{ \}\>

***

### createActivity()

> `private` **createActivity**(`ticketId`, `userId`, `type`, `metadata?`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.service.ts:1030](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L1030)

Create ticket activity

#### Parameters

##### ticketId

`string`

##### userId

`string`

##### type

`TicketActivityType`

##### metadata?

`any`

#### Returns

`Promise`\<`void`\>

***

### createTicket()

> **createTicket**(`userId`, `options`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/ticket.service.ts:100](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L100)

Create a new ticket

#### Parameters

##### userId

`string`

##### options

[`CreateTicketOptions`](../interfaces/CreateTicketOptions.md)

#### Returns

`Promise`\<\{ \}\>

***

### detectPriority()

> `private` **detectPriority**(`text`): `TicketPriority`

Defined in: [src/modules/support/ticket.service.ts:1007](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L1007)

Detect priority based on keywords

#### Parameters

##### text

`string`

#### Returns

`TicketPriority`

***

### generateTicketNumber()

> `private` **generateTicketNumber**(): `Promise`\<`string`\>

Defined in: [src/modules/support/ticket.service.ts:987](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L987)

Generate unique ticket number

#### Returns

`Promise`\<`string`\>

***

### getTicket()

> **getTicket**(`ticketId`): `Promise`\<`object` & `object`\>

Defined in: [src/modules/support/ticket.service.ts:291](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L291)

Get ticket by ID

#### Parameters

##### ticketId

`string`

#### Returns

`Promise`\<`object` & `object`\>

***

### getTicketActivities()

> **getTicketActivities**(`ticketId`, `limit`): `Promise`\<`object`[]\>

Defined in: [src/modules/support/ticket.service.ts:906](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L906)

Get ticket activities

#### Parameters

##### ticketId

`string`

##### limit

`number` = `50`

#### Returns

`Promise`\<`object`[]\>

***

### getTicketByNumber()

> **getTicketByNumber**(`number`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/ticket.service.ts:330](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L330)

Get ticket by number

#### Parameters

##### number

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getTicketMessages()

> **getTicketMessages**(`ticketId`, `userId`, `includeInternal`): `Promise`\<`object`[]\>

Defined in: [src/modules/support/ticket.service.ts:635](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L635)

Get ticket messages

#### Parameters

##### ticketId

`string`

##### userId

`string`

##### includeInternal

`boolean` = `false`

#### Returns

`Promise`\<`object`[]\>

***

### getTicketStats()

> **getTicketStats**(`filters?`): `Promise`\<[`TicketStats`](../interfaces/TicketStats.md)\>

Defined in: [src/modules/support/ticket.service.ts:832](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L832)

Get ticket statistics

#### Parameters

##### filters?

###### assigneeId?

`string`

###### dateFrom?

`Date`

###### dateTo?

`Date`

###### tenantId?

`string`

###### userId?

`string`

#### Returns

`Promise`\<[`TicketStats`](../interfaces/TicketStats.md)\>

***

### listTickets()

> **listTickets**(`filters`, `pagination`): `Promise`\<\{ `page`: `number`; `tickets`: `object`[]; `total`: `number`; `totalPages`: `number`; \}\>

Defined in: [src/modules/support/ticket.service.ts:350](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L350)

List tickets

#### Parameters

##### filters

[`TicketFilters`](../interfaces/TicketFilters.md)

##### pagination

###### limit

`number`

###### order?

`"asc"` \| `"desc"`

###### page

`number`

###### sort?

`string`

#### Returns

`Promise`\<\{ `page`: `number`; `tickets`: `object`[]; `total`: `number`; `totalPages`: `number`; \}\>

***

### rateTicket()

> **rateTicket**(`ticketId`, `userId`, `rating`, `comment?`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/ticket.service.ts:784](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L784)

Rate ticket satisfaction

#### Parameters

##### ticketId

`string`

##### userId

`string`

##### rating

`number`

##### comment?

`string`

#### Returns

`Promise`\<\{ \}\>

***

### reopenTicket()

> **reopenTicket**(`ticketId`, `userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/ticket.service.ts:736](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L736)

Reopen ticket

#### Parameters

##### ticketId

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### scheduleSLAMonitoring()

> `private` **scheduleSLAMonitoring**(`ticketId`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.service.ts:1052](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L1052)

Schedule SLA monitoring

#### Parameters

##### ticketId

`string`

#### Returns

`Promise`\<`void`\>

***

### updateTicket()

> **updateTicket**(`ticketId`, `userId`, `updates`, `isAgent`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/ticket.service.ts:177](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L177)

Update ticket

#### Parameters

##### ticketId

`string`

##### userId

`string`

##### updates

[`UpdateTicketOptions`](../interfaces/UpdateTicketOptions.md)

##### isAgent

`boolean` = `false`

#### Returns

`Promise`\<\{ \}\>

## Properties

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/support/ticket.service.ts:94](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L94)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/support/ticket.service.ts:93](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L93)

***

### SLA\_FIRST\_RESPONSE\_MINUTES

> `private` `readonly` **SLA\_FIRST\_RESPONSE\_MINUTES**: `object`

Defined in: [src/modules/support/ticket.service.ts:76](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L76)

#### CRITICAL

> **CRITICAL**: `number` = `30`

#### HIGH

> **HIGH**: `number` = `120`

#### LOW

> **LOW**: `number` = `480`

#### MEDIUM

> **MEDIUM**: `number` = `240`

#### URGENT

> **URGENT**: `number` = `60`

***

### SLA\_RESOLUTION\_MINUTES

> `private` `readonly` **SLA\_RESOLUTION\_MINUTES**: `object`

Defined in: [src/modules/support/ticket.service.ts:84](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.service.ts#L84)

#### CRITICAL

> **CRITICAL**: `number` = `240`

#### HIGH

> **HIGH**: `number` = `1440`

#### LOW

> **LOW**: `number` = `5760`

#### MEDIUM

> **MEDIUM**: `number` = `2880`

#### URGENT

> **URGENT**: `number` = `480`
