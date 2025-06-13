[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/analytics/analytics.dto](../README.md) / ScheduleReportDTO

# Class: ScheduleReportDTO

Defined in: [src/modules/analytics/analytics.dto.ts:84](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L84)

## Constructors

### Constructor

> **new ScheduleReportDTO**(): `ScheduleReportDTO`

#### Returns

`ScheduleReportDTO`

## Properties

### filters?

> `optional` **filters**: `any`

Defined in: [src/modules/analytics/analytics.dto.ts:105](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L105)

***

### format

> **format**: `"csv"` \| `"json"` \| `"pdf"`

Defined in: [src/modules/analytics/analytics.dto.ts:97](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L97)

***

### name

> **name**: `string`

Defined in: [src/modules/analytics/analytics.dto.ts:95](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L95)

***

### recipients?

> `optional` **recipients**: `string`[]

Defined in: [src/modules/analytics/analytics.dto.ts:98](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L98)

***

### schedule

> **schedule**: `object`

Defined in: [src/modules/analytics/analytics.dto.ts:99](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L99)

#### dayOfMonth?

> `optional` **dayOfMonth**: `number`

#### dayOfWeek?

> `optional` **dayOfWeek**: `number`

#### frequency

> **frequency**: `"daily"` \| `"weekly"` \| `"monthly"`

#### hour?

> `optional` **hour**: `number`

***

### schema

> `static` **schema**: `ZodObject`\<`object` & `object`, `"strip"`, `ZodTypeAny`, \{ `customQuery?`: `any`; `filters?`: \{ `dateRange?`: `number`; `endDate?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}; `format?`: `"csv"` \| `"json"` \| `"pdf"`; `name?`: `string`; `recipients?`: `string`[]; `schedule?`: \{ `dayOfMonth?`: `number`; `dayOfWeek?`: `number`; `frequency?`: `"daily"` \| `"weekly"` \| `"monthly"`; `hour?`: `number`; \}; `type?`: `"custom"` \| `"revenue"` \| `"users"` \| `"dashboard"`; \}, \{ `customQuery?`: `any`; `filters?`: \{ `dateRange?`: `number`; `endDate?`: `string`; `startDate?`: `string`; `tenantId?`: `string`; \}; `format?`: `"csv"` \| `"json"` \| `"pdf"`; `name?`: `string`; `recipients?`: `string`[]; `schedule?`: \{ `dayOfMonth?`: `number`; `dayOfWeek?`: `number`; `frequency?`: `"daily"` \| `"weekly"` \| `"monthly"`; `hour?`: `number`; \}; `type?`: `"custom"` \| `"revenue"` \| `"users"` \| `"dashboard"`; \}\>

Defined in: [src/modules/analytics/analytics.dto.ts:85](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L85)

***

### type

> **type**: `"custom"` \| `"revenue"` \| `"users"` \| `"dashboard"`

Defined in: [src/modules/analytics/analytics.dto.ts:96](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/analytics/analytics.dto.ts#L96)
