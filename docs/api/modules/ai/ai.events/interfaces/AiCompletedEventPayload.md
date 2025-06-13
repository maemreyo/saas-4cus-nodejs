[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.events](../README.md) / AiCompletedEventPayload

# Interface: AiCompletedEventPayload

Defined in: [src/modules/ai/ai.events.ts:71](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L71)

## Extends

- [`AiRequestEventPayload`](AiRequestEventPayload.md)

## Properties

### cached

> **cached**: `boolean`

Defined in: [src/modules/ai/ai.events.ts:77](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L77)

***

### completionTokens

> **completionTokens**: `number`

Defined in: [src/modules/ai/ai.events.ts:73](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L73)

***

### cost

> **cost**: `number`

Defined in: [src/modules/ai/ai.events.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L75)

***

### latency

> **latency**: `number`

Defined in: [src/modules/ai/ai.events.ts:76](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L76)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [src/modules/ai/ai.events.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L68)

#### Inherited from

[`AiRequestEventPayload`](AiRequestEventPayload.md).[`metadata`](AiRequestEventPayload.md#metadata)

***

### model

> **model**: `string`

Defined in: [src/modules/ai/ai.events.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L65)

#### Inherited from

[`AiRequestEventPayload`](AiRequestEventPayload.md).[`model`](AiRequestEventPayload.md#model)

***

### operation

> **operation**: `"completion"` \| `"chat"` \| `"embedding"` \| `"image"` \| `"audio"`

Defined in: [src/modules/ai/ai.events.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L67)

#### Inherited from

[`AiRequestEventPayload`](AiRequestEventPayload.md).[`operation`](AiRequestEventPayload.md#operation)

***

### promptTokens

> **promptTokens**: `number`

Defined in: [src/modules/ai/ai.events.ts:72](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L72)

***

### provider

> **provider**: `string`

Defined in: [src/modules/ai/ai.events.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L66)

#### Inherited from

[`AiRequestEventPayload`](AiRequestEventPayload.md).[`provider`](AiRequestEventPayload.md#provider)

***

### requestId

> **requestId**: `string`

Defined in: [src/modules/ai/ai.events.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L64)

#### Inherited from

[`AiRequestEventPayload`](AiRequestEventPayload.md).[`requestId`](AiRequestEventPayload.md#requestid)

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [src/modules/ai/ai.events.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L59)

#### Inherited from

[`AiRequestEventPayload`](AiRequestEventPayload.md).[`tenantId`](AiRequestEventPayload.md#tenantid)

***

### timestamp

> **timestamp**: `Date`

Defined in: [src/modules/ai/ai.events.ts:60](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L60)

#### Inherited from

[`AiRequestEventPayload`](AiRequestEventPayload.md).[`timestamp`](AiRequestEventPayload.md#timestamp)

***

### totalTokens

> **totalTokens**: `number`

Defined in: [src/modules/ai/ai.events.ts:74](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L74)

***

### userId

> **userId**: `string`

Defined in: [src/modules/ai/ai.events.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L58)

#### Inherited from

[`AiRequestEventPayload`](AiRequestEventPayload.md).[`userId`](AiRequestEventPayload.md#userid)
