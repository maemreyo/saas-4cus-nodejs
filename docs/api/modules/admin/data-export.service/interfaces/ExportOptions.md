[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/data-export.service](../README.md) / ExportOptions

# Interface: ExportOptions

Defined in: [src/modules/admin/data-export.service.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L12)

## Properties

### async?

> `optional` **async**: `boolean`

Defined in: [src/modules/admin/data-export.service.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L23)

***

### dateRange?

> `optional` **dateRange**: `object`

Defined in: [src/modules/admin/data-export.service.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L16)

#### end

> **end**: `string`

#### start

> **start**: `string`

***

### entityType

> **entityType**: `"subscriptions"` \| `"projects"` \| `"tickets"` \| `"invoices"` \| `"users"` \| `"tenants"` \| `"analytics"` \| `"audit_logs"`

Defined in: [src/modules/admin/data-export.service.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L13)

***

### fields?

> `optional` **fields**: `string`[]

Defined in: [src/modules/admin/data-export.service.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L21)

***

### filters?

> `optional` **filters**: `Record`\<`string`, `any`\>

Defined in: [src/modules/admin/data-export.service.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L15)

***

### format

> **format**: `"csv"` \| `"json"` \| `"xlsx"`

Defined in: [src/modules/admin/data-export.service.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L14)

***

### includeRelations?

> `optional` **includeRelations**: `boolean`

Defined in: [src/modules/admin/data-export.service.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L20)

***

### limit?

> `optional` **limit**: `number`

Defined in: [src/modules/admin/data-export.service.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L22)

***

### recipientEmail?

> `optional` **recipientEmail**: `string`

Defined in: [src/modules/admin/data-export.service.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L24)
