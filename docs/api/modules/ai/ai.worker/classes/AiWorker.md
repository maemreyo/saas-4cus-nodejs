[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/ai/ai.worker](../README.md) / AiWorker

# Class: AiWorker

Defined in: [src/modules/ai/ai.worker.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L11)

## Constructors

### Constructor

> **new AiWorker**(`cacheService`, `notificationService`): `AiWorker`

Defined in: [src/modules/ai/ai.worker.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L14)

#### Parameters

##### cacheService

[`AiCacheService`](../../ai.cache/classes/AiCacheService.md)

##### notificationService

[`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

#### Returns

`AiWorker`

## Methods

### checkUsageLimits()

> `private` **checkUsageLimits**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:148](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L148)

#### Returns

`Promise`\<`void`\>

***

### cleanupExpiredApiKeys()

> `private` **cleanupExpiredApiKeys**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:98](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L98)

#### Returns

`Promise`\<`void`\>

***

### cleanupOldCache()

> `private` **cleanupOldCache**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:292](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L292)

#### Returns

`Promise`\<`void`\>

***

### generateDailyUsageReports()

> `private` **generateDailyUsageReports**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:226](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L226)

#### Returns

`Promise`\<`void`\>

***

### handleApiKeyExpired()

> `private` **handleApiKeyExpired**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:411](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L411)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleCostThresholdExceeded()

> `private` **handleCostThresholdExceeded**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:391](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L391)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleUsageLimitExceeded()

> `private` **handleUsageLimitExceeded**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:370](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L370)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### handleUsageLimitWarning()

> `private` **handleUsageLimitWarning**(`payload`): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:350](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L350)

#### Parameters

##### payload

`any`

#### Returns

`Promise`\<`void`\>

***

### registerEventListeners()

> `private` **registerEventListeners**(): `void`

Defined in: [src/modules/ai/ai.worker.ts:76](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L76)

#### Returns

`void`

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L19)

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:66](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L66)

#### Returns

`Promise`\<`void`\>

***

### warmUpCache()

> `private` **warmUpCache**(): `Promise`\<`void`\>

Defined in: [src/modules/ai/ai.worker.ts:310](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L310)

#### Returns

`Promise`\<`void`\>

## Properties

### cacheService

> `private` **cacheService**: [`AiCacheService`](../../ai.cache/classes/AiCacheService.md)

Defined in: [src/modules/ai/ai.worker.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L15)

***

### jobs

> `private` **jobs**: `CronJob`\<`null`, `null`\>[] = `[]`

Defined in: [src/modules/ai/ai.worker.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L12)

***

### notificationService

> `private` **notificationService**: [`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

Defined in: [src/modules/ai/ai.worker.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/ai/ai.worker.ts#L16)
