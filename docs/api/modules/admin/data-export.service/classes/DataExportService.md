[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/data-export.service](../README.md) / DataExportService

# Class: DataExportService

Defined in: [src/modules/admin/data-export.service.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L39)

## Constructors

### Constructor

> **new DataExportService**(`storageService`, `queueService`, `emailService`): `DataExportService`

Defined in: [src/modules/admin/data-export.service.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L42)

#### Parameters

##### storageService

[`StorageService`](../../../../shared/services/storage.service/classes/StorageService.md)

##### queueService

[`QueueService`](../../../../shared/queue/queue.service/classes/QueueService.md)

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

#### Returns

`DataExportService`

## Methods

### export()

> **export**(`options`): `Promise`\<[`ExportResult`](../interfaces/ExportResult.md)\>

Defined in: [src/modules/admin/data-export.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L51)

Export data based on options

#### Parameters

##### options

[`ExportOptions`](../interfaces/ExportOptions.md)

#### Returns

`Promise`\<[`ExportResult`](../interfaces/ExportResult.md)\>

***

### exportAnalytics()

> `private` **exportAnalytics**(`where`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/data-export.service.ts:418](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L418)

Export analytics events

#### Parameters

##### where

`any`

##### limit?

`number`

#### Returns

`Promise`\<`object`[]\>

***

### exportAuditLogs()

> `private` **exportAuditLogs**(`where`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/data-export.service.ts:446](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L446)

Export audit logs

#### Parameters

##### where

`any`

##### limit?

`number`

#### Returns

`Promise`\<`object`[]\>

***

### exportInvoices()

> `private` **exportInvoices**(`where`, `includeRelations?`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/data-export.service.ts:316](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L316)

Export invoices

#### Parameters

##### where

`any`

##### includeRelations?

`boolean`

##### limit?

`number`

#### Returns

`Promise`\<`object`[]\>

***

### exportProjects()

> `private` **exportProjects**(`where`, `includeRelations?`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/data-export.service.ts:481](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L481)

Export projects

#### Parameters

##### where

`any`

##### includeRelations?

`boolean`

##### limit?

`number`

#### Returns

`Promise`\<`object`[]\>

***

### exportSubscriptions()

> `private` **exportSubscriptions**(`where`, `includeRelations?`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/data-export.service.ts:264](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L264)

Export subscriptions

#### Parameters

##### where

`any`

##### includeRelations?

`boolean`

##### limit?

`number`

#### Returns

`Promise`\<`object`[]\>

***

### exportTenants()

> `private` **exportTenants**(`where`, `includeRelations?`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/data-export.service.ts:520](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L520)

Export tenants

#### Parameters

##### where

`any`

##### includeRelations?

`boolean`

##### limit?

`number`

#### Returns

`Promise`\<`object`[]\>

***

### exportTickets()

> `private` **exportTickets**(`where`, `includeRelations?`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/data-export.service.ts:361](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L361)

Export tickets

#### Parameters

##### where

`any`

##### includeRelations?

`boolean`

##### limit?

`number`

#### Returns

`Promise`\<`object`[]\>

***

### exportUsers()

> `private` **exportUsers**(`where`, `includeRelations?`, `limit?`): `Promise`\<`object`[]\>

Defined in: [src/modules/admin/data-export.service.ts:212](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L212)

Export users

#### Parameters

##### where

`any`

##### includeRelations?

`boolean`

##### limit?

`number`

#### Returns

`Promise`\<`object`[]\>

***

### fetchData()

> `private` **fetchData**(`options`): `Promise`\<`any`[]\>

Defined in: [src/modules/admin/data-export.service.ts:161](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L161)

Fetch data based on entity type

#### Parameters

##### options

[`ExportOptions`](../interfaces/ExportOptions.md)

#### Returns

`Promise`\<`any`[]\>

***

### generateCSV()

> `private` **generateCSV**(`data`): `Buffer`

Defined in: [src/modules/admin/data-export.service.ts:596](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L596)

Generate CSV file

#### Parameters

##### data

`any`[]

#### Returns

`Buffer`

***

### generateExportId()

> `private` **generateExportId**(): `string`

Defined in: [src/modules/admin/data-export.service.ts:660](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L660)

#### Returns

`string`

***

### generateFile()

> `private` **generateFile**(`data`, `options`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/modules/admin/data-export.service.ts:564](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L564)

Generate file based on format

#### Parameters

##### data

`any`[]

##### options

[`ExportOptions`](../interfaces/ExportOptions.md)

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### generateFilename()

> `private` **generateFilename**(`options`): `string`

Defined in: [src/modules/admin/data-export.service.ts:664](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L664)

#### Parameters

##### options

[`ExportOptions`](../interfaces/ExportOptions.md)

#### Returns

`string`

***

### generateXLSX()

> `private` **generateXLSX**(`data`, `sheetName`): `Buffer`

Defined in: [src/modules/admin/data-export.service.ts:615](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L615)

Generate XLSX file

#### Parameters

##### data

`any`[]

##### sheetName

`string`

#### Returns

`Buffer`

***

### getExportStatus()

> **getExportStatus**(`exportId`): [`ExportResult`](../interfaces/ExportResult.md)

Defined in: [src/modules/admin/data-export.service.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L154)

Get export status

#### Parameters

##### exportId

`string`

#### Returns

[`ExportResult`](../interfaces/ExportResult.md)

***

### getMimeType()

> `private` **getMimeType**(`format`): `string`

Defined in: [src/modules/admin/data-export.service.ts:669](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L669)

#### Parameters

##### format

`string`

#### Returns

`string`

***

### processExport()

> **processExport**(`exportId`, `options`): `Promise`\<[`ExportResult`](../interfaces/ExportResult.md)\>

Defined in: [src/modules/admin/data-export.service.ts:89](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L89)

Process the export

#### Parameters

##### exportId

`string`

##### options

[`ExportOptions`](../interfaces/ExportOptions.md)

#### Returns

`Promise`\<[`ExportResult`](../interfaces/ExportResult.md)\>

***

### sendExportEmail()

> `private` **sendExportEmail**(`recipientEmail`, `exportResult`): `Promise`\<`void`\>

Defined in: [src/modules/admin/data-export.service.ts:645](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L645)

Send export completion email

#### Parameters

##### recipientEmail

`string`

##### exportResult

[`ExportResult`](../interfaces/ExportResult.md)

#### Returns

`Promise`\<`void`\>

## Properties

### activeExports

> `private` **activeExports**: `Map`\<`string`, [`ExportResult`](../interfaces/ExportResult.md)\>

Defined in: [src/modules/admin/data-export.service.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L40)

***

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/admin/data-export.service.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L45)

***

### queueService

> `private` **queueService**: [`QueueService`](../../../../shared/queue/queue.service/classes/QueueService.md)

Defined in: [src/modules/admin/data-export.service.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L44)

***

### storageService

> `private` **storageService**: [`StorageService`](../../../../shared/services/storage.service/classes/StorageService.md)

Defined in: [src/modules/admin/data-export.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/data-export.service.ts#L43)
