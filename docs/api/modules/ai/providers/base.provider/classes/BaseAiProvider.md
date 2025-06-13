[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/ai/providers/base.provider](../README.md) / BaseAiProvider

# Class: `abstract` BaseAiProvider

Defined in: [src/modules/ai/providers/base.provider.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L19)

## Extended by

- [`AnthropicProvider`](../../anthropic.provider/classes/AnthropicProvider.md)
- [`GoogleAIProvider`](../../google-ai.provider/classes/GoogleAIProvider.md)
- [`MockProvider`](../../mock.provider/classes/MockProvider.md)
- [`OllamaProvider`](../../ollama.provider/classes/OllamaProvider.md)
- [`OpenAIProvider`](../../openai.provider/classes/OpenAIProvider.md)

## Constructors

### Constructor

> **new BaseAiProvider**(`name`, `config`): `BaseAiProvider`

Defined in: [src/modules/ai/providers/base.provider.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L23)

#### Parameters

##### name

`string`

##### config

[`ProviderConfig`](../../../models/model.types/interfaces/ProviderConfig.md)

#### Returns

`BaseAiProvider`

## Methods

### calculateCost()

> `protected` **calculateCost**(`promptTokens`, `completionTokens`, `pricePerMillionPrompt`, `pricePerMillionCompletion`): `number`

Defined in: [src/modules/ai/providers/base.provider.ts:172](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L172)

#### Parameters

##### promptTokens

`number`

##### completionTokens

`number`

##### pricePerMillionPrompt

`number`

##### pricePerMillionCompletion

`number`

#### Returns

`number`

***

### chat()

> `abstract` **chat**(`messages`, `options?`): `Promise`\<[`ChatResult`](../../../models/model.types/interfaces/ChatResult.md)\>

Defined in: [src/modules/ai/providers/base.provider.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L35)

#### Parameters

##### messages

[`ChatMessage`](../../../models/model.types/interfaces/ChatMessage.md)[]

##### options?

[`ChatOptions`](../../../models/model.types/interfaces/ChatOptions.md)

#### Returns

`Promise`\<[`ChatResult`](../../../models/model.types/interfaces/ChatResult.md)\>

***

### complete()

> `abstract` **complete**(`prompt`, `options?`): `Promise`\<[`CompletionResult`](../../../models/model.types/interfaces/CompletionResult.md)\>

Defined in: [src/modules/ai/providers/base.provider.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L30)

#### Parameters

##### prompt

`string`

##### options?

[`CompletionOptions`](../../../models/model.types/interfaces/CompletionOptions.md)

#### Returns

`Promise`\<[`CompletionResult`](../../../models/model.types/interfaces/CompletionResult.md)\>

***

### createError()

> `protected` **createError**(`message`, `code`, `statusCode?`, `details?`): [`AiError`](../../../models/model.types/interfaces/AiError.md)

Defined in: [src/modules/ai/providers/base.provider.ts:70](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L70)

#### Parameters

##### message

`string`

##### code

`string`

##### statusCode?

`number`

##### details?

`any`

#### Returns

[`AiError`](../../../models/model.types/interfaces/AiError.md)

***

### embed()

> `abstract` **embed**(`text`, `options?`): `Promise`\<[`EmbeddingResult`](../../../models/model.types/interfaces/EmbeddingResult.md) \| [`EmbeddingResult`](../../../models/model.types/interfaces/EmbeddingResult.md)[]\>

Defined in: [src/modules/ai/providers/base.provider.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L40)

#### Parameters

##### text

`string` | `string`[]

##### options?

[`EmbeddingOptions`](../../../models/model.types/interfaces/EmbeddingOptions.md)

#### Returns

`Promise`\<[`EmbeddingResult`](../../../models/model.types/interfaces/EmbeddingResult.md) \| [`EmbeddingResult`](../../../models/model.types/interfaces/EmbeddingResult.md)[]\>

***

### estimateTokens()

> `protected` **estimateTokens**(`text`): `number`

Defined in: [src/modules/ai/providers/base.provider.ts:184](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L184)

