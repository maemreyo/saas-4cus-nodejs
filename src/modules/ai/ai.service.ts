import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { NotFoundException, BadRequestException, ForbiddenException } from '@shared/exceptions';
import { AiEvents } from './ai.events';
import { AiCacheService } from './ai.cache';
import { encrypt, decrypt } from '@shared/utils/crypto';
import { BillingService } from '@modules/billing/billing.service';
import { EntitlementService } from '@modules/features/entitlement.service';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { nanoid } from 'nanoid';

// Providers
import { BaseAiProvider } from './providers/base.provider';
import { OpenAIProvider } from './providers/openai.provider';
import { MockProvider } from './providers/mock.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { GoogleAIProvider } from './providers/google-ai.provider';
import { OllamaProvider } from './providers/ollama.provider';

// Types
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
  AudioTranscriptionOptions,
  AudioResult,
  AiProviderOptions,
  ProviderConfig,
} from './models/model.types';
import { ModelRegistry } from './models/model.registry';
import { AiApiKey, AiPromptTemplate, AiConversation } from '@prisma/client';

@Service()
export class AiService {
  private providers: Map<string, BaseAiProvider> = new Map();
  private defaultProvider = 'openai';

  constructor(
    private cacheService: AiCacheService,
    private billingService: BillingService,
    private entitlementService: EntitlementService,
    private analyticsService: AnalyticsService
  ) {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize OpenAI provider
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIProvider({
        apiKey: process.env.OPENAI_API_KEY,
      }));
    }

    // Initialize Anthropic provider
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('anthropic', new AnthropicProvider({
        apiKey: process.env.ANTHROPIC_API_KEY,
      }));
    }

    // Initialize Google AI provider
    if (process.env.GOOGLE_AI_API_KEY) {
      this.providers.set('google', new GoogleAIProvider({
        apiKey: process.env.GOOGLE_AI_API_KEY,
      }));
    }

    // Initialize Ollama provider (local)
    this.providers.set('ollama', new OllamaProvider({
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    }));

    // Initialize Mock provider for development/testing
    this.providers.set('mock', new MockProvider({}));

    logger.info('AI providers initialized', {
      providers: Array.from(this.providers.keys()),
    });
  }

  // Provider management
  private async getProvider(
    providerName?: string,
    userId?: string,
    tenantId?: string
  ): Promise<BaseAiProvider> {
    const name = providerName || this.defaultProvider;
    let provider = this.providers.get(name);

    if (!provider) {
      // Try to load user/tenant specific API key
      if (userId) {
        const apiKey = await this.getUserApiKey(userId, name, tenantId);
        if (apiKey) {
          provider = this.createProviderWithApiKey(name, apiKey);
        }
      }
    }

    if (!provider) {
      throw new BadRequestException(`AI provider '${name}' not available`);
    }

    // Check if provider is available
    const isAvailable = await provider.isAvailable();
    if (!isAvailable) {
      throw new BadRequestException(`AI provider '${name}' is not available`);
    }

    return provider;
  }

  private createProviderWithApiKey(
    providerName: string,
    apiKey: AiApiKey
  ): BaseAiProvider {
    const decryptedKey = decrypt(apiKey.keyHash);
    const config: ProviderConfig = { apiKey: decryptedKey };

    switch (providerName) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'anthropic':
        return new AnthropicProvider(config);
      case 'google':
        return new GoogleAIProvider(config);
      case 'ollama':
        return new OllamaProvider({
          baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        });
      case 'mock':
        return new MockProvider(config);
      default:
        throw new BadRequestException(`Unknown provider: ${providerName}`);
    }
  }

  // API Key management
  async createApiKey(
    userId: string,
    providerId: string,
    name: string,
    apiKey: string,
    tenantId?: string,
    expiresAt?: Date,
    usageLimit?: number
  ): Promise<AiApiKey> {
    const provider = await prisma.client.aiProvider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const keyHash = encrypt(apiKey);

    const created = await prisma.client.aiApiKey.create({
      data: {
        providerId,
        userId,
        tenantId,
        name,
        keyHash,
        expiresAt,
        usageLimit,
      },
    });

    await eventBus.emit(AiEvents.API_KEY_CREATED, {
      userId,
      tenantId,
      apiKeyId: created.id,
      providerId,
      name,
      expiresAt,
      timestamp: new Date(),
    });

    return created;
  }

  private async getUserApiKey(
    userId: string,
    providerName: string,
    tenantId?: string
  ): Promise<AiApiKey | null> {
    const provider = await prisma.client.aiProvider.findUnique({
      where: { name: providerName },
    });

    if (!provider) return null;

    const apiKey = await prisma.client.aiApiKey.findFirst({
      where: {
        providerId: provider.id,
        OR: [
          { userId, tenantId: null },
          { tenantId, userId: null },
        ],
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (apiKey && apiKey.usageLimit && apiKey.currentUsage >= apiKey.usageLimit) {
      await eventBus.emit(AiEvents.API_KEY_USAGE_WARNING, {
        userId,
        tenantId,
        apiKeyId: apiKey.id,
        providerId: provider.id,
        name: apiKey.name,
        timestamp: new Date(),
      });
      return null;
    }

    return apiKey;
  }

  // Usage tracking
  private async trackUsage(
    userId: string,
    providerId: string,
    model: string,
    operation: string,
    usage: { promptTokens: number; completionTokens: number },
    cost: number,
    latency: number,
    cached: boolean,
    tenantId?: string,
    error?: string
  ): Promise<void> {
    try {
      await prisma.client.aiUsageLog.create({
        data: {
          providerId,
          userId,
          tenantId,
          model,
          operation,
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          totalTokens: usage.promptTokens + usage.completionTokens,
          cost,
          latency,
          cached,
          error,
        },
      });

      // Track analytics
      await this.analyticsService.track({
        event: `ai_${operation}`,
        userId,
        tenantId,
        properties: {
          provider: providerId,
          model,
          tokens: usage.promptTokens + usage.completionTokens,
          cost,
          latency,
          cached,
          success: !error,
        },
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to track AI usage', error as Error);
    }
  }

  // Check quotas and limits
  private async checkQuotas(userId: string, operation: string): Promise<void> {
    // Check feature entitlement
    const hasAccess = await this.entitlementService.check(userId, 'ai_access');
    if (!hasAccess) {
      throw new ForbiddenException('AI access not available in your plan');
    }

    // Check usage limits
    const quota = await this.entitlementService.getEntitlement(userId, 'ai_tokens');
    if (quota && quota.limit > 0) {
      const usage = await this.getCurrentMonthUsage(userId);

      if (usage.totalTokens >= quota.limit) {
        await eventBus.emit(AiEvents.USAGE_LIMIT_EXCEEDED, {
          userId,
          currentUsage: usage.totalTokens,
          limit: quota.limit,
          percentage: 100,
          resource: 'tokens',
          timestamp: new Date(),
        });

        throw new ForbiddenException('AI token limit exceeded for this month');
      }

      // Warn at 80% usage
      const percentage = (usage.totalTokens / quota.limit) * 100;
      if (percentage >= 80 && percentage < 100) {
        await eventBus.emit(AiEvents.USAGE_LIMIT_WARNING, {
          userId,
          currentUsage: usage.totalTokens,
          limit: quota.limit,
          percentage,
          resource: 'tokens',
          timestamp: new Date(),
        });
      }
    }
  }

  // Main methods
  async complete(
    prompt: string,
    options: CompletionOptions & AiProviderOptions
  ): Promise<CompletionResult> {
    const { userId, tenantId, provider: providerName, cache = true, track = true } = options;
    const requestId = nanoid();
    const startTime = Date.now();

    try {
      // Check quotas
      await this.checkQuotas(userId, 'completion');

      // Check cache
      if (cache) {
        const cached = await this.cacheService.getCompletion(prompt, options, userId);
        if (cached) {
          logger.debug('AI completion cache hit', { requestId });
          return cached;
        }
      }

      // Get provider
      const provider = await this.getProvider(providerName, userId, tenantId);
      const providerInfo = await prisma.client.aiProvider.findUnique({
        where: { name: provider.getName() },
      });

      if (!providerInfo) {
        throw new Error('Provider info not found');
      }

      // Emit request event
      await eventBus.emit(AiEvents.COMPLETION_REQUESTED, {
        userId,
        tenantId,
        requestId,
        model: options.model || 'default',
        provider: provider.getName(),
        operation: 'completion',
        timestamp: new Date(),
      });

      // Make request
      const result = await provider.complete(prompt, options);
      const latency = Date.now() - startTime;

      // Calculate cost
      const modelInfo = ModelRegistry.get(result.model);
      const cost = modelInfo
        ? ModelRegistry.calculateCost(result.model, result.usage)
        : 0;

      // Track usage
      if (track) {
        await this.trackUsage(
          userId,
          providerInfo.id,
          result.model,
          'completion',
          result.usage,
          cost,
          latency,
          false,
          tenantId
        );
      }

      // Cache result
      if (cache && !result.cached) {
        await this.cacheService.setCompletion(prompt, options, result, userId);
      }

      // Emit completed event
      await eventBus.emit(AiEvents.COMPLETION_COMPLETED, {
        userId,
        tenantId,
        requestId,
        model: result.model,
        provider: provider.getName(),
        operation: 'completion',
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        totalTokens: result.usage.totalTokens,
        cost,
        latency,
        cached: false,
        timestamp: new Date(),
      });

      return result;
    } catch (error) {
      const latency = Date.now() - startTime;

      await eventBus.emit(AiEvents.COMPLETION_FAILED, {
        userId,
        tenantId,
        requestId,
        model: options.model || 'default',
        provider: providerName || this.defaultProvider,
        operation: 'completion',
        error: (error as Error).message,
        errorCode: (error as any).code || 'UNKNOWN',
        statusCode: (error as any).statusCode,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  async chat(
    messages: ChatMessage[],
    options: ChatOptions & AiProviderOptions
  ): Promise<ChatResult> {
    const { userId, tenantId, provider: providerName, cache = true, track = true } = options;
    const requestId = nanoid();
    const startTime = Date.now();

    try {
      // Check quotas
      await this.checkQuotas(userId, 'chat');

      // Check cache
      if (cache) {
        const cached = await this.cacheService.getChat(messages, options, userId);
        if (cached) {
          logger.debug('AI chat cache hit', { requestId });
          return cached;
        }
      }

      // Get provider
      const provider = await this.getProvider(providerName, userId, tenantId);
      const providerInfo = await prisma.client.aiProvider.findUnique({
        where: { name: provider.getName() },
      });

      if (!providerInfo) {
        throw new Error('Provider info not found');
      }

      // Emit request event
      await eventBus.emit(AiEvents.CHAT_REQUESTED, {
        userId,
        tenantId,
        requestId,
        model: options.model || 'default',
        provider: provider.getName(),
        operation: 'chat',
        timestamp: new Date(),
      });

      // Make request
      const result = await provider.chat(messages, options);
      const latency = Date.now() - startTime;

      // Calculate cost
      const modelInfo = ModelRegistry.get(result.model);
      const cost = modelInfo
        ? ModelRegistry.calculateCost(result.model, result.usage)
        : 0;

      // Track usage
      if (track) {
        await this.trackUsage(
          userId,
          providerInfo.id,
          result.model,
          'chat',
          result.usage,
          cost,
          latency,
          false,
          tenantId
        );
      }

      // Cache result
      if (cache && !result.cached) {
        await this.cacheService.setChat(messages, options, result, userId);
      }

      // Emit completed event
      await eventBus.emit(AiEvents.CHAT_COMPLETED, {
        userId,
        tenantId,
        requestId,
        model: result.model,
        provider: provider.getName(),
        operation: 'chat',
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        totalTokens: result.usage.totalTokens,
        cost,
        latency,
        cached: false,
        timestamp: new Date(),
      });

      return result;
    } catch (error) {
      await eventBus.emit(AiEvents.CHAT_FAILED, {
        userId,
        tenantId,
        requestId,
        model: options.model || 'default',
        provider: providerName || this.defaultProvider,
        operation: 'chat',
        error: (error as Error).message,
        errorCode: (error as any).code || 'UNKNOWN',
        statusCode: (error as any).statusCode,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  async embed(
    text: string | string[],
    options: EmbeddingOptions & AiProviderOptions
  ): Promise<EmbeddingResult | EmbeddingResult[]> {
    const { userId, tenantId, provider: providerName, cache = true, track = true } = options;
    const requestId = nanoid();
    const startTime = Date.now();

    try {
      // Check quotas
      await this.checkQuotas(userId, 'embedding');

      // For single text, check cache
      if (cache && typeof text === 'string') {
        const cached = await this.cacheService.getEmbedding(text, options, userId);
        if (cached) {
          logger.debug('AI embedding cache hit', { requestId });
          return cached;
        }
      }

      // Get provider
      const provider = await this.getProvider(providerName, userId, tenantId);
      const providerInfo = await prisma.client.aiProvider.findUnique({
        where: { name: provider.getName() },
      });

      if (!providerInfo) {
        throw new Error('Provider info not found');
      }

      // Make request
      const result = await provider.embed(text, options);
      const latency = Date.now() - startTime;

      // Track usage
      if (track) {
        const singleResult = Array.isArray(result) ? result[0] : result;
        const totalTokens = Array.isArray(result)
          ? result.reduce((sum, r) => sum + r.usage.totalTokens, 0)
          : result.usage.totalTokens;

        const modelInfo = ModelRegistry.get(singleResult.model);
        const cost = modelInfo
          ? ModelRegistry.calculateCost(singleResult.model, {
              promptTokens: totalTokens,
              completionTokens: 0,
            })
          : 0;

        await this.trackUsage(
          userId,
          providerInfo.id,
          singleResult.model,
          'embedding',
          { promptTokens: totalTokens, completionTokens: 0 },
          cost,
          latency,
          false,
          tenantId
        );
      }

      // Cache single result
      if (cache && typeof text === 'string' && !Array.isArray(result)) {
        await this.cacheService.setEmbedding(text, options, result, userId);
      }

      return result;
    } catch (error) {
      await eventBus.emit(AiEvents.EMBEDDING_FAILED, {
        userId,
        tenantId,
        requestId,
        model: options.model || 'default',
        provider: providerName || this.defaultProvider,
        operation: 'embedding',
        error: (error as Error).message,
        errorCode: (error as any).code || 'UNKNOWN',
        statusCode: (error as any).statusCode,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  async generateImage(
    options: ImageGenerationOptions & AiProviderOptions
  ): Promise<ImageResult> {
    const { userId, tenantId, provider: providerName, cache = true, track = true } = options;
    const requestId = nanoid();
    const startTime = Date.now();

    try {
      // Check quotas
      await this.checkQuotas(userId, 'image');

      // Check cache
      if (cache) {
        const cached = await this.cacheService.getImage(options, userId);
        if (cached) {
          logger.debug('AI image cache hit', { requestId });
          return cached;
        }
      }

      // Get provider
      const provider = await this.getProvider(providerName, userId, tenantId);
      const providerInfo = await prisma.client.aiProvider.findUnique({
        where: { name: provider.getName() },
      });

      if (!providerInfo) {
        throw new Error('Provider info not found');
      }

      // Make request
      const result = await provider.generateImage(options);
      const latency = Date.now() - startTime;

      // Calculate cost (image generation typically charged per image)
      const modelInfo = ModelRegistry.get(options.model || 'dall-e-3');
      const imageCount = options.n || 1;
      const cost = modelInfo
        ? (modelInfo.pricing.promptPricePerMillion / 1000) * imageCount // Cost per image
        : 0;

      // Track usage
      if (track) {
        await this.trackUsage(
          userId,
          providerInfo.id,
          options.model || 'dall-e-3',
          'image',
          { promptTokens: imageCount, completionTokens: 0 },
          cost,
          latency,
          false,
          tenantId
        );
      }

      // Cache result
      if (cache) {
        await this.cacheService.setImage(options, result, userId);
      }

      return result;
    } catch (error) {
      await eventBus.emit(AiEvents.IMAGE_FAILED, {
        userId,
        tenantId,
        requestId,
        model: options.model || 'default',
        provider: providerName || this.defaultProvider,
        operation: 'image',
        error: (error as Error).message,
        errorCode: (error as any).code || 'UNKNOWN',
        statusCode: (error as any).statusCode,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    options: AudioTranscriptionOptions & AiProviderOptions
  ): Promise<AudioResult> {
    const { userId, tenantId, provider: providerName, track = true } = options;
    const requestId = nanoid();
    const startTime = Date.now();

    try {
      // Check quotas
      await this.checkQuotas(userId, 'audio');

      // Get provider
      const provider = await this.getProvider(providerName, userId, tenantId);
      const providerInfo = await prisma.client.aiProvider.findUnique({
        where: { name: provider.getName() },
      });

      if (!providerInfo) {
        throw new Error('Provider info not found');
      }

      // Make request
      const result = await provider.transcribeAudio(audioBuffer, options);
      const latency = Date.now() - startTime;

      // Calculate cost (audio typically charged per minute)
      const modelInfo = ModelRegistry.get(options.model || 'whisper-1');
      const minutes = Math.ceil((result.duration || 60) / 60);
      const cost = modelInfo
        ? (modelInfo.pricing.promptPricePerMillion / 1000) * minutes
        : 0;

      // Track usage
      if (track) {
        await this.trackUsage(
          userId,
          providerInfo.id,
          result.model,
          'audio',
          { promptTokens: minutes, completionTokens: 0 },
          cost,
          latency,
          false,
          tenantId
        );
      }

      return result;
    } catch (error) {
      await eventBus.emit(AiEvents.AUDIO_FAILED, {
        userId,
        tenantId,
        requestId,
        model: options.model || 'default',
        provider: providerName || this.defaultProvider,
        operation: 'audio',
        error: (error as Error).message,
        errorCode: (error as any).code || 'UNKNOWN',
        statusCode: (error as any).statusCode,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  // Template management
  async createTemplate(
    userId: string,
    data: {
      name: string;
      description?: string;
      category?: string;
      prompt: string;
      variables?: Record<string, string>;
      isPublic?: boolean;
    },
    tenantId?: string
  ): Promise<AiPromptTemplate> {
    const template = await prisma.client.aiPromptTemplate.create({
      data: {
        ...data,
        userId,
        tenantId,
      },
    });

    await eventBus.emit(AiEvents.TEMPLATE_CREATED, {
      userId,
      tenantId,
      templateId: template.id,
      name: template.name,
      category: template.category,
      isPublic: template.isPublic,
      timestamp: new Date(),
    });

    return template;
  }

  async getTemplates(
    userId: string,
    filters?: {
      category?: string;
      isPublic?: boolean;
      search?: string;
    },
    tenantId?: string
  ): Promise<AiPromptTemplate[]> {
    const where: any = {
      OR: [
        { userId, tenantId },
        { isPublic: true },
      ],
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.client.aiPromptTemplate.findMany({
      where,
      orderBy: [
        { usageCount: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async useTemplate(
    templateId: string,
    variables: Record<string, string>,
    userId: string
  ): Promise<string> {
    const template = await prisma.client.aiPromptTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check access
    if (!template.isPublic && template.userId !== userId) {
      throw new ForbiddenException('Access denied to this template');
    }

    // Replace variables
    let prompt = template.prompt;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    // Update usage count
    await prisma.client.aiPromptTemplate.update({
      where: { id: templateId },
      data: { usageCount: { increment: 1 } },
    });

    await eventBus.emit(AiEvents.TEMPLATE_USED, {
      userId,
      templateId,
      name: template.name,
      category: template.category,
      isPublic: template.isPublic,
      timestamp: new Date(),
    });

    return prompt;
  }

  // Conversation management
  async createConversation(
    userId: string,
    data: {
      title?: string;
      model: string;
      provider: string;
      messages: ChatMessage[];
      metadata?: any;
    },
    tenantId?: string
  ): Promise<AiConversation> {
    // Create conversation with explicit type casting to avoid TypeScript errors
    const conversationData = {
      userId,
      tenantId: tenantId || undefined,
      title: data.title,
      model: data.model,
      provider: data.provider,
      messages: data.messages,
      metadata: data.metadata
    };

    // Use type assertion to bypass TypeScript's type checking for Prisma
    const conversation = await prisma.client.aiConversation.create({
      data: conversationData as any,
    });

    await eventBus.emit(AiEvents.CONVERSATION_CREATED, {
      userId,
      tenantId,
      conversationId: conversation.id,
      title: conversation.title,
      model: conversation.model,
      provider: conversation.provider,
      messageCount: (conversation.messages as any[]).length,
      timestamp: new Date(),
    });

    return conversation;
  }

  async updateConversation(
    conversationId: string,
    messages: ChatMessage[],
    userId: string
  ): Promise<AiConversation> {
    const conversation = await prisma.client.aiConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    const updated = await prisma.client.aiConversation.update({
      where: { id: conversationId },
      data: {
        messages: messages as any,
        updatedAt: new Date(),
      },
    });

    await eventBus.emit(AiEvents.CONVERSATION_UPDATED, {
      userId,
      conversationId,
      title: updated.title,
      model: updated.model,
      provider: updated.provider,
      messageCount: messages.length,
      timestamp: new Date(),
    });

    return updated;
  }

  // Usage statistics
  async getCurrentMonthUsage(userId: string, tenantId?: string): Promise<{
    totalTokens: number;
    totalCost: number;
    byModel: Record<string, { tokens: number; cost: number }>;
  }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const logs = await prisma.client.aiUsageLog.findMany({
      where: {
        userId,
        tenantId,
        createdAt: { gte: startOfMonth },
      },
    });

    const result = {
      totalTokens: 0,
      totalCost: 0,
      byModel: {} as Record<string, { tokens: number; cost: number }>,
    };

    for (const log of logs) {
      result.totalTokens += log.totalTokens;
      result.totalCost += log.cost;

      if (!result.byModel[log.model]) {
        result.byModel[log.model] = { tokens: 0, cost: 0 };
      }
      result.byModel[log.model].tokens += log.totalTokens;
      result.byModel[log.model].cost += log.cost;
    }

    return result;
  }

  async getUsageStats(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    tenantId?: string
  ): Promise<any> {
    const where: any = { userId, tenantId };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const logs = await prisma.client.aiUsageLog.findMany({ where });

    // Aggregate statistics
    const stats = {
      totalTokens: 0,
      totalCost: 0,
      totalRequests: logs.length,
      averageLatency: 0,
      cacheHitRate: 0,
      byModel: {} as Record<string, any>,
      byProvider: {} as Record<string, any>,
      byOperation: {} as Record<string, any>,
    };

    let totalLatency = 0;
    let cachedCount = 0;

    for (const log of logs) {
      stats.totalTokens += log.totalTokens;
      stats.totalCost += log.cost;
      totalLatency += log.latency;
      if (log.cached) cachedCount++;

      // By model
      if (!stats.byModel[log.model]) {
        stats.byModel[log.model] = { tokens: 0, cost: 0, requests: 0 };
      }
      stats.byModel[log.model].tokens += log.totalTokens;
      stats.byModel[log.model].cost += log.cost;
      stats.byModel[log.model].requests++;

      // By operation
      if (!stats.byOperation[log.operation]) {
        stats.byOperation[log.operation] = { tokens: 0, cost: 0, requests: 0 };
      }
      stats.byOperation[log.operation].tokens += log.totalTokens;
      stats.byOperation[log.operation].cost += log.cost;
      stats.byOperation[log.operation].requests++;
    }

    stats.averageLatency = logs.length > 0 ? Math.round(totalLatency / logs.length) : 0;
    stats.cacheHitRate = logs.length > 0 ? (cachedCount / logs.length) * 100 : 0;

    return stats;
  }

  // Model information
  async getAvailableModels(capabilities?: any): Promise<any[]> {
    return ModelRegistry.getAvailable(capabilities);
  }

  async getProviders(): Promise<any[]> {
    return prisma.client.aiProvider.findMany({
      where: { enabled: true },
      select: {
        id: true,
        name: true,
        displayName: true,
      },
    });
  }
}
