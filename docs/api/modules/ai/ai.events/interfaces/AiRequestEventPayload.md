[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.events](../README.md) / AiRequestEventPayload

# Interface: AiRequestEventPayload

Defined in: [src/modules/ai/ai.events.ts:63](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L63)

## Extends

- [`AiEventPayload`](AiEventPayload.md)

## Extended by

- [`AiCompletedEventPayload`](AiCompletedEventPayload.md)
- [`AiFailedEventPayload`](AiFailedEventPayload.md)

## Properties

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [src/modules/ai/ai.events.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L68)

***

### model

> **model**: `string`

Defined in: [src/modules/ai/ai.events.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L65)

***

### operation

> **operation**: `"completion"` \| `"chat"` \| `"embedding"` \| `"image"` \| `"audio"`

Defined in: [src/modules/ai/ai.events.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L67)

***

### provider

> **provider**: `string`

Defined in: [src/modules/ai/ai.events.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L66)

***

### requestId

> **requestId**: `string`

Defined in: [src/modules/ai/ai.events.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L64)

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [src/modules/ai/ai.events.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L59)

#### Inherited from

[`AiEventPayload`](AiEventPayload.md).[`tenantId`](AiEventPayload.md#tenantid)

***

### timestamp

> **timestamp**: `Date`

Defined in: [src/modules/ai/ai.events.ts:60](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L60)

#### Inherited from

[`AiEventPayload`](AiEventPayload.md).[`timestamp`](AiEventPayload.md#timestamp)

***

### userId

> **userId**: `string`

Defined in: [src/modules/ai/ai.events.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L58)

#### Inherited from

[`AiEventPayload`](AiEventPayload.md).[`userId`](AiEventPayload.md#userid)
