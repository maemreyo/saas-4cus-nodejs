[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/user/user.dto](../README.md) / UpdatePreferencesDTO

# Class: UpdatePreferencesDTO

Defined in: [src/modules/user/user.dto.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L41)

## Constructors

### Constructor

> **new UpdatePreferencesDTO**(): `UpdatePreferencesDTO`

#### Returns

`UpdatePreferencesDTO`

## Properties

### emailNotifications?

> `optional` **emailNotifications**: `boolean`

Defined in: [src/modules/user/user.dto.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L56)

***

### language?

> `optional` **language**: `string`

Defined in: [src/modules/user/user.dto.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L54)

***

### marketingEmails?

> `optional` **marketingEmails**: `boolean`

Defined in: [src/modules/user/user.dto.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L58)

***

### publicProfile?

> `optional` **publicProfile**: `boolean`

Defined in: [src/modules/user/user.dto.ts:60](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L60)

***

### pushNotifications?

> `optional` **pushNotifications**: `boolean`

Defined in: [src/modules/user/user.dto.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L57)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `emailNotifications`: `ZodOptional`\<`ZodBoolean`\>; `language`: `ZodOptional`\<`ZodString`\>; `marketingEmails`: `ZodOptional`\<`ZodBoolean`\>; `publicProfile`: `ZodOptional`\<`ZodBoolean`\>; `pushNotifications`: `ZodOptional`\<`ZodBoolean`\>; `theme`: `ZodOptional`\<`ZodEnum`\<\[`"light"`, `"dark"`, `"system"`\]\>\>; `timezone`: `ZodOptional`\<`ZodString`\>; `twoFactorEnabled`: `ZodOptional`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `emailNotifications?`: `boolean`; `language?`: `string`; `marketingEmails?`: `boolean`; `publicProfile?`: `boolean`; `pushNotifications?`: `boolean`; `theme?`: `"system"` \| `"light"` \| `"dark"`; `timezone?`: `string`; `twoFactorEnabled?`: `boolean`; \}, \{ `emailNotifications?`: `boolean`; `language?`: `string`; `marketingEmails?`: `boolean`; `publicProfile?`: `boolean`; `pushNotifications?`: `boolean`; `theme?`: `"system"` \| `"light"` \| `"dark"`; `timezone?`: `string`; `twoFactorEnabled?`: `boolean`; \}\>

Defined in: [src/modules/user/user.dto.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L42)

***

### theme?

> `optional` **theme**: `"system"` \| `"light"` \| `"dark"`

Defined in: [src/modules/user/user.dto.ts:53](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L53)

***

### timezone?

> `optional` **timezone**: `string`

Defined in: [src/modules/user/user.dto.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L55)

***

### twoFactorEnabled?

> `optional` **twoFactorEnabled**: `boolean`

Defined in: [src/modules/user/user.dto.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/user/user.dto.ts#L59)
