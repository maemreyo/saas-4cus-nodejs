[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin-moderation.service](../README.md) / AdminModerationService

# Class: AdminModerationService

Defined in: [src/modules/admin/admin-moderation.service.ts:60](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L60)

## Constructors

### Constructor

> **new AdminModerationService**(`eventBus`, `auditService`, `emailService`, `notificationService`): `AdminModerationService`

Defined in: [src/modules/admin/admin-moderation.service.ts:63](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L63)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### auditService

[`AuditService`](../../../../shared/services/audit.service/classes/AuditService.md)

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

##### notificationService

[`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

#### Returns

`AdminModerationService`

## Methods

### approveContent()

> `private` **approveContent**(`entityType`, `entityId`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:596](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L596)

#### Parameters

##### entityType

`string`

##### entityId

`string`

#### Returns

`Promise`\<`void`\>

***

### bulkModerate()

> **bulkModerate**(`adminId`, `items`, `action`, `reason?`): `Promise`\<\{ `failed`: `object`[]; `succeeded`: `string`[]; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:193](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L193)

Bulk content moderation

#### Parameters

##### adminId

`string`

##### items

`object`[]

##### action

`"delete"` | `"flag"` | `"approve"` | `"reject"`

##### reason?

`string`

#### Returns

`Promise`\<\{ `failed`: `object`[]; `succeeded`: `string`[]; \}\>

***

### checkCCPACompliance()

> `private` **checkCCPACompliance**(): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:672](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L672)

#### Returns

`Promise`\<`boolean`\>

***

### checkContent()

> **checkContent**(`content`): `Promise`\<\{ `passed`: `boolean`; `violations`: `object`[]; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:420](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L420)

Check content against moderation rules

#### Parameters

##### content

`string`

#### Returns

`Promise`\<\{ `passed`: `boolean`; `violations`: `object`[]; \}\>

***

### checkCOPPACompliance()

> `private` **checkCOPPACompliance**(): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:665](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L665)

#### Returns

`Promise`\<`boolean`\>

***

### checkGDPRCompliance()

> `private` **checkGDPRCompliance**(): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:656](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L656)

#### Returns

`Promise`\<`boolean`\>

***

### deleteContent()

> `private` **deleteContent**(`entityType`, `entityId`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:601](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L601)

#### Parameters

##### entityType

`string`

##### entityId

`string`

#### Returns

`Promise`\<`void`\>

***

### exportUserData()

> `private` **exportUserData**(`userId`): `Promise`\<\{ `exportedAt`: `Date`; `format`: `string`; `userData`: \{ `auditLogs`: `object`[]; `files`: `object`[]; `notifications`: `object`[]; `projects`: `object`[]; `sessions`: `object`[]; `tickets`: `object`[]; \}; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:679](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L679)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `exportedAt`: `Date`; `format`: `string`; `userData`: \{ `auditLogs`: `object`[]; `files`: `object`[]; `notifications`: `object`[]; `projects`: `object`[]; `sessions`: `object`[]; `tickets`: `object`[]; \}; \}\>

***

### exportUserDataPortable()

> `private` **exportUserDataPortable**(`userId`): `Promise`\<\{ `exportedAt`: `Date`; `format`: `string`; `schema`: `string`; `userData`: \{ `auditLogs`: `object`[]; `files`: `object`[]; `notifications`: `object`[]; `projects`: `object`[]; `sessions`: `object`[]; `tickets`: `object`[]; \}; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:724](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L724)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `exportedAt`: `Date`; `format`: `string`; `schema`: `string`; `userData`: \{ `auditLogs`: `object`[]; `files`: `object`[]; `notifications`: `object`[]; `projects`: `object`[]; `sessions`: `object`[]; `tickets`: `object`[]; \}; \}\>

***

### flagContent()

> `private` **flagContent**(`entityType`, `entityId`, `reason?`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:591](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L591)

#### Parameters

##### entityType

`string`

##### entityId

`string`

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### formatReport()

> `private` **formatReport**(`auditLog`): [`ContentReport`](../interfaces/ContentReport.md)

Defined in: [src/modules/admin/admin-moderation.service.ts:642](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L642)

#### Parameters

##### auditLog

`any`

#### Returns

[`ContentReport`](../interfaces/ContentReport.md)

***

### generateComplianceReport()

> **generateComplianceReport**(`startDate`, `endDate`): `Promise`\<[`ComplianceReport`](../interfaces/ComplianceReport.md)\>

Defined in: [src/modules/admin/admin-moderation.service.ts:479](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L479)

Generate compliance report

#### Parameters

##### startDate

`Date`

##### endDate

`Date`

#### Returns

`Promise`\<[`ComplianceReport`](../interfaces/ComplianceReport.md)\>

***

### getContentEntity()

> `private` **getContentEntity**(`entityType`, `entityId`): `Promise`\<`any`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:551](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L551)

#### Parameters

##### entityType

`string`

##### entityId

`string`

#### Returns

`Promise`\<`any`\>

***

### getContentReports()

> **getContentReports**(`filters?`, `pagination?`): `Promise`\<\{ `pagination`: \{ `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}; `reports`: [`ContentReport`](../interfaces/ContentReport.md)[]; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:243](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L243)

Get content reports

#### Parameters

##### filters?

###### endDate?

`Date`

###### entityType?

`string`

###### reportedBy?

`string`

###### startDate?

`Date`

###### status?

`string`

##### pagination?

###### limit?

`number`

###### page?

`number`

#### Returns

