[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/monitoring/health-aggregator](../README.md) / HealthCheckResult

# Interface: HealthCheckResult

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:10](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L10)

## Properties

### checks

> **checks**: `object`

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L16)

#### Index Signature

\[`key`: `string`\]: `object`

***

### environment

> **environment**: `string`

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:14](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L14)

***

### status

> **status**: `"healthy"` \| `"degraded"` \| `"unhealthy"`

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L11)

***

### system

> **system**: `object`

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L24)

#### cpu

> **cpu**: `object`

##### cpu.cores

> **cores**: `number`

##### cpu.usage

> **usage**: `number`

#### disk?

> `optional` **disk**: `object`

##### disk.free

> **free**: `number`

##### disk.percentage

> **percentage**: `number`

##### disk.total

> **total**: `number`

##### disk.used

> **used**: `number`

#### memory

> **memory**: `object`

##### memory.free

> **free**: `number`

##### memory.percentage

> **percentage**: `number`

##### memory.total

> **total**: `number`

##### memory.used

> **used**: `number`

***

### timestamp

> **timestamp**: `string`

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:12](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L12)

***

### uptime

> **uptime**: `number`

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:15](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L15)

***

### version

> **version**: `string`

Defined in: [src/infrastructure/monitoring/health-aggregator.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/monitoring/health-aggregator.ts#L13)
