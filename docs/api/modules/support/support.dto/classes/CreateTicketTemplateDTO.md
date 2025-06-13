[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / CreateTicketTemplateDTO

# Class: CreateTicketTemplateDTO

Defined in: [src/modules/support/support.dto.ts:139](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L139)

## Constructors

### Constructor

> **new CreateTicketTemplateDTO**(): `CreateTicketTemplateDTO`

#### Returns

`CreateTicketTemplateDTO`

## Properties

### categoryId?

> `optional` **categoryId**: `string`

Defined in: [src/modules/support/support.dto.ts:156](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L156)

***

### content

> **content**: `string`

Defined in: [src/modules/support/support.dto.ts:155](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L155)

***

### description?

> `optional` **description**: `string`

Defined in: [src/modules/support/support.dto.ts:153](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L153)

***

### name

> **name**: `string`

Defined in: [src/modules/support/support.dto.ts:151](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L151)

***

### priority?

> `optional` **priority**: `TicketPriority`

Defined in: [src/modules/support/support.dto.ts:158](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L158)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `categoryId`: `ZodOptional`\<`ZodString`\>; `content`: `ZodString`; `description`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `priority`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `slug`: `ZodString`; `subject`: `ZodString`; `type`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `categoryId?`: `string`; `content?`: `string`; `description?`: `string`; `name?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `slug?`: `string`; `subject?`: `string`; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}, \{ `categoryId?`: `string`; `content?`: `string`; `description?`: `string`; `name?`: `string`; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`; `slug?`: `string`; `subject?`: `string`; `type?`: `"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`; \}\>

Defined in: [src/modules/support/support.dto.ts:140](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L140)

***

### slug

> **slug**: `string`

Defined in: [src/modules/support/support.dto.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L152)

***

### subject

> **subject**: `string`

Defined in: [src/modules/support/support.dto.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L154)

***

### type?

> `optional` **type**: `TicketType`

Defined in: [src/modules/support/support.dto.ts:157](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L157)
