[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [infrastructure/cache/redis.service](../README.md) / RedisService

# Class: RedisService

Defined in: [src/infrastructure/cache/redis.service.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L23)

## Constructors

### Constructor

> **new RedisService**(): `RedisService`

Defined in: [src/infrastructure/cache/redis.service.ts:55](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L55)

#### Returns

`RedisService`

## Methods

### acquireLock()

> **acquireLock**(`resource`, `ttl`, `retries`, `retryDelay`): `Promise`\<`string`\>

Defined in: [src/infrastructure/cache/redis.service.ts:514](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L514)

#### Parameters

##### resource

`string`

##### ttl

`number` = `30000`

##### retries

`number` = `3`

##### retryDelay

`number` = `100`

#### Returns

`Promise`\<`string`\>

***

### connect()

> **connect**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:140](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L140)

#### Returns

`Promise`\<`void`\>

***

### decrement()

> **decrement**(`key`, `value`, `options?`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:407](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L407)

#### Parameters

##### key

`string`

##### value

`number` = `1`

##### options?

###### namespace?

`string`

#### Returns

`Promise`\<`number`\>

***

### delete()

> **delete**(`key`, `options?`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:228](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L228)

#### Parameters

##### key

`string`

##### options?

###### namespace?

`string`

#### Returns

`Promise`\<`void`\>

***

### deserialize()

> `private` **deserialize**(`value`): `any`

Defined in: [src/infrastructure/cache/redis.service.ts:169](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L169)

#### Parameters

##### value

`string`

#### Returns

`any`

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:145](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L145)

#### Returns

`Promise`\<`void`\>

***

### exists()

> **exists**(`key`, `options?`): `Promise`\<`boolean`\>

Defined in: [src/infrastructure/cache/redis.service.ts:240](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L240)

#### Parameters

##### key

`string`

##### options?

###### namespace?

`string`

#### Returns

`Promise`\<`boolean`\>

***

### expire()

> **expire**(`key`, `ttl`, `options?`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:262](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L262)

#### Parameters

##### key

`string`

##### ttl

`number`

##### options?

###### namespace?

`string`

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(`namespace?`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:330](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L330)

#### Parameters

##### namespace?

`string`

#### Returns

`Promise`\<`void`\>

***

### generateKey()

> `private` **generateKey**(`key`, `namespace?`): `string`

Defined in: [src/infrastructure/cache/redis.service.ts:150](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L150)

#### Parameters

##### key

`string`

##### namespace?

`string`

#### Returns

`string`

***

### get()

> **get**\<`T`\>(`key`, `options?`): `Promise`\<`T`\>

Defined in: [src/infrastructure/cache/redis.service.ts:178](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L178)

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### key

`string`

##### options?

###### namespace?

`string`

#### Returns

`Promise`\<`T`\>

***

### getStats()

> **getStats**(): [`CacheStats`](../interfaces/CacheStats.md)

Defined in: [src/infrastructure/cache/redis.service.ts:344](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L344)

#### Returns

[`CacheStats`](../interfaces/CacheStats.md)

***

### hget()

> **hget**(`key`, `field`): `Promise`\<`any`\>

Defined in: [src/infrastructure/cache/redis.service.ts:454](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L454)

#### Parameters

##### key

`string`

##### field

`string`

#### Returns

`Promise`\<`any`\>

***

### hgetall()

> **hgetall**(`key`): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [src/infrastructure/cache/redis.service.ts:459](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L459)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

***

### hincrby()

> **hincrby**(`key`, `field`, `increment`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:471](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L471)

#### Parameters

##### key

`string`

##### field

`string`

##### increment

`number` = `1`

#### Returns

`Promise`\<`number`\>

***

### hset()

> **hset**(`key`, `field`, `value`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:450](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L450)

#### Parameters

##### key

`string`

##### field

`string`

##### value

`any`

#### Returns

`Promise`\<`number`\>

***

### incr()

> **incr**(`key`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:41](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L41)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### increment()

> **increment**(`key`, `value`, `options?`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:396](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L396)

#### Parameters

##### key

`string`

##### value

`number` = `1`

##### options?

###### namespace?

`string`

#### Returns

`Promise`\<`number`\>

***

### info()

> **info**(): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [src/infrastructure/cache/redis.service.ts:371](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L371)

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

***

### invalidateByPattern()

> **invalidateByPattern**(`pattern`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:324](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L324)

#### Parameters

##### pattern

`string`

#### Returns

`Promise`\<`void`\>

***

### invalidateByPatternLocal()

> `private` **invalidateByPatternLocal**(`pattern`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:310](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L310)

#### Parameters

##### pattern

`string`

#### Returns

`Promise`\<`void`\>

***

### invalidateByTag()

> **invalidateByTag**(`tag`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:304](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L304)

#### Parameters

##### tag

`string`

#### Returns

`Promise`\<`void`\>

***

### invalidateByTagLocal()

> `private` **invalidateByTagLocal**(`tag`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:289](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L289)

#### Parameters

##### tag

`string`

#### Returns

`Promise`\<`void`\>

***

### lpush()

> **lpush**(`key`, ...`values`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:418](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L418)

#### Parameters

##### key

`string`

##### values

...`any`[]

#### Returns

`Promise`\<`number`\>

***

### lrange()

> **lrange**(`key`, `start`, `stop`): `Promise`\<`any`[]\>

Defined in: [src/infrastructure/cache/redis.service.ts:428](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L428)

#### Parameters

##### key

`string`

##### start

`number`

##### stop

`number`

#### Returns

`Promise`\<`any`[]\>

***

### pfadd()

> **pfadd**(`key`, ...`values`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:501](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L501)

#### Parameters

##### key

`string`

##### values

