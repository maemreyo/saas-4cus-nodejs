[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-subscriber.dto](../README.md) / subscriberFiltersSchema

# Variable: subscriberFiltersSchema

> `const` **subscriberFiltersSchema**: `ZodObject`\<\{ `confirmed`: `ZodOptional`\<`ZodBoolean`\>; `dateFrom`: `ZodOptional`\<`ZodDate`\>; `dateTo`: `ZodOptional`\<`ZodDate`\>; `engagementLevel`: `ZodOptional`\<`ZodNativeEnum`\<\{ \}\>\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `listId`: `ZodOptional`\<`ZodString`\>; `page`: `ZodDefault`\<`ZodNumber`\>; `search`: `ZodOptional`\<`ZodString`\>; `sortBy`: `ZodDefault`\<`ZodEnum`\<\[`"email"`, `"subscribedAt"`, `"lastEngagedAt"`, `"engagementScore"`\]\>\>; `sortOrder`: `ZodDefault`\<`ZodEnum`\<\[`"asc"`, `"desc"`\]\>\>; `subscribed`: `ZodOptional`\<`ZodBoolean`\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `confirmed?`: `boolean`; `dateFrom?`: `Date`; `dateTo?`: `Date`; `engagementLevel?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"NONE"`; `limit?`: `number`; `listId?`: `string`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"email"` \| `"lastEngagedAt"` \| `"engagementScore"` \| `"subscribedAt"`; `sortOrder?`: `"asc"` \| `"desc"`; `subscribed?`: `boolean`; `tags?`: `string`[]; \}, \{ `confirmed?`: `boolean`; `dateFrom?`: `Date`; `dateTo?`: `Date`; `engagementLevel?`: `"LOW"` \| `"MEDIUM"` \| `"HIGH"` \| `"NONE"`; `limit?`: `number`; `listId?`: `string`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"email"` \| `"lastEngagedAt"` \| `"engagementScore"` \| `"subscribedAt"`; `sortOrder?`: `"asc"` \| `"desc"`; `subscribed?`: `boolean`; `tags?`: `string`[]; \}\>

Defined in: [src/modules/email-marketing/dto/email-subscriber.dto.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-subscriber.dto.ts#L18)
