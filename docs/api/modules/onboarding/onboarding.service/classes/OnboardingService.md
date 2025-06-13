[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/onboarding/onboarding.service](../README.md) / OnboardingService

# Class: OnboardingService

Defined in: [src/modules/onboarding/onboarding.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L46)

## Constructors

### Constructor

> **new OnboardingService**(`eventBus`, `analyticsService`): `OnboardingService`

Defined in: [src/modules/onboarding/onboarding.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L49)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

##### analyticsService

[`AnalyticsService`](../../../analytics/analytics.service/classes/AnalyticsService.md)

#### Returns

`OnboardingService`

## Methods

### calculateProgress()

> `private` **calculateProgress**(`flowId`): `Promise`\<\{ \}\>

Defined in: [src/modules/onboarding/onboarding.service.ts:622](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L622)

Calculate onboarding progress

#### Parameters

##### flowId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### checkRequiredStepsCompleted()

> `private` **checkRequiredStepsCompleted**(`flowId`): `Promise`\<`boolean`\>

Defined in: [src/modules/onboarding/onboarding.service.ts:607](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L607)

Check if all required steps are completed

#### Parameters

##### flowId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### completeOnboarding()

> `private` **completeOnboarding**(`userId`, `flowId`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.service.ts:571](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L571)

Complete onboarding flow

#### Parameters

##### userId

`string`

##### flowId

`string`

#### Returns

`Promise`\<`void`\>

***

### completeStep()

> **completeStep**(`userId`, `stepId`, `data?`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.service.ts:299](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L299)

Complete onboarding step

#### Parameters

##### userId

`string`

##### stepId

`string`

##### data?

`any`

#### Returns

`Promise`\<`void`\>

***

### getChecklist()

> **getChecklist**(`userId`): `Promise`\<\{ `items`: `object`[]; `progress`: `number`; \}\>

Defined in: [src/modules/onboarding/onboarding.service.ts:484](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L484)

Get onboarding checklist

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `items`: `object`[]; `progress`: `number`; \}\>

***

### getHints()

> **getHints**(`userId`, `page`): `Promise`\<`object`[]\>

Defined in: [src/modules/onboarding/onboarding.service.ts:522](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L522)

Get onboarding hints/tooltips

#### Parameters

##### userId

`string`

##### page

`string`

#### Returns

`Promise`\<`object`[]\>

***

### getOnboardingAnalytics()

> **getOnboardingAnalytics**(`options`): `Promise`\<\{ `dropoffFunnel`: `object`[]; `overview`: \{ `averageCompletion`: `number`; `averageDuration`: `number`; `totalCompleted`: `number`; `totalSkipped`: `number`; `totalStarted`: `number`; \}; `stepAnalytics`: `object`[]; \}\>

Defined in: [src/modules/onboarding/onboarding.service.ts:656](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L656)

Get onboarding analytics

#### Parameters

##### options

###### dateRange?

`number`

###### flowId?

`string`

#### Returns

`Promise`\<\{ `dropoffFunnel`: `object`[]; `overview`: \{ `averageCompletion`: `number`; `averageDuration`: `number`; `totalCompleted`: `number`; `totalSkipped`: `number`; `totalStarted`: `number`; \}; `stepAnalytics`: `object`[]; \}\>

***

### getProgress()

> **getProgress**(`userId`): `Promise`\<\{ `flow`: \{ \}; `progress`: \{ \}; `steps`: `object`[]; \}\>

Defined in: [src/modules/onboarding/onboarding.service.ts:265](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L265)

Get user's onboarding progress

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `flow`: \{ \}; `progress`: \{ \}; `steps`: `object`[]; \}\>

***

### initializeFlowTemplates()

> `private` **initializeFlowTemplates**(): `void`

Defined in: [src/modules/onboarding/onboarding.service.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L59)

Initialize onboarding flow templates

#### Returns

`void`

***

### skipOnboarding()

> **skipOnboarding**(`userId`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.service.ts:443](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L443)

Skip entire onboarding

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### skipStep()

> **skipStep**(`userId`, `stepId`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.service.ts:394](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L394)

Skip onboarding step

#### Parameters

##### userId

`string`

##### stepId

`string`

#### Returns

`Promise`\<`void`\>

***

### startOnboarding()

> **startOnboarding**(`userId`, `flowId`, `context?`): `Promise`\<\{ \}\>

Defined in: [src/modules/onboarding/onboarding.service.ts:189](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L189)

Start onboarding for user

#### Parameters

##### userId

`string`

##### flowId

`string`

##### context?

[`OnboardingContext`](../interfaces/OnboardingContext.md)

#### Returns

`Promise`\<\{ \}\>

## Properties

### analyticsService

> `private` **analyticsService**: [`AnalyticsService`](../../../analytics/analytics.service/classes/AnalyticsService.md)

Defined in: [src/modules/onboarding/onboarding.service.ts:51](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L51)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/onboarding/onboarding.service.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L50)

***

### flowTemplates

> `private` **flowTemplates**: `Map`\<`string`, [`OnboardingFlowTemplate`](../interfaces/OnboardingFlowTemplate.md)\>

Defined in: [src/modules/onboarding/onboarding.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.service.ts#L47)
