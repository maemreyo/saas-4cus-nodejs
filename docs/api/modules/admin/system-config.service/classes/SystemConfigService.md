[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/admin/system-config.service](../README.md) / SystemConfigService

# Class: SystemConfigService

Defined in: [src/modules/admin/system-config.service.ts:108](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L108)

## Constructors

### Constructor

> **new SystemConfigService**(`eventBus`): `SystemConfigService`

Defined in: [src/modules/admin/system-config.service.ts:112](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L112)

#### Parameters

##### eventBus

[`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

#### Returns

`SystemConfigService`

## Methods

### applyConfigChanges()

> `private` **applyConfigChanges**(`oldConfig`, `newConfig`): `Promise`\<`void`\>

Defined in: [src/modules/admin/system-config.service.ts:590](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L590)

#### Parameters

##### oldConfig

[`SystemConfig`](../interfaces/SystemConfig.md)

##### newConfig

[`SystemConfig`](../interfaces/SystemConfig.md)

#### Returns

`Promise`\<`void`\>

***

### deepMerge()

> `private` **deepMerge**(`target`, `source`): `any`

Defined in: [src/modules/admin/system-config.service.ts:528](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L528)

#### Parameters

##### target

`any`

##### source

`any`

#### Returns

`any`

***

### ensureCompleteNestedObjects()

> `private` **ensureCompleteNestedObjects**(`updates`, `currentConfig`): `Partial`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

Defined in: [src/modules/admin/system-config.service.ts:197](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L197)

Ensures that partial nested objects are properly merged with current config
to avoid TypeScript errors with required properties

#### Parameters

##### updates

`Partial`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

##### currentConfig

[`SystemConfig`](../interfaces/SystemConfig.md)

#### Returns

`Partial`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

***

### exportConfig()

> **exportConfig**(): `Promise`\<\{ `config`: [`SystemConfig`](../interfaces/SystemConfig.md); `exportedAt`: `Date`; `version`: `string`; \}\>

Defined in: [src/modules/admin/system-config.service.ts:402](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L402)

Export configuration

#### Returns

`Promise`\<\{ `config`: [`SystemConfig`](../interfaces/SystemConfig.md); `exportedAt`: `Date`; `version`: `string`; \}\>

***

### flattenConfig()

> `private` **flattenConfig**(`config`, `prefix`): `Record`\<`string`, `any`\>

Defined in: [src/modules/admin/system-config.service.ts:542](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L542)

#### Parameters

##### config

`any`

##### prefix

`string` = `''`

#### Returns

`Record`\<`string`, `any`\>

***

### getConfig()

> **getConfig**(): `Promise`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

Defined in: [src/modules/admin/system-config.service.ts:118](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L118)

Get system configuration

#### Returns

`Promise`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

***

### getConfigDescription()

> `private` **getConfigDescription**(`key`): `string`

Defined in: [src/modules/admin/system-config.service.ts:577](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L577)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### getConfigValue()

> **getConfigValue**(`path`): `Promise`\<`any`\>

Defined in: [src/modules/admin/system-config.service.ts:271](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L271)

Get specific configuration value

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`any`\>

***

### getDefaultConfig()

> `private` **getDefaultConfig**(): [`SystemConfig`](../interfaces/SystemConfig.md)

Defined in: [src/modules/admin/system-config.service.ts:440](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L440)

#### Returns

[`SystemConfig`](../interfaces/SystemConfig.md)

***

### getRateLimit()

> **getRateLimit**(`resource`): `Promise`\<`number`\>

Defined in: [src/modules/admin/system-config.service.ts:386](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L386)

Get rate limit for a specific resource

#### Parameters

##### resource

`string` = `'api'`

#### Returns

`Promise`\<`number`\>

***

### importConfig()

> **importConfig**(`configData`, `options?`): `Promise`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

Defined in: [src/modules/admin/system-config.service.ts:419](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L419)

Import configuration

#### Parameters

##### configData

`Partial`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

##### options?

###### merge?

`boolean`

###### validate?

`boolean`

#### Returns

`Promise`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

***

### isFeatureEnabled()

> **isFeatureEnabled**(`feature`): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/system-config.service.ts:370](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L370)

Get feature availability

#### Parameters

##### feature

`"oauth"` | `"registration"` | `"twoFactorAuth"` | `"emailVerification"` | `"fileUpload"` | `"apiAccess"` | `"publicProfiles"`

#### Returns

`Promise`\<`boolean`\>

***

### isInMaintenanceMode()

> **isInMaintenanceMode**(`ipAddress?`): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/system-config.service.ts:344](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L344)

Check if system is in maintenance mode

#### Parameters

##### ipAddress?

`string`

#### Returns

`Promise`\<`boolean`\>

***

### ~~isTwoFactorEnabled()~~

> **isTwoFactorEnabled**(): `Promise`\<`boolean`\>

Defined in: [src/modules/admin/system-config.service.ts:379](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L379)

Legacy method for backward compatibility

#### Returns

`Promise`\<`boolean`\>

#### Deprecated

Use isFeatureEnabled with 'twoFactorAuth' instead

***

### mergeWithDefaults()

> `private` **mergeWithDefaults**(`config`): [`SystemConfig`](../interfaces/SystemConfig.md)

Defined in: [src/modules/admin/system-config.service.ts:524](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L524)

#### Parameters

##### config

`any`

#### Returns

[`SystemConfig`](../interfaces/SystemConfig.md)

***

### toggleMaintenanceMode()

> **toggleMaintenanceMode**(`enabled`, `options?`): `Promise`\<`void`\>

Defined in: [src/modules/admin/system-config.service.ts:287](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L287)

Toggle maintenance mode

#### Parameters

##### enabled

`boolean`

##### options?

###### allowedIps?

`string`[]

###### estimatedDuration?

`number`

###### message?

`string`

###### scheduledFor?

`Date`

#### Returns

`Promise`\<`void`\>

***

### updateConfig()

> **updateConfig**(`updates`): `Promise`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

Defined in: [src/modules/admin/system-config.service.ts:151](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L151)

Update system configuration

#### Parameters

##### updates

`Partial`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

#### Returns

`Promise`\<[`SystemConfig`](../interfaces/SystemConfig.md)\>

***

### updateFeatureFlags()

> **updateFeatureFlags**(`features`): `Promise`\<`void`\>

Defined in: [src/modules/admin/system-config.service.ts:323](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L323)

Update feature flags

#### Parameters

##### features

`Partial`\<[`SystemConfig`](../interfaces/SystemConfig.md)\[`"features"`\]\>

#### Returns

`Promise`\<`void`\>

***

### updateSecuritySettings()

> **updateSecuritySettings**(`security`): `Promise`\<`void`\>

Defined in: [src/modules/admin/system-config.service.ts:332](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L332)

Update security settings

#### Parameters

##### security

`Partial`\<[`SystemConfig`](../interfaces/SystemConfig.md)\[`"security"`\]\>

#### Returns

`Promise`\<`void`\>

***

### validateConfig()

> `private` **validateConfig**(`config`): `void`

Defined in: [src/modules/admin/system-config.service.ts:558](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L558)

#### Parameters

##### config

[`SystemConfig`](../interfaces/SystemConfig.md)

#### Returns

`void`

## Properties

### CONFIG\_CACHE\_TTL

> `private` `readonly` **CONFIG\_CACHE\_TTL**: `3600` = `3600`

Defined in: [src/modules/admin/system-config.service.ts:110](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L110)

***

### CONFIG\_KEY

> `private` `readonly` **CONFIG\_KEY**: `"system:config"` = `'system:config'`

Defined in: [src/modules/admin/system-config.service.ts:109](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L109)

***

### eventBus

> `private` **eventBus**: [`EventBus`](../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/admin/system-config.service.ts:112](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/admin/system-config.service.ts#L112)
