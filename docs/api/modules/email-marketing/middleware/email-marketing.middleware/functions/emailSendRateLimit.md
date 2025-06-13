[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/middleware/email-marketing.middleware](../README.md) / emailSendRateLimit

# Function: emailSendRateLimit()

> **emailSendRateLimit**(`limit`, `windowMs`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/middleware/email-marketing.middleware.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/middleware/email-marketing.middleware.ts#L13)

Rate limit for email sending

## Parameters

### limit

`number` = `100`

### windowMs

`number` = `3600000`

## Returns

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>
