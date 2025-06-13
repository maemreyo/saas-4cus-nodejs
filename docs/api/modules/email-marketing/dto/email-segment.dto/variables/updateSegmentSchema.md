[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-segment.dto](../README.md) / updateSegmentSchema

# Variable: updateSegmentSchema

> `const` **updateSegmentSchema**: `ZodObject`\<\{ `conditions`: `ZodOptional`\<`ZodObject`\<\{ `groups`: `ZodArray`\<`ZodObject`\<\{ `conditions`: `ZodArray`\<`ZodObject`\<\{ `field`: ...; `operator`: ...; `type`: ...; `value`: ...; \}, `"strip"`, `ZodTypeAny`, \{ `field?`: ...; `operator?`: ...; `type?`: ...; `value?`: ...; \}, \{ `field?`: ...; `operator?`: ...; `type?`: ...; `value?`: ...; \}\>, `"many"`\>; `operator`: `ZodEnum`\<\[`"AND"`, `"OR"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `conditions?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}, \{ `conditions?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}\>, `"many"`\>; `operator`: `ZodEnum`\<\[`"AND"`, `"OR"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}, \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}\>\>; `description`: `ZodOptional`\<`ZodOptional`\<`ZodString`\>\>; `metadata`: `ZodOptional`\<`ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>\>; `name`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `conditions?`: \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}; `description?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; \}, \{ `conditions?`: \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}; `description?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; \}\>

Defined in: [src/modules/email-marketing/dto/email-segment.dto.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-segment.dto.ts#L31)
