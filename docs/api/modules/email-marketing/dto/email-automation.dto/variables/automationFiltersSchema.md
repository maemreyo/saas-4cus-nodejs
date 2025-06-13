[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-automation.dto](../README.md) / automationFiltersSchema

# Variable: automationFiltersSchema

> `const` **automationFiltersSchema**: `ZodObject`\<\{ `active`: `ZodOptional`\<`ZodBoolean`\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `listId`: `ZodOptional`\<`ZodString`\>; `page`: `ZodDefault`\<`ZodNumber`\>; `search`: `ZodOptional`\<`ZodString`\>; `sortBy`: `ZodDefault`\<`ZodEnum`\<\[`"name"`, `"createdAt"`, `"totalEnrolled"`\]\>\>; `sortOrder`: `ZodDefault`\<`ZodEnum`\<\[`"asc"`, `"desc"`\]\>\>; `trigger`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `active?`: `boolean`; `limit?`: `number`; `listId?`: `string`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"totalEnrolled"`; `sortOrder?`: `"asc"` \| `"desc"`; `trigger?`: `"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"`; \}, \{ `active?`: `boolean`; `limit?`: `number`; `listId?`: `string`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"totalEnrolled"`; `sortOrder?`: `"asc"` \| `"desc"`; `trigger?`: `"USER_SIGNUP"` \| `"LIST_SUBSCRIBE"` \| `"TAG_ADDED"` \| `"DATE_BASED"` \| `"CUSTOM_EVENT"` \| `"WEBHOOK"`; \}\>

Defined in: [src/modules/email-marketing/dto/email-automation.dto.ts:61](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-automation.dto.ts#L61)
