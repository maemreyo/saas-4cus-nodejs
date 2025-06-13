[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/ab-testing.service](../README.md) / ABTestConfig

# Interface: ABTestConfig

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L17)

## Properties

### testDuration

> **testDuration**: `number`

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L20)

***

### testPercentage

> **testPercentage**: `number`

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L18)

***

### variants

> **variants**: `object`[]

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L21)

#### fromName?

> `optional` **fromName**: `string`

#### htmlContent?

> `optional` **htmlContent**: `string`

#### name

> **name**: `string`

#### preheader?

> `optional` **preheader**: `string`

#### subject?

> `optional` **subject**: `string`

#### textContent?

> `optional` **textContent**: `string`

#### weight

> **weight**: `number`

***

### winningMetric

> **winningMetric**: `"opens"` \| `"clicks"` \| `"conversions"`

Defined in: [src/modules/email-marketing/services/ab-testing.service.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/ab-testing.service.ts#L19)
