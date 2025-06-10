# AI Module Implementation Plan

## 🎯 Module Overview

The AI module will provide a unified interface for multiple AI providers with production-ready features including rate limiting, caching, analytics, and cost tracking.

## 🏗️ Architecture Design

### 1. **Core Components**

```
src/modules/ai/
├── providers/                    # AI Provider implementations
│   ├── base.provider.ts         # Abstract base provider
│   ├── openai.provider.ts       # OpenAI implementation
│   ├── anthropic.provider.ts    # Anthropic implementation
│   ├── google-ai.provider.ts    # Google AI implementation
│   ├── ollama.provider.ts       # Ollama (local) implementation
│   └── mock.provider.ts         # Mock provider for testing
├── models/                      # Model configurations
│   ├── model.registry.ts        # Available models registry
│   └── model.types.ts          # Model type definitions
├── ai.service.ts               # Main AI service (facade pattern)
├── ai.controller.ts            # REST API endpoints
├── ai.route.ts                 # Route definitions
├── ai.dto.ts                   # Request/Response DTOs
├── ai.events.ts                # Event definitions
├── ai.middleware.ts            # Rate limiting, auth
├── ai.queue.ts                 # Background processing
├── ai.cache.ts                 # Caching strategies
├── ai.metrics.ts               # Metrics collection
└── README.md                   # Documentation
```

### 2. **Database Schema**

```prisma
model AiProvider {
  id            String   @id @default(cuid())
  name          String   @unique // openai, anthropic, google, ollama
  displayName   String
  enabled       Boolean  @default(true)
  apiEndpoint   String?
  settings      Json?    // Provider-specific settings
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  apiKeys       AiApiKey[]
  usageLogs     AiUsageLog[]
}

model AiApiKey {
  id            String   @id @default(cuid())
  providerId    String
  provider      AiProvider @relation(fields: [providerId], references: [id])

  userId        String?
  user          User?    @relation(fields: [userId], references: [id])
  tenantId      String?
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])

  name          String
  keyHash       String   // Encrypted API key
  lastUsedAt    DateTime?
  expiresAt     DateTime?

  usageLimit    Int?     // Monthly usage limit
  currentUsage  Int      @default(0)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId, tenantId])
  @@index([providerId])
}

model AiUsageLog {
  id            String   @id @default(cuid())

  providerId    String
  provider      AiProvider @relation(fields: [providerId], references: [id])

  userId        String
  user          User     @relation(fields: [userId], references: [id])
  tenantId      String?
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])

  model         String   // gpt-4, claude-3, etc
  operation     String   // completion, chat, embedding, image

  // Request details
  promptTokens  Int
  completionTokens Int
  totalTokens   Int

  // Cost tracking
  cost          Float    // In cents
  currency      String   @default("USD")

  // Performance
  latency       Int      // in milliseconds
  cached        Boolean  @default(false)

  // Metadata
  metadata      Json?
  error         String?

  createdAt     DateTime @default(now())

  @@index([userId, createdAt])
  @@index([tenantId, createdAt])
  @@index([providerId, model])
}

model AiPromptTemplate {
  id            String   @id @default(cuid())

  name          String
  description   String?
  category      String?

  prompt        String   @db.Text
  variables     Json?    // Expected variables

  userId        String?
  user          User?    @relation(fields: [userId], references: [id])
  tenantId      String?
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])

  isPublic      Boolean  @default(false)
  usageCount    Int      @default(0)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId, tenantId])
  @@index([category])
  @@index([isPublic])
}

model AiConversation {
  id            String   @id @default(cuid())

  userId        String
  user          User     @relation(fields: [userId], references: [id])
  tenantId      String?
  tenant        Tenant?  @relation(fields: [tenantId], references: [id])

  title         String?
  model         String
  provider      String

  messages      Json     // Array of messages
  metadata      Json?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId, createdAt])
}
```

## 🔗 Integration with Existing Modules

### 1. **Authentication & User Module**
- Use `authenticate` middleware for all AI endpoints
- Track AI usage per user
- User-specific API keys and limits

### 2. **Tenant Module**
- Tenant-level AI configuration
- Shared API keys for teams
- Usage aggregation by tenant

### 3. **Billing Module**
- Track AI costs per user/tenant
- Enforce usage limits based on subscription plan
- Usage-based billing integration

