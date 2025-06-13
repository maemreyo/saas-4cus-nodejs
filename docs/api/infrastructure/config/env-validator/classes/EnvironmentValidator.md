[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/config/env-validator](../README.md) / EnvironmentValidator

# Class: EnvironmentValidator

Defined in: [src/infrastructure/config/env-validator.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/config/env-validator.ts#L18)

## Constructors

### Constructor

> **new EnvironmentValidator**(): `EnvironmentValidator`

#### Returns

`EnvironmentValidator`

## Methods

### checkAndCreateEnvFile()

> `static` **checkAndCreateEnvFile**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/config/env-validator.ts:254](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/config/env-validator.ts#L254)

#### Returns

`Promise`\<`void`\>

***

### generateEnvExample()

> `static` **generateEnvExample**(): `string`

Defined in: [src/infrastructure/config/env-validator.ts:203](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/config/env-validator.ts#L203)

#### Returns

`string`

***

### getSection()

> `private` `static` **getSection**(`key`): `string`

Defined in: [src/infrastructure/config/env-validator.ts:232](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/config/env-validator.ts#L232)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### printReport()

> `static` **printReport**(`result`): `void`

Defined in: [src/infrastructure/config/env-validator.ts:279](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/config/env-validator.ts#L279)

#### Parameters

##### result

###### errors

`string`[]

###### suggestions

`string`[]

###### valid

`boolean`

###### warnings

`string`[]

#### Returns

`void`

***

### validate()

> `static` **validate**(): `object`

Defined in: [src/infrastructure/config/env-validator.ts:142](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/config/env-validator.ts#L142)

#### Returns

`object`

##### errors

> **errors**: `string`[]

##### suggestions

> **suggestions**: `string`[]

##### valid

> **valid**: `boolean`

##### warnings

> **warnings**: `string`[]

## Properties

### requirements

> `private` `static` **requirements**: [`EnvRequirement`](../-internal-/interfaces/EnvRequirement.md)[]

Defined in: [src/infrastructure/config/env-validator.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/config/env-validator.ts#L19)
