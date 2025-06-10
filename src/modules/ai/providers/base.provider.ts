import {
  CompletionOptions,
  CompletionResult,
  ChatOptions,
  ChatResult,
  ChatMessage,
  EmbeddingOptions,
  EmbeddingResult,
  ImageGenerationOptions,
  ImageResult,
  AudioTranscriptionOptions,
  AudioResult,
  AiError,
  ProviderConfig,
  StreamingOptions,
} from '../models/model.types';
import { logger } from '@shared/logger';

export abstract class BaseAiProvider {
  protected name: string;
  protected config: ProviderConfig;

  constructor(name: string, config: ProviderConfig) {
    this.name = name;
    this.config = config;
  }

  abstract isAvailable(): Promise<boolean>;

  abstract complete(
    prompt: string,
    options?: CompletionOptions
  ): Promise<CompletionResult>;

  abstract chat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResult>;

  abstract embed(
    text: string | string[],
    options?: EmbeddingOptions
  ): Promise<EmbeddingResult | EmbeddingResult[]>;

  abstract generateImage(
    options: ImageGenerationOptions
  ): Promise<ImageResult>;

  abstract transcribeAudio(
    audioBuffer: Buffer,
    options?: AudioTranscriptionOptions
  ): Promise<AudioResult>;

  // Streaming support (optional)
  async streamComplete(
    prompt: string,
    options: CompletionOptions & StreamingOptions
  ): Promise<void> {
    throw new Error(`Streaming not supported by ${this.name} provider`);
  }

  async streamChat(
    messages: ChatMessage[],
    options: ChatOptions & StreamingOptions
  ): Promise<void> {
    throw new Error(`Streaming not supported by ${this.name} provider`);
  }

  // Helper methods
  protected createError(
    message: string,
    code: string,
    statusCode?: number,
    details?: any
  ): AiError {
    const error = new Error(message) as AiError;
    error.code = code;
    error.statusCode = statusCode;
    error.provider = this.name;
    error.details = details;
    return error;
  }

  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          const waitTime = delay * Math.pow(2, attempt); // Exponential backoff
          logger.warn(`${this.name} provider request failed, retrying in ${waitTime}ms`, {
            attempt: attempt + 1,
            error: lastError.message,
          });

          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw lastError || new Error('Operation failed');
  }

  protected validateApiKey(): void {
    if (!this.config.apiKey) {
      throw this.createError(
        `API key not configured for ${this.name} provider`,
        'API_KEY_MISSING',
        401
      );
    }
  }

  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };
  }

  protected async makeRequest<T>(
    url: string,
    options: RequestInit
  ): Promise<T> {
    const timeout = this.config.timeout || 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw this.createError(
          `${this.name} API error`,
          'API_ERROR',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw this.createError(
          `${this.name} request timeout`,
          'TIMEOUT',
          408
        );
      }

      throw error;
    }
  }

  // Cost calculation helper
  protected calculateCost(
    promptTokens: number,
    completionTokens: number,
    pricePerMillionPrompt: number,
    pricePerMillionCompletion: number
  ): number {
    const promptCost = (promptTokens / 1_000_000) * pricePerMillionPrompt;
    const completionCost = (completionTokens / 1_000_000) * pricePerMillionCompletion;
    return Math.round((promptCost + completionCost) * 100); // Return in cents
  }

  // Token estimation (rough estimate)
  protected estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  getName(): string {
    return this.name;
  }
}
