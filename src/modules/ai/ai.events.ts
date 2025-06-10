export const AiEvents = {
  // Request events
  COMPLETION_REQUESTED: 'ai.completion.requested',
  COMPLETION_COMPLETED: 'ai.completion.completed',
  COMPLETION_FAILED: 'ai.completion.failed',

  CHAT_REQUESTED: 'ai.chat.requested',
  CHAT_COMPLETED: 'ai.chat.completed',
  CHAT_FAILED: 'ai.chat.failed',

  EMBEDDING_REQUESTED: 'ai.embedding.requested',
  EMBEDDING_COMPLETED: 'ai.embedding.completed',
  EMBEDDING_FAILED: 'ai.embedding.failed',

  IMAGE_REQUESTED: 'ai.image.requested',
  IMAGE_COMPLETED: 'ai.image.completed',
  IMAGE_FAILED: 'ai.image.failed',

  AUDIO_REQUESTED: 'ai.audio.requested',
  AUDIO_COMPLETED: 'ai.audio.completed',
  AUDIO_FAILED: 'ai.audio.failed',

  // Cache events
  CACHE_HIT: 'ai.cache.hit',
  CACHE_MISS: 'ai.cache.miss',
  CACHE_SET: 'ai.cache.set',

  // Usage events
  USAGE_LIMIT_WARNING: 'ai.usage.limit_warning',
  USAGE_LIMIT_EXCEEDED: 'ai.usage.limit_exceeded',
  COST_THRESHOLD_EXCEEDED: 'ai.cost.threshold_exceeded',

  // Provider events
  PROVIDER_ERROR: 'ai.provider.error',
  PROVIDER_RATE_LIMITED: 'ai.provider.rate_limited',
  PROVIDER_UNAVAILABLE: 'ai.provider.unavailable',

  // API Key events
  API_KEY_CREATED: 'ai.api_key.created',
  API_KEY_EXPIRED: 'ai.api_key.expired',
  API_KEY_USAGE_WARNING: 'ai.api_key.usage_warning',

  // Template events
  TEMPLATE_CREATED: 'ai.template.created',
  TEMPLATE_USED: 'ai.template.used',
  TEMPLATE_UPDATED: 'ai.template.updated',
  TEMPLATE_DELETED: 'ai.template.deleted',

  // Conversation events
  CONVERSATION_CREATED: 'ai.conversation.created',
  CONVERSATION_UPDATED: 'ai.conversation.updated',
  CONVERSATION_DELETED: 'ai.conversation.deleted',
} as const;

export type AiEventName = typeof AiEvents[keyof typeof AiEvents];

export interface AiEventPayload {
  userId: string;
  tenantId?: string;
  timestamp: Date;
}

export interface AiRequestEventPayload extends AiEventPayload {
  requestId: string;
  model: string;
  provider: string;
  operation: 'completion' | 'chat' | 'embedding' | 'image' | 'audio';
  metadata?: Record<string, any>;
}

export interface AiCompletedEventPayload extends AiRequestEventPayload {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  latency: number;
  cached: boolean;
}

export interface AiFailedEventPayload extends AiRequestEventPayload {
  error: string;
  errorCode: string;
  statusCode?: number;
}

export interface AiCacheEventPayload extends AiEventPayload {
  cacheKey: string;
  operation: string;
  model: string;
  size?: number;
}

export interface AiUsageEventPayload extends AiEventPayload {
  currentUsage: number;
  limit: number;
  percentage: number;
  resource: 'tokens' | 'cost' | 'requests';
}

export interface AiProviderEventPayload extends AiEventPayload {
  provider: string;
  error?: string;
  retryAfter?: number;
}

export interface AiApiKeyEventPayload extends AiEventPayload {
  apiKeyId: string;
  providerId: string;
  name: string;
  expiresAt?: Date;
}

export interface AiTemplateEventPayload extends AiEventPayload {
  templateId: string;
  name: string;
  category?: string;
  isPublic: boolean;
}

export interface AiConversationEventPayload extends AiEventPayload {
  conversationId: string;
  title?: string;
  model: string;
  provider: string;
  messageCount: number;
}
