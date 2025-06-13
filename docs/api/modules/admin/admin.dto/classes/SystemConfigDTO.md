[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/admin.dto](../README.md) / SystemConfigDTO

# Class: SystemConfigDTO

Defined in: [src/modules/admin/admin.dto.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L45)

## Constructors

### Constructor

> **new SystemConfigDTO**(): `SystemConfigDTO`

#### Returns

`SystemConfigDTO`

## Properties

### features?

> `optional` **features**: `object`

Defined in: [src/modules/admin/admin.dto.ts:77](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L77)

#### emailVerification?

> `optional` **emailVerification**: `boolean`

#### oauth?

> `optional` **oauth**: `boolean`

#### registration?

> `optional` **registration**: `boolean`

#### twoFactorAuth?

> `optional` **twoFactorAuth**: `boolean`

***

### limits?

> `optional` **limits**: `object`

Defined in: [src/modules/admin/admin.dto.ts:83](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L83)

#### apiRateLimit?

> `optional` **apiRateLimit**: `number`

#### maxFileSize?

> `optional` **maxFileSize**: `number`

#### maxProjectsPerUser?

> `optional` **maxProjectsPerUser**: `number`

#### maxUsersPerTenant?

> `optional` **maxUsersPerTenant**: `number`

***

### maintenance?

> `optional` **maintenance**: `object`

Defined in: [src/modules/admin/admin.dto.ts:72](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L72)

#### allowedIps?

> `optional` **allowedIps**: `string`[]

#### enabled

> **enabled**: `boolean`

#### message?

> `optional` **message**: `string`

***

### schema

> `static` **schema**: `ZodObject`\<\{ `features`: `ZodOptional`\<`ZodObject`\<\{ `emailVerification`: `ZodOptional`\<`ZodBoolean`\>; `oauth`: `ZodOptional`\<`ZodBoolean`\>; `registration`: `ZodOptional`\<`ZodBoolean`\>; `twoFactorAuth`: `ZodOptional`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `emailVerification?`: `boolean`; `oauth?`: `boolean`; `registration?`: `boolean`; `twoFactorAuth?`: `boolean`; \}, \{ `emailVerification?`: `boolean`; `oauth?`: `boolean`; `registration?`: `boolean`; `twoFactorAuth?`: `boolean`; \}\>\>; `limits`: `ZodOptional`\<`ZodObject`\<\{ `apiRateLimit`: `ZodOptional`\<`ZodNumber`\>; `maxFileSize`: `ZodOptional`\<`ZodNumber`\>; `maxProjectsPerUser`: `ZodOptional`\<`ZodNumber`\>; `maxUsersPerTenant`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `apiRateLimit?`: `number`; `maxFileSize?`: `number`; `maxProjectsPerUser?`: `number`; `maxUsersPerTenant?`: `number`; \}, \{ `apiRateLimit?`: `number`; `maxFileSize?`: `number`; `maxProjectsPerUser?`: `number`; `maxUsersPerTenant?`: `number`; \}\>\>; `maintenance`: `ZodOptional`\<`ZodObject`\<\{ `allowedIps`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `enabled`: `ZodBoolean`; `message`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `allowedIps?`: `string`[]; `enabled?`: `boolean`; `message?`: `string`; \}, \{ `allowedIps?`: `string`[]; `enabled?`: `boolean`; `message?`: `string`; \}\>\>; `security`: `ZodOptional`\<`ZodObject`\<\{ `lockoutDuration`: `ZodOptional`\<`ZodNumber`\>; `maxLoginAttempts`: `ZodOptional`\<`ZodNumber`\>; `passwordMinLength`: `ZodOptional`\<`ZodNumber`\>; `sessionTimeout`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `lockoutDuration?`: `number`; `maxLoginAttempts?`: `number`; `passwordMinLength?`: `number`; `sessionTimeout?`: `number`; \}, \{ `lockoutDuration?`: `number`; `maxLoginAttempts?`: `number`; `passwordMinLength?`: `number`; `sessionTimeout?`: `number`; \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `features?`: \{ `emailVerification?`: `boolean`; `oauth?`: `boolean`; `registration?`: `boolean`; `twoFactorAuth?`: `boolean`; \}; `limits?`: \{ `apiRateLimit?`: `number`; `maxFileSize?`: `number`; `maxProjectsPerUser?`: `number`; `maxUsersPerTenant?`: `number`; \}; `maintenance?`: \{ `allowedIps?`: `string`[]; `enabled?`: `boolean`; `message?`: `string`; \}; `security?`: \{ `lockoutDuration?`: `number`; `maxLoginAttempts?`: `number`; `passwordMinLength?`: `number`; `sessionTimeout?`: `number`; \}; \}, \{ `features?`: \{ `emailVerification?`: `boolean`; `oauth?`: `boolean`; `registration?`: `boolean`; `twoFactorAuth?`: `boolean`; \}; `limits?`: \{ `apiRateLimit?`: `number`; `maxFileSize?`: `number`; `maxProjectsPerUser?`: `number`; `maxUsersPerTenant?`: `number`; \}; `maintenance?`: \{ `allowedIps?`: `string`[]; `enabled?`: `boolean`; `message?`: `string`; \}; `security?`: \{ `lockoutDuration?`: `number`; `maxLoginAttempts?`: `number`; `passwordMinLength?`: `number`; `sessionTimeout?`: `number`; \}; \}\>

Defined in: [src/modules/admin/admin.dto.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L46)

***

### security?

> `optional` **security**: `object`

Defined in: [src/modules/admin/admin.dto.ts:89](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/admin.dto.ts#L89)

#### lockoutDuration?

> `optional` **lockoutDuration**: `number`

#### maxLoginAttempts?

> `optional` **maxLoginAttempts**: `number`

#### passwordMinLength?

> `optional` **passwordMinLength**: `number`

#### sessionTimeout?

> `optional` **sessionTimeout**: `number`
