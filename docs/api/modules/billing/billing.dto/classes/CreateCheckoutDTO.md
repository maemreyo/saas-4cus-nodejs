[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/billing/billing.dto](../README.md) / CreateCheckoutDTO

# Class: CreateCheckoutDTO

Defined in: [src/modules/billing/billing.dto.ts:3](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.dto.ts#L3)

## Constructors

### Constructor

> **new CreateCheckoutDTO**(): `CreateCheckoutDTO`

#### Returns

`CreateCheckoutDTO`

## Properties

### cancelUrl

> **cancelUrl**: `string`

Defined in: [src/modules/billing/billing.dto.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.dto.ts#L15)

***

### couponId?

> `optional` **couponId**: `string`

Defined in: [src/modules/billing/billing.dto.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.dto.ts#L16)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `string`\>

Defined in: [src/modules/billing/billing.dto.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.dto.ts#L18)

***

### priceId

> **priceId**: `string`

Defined in: [src/modules/billing/billing.dto.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.dto.ts#L13)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `cancelUrl`: `ZodString`; `couponId`: `ZodOptional`\<`ZodString`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>; `priceId`: `ZodString`; `successUrl`: `ZodString`; `trialDays`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `cancelUrl?`: `string`; `couponId?`: `string`; `metadata?`: `Record`\<`string`, `string`\>; `priceId?`: `string`; `successUrl?`: `string`; `trialDays?`: `number`; \}, \{ `cancelUrl?`: `string`; `couponId?`: `string`; `metadata?`: `Record`\<`string`, `string`\>; `priceId?`: `string`; `successUrl?`: `string`; `trialDays?`: `number`; \}\>

Defined in: [src/modules/billing/billing.dto.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.dto.ts#L4)

***

### successUrl

> **successUrl**: `string`

Defined in: [src/modules/billing/billing.dto.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.dto.ts#L14)

***

### trialDays?

> `optional` **trialDays**: `number`

Defined in: [src/modules/billing/billing.dto.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/billing/billing.dto.ts#L17)
