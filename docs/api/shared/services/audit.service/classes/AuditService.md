[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/services/audit.service](../README.md) / AuditService

# Class: AuditService

Defined in: [src/shared/services/audit.service.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/audit.service.ts#L18)

## Constructors

### Constructor

> **new AuditService**(): `AuditService`

#### Returns

`AuditService`

## Methods

### cleanup()

> **cleanup**(`retentionDays`): `Promise`\<`number`\>

Defined in: [src/shared/services/audit.service.ts:171](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/audit.service.ts#L171)

Clean up old audit logs

#### Parameters

##### retentionDays

`number` = `90`

#### Returns

`Promise`\<`number`\>

***

### getEntityHistory()

> **getEntityHistory**(`entity`, `entityId`): `Promise`\<`object` & `object`[]\>

Defined in: [src/shared/services/audit.service.ts:118](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/audit.service.ts#L118)

Get entity history

#### Parameters

##### entity

`string`

##### entityId

`string`

#### Returns

`Promise`\<`object` & `object`[]\>

***

### getUserActivity()

> **getUserActivity**(`userId`, `days`): `Promise`\<\{ `logs`: `object`[]; `summary`: `Record`\<`string`, `number`\>; `total`: `number`; \}\>

Defined in: [src/shared/services/audit.service.ts:142](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/audit.service.ts#L142)

Get user activity

#### Parameters

##### userId

`string`

##### days

`number` = `30`

#### Returns

`Promise`\<\{ `logs`: `object`[]; `summary`: `Record`\<`string`, `number`\>; `total`: `number`; \}\>

***

### log()

> **log**(`entry`): `Promise`\<`void`\>

Defined in: [src/shared/services/audit.service.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/audit.service.ts#L22)

Create an audit log entry

#### Parameters

##### entry

[`AuditLogEntry`](../interfaces/AuditLogEntry.md)

#### Returns

`Promise`\<`void`\>

***

### query()

> **query**(`filters`, `options?`): `Promise`\<\{ `logs`: `object` & `object`[]; `pagination`: \{ `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}; \}\>

Defined in: [src/shared/services/audit.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/audit.service.ts#L51)

Query audit logs

#### Parameters

##### filters

###### action?

`string`

###### endDate?

`Date`

###### entity?

`string`

###### entityId?

`string`

###### startDate?

`Date`

###### userId?

`string`

##### options?

###### limit?

`number`

###### order?

`"asc"` \| `"desc"`

###### orderBy?

`"createdAt"` \| `"action"`

###### page?

`number`

#### Returns

`Promise`\<\{ `logs`: `object` & `object`[]; `pagination`: \{ `limit`: `number`; `page`: `number`; `pages`: `number`; `total`: `number`; \}; \}\>
