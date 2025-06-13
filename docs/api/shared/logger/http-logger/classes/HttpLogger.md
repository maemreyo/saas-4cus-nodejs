[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/logger/http-logger](../README.md) / HttpLogger

# Class: HttpLogger

Defined in: [src/shared/logger/http-logger.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/logger/http-logger.ts#L14)

## Constructors

### Constructor

> **new HttpLogger**(): `HttpLogger`

#### Returns

`HttpLogger`

## Methods

### logRequest()

> `static` **logRequest**(`req`, `reply`): `void`

Defined in: [src/shared/logger/http-logger.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/logger/http-logger.ts#L15)

#### Parameters

##### req

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`void`

***

### sanitizeHeaders()

> `private` `static` **sanitizeHeaders**(`headers`): `any`

Defined in: [src/shared/logger/http-logger.ts:61](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/shared/logger/http-logger.ts#L61)

#### Parameters

##### headers

`any`

#### Returns

`any`
