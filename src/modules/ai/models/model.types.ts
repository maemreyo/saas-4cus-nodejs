export interface AiModel {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory;
  contextWindow: number;
  maxOutputTokens: number;
  pricing: ModelPricing;
  capabilities: ModelCapabilities;
  deprecated?: boolean;
  releaseDate?: Date;
}

export enum ModelCategory {
  CHAT = 'CHAT',
  COMPLETION = 'COMPLETION',
  EMBEDDING = 'EMBEDDING',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  CODE = 'CODE',
}

export interface ModelPricing {
  promptPricePerMillion: number; // in USD
  completionPricePerMillion: number; // in USD
  currency: string;
}

export interface ModelCapabilities {
  chat: boolean;
  completion: boolean;
  streaming: boolean;
  functionCalling: boolean;
  vision: boolean;
  audio: boolean;
  maxTemperature: number;
  defaultTemperature: number;
}

export interface CompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  systemPrompt?: string;
  stream?: boolean;
  user?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

export interface ChatOptions extends CompletionOptions {
  functions?: Array<{
    name: string;
    description: string;
    parameters: any;
  }>;
  functionCall?: 'auto' | 'none' | { name: string };
}

export interface EmbeddingOptions {
  model?: string;
  dimensions?: number;
  user?: string;
}

export interface ImageGenerationOptions {
  model?: string;
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
  responseFormat?: 'url' | 'b64_json';
  user?: string;
}

export interface AudioTranscriptionOptions {
  model?: string;
  language?: string;
  prompt?: string;
  responseFormat?: 'json' | 'text' | 'srt' | 'vtt';
  temperature?: number;
}

export interface CompletionResult {
  id: string;
  text: string;
  model: string;
  usage: TokenUsage;
  finishReason: 'stop' | 'length' | 'content_filter' | 'function_call' | null;
  cached?: boolean;
}

export interface ChatResult extends CompletionResult {
  message: ChatMessage;
}

export interface EmbeddingResult {
  id: string;
  embedding: number[];
  model: string;
  usage: TokenUsage;
  cached?: boolean;
}

export interface ImageResult {
  id: string;
  images: Array<{
    url?: string;
    b64Json?: string;
    revisedPrompt?: string;
  }>;
  model: string;
  cached?: boolean;
}

export interface AudioResult {
  id: string;
  text: string;
  model: string;
  duration?: number;
  language?: string;
  cached?: boolean;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AiError extends Error {
  code: string;
  statusCode?: number;
  provider: string;
  model?: string;
  details?: any;
}

export interface StreamingOptions {
  onToken?: (token: string) => void;
  onComplete?: (result: CompletionResult) => void;
  onError?: (error: AiError) => void;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  headers?: Record<string, string>;
}

export interface AiProviderOptions {
  userId: string;
  tenantId?: string;
  provider?: string;
  apiKeyId?: string;
  cache?: boolean;
  track?: boolean;
}
