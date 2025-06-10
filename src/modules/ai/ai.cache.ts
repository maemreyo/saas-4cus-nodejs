import { Service } from 'typedi';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { AiEvents } from './ai.events';
import { createHash } from 'crypto';
import {
  CompletionOptions,
  CompletionResult,
  ChatMessage,
  ChatOptions,
  ChatResult,
  EmbeddingOptions,
  EmbeddingResult,
  ImageGenerationOptions,
  ImageResult,
} from './models/model.types';

interface CacheConfig {
  completion: { ttl: number; maxSize: number };
  chat: { ttl: number; maxSize: number };
  embedding: { ttl: number; maxSize: number };
  image: { ttl: number; maxSize: number };
}

@Service()
export class AiCacheService {
  private config: CacheConfig = {
    completion: { ttl: 86400 * 7, maxSize: 10000 }, // 7 days
    chat: { ttl: 3600, maxSize: 5000 }, // 1 hour
    embedding: { ttl: 86400 * 30, maxSize: 50000 }, // 30 days
    image: { ttl: 86400 * 90, maxSize: 1000 }, // 90 days
  };

  private namespace = 'ai:cache';

  // Generate cache key
  private generateKey(
    type: string,
    input: any,
    options: any,
    userId?: string
  ): string {
    const data = {
      type,
      input,
      options: {
        model: options.model,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        // Include other relevant options
      },
      userId, // Include userId for user-specific caching if needed
    };

    const hash = createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');

    return `${this.namespace}:${type}:${hash}`;
  }

  // Completion cache
  async getCompletion(
    prompt: string,
    options: CompletionOptions,
    userId?: string
  ): Promise<CompletionResult | null> {
    const key = this.generateKey('completion', prompt, options, userId);

    try {
      const cached = await redis.get<CompletionResult>(key);

      if (cached) {
        await eventBus.emit(AiEvents.CACHE_HIT, {
          userId: userId || 'system',
          cacheKey: key,
          operation: 'completion',
          model: options.model || 'unknown',
          timestamp: new Date(),
        });

        return { ...cached, cached: true };
      }

      await eventBus.emit(AiEvents.CACHE_MISS, {
        userId: userId || 'system',
        cacheKey: key,
        operation: 'completion',
        model: options.model || 'unknown',
        timestamp: new Date(),
      });

      return null;
    } catch (error) {
      logger.error('AI cache get error', error as Error, { key, type: 'completion' });
      return null;
    }
  }

