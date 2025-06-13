[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/notification/notification.dto](../README.md) / MarkNotificationsReadDTO

# Class: MarkNotificationsReadDTO

Defined in: [src/modules/notification/notification.dto.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L57)

## Constructors

### Constructor

> **new MarkNotificationsReadDTO**(): `MarkNotificationsReadDTO`

#### Returns

`MarkNotificationsReadDTO`

## Properties

### markAll?

> `optional` **markAll**: `boolean`

Defined in: [src/modules/notification/notification.dto.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L66)

***

### notificationIds?

> `optional` **notificationIds**: `string`[]

Defined in: [src/modules/notification/notification.dto.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L65)

***

### schema

> `static` **schema**: `ZodEffects`\<`ZodObject`\<\{ `markAll`: `ZodOptional`\<`ZodBoolean`\>; `notificationIds`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `markAll?`: `boolean`; `notificationIds?`: `string`[]; \}, \{ `markAll?`: `boolean`; `notificationIds?`: `string`[]; \}\>, \{ `markAll?`: `boolean`; `notificationIds?`: `string`[]; \}, \{ `markAll?`: `boolean`; `notificationIds?`: `string`[]; \}\>

Defined in: [src/modules/notification/notification.dto.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L58)
