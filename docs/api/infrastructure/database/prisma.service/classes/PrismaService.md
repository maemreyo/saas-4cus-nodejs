[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/database/prisma.service](../README.md) / PrismaService

# Class: PrismaService

Defined in: [src/infrastructure/database/prisma.service.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L12)

## Accessors

### client

#### Get Signature

> **get** **client**(): `PrismaClient`

Defined in: [src/infrastructure/database/prisma.service.ts:160](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L160)

##### Returns

`PrismaClient`

## Constructors

### Constructor

> **new PrismaService**(): `PrismaService`

Defined in: [src/infrastructure/database/prisma.service.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L15)

#### Returns

`PrismaService`

## Methods

### batchCreate()

> **batchCreate**\<`T`\>(`model`, `data`, `batchSize`): `Promise`\<`number`\>

Defined in: [src/infrastructure/database/prisma.service.ts:252](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L252)

#### Type Parameters

##### T

`T`

#### Parameters

##### model

keyof `PrismaClient`\<`PrismaClientOptions`, `never`, `DefaultArgs`\>

##### data

`T`[]

##### batchSize

`number` = `1000`

#### Returns

`Promise`\<`number`\>

***

### connect()

> **connect**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/database/prisma.service.ts:165](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L165)

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/database/prisma.service.ts:176](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L176)

#### Returns

`Promise`\<`void`\>

***

### getLogLevels()

> `private` **getLogLevels**(): `LogLevel`[]

Defined in: [src/infrastructure/database/prisma.service.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L26)

#### Returns

`LogLevel`[]

***

### getStats()

> **getStats**(): `Promise`\<\{ `activeSessions`: `number`; `databaseSize`: `string`; `pendingJobs`: `number`; `users`: `number`; \}\>

Defined in: [src/infrastructure/database/prisma.service.ts:302](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L302)

#### Returns

`Promise`\<\{ `activeSessions`: `number`; `databaseSize`: `string`; `pendingJobs`: `number`; `users`: `number`; \}\>

***

### paginate()

> **paginate**\<`T`, `K`\>(`model`, `__namedParameters`): `Promise`\<\{ `data`: `any`; `meta`: \{ `hasNext`: `boolean`; `hasPrev`: `boolean`; `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `any`; \}; \}\>

Defined in: [src/infrastructure/database/prisma.service.ts:205](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L205)

#### Type Parameters

##### T

`T`

##### K

`K` *extends* keyof `PrismaClient`\<`PrismaClientOptions`, `never`, `DefaultArgs`\>

#### Parameters

##### model

`K`

##### \_\_namedParameters

###### include?

`any`

###### limit?

`number` = `20`

###### orderBy?

`any`

###### page?

`number` = `1`

###### where?

`any`

#### Returns

`Promise`\<\{ `data`: `any`; `meta`: \{ `hasNext`: `boolean`; `hasPrev`: `boolean`; `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `any`; \}; \}\>

***

### ping()

> **ping**(): `Promise`\<`boolean`\>

Defined in: [src/infrastructure/database/prisma.service.ts:186](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L186)

#### Returns

`Promise`\<`boolean`\>

***

### raw()

> **raw**\<`T`\>(`sql`, `params?`): `Promise`\<`T`\>

Defined in: [src/infrastructure/database/prisma.service.ts:297](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L297)

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### sql

`string`

##### params?

`any`[]

#### Returns

`Promise`\<`T`\>

***

### setupEventHandlers()

> `private` **setupEventHandlers**(): `void`

Defined in: [src/infrastructure/database/prisma.service.ts:118](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L118)

#### Returns

`void`

***

### setupMiddleware()

> `private` **setupMiddleware**(): `void`

Defined in: [src/infrastructure/database/prisma.service.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L36)

#### Returns

`void`

***

### setupShutdownHooks()

> `private` **setupShutdownHooks**(): `void`

Defined in: [src/infrastructure/database/prisma.service.ts:142](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L142)

#### Returns

`void`

***

### transaction()

> **transaction**\<`T`\>(`fn`, `options?`): `Promise`\<`T`\>

Defined in: [src/infrastructure/database/prisma.service.ts:197](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L197)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`prisma`) => `Promise`\<`T`\>

##### options?

###### maxWait?

`number`

###### timeout?

`number`

#### Returns

`Promise`\<`T`\>

***

### upsertMany()

> **upsertMany**\<`T`\>(`model`, `data`, `uniqueFields`): `Promise`\<`void`\>

Defined in: [src/infrastructure/database/prisma.service.ts:273](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L273)

#### Type Parameters

##### T

`T` *extends* `object`

#### Parameters

##### model

keyof `PrismaClient`\<`PrismaClientOptions`, `never`, `DefaultArgs`\>

##### data

`T`[]

##### uniqueFields

`string`[]

#### Returns

`Promise`\<`void`\>

## Properties

### prisma

> `private` **prisma**: [`ExtendedPrismaClient`](../-internal-/type-aliases/ExtendedPrismaClient.md)

Defined in: [src/infrastructure/database/prisma.service.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/database/prisma.service.ts#L13)
