[**modern-backend-template v2.0.0**](../../../../../../README.md)

***

[modern-backend-template](../../../../../../modules.md) / [modules/email-marketing/controllers/email-webhook.controller](../../README.md) / [\<internal\>](../README.md) / SendGridEvent

# Interface: SendGridEvent

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L13)

## Properties

### campaign\_id?

> `optional` **campaign\_id**: `string`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L27)

***

### email

> **email**: `string`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L14)

***

### event

> **event**: `"delivered"` \| `"click"` \| `"open"` \| `"processed"` \| `"dropped"` \| `"bounce"` \| `"deferred"` \| `"spamreport"` \| `"unsubscribe"`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L16)

***

### reason?

> `optional` **reason**: `string`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L28)

***

### sg\_message\_id

> **sg\_message\_id**: `string`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L26)

***

### timestamp

> **timestamp**: `number`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L15)

***

### type?

> `optional` **type**: `string`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:29](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L29)

***

### url?

> `optional` **url**: `string`

Defined in: [src/modules/email-marketing/controllers/email-webhook.controller.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-webhook.controller.ts#L30)
