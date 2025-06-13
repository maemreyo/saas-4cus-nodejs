[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.controller](../README.md) / AdminController

# Class: AdminController

Defined in: [src/modules/admin/admin.controller.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L35)

## Constructors

### Constructor

> **new AdminController**(`adminUserService`, `adminMetricsService`, `adminModerationService`, `auditService`, `systemConfigService`, `subscriptionService`, `billingService`, `ticketService`, `featureService`, `announcementService`, `dataExportService`): `AdminController`

Defined in: [src/modules/admin/admin.controller.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L36)

#### Parameters

##### adminUserService

[`AdminUserService`](../../admin-user.service/classes/AdminUserService.md)

##### adminMetricsService

[`AdminMetricsService`](../../admin-metrics.service/classes/AdminMetricsService.md)

##### adminModerationService

[`AdminModerationService`](../../admin-moderation.service/classes/AdminModerationService.md)

##### auditService

[`AuditService`](../../../../shared/services/audit.service/classes/AuditService.md)

##### systemConfigService

[`SystemConfigService`](../../system-config.service/classes/SystemConfigService.md)

##### subscriptionService

[`SubscriptionService`](../../../billing/subscription.service/classes/SubscriptionService.md)

##### billingService

[`BillingService`](../../../billing/billing.service/classes/BillingService.md)

##### ticketService

[`TicketService`](../../../support/ticket.service/classes/TicketService.md)

##### featureService

[`FeatureService`](../../../features/feature.service/classes/FeatureService.md)

##### announcementService

[`AnnouncementService`](../../announcement.service/classes/AnnouncementService.md)

##### dataExportService

[`DataExportService`](../../data-export.service/classes/DataExportService.md)

#### Returns

`AdminController`

## Methods

### assignTicket()

> **assignTicket**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:484](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L484)

Assign ticket to agent

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `assigneeId`: `string`; \}; `Params`: \{ `ticketId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### bulkModerateContent()

> **bulkModerateContent**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:269](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L269)

Bulk content moderation

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`BulkContentActionDTO`](../../admin.dto/classes/BulkContentActionDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### bulkUserAction()

> **bulkUserAction**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:103](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L103)

Perform bulk actions on users

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`BulkUserActionDTO`](../../admin.dto/classes/BulkUserActionDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createAnnouncement()

> **createAnnouncement**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:527](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L527)

Create system announcement

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CreateAnnouncementDTO`](../../admin.dto/classes/CreateAnnouncementDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### exportData()

> **exportData**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:572](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L572)

Export data

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`DataExportDTO`](../../admin.dto/classes/DataExportDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### generateComplianceReport()

> **generateComplianceReport**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:615](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L615)

Generate compliance report

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `endDate`: `string`; `startDate`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getAnnouncements()

> **getAnnouncements**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:562](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L562)

Get active announcements

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getAuditLogs()

> **getAuditLogs**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:407](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L407)

Query audit logs

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`AuditLogQueryDTO`](../../admin.dto/classes/AuditLogQueryDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getContentReports()

> **getContentReports**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:300](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L300)

Get content reports

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `entityType?`: `string`; `limit?`: `number`; `page?`: `number`; `status?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getFeatureUsage()

> **getFeatureUsage**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:504](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L504)

Get feature usage analytics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`FeatureUsageQueryDTO`](../../admin.dto/classes/FeatureUsageQueryDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getModerationRules()

> **getModerationRules**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:342](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L342)

Get moderation rules

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getModerationStats()

> **getModerationStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:325](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L325)

Get moderation statistics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `endDate?`: `string`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getRealTimeMetrics()

> **getRealTimeMetrics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:234](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L234)

Get real-time metrics

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getRevenueAnalytics()

> **getRevenueAnalytics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:436](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L436)

Get revenue analytics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`RevenueQueryDTO`](../../admin.dto/classes/RevenueQueryDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getRevenueMetrics()

> **getRevenueMetrics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:202](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L202)

Get revenue metrics

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSystemConfig()

> **getSystemConfig**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:374](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L374)

Get system configuration

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSystemHealth()

> **getSystemHealth**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:222](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L222)

Get system health status

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`SystemHealthQueryDTO`](../../admin.dto/classes/SystemHealthQueryDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getSystemMetrics()

> **getSystemMetrics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:185](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L185)

Get comprehensive system metrics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`MetricsQueryDTO`](../../admin.dto/classes/MetricsQueryDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTicketStats()

> **getTicketStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:472](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L472)

Get ticket statistics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`TicketStatsQueryDTO`](../../admin.dto/classes/TicketStatsQueryDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUsageMetrics()

> **getUsageMetrics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:210](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L210)

Get usage metrics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `days?`: `number`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserActivity()

> **getUserActivity**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:137](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L137)

Get user activity timeline

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `userId`: `string`; \}; `Querystring`: \{ `days?`: `number`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserDetails()

> **getUserDetails**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:68](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L68)

Get detailed user information

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `userId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserStatistics()

