[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.middleware](../README.md) / requireTicketModifyAccess

# Function: requireTicketModifyAccess()

> **requireTicketModifyAccess**(): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.middleware.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/ticket.middleware.ts#L68)

Middleware to check if user can modify ticket

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`\<\{ `Params`: \{ `ticketId`: `string`; \}; \}\>

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
