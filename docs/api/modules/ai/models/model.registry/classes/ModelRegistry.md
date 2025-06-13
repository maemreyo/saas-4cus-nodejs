[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/ai/models/model.registry](../README.md) / ModelRegistry

# Class: ModelRegistry

Defined in: [src/modules/ai/models/model.registry.ts:3](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L3)

## Constructors

### Constructor

> **new ModelRegistry**(): `ModelRegistry`

#### Returns

`ModelRegistry`

## Methods

### calculateCost()

> `static` **calculateCost**(`modelId`, `usage`): `number`

Defined in: [src/modules/ai/models/model.registry.ts:390](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L390)

#### Parameters

##### modelId

`string`

##### usage

###### completionTokens

`number`

###### promptTokens

`number`

#### Returns

`number`

***

### get()

> `static` **get**(`modelId`): [`AiModel`](../../model.types/interfaces/AiModel.md)

Defined in: [src/modules/ai/models/model.registry.ts:357](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L357)

#### Parameters

##### modelId

`string`

#### Returns

[`AiModel`](../../model.types/interfaces/AiModel.md)

***

### getAll()

> `static` **getAll**(): [`AiModel`](../../model.types/interfaces/AiModel.md)[]

Defined in: [src/modules/ai/models/model.registry.ts:369](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L369)

#### Returns

[`AiModel`](../../model.types/interfaces/AiModel.md)[]

***

### getAvailable()

> `static` **getAvailable**(`capabilities?`): [`AiModel`](../../model.types/interfaces/AiModel.md)[]

Defined in: [src/modules/ai/models/model.registry.ts:373](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L373)

#### Parameters

##### capabilities?

`Partial`\<[`AiModel`](../../model.types/interfaces/AiModel.md)\[`"capabilities"`\]\>

#### Returns

[`AiModel`](../../model.types/interfaces/AiModel.md)[]

***

### getByCategory()

> `static` **getByCategory**(`category`): [`AiModel`](../../model.types/interfaces/AiModel.md)[]

Defined in: [src/modules/ai/models/model.registry.ts:365](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L365)

#### Parameters

##### category

[`ModelCategory`](../../model.types/enumerations/ModelCategory.md)

#### Returns

[`AiModel`](../../model.types/interfaces/AiModel.md)[]

***

### getByProvider()

> `static` **getByProvider**(`provider`): [`AiModel`](../../model.types/interfaces/AiModel.md)[]

Defined in: [src/modules/ai/models/model.registry.ts:361](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L361)

#### Parameters

##### provider

`string`

#### Returns

[`AiModel`](../../model.types/interfaces/AiModel.md)[]

***

### register()

> `static` **register**(`model`): `void`

Defined in: [src/modules/ai/models/model.registry.ts:353](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L353)

#### Parameters

##### model

[`AiModel`](../../model.types/interfaces/AiModel.md)

#### Returns

`void`

***

### registerDefaultModels()

> `private` `static` **registerDefaultModels**(): `void`

Defined in: [src/modules/ai/models/model.registry.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L11)

#### Returns

`void`

## Properties

### models

> `private` `static` **models**: `Map`\<`string`, [`AiModel`](../../model.types/interfaces/AiModel.md)\>

Defined in: [src/modules/ai/models/model.registry.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/models/model.registry.ts#L4)
