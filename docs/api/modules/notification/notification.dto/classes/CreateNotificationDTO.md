[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/notification/notification.dto](../README.md) / CreateNotificationDTO

# Class: CreateNotificationDTO

Defined in: [src/modules/notification/notification.dto.ts:3](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L3)

## Constructors

### Constructor

> **new CreateNotificationDTO**(): `CreateNotificationDTO`

#### Returns

`CreateNotificationDTO`

## Properties

### actions?

> `optional` **actions**: `object`[]

Defined in: [src/modules/notification/notification.dto.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L26)

#### action?

> `optional` **action**: `string`

#### label

> **label**: `string`

#### url?

> `optional` **url**: `string`

***

### content

> **content**: `string`

Defined in: [src/modules/notification/notification.dto.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L22)

***

### expiresAt?

> `optional` **expiresAt**: `Date`

Defined in: [src/modules/notification/notification.dto.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L25)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [src/modules/notification/notification.dto.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L23)

***

### priority?

> `optional` **priority**: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"CRITICAL"`

Defined in: [src/modules/notification/notification.dto.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L24)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `actions`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `action`: `ZodOptional`\<`ZodString`\>; `label`: `ZodString`; `url`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `action?`: `string`; `label?`: `string`; `url?`: `string`; \}, \{ `action?`: `string`; `label?`: `string`; `url?`: `string`; \}\>, `"many"`\>\>; `content`: `ZodString`; `expiresAt`: `ZodOptional`\<`ZodString`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `priority`: `ZodDefault`\<`ZodOptional`\<`ZodEnum`\<\[`"LOW"`, `"MEDIUM"`, `"HIGH"`, `"CRITICAL"`\]\>\>\>; `title`: `ZodString`; `type`: `ZodEnum`\<\[`"INFO"`, `"WARNING"`, `"ERROR"`, `"SUCCESS"`, `"ALERT"`, `"CRITICAL"`\]\>; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `actions?`: `object`[]; `content?`: `string`; `expiresAt?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"CRITICAL"`; `title?`: `string`; `type?`: `"CRITICAL"` \| `"SUCCESS"` \| `"INFO"` \| `"WARNING"` \| `"ERROR"` \| `"ALERT"`; `userId?`: `string`; \}, \{ `actions?`: `object`[]; `content?`: `string`; `expiresAt?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `priority?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"CRITICAL"`; `title?`: `string`; `type?`: `"CRITICAL"` \| `"SUCCESS"` \| `"INFO"` \| `"WARNING"` \| `"ERROR"` \| `"ALERT"`; `userId?`: `string`; \}\>

Defined in: [src/modules/notification/notification.dto.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L4)

***

### title

> **title**: `string`

Defined in: [src/modules/notification/notification.dto.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L21)

***

### type

> **type**: `"CRITICAL"` \| `"SUCCESS"` \| `"INFO"` \| `"WARNING"` \| `"ERROR"` \| `"ALERT"`

Defined in: [src/modules/notification/notification.dto.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L20)

***

### userId

> **userId**: `string`

Defined in: [src/modules/notification/notification.dto.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/notification/notification.dto.ts#L19)
