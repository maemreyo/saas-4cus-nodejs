[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/analytics.dto](../README.md) / TrackEventDTO

# Class: TrackEventDTO

Defined in: [src/modules/analytics/analytics.dto.ts:3](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L3)

## Constructors

### Constructor

> **new TrackEventDTO**(): `TrackEventDTO`

#### Returns

`TrackEventDTO`

## Properties

### deviceId?

> `optional` **deviceId**: `string`

Defined in: [src/modules/analytics/analytics.dto.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L21)

***

### event

> **event**: `string`

Defined in: [src/modules/analytics/analytics.dto.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L18)

***

### properties?

> `optional` **properties**: `Record`\<`string`, `any`\>

Defined in: [src/modules/analytics/analytics.dto.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L19)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `deviceId`: `ZodOptional`\<`ZodString`\>; `event`: `ZodString`; `properties`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `sessionId`: `ZodOptional`\<`ZodString`\>; `utm`: `ZodOptional`\<`ZodObject`\<\{ `campaign`: `ZodOptional`\<`ZodString`\>; `content`: `ZodOptional`\<`ZodString`\>; `medium`: `ZodOptional`\<`ZodString`\>; `source`: `ZodOptional`\<`ZodString`\>; `term`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `campaign?`: `string`; `content?`: `string`; `medium?`: `string`; `source?`: `string`; `term?`: `string`; \}, \{ `campaign?`: `string`; `content?`: `string`; `medium?`: `string`; `source?`: `string`; `term?`: `string`; \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `deviceId?`: `string`; `event?`: `string`; `properties?`: `Record`\<`string`, `any`\>; `sessionId?`: `string`; `utm?`: \{ `campaign?`: `string`; `content?`: `string`; `medium?`: `string`; `source?`: `string`; `term?`: `string`; \}; \}, \{ `deviceId?`: `string`; `event?`: `string`; `properties?`: `Record`\<`string`, `any`\>; `sessionId?`: `string`; `utm?`: \{ `campaign?`: `string`; `content?`: `string`; `medium?`: `string`; `source?`: `string`; `term?`: `string`; \}; \}\>

Defined in: [src/modules/analytics/analytics.dto.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L4)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [src/modules/analytics/analytics.dto.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L20)

***

### utm?

> `optional` **utm**: `object`

Defined in: [src/modules/analytics/analytics.dto.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L22)

#### campaign?

> `optional` **campaign**: `string`

#### content?

> `optional` **content**: `string`

#### medium?

> `optional` **medium**: `string`

#### source?

> `optional` **source**: `string`

#### term?

> `optional` **term**: `string`
