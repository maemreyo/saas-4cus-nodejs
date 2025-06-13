[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / EmbeddingRequestSchema

# Variable: EmbeddingRequestSchema

> `const` **EmbeddingRequestSchema**: `ZodObject`\<\{ `cache`: `ZodDefault`\<`ZodBoolean`\>; `dimensions`: `ZodOptional`\<`ZodNumber`\>; `model`: `ZodOptional`\<`ZodString`\>; `provider`: `ZodOptional`\<`ZodString`\>; `text`: `ZodUnion`\<\[`ZodString`, `ZodArray`\<`ZodString`, `"many"`\>\]\>; `track`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `cache?`: `boolean`; `dimensions?`: `number`; `model?`: `string`; `provider?`: `string`; `text?`: `string` \| `string`[]; `track?`: `boolean`; \}, \{ `cache?`: `boolean`; `dimensions?`: `number`; `model?`: `string`; `provider?`: `string`; `text?`: `string` \| `string`[]; `track?`: `boolean`; \}\>

Defined in: [src/modules/ai/ai.dto.ts:96](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/ai.dto.ts#L96)
