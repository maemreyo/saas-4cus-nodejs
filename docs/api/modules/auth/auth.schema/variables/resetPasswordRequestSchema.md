[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.schema](../README.md) / resetPasswordRequestSchema

# Variable: resetPasswordRequestSchema

> `const` **resetPasswordRequestSchema**: `object`

Defined in: [src/modules/auth/auth.schema.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.schema.ts#L68)

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

#### body.required

> **required**: `string`[]

#### body.type

> **type**: `string` = `'object'`
