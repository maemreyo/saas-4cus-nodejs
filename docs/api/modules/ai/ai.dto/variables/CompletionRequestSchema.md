[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / CompletionRequestSchema

# Variable: CompletionRequestSchema

> `const` **CompletionRequestSchema**: `ZodObject`\<\{ `cache`: `ZodDefault`\<`ZodBoolean`\>; `frequencyPenalty`: `ZodOptional`\<`ZodNumber`\>; `maxTokens`: `ZodOptional`\<`ZodNumber`\>; `model`: `ZodOptional`\<`ZodString`\>; `presencePenalty`: `ZodOptional`\<`ZodNumber`\>; `prompt`: `ZodString`; `provider`: `ZodOptional`\<`ZodString`\>; `stop`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `stream`: `ZodOptional`\<`ZodBoolean`\>; `systemPrompt`: `ZodOptional`\<`ZodString`\>; `temperature`: `ZodOptional`\<`ZodNumber`\>; `topP`: `ZodOptional`\<`ZodNumber`\>; `track`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `cache?`: `boolean`; `frequencyPenalty?`: `number`; `maxTokens?`: `number`; `model?`: `string`; `presencePenalty?`: `number`; `prompt?`: `string`; `provider?`: `string`; `stop?`: `string`[]; `stream?`: `boolean`; `systemPrompt?`: `string`; `temperature?`: `number`; `topP?`: `number`; `track?`: `boolean`; \}, \{ `cache?`: `boolean`; `frequencyPenalty?`: `number`; `maxTokens?`: `number`; `model?`: `string`; `presencePenalty?`: `number`; `prompt?`: `string`; `provider?`: `string`; `stop?`: `string`[]; `stream?`: `boolean`; `systemPrompt?`: `string`; `temperature?`: `number`; `topP?`: `number`; `track?`: `boolean`; \}\>

Defined in: [src/modules/ai/ai.dto.ts:5](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.dto.ts#L5)
