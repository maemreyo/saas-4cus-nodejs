// Updated: 2024-12-25 - AI module implementation - Using Ollama for local models

import { BaseAiProvider } from './base.provider';
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
  ProviderConfig,
  StreamingOptions,
} from '../models/model.types';
import { nanoid } from 'nanoid';
import { Ollama } from 'ollama';
import { logger } from '@shared/logger';

export class OllamaProvider extends BaseAiProvider {
  private client: Ollama;

  constructor(config: ProviderConfig) {
    super('ollama', config);
    this.client = new Ollama({
      host: config.baseUrl || 'http://localhost:11434',
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      const models = await this.client.list();
      return models.models.length > 0;
    } catch {
      return false;
    }
  }

  async complete(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    const model = options.model || 'llama2';

    try {
      const response = await this.client.generate({
        model,
        prompt: options.systemPrompt ? `${options.systemPrompt}\n\n${prompt}` : prompt,
        options: {
          temperature: options.temperature ?? 0.8,
          top_p: options.topP,
          stop: options.stop,
        },
      });

      // Estimate token usage
      const promptTokens = this.estimateTokens(prompt);
      const completionTokens = this.estimateTokens(response.response);

      return {
        id: nanoid(),
        text: response.response,
        model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        finishReason: response.done ? 'stop' : 'length',
        cached: false,
      };
    } catch (error: any) {
      throw this.createError(
        error.message || 'Ollama API error',
        'OLLAMA_ERROR',
        error.status || 500,
        error
      );
    }
  }

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResult> {
    const model = options.model || 'llama2';

    try {
      const response = await this.client.chat({
        model,
        messages: messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
        options: {
          temperature: options.temperature ?? 0.8,
          top_p: options.topP,
          stop: options.stop,
        },
      });

      // Estimate token usage
      const promptTokens = messages.reduce((sum, msg) =>
        sum + this.estimateTokens(msg.content), 0
      );
      const completionTokens = this.estimateTokens(response.message.content);

      return {
        id: nanoid(),
        text: response.message.content,
        message: {
          role: response.message.role as 'assistant',
          content: response.message.content,
        },
        model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        finishReason: response.done ? 'stop' : 'length',
        cached: false,
      };
    } catch (error: any) {
      throw this.createError(
        error.message || 'Ollama API error',
        'OLLAMA_ERROR',
        error.status || 500,
        error
      );
    }
  }

  async embed(
    text: string | string[],
    options: EmbeddingOptions = {}
  ): Promise<EmbeddingResult | EmbeddingResult[]> {
    const model = options.model || 'nomic-embed-text';
    const texts = Array.isArray(text) ? text : [text];

    try {
      const results: EmbeddingResult[] = [];

      for (const t of texts) {
        const response = await this.client.embeddings({
          model,
          prompt: t,
        });

        results.push({
          id: nanoid(),
          embedding: response.embedding,
          model,
          usage: {
            promptTokens: this.estimateTokens(t),
            completionTokens: 0,
            totalTokens: this.estimateTokens(t),
          },
          cached: false,
        });
      }

      return Array.isArray(text) ? results : results[0];
    } catch (error: any) {
      throw this.createError(
        error.message || 'Ollama embedding error',
        'OLLAMA_ERROR',
        error.status || 500,
        error
      );
    }
  }

  async generateImage(
    options: ImageGenerationOptions
  ): Promise<ImageResult> {
    // Ollama doesn't provide image generation
    throw this.createError(
      'Ollama does not support image generation',
      'NOT_SUPPORTED',
      501
    );
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    options?: AudioTranscriptionOptions
  ): Promise<AudioResult> {
    // Ollama doesn't provide audio transcription
    throw this.createError(
      'Ollama does not support audio transcription',
      'NOT_SUPPORTED',
      501
    );
  }

  async streamChat(
    messages: ChatMessage[],
    options: ChatOptions & StreamingOptions
  ): Promise<void> {
    const model = options.model || 'llama2';

    try {
      const stream = await this.client.chat({
        model,
        messages: messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
        options: {
          temperature: options.temperature ?? 0.8,
          top_p: options.topP,
          stop: options.stop,
        },
        stream: true,
      });

      let fullContent = '';

      for await (const chunk of stream) {
        if (chunk.message?.content && options.onToken) {
          fullContent += chunk.message.content;
          options.onToken(chunk.message.content);
        }
      }

      if (options.onComplete) {
        // Estimate token usage
        const promptTokens = messages.reduce((sum, msg) =>
          sum + this.estimateTokens(msg.content), 0
        );
        const completionTokens = this.estimateTokens(fullContent);

        options.onComplete({
          id: nanoid(),
          text: fullContent,
          model,
          usage: {
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
          },
          finishReason: 'stop',
          cached: false,
        });
      }
    } catch (error: any) {
      if (options.onError) {
        options.onError(
          this.createError(
            error.message || 'Ollama streaming error',
            'OLLAMA_ERROR',
            error.status || 500,
            error
          )
        );
      } else {
        throw error;
      }
    }
  }

  async streamComplete(
    prompt: string,
    options: CompletionOptions & StreamingOptions
  ): Promise<void> {
    const model = options.model || 'llama2';

    try {
      const stream = await this.client.generate({
        model,
        prompt: options.systemPrompt ? `${options.systemPrompt}\n\n${prompt}` : prompt,
        options: {
          temperature: options.temperature ?? 0.8,
          top_p: options.topP,
          stop: options.stop,
        },
        stream: true,
      });

      let fullContent = '';

      for await (const chunk of stream) {
        if (chunk.response && options.onToken) {
          fullContent += chunk.response;
          options.onToken(chunk.response);
        }
      }

      if (options.onComplete) {
        // Estimate token usage
        const promptTokens = this.estimateTokens(prompt);
        const completionTokens = this.estimateTokens(fullContent);

        options.onComplete({
          id: nanoid(),
          text: fullContent,
          model,
          usage: {
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
          },
          finishReason: 'stop',
          cached: false,
        });
      }
    } catch (error: any) {
      if (options.onError) {
        options.onError(
          this.createError(
            error.message || 'Ollama streaming error',
            'OLLAMA_ERROR',
            error.status || 500,
            error
          )
        );
      } else {
        throw error;
      }
    }
  }
}