[**modern-backend-template v2.0.0**](../../../README.md)

***

[modern-backend-template](../../../modules.md) / [shared/logger](../README.md) / fastifyLogger

# Variable: fastifyLogger

> `const` **fastifyLogger**: `object`

Defined in: [src/shared/logger/index.ts:259](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/logger/index.ts#L259)

## Type declaration

### genReqId()

> **genReqId**: () => `string`

#### Returns

`string`

### logger

> **logger**: `Logger`

### serializers

> **serializers**: `object`

#### serializers.req()

> **req**: (`req`) => `object` = `requestSerializer`

##### Parameters

###### req

`any`

##### Returns

`object`

###### headers

> **headers**: `any`

###### id

> **id**: `any` = `req.id`

###### method

> **method**: `any` = `req.method`

###### parameters

> **parameters**: `any` = `req.parameters`

###### path

> **path**: `any` = `req.path`

###### remoteAddress

> **remoteAddress**: `any`

###### remotePort

> **remotePort**: `any` = `req.connection.remotePort`

###### url

> **url**: `any` = `req.url`

#### serializers.res()

> **res**: (`res`) => `object` = `responseSerializer`

##### Parameters

###### res

`any`

##### Returns

`object`

###### headers

> **headers**: `any`

###### responseTime

> **responseTime**: `any` = `res.responseTime`

###### statusCode

> **statusCode**: `any` = `res.statusCode`