`Promise`\<\{ `pagination`: \{ `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}; `reports`: [`ContentReport`](../interfaces/ContentReport.md)[]; \}\>

***

### getModerationRules()

> **getModerationRules**(): [`ModerationRule`](../interfaces/ModerationRule.md)[]

Defined in: [src/modules/admin/admin-moderation.service.ts:394](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L394)

Get/update moderation rules

#### Returns

[`ModerationRule`](../interfaces/ModerationRule.md)[]

***

### getModerationStats()

> **getModerationStats**(`startDate?`, `endDate?`): `Promise`\<\{ `byAction`: \{ `approve`: `number`; `flag`: `number`; `reject`: `number`; \}; `summary`: \{ `approved`: `number`; `averageResolutionTime`: `number`; `flagged`: `number`; `pending`: `number`; `rejected`: `number`; `total`: `number`; \}; `topReviewers`: `object`[]; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:295](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L295)

Get moderation statistics

#### Parameters

##### startDate?

`Date`

##### endDate?

`Date`

#### Returns

`Promise`\<\{ `byAction`: \{ `approve`: `number`; `flag`: `number`; `reject`: `number`; \}; `summary`: \{ `approved`: `number`; `averageResolutionTime`: `number`; `flagged`: `number`; `pending`: `number`; `rejected`: `number`; `total`: `number`; \}; `topReviewers`: `object`[]; \}\>

***

### handleDataRequest()

> **handleDataRequest**(`userId`, `requestType`): `Promise`\<\{ `exportedAt`: `Date`; `format`: `string`; `userData`: \{ `auditLogs`: `object`[]; `files`: `object`[]; `notifications`: `object`[]; `projects`: `object`[]; `sessions`: `object`[]; `tickets`: `object`[]; \}; \} \| \{ `deletionDate`: `Date`; `scheduled`: `boolean`; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:531](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L531)

Handle user data request (GDPR)

#### Parameters

##### userId

`string`

##### requestType

`"access"` | `"deletion"` | `"portability"`

#### Returns

`Promise`\<\{ `exportedAt`: `Date`; `format`: `string`; `userData`: \{ `auditLogs`: `object`[]; `files`: `object`[]; `notifications`: `object`[]; `projects`: `object`[]; `sessions`: `object`[]; `tickets`: `object`[]; \}; \} \| \{ `deletionDate`: `Date`; `scheduled`: `boolean`; \}\>

***

### initializeModerationRules()

> `private` **initializeModerationRules**(): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L75)

Initialize default moderation rules

#### Returns

`Promise`\<`void`\>

***

### notifyContentDecision()

> `private` **notifyContentDecision**(`userId`, `entityType`, `entityId`, `decision`, `reason?`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:621](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L621)

#### Parameters

##### userId

`string`

##### entityType

`string`

##### entityId

`string`

##### decision

`string`

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### rejectContent()

> `private` **rejectContent**(`entityType`, `entityId`, `reason?`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:570](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L570)

#### Parameters

##### entityType

`string`

##### entityId

`string`

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### reviewContent()

> **reviewContent**(`adminId`, `entityType`, `entityId`, `decision`, `reason?`, `notes?`): `Promise`\<\{ `decision`: `"flag"` \| `"approve"` \| `"reject"`; `entityId`: `string`; `entityType`: `string`; `notes`: `string`; `reason`: `string`; `reviewedAt`: `Date`; `reviewedBy`: `string`; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:117](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L117)

Review content for violations

#### Parameters

##### adminId

`string`

##### entityType

`string`

##### entityId

`string`

##### decision

`"flag"` | `"approve"` | `"reject"`

##### reason?

`string`

##### notes?

`string`

#### Returns

`Promise`\<\{ `decision`: `"flag"` \| `"approve"` \| `"reject"`; `entityId`: `string`; `entityType`: `string`; `notes`: `string`; `reason`: `string`; `reviewedAt`: `Date`; `reviewedBy`: `string`; \}\>

***

### scheduleUserDeletion()

> `private` **scheduleUserDeletion**(`userId`): `Promise`\<\{ `deletionDate`: `Date`; `scheduled`: `boolean`; \}\>

Defined in: [src/modules/admin/admin-moderation.service.ts:706](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L706)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `deletionDate`: `Date`; `scheduled`: `boolean`; \}\>

***

### updateModerationRule()

> **updateModerationRule**(`ruleId`, `updates`): `Promise`\<[`ModerationRule`](../interfaces/ModerationRule.md)\>

Defined in: [src/modules/admin/admin-moderation.service.ts:399](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L399)

#### Parameters

##### ruleId

`string`

##### updates

`Partial`\<[`ModerationRule`](../interfaces/ModerationRule.md)\>

#### Returns

`Promise`\<[`ModerationRule`](../interfaces/ModerationRule.md)\>

## Properties

### auditService

> `private` **auditService**: [`AuditService`](../../../../shared/services/audit.service/classes/AuditService.md)

Defined in: [src/modules/admin/admin-moderation.service.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L65)

***

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/admin/admin-moderation.service.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L66)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/admin/admin-moderation.service.ts:64](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L64)

***

### moderationRules

> `private` **moderationRules**: `Map`\<`string`, [`ModerationRule`](../interfaces/ModerationRule.md)\>

Defined in: [src/modules/admin/admin-moderation.service.ts:61](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L61)

***

### notificationService

> `private` **notificationService**: [`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

Defined in: [src/modules/admin/admin-moderation.service.ts:67](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L67)
