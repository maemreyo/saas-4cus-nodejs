[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.dto](../README.md) / ApiKeyResponseSchema

# Variable: ApiKeyResponseSchema

> `const` **ApiKeyResponseSchema**: `ZodObject`\<\{ `createdAt`: `ZodString`; `currentUsage`: `ZodNumber`; `expiresAt`: `ZodNullable`\<`ZodString`\>; `id`: `ZodString`; `lastUsedAt`: `ZodNullable`\<`ZodString`\>; `name`: `ZodString`; `provider`: `ZodObject`\<\{ `displayName`: `ZodString`; `id`: `ZodString`; `name`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `displayName?`: `string`; `id?`: `string`; `name?`: `string`; \}, \{ `displayName?`: `string`; `id?`: `string`; `name?`: `string`; \}\>; `providerId`: `ZodString`; `updatedAt`: `ZodString`; `usageLimit`: `ZodNullable`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `createdAt?`: `string`; `currentUsage?`: `number`; `expiresAt?`: `string`; `id?`: `string`; `lastUsedAt?`: `string`; `name?`: `string`; `provider?`: \{ `displayName?`: `string`; `id?`: `string`; `name?`: `string`; \}; `providerId?`: `string`; `updatedAt?`: `string`; `usageLimit?`: `number`; \}, \{ `createdAt?`: `string`; `currentUsage?`: `number`; `expiresAt?`: `string`; `id?`: `string`; `lastUsedAt?`: `string`; `name?`: `string`; `provider?`: \{ `displayName?`: `string`; `id?`: `string`; `name?`: `string`; \}; `providerId?`: `string`; `updatedAt?`: `string`; `usageLimit?`: `number`; \}\>

Defined in: [src/modules/ai/ai.dto.ts:314](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/modules/ai/ai.dto.ts#L314)
