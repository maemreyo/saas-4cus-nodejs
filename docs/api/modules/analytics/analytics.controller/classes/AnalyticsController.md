[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/analytics.controller](../README.md) / AnalyticsController

# Class: AnalyticsController

Defined in: [src/modules/analytics/analytics.controller.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L16)

## Constructors

### Constructor

> **new AnalyticsController**(`analyticsService`, `reportService`): `AnalyticsController`

Defined in: [src/modules/analytics/analytics.controller.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L17)

#### Parameters

##### analyticsService

[`AnalyticsService`](../../analytics.service/classes/AnalyticsService.md)

##### reportService

[`ReportService`](../../report.service/classes/ReportService.md)

#### Returns

`AnalyticsController`

## Methods

### generateReport()

> **generateReport**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.controller.ts:132](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L132)

Generate report

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`GenerateReportDTO`](../../analytics.dto/classes/GenerateReportDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getCohortRetention()

> **getCohortRetention**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.controller.ts:90](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L90)

Get cohort retention

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`GetCohortDTO`](../../analytics.dto/classes/GetCohortDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getDashboard()

> **getDashboard**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.controller.ts:61](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L61)

Get dashboard metrics

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`GetDashboardDTO`](../../analytics.dto/classes/GetDashboardDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getFunnel()

> **getFunnel**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.controller.ts:73](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L73)

Get funnel analytics

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`GetFunnelDTO`](../../analytics.dto/classes/GetFunnelDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getUserJourney()

> **getUserJourney**(`request`, `reply`): `Promise`\<`never`\>

Defined in: [src/modules/analytics/analytics.controller.ts:106](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L106)

Get user journey

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `userId`: `string`; \}; `Querystring`: \{ `endDate?`: `string`; `limit?`: `number`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`never`\>

***

### scheduleReport()

> **scheduleReport**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.controller.ts:158](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L158)

Schedule recurring report

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`ScheduleReportDTO`](../../analytics.dto/classes/ScheduleReportDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### trackEvent()

> **trackEvent**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.controller.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L25)

Track analytics event

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`TrackEventDTO`](../../analytics.dto/classes/TrackEventDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### trackPageView()

> **trackPageView**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/analytics/analytics.controller.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L49)

Track page view

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `page`: `string`; `properties?`: `any`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### analyticsService

> `private` **analyticsService**: [`AnalyticsService`](../../analytics.service/classes/AnalyticsService.md)

Defined in: [src/modules/analytics/analytics.controller.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L18)

***

### reportService

> `private` **reportService**: [`ReportService`](../../report.service/classes/ReportService.md)

Defined in: [src/modules/analytics/analytics.controller.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.controller.ts#L19)
