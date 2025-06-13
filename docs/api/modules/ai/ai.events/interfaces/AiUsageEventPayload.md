[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.events](../README.md) / AiUsageEventPayload

# Interface: AiUsageEventPayload

Defined in: [src/modules/ai/ai.events.ts:93](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L93)

## Extends

- [`AiEventPayload`](AiEventPayload.md)

## Properties

### currentUsage

> **currentUsage**: `number`

Defined in: [src/modules/ai/ai.events.ts:94](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L94)

***

### limit

> **limit**: `number`

Defined in: [src/modules/ai/ai.events.ts:95](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L95)

***

### percentage

> **percentage**: `number`

Defined in: [src/modules/ai/ai.events.ts:96](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L96)

***

### resource

> **resource**: `"cost"` \| `"tokens"` \| `"requests"`

Defined in: [src/modules/ai/ai.events.ts:97](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.events.ts#L97)

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
