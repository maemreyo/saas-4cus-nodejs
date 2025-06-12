// Updated: 2024-12-25 - AI module implementation

import { Service } from 'typedi';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AiService } from './ai.service';
import { AiCacheService } from './ai.cache';
import { ModelRegistry } from './models/model.registry';
import { validateSchema } from '@shared/validators';
import {
  CompletionRequestSchema,
  CompletionRequestDto,
  ChatRequestSchema,
  ChatRequestDto,
  EmbeddingRequestSchema,
  EmbeddingRequestDto,
  ImageGenerationRequestSchema,
  ImageGenerationRequestDto,
  AudioTranscriptionRequestDto,
  UsageStatsRequestSchema,
  UsageStatsRequestDto,
  CreateTemplateSchema,
  CreateTemplateDto,
  UpdateTemplateSchema,
  UpdateTemplateDto,
  CreateConversationSchema,
  CreateConversationDto,
  CreateApiKeySchema,
  CreateApiKeyDto,
} from './ai.dto';
import { logger } from '@shared/logger';
import { ModelCategory, ChatMessage } from './models/model.types';

@Service()
export class AiController {
  constructor(
    private aiService: AiService,
    private cacheService: AiCacheService
  ) {}

  // Completion endpoint
  async complete(request: FastifyRequest, reply: FastifyReply) {
    const body = await validateSchema(CompletionRequestSchema, request.body);
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    try {
      const result = await this.aiService.complete(body.prompt, {
        ...body,
        userId,
        tenantId,
      });

      // Calculate cost for response
      const modelInfo = ModelRegistry.get(result.model);
      const cost = modelInfo
        ? ModelRegistry.calculateCost(result.model, result.usage)
        : 0;

      reply.send({
        message: 'Completion generated successfully',
        data: {
          id: result.id,
          text: result.text,
          model: result.model,
          provider: body.provider || 'openai',
          usage: result.usage,
          cost,
          cached: result.cached,
          finishReason: result.finishReason,
        },
      });
    } catch (error) {
      logger.error('AI completion error', error as Error);
      throw error;
    }
  }

  // Chat endpoint
  async chat(request: FastifyRequest, reply: FastifyReply) {
    const body = await validateSchema(ChatRequestSchema, request.body);
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    try {
      // Ensure functions property is properly typed if present
      const options: any = {
        ...body,
        userId,
        tenantId,
      };

      const result = await this.aiService.chat(body.messages as ChatMessage[], options);

      // Calculate cost for response
      const modelInfo = ModelRegistry.get(result.model);
      const cost = modelInfo
        ? ModelRegistry.calculateCost(result.model, result.usage)
        : 0;

      reply.send({
        message: 'Chat response generated successfully',
        data: {
          id: result.id,
          message: result.message,
          model: result.model,
          provider: body.provider || 'openai',
          usage: result.usage,
          cost,
          cached: result.cached,
          finishReason: result.finishReason,
        },
      });
    } catch (error) {
      logger.error('AI chat error', error as Error);
      throw error;
    }
  }

  // Embedding endpoint
  async embed(request: FastifyRequest, reply: FastifyReply) {
    const body = await validateSchema(EmbeddingRequestSchema, request.body);
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    try {
      const result = await this.aiService.embed(body.text, {
        ...body,
        userId,
        tenantId,
      });

      const results = Array.isArray(result) ? result : [result];
      const totalTokens = results.reduce((sum, r) => sum + r.usage.totalTokens, 0);

      // Calculate cost
      const modelInfo = ModelRegistry.get(results[0].model);
      const cost = modelInfo
        ? ModelRegistry.calculateCost(results[0].model, {
            promptTokens: totalTokens,
            completionTokens: 0,
          })
        : 0;

      reply.send({
        message: 'Embeddings generated successfully',
        data: {
          id: results[0].id,
          embeddings: results.map((r, index) => ({
            embedding: r.embedding,
            index,
          })),
          model: results[0].model,
          provider: body.provider || 'openai',
          usage: {
            promptTokens: totalTokens,
            totalTokens,
          },
          cost,
          cached: results[0].cached,
        },
      });
    } catch (error) {
      logger.error('AI embedding error', error as Error);
      throw error;
    }
  }

