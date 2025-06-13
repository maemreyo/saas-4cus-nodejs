[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / DataExportDTO

# Class: DataExportDTO

Defined in: [src/modules/admin/admin.dto.ts:233](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L233)

## Constructors

### Constructor

> **new DataExportDTO**(): `DataExportDTO`

#### Returns

`DataExportDTO`

## Properties

### async?

> `optional` **async**: `boolean`

Defined in: [src/modules/admin/admin.dto.ts:256](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L256)

***

### dateRange?

> `optional` **dateRange**: `object`

Defined in: [src/modules/admin/admin.dto.ts:248](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L248)

#### end

> **end**: `string`

#### start

> **start**: `string`

***

### entityType

> **entityType**: `"subscriptions"` \| `"tickets"` \| `"invoices"` \| `"users"` \| `"analytics"`

Defined in: [src/modules/admin/admin.dto.ts:245](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L245)

***

### fields?

> `optional` **fields**: `string`[]

Defined in: [src/modules/admin/admin.dto.ts:254](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L254)

***

### filters?

> `optional` **filters**: `Record`\<`string`, `any`\>

Defined in: [src/modules/admin/admin.dto.ts:247](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L247)

***

### format

> **format**: `"csv"` \| `"json"` \| `"xlsx"`

Defined in: [src/modules/admin/admin.dto.ts:246](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L246)

***

### includeRelations?

> `optional` **includeRelations**: `boolean`

Defined in: [src/modules/admin/admin.dto.ts:252](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L252)

***

### limit?

> `optional` **limit**: `number`

Defined in: [src/modules/admin/admin.dto.ts:255](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L255)

***

### recipientEmail?

> `optional` **recipientEmail**: `string`

Defined in: [src/modules/admin/admin.dto.ts:257](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L257)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `dateRange`: `ZodOptional`\<`ZodObject`\<\{ `end`: `ZodString`; `start`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `end?`: `string`; `start?`: `string`; \}, \{ `end?`: `string`; `start?`: `string`; \}\>\>; `entityType`: `ZodEnum`\<\[`"users"`, `"subscriptions"`, `"invoices"`, `"tickets"`, `"analytics"`\]\>; `filters`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `format`: `ZodEnum`\<\[`"csv"`, `"json"`, `"xlsx"`\]\>; `includeRelations`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `dateRange?`: \{ `end?`: `string`; `start?`: `string`; \}; `entityType?`: `"subscriptions"` \| `"tickets"` \| `"invoices"` \| `"users"` \| `"analytics"`; `filters?`: `Record`\<`string`, `any`\>; `format?`: `"csv"` \| `"json"` \| `"xlsx"`; `includeRelations?`: `boolean`; \}, \{ `dateRange?`: \{ `end?`: `string`; `start?`: `string`; \}; `entityType?`: `"subscriptions"` \| `"tickets"` \| `"invoices"` \| `"users"` \| `"analytics"`; `filters?`: `Record`\<`string`, `any`\>; `format?`: `"csv"` \| `"json"` \| `"xlsx"`; `includeRelations?`: `boolean`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:234](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L234)
