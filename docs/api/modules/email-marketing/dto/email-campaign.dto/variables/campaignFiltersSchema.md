[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-campaign.dto](../README.md) / campaignFiltersSchema

# Variable: campaignFiltersSchema

> `const` **campaignFiltersSchema**: `ZodObject`\<\{ `dateFrom`: `ZodOptional`\<`ZodDate`\>; `dateTo`: `ZodOptional`\<`ZodDate`\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `listId`: `ZodOptional`\<`ZodString`\>; `page`: `ZodDefault`\<`ZodNumber`\>; `search`: `ZodOptional`\<`ZodString`\>; `sortBy`: `ZodDefault`\<`ZodEnum`\<\[`"name"`, `"createdAt"`, `"sentAt"`, `"openRate"`, `"clickRate"`\]\>\>; `sortOrder`: `ZodDefault`\<`ZodEnum`\<\[`"asc"`, `"desc"`\]\>\>; `status`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `type`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `dateFrom?`: `Date`; `dateTo?`: `Date`; `limit?`: `number`; `listId?`: `string`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"sentAt"` \| `"openRate"` \| `"clickRate"`; `sortOrder?`: `"asc"` \| `"desc"`; `status?`: `"PAUSED"` \| `"CANCELLED"` \| `"DRAFT"` \| `"SCHEDULED"` \| `"SENDING"` \| `"SENT"` \| `"FAILED"`; `type?`: `"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"`; \}, \{ `dateFrom?`: `Date`; `dateTo?`: `Date`; `limit?`: `number`; `listId?`: `string`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"sentAt"` \| `"openRate"` \| `"clickRate"`; `sortOrder?`: `"asc"` \| `"desc"`; `status?`: `"PAUSED"` \| `"CANCELLED"` \| `"DRAFT"` \| `"SCHEDULED"` \| `"SENDING"` \| `"SENT"` \| `"FAILED"`; `type?`: `"REGULAR"` \| `"AUTOMATED"` \| `"DRIP"` \| `"TRANSACTIONAL"` \| `"AB_TEST"`; \}\>

Defined in: [src/modules/email-marketing/dto/email-campaign.dto.ts:79](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-campaign.dto.ts#L79)
