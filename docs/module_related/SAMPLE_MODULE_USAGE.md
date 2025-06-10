# Module Generator Usage Guide

## 🚀 Quick Start

Generate a new business module with interactive wizard:

```bash
pnpm module:generate
# or
pnpm module:new
```

## 🎯 Module Generator Features

The generator will create a complete module structure with:

### Core Files
- `README.md` - Module documentation
- `index.ts` - Module exports and initialization
- `[module].dto.ts` - Data transfer objects with Zod validation
- `[module].service.ts` - Business logic
- `__tests__/` - Unit tests with Vitest

### Optional Features (Choose during setup)
- **API Endpoints** - Controller, routes with full CRUD
- **Database Models** - Prisma schema template
- **Background Jobs** - Queue processor with BullMQ
- **Event System** - Event definitions and handlers
- **Middleware** - Custom middleware for the module
- **Webhooks** - Webhook support
- **Caching** - Redis caching integration
- **Analytics** - Usage tracking
- **Rate Limiting** - Module-specific rate limits

## 📝 Example: Generating AI Module

```bash
$ pnpm module:generate

🚀 Business Module Generator

? Module name: ai
? Display name: AI Service
? Module description: Multi-provider AI service with caching and analytics
? Select module features:
  ✓ RESTful API endpoints
  ✓ Database models (Prisma)
  ✓ Background jobs (Queue)
  ✓ Event system
  ✓ Middleware
  ✓ Caching layer
  ✓ Analytics tracking
  ✓ Rate limiting
? Select module dependencies:
  ✓ Auth (user authentication)
  ✓ User (user management)
  ✓ Tenant (multi-tenancy)
  ✓ Billing (payments)
  ✓ Analytics
  ✓ API Usage

📋 Module Configuration:
   Name: ai
   Display Name: AI Service
   Description: Multi-provider AI service with caching and analytics
   Features: api, database, queue, events, middleware, caching, analytics, ratelimit
   Dependencies: auth, user, tenant, billing, analytics, api-usage
   Path: /your-project/src/modules/ai

? Generate module with this configuration? Yes

🔨 Generating module files...

✅ Created README.md
✅ Created index.ts
✅ Created ai.dto.ts
✅ Created ai.service.ts
✅ Created ai.controller.ts
✅ Created ai.route.ts
✅ Created ai.events.ts
✅ Created ai.events.handlers.ts
✅ Created ai.queue.ts
✅ Created ai.middleware.ts
✅ Created __tests__/ai.service.test.ts
✅ Created schema.prisma
```

## 📁 Generated Structure

```
src/modules/ai/
├── README.md                    # Module documentation
├── index.ts                     # Module initialization
├── ai.dto.ts                    # DTOs and validation
├── ai.service.ts                # Business logic
├── ai.controller.ts             # REST API controller
├── ai.route.ts                  # Route definitions
├── ai.events.ts                 # Event types
├── ai.events.handlers.ts        # Event handlers
├── ai.queue.ts                  # Background jobs
├── ai.middleware.ts             # Custom middleware
├── schema.prisma                # Database schema template
└── __tests__/
    └── ai.service.test.ts       # Unit tests
```

## 🔧 Post-Generation Steps

### 1. **Add Prisma Model**
Copy the generated schema from `src/modules/[module]/schema.prisma` to your main `prisma/schema.prisma`:

```prisma
model Ai {
  id          String   @id @default(cuid())
  name        String
  description String?
  metadata    Json?
  status      String   @default("active")

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  tenantId    String?
  tenant      Tenant?  @relation(fields: [tenantId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. **Run Database Migration**
```bash
pnpm db:migrate
```

### 3. **Enable Module**
Add to `.env`:
```env
AI_MODULE_ENABLED=true
```

### 4. **Update Module Config** (if not auto-updated)
Add to `src/infrastructure/modules/module.config.ts`:
```typescript
export const MODULE_INIT_ORDER: ModuleName[] = [
  'auth',
  'user',
  'tenant',
  'billing',
  'ai', // Add your module
  // ...
];
```

### 5. **Register Routes** (Manual step)
In your server setup, register the routes:
```typescript
// src/infrastructure/server/routes.ts
import aiRoutes from '@modules/ai';

