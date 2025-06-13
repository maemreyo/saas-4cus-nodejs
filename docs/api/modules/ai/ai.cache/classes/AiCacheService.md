[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.cache](../README.md) / AiCacheService

# Class: AiCacheService

Defined in: [src/modules/ai/ai.cache.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L27)

## Constructors

### Constructor

> **new AiCacheService**(): `AiCacheService`

#### Returns

`AiCacheService`

## Methods

### clear()

> **clear**(`type?`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.cache.ts:334](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L334)

#### Parameters

##### type?

`"completion"` | `"chat"` | `"embedding"` | `"image"`

#### Returns

`Promise`\<`void`\>

***

### generateKey()

> `private` **generateKey**(`type`, `input`, `options`, `userId?`): `string`

Defined in: [src/modules/ai/ai.cache.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L38)

#### Parameters

##### type

`string`

##### input

`any`

##### options

`any`

##### userId?

`string`

#### Returns

`string`

***

### getChat()

> **getChat**(`messages`, `options`, `userId?`): `Promise`\<[`ChatResult`](../../models/model.types/interfaces/ChatResult.md)\>

Defined in: [src/modules/ai/ai.cache.ts:126](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L126)

#### Parameters

##### messages

[`ChatMessage`](../../models/model.types/interfaces/ChatMessage.md)[]

##### options

[`ChatOptions`](../../models/model.types/interfaces/ChatOptions.md)

##### userId?

`string`

#### Returns

`Promise`\<[`ChatResult`](../../models/model.types/interfaces/ChatResult.md)\>

***

### getCompletion()

> **getCompletion**(`prompt`, `options`, `userId?`): `Promise`\<[`CompletionResult`](../../models/model.types/interfaces/CompletionResult.md)\>

Defined in: [src/modules/ai/ai.cache.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L64)

#### Parameters

##### prompt

`string`

##### options

[`CompletionOptions`](../../models/model.types/interfaces/CompletionOptions.md)

##### userId?

`string`

#### Returns

`Promise`\<[`CompletionResult`](../../models/model.types/interfaces/CompletionResult.md)\>

***

### getEmbedding()

> **getEmbedding**(`text`, `options`, `userId?`): `Promise`\<[`EmbeddingResult`](../../models/model.types/interfaces/EmbeddingResult.md)\>

Defined in: [src/modules/ai/ai.cache.ts:188](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L188)

#### Parameters

##### text

`string`

##### options

[`EmbeddingOptions`](../../models/model.types/interfaces/EmbeddingOptions.md)

##### userId?

`string`

#### Returns

`Promise`\<[`EmbeddingResult`](../../models/model.types/interfaces/EmbeddingResult.md)\>

***

### getImage()

> **getImage**(`options`, `userId?`): `Promise`\<[`ImageResult`](../../models/model.types/interfaces/ImageResult.md)\>

Defined in: [src/modules/ai/ai.cache.ts:242](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L242)

#### Parameters

##### options

[`ImageGenerationOptions`](../../models/model.types/interfaces/ImageGenerationOptions.md)

##### userId?

`string`

#### Returns

`Promise`\<[`ImageResult`](../../models/model.types/interfaces/ImageResult.md)\>

***

### getStats()

> **getStats**(): `Promise`\<\{ `hitRate`: `number`; `hits`: `number`; `misses`: `number`; `size`: `number`; \}\>

Defined in: [src/modules/ai/ai.cache.ts:293](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L293)

#### Returns

`Promise`\<\{ `hitRate`: `number`; `hits`: `number`; `misses`: `number`; `size`: `number`; \}\>

***

### setChat()

> **setChat**(`messages`, `options`, `result`, `userId?`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.cache.ts:163](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L163)

#### Parameters

##### messages

[`ChatMessage`](../../models/model.types/interfaces/ChatMessage.md)[]

##### options

[`ChatOptions`](../../models/model.types/interfaces/ChatOptions.md)

##### result

[`ChatResult`](../../models/model.types/interfaces/ChatResult.md)

##### userId?

`string`

#### Returns

`Promise`\<`void`\>

***

### setCompletion()

> **setCompletion**(`prompt`, `options`, `result`, `userId?`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.cache.ts:101](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L101)

#### Parameters

##### prompt

`string`

##### options

[`CompletionOptions`](../../models/model.types/interfaces/CompletionOptions.md)

##### result

[`CompletionResult`](../../models/model.types/interfaces/CompletionResult.md)

##### userId?

`string`

#### Returns

`Promise`\<`void`\>

***

### setEmbedding()

> **setEmbedding**(`text`, `options`, `result`, `userId?`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.cache.ts:217](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L217)

#### Parameters

##### text

`string`

##### options

[`EmbeddingOptions`](../../models/model.types/interfaces/EmbeddingOptions.md)

##### result

[`EmbeddingResult`](../../models/model.types/interfaces/EmbeddingResult.md)

##### userId?

`string`

#### Returns

`Promise`\<`void`\>

***

### setImage()

> **setImage**(`options`, `result`, `userId?`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.cache.ts:270](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L270)

#### Parameters

##### options

[`ImageGenerationOptions`](../../models/model.types/interfaces/ImageGenerationOptions.md)

##### result

[`ImageResult`](../../models/model.types/interfaces/ImageResult.md)

##### userId?

`string`

#### Returns

`Promise`\<`void`\>

***

### warmUp()

> **warmUp**(`commonRequests`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.cache.ts:349](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L349)

#### Parameters

##### commonRequests

`object`[]

#### Returns

`Promise`\<`void`\>

## Properties

### config

> `private` **config**: [`CacheConfig`](../-internal-/interfaces/CacheConfig.md)

Defined in: [src/modules/ai/ai.cache.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L28)

***

### namespace

> `private` **namespace**: `string` = `'ai:cache'`

Defined in: [src/modules/ai/ai.cache.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.cache.ts#L35)