...`string`[]

#### Returns

`Promise`\<`number`\>

***

### pfcount()

> **pfcount**(...`keys`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:505](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L505)

#### Parameters

##### keys

...`string`[]

#### Returns

`Promise`\<`number`\>

***

### pfmerge()

> **pfmerge**(`destkey`, ...`sourcekeys`): `Promise`\<`"OK"`\>

Defined in: [src/infrastructure/cache/redis.service.ts:509](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L509)

#### Parameters

##### destkey

`string`

##### sourcekeys

...`string`[]

#### Returns

`Promise`\<`"OK"`\>

***

### ping()

> **ping**(): `Promise`\<`boolean`\>

Defined in: [src/infrastructure/cache/redis.service.ts:360](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L360)

#### Returns

`Promise`\<`boolean`\>

***

### pipeline()

> **pipeline**(): `any`

Defined in: [src/infrastructure/cache/redis.service.ts:496](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L496)

#### Returns

`any`

***

### publish()

> **publish**(`channel`, `message`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:481](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L481)

#### Parameters

##### channel

`string`

##### message

`any`

#### Returns

`Promise`\<`number`\>

***

### releaseLock()

> **releaseLock**(`resource`, `lockId`): `Promise`\<`boolean`\>

Defined in: [src/infrastructure/cache/redis.service.ts:538](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L538)

#### Parameters

##### resource

`string`

##### lockId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### remember()

> **remember**\<`T`\>(`key`, `factory`, `options?`): `Promise`\<`T`\>

Defined in: [src/infrastructure/cache/redis.service.ts:272](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L272)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### factory

() => `Promise`\<`T`\>

##### options?

[`CacheOptions`](../interfaces/CacheOptions.md)

#### Returns

`Promise`\<`T`\>

***

### resetStats()

> **resetStats**(): `void`

Defined in: [src/infrastructure/cache/redis.service.ts:349](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L349)

#### Returns

`void`

***

### rpush()

> **rpush**(`key`, ...`values`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:423](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L423)

#### Parameters

##### key

`string`

##### values

...`any`[]

#### Returns

`Promise`\<`number`\>

***

### sadd()

> **sadd**(`key`, ...`members`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:434](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L434)

#### Parameters

##### key

`string`

##### members

...`any`[]

#### Returns

`Promise`\<`number`\>

***

### serialize()

> `private` **serialize**(`value`, `compress?`): `string`

Defined in: [src/infrastructure/cache/redis.service.ts:156](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L156)

#### Parameters

##### value

`any`

##### compress?

`boolean`

#### Returns

`string`

***

### set()

> **set**(`key`, `value`, `options?`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:198](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L198)

#### Parameters

##### key

`string`

##### value

`any`

##### options?

[`CacheOptions`](../interfaces/CacheOptions.md)

#### Returns

`Promise`\<`void`\>

***

### setupCacheInvalidation()

> `private` **setupCacheInvalidation**(): `void`

Defined in: [src/infrastructure/cache/redis.service.ts:117](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L117)

#### Returns

`void`

***

### setupEventHandlers()

> `private` **setupEventHandlers**(): `void`

Defined in: [src/infrastructure/cache/redis.service.ts:93](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L93)

#### Returns

`void`

***

### smembers()

> **smembers**(`key`): `Promise`\<`any`[]\>

Defined in: [src/infrastructure/cache/redis.service.ts:439](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L439)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`any`[]\>

***

### srem()

> **srem**(`key`, ...`members`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:444](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L444)

#### Parameters

##### key

`string`

##### members

...`any`[]

#### Returns

`Promise`\<`number`\>

***

### subscribe()

> **subscribe**(`channel`, `handler`): `Promise`\<`void`\>

Defined in: [src/infrastructure/cache/redis.service.ts:485](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L485)

#### Parameters

##### channel

`string`

##### handler

(`message`) => `void`

#### Returns

`Promise`\<`void`\>

***

### ttl()

> **ttl**(`key`, `options?`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:251](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L251)

#### Parameters

##### key

`string`

##### options?

###### namespace?

`string`

#### Returns

`Promise`\<`number`\>

***

### zadd()

> **zadd**(`key`, `score`, `member`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:37](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L37)

#### Parameters

##### key

`string`

##### score

`string`

##### member

`string`

#### Returns

`Promise`\<`number`\>

***

### zcard()

> **zcard**(`key`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:29](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L29)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### zrange()

> **zrange**(`key`, `start`, `stop`, `withScores?`): `Promise`\<`string`[]\>

Defined in: [src/infrastructure/cache/redis.service.ts:33](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L33)

#### Parameters

##### key

`string`

##### start

`number`

##### stop

`number`

##### withScores?

`"WITHSCORES"`

#### Returns

`Promise`\<`string`[]\>

***

### zremrangebyscore()

> **zremrangebyscore**(`key`, `min`, `max`): `Promise`\<`number`\>

Defined in: [src/infrastructure/cache/redis.service.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L25)

#### Parameters

##### key

`string`

##### min

`string`

##### max

`string`

#### Returns

`Promise`\<`number`\>

## Properties

### publisher

> `private` **publisher**: `Redis`

Defined in: [src/infrastructure/cache/redis.service.ts:46](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L46)

***

### redis

> `private` **redis**: `Redis`

Defined in: [src/infrastructure/cache/redis.service.ts:44](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L44)

***

### stats

> `private` **stats**: [`CacheStats`](../interfaces/CacheStats.md)

Defined in: [src/infrastructure/cache/redis.service.ts:47](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L47)

***

### subscriber

> `private` **subscriber**: `Redis`

Defined in: [src/infrastructure/cache/redis.service.ts:45](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/infrastructure/cache/redis.service.ts#L45)
