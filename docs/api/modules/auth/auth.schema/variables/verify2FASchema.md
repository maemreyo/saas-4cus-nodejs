[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.schema](../README.md) / verify2FASchema

# Variable: verify2FASchema

> `const` **verify2FASchema**: `object`

Defined in: [src/modules/auth/auth.schema.ts:111](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/auth/auth.schema.ts#L111)

## Type declaration

### body

> **body**: `object`

#### body.properties

> **properties**: `object`

#### body.properties.code

> **code**: `object`

#### body.properties.code.maxLength

> **maxLength**: `number` = `6`

#### body.properties.code.minLength

> **minLength**: `number` = `6`

#### body.properties.code.type

> **type**: `string` = `'string'`

#### body.required

> **required**: `string`[]

#### body.type

> **type**: `string` = `'object'`
