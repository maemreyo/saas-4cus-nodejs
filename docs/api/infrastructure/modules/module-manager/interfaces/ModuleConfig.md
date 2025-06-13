[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/modules/module-manager](../README.md) / ModuleConfig

# Interface: ModuleConfig

Defined in: [src/infrastructure/modules/module-manager.ts:18](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/modules/module-manager.ts#L18)

## Properties

### dependencies?

> `optional` **dependencies**: `string`[]

Defined in: [src/infrastructure/modules/module-manager.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/modules/module-manager.ts#L22)

***

### enabled

> **enabled**: `boolean`

Defined in: [src/infrastructure/modules/module-manager.ts:20](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/modules/module-manager.ts#L20)

***

### healthCheck()?

> `optional` **healthCheck**: () => `Promise`\<\{ `details?`: `any`; `healthy`: `boolean`; \}\>

Defined in: [src/infrastructure/modules/module-manager.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/modules/module-manager.ts#L25)

#### Returns

`Promise`\<\{ `details?`: `any`; `healthy`: `boolean`; \}\>

***

### initialize()

> **initialize**: () => `Promise`\<`void`\>

Defined in: [src/infrastructure/modules/module-manager.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/modules/module-manager.ts#L23)

#### Returns

`Promise`\<`void`\>

***

### name

> **name**: `string`

Defined in: [src/infrastructure/modules/module-manager.ts:19](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/modules/module-manager.ts#L19)

***

### priority

> **priority**: `number`

Defined in: [src/infrastructure/modules/module-manager.ts:21](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/modules/module-manager.ts#L21)

***

### shutdown()

> **shutdown**: () => `Promise`\<`void`\>

Defined in: [src/infrastructure/modules/module-manager.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/1a77de11cd6eaefe66c31c7f5de281673fc25ce5/src/infrastructure/modules/module-manager.ts#L24)

#### Returns

`Promise`\<`void`\>
