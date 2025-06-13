[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / AssignTicketDTO

# Class: AssignTicketDTO

Defined in: [src/modules/support/support.dto.ts:99](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L99)

## Constructors

### Constructor

> **new AssignTicketDTO**(): `AssignTicketDTO`

#### Returns

`AssignTicketDTO`

## Properties

### assignedToId

> **assignedToId**: `string`

Defined in: [src/modules/support/support.dto.ts:105](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L105)

***

### message?

> `optional` **message**: `string`

Defined in: [src/modules/support/support.dto.ts:106](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L106)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `assignedToId`: `ZodString`; `message`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `assignedToId?`: `string`; `message?`: `string`; \}, \{ `assignedToId?`: `string`; `message?`: `string`; \}\>

Defined in: [src/modules/support/support.dto.ts:100](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/support/support.dto.ts#L100)
