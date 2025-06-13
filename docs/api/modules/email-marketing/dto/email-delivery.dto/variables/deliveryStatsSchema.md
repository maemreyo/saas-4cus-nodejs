[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-delivery.dto](../README.md) / deliveryStatsSchema

# Variable: deliveryStatsSchema

> `const` **deliveryStatsSchema**: `ZodObject`\<\{ `campaignId`: `ZodString`; `endDate`: `ZodOptional`\<`ZodDate`\>; `period`: `ZodDefault`\<`ZodEnum`\<\[`"hour"`, `"day"`, `"week"`, `"month"`, `"total"`\]\>\>; `startDate`: `ZodOptional`\<`ZodDate`\>; \}, `"strip"`, `ZodTypeAny`, \{ `campaignId?`: `string`; `endDate?`: `Date`; `period?`: `"total"` \| `"month"` \| `"hour"` \| `"day"` \| `"week"`; `startDate?`: `Date`; \}, \{ `campaignId?`: `string`; `endDate?`: `Date`; `period?`: `"total"` \| `"month"` \| `"hour"` \| `"day"` \| `"week"`; `startDate?`: `Date`; \}\>

Defined in: [src/modules/email-marketing/dto/email-delivery.dto.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-delivery.dto.ts#L36)
