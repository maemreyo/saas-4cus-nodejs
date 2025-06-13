[**modern-backend-template v2.0.0**](../../../README.md)

***

[modern-backend-template](../../../modules.md) / [shared/logger](../README.md) / Logger

# Class: Logger

Defined in: [src/shared/logger/index.ts:133](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L133)

## Constructors

### Constructor

> **new Logger**(): `Logger`

Defined in: [src/shared/logger/index.ts:137](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L137)

#### Returns

`Logger`

## Methods

### audit()

> **audit**(`action`, `data`): `void`

Defined in: [src/shared/logger/index.ts:208](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L208)

#### Parameters

##### action

`string`

##### data

`any`

#### Returns

`void`

***

### child()

> **child**(`context`): `Logger`

Defined in: [src/shared/logger/index.ts:142](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L142)

#### Parameters

##### context

[`LogContext`](../interfaces/LogContext.md)

#### Returns

`Logger`

***

### debug()

> **debug**(`msg`, `data?`): `void`

Defined in: [src/shared/logger/index.ts:175](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L175)

#### Parameters

##### msg

`string`

##### data?

`any`

#### Returns

`void`

***

### error()

> **error**(`msg`, `error?`, `data?`): `void`

Defined in: [src/shared/logger/index.ts:159](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L159)

#### Parameters

##### msg

`string`

##### error?

`any`

##### data?

`any`

#### Returns

`void`

***

### fatal()

> **fatal**(`msg`, `data?`): `void`

Defined in: [src/shared/logger/index.ts:155](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L155)

#### Parameters

##### msg

`string`

##### data?

`any`

#### Returns

`void`

***

### forRequest()

> **forRequest**(`requestId?`): `Logger`

Defined in: [src/shared/logger/index.ts:150](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L150)

#### Parameters

##### requestId?

`string`

#### Returns

`Logger`

***

### getPino()

> **getPino**(): `Logger`

Defined in: [src/shared/logger/index.ts:242](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L242)

#### Returns

`Logger`

***

### info()

> **info**(`msg`, `data?`): `void`

Defined in: [src/shared/logger/index.ts:171](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L171)

#### Parameters

##### msg

`string`

##### data?

`any`

#### Returns

`void`

***

### metric()

> **metric**(`name`, `value`, `tags?`): `void`

Defined in: [src/shared/logger/index.ts:230](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L230)

#### Parameters

##### name

`string`

##### value

`number`

##### tags?

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### security()

> **security**(`event`, `data`): `void`

Defined in: [src/shared/logger/index.ts:219](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L219)

#### Parameters

##### event

`string`

##### data

`any`

#### Returns

`void`

***

### time()

> **time**(`label`): () => `void`

Defined in: [src/shared/logger/index.ts:184](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L184)

#### Parameters

##### label

`string`

#### Returns

> (): `void`

##### Returns

`void`

***

### timeAsync()

> **timeAsync**\<`T`\>(`label`, `fn`): `Promise`\<`T`\>

Defined in: [src/shared/logger/index.ts:193](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L193)

#### Type Parameters

##### T

`T`

#### Parameters

##### label

`string`

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### trace()

> **trace**(`msg`, `data?`): `void`

Defined in: [src/shared/logger/index.ts:179](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L179)

#### Parameters

##### msg

`string`

##### data?

`any`

#### Returns

`void`

***

### warn()

> **warn**(`msg`, `data?`): `void`

Defined in: [src/shared/logger/index.ts:167](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L167)

#### Parameters

##### msg

`string`

##### data?

`any`

#### Returns

`void`

## Properties

### context

> `private` **context**: [`LogContext`](../interfaces/LogContext.md) = `{}`

Defined in: [src/shared/logger/index.ts:135](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L135)

***

### logger

> `private` **logger**: `Logger`

Defined in: [src/shared/logger/index.ts:134](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L134)
