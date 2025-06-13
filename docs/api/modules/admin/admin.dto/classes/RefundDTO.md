[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / RefundDTO

# Class: RefundDTO

Defined in: [src/modules/admin/admin.dto.ts:171](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/admin/admin.dto.ts#L171)

## Constructors

### Constructor

> **new RefundDTO**(): `RefundDTO`

#### Returns

`RefundDTO`

## Properties

### schema

> `static` **schema**: `ZodObject`\<\{ `amount`: `ZodOptional`\<`ZodNumber`\>; `notifyCustomer`: `ZodDefault`\<`ZodBoolean`\>; `reason`: `ZodString`; `subscriptionId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `amount?`: `number`; `notifyCustomer?`: `boolean`; `reason?`: `string`; `subscriptionId?`: `string`; \}, \{ `amount?`: `number`; `notifyCustomer?`: `boolean`; `reason?`: `string`; `subscriptionId?`: `string`; \}\>

Defined in: [src/modules/admin/admin.dto.ts:172](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/admin/admin.dto.ts#L172)
