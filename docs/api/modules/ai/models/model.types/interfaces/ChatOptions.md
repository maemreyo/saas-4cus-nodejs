[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/ai/models/model.types](../README.md) / ChatOptions

# Interface: ChatOptions

Defined in: [src/modules/ai/models/model.types.ts:63](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L63)

## Extends

- [`CompletionOptions`](CompletionOptions.md)

## Properties

### frequencyPenalty?

> `optional` **frequencyPenalty**: `number`

Defined in: [src/modules/ai/models/model.types.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L45)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`frequencyPenalty`](CompletionOptions.md#frequencypenalty)

***

### functionCall?

> `optional` **functionCall**: `"none"` \| `"auto"` \| \{ `name`: `string`; \}

Defined in: [src/modules/ai/models/model.types.ts:69](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L69)

***

### functions?

> `optional` **functions**: `object`[]

Defined in: [src/modules/ai/models/model.types.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L64)

#### description

> **description**: `string`

#### name

> **name**: `string`

#### parameters

> **parameters**: `any`

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [src/modules/ai/models/model.types.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L43)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`maxTokens`](CompletionOptions.md#maxtokens)

***

### model?

> `optional` **model**: `string`

Defined in: [src/modules/ai/models/model.types.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L41)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`model`](CompletionOptions.md#model)

***

### presencePenalty?

> `optional` **presencePenalty**: `number`

Defined in: [src/modules/ai/models/model.types.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L46)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`presencePenalty`](CompletionOptions.md#presencepenalty)

***

### stop?

> `optional` **stop**: `string`[]

Defined in: [src/modules/ai/models/model.types.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L47)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`stop`](CompletionOptions.md#stop)

***

### stream?

> `optional` **stream**: `boolean`

Defined in: [src/modules/ai/models/model.types.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L49)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`stream`](CompletionOptions.md#stream)

***

### systemPrompt?

> `optional` **systemPrompt**: `string`

Defined in: [src/modules/ai/models/model.types.ts:48](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L48)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`systemPrompt`](CompletionOptions.md#systemprompt)

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [src/modules/ai/models/model.types.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L42)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`temperature`](CompletionOptions.md#temperature)

***

### topP?

> `optional` **topP**: `number`

Defined in: [src/modules/ai/models/model.types.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L44)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`topP`](CompletionOptions.md#topp)

***

### user?

> `optional` **user**: `string`

Defined in: [src/modules/ai/models/model.types.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L50)

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`user`](CompletionOptions.md#user)