```typescript
// Integration example
const subscription = await billingService.getActiveSubscription(userId);
const aiLimit = subscription.features.aiTokens || 0;
const currentUsage = await aiService.getCurrentUsage(userId);

if (currentUsage >= aiLimit) {
  throw new QuotaExceededException('AI token limit reached');
}
```

### 4. **API Usage Module**
- Leverage existing rate limiting
- Track AI API calls separately
- Monitor AI endpoint performance

```typescript
// Middleware stack
app.post('/api/ai/completions', {
  preHandler: [
    authenticate,
    requireTenant(),
    trackApiUsage,
    enforceApiQuota(),
    aiRateLimit({ provider: 'openai', tier: 'standard' })
  ]
}, handler);
```

### 5. **Features Module**
- Feature flags for AI providers
- A/B testing different models
- Gradual rollout of new AI features

```typescript
if (await featureService.isEnabled('ai_gpt4', userId)) {
  models.push('gpt-4');
}
```

### 6. **Analytics Module**
- Track AI usage patterns
- Model performance metrics
- Cost analysis reports

```typescript
await analyticsService.track({
  event: 'ai_completion',
  userId,
  properties: {
    provider: 'openai',
    model: 'gpt-4',
    tokens: 150,
    cost: 0.03,
    latency: 1200,
    cached: false
  }
});
```

### 7. **Notification Module**
- Alert on API key expiration
- Usage limit warnings
- Error notifications

### 8. **Caching (Redis)**
- Cache AI responses by hash(prompt + model)
- TTL based on content type
- Invalidation strategies

```typescript
const cacheKey = `ai:completion:${hash(prompt + model)}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;
```

### 9. **Queue Module**
- Async processing for large requests
- Batch operations
- Retry failed requests

### 10. **Admin Module**
- AI usage dashboard
- Provider management
- Cost analytics
- Model performance metrics

## 📊 Key Features Implementation

### 1. **Multi-Provider Support**
```typescript
interface AiProvider {
  complete(prompt: string, options: CompletionOptions): Promise<CompletionResult>;
  chat(messages: Message[], options: ChatOptions): Promise<ChatResult>;
  embed(text: string, options: EmbedOptions): Promise<EmbedResult>;
}

class AiService {
  private providers: Map<string, AiProvider>;

  async complete(prompt: string, options: AiOptions) {
    const provider = this.getProvider(options.provider);

    // Pre-processing
    await this.checkQuota(options.userId);
    await this.rateLimit(options.userId, options.provider);

    // Check cache
    const cached = await this.checkCache(prompt, options);
    if (cached) return cached;

    // Make request
    const start = Date.now();
    const result = await provider.complete(prompt, options);
    const latency = Date.now() - start;

    // Post-processing
    await this.logUsage(userId, provider, result, latency);
    await this.cache(prompt, options, result);
    await this.trackAnalytics(userId, provider, result);

    return result;
  }
}
```

### 2. **Smart Caching Strategy**
```typescript
class AiCacheService {
  private strategies = {
    embedding: { ttl: 86400 * 30 }, // 30 days
    completion: { ttl: 86400 * 7 },  // 7 days
    chat: { ttl: 3600 },             // 1 hour
    image: { ttl: 86400 * 90 }       // 90 days
  };

  async get(key: string, type: string) {
    const cached = await redis.get(key);
    if (cached) {
      await this.trackCacheHit(type);
    }
    return cached;
  }
}
```

### 3. **Rate Limiting**
```typescript
const aiRateLimits = {
  free: { requests: 10, window: 3600 },      // 10/hour
  starter: { requests: 100, window: 3600 },   // 100/hour
  pro: { requests: 1000, window: 3600 },      // 1000/hour
  enterprise: { requests: 10000, window: 3600 } // 10k/hour
};
```

### 4. **Cost Tracking**
```typescript
const costPerToken = {
  'gpt-3.5-turbo': { prompt: 0.0001, completion: 0.0002 },
  'gpt-4': { prompt: 0.003, completion: 0.006 },
  'claude-3-opus': { prompt: 0.015, completion: 0.075 },
  'gemini-pro': { prompt: 0.00025, completion: 0.0005 }
};
```

## 🛠️ API Endpoints

```typescript
// Public endpoints
POST   /api/ai/completions          // Text completion
POST   /api/ai/chat                 // Chat conversation
POST   /api/ai/embeddings           // Generate embeddings
POST   /api/ai/images/generate      // Image generation
POST   /api/ai/audio/transcribe     // Audio transcription

