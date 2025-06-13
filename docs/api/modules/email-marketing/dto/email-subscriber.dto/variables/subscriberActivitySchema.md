[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-subscriber.dto](../README.md) / subscriberActivitySchema

# Variable: subscriberActivitySchema

> `const` **subscriberActivitySchema**: `ZodObject`\<\{ `campaignId`: `ZodOptional`\<`ZodString`\>; `clickedUrl`: `ZodOptional`\<`ZodString`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `subscriberId`: `ZodString`; `type`: `ZodNativeEnum`\<\{ \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `campaignId?`: `string`; `clickedUrl?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `subscriberId?`: `string`; `type?`: `"SENT"` \| `"FAILED"` \| `"DELIVERED"` \| `"BOUNCED"` \| `"OPENED"` \| `"CLICKED"` \| `"UNSUBSCRIBED"` \| `"COMPLAINED"`; \}, \{ `campaignId?`: `string`; `clickedUrl?`: `string`; `metadata?`: `Record`\<`string`, `any`\>; `subscriberId?`: `string`; `type?`: `"SENT"` \| `"FAILED"` \| `"DELIVERED"` \| `"BOUNCED"` \| `"OPENED"` \| `"CLICKED"` \| `"UNSUBSCRIBED"` \| `"COMPLAINED"`; \}\>

Defined in: [src/modules/email-marketing/dto/email-subscriber.dto.ts:7](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-subscriber.dto.ts#L7)
