// Updated: 2024-12-25 - AI module implementation - Using official OpenAI package

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
import OpenAI from 'openai';
import { ChatCompletionMessageParam, ChatCompletionChunk } from 'openai/resources/chat/completions';
import { logger } from '@shared/logger';

export class OpenAIProvider extends BaseAiProvider {
  private client: OpenAI;

  constructor(config: ProviderConfig) {
    super('openai', config);
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      this.validateApiKey();
      const models = await this.client.models.list();
      return models.data.length > 0;
    } catch {
      return false;
    }
  }

  async complete(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    this.validateApiKey();

    const model = options.model || 'gpt-3.5-turbo';
    const messages: ChatCompletionMessageParam[] = [];

    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const chatResult = await this.chat(messages as ChatMessage[], options);

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

    const model = options.model || 'gpt-3.5-turbo';

    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages: messages as ChatCompletionMessageParam[],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stop: options.stop,
        user: options.user,
        stream: false,
        ...(options.functions && {
          functions: options.functions,
          function_call: options.functionCall,
        }),
      });

      const choice = completion.choices[0];

      return {
        id: completion.id,
        text: choice.message.content || '',
        message: {
          role: choice.message.role,
          content: choice.message.content || '',
          ...(choice.message.function_call && {
            functionCall: {
              name: choice.message.function_call.name,
              arguments: choice.message.function_call.arguments,
            },
          }),
        },
        model: completion.model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        finishReason: choice.finish_reason as any,
        cached: false,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw this.createError(
          error.message,
          error.code || 'OPENAI_ERROR',
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
    this.validateApiKey();

    const model = options.model || 'text-embedding-3-small';
    const input = Array.isArray(text) ? text : [text];

    try {
      const response = await this.client.embeddings.create({
        model,
        input,
        dimensions: options.dimensions,
        user: options.user,
      });

      const results: EmbeddingResult[] = response.data.map((item) => ({
        id: nanoid(),
        embedding: item.embedding,
        model: response.model,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: 0,
          totalTokens: response.usage.total_tokens,
        },
        cached: false,
      }));

      return Array.isArray(text) ? results : results[0];
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw this.createError(
          error.message,
          error.code || 'OPENAI_ERROR',
          error.status,
          error
        );
      }
      throw error;
    }
  }

  async generateImage(
    options: ImageGenerationOptions
  ): Promise<ImageResult> {
    this.validateApiKey();

    const model = options.model || 'dall-e-3';

    try {
      const response = await this.client.images.generate({
        model,
        prompt: options.prompt,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style,
        n: options.n || 1,
        response_format: options.responseFormat || 'url',
        user: options.user,
      });

      return {
        id: nanoid(),
        images: response.data.map((item) => ({
          url: item.url,
          b64Json: item.b64_json,
          revisedPrompt: item.revised_prompt,
        })),
        model,
        cached: false,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw this.createError(
          error.message,
          error.code || 'OPENAI_ERROR',
          error.status,
          error
        );
      }
      throw error;
    }
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    options: AudioTranscriptionOptions = {}
  ): Promise<AudioResult> {
    this.validateApiKey();

    const model = options.model || 'whisper-1';

    try {
      // Create a File object from Buffer
      const file = new File([audioBuffer], 'audio.mp3', { type: 'audio/mpeg' });

      const response = await this.client.audio.transcriptions.create({
        file,
        model,
        language: options.language,
        prompt: options.prompt,
        response_format: options.responseFormat || 'json',
        temperature: options.temperature,
      });

      return {
        id: nanoid(),
        text: response.text,
        model,
        duration: (response as any).duration,
        language: (response as any).language || options.language,
        cached: false,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw this.createError(
          error.message,
          error.code || 'OPENAI_ERROR',
          error.status,
          error
        );
      }
      throw error;
    }
  }

  async streamChat(
    messages: ChatMessage[],
    options: ChatOptions & StreamingOptions
  ): Promise<void> {
    this.validateApiKey();

    const model = options.model || 'gpt-3.5-turbo';

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: messages as ChatCompletionMessageParam[],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stop: options.stop,
        user: options.user,
        stream: true,
        ...(options.functions && {
          functions: options.functions,
          function_call: options.functionCall,
        }),
      });

      let fullContent = '';
      let usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;

        if (delta?.content && options.onToken) {
          fullContent += delta.content;
          options.onToken(delta.content);
        }

        // Final chunk usually contains usage info
        if (chunk.usage) {
          usage = {
            promptTokens: chunk.usage.prompt_tokens,
            completionTokens: chunk.usage.completion_tokens,
            totalTokens: chunk.usage.total_tokens,
          };
        }
      }

      if (options.onComplete) {
        // If usage not provided, estimate it
        if (usage.totalTokens === 0) {
          usage.promptTokens = messages.reduce((sum, msg) =>
            sum + this.estimateTokens(msg.content), 0
          );
          usage.completionTokens = this.estimateTokens(fullContent);
          usage.totalTokens = usage.promptTokens + usage.completionTokens;
        }

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
        if (error instanceof OpenAI.APIError) {
          options.onError(
            this.createError(
              error.message,
              error.code || 'OPENAI_ERROR',
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