// Management endpoints
GET    /api/ai/models               // List available models
GET    /api/ai/providers            // List providers
GET    /api/ai/usage                // Get usage statistics
GET    /api/ai/usage/details        // Detailed usage logs

// Template endpoints
GET    /api/ai/templates            // List prompt templates
POST   /api/ai/templates            // Create template
GET    /api/ai/templates/:id        // Get template
PUT    /api/ai/templates/:id        // Update template

// Conversation endpoints
GET    /api/ai/conversations        // List conversations
POST   /api/ai/conversations        // Create conversation
GET    /api/ai/conversations/:id    // Get conversation
POST   /api/ai/conversations/:id/messages // Add message
```

## 📈 Metrics & Monitoring

### Key Metrics to Track
- **Usage Metrics**: Tokens used, requests count, unique users
- **Performance**: Latency by provider/model, cache hit rate
- **Cost**: Total cost, cost per user/tenant, cost by model
- **Errors**: Error rate by provider, timeout rate
- **Business**: Most used models, popular prompts

### Dashboards
1. **User Dashboard**: Personal usage, costs, history
2. **Admin Dashboard**: System-wide metrics, provider health
3. **Billing Dashboard**: Cost breakdown, projections

## 🔒 Security Considerations

1. **API Key Management**
   - Encrypt keys at rest (using ENCRYPTION_KEY)
   - Rotate keys regularly
   - Audit key usage

2. **Input Validation**
   - Sanitize prompts
   - Limit prompt length
   - Block harmful content

3. **Output Filtering**
   - Filter sensitive information
   - Moderate content
   - PII detection

4. **Access Control**
   - Role-based model access
   - IP whitelisting for production
   - Request signing

## 📚 Module Dependencies

```json
{
  "dependencies": ["auth", "user", "billing", "tenant", "analytics", "api-usage"],
  "features": ["api", "database", "queue", "events", "caching", "analytics", "ratelimit"],
  "integrations": {
    "billing": "Usage-based billing and quotas",
    "analytics": "Usage tracking and insights",
    "api-usage": "Rate limiting and monitoring",
    "cache": "Response caching",
    "queue": "Async processing"
  }
}
```

## 🚀 Implementation Phases

### Phase 1: Core (Week 1)
- [ ] Module structure setup
- [ ] Base provider interface
- [ ] OpenAI provider implementation
- [ ] Basic completion endpoint
- [ ] Simple caching

### Phase 2: Multi-Provider (Week 2)
- [ ] Anthropic provider
- [ ] Google AI provider
- [ ] Provider selection logic
- [ ] Model registry
- [ ] Error handling

### Phase 3: Production Features (Week 3)
- [ ] Rate limiting integration
- [ ] Cost tracking
- [ ] Usage analytics
- [ ] Billing integration
- [ ] Admin dashboard

### Phase 4: Advanced Features (Week 4)
- [ ] Ollama/local model support
- [ ] Prompt templates
- [ ] Conversation management
- [ ] Advanced caching strategies
- [ ] Performance optimization

## 🧪 Testing Strategy

1. **Unit Tests**: Provider implementations, service methods
2. **Integration Tests**: API endpoints, database operations
3. **Mock Provider**: For development and CI/CD
4. **Load Tests**: Rate limiting, caching effectiveness
5. **Cost Tests**: Ensure accurate cost calculation

## 📝 Configuration

```env
# AI Module Configuration
AI_MODULE_ENABLED=true

# Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...

# Local Models
OLLAMA_BASE_URL=http://localhost:11434

# Rate Limiting
AI_RATE_LIMIT_FREE=10
AI_RATE_LIMIT_WINDOW=3600

# Caching
AI_CACHE_TTL=3600
AI_CACHE_MAX_SIZE=1000

# Cost Alerts
AI_COST_ALERT_THRESHOLD=100
AI_COST_ALERT_EMAIL=admin@example.com
```

## 🎯 Success Metrics

1. **Performance**: < 100ms overhead per request
2. **Cache Hit Rate**: > 30% for common queries
3. **Cost Reduction**: 40% via caching
4. **Availability**: 99.9% uptime
5. **User Satisfaction**: Easy integration, good docs
