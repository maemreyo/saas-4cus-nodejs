[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.schema](../README.md) / registerSchema

# Variable: registerSchema

> `const` **registerSchema**: `object`

Defined in: [src/modules/auth/auth.schema.ts:1](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.schema.ts#L1)

## Type declaration

### body

> **body**: `object`

#### body.properties

> **properties**: `object`

#### body.properties.email

> **email**: `object`

#### body.properties.email.format

> **format**: `string` = `'email'`

#### body.properties.email.type

> **type**: `string` = `'string'`

#### body.properties.firstName

> **firstName**: `object`

#### body.properties.firstName.maxLength

> **maxLength**: `number` = `100`

#### body.properties.firstName.minLength

> **minLength**: `number` = `1`

#### body.properties.firstName.type

> **type**: `string` = `'string'`

#### body.properties.lastName

> **lastName**: `object`

#### body.properties.lastName.maxLength

> **maxLength**: `number` = `100`

#### body.properties.lastName.minLength

> **minLength**: `number` = `1`

#### body.properties.lastName.type

> **type**: `string` = `'string'`

#### body.properties.password

> **password**: `object`

#### body.properties.password.minLength

> **minLength**: `number` = `8`

#### body.properties.password.type

> **type**: `string` = `'string'`

#### body.properties.username

> **username**: `object`

#### body.properties.username.maxLength

> **maxLength**: `number` = `30`

#### body.properties.username.minLength

> **minLength**: `number` = `3`

#### body.properties.username.pattern

> **pattern**: `string` = `'^[a-zA-Z0-9_-]+$'`

#### body.properties.username.type

> **type**: `string` = `'string'`

#### body.required

> **required**: `string`[]

#### body.type

> **type**: `string` = `'object'`

### response

> **response**: `object`

#### response.201

> **201**: `object`

#### response.201.properties

> **properties**: `object`

#### response.201.properties.data

> **data**: `object`

#### response.201.properties.data.properties

> **properties**: `object`

#### response.201.properties.data.properties.tokens

> **tokens**: `object`

#### response.201.properties.data.properties.tokens.properties

> **properties**: `object`

#### response.201.properties.data.properties.tokens.properties.accessToken

> **accessToken**: `object`

#### response.201.properties.data.properties.tokens.properties.accessToken.type

> **type**: `string` = `'string'`

#### response.201.properties.data.properties.tokens.properties.expiresIn

> **expiresIn**: `object`

#### response.201.properties.data.properties.tokens.properties.expiresIn.type

> **type**: `string` = `'number'`

#### response.201.properties.data.properties.tokens.properties.refreshToken

> **refreshToken**: `object`

#### response.201.properties.data.properties.tokens.properties.refreshToken.type

> **type**: `string` = `'string'`

#### response.201.properties.data.properties.tokens.properties.tokenType

> **tokenType**: `object`

#### response.201.properties.data.properties.tokens.properties.tokenType.type

> **type**: `string` = `'string'`

#### response.201.properties.data.properties.tokens.type

> **type**: `string` = `'object'`

#### response.201.properties.data.properties.user

> **user**: `object`

#### response.201.properties.data.properties.user.properties

> **properties**: `object`

#### response.201.properties.data.properties.user.properties.email

> **email**: `object`

#### response.201.properties.data.properties.user.properties.email.type

> **type**: `string` = `'string'`

#### response.201.properties.data.properties.user.properties.firstName

> **firstName**: `object`

#### response.201.properties.data.properties.user.properties.firstName.type

> **type**: `string` = `'string'`

#### response.201.properties.data.properties.user.properties.id

> **id**: `object`

#### response.201.properties.data.properties.user.properties.id.type

> **type**: `string` = `'string'`

#### response.201.properties.data.properties.user.properties.lastName

> **lastName**: `object`

#### response.201.properties.data.properties.user.properties.lastName.type

> **type**: `string` = `'string'`

#### response.201.properties.data.properties.user.type

> **type**: `string` = `'object'`

#### response.201.properties.data.type

> **type**: `string` = `'object'`

#### response.201.properties.message

> **message**: `object`

#### response.201.properties.message.type

> **type**: `string` = `'string'`

#### response.201.type

> **type**: `string` = `'object'`
