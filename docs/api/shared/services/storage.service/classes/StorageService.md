[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/services/storage.service](../README.md) / StorageService

# Class: StorageService

Defined in: [src/shared/services/storage.service.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L23)

## Constructors

### Constructor

> **new StorageService**(): `StorageService`

Defined in: [src/shared/services/storage.service.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L27)

#### Returns

`StorageService`

## Methods

### delete()

> **delete**(`key`): `Promise`\<`void`\>

Defined in: [src/shared/services/storage.service.ts:94](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L94)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteLocal()

> `private` **deleteLocal**(`key`): `Promise`\<`void`\>

Defined in: [src/shared/services/storage.service.ts:105](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L105)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteS3()

> `private` **deleteS3**(`key`): `Promise`\<`void`\>

Defined in: [src/shared/services/storage.service.ts:111](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L111)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

***

### exists()

> **exists**(`key`): `Promise`\<`boolean`\>

Defined in: [src/shared/services/storage.service.ts:116](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L116)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

***

### existsLocal()

> `private` **existsLocal**(`key`): `Promise`\<`boolean`\>

Defined in: [src/shared/services/storage.service.ts:127](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L127)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

***

### existsS3()

> `private` **existsS3**(`key`): `Promise`\<`boolean`\>

Defined in: [src/shared/services/storage.service.ts:137](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L137)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

***

### generateKey()

> `private` **generateKey**(`filename`): `string`

Defined in: [src/shared/services/storage.service.ts:87](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L87)

#### Parameters

##### filename

`string`

#### Returns

`string`

***

### storeFile()

> **storeFile**(`buffer`, `filename`, `options?`): `Promise`\<`string`\>

Defined in: [src/shared/services/storage.service.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L45)

#### Parameters

##### buffer

`Buffer`

##### filename

`string`

##### options?

###### contentType?

`string`

#### Returns

`Promise`\<`string`\>

***

### upload()

> **upload**(`options`): `Promise`\<[`UploadResult`](../interfaces/UploadResult.md)\>

Defined in: [src/shared/services/storage.service.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L32)

#### Parameters

##### options

[`UploadOptions`](../interfaces/UploadOptions.md)

#### Returns

`Promise`\<[`UploadResult`](../interfaces/UploadResult.md)\>

***

### uploadLocal()

> `private` **uploadLocal**(`buffer`, `filename`, `mimeType`, `subPath?`): `Promise`\<[`UploadResult`](../interfaces/UploadResult.md)\>

Defined in: [src/shared/services/storage.service.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L54)

#### Parameters

##### buffer

`Buffer`

##### filename

`string`

##### mimeType

`string`

##### subPath?

`string`

#### Returns

`Promise`\<[`UploadResult`](../interfaces/UploadResult.md)\>

***

### uploadS3()

> `private` **uploadS3**(`buffer`, `filename`, `mimeType`, `subPath?`): `Promise`\<[`UploadResult`](../interfaces/UploadResult.md)\>

Defined in: [src/shared/services/storage.service.ts:81](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L81)

#### Parameters

##### buffer

`Buffer`

##### filename

`string`

##### mimeType

`string`

##### subPath?

`string`

#### Returns

`Promise`\<[`UploadResult`](../interfaces/UploadResult.md)\>

## Properties

### basePath

> `private` **basePath**: `string`

Defined in: [src/shared/services/storage.service.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L25)

***

### storageType

> `private` **storageType**: `string`

Defined in: [src/shared/services/storage.service.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/storage.service.ts#L24)
