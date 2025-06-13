[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/ticket.middleware](../README.md) / requireTicketAccess

# Function: requireTicketAccess()

> **requireTicketAccess**(): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/support/ticket.middleware.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/ticket.middleware.ts#L11)

Middleware to verify ticket access

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`\<\{ `Params`: \{ `ticketId`: `string`; \}; \}\>

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
