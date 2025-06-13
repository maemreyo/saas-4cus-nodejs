[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.service](../README.md) / AiService

# Class: AiService

Defined in: [src/modules/ai/ai.service.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L42)

## Constructors

### Constructor

> **new AiService**(`cacheService`, `billingService`, `entitlementService`, `analyticsService`): `AiService`

Defined in: [src/modules/ai/ai.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L46)

#### Parameters

##### cacheService

[`AiCacheService`](../../ai.cache/classes/AiCacheService.md)

##### billingService

[`BillingService`](../../../billing/billing.service/classes/BillingService.md)

##### entitlementService

[`EntitlementService`](../../../features/entitlement.service/classes/EntitlementService.md)

##### analyticsService

[`AnalyticsService`](../../../analytics/analytics.service/classes/AnalyticsService.md)

#### Returns

`AiService`

## Methods

### chat()

> **chat**(`messages`, `options`): `Promise`\<[`ChatResult`](../../models/model.types/interfaces/ChatResult.md)\>

Defined in: [src/modules/ai/ai.service.ts:436](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L436)

#### Parameters

##### messages

[`ChatMessage`](../../models/model.types/interfaces/ChatMessage.md)[]

##### options

[`ChatOptions`](../../models/model.types/interfaces/ChatOptions.md) & [`AiProviderOptions`](../../models/model.types/interfaces/AiProviderOptions.md)

#### Returns

`Promise`\<[`ChatResult`](../../models/model.types/interfaces/ChatResult.md)\>

***

### checkQuotas()

> `private` **checkQuotas**(`userId`, `operation`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.service.ts:285](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L285)

#### Parameters

##### userId

`string`

##### operation

`string`

#### Returns

`Promise`\<`void`\>

***

### complete()

> **complete**(`prompt`, `options`): `Promise`\<[`CompletionResult`](../../models/model.types/interfaces/CompletionResult.md)\>

Defined in: [src/modules/ai/ai.service.ts:326](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L326)

#### Parameters

##### prompt

`string`

##### options

[`CompletionOptions`](../../models/model.types/interfaces/CompletionOptions.md) & [`AiProviderOptions`](../../models/model.types/interfaces/AiProviderOptions.md)

#### Returns

`Promise`\<[`CompletionResult`](../../models/model.types/interfaces/CompletionResult.md)\>

***

### createApiKey()

> **createApiKey**(`userId`, `providerId`, `name`, `apiKey`, `tenantId?`, `expiresAt?`, `usageLimit?`): `Promise`\<\{ \}\>

Defined in: [src/modules/ai/ai.service.ts:148](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L148)

#### Parameters

##### userId

`string`

##### providerId

`string`

##### name

`string`

##### apiKey

`string`

##### tenantId?

`string`

##### expiresAt?

`Date`

##### usageLimit?

`number`

#### Returns

`Promise`\<\{ \}\>

***

### createConversation()

> **createConversation**(`userId`, `data`, `tenantId?`): `Promise`\<\{ \}\>

Defined in: [src/modules/ai/ai.service.ts:891](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L891)

#### Parameters

##### userId

`string`

##### data

###### messages

[`ChatMessage`](../../models/model.types/interfaces/ChatMessage.md)[]

###### metadata?

`any`

###### model

`string`

###### provider

`string`

###### title?

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<\{ \}\>

***

### createProviderWithApiKey()

> `private` **createProviderWithApiKey**(`providerName`, `apiKey`): [`BaseAiProvider`](../../providers/base.provider/classes/BaseAiProvider.md)

Defined in: [src/modules/ai/ai.service.ts:122](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L122)

#### Parameters

##### providerName

`string`

##### apiKey

#### Returns

[`BaseAiProvider`](../../providers/base.provider/classes/BaseAiProvider.md)

***

### createTemplate()

> **createTemplate**(`userId`, `data`, `tenantId?`): `Promise`\<\{ \}\>

Defined in: [src/modules/ai/ai.service.ts:779](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L779)

#### Parameters

##### userId

`string`

##### data

###### category?

`string`

###### description?

`string`

###### isPublic?

`boolean`

###### name

`string`

###### prompt

`string`

###### variables?

`Record`\<`string`, `string`\>

##### tenantId?

`string`

#### Returns

`Promise`\<\{ \}\>

***

### embed()

> **embed**(`text`, `options`): `Promise`\<[`EmbeddingResult`](../../models/model.types/interfaces/EmbeddingResult.md) \| [`EmbeddingResult`](../../models/model.types/interfaces/EmbeddingResult.md)[]\>

Defined in: [src/modules/ai/ai.service.ts:544](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L544)

#### Parameters

##### text

`string` | `string`[]

##### options

[`EmbeddingOptions`](../../models/model.types/interfaces/EmbeddingOptions.md) & [`AiProviderOptions`](../../models/model.types/interfaces/AiProviderOptions.md)

#### Returns

`Promise`\<[`EmbeddingResult`](../../models/model.types/interfaces/EmbeddingResult.md) \| [`EmbeddingResult`](../../models/model.types/interfaces/EmbeddingResult.md)[]\>

***

### generateImage()

> **generateImage**(`options`): `Promise`\<[`ImageResult`](../../models/model.types/interfaces/ImageResult.md)\>

Defined in: [src/modules/ai/ai.service.ts:631](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L631)

#### Parameters

##### options

[`ImageGenerationOptions`](../../models/model.types/interfaces/ImageGenerationOptions.md) & [`AiProviderOptions`](../../models/model.types/interfaces/AiProviderOptions.md)

#### Returns

`Promise`\<[`ImageResult`](../../models/model.types/interfaces/ImageResult.md)\>

***

### getAvailableModels()

> **getAvailableModels**(`capabilities?`): `Promise`\<`any`[]\>

