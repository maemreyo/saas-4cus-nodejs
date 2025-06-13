[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / ConversationResponseSchema

# Variable: ConversationResponseSchema

> `const` **ConversationResponseSchema**: `ZodObject`\<\{ `createdAt`: `ZodString`; `id`: `ZodString`; `messages`: `ZodArray`\<`ZodObject`\<\{ `content`: `ZodString`; `functionCall`: `ZodOptional`\<`ZodObject`\<\{ `arguments`: `ZodString`; `name`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `arguments?`: `string`; `name?`: `string`; \}, \{ `arguments?`: `string`; `name?`: `string`; \}\>\>; `name`: `ZodOptional`\<`ZodString`\>; `role`: `ZodEnum`\<\[`"system"`, `"user"`, `"assistant"`, `"function"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `content?`: `string`; `functionCall?`: \{ `arguments?`: `string`; `name?`: `string`; \}; `name?`: `string`; `role?`: `"function"` \| `"user"` \| `"system"` \| `"assistant"`; \}, \{ `content?`: `string`; `functionCall?`: \{ `arguments?`: `string`; `name?`: `string`; \}; `name?`: `string`; `role?`: `"function"` \| `"user"` \| `"system"` \| `"assistant"`; \}\>, `"many"`\>; `metadata`: `ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `model`: `ZodString`; `provider`: `ZodString`; `tenantId`: `ZodNullable`\<`ZodString`\>; `title`: `ZodNullable`\<`ZodString`\>; `updatedAt`: `ZodString`; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `createdAt?`: `string`; `id?`: `string`; `messages?`: `object`[]; `metadata?`: `Record`\<`string`, `any`\>; `model?`: `string`; `provider?`: `string`; `tenantId?`: `string`; `title?`: `string`; `updatedAt?`: `string`; `userId?`: `string`; \}, \{ `createdAt?`: `string`; `id?`: `string`; `messages?`: `object`[]; `metadata?`: `Record`\<`string`, `any`\>; `model?`: `string`; `provider?`: `string`; `tenantId?`: `string`; `title?`: `string`; `updatedAt?`: `string`; `userId?`: `string`; \}\>

Defined in: [src/modules/ai/ai.dto.ts:288](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.dto.ts#L288)
