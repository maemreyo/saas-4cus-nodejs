[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / CreateAnnouncementDTO

# Class: CreateAnnouncementDTO

Defined in: [src/modules/admin/admin.dto.ts:207](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L207)

## Constructors

### Constructor

> **new CreateAnnouncementDTO**(): `CreateAnnouncementDTO`

#### Returns

`CreateAnnouncementDTO`

## Properties

### content

> **content**: `string`

Defined in: [src/modules/admin/admin.dto.ts:221](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L221)

***

### createdBy?

> `optional` **createdBy**: `string`

Defined in: [src/modules/admin/admin.dto.ts:229](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L229)

***

### dismissible?

> `optional` **dismissible**: `boolean` = `true`

Defined in: [src/modules/admin/admin.dto.ts:228](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L228)

***

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/modules/admin/admin.dto.ts:227](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L227)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `content`: `ZodString`; `dismissible`: `ZodDefault`\<`ZodBoolean`\>; `endDate`: `ZodOptional`\<`ZodString`\>; `startDate`: `ZodOptional`\<`ZodString`\>; `targetAudience`: `ZodDefault`\<`ZodEnum`\<\[`"all"`, `"users"`, `"admins"`, `"specific"`\]\>\>; `targetTenantIds`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `targetUserIds`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `title`: `ZodString`; `type`: `ZodEnum`\<\[`"info"`, `"warning"`, `"critical"`, `"maintenance"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `content?`: `string`; `dismissible?`: `boolean`; `endDate?`: `string`; `startDate?`: `string`; `targetAudience?`: `"users"` \| `"all"` \| `"admins"` \| `"specific"`; `targetTenantIds?`: `string`[]; `targetUserIds?`: `string`[]; `title?`: `string`; `type?`: `"info"` \| `"critical"` \| `"warning"` \| `"maintenance"`; \}, \{ `content?`: `string`; `dismissible?`: `boolean`; `endDate?`: `string`; `startDate?`: `string`; `targetAudience?`: `"users"` \| `"all"` \| `"admins"` \| `"specific"`; `targetTenantIds?`: `string`[]; `targetUserIds?`: `string`[]; `title?`: `string`; `type?`: `"info"` \| `"critical"` \| `"warning"` \| `"maintenance"`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:208](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L208)

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/modules/admin/admin.dto.ts:226](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L226)

***

### targetAudience?

> `optional` **targetAudience**: `"users"` \| `"all"` \| `"admins"` \| `"specific"` = `'all'`

Defined in: [src/modules/admin/admin.dto.ts:223](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L223)

***

### targetTenantIds?

> `optional` **targetTenantIds**: `string`[]

Defined in: [src/modules/admin/admin.dto.ts:225](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L225)

***

### targetUserIds?

> `optional` **targetUserIds**: `string`[]

Defined in: [src/modules/admin/admin.dto.ts:224](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L224)

***

### title

> **title**: `string`

Defined in: [src/modules/admin/admin.dto.ts:220](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L220)

***

### type

> **type**: `"info"` \| `"critical"` \| `"warning"` \| `"maintenance"`

Defined in: [src/modules/admin/admin.dto.ts:222](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L222)
