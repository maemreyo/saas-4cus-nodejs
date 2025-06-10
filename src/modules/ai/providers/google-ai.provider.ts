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
import { GoogleGenerativeAI, GenerativeModel, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { logger } from '@shared/logger';

export class GoogleAIProvider extends BaseAiProvider {
  private genAI: GoogleGenerativeAI;

  constructor(config: ProviderConfig) {
    super('google', config);
    if (!config.apiKey) {
      throw new Error('Google AI API key is required');
    }
    this.genAI = new GoogleGenerativeAI(config.apiKey);
  }

  async isAvailable(): Promise<boolean> {
    try {
      this.validateApiKey();
      // Test with a simple model initialization
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
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
      messages.push({ role: 'user', content: options.systemPrompt + '\n\n' + prompt });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

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

    const modelName = options.model || 'gemini-pro';

    try {
      const model = this.genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: options.temperature ?? 0.9,
          topP: options.topP ?? 1,
          maxOutputTokens: options.maxTokens || 2048,
          stopSequences: options.stop,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      // Convert messages to Google AI format
      const chat = model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();

      // Estimate token usage (Google AI doesn't provide exact counts)
      const promptTokens = messages.reduce((sum, msg) =>
        sum + this.estimateTokens(msg.content), 0
      );
      const completionTokens = this.estimateTokens(text);

      return {
        id: nanoid(),
        text,
        message: {
          role: 'assistant',
          content: text,
        },
        model: modelName,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        finishReason: 'stop',
        cached: false,
      };
    } catch (error: any) {
      throw this.createError(
        error.message || 'Google AI API error',
        'GOOGLE_AI_ERROR',
        error.status || 500,
        error
      );
    }
  }

  async embed(
    text: string | string[],
    options: EmbeddingOptions = {}
  ): Promise<EmbeddingResult | EmbeddingResult[]> {
    this.validateApiKey();

    const model = options.model || 'embedding-001';
    const texts = Array.isArray(text) ? text : [text];

    try {
      const embeddingModel = this.genAI.getGenerativeModel({ model });
      const results: EmbeddingResult[] = [];

      for (const t of texts) {
        const result = await embeddingModel.embedContent(t);
        results.push({
          id: nanoid(),
          embedding: result.embedding.values,
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
        error.message || 'Google AI embedding error',
        'GOOGLE_AI_ERROR',
        error.status || 500,
        error
      );
    }
  }

  async generateImage(
    options: ImageGenerationOptions
  ): Promise<ImageResult> {
    // Google AI doesn't provide direct image generation
    throw this.createError(
      'Google AI does not support image generation through this API',
      'NOT_SUPPORTED',
      501
    );
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    options?: AudioTranscriptionOptions
  ): Promise<AudioResult> {
    // Google AI doesn't provide audio transcription through Generative AI API
    throw this.createError(
      'Google AI does not support audio transcription through this API',
      'NOT_SUPPORTED',
      501
    );
  }

  async streamChat(
    messages: ChatMessage[],
    options: ChatOptions & StreamingOptions
  ): Promise<void> {
    this.validateApiKey();

    const modelName = options.model || 'gemini-pro';

    try {
      const model = this.genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: options.temperature ?? 0.9,
          topP: options.topP ?? 1,
          maxOutputTokens: options.maxTokens || 2048,
          stopSequences: options.stop,
        },
      });

      // Convert messages to Google AI format
      const chat = model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessageStream(lastMessage.content);

      let fullContent = '';

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text && options.onToken) {
          fullContent += text;
          options.onToken(text);
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
          model: modelName,
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
            error.message || 'Google AI streaming error',
            'GOOGLE_AI_ERROR',
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
    const messages: ChatMessage[] = [];

    if (options.systemPrompt) {
      messages.push({ role: 'user', content: options.systemPrompt + '\n\n' + prompt });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    await this.streamChat(messages, options);
  }
}
