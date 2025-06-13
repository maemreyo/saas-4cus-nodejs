[**modern-backend-template v2.0.0**](../../../README.md)

***

[modern-backend-template](../../../modules.md) / [shared/validators](../README.md) / paginationSchema

# Variable: paginationSchema

> `const` **paginationSchema**: `ZodObject`\<\{ `limit`: `ZodDefault`\<`ZodNumber`\>; `order`: `ZodDefault`\<`ZodEnum`\<\[`"asc"`, `"desc"`\]\>\>; `page`: `ZodDefault`\<`ZodNumber`\>; `sort`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `limit?`: `number`; `order?`: `"asc"` \| `"desc"`; `page?`: `number`; `sort?`: `string`; \}, \{ `limit?`: `number`; `order?`: `"asc"` \| `"desc"`; `page?`: `number`; `sort?`: `string`; \}\>

Defined in: [src/shared/validators/index.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/validators/index.ts#L24)
