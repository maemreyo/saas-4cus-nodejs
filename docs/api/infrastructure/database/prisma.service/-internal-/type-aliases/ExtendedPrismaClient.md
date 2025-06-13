[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [infrastructure/database/prisma.service](../../README.md) / [\<internal\>](../README.md) / ExtendedPrismaClient

# Type Alias: ExtendedPrismaClient

> **ExtendedPrismaClient** = `PrismaClient` & `object`

Defined in: [src/infrastructure/database/prisma.service.ts:7](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/database/prisma.service.ts#L7)

## Type declaration

### $transaction()

> **$transaction**\<`T`\>(`fn`): `Promise`\<`T`\>

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`prisma`) => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
