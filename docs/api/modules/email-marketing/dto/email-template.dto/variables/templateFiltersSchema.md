[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-template.dto](../README.md) / templateFiltersSchema

# Variable: templateFiltersSchema

> `const` **templateFiltersSchema**: `ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `isArchived`: `ZodOptional`\<`ZodBoolean`\>; `isPublic`: `ZodOptional`\<`ZodBoolean`\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `page`: `ZodDefault`\<`ZodNumber`\>; `search`: `ZodOptional`\<`ZodString`\>; `sortBy`: `ZodDefault`\<`ZodEnum`\<\[`"name"`, `"createdAt"`, `"updatedAt"`\]\>\>; `sortOrder`: `ZodDefault`\<`ZodEnum`\<\[`"asc"`, `"desc"`\]\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `category?`: `string`; `isArchived?`: `boolean`; `isPublic?`: `boolean`; `limit?`: `number`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"updatedAt"`; `sortOrder?`: `"asc"` \| `"desc"`; \}, \{ `category?`: `string`; `isArchived?`: `boolean`; `isPublic?`: `boolean`; `limit?`: `number`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"updatedAt"`; `sortOrder?`: `"asc"` \| `"desc"`; \}\>

Defined in: [src/modules/email-marketing/dto/email-template.dto.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-template.dto.ts#L36)
