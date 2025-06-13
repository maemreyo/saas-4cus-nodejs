[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / AuditLogQueryDTO

# Class: AuditLogQueryDTO

Defined in: [src/modules/admin/admin.dto.ts:145](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L145)

## Constructors

### Constructor

> **new AuditLogQueryDTO**(): `AuditLogQueryDTO`

#### Returns

`AuditLogQueryDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `action`: `ZodOptional`\<`ZodString`\>; `endDate`: `ZodOptional`\<`ZodString`\>; `entity`: `ZodOptional`\<`ZodString`\>; `entityId`: `ZodOptional`\<`ZodString`\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `page`: `ZodDefault`\<`ZodNumber`\>; `startDate`: `ZodOptional`\<`ZodString`\>; `userId`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `action?`: `string`; `endDate?`: `string`; `entity?`: `string`; `entityId?`: `string`; `limit?`: `number`; `page?`: `number`; `startDate?`: `string`; `userId?`: `string`; \}, \{ `action?`: `string`; `endDate?`: `string`; `entity?`: `string`; `entityId?`: `string`; `limit?`: `number`; `page?`: `number`; `startDate?`: `string`; `userId?`: `string`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:146](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L146)
