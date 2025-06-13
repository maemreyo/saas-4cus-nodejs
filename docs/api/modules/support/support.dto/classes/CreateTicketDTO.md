[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / CreateTicketDTO

# Class: CreateTicketDTO

Defined in: [src/modules/support/support.dto.ts:5](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L5)

## Constructors

### Constructor

> **new CreateTicketDTO**(): `CreateTicketDTO`

#### Returns

`CreateTicketDTO`

## Properties

### attachmentIds?

> `optional` **attachmentIds**: `string`[]

Defined in: [src/modules/support/support.dto.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L21)

***

### categoryId?

> `optional` **categoryId**: `string`

Defined in: [src/modules/support/support.dto.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L20)

***

### description

> **description**: `string`

Defined in: [src/modules/support/support.dto.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L17)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [src/modules/support/support.dto.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L22)

***

### priority?

> `optional` **priority**: `TicketPriority`

Defined in: [src/modules/support/support.dto.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L19)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `attachmentIds`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `categoryId`: `ZodOptional`\<`ZodString`\>; `description`: `ZodString`; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `priority`: `ZodDefault`\<`ZodNativeEnum`\<\{ \}\>\>; `subject`: `ZodString`; `type`: `ZodDefault`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `attachmentIds?`: `string`[]; `categoryId?`: `string`; `description?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `subject?`: `string`; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}, \{ `attachmentIds?`: `string`[]; `categoryId?`: `string`; `description?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `subject?`: `string`; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}\>

Defined in: [src/modules/support/support.dto.ts:6](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L6)

***

### subject

> **subject**: `string`

Defined in: [src/modules/support/support.dto.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L16)

***

### type?

> `optional` **type**: `TicketType`

Defined in: [src/modules/support/support.dto.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L18)
