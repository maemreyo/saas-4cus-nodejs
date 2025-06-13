[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/auth/auth.service](../README.md) / AuthService

# Class: AuthService

Defined in: [src/modules/auth/auth.service.ts:71](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L71)

## Constructors

### Constructor

> **new AuthService**(`emailService`, `eventBus`): `AuthService`

Defined in: [src/modules/auth/auth.service.ts:74](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L74)

#### Parameters

##### emailService

[`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`AuthService`

## Methods

### confirm2FA()

> **confirm2FA**(`userId`, `code`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.service.ts:459](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L459)

#### Parameters

##### userId

`string`

##### code

`string`

#### Returns

`Promise`\<`void`\>

***

### disable2FA()

> **disable2FA**(`userId`, `password`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.service.ts:507](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L507)

#### Parameters

##### userId

`string`

##### password

`string`

#### Returns

`Promise`\<`void`\>

***

### enable2FA()

> **enable2FA**(`userId`): `Promise`\<\{ `backupCodes`: `string`[]; `qrCode`: `string`; `secret`: `string`; \}\>

Defined in: [src/modules/auth/auth.service.ts:416](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L416)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `backupCodes`: `string`[]; `qrCode`: `string`; `secret`: `string`; \}\>

***

### generateAuthTokens()

> `private` **generateAuthTokens**(`user`, `sessionId?`): `Promise`\<[`AuthTokens`](../interfaces/AuthTokens.md)\>

Defined in: [src/modules/auth/auth.service.ts:696](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L696)

#### Parameters

##### user

##### sessionId?

`string`

#### Returns

`Promise`\<[`AuthTokens`](../interfaces/AuthTokens.md)\>

***

### getGoogleAuthUrl()

> **getGoogleAuthUrl**(): `string`

Defined in: [src/modules/auth/auth.service.ts:890](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L890)

#### Returns

`string`

***

### getUserById()

> **getUserById**(`userId`): `Promise`\<\{ \}\>

Defined in: [src/modules/auth/auth.service.ts:878](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L878)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### handleGoogleCallback()

> **handleGoogleCallback**(`code`): `Promise`\<\{ `tokens`: [`AuthTokens`](../interfaces/AuthTokens.md); `user`: \{ \}; \}\>

Defined in: [src/modules/auth/auth.service.ts:902](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L902)

#### Parameters

##### code

`string`

#### Returns

`Promise`\<\{ `tokens`: [`AuthTokens`](../interfaces/AuthTokens.md); `user`: \{ \}; \}\>

***

### isValidEmail()

> `private` **isValidEmail**(`email`): `boolean`

Defined in: [src/modules/auth/auth.service.ts:831](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L831)

#### Parameters

##### email

`string`

#### Returns

`boolean`

***

### logFailedLoginAttempt()

> `private` **logFailedLoginAttempt**(`userId`, `email`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.service.ts:784](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L784)

#### Parameters

##### userId

`string`

##### email

`string`

#### Returns

`Promise`\<`void`\>

***

### login()

> **login**(`dto`): `Promise`\<\{ `requiresTwoFactor?`: `boolean`; `tokens`: [`AuthTokens`](../interfaces/AuthTokens.md); `user`: \{ \}; \}\>

Defined in: [src/modules/auth/auth.service.ts:154](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L154)

#### Parameters

##### dto

[`LoginDTO`](../interfaces/LoginDTO.md)

#### Returns

`Promise`\<\{ `requiresTwoFactor?`: `boolean`; `tokens`: [`AuthTokens`](../interfaces/AuthTokens.md); `user`: \{ \}; \}\>

***

### logout()

> **logout**(`userId`, `sessionId?`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.service.ts:388](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L388)

#### Parameters

##### userId

`string`

##### sessionId?

`string`

#### Returns

`Promise`\<`void`\>

***

### oauthLogin()

> **oauthLogin**(`profile`): `Promise`\<\{ `tokens`: [`AuthTokens`](../interfaces/AuthTokens.md); `user`: \{ \}; \}\>

Defined in: [src/modules/auth/auth.service.ts:222](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L222)

#### Parameters

##### profile

[`OAuthProfile`](../interfaces/OAuthProfile.md)

#### Returns

`Promise`\<\{ `tokens`: [`AuthTokens`](../interfaces/AuthTokens.md); `user`: \{ \}; \}\>

***

### refreshTokens()

> **refreshTokens**(`refreshToken`): `Promise`\<[`AuthTokens`](../interfaces/AuthTokens.md)\>

Defined in: [src/modules/auth/auth.service.ts:332](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L332)

#### Parameters

##### refreshToken

`string`

#### Returns

`Promise`\<[`AuthTokens`](../interfaces/AuthTokens.md)\>

***

### register()

> **register**(`dto`): `Promise`\<\{ `tokens`: [`AuthTokens`](../interfaces/AuthTokens.md); `user`: \{ \}; \}\>

Defined in: [src/modules/auth/auth.service.ts:86](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L86)

#### Parameters

##### dto

[`RegisterDTO`](../interfaces/RegisterDTO.md)

#### Returns

`Promise`\<\{ `tokens`: [`AuthTokens`](../interfaces/AuthTokens.md); `user`: \{ \}; \}\>

***

### requestPasswordReset()

> **requestPasswordReset**(`email`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.service.ts:548](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L548)

#### Parameters

##### email

`string`

#### Returns

`Promise`\<`void`\>

***

### resetPassword()

> **resetPassword**(`token`, `newPassword`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.service.ts:583](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L583)

#### Parameters

##### token

`string`

##### newPassword

`string`

#### Returns

`Promise`\<`void`\>

***

### sendVerificationEmail()

> `private` **sendVerificationEmail**(`user`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.service.ts:768](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L768)

#### Parameters

##### user

#### Returns

`Promise`\<`void`\>

***

### validatePasswordStrength()

> `private` **validatePasswordStrength**(`password`): `void`

Defined in: [src/modules/auth/auth.service.ts:809](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L809)

#### Parameters

##### password

`string`

#### Returns

`void`

***

### verify2FACode()

> `private` **verify2FACode**(`secret`, `code`): `boolean`

Defined in: [src/modules/auth/auth.service.ts:761](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L761)

#### Parameters

##### secret

`string`

##### code

`string`

#### Returns

`boolean`

***

### verifyAccessToken()

> **verifyAccessToken**(`token`): `Promise`\<[`JwtPayload`](../interfaces/JwtPayload.md)\>

Defined in: [src/modules/auth/auth.service.ts:637](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L637)

#### Parameters

##### token

`string`

#### Returns

`Promise`\<[`JwtPayload`](../interfaces/JwtPayload.md)\>

***

### verifyEmail()

> **verifyEmail**(`token`): `Promise`\<`void`\>

Defined in: [src/modules/auth/auth.service.ts:837](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L837)

#### Parameters

##### token

`string`

#### Returns

`Promise`\<`void`\>

***

### verifyGoogleToken()

> **verifyGoogleToken**(`idToken`): `Promise`\<[`OAuthProfile`](../interfaces/OAuthProfile.md)\>

Defined in: [src/modules/auth/auth.service.ts:304](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L304)

#### Parameters

##### idToken

`string`

#### Returns

`Promise`\<[`OAuthProfile`](../interfaces/OAuthProfile.md)\>

## Properties

### emailService

> `private` **emailService**: [`EmailService`](../../../../shared/services/email.service/classes/EmailService.md)

Defined in: [src/modules/auth/auth.service.ts:75](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L75)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/auth/auth.service.ts:76](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L76)

***

### googleClient

> `private` **googleClient**: `OAuth2Client`

Defined in: [src/modules/auth/auth.service.ts:72](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/auth/auth.service.ts#L72)
