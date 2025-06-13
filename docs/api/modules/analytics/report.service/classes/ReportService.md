[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/report.service](../README.md) / ReportService

# Class: ReportService

Defined in: [src/modules/analytics/report.service.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L33)

## Constructors

### Constructor

> **new ReportService**(`analyticsService`, `emailService`, `storageService`): `ReportService`

Defined in: [src/modules/analytics/report.service.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L34)

#### Parameters

##### analyticsService

[`AnalyticsService`](../../analytics.service/classes/AnalyticsService.md)

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

##### storageService

[`StorageService`](../../../../shared/services/storage.service/classes/StorageService.md)

#### Returns

`ReportService`

## Methods

### addPDFContent()

> `private` **addPDFContent**(`doc`, `data`): `void`

Defined in: [src/modules/analytics/report.service.ts:428](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L428)

Add PDF content based on data

#### Parameters

##### doc

`any`

##### data

`any`

#### Returns

`void`

***

### flattenDataForCSV()

> `private` **flattenDataForCSV**(`data`): `any`[]

Defined in: [src/modules/analytics/report.service.ts:456](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L456)

Flatten nested data for CSV export

#### Parameters

##### data

`any`

#### Returns

`any`[]

***

### generateCSV()

> `private` **generateCSV**(`data`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/modules/analytics/report.service.ts:439](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L439)

Generate CSV report

#### Parameters

##### data

`any`

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### generatePDF()

> `private` **generatePDF**(`data`, `type`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/modules/analytics/report.service.ts:404](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L404)

Generate PDF report

#### Parameters

##### data

`any`

##### type

`string`

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### generateReport()

> **generateReport**(`options`): `Promise`\<\{ `filename`: `string`; `size`: `number`; `url`: `string`; \}\>

Defined in: [src/modules/analytics/report.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L43)

Generate report

#### Parameters

##### options

[`ReportOptions`](../interfaces/ReportOptions.md)

#### Returns

`Promise`\<\{ `filename`: `string`; `size`: `number`; `url`: `string`; \}\>

***

### getCustomReportData()

> `private` **getCustomReportData**(`query`): `Promise`\<`any`\>

Defined in: [src/modules/analytics/report.service.ts:395](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L395)

Get custom report data

#### Parameters

##### query

`any`

#### Returns

`Promise`\<`any`\>

***

### getDashboardReportData()

> `private` **getDashboardReportData**(`filters?`): `Promise`\<`any`\>

Defined in: [src/modules/analytics/report.service.ts:179](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L179)

Get dashboard report data

#### Parameters

##### filters?

`any`

#### Returns

`Promise`\<`any`\>

***

### getRevenueByPlan()

> `private` **getRevenueByPlan**(`tenantId?`): `Promise`\<`any`[]\>

Defined in: [src/modules/analytics/report.service.ts:494](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L494)

Helper method to get revenue by plan

#### Parameters

##### tenantId?

`string`

#### Returns

`Promise`\<`any`[]\>

***

### getRevenueReportData()

> `private` **getRevenueReportData**(`filters?`): `Promise`\<`any`\>

Defined in: [src/modules/analytics/report.service.ts:195](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L195)

Get revenue report data

#### Parameters

##### filters?

`any`

#### Returns

`Promise`\<`any`\>

***

### getUsersReportData()

> `private` **getUsersReportData**(`filters?`): `Promise`\<`any`\>

Defined in: [src/modules/analytics/report.service.ts:280](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L280)

Get users report data

#### Parameters

##### filters?

`any`

#### Returns

`Promise`\<`any`\>

***

### scheduleReport()

> **scheduleReport**(`options`): `Promise`\<`string`\>

Defined in: [src/modules/analytics/report.service.ts:133](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L133)

Schedule recurring report

#### Parameters

##### options

[`ReportOptions`](../interfaces/ReportOptions.md) & `object`

#### Returns

`Promise`\<`string`\>

***

### sendReportEmail()

> `private` **sendReportEmail**(`recipients`, `report`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/report.service.ts:473](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L473)

Send report email

#### Parameters

##### recipients

`string`[]

##### report

###### filename

`string`

###### type

`string`

###### url

`string`

#### Returns

`Promise`\<`void`\>

## Properties

### analyticsService

> `private` **analyticsService**: [`AnalyticsService`](../../analytics.service/classes/AnalyticsService.md)

Defined in: [src/modules/analytics/report.service.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L35)

***

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/analytics/report.service.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L36)

***

### storageService

> `private` **storageService**: [`StorageService`](../../../../shared/services/storage.service/classes/StorageService.md)

Defined in: [src/modules/analytics/report.service.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/report.service.ts#L37)
