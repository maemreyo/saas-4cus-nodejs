[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/billing/billing.dto](../README.md) / UpdateSubscriptionDTO

# Class: UpdateSubscriptionDTO

Defined in: [src/modules/billing/billing.dto.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/billing/billing.dto.ts#L21)

## Constructors

### Constructor

> **new UpdateSubscriptionDTO**(): `UpdateSubscriptionDTO`

#### Returns

`UpdateSubscriptionDTO`

## Properties

### priceId

> **priceId**: `string`

Defined in: [src/modules/billing/billing.dto.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/billing/billing.dto.ts#L27)

***

### prorationBehavior?

> `optional` **prorationBehavior**: `"none"` \| `"create_prorations"` \| `"always_invoice"`

Defined in: [src/modules/billing/billing.dto.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/billing/billing.dto.ts#L28)

***

### schema

> `static` **schema**: `ZodObject`\<\{ `priceId`: `ZodString`; `prorationBehavior`: `ZodOptional`\<`ZodEnum`\<\[`"create_prorations"`, `"none"`, `"always_invoice"`\]\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `priceId?`: `string`; `prorationBehavior?`: `"none"` \| `"create_prorations"` \| `"always_invoice"`; \}, \{ `priceId?`: `string`; `prorationBehavior?`: `"none"` \| `"create_prorations"` \| `"always_invoice"`; \}\>

Defined in: [src/modules/billing/billing.dto.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/billing/billing.dto.ts#L22)
