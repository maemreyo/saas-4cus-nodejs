[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/notification/notification.dto](../README.md) / UpdatePreferencesDTO

# Class: UpdatePreferencesDTO

Defined in: [src/modules/notification/notification.dto.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L33)

## Constructors

### Constructor

> **new UpdatePreferencesDTO**(): `UpdatePreferencesDTO`

#### Returns

`UpdatePreferencesDTO`

## Properties

### email?

> `optional` **email**: `boolean`

Defined in: [src/modules/notification/notification.dto.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L46)

***

### frequency?

> `optional` **frequency**: `"daily"` \| `"weekly"` \| `"immediate"` \| `"hourly"`

Defined in: [src/modules/notification/notification.dto.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L50)

***

### inApp?

> `optional` **inApp**: `boolean`

Defined in: [src/modules/notification/notification.dto.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L48)

***

### push?

> `optional` **push**: `boolean`

Defined in: [src/modules/notification/notification.dto.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L47)

***

### quietHours?

> `optional` **quietHours**: `object`

Defined in: [src/modules/notification/notification.dto.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L51)

#### end

> **end**: `string`

#### start

> **start**: `string`

***

### schema

> `static` **schema**: `ZodObject`\<\{ `email`: `ZodOptional`\<`ZodBoolean`\>; `frequency`: `ZodOptional`\<`ZodEnum`\<\[`"immediate"`, `"hourly"`, `"daily"`, `"weekly"`\]\>\>; `inApp`: `ZodOptional`\<`ZodBoolean`\>; `push`: `ZodOptional`\<`ZodBoolean`\>; `quietHours`: `ZodOptional`\<`ZodObject`\<\{ `end`: `ZodString`; `start`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `end?`: `string`; `start?`: `string`; \}, \{ `end?`: `string`; `start?`: `string`; \}\>\>; `sms`: `ZodOptional`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `email?`: `boolean`; `frequency?`: `"daily"` \| `"weekly"` \| `"immediate"` \| `"hourly"`; `inApp?`: `boolean`; `push?`: `boolean`; `quietHours?`: \{ `end?`: `string`; `start?`: `string`; \}; `sms?`: `boolean`; \}, \{ `email?`: `boolean`; `frequency?`: `"daily"` \| `"weekly"` \| `"immediate"` \| `"hourly"`; `inApp?`: `boolean`; `push?`: `boolean`; `quietHours?`: \{ `end?`: `string`; `start?`: `string`; \}; `sms?`: `boolean`; \}\>

Defined in: [src/modules/notification/notification.dto.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L34)

***

### sms?

> `optional` **sms**: `boolean`

Defined in: [src/modules/notification/notification.dto.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L49)
