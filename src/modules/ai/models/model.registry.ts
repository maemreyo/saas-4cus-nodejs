import { AiModel, ModelCategory } from './model.types';

export class ModelRegistry {
  private static models: Map<string, AiModel> = new Map();

  static {
    // Initialize with default models
    this.registerDefaultModels();
  }

  private static registerDefaultModels() {
    // OpenAI Models
    this.register({
      id: 'gpt-4-turbo-preview',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      category: ModelCategory.CHAT,
      contextWindow: 128000,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 10,
        completionPricePerMillion: 30,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: true,
        vision: true,
        audio: false,
        maxTemperature: 2,
        defaultTemperature: 0.7,
      },
    });

    this.register({
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      category: ModelCategory.CHAT,
      contextWindow: 8192,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 30,
        completionPricePerMillion: 60,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: true,
        vision: false,
        audio: false,
        maxTemperature: 2,
        defaultTemperature: 0.7,
      },
    });

    this.register({
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      category: ModelCategory.CHAT,
      contextWindow: 16385,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 0.5,
        completionPricePerMillion: 1.5,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: true,
        vision: false,
        audio: false,
        maxTemperature: 2,
        defaultTemperature: 0.7,
      },
    });

    this.register({
      id: 'text-embedding-3-small',
      name: 'Embedding 3 Small',
      provider: 'openai',
      category: ModelCategory.EMBEDDING,
      contextWindow: 8191,
      maxOutputTokens: 0,
      pricing: {
        promptPricePerMillion: 0.02,
        completionPricePerMillion: 0,
        currency: 'USD',
      },
      capabilities: {
        chat: false,
        completion: false,
        streaming: false,
        functionCalling: false,
        vision: false,
        audio: false,
        maxTemperature: 0,
        defaultTemperature: 0,
      },
    });

    this.register({
      id: 'dall-e-3',
      name: 'DALL-E 3',
      provider: 'openai',
      category: ModelCategory.IMAGE,
      contextWindow: 4000,
      maxOutputTokens: 0,
      pricing: {
        promptPricePerMillion: 40000, // $0.04 per image (standard, 1024x1024)
        completionPricePerMillion: 0,
        currency: 'USD',
      },
      capabilities: {
        chat: false,
        completion: false,
        streaming: false,
        functionCalling: false,
        vision: false,
        audio: false,
        maxTemperature: 0,
        defaultTemperature: 0,
      },
    });

    this.register({
      id: 'whisper-1',
      name: 'Whisper',
      provider: 'openai',
      category: ModelCategory.AUDIO,
      contextWindow: 0,
      maxOutputTokens: 0,
      pricing: {
        promptPricePerMillion: 6, // $0.006 per minute
        completionPricePerMillion: 0,
        currency: 'USD',
      },
      capabilities: {
        chat: false,
        completion: false,
        streaming: false,
        functionCalling: false,
        vision: false,
        audio: true,
        maxTemperature: 1,
        defaultTemperature: 0,
      },
    });

    // Anthropic Models
    this.register({
      id: 'claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      provider: 'anthropic',
      category: ModelCategory.CHAT,
      contextWindow: 200000,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 15,
        completionPricePerMillion: 75,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: false,
        vision: true,
        audio: false,
        maxTemperature: 1,
        defaultTemperature: 1,
      },
    });

    this.register({
      id: 'claude-3-sonnet-20240229',
      name: 'Claude 3 Sonnet',
      provider: 'anthropic',
      category: ModelCategory.CHAT,
      contextWindow: 200000,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 3,
        completionPricePerMillion: 15,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: false,
        vision: true,
        audio: false,
        maxTemperature: 1,
        defaultTemperature: 1,
      },
    });

    this.register({
      id: 'claude-3-haiku-20240307',
      name: 'Claude 3 Haiku',
      provider: 'anthropic',
      category: ModelCategory.CHAT,
      contextWindow: 200000,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 0.25,
        completionPricePerMillion: 1.25,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: false,
        vision: true,
        audio: false,
        maxTemperature: 1,
        defaultTemperature: 1,
      },
    });

    // Google AI Models
    this.register({
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'google',
      category: ModelCategory.CHAT,
      contextWindow: 30720,
      maxOutputTokens: 2048,
      pricing: {
        promptPricePerMillion: 0.5,
        completionPricePerMillion: 1.5,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: true,
        vision: false,
        audio: false,
        maxTemperature: 1,
        defaultTemperature: 0.9,
      },
    });

    this.register({
      id: 'gemini-pro-vision',
      name: 'Gemini Pro Vision',
      provider: 'google',
      category: ModelCategory.CHAT,
      contextWindow: 12288,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 0.5,
        completionPricePerMillion: 1.5,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: false,
        vision: true,
        audio: false,
        maxTemperature: 1,
        defaultTemperature: 0.4,
      },
    });

    // Ollama Local Models (Free)
    this.register({
      id: 'llama2',
      name: 'Llama 2',
      provider: 'ollama',
      category: ModelCategory.CHAT,
      contextWindow: 4096,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 0,
        completionPricePerMillion: 0,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: false,
        vision: false,
        audio: false,
        maxTemperature: 1,
        defaultTemperature: 0.8,
      },
    });

    this.register({
      id: 'codellama',
      name: 'Code Llama',
      provider: 'ollama',
      category: ModelCategory.CODE,
      contextWindow: 4096,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 0,
        completionPricePerMillion: 0,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: false,
        vision: false,
        audio: false,
        maxTemperature: 1,
        defaultTemperature: 0.1,
      },
    });

    this.register({
      id: 'mistral',
      name: 'Mistral',
      provider: 'ollama',
      category: ModelCategory.CHAT,
      contextWindow: 8192,
      maxOutputTokens: 4096,
      pricing: {
        promptPricePerMillion: 0,
        completionPricePerMillion: 0,
        currency: 'USD',
      },
      capabilities: {
        chat: true,
        completion: true,
        streaming: true,
        functionCalling: false,
        vision: false,
        audio: false,
        maxTemperature: 1,
        defaultTemperature: 0.7,
      },
    });
  }

  static register(model: AiModel): void {
    this.models.set(model.id, model);
  }

  static get(modelId: string): AiModel | undefined {
    return this.models.get(modelId);
  }

  static getByProvider(provider: string): AiModel[] {
    return Array.from(this.models.values()).filter(m => m.provider === provider);
  }

  static getByCategory(category: ModelCategory): AiModel[] {
    return Array.from(this.models.values()).filter(m => m.category === category);
  }

  static getAll(): AiModel[] {
    return Array.from(this.models.values());
  }

  static getAvailable(capabilities?: Partial<AiModel['capabilities']>): AiModel[] {
    let models = Array.from(this.models.values()).filter(m => !m.deprecated);

    if (capabilities) {
      models = models.filter(m => {
        for (const [key, value] of Object.entries(capabilities)) {
          if (m.capabilities[key as keyof typeof m.capabilities] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    return models;
  }

  static calculateCost(modelId: string, usage: { promptTokens: number; completionTokens: number }): number {
    const model = this.get(modelId);
    if (!model) return 0;

    const promptCost = (usage.promptTokens / 1_000_000) * model.pricing.promptPricePerMillion;
    const completionCost = (usage.completionTokens / 1_000_000) * model.pricing.completionPricePerMillion;

    return Math.round((promptCost + completionCost) * 100) / 100; // Round to 2 decimal places
  }
}
