[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/server/fastify](../README.md) / FastifyServer

# Class: FastifyServer

Defined in: [src/infrastructure/server/fastify.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L22)

## Constructors

### Constructor

> **new FastifyServer**(): `FastifyServer`

Defined in: [src/infrastructure/server/fastify.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L25)

#### Returns

`FastifyServer`

## Methods

### getApp()

> **getApp**(): `FastifyInstance`

Defined in: [src/infrastructure/server/fastify.ts:306](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L306)

#### Returns

`FastifyInstance`

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/server/fastify.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L36)

#### Returns

`Promise`\<`void`\>

***

### registerErrorHandlers()

> `private` **registerErrorHandlers**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/server/fastify.ts:229](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L229)

#### Returns

`Promise`\<`void`\>

***

### registerMiddleware()

> `private` **registerMiddleware**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/server/fastify.ts:148](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L148)

#### Returns

`Promise`\<`void`\>

***

### registerPlugins()

> `private` **registerPlugins**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/server/fastify.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L43)

#### Returns

`Promise`\<`void`\>

***

### registerRoutes()

> `private` **registerRoutes**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/server/fastify.ts:194](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L194)

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/server/fastify.ts:281](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L281)

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/server/fastify.ts:301](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L301)

#### Returns

`Promise`\<`void`\>

## Properties

### app

> `private` **app**: `FastifyInstance`

Defined in: [src/infrastructure/server/fastify.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/server/fastify.ts#L23)
