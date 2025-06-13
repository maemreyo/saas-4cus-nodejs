[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/dto/email-delivery.dto](../README.md) / deliveryStatusUpdateSchema

# Variable: deliveryStatusUpdateSchema

> `const` **deliveryStatusUpdateSchema**: `ZodObject`\<\{ `details`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `messageId`: `ZodString`; `status`: `ZodNativeEnum`\<\{ \}\>; `timestamp`: `ZodDefault`\<`ZodDate`\>; \}, `"strip"`, `ZodTypeAny`, \{ `details?`: `Record`\<`string`, `any`\>; `messageId?`: `string`; `status?`: `"SENT"` \| `"FAILED"` \| `"PENDING"` \| `"DELIVERED"` \| `"BOUNCED"` \| `"OPENED"` \| `"CLICKED"` \| `"UNSUBSCRIBED"` \| `"COMPLAINED"`; `timestamp?`: `Date`; \}, \{ `details?`: `Record`\<`string`, `any`\>; `messageId?`: `string`; `status?`: `"SENT"` \| `"FAILED"` \| `"PENDING"` \| `"DELIVERED"` \| `"BOUNCED"` \| `"OPENED"` \| `"CLICKED"` \| `"UNSUBSCRIBED"` \| `"COMPLAINED"`; `timestamp?`: `Date`; \}\>

Defined in: [src/modules/email-marketing/dto/email-delivery.dto.ts:7](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/dto/email-delivery.dto.ts#L7)
