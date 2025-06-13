[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / AudioTranscriptionRequestSchema

# Variable: AudioTranscriptionRequestSchema

> `const` **AudioTranscriptionRequestSchema**: `ZodObject`\<\{ `language`: `ZodOptional`\<`ZodString`\>; `model`: `ZodOptional`\<`ZodString`\>; `prompt`: `ZodOptional`\<`ZodString`\>; `provider`: `ZodOptional`\<`ZodString`\>; `responseFormat`: `ZodOptional`\<`ZodEnum`\<\[`"json"`, `"text"`, `"srt"`, `"vtt"`\]\>\>; `temperature`: `ZodOptional`\<`ZodNumber`\>; `track`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `language?`: `string`; `model?`: `string`; `prompt?`: `string`; `provider?`: `string`; `responseFormat?`: `"json"` \| `"text"` \| `"srt"` \| `"vtt"`; `temperature?`: `number`; `track?`: `boolean`; \}, \{ `language?`: `string`; `model?`: `string`; `prompt?`: `string`; `provider?`: `string`; `responseFormat?`: `"json"` \| `"text"` \| `"srt"` \| `"vtt"`; `temperature?`: `number`; `track?`: `boolean`; \}\>

Defined in: [src/modules/ai/ai.dto.ts:157](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/ai.dto.ts#L157)