Defined in: [src/modules/ai/ai.service.ts:1066](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L1066)

#### Parameters

##### capabilities?

`any`

#### Returns

`Promise`\<`any`[]\>

***

### getCurrentMonthUsage()

> **getCurrentMonthUsage**(`userId`, `tenantId?`): `Promise`\<\{ `byModel`: `Record`\<`string`, \{ `cost`: `number`; `tokens`: `number`; \}\>; `totalCost`: `number`; `totalTokens`: `number`; \}\>

Defined in: [src/modules/ai/ai.service.ts:967](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L967)

#### Parameters

##### userId

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<\{ `byModel`: `Record`\<`string`, \{ `cost`: `number`; `tokens`: `number`; \}\>; `totalCost`: `number`; `totalTokens`: `number`; \}\>

***

### getProvider()

> `private` **getProvider**(`providerName?`, `userId?`, `tenantId?`): `Promise`\<[`BaseAiProvider`](../../providers/base.provider/classes/BaseAiProvider.md)\>

Defined in: [src/modules/ai/ai.service.ts:91](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L91)

#### Parameters

##### providerName?

`string`

##### userId?

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<[`BaseAiProvider`](../../providers/base.provider/classes/BaseAiProvider.md)\>

***

### getProviders()

> **getProviders**(): `Promise`\<`any`[]\>

Defined in: [src/modules/ai/ai.service.ts:1070](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L1070)

#### Returns

`Promise`\<`any`[]\>

***

### getTemplates()

> **getTemplates**(`userId`, `filters?`, `tenantId?`): `Promise`\<`object`[]\>

Defined in: [src/modules/ai/ai.service.ts:812](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L812)

#### Parameters

##### userId

`string`

##### filters?

###### category?

`string`

###### isPublic?

`boolean`

###### search?

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<`object`[]\>

***

### getUsageStats()

> **getUsageStats**(`userId`, `startDate?`, `endDate?`, `tenantId?`): `Promise`\<`any`\>

Defined in: [src/modules/ai/ai.service.ts:1004](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L1004)

#### Parameters

##### userId

`string`

##### startDate?

`Date`

##### endDate?

`Date`

##### tenantId?

`string`

#### Returns

`Promise`\<`any`\>

***

### getUserApiKey()

> `private` **getUserApiKey**(`userId`, `providerName`, `tenantId?`): `Promise`\<\{ \}\>

Defined in: [src/modules/ai/ai.service.ts:192](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L192)

#### Parameters

##### userId

`string`

##### providerName

`string`

##### tenantId?

`string`

#### Returns

`Promise`\<\{ \}\>

***

### initializeProviders()

> `private` **initializeProviders**(): `void`

Defined in: [src/modules/ai/ai.service.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L55)

#### Returns

`void`

***

### trackUsage()

> `private` **trackUsage**(`userId`, `providerId`, `model`, `operation`, `usage`, `cost`, `latency`, `cached`, `tenantId?`, `error?`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.service.ts:233](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L233)

#### Parameters

##### userId

`string`

##### providerId

`string`

##### model

`string`

##### operation

`string`

##### usage

###### completionTokens

`number`

###### promptTokens

`number`

##### cost

`number`

##### latency

`number`

##### cached

`boolean`

##### tenantId?

`string`

##### error?

`string`

#### Returns

`Promise`\<`void`\>

***

### transcribeAudio()

> **transcribeAudio**(`audioBuffer`, `options`): `Promise`\<[`AudioResult`](../../models/model.types/interfaces/AudioResult.md)\>

Defined in: [src/modules/ai/ai.service.ts:711](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L711)

#### Parameters

##### audioBuffer

`Buffer`

##### options

[`AudioTranscriptionOptions`](../../models/model.types/interfaces/AudioTranscriptionOptions.md) & [`AiProviderOptions`](../../models/model.types/interfaces/AiProviderOptions.md)

#### Returns

`Promise`\<[`AudioResult`](../../models/model.types/interfaces/AudioResult.md)\>

***

### updateConversation()

> **updateConversation**(`conversationId`, `messages`, `userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/ai/ai.service.ts:932](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L932)

#### Parameters

##### conversationId

`string`

##### messages

[`ChatMessage`](../../models/model.types/interfaces/ChatMessage.md)[]

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### useTemplate()

> **useTemplate**(`templateId`, `variables`, `userId`): `Promise`\<`string`\>

Defined in: [src/modules/ai/ai.service.ts:848](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L848)

#### Parameters

##### templateId

`string`

##### variables

`Record`\<`string`, `string`\>

##### userId

`string`

#### Returns

`Promise`\<`string`\>

## Properties

### analyticsService

> `private` **analyticsService**: [`AnalyticsService`](../../../analytics/analytics.service/classes/AnalyticsService.md)

Defined in: [src/modules/ai/ai.service.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L50)

***

### billingService

> `private` **billingService**: [`BillingService`](../../../billing/billing.service/classes/BillingService.md)

Defined in: [src/modules/ai/ai.service.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L48)

***

### cacheService

> `private` **cacheService**: [`AiCacheService`](../../ai.cache/classes/AiCacheService.md)

Defined in: [src/modules/ai/ai.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L47)

***

### defaultProvider

> `private` **defaultProvider**: `string` = `'openai'`

Defined in: [src/modules/ai/ai.service.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L44)

***

### entitlementService

> `private` **entitlementService**: [`EntitlementService`](../../../features/entitlement.service/classes/EntitlementService.md)

Defined in: [src/modules/ai/ai.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L49)

***

### providers

> `private` **providers**: `Map`\<`string`, [`BaseAiProvider`](../../providers/base.provider/classes/BaseAiProvider.md)\>

Defined in: [src/modules/ai/ai.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.service.ts#L43)
