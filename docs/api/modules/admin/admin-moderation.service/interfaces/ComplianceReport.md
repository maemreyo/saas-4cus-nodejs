[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin-moderation.service](../README.md) / ComplianceReport

# Interface: ComplianceReport

Defined in: [src/modules/admin/admin-moderation.service.ts:38](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L38)

## Properties

### byAction

> **byAction**: `Record`\<`string`, `number`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L50)

***

### byType

> **byType**: `Record`\<`string`, `number`\>

Defined in: [src/modules/admin/admin-moderation.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L49)

***

### compliance

> **compliance**: `object`

Defined in: [src/modules/admin/admin-moderation.service.ts:52](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L52)

#### ccpa

> **ccpa**: `boolean`

#### coppa

> **coppa**: `boolean`

#### gdpr

> **gdpr**: `boolean`

***

### period

> **period**: `object`

Defined in: [src/modules/admin/admin-moderation.service.ts:39](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L39)

#### end

> **end**: `Date`

#### start

> **start**: `Date`

***

### summary

> **summary**: `object`

Defined in: [src/modules/admin/admin-moderation.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L43)

#### averageResolutionTime

> **averageResolutionTime**: `number`

#### pending

> **pending**: `number`

#### resolved

> **resolved**: `number`

#### totalReports

> **totalReports**: `number`

***

### topReporters

> **topReporters**: `object`[]

Defined in: [src/modules/admin/admin-moderation.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin-moderation.service.ts#L51)

#### count

> **count**: `number`

#### userId

> **userId**: `string`