// In registerRoutes function
await app.register(aiRoutes, { prefix: '/api/ai' });
```

### 6. **Run Tests**
```bash
pnpm test src/modules/ai
```

## 🎨 Customization Tips

### Service Layer
The generated service includes basic CRUD. Extend it with your business logic:

```typescript
// ai.service.ts
class AiService {
  // Add custom methods
  async generateCompletion(prompt: string, options: AiOptions) {
    // Your AI logic here
  }

  async streamChat(messages: Message[], options: StreamOptions) {
    // Streaming implementation
  }
}
```

### DTOs
Extend the generated DTOs with your specific fields:

```typescript
// ai.dto.ts
export const AiCompletionSchema = z.object({
  prompt: z.string().max(4000),
  model: z.enum(['gpt-3.5', 'gpt-4', 'claude-3']),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4000).default(150),
});
```

### Events
Add custom events for your module:

```typescript
// ai.events.ts
export enum AiEvents {
  CREATED = 'ai.created',
  UPDATED = 'ai.updated',
  DELETED = 'ai.deleted',
  // Add custom events
  COMPLETION_GENERATED = 'ai.completion.generated',
  QUOTA_EXCEEDED = 'ai.quota.exceeded',
  PROVIDER_ERROR = 'ai.provider.error',
}
```

### Middleware
Implement module-specific middleware:

```typescript
// ai.middleware.ts
export function aiRateLimit(tier: 'free' | 'pro' | 'enterprise') {
  const limits = {
    free: { max: 10, window: 3600000 },
    pro: { max: 100, window: 3600000 },
    enterprise: { max: 1000, window: 3600000 }
  };

  return rateLimit(limits[tier]);
}

export function validateAiAccess(request: FastifyRequest) {
  // Check user's AI feature access
  const hasAccess = await entitlementService.check(
    request.user.id,
    'ai_access'
  );

  if (!hasAccess) {
    throw new ForbiddenException('AI access not available in your plan');
  }
}
```

## 🧪 Testing

The generator creates a test file with basic structure:

```typescript
// __tests__/ai.service.test.ts
describe('AiService', () => {
  // Extend with your test cases
  describe('generateCompletion', () => {
    it('should generate completion successfully', async () => {
      // Your test
    });

    it('should enforce rate limits', async () => {
      // Your test
    });
  });
});
```

## 🚨 Common Patterns

### 1. **Tenant-Aware Module**
If you selected tenant dependency, all queries are automatically scoped:
```typescript
const items = await prisma.ai.findMany({
  where: {
    userId,
    tenantId, // Automatically filtered
  }
});
```

### 2. **Cached Operations**
If caching was selected:
```typescript
// Check cache first
const cached = await redis.get(cacheKey);
if (cached) return cached;

// Perform operation
const result = await expensiveOperation();

// Cache result
await redis.set(cacheKey, result, { ttl: 300 });
```

### 3. **Event-Driven Updates**
If events were selected:
```typescript
// Service emits events
await eventBus.emit('ai.completion.generated', {
  userId,
  model,
  tokens,
  cost
});

// Other modules can listen
eventBus.on('ai.completion.generated', async (data) => {
  await analyticsService.track(data);
  await billingService.recordUsage(data);
});
```

### 4. **Background Processing**
If queue was selected:
```typescript
// Add job to queue
await addAiJob('process-batch', {
  prompts: [...],
  userId
});

// Processor handles it
queueService.registerProcessor('ai', 'process-batch', async (job) => {
  for (const prompt of job.data.prompts) {
    await processPrompt(prompt);
  }
});
```

## 🤝 Contributing

To improve the module generator:
1. Edit `scripts/generate-module.ts`
2. Add new templates or features
3. Test with: `pnpm module:generate`
4. Submit PR with your improvements

## 📚 Resources

- [Module Architecture Guide](./docs/MODULES.md)
- [API Design Guidelines](./docs/API.md)
- [Testing Best Practices](./docs/TESTING.md)
- [Database Schema Patterns](./docs/DATABASE.md)
