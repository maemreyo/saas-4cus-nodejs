[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.controller](../README.md) / AiController

# Class: AiController

Defined in: [src/modules/ai/ai.controller.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L34)

## Constructors

### Constructor

> **new AiController**(`aiService`, `cacheService`): `AiController`

Defined in: [src/modules/ai/ai.controller.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L35)

#### Parameters

##### aiService

[`AiService`](../../ai.service/classes/AiService.md)

##### cacheService

[`AiCacheService`](../../ai.cache/classes/AiCacheService.md)

#### Returns

`AiController`

## Methods

### addMessage()

> **addMessage**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:456](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L456)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### chat()

> **chat**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:79](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L79)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### clearCache()

> **clearCache**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:529](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L529)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### complete()

> **complete**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L41)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createApiKey()

> **createApiKey**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:469](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L469)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createConversation()

> **createConversation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:415](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L415)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createTemplate()

> **createTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:342](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L342)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteApiKey()

> **deleteApiKey**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:509](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L509)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteTemplate()

> **deleteTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:391](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L391)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### embed()

> **embed**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:120](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L120)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### generateImage()

> **generateImage**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:169](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L169)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getApiKeys()

> **getApiKeys**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:498](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L498)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCacheStats()

> **getCacheStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:520](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L520)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getConversation()

> **getConversation**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:445](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L445)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getConversations()

> **getConversations**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:434](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L434)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCurrentUsage()

> **getCurrentUsage**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:329](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L329)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getModels()

> **getModels**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:274](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L274)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getProviders()

> **getProviders**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:297](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L297)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTemplates()

> **getTemplates**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:362](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L362)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUsageStats()

> **getUsageStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:307](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L307)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### transcribeAudio()

> **transcribeAudio**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/ai/ai.controller.ts:207](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L207)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### updateTemplate()

> **updateTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:379](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L379)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### useTemplate()

> **useTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.controller.ts:401](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L401)

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### aiService

> `private` **aiService**: [`AiService`](../../ai.service/classes/AiService.md)

Defined in: [src/modules/ai/ai.controller.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L36)

***

### cacheService

> `private` **cacheService**: [`AiCacheService`](../../ai.cache/classes/AiCacheService.md)

Defined in: [src/modules/ai/ai.controller.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.controller.ts#L37)
