[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-automation.dto](../README.md) / updateAutomationSchema

# Variable: updateAutomationSchema

> `const` **updateAutomationSchema**: `ZodObject`\<\{ `active`: `ZodOptional`\<`ZodDefault`\<`ZodBoolean`\>\>; `description`: `ZodOptional`\<`ZodOptional`\<`ZodString`\>\>; `listId`: `ZodOptional`\<`ZodOptional`\<`ZodString`\>\>; `metadata`: `ZodOptional`\<`ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>\>; `name`: `ZodOptional`\<`ZodString`\>; `trigger`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `triggerConfig`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `active?`: `boolean`; `description?`: `string`; `listId?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `trigger?`: `"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"`; `triggerConfig?`: `Record`\<`string`, `any`\>; \}, \{ `active?`: `boolean`; `description?`: `string`; `listId?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `trigger?`: `"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"`; `triggerConfig?`: `Record`\<`string`, `any`\>; \}\>

Defined in: [src/modules/email-marketing/dto/email-automation.dto.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-automation.dto.ts#L48)
