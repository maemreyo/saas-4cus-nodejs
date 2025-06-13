[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.schema](../README.md) / enable2FASchema

# Variable: enable2FASchema

> `const` **enable2FASchema**: `object`

Defined in: [src/modules/auth/auth.schema.ts:89](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.schema.ts#L89)

## Type declaration

### response

> **response**: `object`

#### response.200

> **200**: `object`

#### response.200.properties

> **properties**: `object`

#### response.200.properties.data

> **data**: `object`

#### response.200.properties.data.properties

> **properties**: `object`

#### response.200.properties.data.properties.backupCodes

> **backupCodes**: `object`

#### response.200.properties.data.properties.backupCodes.items

> **items**: `object`

#### response.200.properties.data.properties.backupCodes.items.type

> **type**: `string` = `'string'`

#### response.200.properties.data.properties.backupCodes.type

> **type**: `string` = `'array'`

#### response.200.properties.data.properties.qrCode

> **qrCode**: `object`

#### response.200.properties.data.properties.qrCode.type

> **type**: `string` = `'string'`

#### response.200.properties.data.properties.secret

> **secret**: `object`

#### response.200.properties.data.properties.secret.type

> **type**: `string` = `'string'`

#### response.200.properties.data.type

> **type**: `string` = `'object'`

#### response.200.properties.message

> **message**: `object`

#### response.200.properties.message.type

> **type**: `string` = `'string'`

#### response.200.type

> **type**: `string` = `'object'`
