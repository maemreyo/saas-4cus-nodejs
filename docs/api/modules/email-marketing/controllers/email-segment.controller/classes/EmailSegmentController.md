[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/controllers/email-segment.controller](../README.md) / EmailSegmentController

# Class: EmailSegmentController

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L15)

## Constructors

### Constructor

> **new EmailSegmentController**(`segmentService`): `EmailSegmentController`

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L16)

#### Parameters

##### segmentService

[`EmailSegmentService`](../../../services/email-segment.service/classes/EmailSegmentService.md)

#### Returns

`EmailSegmentController`

## Methods

### createSegment()

> **createSegment**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L23)

Create segment

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `conditions?`: \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}; `description?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; \}; `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteSegment()

> **deleteSegment**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:103](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L103)

Delete segment

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; `segmentId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSegment()

> **getSegment**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:63](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L63)

Get segment

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; `segmentId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSegments()

> **getSegments**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L44)

Get segments

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### refreshSegment()

> **refreshSegment**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:143](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L143)

Refresh segment

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `listId`: `string`; `segmentId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### testSegment()

> **testSegment**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:122](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L122)

Test segment

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `conditions?`: \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}; `limit?`: `number`; \}; `Params`: \{ `listId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateSegment()

> **updateSegment**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:82](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L82)

Update segment

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `conditions?`: \{ `groups?`: `object`[]; `operator?`: `"OR"` \| `"AND"`; \}; `description?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; \}; `Params`: \{ `listId`: `string`; `segmentId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### segmentService

> `private` `readonly` **segmentService**: [`EmailSegmentService`](../../../services/email-segment.service/classes/EmailSegmentService.md)

Defined in: [src/modules/email-marketing/controllers/email-segment.controller.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-segment.controller.ts#L17)
