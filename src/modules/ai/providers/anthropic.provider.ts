// Updated: 2024-12-25 - AI module implementation - Using official Anthropic SDK

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
import Anthropic from '@anthropic-ai/sdk';
import { MessageParam, ContentBlock } from '@anthropic-ai/sdk/resources/messages';
import { logger } from '@shared/logger';

export class AnthropicProvider extends BaseAiProvider {
  private client: Anthropic;

  constructor(config: ProviderConfig) {
    super('anthropic', config);
    this.client = new Anthropic({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      this.validateApiKey();
      // Anthropic doesn't have a models list endpoint, so we'll do a simple test
      return true;
    } catch {
      return false;
    }
  }

  async complete(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    this.validateApiKey();

    const messages: ChatMessage[] = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const chatResult = await this.chat(messages, options);

    return {
      id: chatResult.id,
      text: chatResult.message.content,
      model: chatResult.model,
      usage: chatResult.usage,
      finishReason: chatResult.finishReason,
      cached: false,
    };
  }

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResult> {
    this.validateApiKey();

    const model = options.model || 'claude-3-sonnet-20240229';

    try {
      // Convert messages to Anthropic format
      const anthropicMessages: MessageParam[] = [];
      let systemPrompt = '';

      for (const msg of messages) {
        if (msg.role === 'system') {
          systemPrompt = msg.content;
        } else if (msg.role === 'user' || msg.role === 'assistant') {
          anthropicMessages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          });
        }
      }

      const completion = await this.client.messages.create({
        model,
        messages: anthropicMessages,
        system: systemPrompt || undefined,
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature ?? 1.0,
        top_p: options.topP,
        stop_sequences: options.stop,
        stream: false,
      });

      // Extract text from content blocks
      let responseText = '';
      for (const block of completion.content) {
        if (block.type === 'text') {
          responseText += block.text;
        }
      }

      return {
        id: completion.id,
        text: responseText,
        message: {
          role: 'assistant',
          content: responseText,
        },
        model: completion.model,
        usage: {
          promptTokens: completion.usage.input_tokens,
          completionTokens: completion.usage.output_tokens,
          totalTokens: completion.usage.input_tokens + completion.usage.output_tokens,
        },
        finishReason: completion.stop_reason as any,
        cached: false,
      };
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw this.createError(
          error.message,
          (error as any).type || 'ANTHROPIC_ERROR',
          error.status,
          error
        );
      }
      throw error;
    }
  }

  async embed(
    text: string | string[],
    options: EmbeddingOptions = {}
  ): Promise<EmbeddingResult | EmbeddingResult[]> {
    // Anthropic doesn't provide embedding models
    throw this.createError(
      'Anthropic does not support embedding generation',
      'NOT_SUPPORTED',
      501
    );
  }

  async generateImage(
    options: ImageGenerationOptions
  ): Promise<ImageResult> {
    // Anthropic doesn't provide image generation
    throw this.createError(
      'Anthropic does not support image generation',
      'NOT_SUPPORTED',
      501
    );
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    options?: AudioTranscriptionOptions
  ): Promise<AudioResult> {
    // Anthropic doesn't provide audio transcription
    throw this.createError(
      'Anthropic does not support audio transcription',
      'NOT_SUPPORTED',
      501
    );
  }

  async streamChat(
    messages: ChatMessage[],
    options: ChatOptions & StreamingOptions
  ): Promise<void> {
    this.validateApiKey();

    const model = options.model || 'claude-3-sonnet-20240229';

    try {
      // Convert messages to Anthropic format
      const anthropicMessages: MessageParam[] = [];
      let systemPrompt = '';

      for (const msg of messages) {
        if (msg.role === 'system') {
          systemPrompt = msg.content;
        } else if (msg.role === 'user' || msg.role === 'assistant') {
          anthropicMessages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          });
        }
      }

      const stream = await this.client.messages.create({
        model,
        messages: anthropicMessages,
        system: systemPrompt || undefined,
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature ?? 1.0,
        top_p: options.topP,
        stop_sequences: options.stop,
        stream: true,
      });

      let fullContent = '';
      let usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const text = chunk.delta.text;
          if (text && options.onToken) {
            fullContent += text;
            options.onToken(text);
          }
        } else if (chunk.type === 'message_stop') {
          // Get final usage info from message_stop event
          // Handle potential structure changes in the Anthropic SDK
          const messageData = (chunk as any).message;
          if (messageData && messageData.usage) {
            usage = {
              promptTokens: messageData.usage.input_tokens,
              completionTokens: messageData.usage.output_tokens,
              totalTokens: messageData.usage.input_tokens + messageData.usage.output_tokens,
            };
          }
        }
      }

      if (options.onComplete) {
        options.onComplete({
          id: nanoid(),
          text: fullContent,
          model,
          usage,
          finishReason: 'stop',
          cached: false,
        });
      }
    } catch (error) {
      if (options.onError) {
        if (error instanceof Anthropic.APIError) {
          options.onError(
            this.createError(
              error.message,
              (error as any).type || 'ANTHROPIC_ERROR',
              error.status,
              error
            )
          );
        } else {
          options.onError(error as any);
        }
      } else {
        throw error;
      }
    }
  }

  async streamComplete(
    prompt: string,
    options: CompletionOptions & StreamingOptions
  ): Promise<void> {
    const messages: ChatMessage[] = [];

    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    await this.streamChat(messages, options);
  }
}
