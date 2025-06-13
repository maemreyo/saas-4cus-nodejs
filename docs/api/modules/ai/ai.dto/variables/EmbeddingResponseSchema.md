[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / EmbeddingResponseSchema

# Variable: EmbeddingResponseSchema

> `const` **EmbeddingResponseSchema**: `ZodObject`\<\{ `cached`: `ZodBoolean`; `cost`: `ZodNumber`; `embeddings`: `ZodArray`\<`ZodObject`\<\{ `embedding`: `ZodArray`\<`ZodNumber`, `"many"`\>; `index`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `embedding?`: `number`[]; `index?`: `number`; \}, \{ `embedding?`: `number`[]; `index?`: `number`; \}\>, `"many"`\>; `id`: `ZodString`; `model`: `ZodString`; `provider`: `ZodString`; `usage`: `ZodObject`\<\{ `promptTokens`: `ZodNumber`; `totalTokens`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `promptTokens?`: `number`; `totalTokens?`: `number`; \}, \{ `promptTokens?`: `number`; `totalTokens?`: `number`; \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `cached?`: `boolean`; `cost?`: `number`; `embeddings?`: `object`[]; `id?`: `string`; `model?`: `string`; `provider?`: `string`; `usage?`: \{ `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \}, \{ `cached?`: `boolean`; `cost?`: `number`; `embeddings?`: `object`[]; `id?`: `string`; `model?`: `string`; `provider?`: `string`; `usage?`: \{ `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \}\>

Defined in: [src/modules/ai/ai.dto.ts:107](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.dto.ts#L107)
