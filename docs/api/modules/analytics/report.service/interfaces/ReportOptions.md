[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/report.service](../README.md) / ReportOptions

# Interface: ReportOptions

Defined in: [src/modules/analytics/report.service.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L13)

## Properties

### customQuery?

> `optional` **customQuery**: `any`

Defined in: [src/modules/analytics/report.service.ts:29](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L29)

***

### filters?

> `optional` **filters**: `object`

Defined in: [src/modules/analytics/report.service.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L23)

#### dateRange?

> `optional` **dateRange**: `number`

#### endDate?

> `optional` **endDate**: `Date`

#### startDate?

> `optional` **startDate**: `Date`

#### tenantId?

> `optional` **tenantId**: `string`

***

### format

> **format**: `"csv"` \| `"json"` \| `"pdf"`

Defined in: [src/modules/analytics/report.service.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L15)

***

### recipients?

> `optional` **recipients**: `string`[]

Defined in: [src/modules/analytics/report.service.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L16)

***

### schedule?

> `optional` **schedule**: `object`

Defined in: [src/modules/analytics/report.service.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L17)

#### dayOfMonth?

> `optional` **dayOfMonth**: `number`

#### dayOfWeek?

> `optional` **dayOfWeek**: `number`

#### frequency

> **frequency**: `"daily"` \| `"weekly"` \| `"monthly"`

#### hour?

> `optional` **hour**: `number`

***

### type

> **type**: `"custom"` \| `"revenue"` \| `"users"` \| `"dashboard"`

Defined in: [src/modules/analytics/report.service.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L14)
