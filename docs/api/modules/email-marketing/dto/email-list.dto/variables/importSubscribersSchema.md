[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-list.dto](../README.md) / importSubscribersSchema

# Variable: importSubscribersSchema

> `const` **importSubscribersSchema**: `ZodEffects`\<`ZodObject`\<\{ `csvContent`: `ZodOptional`\<`ZodString`\>; `skipConfirmation`: `ZodDefault`\<`ZodBoolean`\>; `subscribers`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `customData`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `email`: `ZodString`; `firstName`: `ZodOptional`\<`ZodString`\>; `ipAddress`: `ZodOptional`\<`ZodString`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `customData?`: `Record`\<`string`, `any`\>; `email?`: `string`; `firstName?`: `string`; `ipAddress?`: `string`; `lastName?`: `string`; `tags?`: `string`[]; \}, \{ `customData?`: `Record`\<`string`, `any`\>; `email?`: `string`; `firstName?`: `string`; `ipAddress?`: `string`; `lastName?`: `string`; `tags?`: `string`[]; \}\>, `"many"`\>\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `updateExisting`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `csvContent?`: `string`; `skipConfirmation?`: `boolean`; `subscribers?`: `object`[]; `tags?`: `string`[]; `updateExisting?`: `boolean`; \}, \{ `csvContent?`: `string`; `skipConfirmation?`: `boolean`; `subscribers?`: `object`[]; `tags?`: `string`[]; `updateExisting?`: `boolean`; \}\>, \{ `csvContent?`: `string`; `skipConfirmation?`: `boolean`; `subscribers?`: `object`[]; `tags?`: `string`[]; `updateExisting?`: `boolean`; \}, \{ `csvContent?`: `string`; `skipConfirmation?`: `boolean`; `subscribers?`: `object`[]; `tags?`: `string`[]; `updateExisting?`: `boolean`; \}\>

Defined in: [src/modules/email-marketing/dto/email-list.dto.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-list.dto.ts#L67)
