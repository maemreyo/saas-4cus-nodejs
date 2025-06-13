[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/notification/notification.dto](../README.md) / MarkNotificationsReadDTO

# Class: MarkNotificationsReadDTO

Defined in: [src/modules/notification/notification.dto.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/notification/notification.dto.ts#L57)

## Constructors

### Constructor

> **new MarkNotificationsReadDTO**(): `MarkNotificationsReadDTO`

#### Returns

`MarkNotificationsReadDTO`

## Properties

### markAll?

> `optional` **markAll**: `boolean`

Defined in: [src/modules/notification/notification.dto.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/notification/notification.dto.ts#L66)

***

### notificationIds?

> `optional` **notificationIds**: `string`[]

Defined in: [src/modules/notification/notification.dto.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/notification/notification.dto.ts#L65)

***

### schema

> `static` **schema**: `ZodEffects`\<`ZodObject`\<\{ `markAll`: `ZodOptional`\<`ZodBoolean`\>; `notificationIds`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `markAll?`: `boolean`; `notificationIds?`: `string`[]; \}, \{ `markAll?`: `boolean`; `notificationIds?`: `string`[]; \}\>, \{ `markAll?`: `boolean`; `notificationIds?`: `string`[]; \}, \{ `markAll?`: `boolean`; `notificationIds?`: `string`[]; \}\>

Defined in: [src/modules/notification/notification.dto.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/notification/notification.dto.ts#L58)
