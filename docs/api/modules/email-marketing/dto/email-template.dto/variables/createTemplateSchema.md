[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-template.dto](../README.md) / createTemplateSchema

# Variable: createTemplateSchema

> `const` **createTemplateSchema**: `ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `description`: `ZodOptional`\<`ZodString`\>; `htmlContent`: `ZodString`; `isPublic`: `ZodDefault`\<`ZodBoolean`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `name`: `ZodString`; `preheader`: `ZodOptional`\<`ZodString`\>; `subject`: `ZodString`; `textContent`: `ZodOptional`\<`ZodString`\>; `thumbnail`: `ZodOptional`\<`ZodString`\>; `variables`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `defaultValue`: `ZodOptional`\<`ZodAny`\>; `name`: `ZodString`; `required`: `ZodOptional`\<`ZodBoolean`\>; `type`: `ZodNativeEnum`\<\{ \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `defaultValue?`: `any`; `name?`: `string`; `required?`: `boolean`; `type?`: `"TEXT"` \| `"NUMBER"` \| `"DATE"` \| `"BOOLEAN"` \| `"LIST"`; \}, \{ `defaultValue?`: `any`; `name?`: `string`; `required?`: `boolean`; `type?`: `"TEXT"` \| `"NUMBER"` \| `"DATE"` \| `"BOOLEAN"` \| `"LIST"`; \}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `category?`: `string`; `description?`: `string`; `htmlContent?`: `string`; `isPublic?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `preheader?`: `string`; `subject?`: `string`; `textContent?`: `string`; `thumbnail?`: `string`; `variables?`: `object`[]; \}, \{ `category?`: `string`; `description?`: `string`; `htmlContent?`: `string`; `isPublic?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `preheader?`: `string`; `subject?`: `string`; `textContent?`: `string`; `thumbnail?`: `string`; `variables?`: `object`[]; \}\>

Defined in: [src/modules/email-marketing/dto/email-template.dto.ts:7](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-template.dto.ts#L7)
