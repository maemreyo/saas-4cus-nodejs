[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/ai/models/model.types](../README.md) / ChatResult

# Interface: ChatResult

Defined in: [src/modules/ai/models/model.types.ts:106](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L106)

## Extends

- [`CompletionResult`](CompletionResult.md)

## Properties

### cached?

> `optional` **cached**: `boolean`

Defined in: [src/modules/ai/models/model.types.ts:103](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L103)

#### Inherited from

[`CompletionResult`](CompletionResult.md).[`cached`](CompletionResult.md#cached)

***

### finishReason

> **finishReason**: `"length"` \| `"stop"` \| `"content_filter"` \| `"function_call"`

Defined in: [src/modules/ai/models/model.types.ts:102](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L102)

#### Inherited from

[`CompletionResult`](CompletionResult.md).[`finishReason`](CompletionResult.md#finishreason)

***

### id

> **id**: `string`

Defined in: [src/modules/ai/models/model.types.ts:98](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L98)

#### Inherited from

[`CompletionResult`](CompletionResult.md).[`id`](CompletionResult.md#id)

***

### message

> **message**: [`ChatMessage`](ChatMessage.md)

Defined in: [src/modules/ai/models/model.types.ts:107](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L107)

***

### model

> **model**: `string`

Defined in: [src/modules/ai/models/model.types.ts:100](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L100)

#### Inherited from

[`CompletionResult`](CompletionResult.md).[`model`](CompletionResult.md#model)

***

### text

> **text**: `string`

Defined in: [src/modules/ai/models/model.types.ts:99](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L99)

#### Inherited from

[`CompletionResult`](CompletionResult.md).[`text`](CompletionResult.md#text)

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [src/modules/ai/models/model.types.ts:101](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L101)

#### Inherited from

[`CompletionResult`](CompletionResult.md).[`usage`](CompletionResult.md#usage)
