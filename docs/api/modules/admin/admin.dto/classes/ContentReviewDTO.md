[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / ContentReviewDTO

# Class: ContentReviewDTO

Defined in: [src/modules/admin/admin.dto.ts:119](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/admin/admin.dto.ts#L119)

## Constructors

### Constructor

> **new ContentReviewDTO**(): `ContentReviewDTO`

#### Returns

`ContentReviewDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `entityId`: `ZodString`; `entityType`: `ZodEnum`\<\[`"user"`, `"project"`, `"file"`, `"ticket"`, `"comment"`\]\>; `notes`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `status`: `ZodEnum`\<\[`"pending"`, `"approved"`, `"rejected"`, `"flagged"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `entityId?`: `string`; `entityType?`: `"user"` \| `"file"` \| `"project"` \| `"ticket"` \| `"comment"`; `notes?`: `string`; `reason?`: `string`; `status?`: `"pending"` \| `"rejected"` \| `"approved"` \| `"flagged"`; \}, \{ `entityId?`: `string`; `entityType?`: `"user"` \| `"file"` \| `"project"` \| `"ticket"` \| `"comment"`; `notes?`: `string`; `reason?`: `string`; `status?`: `"pending"` \| `"rejected"` \| `"approved"` \| `"flagged"`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:120](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/admin/admin.dto.ts#L120)