  async setCompletion(
    prompt: string,
    options: CompletionOptions,
    result: CompletionResult,
    userId?: string
  ): Promise<void> {
    const key = this.generateKey('completion', prompt, options, userId);

    try {
      await redis.set(key, result, { ttl: this.config.completion.ttl });

      await eventBus.emit(AiEvents.CACHE_SET, {
        userId: userId || 'system',
        cacheKey: key,
        operation: 'completion',
        model: result.model,
        size: JSON.stringify(result).length,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('AI cache set error', error as Error, { key, type: 'completion' });
    }
  }

  // Chat cache
  async getChat(
    messages: ChatMessage[],
    options: ChatOptions,
    userId?: string
  ): Promise<ChatResult | null> {
    const key = this.generateKey('chat', messages, options, userId);

    try {
      const cached = await redis.get<ChatResult>(key);

      if (cached) {
        await eventBus.emit(AiEvents.CACHE_HIT, {
          userId: userId || 'system',
          cacheKey: key,
          operation: 'chat',
          model: options.model || 'unknown',
          timestamp: new Date(),
        });

        return { ...cached, cached: true };
      }

      await eventBus.emit(AiEvents.CACHE_MISS, {
        userId: userId || 'system',
        cacheKey: key,
        operation: 'chat',
        model: options.model || 'unknown',
        timestamp: new Date(),
      });

      return null;
    } catch (error) {
      logger.error('AI cache get error', error as Error, { key, type: 'chat' });
      return null;
    }
  }

  async setChat(
    messages: ChatMessage[],
    options: ChatOptions,
    result: ChatResult,
    userId?: string
  ): Promise<void> {
    const key = this.generateKey('chat', messages, options, userId);

    try {
      await redis.set(key, result, { ttl: this.config.chat.ttl });

      await eventBus.emit(AiEvents.CACHE_SET, {
        userId: userId || 'system',
        cacheKey: key,
        operation: 'chat',
        model: result.model,
        size: JSON.stringify(result).length,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('AI cache set error', error as Error, { key, type: 'chat' });
    }
  }

  // Embedding cache
  async getEmbedding(
    text: string,
    options: EmbeddingOptions,
    userId?: string
  ): Promise<EmbeddingResult | null> {
    const key = this.generateKey('embedding', text, options, userId);

    try {
      const cached = await redis.get<EmbeddingResult>(key);

      if (cached) {
        await eventBus.emit(AiEvents.CACHE_HIT, {
          userId: userId || 'system',
          cacheKey: key,
          operation: 'embedding',
          model: options.model || 'unknown',
          timestamp: new Date(),
        });

        return { ...cached, cached: true };
      }

      return null;
    } catch (error) {
      logger.error('AI cache get error', error as Error, { key, type: 'embedding' });
      return null;
    }
  }

  async setEmbedding(
    text: string,
    options: EmbeddingOptions,
    result: EmbeddingResult,
    userId?: string
  ): Promise<void> {
    const key = this.generateKey('embedding', text, options, userId);

    try {
      await redis.set(key, result, { ttl: this.config.embedding.ttl });

      await eventBus.emit(AiEvents.CACHE_SET, {
        userId: userId || 'system',
        cacheKey: key,
        operation: 'embedding',
        model: result.model,
        size: JSON.stringify(result).length,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('AI cache set error', error as Error, { key, type: 'embedding' });
    }
  }

  // Image cache
  async getImage(
    options: ImageGenerationOptions,
    userId?: string
  ): Promise<ImageResult | null> {
    const key = this.generateKey('image', options.prompt, options, userId);

    try {
      const cached = await redis.get<ImageResult>(key);

      if (cached) {
        await eventBus.emit(AiEvents.CACHE_HIT, {
          userId: userId || 'system',
          cacheKey: key,
          operation: 'image',
          model: options.model || 'unknown',
          timestamp: new Date(),
        });

        return { ...cached, cached: true };
      }

      return null;
    } catch (error) {
      logger.error('AI cache get error', error as Error, { key, type: 'image' });
      return null;
    }
  }

  async setImage(
    options: ImageGenerationOptions,
    result: ImageResult,
    userId?: string
  ): Promise<void> {
    const key = this.generateKey('image', options.prompt, options, userId);

    try {
      await redis.set(key, result, { ttl: this.config.image.ttl });

      await eventBus.emit(AiEvents.CACHE_SET, {
        userId: userId || 'system',
        cacheKey: key,
        operation: 'image',
        model: result.model,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('AI cache set error', error as Error, { key, type: 'image' });
    }
  }

  // Cache statistics
  async getStats(): Promise<{
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
  }> {
    try {
      const pattern = `${this.namespace}:stats:*`;
      const keys = await redis.smembers(pattern);

      let hits = 0;
      let misses = 0;

      for (const key of keys) {
        const value = await redis.get<number>(key);
        if (key.includes('hits')) {
          hits += value || 0;
        } else if (key.includes('misses')) {
          misses += value || 0;
        }
      }

      const total = hits + misses;
      const hitRate = total > 0 ? (hits / total) * 100 : 0;

      // Estimate cache size
      const cacheKeys = await redis.smembers(`${this.namespace}:*`);

      return {
        hits,
        misses,
        hitRate: Math.round(hitRate * 100) / 100,
        size: cacheKeys.length,
      };
    } catch (error) {
      logger.error('AI cache stats error', error as Error);
      return { hits: 0, misses: 0, hitRate: 0, size: 0 };
    }
  }

  // Clear cache
  async clear(type?: 'completion' | 'chat' | 'embedding' | 'image'): Promise<void> {
    try {
      const pattern = type
        ? `${this.namespace}:${type}:*`
        : `${this.namespace}:*`;

      await redis.invalidateByPattern(pattern);

      logger.info('AI cache cleared', { type: type || 'all' });
    } catch (error) {
      logger.error('AI cache clear error', error as Error);
    }
  }

  // Warm up cache with common requests
  async warmUp(
    commonRequests: Array<{
      type: 'completion' | 'chat' | 'embedding';
      input: any;
      options: any;
      result: any;
    }>
  ): Promise<void> {
    logger.info('Warming up AI cache', { count: commonRequests.length });

    for (const request of commonRequests) {
      try {
        switch (request.type) {
          case 'completion':
            await this.setCompletion(
              request.input,
              request.options,
              request.result
            );
            break;
          case 'chat':
            await this.setChat(
              request.input,
              request.options,
              request.result
            );
            break;
          case 'embedding':
            await this.setEmbedding(
              request.input,
              request.options,
              request.result
            );
            break;
        }
      } catch (error) {
        logger.error('Cache warm up error', error as Error, { request });
      }
    }

    logger.info('AI cache warm up completed');
  }
}
