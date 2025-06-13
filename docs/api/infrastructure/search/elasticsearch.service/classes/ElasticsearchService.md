[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/search/elasticsearch.service](../README.md) / ElasticsearchService

# Class: ElasticsearchService

Defined in: [src/infrastructure/search/elasticsearch.service.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L9)

## Constructors

### Constructor

> **new ElasticsearchService**(): `ElasticsearchService`

Defined in: [src/infrastructure/search/elasticsearch.service.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L13)

#### Returns

`ElasticsearchService`

## Methods

### bulk()

> **bulk**(`params`): `Promise`\<`any`\>

Defined in: [src/infrastructure/search/elasticsearch.service.ts:144](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L144)

#### Parameters

##### params

`any`

#### Returns

`Promise`\<`any`\>

***

### connect()

> **connect**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/search/elasticsearch.service.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L28)

#### Returns

`Promise`\<`void`\>

***

### createIndices()

> **createIndices**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/search/elasticsearch.service.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L52)

#### Returns

`Promise`\<`void`\>

***

### delete()

> **delete**(`params`): `Promise`\<`any`\>

Defined in: [src/infrastructure/search/elasticsearch.service.ts:136](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L136)

#### Parameters

##### params

`any`

#### Returns

`Promise`\<`any`\>

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/search/elasticsearch.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L46)

#### Returns

`Promise`\<`void`\>

***

### getClient()

> **getClient**(): `Client`

Defined in: [src/infrastructure/search/elasticsearch.service.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L152)

#### Returns

`Client`

***

### getConnectionStatus()

> **getConnectionStatus**(): `boolean`

Defined in: [src/infrastructure/search/elasticsearch.service.ts:156](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L156)

#### Returns

`boolean`

***

### index()

> **index**(`params`): `Promise`\<`any`\>

Defined in: [src/infrastructure/search/elasticsearch.service.ts:120](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L120)

#### Parameters

##### params

`any`

#### Returns

`Promise`\<`any`\>

***

### search()

> **search**(`params`): `Promise`\<`any`\>

Defined in: [src/infrastructure/search/elasticsearch.service.ts:112](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L112)

#### Parameters

##### params

`any`

#### Returns

`Promise`\<`any`\>

***

### update()

> **update**(`params`): `Promise`\<`any`\>

Defined in: [src/infrastructure/search/elasticsearch.service.ts:128](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L128)

#### Parameters

##### params

`any`

#### Returns

`Promise`\<`any`\>

## Properties

### client

> `private` **client**: `Client`

Defined in: [src/infrastructure/search/elasticsearch.service.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L10)

***

### isConnected

> `private` **isConnected**: `boolean` = `false`

Defined in: [src/infrastructure/search/elasticsearch.service.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/search/elasticsearch.service.ts#L11)
