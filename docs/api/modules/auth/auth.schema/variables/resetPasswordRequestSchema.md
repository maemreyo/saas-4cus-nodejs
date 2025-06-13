[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.schema](../README.md) / resetPasswordRequestSchema

# Variable: resetPasswordRequestSchema

> `const` **resetPasswordRequestSchema**: `object`

Defined in: [src/modules/auth/auth.schema.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/auth/auth.schema.ts#L68)

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
