[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-segment.dto](../README.md) / createSegmentSchema

# Variable: createSegmentSchema

> `const` **createSegmentSchema**: `ZodObject`\<\{ `conditions`: `ZodObject`\<\{ `groups`: `ZodArray`\<`ZodObject`\<\{ `conditions`: `ZodArray`\<`ZodObject`\<\{ `field`: `ZodString`; `operator`: `ZodNativeEnum`\<...\>; `type`: `ZodOptional`\<...\>; `value`: `ZodAny`; \}, `"strip"`, `ZodTypeAny`, \{ `field?`: `string`; `operator?`: ... \| ... \| ... \| ... \| ... \| ... \| ... \| ...; `type?`: ... \| ... \| ... \| ...; `value?`: `any`; \}, \{ `field?`: `string`; `operator?`: ... \| ... \| ... \| ... \| ... \| ... \| ... \| ...; `type?`: ... \| ... \| ... \| ...; `value?`: `any`; \}\>, `"many"`\>; `operator`: `ZodEnum`\<\[`"AND"`, `"OR"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `conditions?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}, \{ `conditions?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}\>, `"many"`\>; `operator`: `ZodEnum`\<\[`"AND"`, `"OR"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}, \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}\>; `description`: `ZodOptional`\<`ZodString`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `name`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `conditions?`: \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}; `description?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; \}, \{ `conditions?`: \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}; `description?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; \}\>

Defined in: [src/modules/email-marketing/dto/email-segment.dto.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-segment.dto.ts#L15)
