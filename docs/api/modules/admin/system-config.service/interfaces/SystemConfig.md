[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/system-config.service](../README.md) / SystemConfig

# Interface: SystemConfig

Defined in: [src/modules/admin/system-config.service.ts:9](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L9)

## Properties

### billing

> **billing**: `object`

Defined in: [src/modules/admin/system-config.service.ts:62](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L62)

#### allowDiscounts

> **allowDiscounts**: `boolean`

#### autoChargeFailedPayments

> **autoChargeFailedPayments**: `boolean`

#### currency

> **currency**: `string`

#### enabled

> **enabled**: `boolean`

#### gracePeriodDays

> **gracePeriodDays**: `number`

#### provider

> **provider**: `"stripe"` \| `"paddle"`

#### sendInvoiceEmails

> **sendInvoiceEmails**: `boolean`

#### taxRate

> **taxRate**: `number`

#### trialDays

> **trialDays**: `number`

***

### email

> **email**: `object`

Defined in: [src/modules/admin/system-config.service.ts:49](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L49)

#### dailyLimit

> **dailyLimit**: `number`

#### fromEmail

> **fromEmail**: `string`

#### fromName

> **fromName**: `string`

#### provider

> **provider**: `"smtp"` \| `"sendgrid"` \| `"ses"`

#### replyToEmail?

> `optional` **replyToEmail**: `string`

#### templates

> **templates**: `object`

##### templates.emailVerification

> **emailVerification**: `boolean`

##### templates.invoiceNotification

> **invoiceNotification**: `boolean`

##### templates.passwordReset

> **passwordReset**: `boolean`

##### templates.welcome

> **welcome**: `boolean`

***

### features

> **features**: `object`

Defined in: [src/modules/admin/system-config.service.ts:17](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L17)

#### apiAccess

> **apiAccess**: `boolean`

#### emailVerification

> **emailVerification**: `boolean`

#### fileUpload

> **fileUpload**: `boolean`

#### oauth

> **oauth**: `boolean`

#### publicProfiles

> **publicProfiles**: `boolean`

#### registration

> **registration**: `boolean`

#### twoFactorAuth

> **twoFactorAuth**: `boolean`

***

### integrations

> **integrations**: `object`

Defined in: [src/modules/admin/system-config.service.ts:73](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L73)

#### analytics

> **analytics**: `object`

##### analytics.amplitude?

> `optional` **amplitude**: `string`

##### analytics.googleAnalytics?

> `optional` **googleAnalytics**: `string`

##### analytics.mixpanel?

> `optional` **mixpanel**: `string`

##### analytics.segment?

> `optional` **segment**: `string`

#### monitoring

> **monitoring**: `object`

##### monitoring.customWebhook?

> `optional` **customWebhook**: `string`

##### monitoring.datadog

> **datadog**: `boolean`

##### monitoring.newRelic

> **newRelic**: `boolean`

##### monitoring.sentry

> **sentry**: `boolean`

#### slack

> **slack**: `object`

##### slack.channels

> **channels**: `object`

##### slack.channels.alerts

> **alerts**: `string`

##### slack.channels.billing

> **billing**: `string`

##### slack.channels.support

> **support**: `string`

##### slack.enabled

> **enabled**: `boolean`

##### slack.webhookUrl?

> `optional` **webhookUrl**: `string`

***

### limits

> **limits**: `object`

Defined in: [src/modules/admin/system-config.service.ts:26](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L26)

#### apiRateLimit

> **apiRateLimit**: `number`

#### maxConcurrentSessions

> **maxConcurrentSessions**: `number`

#### maxFileSize

> **maxFileSize**: `number`

#### maxProjectsPerUser

> **maxProjectsPerUser**: `number`

#### maxStoragePerUser

> **maxStoragePerUser**: `number`

#### maxTeamSize

> **maxTeamSize**: `number`

#### maxUsersPerTenant

> **maxUsersPerTenant**: `number`

***

### maintenance

> **maintenance**: `object`

Defined in: [src/modules/admin/system-config.service.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L10)

#### allowedIps?

> `optional` **allowedIps**: `string`[]

#### enabled

> **enabled**: `boolean`

#### estimatedDuration?

> `optional` **estimatedDuration**: `number`

#### message?

> `optional` **message**: `string`

#### scheduledFor?

> `optional` **scheduledFor**: `Date`

***

### security

> **security**: `object`

Defined in: [src/modules/admin/system-config.service.ts:35](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L35)

#### allowedIps?

> `optional` **allowedIps**: `string`[]

#### enforceIpWhitelist

> **enforceIpWhitelist**: `boolean`

#### lockoutDuration

> **lockoutDuration**: `number`

#### maxLoginAttempts

> **maxLoginAttempts**: `number`

#### passwordMinLength

> **passwordMinLength**: `number`

#### passwordRequireLowercase

> **passwordRequireLowercase**: `boolean`

#### passwordRequireNumbers

> **passwordRequireNumbers**: `boolean`

#### passwordRequireSpecial

> **passwordRequireSpecial**: `boolean`

#### passwordRequireUppercase

> **passwordRequireUppercase**: `boolean`

#### require2FAForAdmins

> **require2FAForAdmins**: `boolean`

#### requireEmailVerification

> **requireEmailVerification**: `boolean`

#### sessionTimeout

> **sessionTimeout**: `number`

***

### ui

> **ui**: `object`

Defined in: [src/modules/admin/system-config.service.ts:96](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L96)

#### customCss?

> `optional` **customCss**: `string`

#### customFooterText?

> `optional` **customFooterText**: `string`

#### favicon?

> `optional` **favicon**: `string`

#### logo?

> `optional` **logo**: `string`

#### primaryColor

> **primaryColor**: `string`

#### showPoweredBy

> **showPoweredBy**: `boolean`

#### theme

> **theme**: `"light"` \| `"dark"` \| `"auto"`
