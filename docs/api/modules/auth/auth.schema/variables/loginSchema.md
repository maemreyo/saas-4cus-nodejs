[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.schema](../README.md) / loginSchema

# Variable: loginSchema

> `const` **loginSchema**: `object`

Defined in: [src/modules/auth/auth.schema.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.schema.ts#L46)

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

#### body.properties.password

> **password**: `object`

#### body.properties.password.type

> **type**: `string` = `'string'`

#### body.properties.twoFactorCode

> **twoFactorCode**: `object`

#### body.properties.twoFactorCode.maxLength

> **maxLength**: `number` = `6`

#### body.properties.twoFactorCode.minLength

> **minLength**: `number` = `6`

#### body.properties.twoFactorCode.type

> **type**: `string` = `'string'`

#### body.required

> **required**: `string`[]

#### body.type

> **type**: `string` = `'object'`
