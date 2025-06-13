[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/ai/models/model.types](../README.md) / CompletionResult

# Interface: CompletionResult

Defined in: [src/modules/ai/models/model.types.ts:97](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/models/model.types.ts#L97)

## Extended by

- [`ChatResult`](ChatResult.md)

## Properties

### cached?

> `optional` **cached**: `boolean`

Defined in: [src/modules/ai/models/model.types.ts:103](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/models/model.types.ts#L103)

***

### finishReason

> **finishReason**: `"length"` \| `"stop"` \| `"content_filter"` \| `"function_call"`

Defined in: [src/modules/ai/models/model.types.ts:102](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/models/model.types.ts#L102)

***

### id

> **id**: `string`

Defined in: [src/modules/ai/models/model.types.ts:98](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/models/model.types.ts#L98)

***

### model

> **model**: `string`

Defined in: [src/modules/ai/models/model.types.ts:100](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/models/model.types.ts#L100)

***

### text

> **text**: `string`

Defined in: [src/modules/ai/models/model.types.ts:99](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/models/model.types.ts#L99)

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [src/modules/ai/models/model.types.ts:101](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/models/model.types.ts#L101)
