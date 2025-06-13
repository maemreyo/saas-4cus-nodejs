[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/controllers/email-tracking.controller](../README.md) / EmailTrackingController

# Class: EmailTrackingController

Defined in: [src/modules/email-marketing/controllers/email-tracking.controller.ts:8](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-tracking.controller.ts#L8)

## Constructors

### Constructor

> **new EmailTrackingController**(`trackingService`): `EmailTrackingController`

Defined in: [src/modules/email-marketing/controllers/email-tracking.controller.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-tracking.controller.ts#L9)

#### Parameters

##### trackingService

[`EmailTrackingService`](../../../services/email-tracking.service/classes/EmailTrackingService.md)

#### Returns

`EmailTrackingController`

## Methods

### trackClick()

> **trackClick**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-tracking.controller.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-tracking.controller.ts#L44)

Track link click

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `encoded`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### trackOpen()

> **trackOpen**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-tracking.controller.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-tracking.controller.ts#L16)

Track email open

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `encoded`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### trackingService

> `private` `readonly` **trackingService**: [`EmailTrackingService`](../../../services/email-tracking.service/classes/EmailTrackingService.md)

Defined in: [src/modules/email-marketing/controllers/email-tracking.controller.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-tracking.controller.ts#L10)