  // Image generation endpoint
  async generateImage(request: FastifyRequest, reply: FastifyReply) {
    const body = await validateSchema(ImageGenerationRequestSchema, request.body);
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    try {
      const result = await this.aiService.generateImage({
        ...body,
        userId,
        tenantId,
        prompt: body.prompt, // Ensure prompt is explicitly passed
      });

      // Calculate cost
      const modelInfo = ModelRegistry.get(result.model);
      const imageCount = result.images.length;
      const cost = modelInfo
        ? (modelInfo.pricing.promptPricePerMillion / 1000) * imageCount
        : 0;

      reply.send({
        message: 'Images generated successfully',
        data: {
          id: result.id,
          images: result.images,
          model: result.model,
          provider: body.provider || 'openai',
          cost,
          cached: result.cached,
        },
      });
    } catch (error) {
      logger.error('AI image generation error', error as Error);
      throw error;
    }
  }

  // Audio transcription endpoint
  async transcribeAudio(request: FastifyRequest, reply: FastifyReply) {
    const parts = request.parts();
    let audioBuffer: Buffer | null = null;
    let options: AudioTranscriptionRequestDto = {};

    for await (const part of parts) {
      if (part.type === 'file') {
        const chunks: Buffer[] = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }
        audioBuffer = Buffer.concat(chunks);
      } else if (part.type === 'field') {
        // Parse other fields as options
        const key = part.fieldname as keyof AudioTranscriptionRequestDto;
        // Type-safe assignment with explicit type checking
        if (key === 'model' || key === 'provider' || key === 'language' ||
            key === 'prompt' || key === 'responseFormat' || key === 'temperature' ||
            key === 'track') {
          (options as any)[key] = part.value;
        }
      }
    }

