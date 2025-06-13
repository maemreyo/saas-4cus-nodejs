[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/events/event-bus](../README.md) / EventBus

# Class: EventBus

Defined in: [src/shared/events/event-bus.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L14)

## Constructors

### Constructor

> **new EventBus**(): `EventBus`

Defined in: [src/shared/events/event-bus.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L18)

#### Returns

`EventBus`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/shared/events/event-bus.ts:115](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L115)

#### Returns

`void`

***

### emit()

> **emit**\<`T`\>(`event`, `payload`): `Promise`\<`void`\>

Defined in: [src/shared/events/event-bus.ts:73](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L73)

#### Type Parameters

##### T

`T` = [`EventPayload`](../interfaces/EventPayload.md)

#### Parameters

##### event

`string`

##### payload

`T`

#### Returns

`Promise`\<`void`\>

***

### emitLocal()

> **emitLocal**\<`T`\>(`event`, `payload`): `void`

Defined in: [src/shared/events/event-bus.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L67)

#### Type Parameters

##### T

`T` = [`EventPayload`](../interfaces/EventPayload.md)

#### Parameters

##### event

`string`

##### payload

`T`

#### Returns

`void`

***

### getEvents()

> **getEvents**(): `string`[]

Defined in: [src/shared/events/event-bus.ts:105](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L105)

#### Returns

`string`[]

***

### getHandlerCount()

> **getHandlerCount**(`event`): `number`

Defined in: [src/shared/events/event-bus.ts:110](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L110)

#### Parameters

##### event

`string`

#### Returns

`number`

***

### off()

> **off**(`event`, `handler`): `void`

Defined in: [src/shared/events/event-bus.ts:61](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L61)

#### Parameters

##### event

`string`

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)

#### Returns

`void`

***

### on()

> **on**\<`T`\>(`event`, `handler`): `void`

Defined in: [src/shared/events/event-bus.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L33)

#### Type Parameters

##### T

`T` = [`EventPayload`](../interfaces/EventPayload.md)

#### Parameters

##### event

`string`

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)\<`T`\>

#### Returns

`void`

***

### once()

> **once**\<`T`\>(`event`, `handler`): `void`

Defined in: [src/shared/events/event-bus.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L50)

#### Type Parameters

##### T

`T` = [`EventPayload`](../interfaces/EventPayload.md)

#### Parameters

##### event

`string`

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)\<`T`\>

#### Returns

`void`

***

### setupRedisSubscriber()

> `private` **setupRedisSubscriber**(): `void`

Defined in: [src/shared/events/event-bus.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L25)

#### Returns

`void`

***

### waitFor()

> **waitFor**\<`T`\>(`event`, `timeout?`): `Promise`\<`T`\>

Defined in: [src/shared/events/event-bus.ts:88](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L88)

#### Type Parameters

##### T

`T` = [`EventPayload`](../interfaces/EventPayload.md)

#### Parameters

##### event

`string`

##### timeout?

`number`

#### Returns

`Promise`\<`T`\>

## Properties

### emitter

> `private` **emitter**: `EventEmitter`

Defined in: [src/shared/events/event-bus.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L15)

***

### handlers

> `private` **handlers**: `Map`\<`string`, `Set`\<[`EventHandler`](../type-aliases/EventHandler.md)\<`any`\>\>\>

Defined in: [src/shared/events/event-bus.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/events/event-bus.ts#L16)
