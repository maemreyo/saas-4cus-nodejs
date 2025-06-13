[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/modules/module-manager](../README.md) / ModuleManager

# Class: ModuleManager

Defined in: [src/infrastructure/modules/module-manager.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L28)

## Constructors

### Constructor

> `private` **new ModuleManager**(): `ModuleManager`

Defined in: [src/infrastructure/modules/module-manager.ts:34](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L34)

#### Returns

`ModuleManager`

## Methods

### buildInitializationOrder()

> `private` **buildInitializationOrder**(`modules`): `string`[]

Defined in: [src/infrastructure/modules/module-manager.ts:283](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L283)

#### Parameters

##### modules

[`ModuleConfig`](../interfaces/ModuleConfig.md)[]

#### Returns

`string`[]

***

### getInitializedModules()

> **getInitializedModules**(): `string`[]

Defined in: [src/infrastructure/modules/module-manager.ts:275](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L275)

#### Returns

`string`[]

***

### getInstance()

> `static` **getInstance**(): `ModuleManager`

Defined in: [src/infrastructure/modules/module-manager.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L38)

#### Returns

`ModuleManager`

***

### healthCheck()

> **healthCheck**(): `Promise`\<\{ `healthy`: `boolean`; `modules`: `Record`\<`string`, `any`\>; \}\>

Defined in: [src/infrastructure/modules/module-manager.ts:239](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L239)

#### Returns

`Promise`\<\{ `healthy`: `boolean`; `modules`: `Record`\<`string`, `any`\>; \}\>

***

### initializeAll()

> **initializeAll**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/modules/module-manager.ts:181](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L181)

#### Returns

`Promise`\<`void`\>

***

### isModuleInitialized()

> **isModuleInitialized**(`name`): `boolean`

Defined in: [src/infrastructure/modules/module-manager.ts:279](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L279)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### register()

> `private` **register**(`config`): `void`

Defined in: [src/infrastructure/modules/module-manager.ts:177](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L177)

#### Parameters

##### config

[`ModuleConfig`](../interfaces/ModuleConfig.md)

#### Returns

`void`

***

### registerModules()

> `private` **registerModules**(): `void`

Defined in: [src/infrastructure/modules/module-manager.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L45)

#### Returns

`void`

***

### shutdownAll()

> **shutdownAll**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/modules/module-manager.ts:214](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L214)

#### Returns

`Promise`\<`void`\>

## Properties

### initializationOrder

> `private` **initializationOrder**: `string`[] = `[]`

Defined in: [src/infrastructure/modules/module-manager.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L32)

***

### initialized

> `private` **initialized**: `Set`\<`string`\>

Defined in: [src/infrastructure/modules/module-manager.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L31)

***

### instance

> `private` `static` **instance**: `ModuleManager`

Defined in: [src/infrastructure/modules/module-manager.ts:29](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L29)

***

### modules

> `private` **modules**: `Map`\<`string`, [`ModuleConfig`](../interfaces/ModuleConfig.md)\>

Defined in: [src/infrastructure/modules/module-manager.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/modules/module-manager.ts#L30)
