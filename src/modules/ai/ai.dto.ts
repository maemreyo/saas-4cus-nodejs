import { z } from 'zod';
import { ChatMessage } from './models/model.types';

// Completion DTOs
export const CompletionRequestSchema = z.object({
  prompt: z.string().min(1).max(100000),
  model: z.string().optional(),
  provider: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().max(4096).optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  stop: z.array(z.string()).max(4).optional(),
  systemPrompt: z.string().optional(),
  stream: z.boolean().optional(),
  cache: z.boolean().default(true),
  track: z.boolean().default(true),
});

export type CompletionRequestDto = z.infer<typeof CompletionRequestSchema>;

export const CompletionResponseSchema = z.object({
  id: z.string(),
  text: z.string(),
  model: z.string(),
  provider: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }),
  cost: z.number(),
  cached: z.boolean(),
  finishReason: z.enum(['stop', 'length', 'content_filter', 'function_call']).nullable(),
});

export type CompletionResponseDto = z.infer<typeof CompletionResponseSchema>;

// Chat DTOs
export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'function']),
  content: z.string(),
  name: z.string().optional(),
  functionCall: z.object({
    name: z.string(),
    arguments: z.string(),
  }).optional(),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  model: z.string().optional(),
  provider: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().max(4096).optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  stop: z.array(z.string()).max(4).optional(),
  functions: z.array(z.object({
    name: z.string(),
    description: z.string(),
    parameters: z.any(),
  })).optional(),
  functionCall: z.union([
    z.literal('auto'),
    z.literal('none'),
    z.object({ name: z.string() }),
  ]).optional(),
  stream: z.boolean().optional(),
  cache: z.boolean().default(true),
  track: z.boolean().default(true),
});

export type ChatRequestDto = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  id: z.string(),
  message: ChatMessageSchema,
  model: z.string(),
  provider: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }),
  cost: z.number(),
  cached: z.boolean(),
  finishReason: z.enum(['stop', 'length', 'content_filter', 'function_call']).nullable(),
});

export type ChatResponseDto = z.infer<typeof ChatResponseSchema>;

// Embedding DTOs
export const EmbeddingRequestSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]),
  model: z.string().optional(),
  provider: z.string().optional(),
  dimensions: z.number().int().positive().optional(),
  cache: z.boolean().default(true),
  track: z.boolean().default(true),
});

export type EmbeddingRequestDto = z.infer<typeof EmbeddingRequestSchema>;

export const EmbeddingResponseSchema = z.object({
  id: z.string(),
  embeddings: z.array(z.object({
    embedding: z.array(z.number()),
    index: z.number(),
  })),
  model: z.string(),
  provider: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    totalTokens: z.number(),
  }),
  cost: z.number(),
  cached: z.boolean(),
});

export type EmbeddingResponseDto = z.infer<typeof EmbeddingResponseSchema>;

