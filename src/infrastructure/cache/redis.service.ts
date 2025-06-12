import { Redis, RedisOptions } from 'ioredis';
import { Service } from 'typedi';
import { logger } from '@shared/logger';
import { config } from '@infrastructure/config';
import { createHash } from 'crypto';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  compress?: boolean; // Compress large values
  namespace?: string; // Cache namespace
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

@Service()
export class RedisService {
  // Redis sorted set operations for rate limiting
  async zremrangebyscore(key: string, min: string, max: string): Promise<number> {
    return await this.redis.zremrangebyscore(key, min, max);
  }

  async zcard(key: string): Promise<number> {
    return await this.redis.zcard(key);
  }

  async zrange(key: string, start: number, stop: number, withScores?: 'WITHSCORES'): Promise<string[]> {
    return await this.redis.zrange(key, start, stop, withScores);
  }

  async zadd(key: string, score: string, member: string): Promise<number> {
    return await this.redis.zadd(key, score, member);
  }

  async incr(key: string): Promise<number> {
    return await this.redis.incr(key);
  }
  private redis: Redis;
  private subscriber: Redis;
  private publisher: Redis;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0,
  };

  constructor() {
    const redisConfig: RedisOptions = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db,
      keyPrefix: config.redis.keyPrefix,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Redis reconnection attempt ${times}, delay: ${delay}ms`);
        return delay;
      },
      reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    };

    // Add TLS config for production
    if (config.redis.tls) {
      redisConfig.tls = {};
    }

    // Create Redis instances
    this.redis = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    this.publisher = new Redis(redisConfig);

    this.setupEventHandlers();
    this.setupCacheInvalidation();
  }

  private setupEventHandlers() {
    // Connection events
    this.redis.on('connect', () => {
      logger.info('Redis connected');
    });

    this.redis.on('ready', () => {
      logger.info('Redis ready');
    });

    this.redis.on('error', (error: Error) => {
      logger.error('Redis error', error);
      this.stats.errors++;
    });

    this.redis.on('close', () => {
      logger.warn('Redis connection closed');
    });

    this.redis.on('reconnecting', (delay: number) => {
      logger.info(`Redis reconnecting in ${delay}ms`);
    });
  }

  private setupCacheInvalidation() {
    // Subscribe to cache invalidation events
    this.subscriber.subscribe('cache:invalidate:tag', 'cache:invalidate:pattern');

    this.subscriber.on('message', async (channel: string, message: string) => {
      try {
        const data = JSON.parse(message);

        switch (channel) {
          case 'cache:invalidate:tag':
            await this.invalidateByTagLocal(data.tag);
            break;
          case 'cache:invalidate:pattern':
            await this.invalidateByPatternLocal(data.pattern);
            break;
        }
      } catch (error) {
        logger.error('Cache invalidation error', error as Error);
      }
    });
  }

  // Connect to Redis
  async connect(): Promise<void> {
    await Promise.all([this.redis.connect(), this.subscriber.connect(), this.publisher.connect()]);
  }

  // Disconnect from Redis
  async disconnect(): Promise<void> {
    await Promise.all([this.redis.quit(), this.subscriber.quit(), this.publisher.quit()]);
  }

  // Generate cache key
  private generateKey(key: string, namespace?: string): string {
    const prefix = namespace ? `${namespace}:` : '';
    return `${prefix}${key}`;
  }

  // Serialize value
  private serialize(value: any, compress?: boolean): string {
    const json = JSON.stringify(value);

    if (compress && json.length > 1024) {
      // For production, you might want to use zlib compression
      // This is a placeholder for compression logic
      return json;
    }

    return json;
  }

  // Deserialize value
  private deserialize(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  // Get value from cache
  async get<T = any>(key: string, options?: { namespace?: string }): Promise<T | null> {
    try {
      const fullKey = this.generateKey(key, options?.namespace);
      const value = await this.redis.get(fullKey);

      if (value === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return this.deserialize(value);
    } catch (error) {
      logger.error('Cache get error', error as Error, { key });
      this.stats.errors++;
      return null;
    }
  }

  // Set value in cache
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    try {
      const fullKey = this.generateKey(key, options?.namespace);
      const serialized = this.serialize(value, options?.compress);

      if (options?.ttl) {
        await this.redis.setex(fullKey, options.ttl, serialized);
      } else {
        await this.redis.set(fullKey, serialized);
      }

      // Handle tags
      if (options?.tags) {
        for (const tag of options.tags) {
          await this.redis.sadd(`tag:${tag}`, fullKey);
          if (options?.ttl) {
            await this.redis.expire(`tag:${tag}`, options.ttl);
          }
        }
      }

      this.stats.sets++;
    } catch (error) {
      logger.error('Cache set error', error as Error, { key });
      this.stats.errors++;
      throw error;
    }
  }

  // Delete value from cache
  async delete(key: string, options?: { namespace?: string }): Promise<void> {
    try {
      const fullKey = this.generateKey(key, options?.namespace);
      await this.redis.del(fullKey);
      this.stats.deletes++;
    } catch (error) {
      logger.error('Cache delete error', error as Error, { key });
      this.stats.errors++;
    }
  }

  // Check if key exists
  async exists(key: string, options?: { namespace?: string }): Promise<boolean> {
    try {
      const fullKey = this.generateKey(key, options?.namespace);
      return (await this.redis.exists(fullKey)) === 1;
    } catch (error) {
      logger.error('Cache exists error', error as Error, { key });
      return false;
    }
  }

  // Get remaining TTL
  async ttl(key: string, options?: { namespace?: string }): Promise<number> {
    try {
      const fullKey = this.generateKey(key, options?.namespace);
      return await this.redis.ttl(fullKey);
    } catch (error) {
      logger.error('Cache ttl error', error as Error, { key });
      return -1;
    }
  }

  // Extend TTL
  async expire(key: string, ttl: number, options?: { namespace?: string }): Promise<void> {
    try {
      const fullKey = this.generateKey(key, options?.namespace);
      await this.redis.expire(fullKey, ttl);
    } catch (error) {
      logger.error('Cache expire error', error as Error, { key });
    }
  }

  // Get or set (cache-aside pattern)
  async remember<T>(key: string, factory: () => Promise<T>, options?: CacheOptions): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key, { namespace: options?.namespace });
    if (cached !== null) {
      return cached;
    }

    // Generate fresh value
    const value = await factory();

    // Store in cache
    await this.set(key, value, options);

    return value;
  }

  // Invalidate by tag (local)
  private async invalidateByTagLocal(tag: string): Promise<void> {
    try {
      const keys = await this.redis.smembers(`tag:${tag}`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        await this.redis.del(`tag:${tag}`);
        this.stats.deletes += keys.length;
      }
    } catch (error) {
      logger.error('Cache invalidate by tag error', error as Error, { tag });
      this.stats.errors++;
    }
  }

  // Invalidate by tag (distributed)
  async invalidateByTag(tag: string): Promise<void> {
    await this.invalidateByTagLocal(tag);
    await this.publisher.publish('cache:invalidate:tag', JSON.stringify({ tag }));
  }

  // Invalidate by pattern (local)
  private async invalidateByPatternLocal(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.stats.deletes += keys.length;
      }
    } catch (error) {
      logger.error('Cache invalidate by pattern error', error as Error, { pattern });
      this.stats.errors++;
    }
  }

  // Invalidate by pattern (distributed)
  async invalidateByPattern(pattern: string): Promise<void> {
    await this.invalidateByPatternLocal(pattern);
    await this.publisher.publish('cache:invalidate:pattern', JSON.stringify({ pattern }));
  }

  // Clear all cache
  async flush(namespace?: string): Promise<void> {
    try {
      if (namespace) {
        await this.invalidateByPattern(`${namespace}:*`);
      } else {
        await this.redis.flushdb();
      }
    } catch (error) {
      logger.error('Cache flush error', error as Error);
      this.stats.errors++;
    }
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Reset statistics
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
    };
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Redis ping failed', error as Error);
      return false;
    }
  }

  // Get Redis info
  async info(): Promise<Record<string, any>> {
    try {
      const info = await this.redis.info();
      const sections: Record<string, any> = {};

      info.split('\r\n').forEach(line => {
        if (line.startsWith('#')) {
          // Section header
          return;
        }

        const [key, value] = line.split(':');
        if (key && value) {
          sections[key] = value;
        }
      });

      return sections;
    } catch (error) {
      logger.error('Redis info failed', error as Error);
      return {};
    }
  }

  // Atomic increment
  async increment(key: string, value = 1, options?: { namespace?: string }): Promise<number> {
    try {
      const fullKey = this.generateKey(key, options?.namespace);
      return await this.redis.incrby(fullKey, value);
    } catch (error) {
      logger.error('Cache increment error', error as Error, { key });
      throw error;
    }
  }

  // Atomic decrement
  async decrement(key: string, value = 1, options?: { namespace?: string }): Promise<number> {
    try {
      const fullKey = this.generateKey(key, options?.namespace);
      return await this.redis.decrby(fullKey, value);
    } catch (error) {
      logger.error('Cache decrement error', error as Error, { key });
      throw error;
    }
  }

  // List operations
  async lpush(key: string, ...values: any[]): Promise<number> {
    const serialized = values.map(v => this.serialize(v));
    return await this.redis.lpush(key, ...serialized);
  }

  async rpush(key: string, ...values: any[]): Promise<number> {
    const serialized = values.map(v => this.serialize(v));
    return await this.redis.rpush(key, ...serialized);
  }

  async lrange(key: string, start: number, stop: number): Promise<any[]> {
    const values = await this.redis.lrange(key, start, stop);
    return values.map(v => this.deserialize(v));
  }

  // Set operations
  async sadd(key: string, ...members: any[]): Promise<number> {
    const serialized = members.map(m => this.serialize(m));
    return await this.redis.sadd(key, ...serialized);
  }

  async smembers(key: string): Promise<any[]> {
    const members = await this.redis.smembers(key);
    return members.map(m => this.deserialize(m));
  }

  async srem(key: string, ...members: any[]): Promise<number> {
    const serialized = members.map(m => this.serialize(m));
    return await this.redis.srem(key, ...serialized);
  }

  // Hash operations
  async hset(key: string, field: string, value: any): Promise<number> {
    return await this.redis.hset(key, field, this.serialize(value));
  }

  async hget(key: string, field: string): Promise<any> {
    const value = await this.redis.hget(key, field);
    return value ? this.deserialize(value) : null;
  }

  async hgetall(key: string): Promise<Record<string, any>> {
    const hash = await this.redis.hgetall(key);
    const result: Record<string, any> = {};

    for (const [field, value] of Object.entries(hash)) {
      result[field] = this.deserialize(value);
    }

    return result;
  }

  // Increment hash field by value
  async hincrby(key: string, field: string, increment = 1): Promise<number> {
    try {
      return await this.redis.hincrby(key, field, increment);
    } catch (error) {
      logger.error('Cache hincrby error', error as Error, { key, field });
      throw error;
    }
  }

  // Pub/Sub
  async publish(channel: string, message: any): Promise<number> {
    return await this.publisher.publish(channel, this.serialize(message));
  }

  async subscribe(channel: string, handler: (message: any) => void): Promise<void> {
    await this.subscriber.subscribe(channel);

    this.subscriber.on('message', (ch: string, msg: string) => {
      if (ch === channel) {
        handler(this.deserialize(msg));
      }
    });
  }

  // Pipeline operations
  pipeline() {
    return (this.redis as any).pipeline();
  }

  // HyperLogLog operations
  async pfadd(key: string, ...values: string[]): Promise<number> {
    return await this.redis.pfadd(key, ...values);
  }

  async pfcount(...keys: string[]): Promise<number> {
    return await this.redis.pfcount(...keys);
  }

  async pfmerge(destkey: string, ...sourcekeys: string[]): Promise<'OK'> {
    return await this.redis.pfmerge(destkey, ...sourcekeys);
  }

  // Lock implementation for distributed locking
  async acquireLock(
    resource: string,
    ttl: number = 30000,
    retries: number = 3,
    retryDelay: number = 100,
  ): Promise<string | null> {
    const lockKey = `lock:${resource}`;
    const lockId = createHash('sha256').update(`${Date.now()}-${Math.random()}`).digest('hex');

    for (let i = 0; i < retries; i++) {
      const acquired = await this.redis.set(lockKey, lockId, 'PX', ttl, 'NX');

      if (acquired === 'OK') {
        return lockId;
      }

      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    return null;
  }

  async releaseLock(resource: string, lockId: string): Promise<boolean> {
    const lockKey = `lock:${resource}`;

    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await this.redis.eval(script, 1, lockKey, lockId);
    return result === 1;
  }
}

// Create singleton instance
export const redis = new RedisService();

// Cache decorator
export function Cacheable(options?: CacheOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      try {
        // Try to get from cache
        const cached = await redis.get(cacheKey, { namespace: options?.namespace });
        if (cached !== null) {
          return cached;
        }

        // Execute original method
        const result = await originalMethod.apply(this, args);

        // Store in cache
        await redis.set(cacheKey, result, options);

        return result;
      } catch (error) {
        // If cache fails, still execute the method
        logger.error('Cacheable decorator error', error as Error);
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}

// Cache invalidation decorator
export function CacheInvalidate(tags: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      // Invalidate cache tags
      for (const tag of tags) {
        await redis.invalidateByTag(tag);
      }

      return result;
    };

    return descriptor;
  };
}
