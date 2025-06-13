[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / BulkContentActionDTO

# Class: BulkContentActionDTO

Defined in: [src/modules/admin/admin.dto.ts:129](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L129)

## Constructors

### Constructor

> **new BulkContentActionDTO**(): `BulkContentActionDTO`

#### Returns

`BulkContentActionDTO`

## Properties

### action

> **action**: `"delete"` \| `"flag"` \| `"approve"` \| `"reject"`

Defined in: [src/modules/admin/admin.dto.ts:140](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L140)

***

### items

> **items**: `object`[]

Defined in: [src/modules/admin/admin.dto.ts:139](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L139)

#### entityId

> **entityId**: `string`

#### entityType

> **entityType**: `string`

***

### reason?

> `optional` **reason**: `string`

Defined in: [src/modules/admin/admin.dto.ts:141](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L141)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `action`: `ZodEnum`\<\[`"approve"`, `"reject"`, `"flag"`, `"delete"`\]\>; `items`: `ZodArray`\<`ZodObject`\<\{ `entityId`: `ZodString`; `entityType`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `entityId?`: `string`; `entityType?`: `string`; \}, \{ `entityId?`: `string`; `entityType?`: `string`; \}\>, `"many"`\>; `reason`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `action?`: `"delete"` \| `"flag"` \| `"approve"` \| `"reject"`; `items?`: `object`[]; `reason?`: `string`; \}, \{ `action?`: `"delete"` \| `"flag"` \| `"approve"` \| `"reject"`; `items?`: `object`[]; `reason?`: `string`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:130](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L130)