> **getUserStatistics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:129](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L129)

Get user statistics

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### handleGDPRRequest()

> **handleGDPRRequest**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:634](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L634)

Handle GDPR request

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `requestType`: `"access"` \| `"deletion"` \| `"portability"`; `userId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### impersonateUser()

> **impersonateUser**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L154)

Impersonate user (for debugging)

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `userId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### processRefund()

> **processRefund**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:448](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L448)

Process refund

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`RefundDTO`](../../admin.dto/classes/RefundDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### reviewContent()

> **reviewContent**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:244](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L244)

Review content

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`ContentReviewDTO`](../../admin.dto/classes/ContentReviewDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### searchUsers()

> **searchUsers**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L55)

Search and list users

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`UserSearchDTO`](../../admin.dto/classes/UserSearchDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateModerationRule()

> **updateModerationRule**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:350](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L350)

Update moderation rule

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: `any`; `Params`: \{ `ruleId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateSystemConfig()

> **updateSystemConfig**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:382](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L382)

Update system configuration

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`SystemConfigDTO`](../../admin.dto/classes/SystemConfigDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateUser()

> **updateUser**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/admin/admin.controller.ts:81](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L81)

Update user information

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`UpdateUserDTO`](../../admin.dto/classes/UpdateUserDTO.md); `Params`: \{ `userId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### adminMetricsService

> `private` **adminMetricsService**: [`AdminMetricsService`](../../admin-metrics.service/classes/AdminMetricsService.md)

Defined in: [src/modules/admin/admin.controller.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L38)

***

### adminModerationService

> `private` **adminModerationService**: [`AdminModerationService`](../../admin-moderation.service/classes/AdminModerationService.md)

Defined in: [src/modules/admin/admin.controller.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L39)

***

### adminUserService

> `private` **adminUserService**: [`AdminUserService`](../../admin-user.service/classes/AdminUserService.md)

Defined in: [src/modules/admin/admin.controller.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L37)

***

### announcementService

> `private` **announcementService**: [`AnnouncementService`](../../announcement.service/classes/AnnouncementService.md)

Defined in: [src/modules/admin/admin.controller.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L46)

***

### auditService

> `private` **auditService**: [`AuditService`](../../../../shared/services/audit.service/classes/AuditService.md)

Defined in: [src/modules/admin/admin.controller.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L40)

***

### billingService

> `private` **billingService**: [`BillingService`](../../../billing/billing.service/classes/BillingService.md)

Defined in: [src/modules/admin/admin.controller.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L43)

***

### dataExportService

> `private` **dataExportService**: [`DataExportService`](../../data-export.service/classes/DataExportService.md)

Defined in: [src/modules/admin/admin.controller.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L47)

***

### featureService

> `private` **featureService**: [`FeatureService`](../../../features/feature.service/classes/FeatureService.md)

Defined in: [src/modules/admin/admin.controller.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L45)

***

### subscriptionService

> `private` **subscriptionService**: [`SubscriptionService`](../../../billing/subscription.service/classes/SubscriptionService.md)

Defined in: [src/modules/admin/admin.controller.ts:42](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L42)

***

### systemConfigService

> `private` **systemConfigService**: [`SystemConfigService`](../../system-config.service/classes/SystemConfigService.md)

Defined in: [src/modules/admin/admin.controller.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L41)

***

### ticketService

> `private` **ticketService**: [`TicketService`](../../../support/ticket.service/classes/TicketService.md)

Defined in: [src/modules/admin/admin.controller.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.controller.ts#L44)
