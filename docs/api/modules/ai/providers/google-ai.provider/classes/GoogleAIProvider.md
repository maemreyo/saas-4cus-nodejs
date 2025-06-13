[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/ai/providers/google-ai.provider](../README.md) / GoogleAIProvider

# Class: GoogleAIProvider

Defined in: [src/modules/ai/providers/google-ai.provider.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L21)

## Extends

- [`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md)

## Constructors

### Constructor

> **new GoogleAIProvider**(`config`): `GoogleAIProvider`

Defined in: [src/modules/ai/providers/google-ai.provider.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L24)

#### Parameters

##### config

[`ProviderConfig`](../../../models/model.types/interfaces/ProviderConfig.md)

#### Returns

`GoogleAIProvider`

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`constructor`](../../base.provider/classes/BaseAiProvider.md#constructor)

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

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`calculateCost`](../../base.provider/classes/BaseAiProvider.md#calculatecost)

***

### chat()

> **chat**(`messages`, `options`): `Promise`\<[`ChatResult`](../../../models/model.types/interfaces/ChatResult.md)\>

Defined in: [src/modules/ai/providers/google-ai.provider.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L68)

#### Parameters

##### messages

[`ChatMessage`](../../../models/model.types/interfaces/ChatMessage.md)[]

##### options

[`ChatOptions`](../../../models/model.types/interfaces/ChatOptions.md) = `{}`

#### Returns

`Promise`\<[`ChatResult`](../../../models/model.types/interfaces/ChatResult.md)\>

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`chat`](../../base.provider/classes/BaseAiProvider.md#chat)

***

### complete()

> **complete**(`prompt`, `options`): `Promise`\<[`CompletionResult`](../../../models/model.types/interfaces/CompletionResult.md)\>

Defined in: [src/modules/ai/providers/google-ai.provider.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L43)

#### Parameters

##### prompt

`string`

##### options

[`CompletionOptions`](../../../models/model.types/interfaces/CompletionOptions.md) = `{}`

#### Returns

`Promise`\<[`CompletionResult`](../../../models/model.types/interfaces/CompletionResult.md)\>

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`complete`](../../base.provider/classes/BaseAiProvider.md#complete)

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

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`createError`](../../base.provider/classes/BaseAiProvider.md#createerror)

***

### embed()

> **embed**(`text`, `options`): `Promise`\<[`EmbeddingResult`](../../../models/model.types/interfaces/EmbeddingResult.md) \| [`EmbeddingResult`](../../../models/model.types/interfaces/EmbeddingResult.md)[]\>

Defined in: [src/modules/ai/providers/google-ai.provider.ts:138](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L138)

#### Parameters

##### text

`string` | `string`[]

##### options

[`EmbeddingOptions`](../../../models/model.types/interfaces/EmbeddingOptions.md) = `{}`

#### Returns

`Promise`\<[`EmbeddingResult`](../../../models/model.types/interfaces/EmbeddingResult.md) \| [`EmbeddingResult`](../../../models/model.types/interfaces/EmbeddingResult.md)[]\>

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`embed`](../../base.provider/classes/BaseAiProvider.md#embed)

***

### estimateTokens()

> `protected` **estimateTokens**(`text`): `number`

Defined in: [src/modules/ai/providers/base.provider.ts:184](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L184)

#### Parameters

##### text

`string`

#### Returns

`number`

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`estimateTokens`](../../base.provider/classes/BaseAiProvider.md#estimatetokens)

***

### generateImage()

> **generateImage**(`options`): `Promise`\<[`ImageResult`](../../../models/model.types/interfaces/ImageResult.md)\>

Defined in: [src/modules/ai/providers/google-ai.provider.ts:177](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L177)

#### Parameters

##### options

[`ImageGenerationOptions`](../../../models/model.types/interfaces/ImageGenerationOptions.md)

#### Returns

`Promise`\<[`ImageResult`](../../../models/model.types/interfaces/ImageResult.md)\>

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`generateImage`](../../base.provider/classes/BaseAiProvider.md#generateimage)

***

### getHeaders()

> `protected` **getHeaders**(): `Record`\<`string`, `string`\>

Defined in: [src/modules/ai/providers/base.provider.ts:122](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L122)

#### Returns

`Record`\<`string`, `string`\>

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`getHeaders`](../../base.provider/classes/BaseAiProvider.md#getheaders)

***

### getName()

> **getName**(): `string`

Defined in: [src/modules/ai/providers/base.provider.ts:189](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L189)

#### Returns

`string`

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`getName`](../../base.provider/classes/BaseAiProvider.md#getname)

***

### isAvailable()

> **isAvailable**(): `Promise`\<`boolean`\>

Defined in: [src/modules/ai/providers/google-ai.provider.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L32)

#### Returns

`Promise`\<`boolean`\>

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`isAvailable`](../../base.provider/classes/BaseAiProvider.md#isavailable)

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

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`makeRequest`](../../base.provider/classes/BaseAiProvider.md#makerequest)

***

### streamChat()

> **streamChat**(`messages`, `options`): `Promise`\<`void`\>

Defined in: [src/modules/ai/providers/google-ai.provider.ts:200](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L200)

#### Parameters

##### messages

[`ChatMessage`](../../../models/model.types/interfaces/ChatMessage.md)[]

##### options

[`ChatOptions`](../../../models/model.types/interfaces/ChatOptions.md) & [`StreamingOptions`](../../../models/model.types/interfaces/StreamingOptions.md)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`streamChat`](../../base.provider/classes/BaseAiProvider.md#streamchat)

***

### streamComplete()

> **streamComplete**(`prompt`, `options`): `Promise`\<`void`\>

Defined in: [src/modules/ai/providers/google-ai.provider.ts:276](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L276)

#### Parameters

##### prompt

`string`

##### options

[`CompletionOptions`](../../../models/model.types/interfaces/CompletionOptions.md) & [`StreamingOptions`](../../../models/model.types/interfaces/StreamingOptions.md)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`streamComplete`](../../base.provider/classes/BaseAiProvider.md#streamcomplete)

***

### transcribeAudio()

> **transcribeAudio**(`audioBuffer`, `options?`): `Promise`\<[`AudioResult`](../../../models/model.types/interfaces/AudioResult.md)\>

Defined in: [src/modules/ai/providers/google-ai.provider.ts:188](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L188)

#### Parameters

##### audioBuffer

`Buffer`

##### options?

[`AudioTranscriptionOptions`](../../../models/model.types/interfaces/AudioTranscriptionOptions.md)

#### Returns

`Promise`\<[`AudioResult`](../../../models/model.types/interfaces/AudioResult.md)\>

#### Overrides

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`transcribeAudio`](../../base.provider/classes/BaseAiProvider.md#transcribeaudio)

***

### validateApiKey()

> `protected` **validateApiKey**(): `void`

Defined in: [src/modules/ai/providers/base.provider.ts:112](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L112)

#### Returns

`void`

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`validateApiKey`](../../base.provider/classes/BaseAiProvider.md#validateapikey)

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

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`withRetry`](../../base.provider/classes/BaseAiProvider.md#withretry)

## Properties

### config

> `protected` **config**: [`ProviderConfig`](../../../models/model.types/interfaces/ProviderConfig.md)

Defined in: [src/modules/ai/providers/base.provider.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L21)

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`config`](../../base.provider/classes/BaseAiProvider.md#config)

***

### genAI

> `private` **genAI**: `GoogleGenerativeAI`

Defined in: [src/modules/ai/providers/google-ai.provider.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/google-ai.provider.ts#L22)

***

### name

> `protected` **name**: `string`

Defined in: [src/modules/ai/providers/base.provider.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/providers/base.provider.ts#L20)

#### Inherited from

[`BaseAiProvider`](../../base.provider/classes/BaseAiProvider.md).[`name`](../../base.provider/classes/BaseAiProvider.md#name)
