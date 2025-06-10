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

export class MockProvider extends BaseAiProvider {
  private delay: number;
  private shouldFail: boolean;

  constructor(config: ProviderConfig) {
    super('mock', config);
    this.delay = config.timeout || 100;
    this.shouldFail = config.headers?.['X-Mock-Fail'] === 'true';
  }

  async isAvailable(): Promise<boolean> {
    await this.simulateDelay();
    return !this.shouldFail;
  }

  async complete(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    await this.simulateDelay();

    if (this.shouldFail) {
      throw this.createError('Mock provider error', 'MOCK_ERROR', 500);
    }

    const model = options.model || 'mock-model';
    const response = this.generateMockResponse(prompt, options);
    const usage = this.calculateMockUsage(prompt, response);

    return {
      id: nanoid(),
      text: response,
      model,
      usage,
      finishReason: 'stop',
      cached: false,
    };
  }

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResult> {
    await this.simulateDelay();

    if (this.shouldFail) {
      throw this.createError('Mock provider error', 'MOCK_ERROR', 500);
    }

    const model = options.model || 'mock-model';
    const lastMessage = messages[messages.length - 1];
    const response = this.generateMockResponse(lastMessage.content, options);
    const usage = this.calculateMockUsage(
      messages.map(m => m.content).join(' '),
      response
    );

    return {
      id: nanoid(),
      text: response,
      message: {
        role: 'assistant',
        content: response,
      },
      model,
      usage,
      finishReason: 'stop',
      cached: false,
    };
  }

  async embed(
    text: string | string[],
    options: EmbeddingOptions = {}
  ): Promise<EmbeddingResult | EmbeddingResult[]> {
    await this.simulateDelay();

    if (this.shouldFail) {
      throw this.createError('Mock provider error', 'MOCK_ERROR', 500);
    }

    const model = options.model || 'mock-embedding';
    const texts = Array.isArray(text) ? text : [text];

    const results: EmbeddingResult[] = texts.map(t => ({
      id: nanoid(),
      embedding: this.generateMockEmbedding(options.dimensions || 1536),
      model,
      usage: {
        promptTokens: this.estimateTokens(t),
        completionTokens: 0,
        totalTokens: this.estimateTokens(t),
      },
      cached: false,
    }));

    return Array.isArray(text) ? results : results[0];
  }

  async generateImage(
    options: ImageGenerationOptions
  ): Promise<ImageResult> {
    await this.simulateDelay();

    if (this.shouldFail) {
      throw this.createError('Mock provider error', 'MOCK_ERROR', 500);
    }

    const model = options.model || 'mock-image';
    const n = options.n || 1;

    const images = Array.from({ length: n }, () => ({
      url: `https://picsum.photos/seed/${nanoid()}/1024/1024`,
      revisedPrompt: `Enhanced: ${options.prompt}`,
    }));

    return {
      id: nanoid(),
      images,
      model,
      cached: false,
    };
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    options: AudioTranscriptionOptions = {}
  ): Promise<AudioResult> {
    await this.simulateDelay();

    if (this.shouldFail) {
      throw this.createError('Mock provider error', 'MOCK_ERROR', 500);
    }

    const model = options.model || 'mock-audio';
    const mockTranscript = 'This is a mock transcription of the audio file.';

    return {
      id: nanoid(),
      text: mockTranscript,
      model,
      duration: Math.random() * 60 + 10, // Random duration between 10-70 seconds
      language: options.language || 'en',
      cached: false,
    };
  }

  async streamChat(
    messages: ChatMessage[],
    options: ChatOptions & StreamingOptions
  ): Promise<void> {
    if (this.shouldFail) {
      if (options.onError) {
        options.onError(this.createError('Mock provider error', 'MOCK_ERROR', 500));
      }
      return;
    }

    const model = options.model || 'mock-model';
    const lastMessage = messages[messages.length - 1];
    const response = this.generateMockResponse(lastMessage.content, options);
    const tokens = response.split(' ');

    // Simulate streaming
    for (const token of tokens) {
      await this.simulateDelay(20);
      if (options.onToken) {
        options.onToken(token + ' ');
      }
    }

    if (options.onComplete) {
      const usage = this.calculateMockUsage(
        messages.map(m => m.content).join(' '),
        response
      );

      options.onComplete({
        id: nanoid(),
        text: response,
        model,
        usage,
        finishReason: 'stop',
        cached: false,
      });
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

  private async simulateDelay(ms?: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms || this.delay));
  }

  private generateMockResponse(prompt: string, options: CompletionOptions): string {
    const responses = [
      'This is a mock response generated for testing purposes.',
      'The AI model has processed your request successfully.',
      'Here is a simulated completion based on your input.',
      `Based on your prompt "${prompt.slice(0, 50)}...", here is my response.`,
      'This mock provider simulates AI responses without actual processing.',
    ];

    // Use temperature to add some randomness
    const temp = options.temperature || 0.7;
    const index = Math.floor(Math.random() * responses.length * temp) % responses.length;

    return responses[index];
  }

  private generateMockEmbedding(dimensions: number): number[] {
    return Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
  }

  private calculateMockUsage(
    prompt: string,
    completion: string
  ): { promptTokens: number; completionTokens: number; totalTokens: number } {
    const promptTokens = this.estimateTokens(prompt);
    const completionTokens = this.estimateTokens(completion);

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    };
  }
}
