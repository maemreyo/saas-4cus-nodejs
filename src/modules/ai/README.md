# AI Module

The AI module provides a unified interface for integrating various AI providers (OpenAI, Anthropic, Google AI, Ollama) into the SaaS platform.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic, Google AI, and Ollama (local models)
- **Unified API**: Consistent interface across all providers
- **Caching**: Intelligent caching to reduce costs and improve performance
- **Rate Limiting**: Per-operation and cost-based rate limiting
- **Usage Tracking**: Detailed usage logs and cost tracking
- **Template Management**: Save and reuse prompt templates
- **Conversation History**: Maintain chat conversations
- **Health Monitoring**: Provider health checks and status monitoring

## Supported Operations

### 1. Text Completion
```typescript
POST /api/v1/ai/complete
{
  "prompt": "Explain quantum computing",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "maxTokens": 1000
}
```

### 2. Chat
```typescript
POST /api/v1/ai/chat
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "What is machine learning?"}
  ],
  "model": "gpt-4",
  "temperature": 0.8
}
```

### 3. Embeddings
```typescript
POST /api/v1/ai/embed
{
  "text": "Text to embed",
  "model": "text-embedding-3-small"
}
```

### 4. Image Generation
```typescript
POST /api/v1/ai/images/generate
{
  "prompt": "A futuristic city at sunset",
  "size": "1024x1024",
  "model": "dall-e-3"
}
```

### 5. Audio Transcription
```typescript
POST /api/v1/ai/audio/transcribe
FormData:
  - file: audio.mp3
  - model: "whisper-1"
  - language: "en"
```

## Available Models

### OpenAI
- **Chat/Completion**: gpt-4-turbo-preview, gpt-4, gpt-3.5-turbo
- **Embeddings**: text-embedding-3-small, text-embedding-3-large
- **Images**: dall-e-3, dall-e-2
- **Audio**: whisper-1

### Anthropic
- **Chat/Completion**: claude-3-opus, claude-3-sonnet, claude-3-haiku

### Google AI
- **Chat/Completion**: gemini-pro, gemini-pro-vision
- **Embeddings**: embedding-001

### Ollama (Local)
- **Chat/Completion**: llama2, codellama, mistral, mixtral
- **Embeddings**: nomic-embed-text

## Rate Limits

Default rate limits per minute:
- Completion: 100 requests
- Chat: 100 requests
- Embeddings: 200 requests
- Images: 20 requests
- Audio: 50 requests

Premium users get 2x rate limits.

## Usage Tracking

Get current month usage:
```typescript
GET /api/v1/ai/usage/current
```

Get detailed statistics:
```typescript
GET /api/v1/ai/usage/stats?startDate=2024-01-01&endDate=2024-12-31
```

## Template Management

Create a template:
```typescript
POST /api/v1/ai/templates
{
  "name": "Code Review",
  "prompt": "Review this code: {{code}}\nLanguage: {{language}}",
  "variables": {
    "code": "string",
    "language": "string"
  },
  "category": "development"
}
```

Use a template:
```typescript
POST /api/v1/ai/templates/:templateId/use
{
  "variables": {
    "code": "function add(a, b) { return a + b; }",
    "language": "JavaScript"
  }
}
```

## API Key Management (Tenant Admins)

Add custom API key:
```typescript
POST /api/v1/ai/api-keys
{
  "name": "Production Key",
  "providerId": "openai-provider-id",
  "apiKey": "sk-xxx",
  "usageLimit": 1000000
}
```

## Caching

The AI module automatically caches:
- Completion responses (7 days)
- Chat responses (1 hour)
- Embeddings (30 days)
- Generated images (90 days)

Cache can be disabled per request:
```typescript
{
  "prompt": "...",
  "cache": false
}
```

## Error Handling

Common error codes:
- `API_KEY_MISSING`: Provider API key not configured
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `USAGE_LIMIT_EXCEEDED`: Monthly usage limit exceeded
- `PROVIDER_ERROR`: Provider-specific error
- `NOT_SUPPORTED`: Operation not supported by provider

## Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-xxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Google AI
GOOGLE_AI_API_KEY=AIzaSyxxx

# Ollama (Local)
OLLAMA_BASE_URL=http://localhost:11434
```

## Cost Optimization Tips

1. **Use Caching**: Enable caching for repeated queries
2. **Choose Appropriate Models**: Use smaller models when possible
3. **Set Temperature to 0**: For deterministic outputs
4. **Limit Max Tokens**: Only request what you need
5. **Use Templates**: Reuse common prompts
6. **Monitor Usage**: Track costs regularly

## Security Considerations

1. **API Keys**: Store securely, rotate regularly
2. **User Input**: Sanitize prompts to prevent injection
3. **Rate Limiting**: Prevents abuse and cost overruns
4. **Access Control**: Use proper permissions
5. **Audit Logging**: All AI operations are logged

## Monitoring

Health check endpoint:
```typescript
GET /api/v1/ai/health
```

Provider-specific health:
```typescript
GET /api/v1/health
{
  "ai:provider:openai": "healthy",
  "ai:provider:anthropic": "healthy",
  "ai:cache": "healthy",
  "ai:usage": "healthy"
}
```

## Best Practices

1. **Error Handling**: Always handle provider failures gracefully
2. **Fallback Providers**: Configure multiple providers
3. **Streaming**: Use streaming for long responses
4. **Batch Processing**: Group similar requests
5. **Cost Alerts**: Set up cost threshold notifications
