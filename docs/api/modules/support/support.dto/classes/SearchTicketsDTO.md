[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/support.dto](../README.md) / SearchTicketsDTO

# Class: SearchTicketsDTO

Defined in: [src/modules/support/support.dto.ts:209](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L209)

## Constructors

### Constructor

> **new SearchTicketsDTO**(): `SearchTicketsDTO`

#### Returns

`SearchTicketsDTO`

## Properties

### filters?

> `optional` **filters**: `any`

Defined in: [src/modules/support/support.dto.ts:225](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L225)

***

### limit?

> `optional` **limit**: `number`

Defined in: [src/modules/support/support.dto.ts:226](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L226)

***

### offset?

> `optional` **offset**: `number`

Defined in: [src/modules/support/support.dto.ts:227](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L227)

***

### query

> **query**: `string`

Defined in: [src/modules/support/support.dto.ts:224](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L224)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `filters`: `ZodOptional`\<`ZodObject`\<\{ `assignedToIds`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `categoryIds`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `priority`: `ZodOptional`\<`ZodArray`\<`ZodNativeEnum`\<\{ \}\>, `"many"`\>\>; `status`: `ZodOptional`\<`ZodArray`\<`ZodNativeEnum`\<\{ \}\>, `"many"`\>\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `type`: `ZodOptional`\<`ZodArray`\<`ZodNativeEnum`\<\{ \}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `assignedToIds?`: `string`[]; `categoryIds?`: `string`[]; `priority?`: (`"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`)[]; `status?`: (`"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`)[]; `tags?`: `string`[]; `type?`: (`"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`)[]; \}, \{ `assignedToIds?`: `string`[]; `categoryIds?`: `string`[]; `priority?`: (`"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`)[]; `status?`: (`"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`)[]; `tags?`: `string`[]; `type?`: (`"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`)[]; \}\>\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `offset`: `ZodDefault`\<`ZodNumber`\>; `query`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `filters?`: \{ `assignedToIds?`: `string`[]; `categoryIds?`: `string`[]; `priority?`: (`"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`)[]; `status?`: (`"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`)[]; `tags?`: `string`[]; `type?`: (`"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`)[]; \}; `limit?`: `number`; `offset?`: `number`; `query?`: `string`; \}, \{ `filters?`: \{ `assignedToIds?`: `string`[]; `categoryIds?`: `string`[]; `priority?`: (`"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"URGENT"` \| `"CRITICAL"`)[]; `status?`: (`"OPEN"` \| `"IN_PROGRESS"` \| `"WAITING_FOR_CUSTOMER"` \| `"WAITING_FOR_SUPPORT"` \| `"RESOLVED"` \| `"CLOSED"` \| `"CANCELLED"`)[]; `tags?`: `string`[]; `type?`: (`"GENERAL_INQUIRY"` \| `"TECHNICAL_ISSUE"` \| `"BUG_REPORT"` \| `"FEATURE_REQUEST"` \| `"BILLING_ISSUE"` \| `"ACCOUNT_ISSUE"` \| `"OTHER"`)[]; \}; `limit?`: `number`; `offset?`: `number`; `query?`: `string`; \}\>

Defined in: [src/modules/support/support.dto.ts:210](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/support.dto.ts#L210)
