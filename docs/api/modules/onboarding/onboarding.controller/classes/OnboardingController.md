[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/onboarding/onboarding.controller](../README.md) / OnboardingController

# Class: OnboardingController

Defined in: [src/modules/onboarding/onboarding.controller.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L12)

## Constructors

### Constructor

> **new OnboardingController**(`onboardingService`): `OnboardingController`

Defined in: [src/modules/onboarding/onboarding.controller.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L13)

#### Parameters

##### onboardingService

[`OnboardingService`](../../onboarding.service/classes/OnboardingService.md)

#### Returns

`OnboardingController`

## Methods

### completeStep()

> **completeStep**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.controller.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L50)

Complete onboarding step

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`CompleteStepDTO`](../../onboarding.dto/classes/CompleteStepDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getAnalytics()

> **getAnalytics**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.controller.ts:116](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L116)

Get onboarding analytics (admin)

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `dateRange?`: `number`; `flowId?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getChecklist()

> **getChecklist**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.controller.ts:91](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L91)

Get onboarding checklist

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getHints()

> **getHints**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.controller.ts:101](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L101)

Get onboarding hints for page

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: [`GetHintsDTO`](../../onboarding.dto/classes/GetHintsDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getProgress()

> **getProgress**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.controller.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L40)

Get onboarding progress

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### skipOnboarding()

> **skipOnboarding**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.controller.ts:80](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L80)

Skip entire onboarding

#### Parameters

##### request

`FastifyRequest`

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### skipStep()

> **skipStep**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.controller.ts:65](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L65)

Skip onboarding step

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `stepId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### startOnboarding()

> **startOnboarding**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/onboarding/onboarding.controller.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L18)

Start onboarding flow

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: [`StartOnboardingDTO`](../../onboarding.dto/classes/StartOnboardingDTO.md); \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### onboardingService

> `private` **onboardingService**: [`OnboardingService`](../../onboarding.service/classes/OnboardingService.md)

Defined in: [src/modules/onboarding/onboarding.controller.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/onboarding/onboarding.controller.ts#L13)
