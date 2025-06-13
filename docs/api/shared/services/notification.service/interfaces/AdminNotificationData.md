[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [shared/services/notification.service](../README.md) / AdminNotificationData

# Interface: AdminNotificationData

Defined in: [src/shared/services/notification.service.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L23)

## Extends

- `Omit`\<[`NotificationData`](NotificationData.md), `"userId"`\>

## Properties

### channel?

> `optional` **channel**: `"push"` \| `"email"` \| `"all"` \| `"in-app"`

Defined in: [src/shared/services/notification.service.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L18)

#### Inherited from

`Omit.channel`

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [src/shared/services/notification.service.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L17)

#### Inherited from

`Omit.data`

***

### message

> **message**: `string`

Defined in: [src/shared/services/notification.service.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L16)

#### Inherited from

`Omit.message`

***

### priority?

> `optional` **priority**: `"urgent"` \| `"high"` \| `"medium"` \| `"low"`

Defined in: [src/shared/services/notification.service.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L19)

#### Inherited from

`Omit.priority`

***

### roles?

> `optional` **roles**: `UserRole`[]

Defined in: [src/shared/services/notification.service.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L24)

***

### severity?

> `optional` **severity**: `"error"` \| `"info"` \| `"warning"`

Defined in: [src/shared/services/notification.service.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L20)

#### Inherited from

`Omit.severity`

***

### title

> **title**: `string`

Defined in: [src/shared/services/notification.service.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L15)

#### Inherited from

`Omit.title`

***

### type

> **type**: `string`

Defined in: [src/shared/services/notification.service.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/services/notification.service.ts#L14)

#### Inherited from

`Omit.type`
