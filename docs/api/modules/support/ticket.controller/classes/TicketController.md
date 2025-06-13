[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.controller](../README.md) / TicketController

# Class: TicketController

Defined in: [src/modules/support/ticket.controller.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L20)

## Constructors

### Constructor

> **new TicketController**(`ticketService`, `categoryService`, `templateService`): `TicketController`

Defined in: [src/modules/support/ticket.controller.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L21)

#### Parameters

##### ticketService

[`TicketService`](../../ticket.service/classes/TicketService.md)

##### categoryService

[`CategoryService`](../../category.service/classes/CategoryService.md)

##### templateService

[`TemplateService`](../../template.service/classes/TemplateService.md)

#### Returns

`TicketController`

## Methods

### addMessage()

> **addMessage**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:143](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L143)

Add message to ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateMessageDTO`](../../ticket.dto/classes/CreateMessageDTO.md); `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### applyTemplate()

> **applyTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:420](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L420)

Apply template to new ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `templateId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### assignTicket()

> **assignTicket**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/support/ticket.controller.ts:187](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L187)

Assign ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`AssignTicketDTO`](../../ticket.dto/classes/AssignTicketDTO.md); `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### bulkUpdateTickets()

> **bulkUpdateTickets**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/support/ticket.controller.ts:346](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L346)

Bulk update tickets (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`BulkUpdateTicketsDTO`](../../ticket.dto/classes/BulkUpdateTicketsDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### closeTicket()

> **closeTicket**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:234](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L234)

Close ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createCategory()

> **createCategory**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/support/ticket.controller.ts:376](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L376)

Create category (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateCategoryDTO`](../../ticket.dto/classes/CreateCategoryDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### createTemplate()

> **createTemplate**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/support/ticket.controller.ts:403](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L403)

Create template (admin only)

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateTemplateDTO`](../../ticket.dto/classes/CreateTemplateDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### createTicket()

> **createTicket**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L30)

Create a new ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateTicketDTO`](../../ticket.dto/classes/CreateTicketDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCategories()

> **getCategories**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:368](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L368)

Get ticket categories

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getMessages()

> **getMessages**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:168](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L168)

Get ticket messages

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `ticketId`: `string`; \}; `Querystring`: \{ `includeInternal?`: `boolean`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTemplates()

> **getTemplates**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:395](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L395)

Get ticket templates

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTicket()

> **getTicket**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/support/ticket.controller.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L49)

Get ticket by ID

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### getTicketActivities()

> **getTicketActivities**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/support/ticket.controller.ts:319](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L319)

Get ticket activities

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `ticketId`: `string`; \}; `Querystring`: \{ `limit?`: `number`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### getTicketByNumber()

> **getTicketByNumber**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/support/ticket.controller.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L67)

Get ticket by number

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `number`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### getTicketStats()

> **getTicketStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:287](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L287)

Get ticket statistics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `assigneeId?`: `string`; `dateFrom?`: `string`; `dateTo?`: `string`; `tenantId?`: `string`; `userId?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### listTickets()

> **listTickets**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:108](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L108)

List tickets

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`ListTicketsDTO`](../../ticket.dto/classes/ListTicketsDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### rateTicket()

> **rateTicket**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:265](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L265)

Rate ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`RateTicketDTO`](../../ticket.dto/classes/RateTicketDTO.md); `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### reopenTicket()

> **reopenTicket**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:250](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L250)

Reopen ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### unassignTicket()

> **unassignTicket**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/support/ticket.controller.ts:214](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L214)

Unassign ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### updateTicket()

> **updateTicket**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.controller.ts:85](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L85)

Update ticket

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdateTicketDTO`](../../ticket.dto/classes/UpdateTicketDTO.md); `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### categoryService

> `private` **categoryService**: [`CategoryService`](../../category.service/classes/CategoryService.md)

Defined in: [src/modules/support/ticket.controller.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L23)

***

### templateService

> `private` **templateService**: [`TemplateService`](../../template.service/classes/TemplateService.md)

Defined in: [src/modules/support/ticket.controller.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L24)

***

### ticketService

> `private` **ticketService**: [`TicketService`](../../ticket.service/classes/TicketService.md)

Defined in: [src/modules/support/ticket.controller.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.controller.ts#L22)
