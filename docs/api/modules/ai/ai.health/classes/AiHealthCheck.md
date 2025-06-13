[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.health](../README.md) / AiHealthCheck

# Class: AiHealthCheck

Defined in: [src/modules/ai/ai.health.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L19)

## Constructors

### Constructor

> **new AiHealthCheck**(`healthService`, `aiService`, `cacheService`): `AiHealthCheck`

Defined in: [src/modules/ai/ai.health.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L20)

#### Parameters

##### healthService

[`HealthService`](../../../../infrastructure/health/health.service/classes/HealthService.md)

##### aiService

[`AiService`](../../ai.service/classes/AiService.md)

##### cacheService

[`AiCacheService`](../../ai.cache/classes/AiCacheService.md)

#### Returns

`AiHealthCheck`

## Methods

### calculateOverallStatus()

> `private` **calculateOverallStatus**(`statuses`): [`HealthStatus`](../../../../infrastructure/health/health.types/enumerations/HealthStatus.md)

Defined in: [src/modules/ai/ai.health.ts:270](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L270)

#### Parameters

##### statuses

[`HealthStatus`](../../../../infrastructure/health/health.types/enumerations/HealthStatus.md)[]

#### Returns

[`HealthStatus`](../../../../infrastructure/health/health.types/enumerations/HealthStatus.md)

***

### createProviderInstance()

> `private` **createProviderInstance**(`providerName`): `Promise`\<[`OpenAIProvider`](../../providers/openai.provider/classes/OpenAIProvider.md) \| [`MockProvider`](../../providers/mock.provider/classes/MockProvider.md) \| [`AnthropicProvider`](../../providers/anthropic.provider/classes/AnthropicProvider.md) \| [`GoogleAIProvider`](../../providers/google-ai.provider/classes/GoogleAIProvider.md) \| [`OllamaProvider`](../../providers/ollama.provider/classes/OllamaProvider.md)\>

Defined in: [src/modules/ai/ai.health.ts:156](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L156)

#### Parameters

##### providerName

`string`

#### Returns

`Promise`\<[`OpenAIProvider`](../../providers/openai.provider/classes/OpenAIProvider.md) \| [`MockProvider`](../../providers/mock.provider/classes/MockProvider.md) \| [`AnthropicProvider`](../../providers/anthropic.provider/classes/AnthropicProvider.md) \| [`GoogleAIProvider`](../../providers/google-ai.provider/classes/GoogleAIProvider.md) \| [`OllamaProvider`](../../providers/ollama.provider/classes/OllamaProvider.md)\>

***

### getHealthSummary()

> **getHealthSummary**(): `Promise`\<\{ `cache`: [`HealthCheckResult`](../../../../infrastructure/health/health.types/interfaces/HealthCheckResult.md); `providers`: `object`[]; `service`: [`HealthCheckResult`](../../../../infrastructure/health/health.types/interfaces/HealthCheckResult.md); `stats`: \{ `errorRate`: `number`; `today`: \{ `avgLatency`: `number`; `cost`: `number`; `requests`: `number`; `tokens`: `number`; \}; \}; `status`: [`HealthStatus`](../../../../infrastructure/health/health.types/enumerations/HealthStatus.md); `timestamp`: `string`; `usage`: [`HealthCheckResult`](../../../../infrastructure/health/health.types/interfaces/HealthCheckResult.md); \}\>

Defined in: [src/modules/ai/ai.health.ts:189](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L189)

#### Returns

`Promise`\<\{ `cache`: [`HealthCheckResult`](../../../../infrastructure/health/health.types/interfaces/HealthCheckResult.md); `providers`: `object`[]; `service`: [`HealthCheckResult`](../../../../infrastructure/health/health.types/interfaces/HealthCheckResult.md); `stats`: \{ `errorRate`: `number`; `today`: \{ `avgLatency`: `number`; `cost`: `number`; `requests`: `number`; `tokens`: `number`; \}; \}; `status`: [`HealthStatus`](../../../../infrastructure/health/health.types/enumerations/HealthStatus.md); `timestamp`: `string`; `usage`: [`HealthCheckResult`](../../../../infrastructure/health/health.types/interfaces/HealthCheckResult.md); \}\>

***

### register()

> **register**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.health.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L26)

#### Returns

`Promise`\<`void`\>

***

### registerProviderHealthChecks()

> `private` **registerProviderHealthChecks**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.health.ts:106](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L106)

#### Returns

`Promise`\<`void`\>

## Properties

### aiService

> `private` **aiService**: [`AiService`](../../ai.service/classes/AiService.md)

Defined in: [src/modules/ai/ai.health.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L22)

***

### cacheService

> `private` **cacheService**: [`AiCacheService`](../../ai.cache/classes/AiCacheService.md)

Defined in: [src/modules/ai/ai.health.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L23)

***

### healthService

> `private` **healthService**: [`HealthService`](../../../../infrastructure/health/health.service/classes/HealthService.md)

Defined in: [src/modules/ai/ai.health.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.health.ts#L21)
