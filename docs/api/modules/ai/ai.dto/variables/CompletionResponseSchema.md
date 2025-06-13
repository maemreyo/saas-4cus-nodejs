[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / CompletionResponseSchema

# Variable: CompletionResponseSchema

> `const` **CompletionResponseSchema**: `ZodObject`\<\{ `cached`: `ZodBoolean`; `cost`: `ZodNumber`; `finishReason`: `ZodNullable`\<`ZodEnum`\<\[`"stop"`, `"length"`, `"content_filter"`, `"function_call"`\]\>\>; `id`: `ZodString`; `model`: `ZodString`; `provider`: `ZodString`; `text`: `ZodString`; `usage`: `ZodObject`\<\{ `completionTokens`: `ZodNumber`; `promptTokens`: `ZodNumber`; `totalTokens`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `completionTokens?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}, \{ `completionTokens?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `cached?`: `boolean`; `cost?`: `number`; `finishReason?`: `"length"` \| `"stop"` \| `"content_filter"` \| `"function_call"`; `id?`: `string`; `model?`: `string`; `provider?`: `string`; `text?`: `string`; `usage?`: \{ `completionTokens?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \}, \{ `cached?`: `boolean`; `cost?`: `number`; `finishReason?`: `"length"` \| `"stop"` \| `"content_filter"` \| `"function_call"`; `id?`: `string`; `model?`: `string`; `provider?`: `string`; `text?`: `string`; `usage?`: \{ `completionTokens?`: `number`; `promptTokens?`: `number`; `totalTokens?`: `number`; \}; \}\>

Defined in: [src/modules/ai/ai.dto.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/ai.dto.ts#L23)
