[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/database/repository.base](../README.md) / BaseRepository

# Class: `abstract` BaseRepository\<T, CreateDTO, UpdateDTO\>

Defined in: [src/infrastructure/database/repository.base.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L24)

## Type Parameters

### T

`T`

### CreateDTO

`CreateDTO`

### UpdateDTO

`UpdateDTO`

## Constructors

### Constructor

> **new BaseRepository**\<`T`, `CreateDTO`, `UpdateDTO`\>(`modelName`): `BaseRepository`\<`T`, `CreateDTO`, `UpdateDTO`\>

Defined in: [src/infrastructure/database/repository.base.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L28)

#### Parameters

##### modelName

keyof `PrismaClient`\<`PrismaClientOptions`, `never`, `DefaultArgs`\>

#### Returns

`BaseRepository`\<`T`, `CreateDTO`, `UpdateDTO`\>

## Methods

### count()

> **count**(`where?`): `Promise`\<`number`\>

Defined in: [src/infrastructure/database/repository.base.ts:89](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L89)

#### Parameters

##### where?

`any`

#### Returns

`Promise`\<`number`\>

***

### create()

> **create**(`data`): `Promise`\<`T`\>

Defined in: [src/infrastructure/database/repository.base.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L54)

#### Parameters

##### data

`CreateDTO`

#### Returns

`Promise`\<`T`\>

***

### createMany()

> **createMany**(`data`): `Promise`\<\{ `count`: `number`; \}\>

Defined in: [src/infrastructure/database/repository.base.ts:58](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L58)

#### Parameters

##### data

`CreateDTO`[]

#### Returns

`Promise`\<\{ `count`: `number`; \}\>

***

### delete()

> **delete**(`id`): `Promise`\<`T`\>

Defined in: [src/infrastructure/database/repository.base.ts:79](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L79)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`T`\>

***

### deleteMany()

> **deleteMany**(`where`): `Promise`\<\{ `count`: `number`; \}\>

Defined in: [src/infrastructure/database/repository.base.ts:85](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L85)

#### Parameters

##### where

`any`

#### Returns

`Promise`\<\{ `count`: `number`; \}\>

***

### exists()

> **exists**(`where`): `Promise`\<`boolean`\>

Defined in: [src/infrastructure/database/repository.base.ts:93](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L93)

#### Parameters

##### where

`any`

#### Returns

`Promise`\<`boolean`\>

***

### findById()

> **findById**(`id`, `include?`): `Promise`\<`T`\>

Defined in: [src/infrastructure/database/repository.base.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L33)

#### Parameters

##### id

`string`

##### include?

`any`

#### Returns

`Promise`\<`T`\>

***

### findMany()

> **findMany**(`where?`, `options?`): `Promise`\<`T`[]\>

Defined in: [src/infrastructure/database/repository.base.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L47)

#### Parameters

##### where?

`any`

##### options?

`any`

#### Returns

`Promise`\<`T`[]\>

***

### findOne()

> **findOne**(`where`, `include?`): `Promise`\<`T`\>

Defined in: [src/infrastructure/database/repository.base.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L40)

#### Parameters

##### where

`any`

##### include?

`any`

#### Returns

`Promise`\<`T`\>

***

### paginate()

> **paginate**(`options`): `Promise`\<[`PaginatedResult`](../interfaces/PaginatedResult.md)\<`T`\>\>

Defined in: [src/infrastructure/database/repository.base.ts:98](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L98)

#### Parameters

##### options

[`PaginationOptions`](../interfaces/PaginationOptions.md)

#### Returns

`Promise`\<[`PaginatedResult`](../interfaces/PaginatedResult.md)\<`T`\>\>

***

### transaction()

> **transaction**\<`R`\>(`fn`): `Promise`\<`R`\>

Defined in: [src/infrastructure/database/repository.base.ts:102](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L102)

#### Type Parameters

##### R

`R`

#### Parameters

##### fn

(`tx`) => `Promise`\<`R`\>

#### Returns

`Promise`\<`R`\>

***

### update()

> **update**(`id`, `data`): `Promise`\<`T`\>

Defined in: [src/infrastructure/database/repository.base.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L65)

#### Parameters

##### id

`string`

##### data

`UpdateDTO`

#### Returns

`Promise`\<`T`\>

***

### updateMany()

> **updateMany**(`where`, `data`): `Promise`\<\{ `count`: `number`; \}\>

Defined in: [src/infrastructure/database/repository.base.ts:72](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L72)

#### Parameters

##### where

`any`

##### data

`UpdateDTO`

#### Returns

`Promise`\<\{ `count`: `number`; \}\>

## Properties

### model

> `protected` **model**: `any`

Defined in: [src/infrastructure/database/repository.base.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L26)

***

### modelName

> `protected` **modelName**: keyof `PrismaClient`\<`PrismaClientOptions`, `never`, `DefaultArgs`\>

Defined in: [src/infrastructure/database/repository.base.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L28)

***

### prisma

> `protected` **prisma**: `PrismaClient`

Defined in: [src/infrastructure/database/repository.base.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/repository.base.ts#L25)