// Image Generation DTOs
export const ImageGenerationRequestSchema = z.object({
  prompt: z.string().min(1).max(4000),
  model: z.string().optional(),
  provider: z.string().optional(),
  size: z.enum(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']).optional(),
  quality: z.enum(['standard', 'hd']).optional(),
  style: z.enum(['vivid', 'natural']).optional(),
  n: z.number().int().min(1).max(10).optional(),
  responseFormat: z.enum(['url', 'b64_json']).optional(),
  cache: z.boolean().default(true),
  track: z.boolean().default(true),
});

export type ImageGenerationRequestDto = z.infer<typeof ImageGenerationRequestSchema>;

export const ImageGenerationResponseSchema = z.object({
  id: z.string(),
  images: z.array(z.object({
    url: z.string().optional(),
    b64Json: z.string().optional(),
    revisedPrompt: z.string().optional(),
  })),
  model: z.string(),
  provider: z.string(),
  cost: z.number(),
  cached: z.boolean(),
});

export type ImageGenerationResponseDto = z.infer<typeof ImageGenerationResponseSchema>;

// Audio Transcription DTOs
export const AudioTranscriptionRequestSchema = z.object({
  model: z.string().optional(),
  provider: z.string().optional(),
  language: z.string().optional(),
  prompt: z.string().optional(),
  responseFormat: z.enum(['json', 'text', 'srt', 'vtt']).optional(),
  temperature: z.number().min(0).max(1).optional(),
  track: z.boolean().default(true),
});

export type AudioTranscriptionRequestDto = z.infer<typeof AudioTranscriptionRequestSchema>;

export const AudioTranscriptionResponseSchema = z.object({
  id: z.string(),
  text: z.string(),
  model: z.string(),
  provider: z.string(),
  duration: z.number().optional(),
  language: z.string().optional(),
  cost: z.number(),
});

export type AudioTranscriptionResponseDto = z.infer<typeof AudioTranscriptionResponseSchema>;

// Model Management DTOs
export const ModelResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  category: z.enum(['CHAT', 'COMPLETION', 'EMBEDDING', 'IMAGE', 'AUDIO', 'CODE']),
  contextWindow: z.number(),
  maxOutputTokens: z.number(),
  pricing: z.object({
    promptPricePerMillion: z.number(),
    completionPricePerMillion: z.number(),
    currency: z.string(),
  }),
  capabilities: z.object({
    chat: z.boolean(),
    completion: z.boolean(),
    streaming: z.boolean(),
    functionCalling: z.boolean(),
    vision: z.boolean(),
    audio: z.boolean(),
    maxTemperature: z.number(),
    defaultTemperature: z.number(),
  }),
  deprecated: z.boolean().optional(),
});

export type ModelResponseDto = z.infer<typeof ModelResponseSchema>;

// Usage DTOs
export const UsageStatsRequestSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month']).optional(),
});

export type UsageStatsRequestDto = z.infer<typeof UsageStatsRequestSchema>;

export const UsageStatsResponseSchema = z.object({
  totalTokens: z.number(),
  totalCost: z.number(),
  totalRequests: z.number(),
  averageLatency: z.number(),
  cacheHitRate: z.number(),
  byModel: z.record(z.object({
    tokens: z.number(),
    cost: z.number(),
    requests: z.number(),
  })),
  byProvider: z.record(z.object({
    tokens: z.number(),
    cost: z.number(),
    requests: z.number(),
  })),
  timeSeries: z.array(z.object({
    date: z.string(),
    tokens: z.number(),
    cost: z.number(),
    requests: z.number(),
  })),
});

export type UsageStatsResponseDto = z.infer<typeof UsageStatsResponseSchema>;

// Template DTOs
export const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().optional(),
  prompt: z.string().min(1).max(10000),
  variables: z.record(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

export type CreateTemplateDto = z.infer<typeof CreateTemplateSchema>;

export const UpdateTemplateSchema = CreateTemplateSchema.partial();

export type UpdateTemplateDto = z.infer<typeof UpdateTemplateSchema>;

export const TemplateResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  prompt: z.string(),
  variables: z.record(z.string()).nullable(),
  isPublic: z.boolean(),
  usageCount: z.number(),
  userId: z.string().nullable(),
  tenantId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TemplateResponseDto = z.infer<typeof TemplateResponseSchema>;

// Conversation DTOs
export const CreateConversationSchema = z.object({
  title: z.string().optional(),
  model: z.string(),
  provider: z.string(),
  messages: z.array(ChatMessageSchema),
  metadata: z.record(z.any()).optional(),
});

export type CreateConversationDto = z.infer<typeof CreateConversationSchema>;

export const ConversationResponseSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  model: z.string(),
  provider: z.string(),
  messages: z.array(ChatMessageSchema),
  metadata: z.record(z.any()).nullable(),
  userId: z.string(),
  tenantId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ConversationResponseDto = z.infer<typeof ConversationResponseSchema>;

// API Key DTOs
export const CreateApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  providerId: z.string(),
  apiKey: z.string().min(1),
  expiresAt: z.string().datetime().optional(),
  usageLimit: z.number().int().positive().optional(),
});

export type CreateApiKeyDto = z.infer<typeof CreateApiKeySchema>;

export const ApiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  providerId: z.string(),
  provider: z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
  }),
  lastUsedAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  usageLimit: z.number().nullable(),
  currentUsage: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ApiKeyResponseDto = z.infer<typeof ApiKeyResponseSchema>;
