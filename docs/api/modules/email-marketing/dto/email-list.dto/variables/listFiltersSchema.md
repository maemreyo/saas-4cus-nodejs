[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-list.dto](../README.md) / listFiltersSchema

# Variable: listFiltersSchema

> `const` **listFiltersSchema**: `ZodObject`\<\{ `hasSubscribers`: `ZodOptional`\<`ZodBoolean`\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `page`: `ZodDefault`\<`ZodNumber`\>; `search`: `ZodOptional`\<`ZodString`\>; `sortBy`: `ZodDefault`\<`ZodEnum`\<\[`"name"`, `"createdAt"`, `"subscriberCount"`\]\>\>; `sortOrder`: `ZodDefault`\<`ZodEnum`\<\[`"asc"`, `"desc"`\]\>\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `hasSubscribers?`: `boolean`; `limit?`: `number`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"subscriberCount"`; `sortOrder?`: `"asc"` \| `"desc"`; `status?`: `"ACTIVE"` \| `"INACTIVE"` \| `"DELETED"` \| `"ARCHIVED"`; \}, \{ `hasSubscribers?`: `boolean`; `limit?`: `number`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"subscriberCount"`; `sortOrder?`: `"asc"` \| `"desc"`; `status?`: `"ACTIVE"` \| `"INACTIVE"` \| `"DELETED"` \| `"ARCHIVED"`; \}\>

Defined in: [src/modules/email-marketing/dto/email-list.dto.ts:81](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-list.dto.ts#L81)