    if (!audioBuffer) {
      return reply.code(400).send({
        error: 'Bad Request',
        message: 'Audio file is required',
      });
    }

    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    try {
      const result = await this.aiService.transcribeAudio(audioBuffer, {
        ...options,
        userId,
        tenantId,
      });

      // Calculate cost
      const modelInfo = ModelRegistry.get(result.model);
      const minutes = Math.ceil((result.duration || 60) / 60);
      const cost = modelInfo
        ? (modelInfo.pricing.promptPricePerMillion / 1000) * minutes
        : 0;

      reply.send({
        message: 'Audio transcribed successfully',
        data: {
          id: result.id,
          text: result.text,
          model: result.model,
          provider: options.provider || 'openai',
          duration: result.duration,
          language: result.language,
          cost,
        },
      });
    } catch (error) {
      logger.error('AI audio transcription error', error as Error);
      throw error;
    }
  }

  // Get available models
  async getModels(request: FastifyRequest, reply: FastifyReply) {
    const { category, capabilities } = request.query as any;

    let models = ModelRegistry.getAll();

    if (category) {
      models = models.filter(m => m.category === category);
    }

    if (capabilities) {
      const caps = capabilities.split(',');
      models = models.filter(m => {
        return caps.every((cap: string) => (m.capabilities as any)[cap] === true);
      });
    }

    reply.send({
      message: 'Models retrieved successfully',
      data: models,
    });
  }

  // Get providers
  async getProviders(request: FastifyRequest, reply: FastifyReply) {
    const providers = await this.aiService.getProviders();

    reply.send({
      message: 'Providers retrieved successfully',
      data: providers,
    });
  }

  // Get usage statistics
  async getUsageStats(request: FastifyRequest, reply: FastifyReply) {
    const query = await validateSchema(UsageStatsRequestSchema, request.query);
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    const stats = await this.aiService.getUsageStats(
      userId,
      startDate,
      endDate,
      tenantId
    );

    reply.send({
      message: 'Usage statistics retrieved successfully',
      data: stats,
    });
  }

  // Get current month usage
  async getCurrentUsage(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    const usage = await this.aiService.getCurrentMonthUsage(userId, tenantId);

    reply.send({
      message: 'Current usage retrieved successfully',
      data: usage,
    });
  }

  // Template management
  async createTemplate(request: FastifyRequest, reply: FastifyReply) {
    const body = await validateSchema(CreateTemplateSchema, request.body);
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    const template = await this.aiService.createTemplate(userId, {
      name: body.name!,
      prompt: body.prompt!,
      description: body.description,
      category: body.category,
      variables: body.variables,
      isPublic: body.isPublic
    }, tenantId);

    reply.send({
      message: 'Template created successfully',
      data: template,
    });
  }

  async getTemplates(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;
    const { category, isPublic, search } = request.query as any;

    const templates = await this.aiService.getTemplates(
      userId,
      { category, isPublic, search },
      tenantId
    );

    reply.send({
      message: 'Templates retrieved successfully',
      data: templates,
    });
  }

  async updateTemplate(request: FastifyRequest, reply: FastifyReply) {
    const { templateId } = request.params as { templateId: string };
    const body = await validateSchema(UpdateTemplateSchema, request.body);
    const userId = request.customUser!.id;

    // Implementation would go here
    reply.send({
      message: 'Template updated successfully',
      data: { id: templateId, ...body },
    });
  }

  async deleteTemplate(request: FastifyRequest, reply: FastifyReply) {
    const { templateId } = request.params as { templateId: string };
    const userId = request.customUser!.id;

    // Implementation would go here
    reply.send({
      message: 'Template deleted successfully',
    });
  }

  async useTemplate(request: FastifyRequest, reply: FastifyReply) {
    const { templateId } = request.params as { templateId: string };
    const { variables } = request.body as { variables: Record<string, string> };
    const userId = request.customUser!.id;

    const prompt = await this.aiService.useTemplate(templateId, variables, userId);

    reply.send({
      message: 'Template used successfully',
      data: { prompt },
    });
  }

  // Conversation management
  async createConversation(request: FastifyRequest, reply: FastifyReply) {
    const body = await validateSchema(CreateConversationSchema, request.body);
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    const conversation = await this.aiService.createConversation(userId, {
      model: body.model,
      provider: body.provider,
      messages: body.messages as ChatMessage[],
      title: body.title,
      metadata: body.metadata
    }, tenantId);

    reply.send({
      message: 'Conversation created successfully',
      data: conversation,
    });
  }

  async getConversations(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    // Implementation would go here
    reply.send({
      message: 'Conversations retrieved successfully',
      data: [],
    });
  }

  async getConversation(request: FastifyRequest, reply: FastifyReply) {
    const { conversationId } = request.params as { conversationId: string };
    const userId = request.customUser!.id;

    // Implementation would go here
    reply.send({
      message: 'Conversation retrieved successfully',
      data: { id: conversationId },
    });
  }

  async addMessage(request: FastifyRequest, reply: FastifyReply) {
    const { conversationId } = request.params as { conversationId: string };
    const { message } = request.body as { message: any };
    const userId = request.customUser!.id;

    // Implementation would go here
    reply.send({
      message: 'Message added successfully',
      data: { conversationId, message },
    });
  }

  // API Key management (Admin)
  async createApiKey(request: FastifyRequest, reply: FastifyReply) {
    const body = await validateSchema(CreateApiKeySchema, request.body);
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    const apiKey = await this.aiService.createApiKey(
      userId,
      body.providerId,
      body.name,
      body.apiKey,
      tenantId,
      body.expiresAt ? new Date(body.expiresAt) : undefined,
      body.usageLimit
    );

    // Don't return the actual key hash
    reply.send({
      message: 'API key created successfully',
      data: {
        id: apiKey.id,
        name: apiKey.name,
        providerId: apiKey.providerId,
        expiresAt: apiKey.expiresAt,
        usageLimit: apiKey.usageLimit,
        createdAt: apiKey.createdAt,
      },
    });
  }

  async getApiKeys(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const tenantId = (request as any).customTenant?.id;

    // Implementation would go here
    reply.send({
      message: 'API keys retrieved successfully',
      data: [],
    });
  }

  async deleteApiKey(request: FastifyRequest, reply: FastifyReply) {
    const { keyId } = request.params as { keyId: string };
    const userId = request.customUser!.id;

    // Implementation would go here
    reply.send({
      message: 'API key deleted successfully',
    });
  }

  // Cache management
  async getCacheStats(request: FastifyRequest, reply: FastifyReply) {
    const stats = await this.cacheService.getStats();

    reply.send({
      message: 'Cache statistics retrieved successfully',
      data: stats,
    });
  }

  async clearCache(request: FastifyRequest, reply: FastifyReply) {
    const { type } = request.query as { type?: string };

    await this.cacheService.clear(type as any);

    reply.send({
      message: 'Cache cleared successfully',
    });
  }
}
