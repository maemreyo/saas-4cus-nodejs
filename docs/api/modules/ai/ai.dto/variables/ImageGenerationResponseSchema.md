[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / ImageGenerationResponseSchema

# Variable: ImageGenerationResponseSchema

> `const` **ImageGenerationResponseSchema**: `ZodObject`\<\{ `cached`: `ZodBoolean`; `cost`: `ZodNumber`; `id`: `ZodString`; `images`: `ZodArray`\<`ZodObject`\<\{ `b64Json`: `ZodOptional`\<`ZodString`\>; `revisedPrompt`: `ZodOptional`\<`ZodString`\>; `url`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `b64Json?`: `string`; `revisedPrompt?`: `string`; `url?`: `string`; \}, \{ `b64Json?`: `string`; `revisedPrompt?`: `string`; `url?`: `string`; \}\>, `"many"`\>; `model`: `ZodString`; `provider`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `cached?`: `boolean`; `cost?`: `number`; `id?`: `string`; `images?`: `object`[]; `model?`: `string`; `provider?`: `string`; \}, \{ `cached?`: `boolean`; `cost?`: `number`; `id?`: `string`; `images?`: `object`[]; `model?`: `string`; `provider?`: `string`; \}\>

Defined in: [src/modules/ai/ai.dto.ts:141](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.dto.ts#L141)
