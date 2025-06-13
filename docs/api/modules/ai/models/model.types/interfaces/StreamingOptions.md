[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/ai/models/model.types](../README.md) / StreamingOptions

# Interface: StreamingOptions

Defined in: [src/modules/ai/models/model.types.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L152)

## Properties

### onComplete()?

> `optional` **onComplete**: (`result`) => `void`

Defined in: [src/modules/ai/models/model.types.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L154)

#### Parameters

##### result

[`CompletionResult`](CompletionResult.md)

#### Returns

`void`

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/modules/ai/models/model.types.ts:155](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L155)

#### Parameters

##### error

[`AiError`](AiError.md)

#### Returns

`void`

***

### onToken()?

> `optional` **onToken**: (`token`) => `void`

Defined in: [src/modules/ai/models/model.types.ts:153](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.types.ts#L153)

#### Parameters

##### token

`string`

#### Returns

`void`