#### Parameters

##### text

`string`

#### Returns

`number`

***

### generateImage()

> `abstract` **generateImage**(`options`): `Promise`\<[`ImageResult`](../../../models/model.types/interfaces/ImageResult.md)\>

Defined in: [src/modules/ai/providers/base.provider.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L45)

#### Parameters

##### options

[`ImageGenerationOptions`](../../../models/model.types/interfaces/ImageGenerationOptions.md)

#### Returns

`Promise`\<[`ImageResult`](../../../models/model.types/interfaces/ImageResult.md)\>

***

### getHeaders()

> `protected` **getHeaders**(): `Record`\<`string`, `string`\>

Defined in: [src/modules/ai/providers/base.provider.ts:122](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L122)

#### Returns

`Record`\<`string`, `string`\>

***

### getName()

> **getName**(): `string`

Defined in: [src/modules/ai/providers/base.provider.ts:189](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L189)

#### Returns

`string`

***

### isAvailable()

> `abstract` **isAvailable**(): `Promise`\<`boolean`\>

Defined in: [src/modules/ai/providers/base.provider.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L28)

#### Returns

`Promise`\<`boolean`\>

***

### makeRequest()

> `protected` **makeRequest**\<`T`\>(`url`, `options`): `Promise`\<`T`\>

Defined in: [src/modules/ai/providers/base.provider.ts:129](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L129)

#### Type Parameters

##### T

`T`

#### Parameters

##### url

`string`

##### options

`RequestInit`

#### Returns

`Promise`\<`T`\>

***

### streamChat()

> **streamChat**(`messages`, `options`): `Promise`\<`void`\>

Defined in: [src/modules/ai/providers/base.provider.ts:62](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L62)

#### Parameters

##### messages

[`ChatMessage`](../../../models/model.types/interfaces/ChatMessage.md)[]

##### options

[`ChatOptions`](../../../models/model.types/interfaces/ChatOptions.md) & [`StreamingOptions`](../../../models/model.types/interfaces/StreamingOptions.md)

#### Returns

`Promise`\<`void`\>

***

### streamComplete()

> **streamComplete**(`prompt`, `options`): `Promise`\<`void`\>

Defined in: [src/modules/ai/providers/base.provider.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L55)

#### Parameters

##### prompt

`string`

##### options

[`CompletionOptions`](../../../models/model.types/interfaces/CompletionOptions.md) & [`StreamingOptions`](../../../models/model.types/interfaces/StreamingOptions.md)

#### Returns

`Promise`\<`void`\>

***

### transcribeAudio()

> `abstract` **transcribeAudio**(`audioBuffer`, `options?`): `Promise`\<[`AudioResult`](../../../models/model.types/interfaces/AudioResult.md)\>

Defined in: [src/modules/ai/providers/base.provider.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L49)

#### Parameters

##### audioBuffer

`Buffer`

##### options?

[`AudioTranscriptionOptions`](../../../models/model.types/interfaces/AudioTranscriptionOptions.md)

#### Returns

`Promise`\<[`AudioResult`](../../../models/model.types/interfaces/AudioResult.md)\>

***

### validateApiKey()

> `protected` **validateApiKey**(): `void`

Defined in: [src/modules/ai/providers/base.provider.ts:112](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L112)

#### Returns

`void`

***

### withRetry()

> `protected` **withRetry**\<`T`\>(`operation`, `maxRetries`, `delay`): `Promise`\<`T`\>

Defined in: [src/modules/ai/providers/base.provider.ts:84](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L84)

#### Type Parameters

##### T

`T`

#### Parameters

##### operation

() => `Promise`\<`T`\>

##### maxRetries

`number` = `3`

##### delay

`number` = `1000`

#### Returns

`Promise`\<`T`\>

## Properties

### config

> `protected` **config**: [`ProviderConfig`](../../../models/model.types/interfaces/ProviderConfig.md)

Defined in: [src/modules/ai/providers/base.provider.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L21)

***

### name

> `protected` **name**: `string`

Defined in: [src/modules/ai/providers/base.provider.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L20)
