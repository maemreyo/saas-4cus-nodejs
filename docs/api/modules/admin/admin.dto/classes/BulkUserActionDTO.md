[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / BulkUserActionDTO

# Class: BulkUserActionDTO

Defined in: [src/modules/admin/admin.dto.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L35)

## Constructors

### Constructor

> **new BulkUserActionDTO**(): `BulkUserActionDTO`

#### Returns

`BulkUserActionDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `action`: `ZodEnum`\<\[`"suspend"`, `"activate"`, `"delete"`, `"verify_email"`, `"reset_password"`\]\>; `notifyUsers`: `ZodDefault`\<`ZodBoolean`\>; `reason`: `ZodOptional`\<`ZodString`\>; `userIds`: `ZodArray`\<`ZodString`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `action?`: `"delete"` \| `"suspend"` \| `"activate"` \| `"verify_email"` \| `"reset_password"`; `notifyUsers?`: `boolean`; `reason?`: `string`; `userIds?`: `string`[]; \}, \{ `action?`: `"delete"` \| `"suspend"` \| `"activate"` \| `"verify_email"` \| `"reset_password"`; `notifyUsers?`: `boolean`; `reason?`: `string`; `userIds?`: `string`[]; \}\>

Defined in: [src/modules/admin/admin.dto.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L36)
