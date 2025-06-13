[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/api-usage/api-usage.dto](../README.md) / ApiUsageTrackingDTO

# Class: ApiUsageTrackingDTO

Defined in: [src/modules/api-usage/api-usage.dto.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L42)

## Constructors

### Constructor

> **new ApiUsageTrackingDTO**(): `ApiUsageTrackingDTO`

#### Returns

`ApiUsageTrackingDTO`

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:53](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L53)

***

### ipAddress?

> `optional` **ipAddress**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:57](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L57)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [src/modules/api-usage/api-usage.dto.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L59)

***

### method

> **method**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L54)

***

### responseTime

> **responseTime**: `number`

Defined in: [src/modules/api-usage/api-usage.dto.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L56)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `endpoint`: `ZodString`; `ipAddress`: `ZodOptional`\<`ZodString`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `method`: `ZodEnum`\<\[`"GET"`, `"POST"`, `"PUT"`, `"DELETE"`, `"PATCH"`, `"HEAD"`, `"OPTIONS"`\]\>; `responseTime`: `ZodNumber`; `statusCode`: `ZodNumber`; `userAgent`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `endpoint?`: `string`; `ipAddress?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `method?`: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"` \| `"OPTIONS"` \| `"HEAD"`; `responseTime?`: `number`; `statusCode?`: `number`; `userAgent?`: `string`; \}, \{ `endpoint?`: `string`; `ipAddress?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `method?`: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"` \| `"OPTIONS"` \| `"HEAD"`; `responseTime?`: `number`; `statusCode?`: `number`; `userAgent?`: `string`; \}\>

Defined in: [src/modules/api-usage/api-usage.dto.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L43)

***

### statusCode

> **statusCode**: `number`

Defined in: [src/modules/api-usage/api-usage.dto.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L55)

***

### userAgent?

> `optional` **userAgent**: `string`

Defined in: [src/modules/api-usage/api-usage.dto.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/api-usage/api-usage.dto.ts#L58)
