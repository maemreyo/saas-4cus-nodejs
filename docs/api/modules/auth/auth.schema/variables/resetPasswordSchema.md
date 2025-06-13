[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.schema](../README.md) / resetPasswordSchema

# Variable: resetPasswordSchema

> `const` **resetPasswordSchema**: `object`

Defined in: [src/modules/auth/auth.schema.ts:78](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.schema.ts#L78)

## Type declaration

### body

> **body**: `object`

#### body.properties

> **properties**: `object`

#### body.properties.password

> **password**: `object`

#### body.properties.password.minLength

> **minLength**: `number` = `8`

#### body.properties.password.type

> **type**: `string` = `'string'`

#### body.properties.token

> **token**: `object`

#### body.properties.token.type

> **type**: `string` = `'string'`

#### body.required

> **required**: `string`[]

#### body.type

> **type**: `string` = `'object'`
