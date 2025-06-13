[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / ImageGenerationRequestSchema

# Variable: ImageGenerationRequestSchema

> `const` **ImageGenerationRequestSchema**: `ZodObject`\<\{ `cache`: `ZodDefault`\<`ZodBoolean`\>; `model`: `ZodOptional`\<`ZodString`\>; `n`: `ZodOptional`\<`ZodNumber`\>; `prompt`: `ZodString`; `provider`: `ZodOptional`\<`ZodString`\>; `quality`: `ZodOptional`\<`ZodEnum`\<\[`"standard"`, `"hd"`\]\>\>; `responseFormat`: `ZodOptional`\<`ZodEnum`\<\[`"url"`, `"b64_json"`\]\>\>; `size`: `ZodOptional`\<`ZodEnum`\<\[`"256x256"`, `"512x512"`, `"1024x1024"`, `"1792x1024"`, `"1024x1792"`\]\>\>; `style`: `ZodOptional`\<`ZodEnum`\<\[`"vivid"`, `"natural"`\]\>\>; `track`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `cache?`: `boolean`; `model?`: `string`; `n?`: `number`; `prompt?`: `string`; `provider?`: `string`; `quality?`: `"standard"` \| `"hd"`; `responseFormat?`: `"url"` \| `"b64_json"`; `size?`: `"256x256"` \| `"512x512"` \| `"1024x1024"` \| `"1792x1024"` \| `"1024x1792"`; `style?`: `"vivid"` \| `"natural"`; `track?`: `boolean`; \}, \{ `cache?`: `boolean`; `model?`: `string`; `n?`: `number`; `prompt?`: `string`; `provider?`: `string`; `quality?`: `"standard"` \| `"hd"`; `responseFormat?`: `"url"` \| `"b64_json"`; `size?`: `"256x256"` \| `"512x512"` \| `"1024x1024"` \| `"1792x1024"` \| `"1024x1792"`; `style?`: `"vivid"` \| `"natural"`; `track?`: `boolean`; \}\>

Defined in: [src/modules/ai/ai.dto.ts:126](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.dto.ts#L126)
