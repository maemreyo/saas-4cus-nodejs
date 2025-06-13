[**modern-backend-template v2.0.0**](../../../README.md)

***

[modern-backend-template](../../../modules.md) / [infrastructure/config](../README.md) / getConfig

# Function: getConfig()

> **getConfig**(): `object`

Defined in: [src/infrastructure/config/index.ts:493](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/config/index.ts#L493)

## Returns

`object`

### api?

> `optional` **api**: `object`

#### api.pagination?

> `optional` **pagination**: `object`

#### api.pagination.defaultLimit?

> `optional` **defaultLimit**: `number`

#### api.pagination.maxLimit?

> `optional` **maxLimit**: `number`

#### api.prefix?

> `optional` **prefix**: `string`

#### api.swagger?

> `optional` **swagger**: `object`

#### api.swagger.description?

> `optional` **description**: `string`

#### api.swagger.enabled?

> `optional` **enabled**: `boolean`

#### api.swagger.route?

> `optional` **route**: `string`

#### api.swagger.title?

> `optional` **title**: `string`

### app?

> `optional` **app**: `object`

#### app.env?

> `optional` **env**: [`Environment`](../enumerations/Environment.md)

#### app.host?

> `optional` **host**: `string`

#### app.isDevelopment?

> `optional` **isDevelopment**: `boolean`

#### app.isProduction?

> `optional` **isProduction**: `boolean`

#### app.isTest?

> `optional` **isTest**: `boolean`

#### app.name?

> `optional` **name**: `string`

#### app.port?

> `optional` **port**: `number`

#### app.version?

> `optional` **version**: `string`

### cors?

> `optional` **cors**: `object`

#### cors.allowedHeaders?

> `optional` **allowedHeaders**: `string`[]

#### cors.credentials?

> `optional` **credentials**: `boolean`

#### cors.exposedHeaders?

> `optional` **exposedHeaders**: `string`[]

#### cors.maxAge?

> `optional` **maxAge**: `number`

#### cors.methods?

> `optional` **methods**: `string`[]

#### cors.origin?

> `optional` **origin**: `string` \| `boolean` \| `string`[] \| (...`args`) => `unknown`

### database?

> `optional` **database**: `object`

#### database.logging?

> `optional` **logging**: `boolean`

#### database.pool?

> `optional` **pool**: `object`

#### database.pool.acquire?

> `optional` **acquire**: `number`

#### database.pool.idle?

> `optional` **idle**: `number`

#### database.pool.max?

> `optional` **max**: `number`

#### database.pool.min?

> `optional` **min**: `number`

#### database.ssl?

> `optional` **ssl**: `boolean`

#### database.url?

> `optional` **url**: `string`

### email?

> `optional` **email**: `object`

#### email.from?

> `optional` **from**: `string`

#### email.replyTo?

> `optional` **replyTo**: `string`

#### email.smtp?

> `optional` **smtp**: `object`

#### email.smtp.auth?

> `optional` **auth**: `object`

#### email.smtp.auth.pass?

> `optional` **pass**: `string`

#### email.smtp.auth.user?

> `optional` **user**: `string`

#### email.smtp.host?

> `optional` **host**: `string`

#### email.smtp.port?

> `optional` **port**: `number`

#### email.smtp.secure?

> `optional` **secure**: `boolean`

### external?

> `optional` **external**: `object`

#### external.openai?

> `optional` **openai**: `object`

#### external.openai.apiKey?

> `optional` **apiKey**: `string`

#### external.openai.organization?

> `optional` **organization**: `string`

#### external.stripe?

> `optional` **stripe**: `object`

#### external.stripe.secretKey?

> `optional` **secretKey**: `string`

#### external.stripe.webhookSecret?

> `optional` **webhookSecret**: `string`

### features?

> `optional` **features**: `object`

#### features.emailVerification?

> `optional` **emailVerification**: `boolean`

#### features.fileUpload?

> `optional` **fileUpload**: `boolean`

#### features.oauth?

> `optional` **oauth**: `boolean`

#### features.passwordReset?

> `optional` **passwordReset**: `boolean`

#### features.registration?

> `optional` **registration**: `boolean`

#### features.twoFactorAuth?

> `optional` **twoFactorAuth**: `boolean`

### monitoring?

> `optional` **monitoring**: `object`

#### monitoring.logging?

> `optional` **logging**: `object`

#### monitoring.logging.level?

> `optional` **level**: `"fatal"` \| `"error"` \| `"warn"` \| `"info"` \| `"debug"` \| `"trace"`

#### monitoring.logging.pretty?

> `optional` **pretty**: `boolean`

#### monitoring.metrics?

> `optional` **metrics**: `object`

#### monitoring.metrics.enabled?

> `optional` **enabled**: `boolean`

#### monitoring.metrics.port?

> `optional` **port**: `number`

#### monitoring.sentry?

> `optional` **sentry**: `object`

#### monitoring.sentry.dsn?

> `optional` **dsn**: `string`

#### monitoring.sentry.enabled?

> `optional` **enabled**: `boolean`

#### monitoring.sentry.environment?

> `optional` **environment**: `string`

#### monitoring.sentry.profilesSampleRate?

> `optional` **profilesSampleRate**: `number`

#### monitoring.sentry.tracesSampleRate?

> `optional` **tracesSampleRate**: `number`

### oauth?

> `optional` **oauth**: `object`

#### oauth.github?

> `optional` **github**: `object`

#### oauth.github.callbackUrl?

> `optional` **callbackUrl**: `string`

#### oauth.github.clientId?

> `optional` **clientId**: `string`

#### oauth.github.clientSecret?

> `optional` **clientSecret**: `string`

#### oauth.google?

> `optional` **google**: `object`

#### oauth.google.callbackUrl?

> `optional` **callbackUrl**: `string`

#### oauth.google.clientId?

> `optional` **clientId**: `string`

#### oauth.google.clientSecret?

> `optional` **clientSecret**: `string`

### queue?

> `optional` **queue**: `object`

#### queue.concurrency?

> `optional` **concurrency**: `number`

#### queue.maxJobsPerWorker?

> `optional` **maxJobsPerWorker**: `number`

#### queue.maxStalledCount?

> `optional` **maxStalledCount**: `number`

#### queue.redis?

> `optional` **redis**: `object`

#### queue.redis.host?

> `optional` **host**: `string`

#### queue.redis.password?

> `optional` **password**: `string`

#### queue.redis.port?

> `optional` **port**: `number`

#### queue.stalledInterval?

> `optional` **stalledInterval**: `number`

### rateLimit?

> `optional` **rateLimit**: `object`

#### rateLimit.legacyHeaders?

> `optional` **legacyHeaders**: `boolean`

#### rateLimit.max?

> `optional` **max**: `number`

#### rateLimit.skipFailedRequests?

> `optional` **skipFailedRequests**: `boolean`

#### rateLimit.skipSuccessfulRequests?

> `optional` **skipSuccessfulRequests**: `boolean`

#### rateLimit.standardHeaders?

> `optional` **standardHeaders**: `boolean`

#### rateLimit.windowMs?

> `optional` **windowMs**: `number`

### redis?

> `optional` **redis**: `object`

#### redis.db?

> `optional` **db**: `number`

#### redis.host?

> `optional` **host**: `string`

#### redis.keyPrefix?

> `optional` **keyPrefix**: `string`

#### redis.password?

> `optional` **password**: `string`

#### redis.port?

> `optional` **port**: `number`

#### redis.tls?

> `optional` **tls**: `boolean`

### search?

> `optional` **search**: `object`

#### search.elasticsearch?

> `optional` **elasticsearch**: `object`

#### search.elasticsearch.auth?

> `optional` **auth**: `object`

#### search.elasticsearch.auth.password?

> `optional` **password**: `string`

#### search.elasticsearch.auth.username?

> `optional` **username**: `string`

#### search.elasticsearch.url?

> `optional` **url**: `string`

### security?

> `optional` **security**: `object`

#### security.bcryptRounds?

> `optional` **bcryptRounds**: `number`

#### security.cookie?

> `optional` **cookie**: `object`

#### security.cookie.httpOnly?

> `optional` **httpOnly**: `boolean`

#### security.cookie.sameSite?

> `optional` **sameSite**: `"strict"` \| `"lax"` \| `"none"`

#### security.cookie.secret?

> `optional` **secret**: `string`

#### security.cookie.secure?

> `optional` **secure**: `boolean`

#### security.encryption?

> `optional` **encryption**: `object`

#### security.encryption.key?

> `optional` **key**: `string`

#### security.jwt?

> `optional` **jwt**: `object`

#### security.jwt.accessExpiresIn?

> `optional` **accessExpiresIn**: `string`

#### security.jwt.accessSecret?

> `optional` **accessSecret**: `string`

#### security.jwt.refreshExpiresIn?

> `optional` **refreshExpiresIn**: `string`

#### security.jwt.refreshSecret?

> `optional` **refreshSecret**: `string`

### storage?

> `optional` **storage**: `object`

#### storage.local?

> `optional` **local**: `object`

#### storage.local.path?

> `optional` **path**: `string`

#### storage.s3?

> `optional` **s3**: `object`

#### storage.s3.accessKeyId?

> `optional` **accessKeyId**: `string`

#### storage.s3.bucket?

> `optional` **bucket**: `string`

#### storage.s3.endpoint?

> `optional` **endpoint**: `string`

#### storage.s3.region?

> `optional` **region**: `string`

#### storage.s3.secretAccessKey?

> `optional` **secretAccessKey**: `string`

#### storage.type?

> `optional` **type**: `"local"` \| `"s3"` \| `"gcs"`

### support?

> `optional` **support**: `object`

#### support.autoCloseDays?

> `optional` **autoCloseDays**: `number`

#### support.autoCloseWarningDays?

> `optional` **autoCloseWarningDays**: `number`

#### support.email?

> `optional` **email**: `string`

#### support.managementEmails?

> `optional` **managementEmails**: `string`[]

#### support.rateLimit?

> `optional` **rateLimit**: `object`

#### support.rateLimit.max?

> `optional` **max**: `number`

#### support.rateLimit.window?

> `optional` **window**: `number`

#### support.satisfactionSurveyDelay?

> `optional` **satisfactionSurveyDelay**: `number`

#### support.sla?

> `optional` **sla**: `object`

#### support.sla.firstResponse?

> `optional` **firstResponse**: `object`

#### support.sla.firstResponse.critical?

> `optional` **critical**: `number`

#### support.sla.firstResponse.high?

> `optional` **high**: `number`

#### support.sla.firstResponse.low?

> `optional` **low**: `number`

#### support.sla.firstResponse.medium?

> `optional` **medium**: `number`

#### support.sla.firstResponse.urgent?

> `optional` **urgent**: `number`

#### support.sla.resolution?

> `optional` **resolution**: `object`

#### support.sla.resolution.critical?

> `optional` **critical**: `number`

#### support.sla.resolution.high?

> `optional` **high**: `number`

#### support.sla.resolution.low?

> `optional` **low**: `number`

#### support.sla.resolution.medium?

> `optional` **medium**: `number`

#### support.sla.resolution.urgent?

> `optional` **urgent**: `number`

#### support.teamEmails?

> `optional` **teamEmails**: `string`[]

### webhook?

> `optional` **webhook**: `object`

#### webhook.maxRetries?

> `optional` **maxRetries**: `number`

#### webhook.retryDelay?

> `optional` **retryDelay**: `number`

#### webhook.timeout?

> `optional` **timeout**: `number`
