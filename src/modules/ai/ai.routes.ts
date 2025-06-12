import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { AiController } from './ai.controller';
import { requireAuth, hasPermission } from '@modules/auth/middleware';
import { checkSubscription, rateLimiter } from '@shared/middleware';
import { checkTenant } from '@modules/tenant/middleware';

export async function aiRoutes(fastify: FastifyInstance) {
  const controller = Container.get(AiController);

  // Apply common middleware
  fastify.addHook('preHandler', requireAuth);
  fastify.addHook('preHandler', checkSubscription);

  // Basic AI operations
  fastify.post('/complete', {
    preHandler: [
      rateLimiter({ max: 100, timeWindow: '1 minute' }),
    ],
    handler: controller.complete.bind(controller),
  });

  fastify.post('/chat', {
    preHandler: [
      rateLimiter({ max: 100, timeWindow: '1 minute' }),
    ],
    handler: controller.chat.bind(controller),
  });

  fastify.post('/embed', {
    preHandler: [
      rateLimiter({ max: 200, timeWindow: '1 minute' }),
    ],
    handler: controller.embed.bind(controller),
  });

  fastify.post('/images/generate', {
    preHandler: [
      rateLimiter({ max: 20, timeWindow: '1 minute' }),
    ],
    handler: controller.generateImage.bind(controller),
  });

  fastify.post('/audio/transcribe', {
    preHandler: [
      rateLimiter({ max: 50, timeWindow: '1 minute' }),
    ],
    handler: controller.transcribeAudio.bind(controller),
  });

  // Model and provider information
  fastify.get('/models', {
    handler: controller.getModels.bind(controller),
  });

  fastify.get('/providers', {
    handler: controller.getProviders.bind(controller),
  });

  // Usage and statistics
  fastify.get('/usage/stats', {
    handler: controller.getUsageStats.bind(controller),
  });

  fastify.get('/usage/current', {
    handler: controller.getCurrentUsage.bind(controller),
  });

  // Template management
  fastify.post('/templates', {
    handler: controller.createTemplate.bind(controller),
  });

  fastify.get('/templates', {
    handler: controller.getTemplates.bind(controller),
  });

  fastify.patch('/templates/:templateId', {
    handler: controller.updateTemplate.bind(controller),
  });

  fastify.delete('/templates/:templateId', {
    handler: controller.deleteTemplate.bind(controller),
  });

  fastify.post('/templates/:templateId/use', {
    preHandler: [
      rateLimiter({ max: 100, timeWindow: '1 minute' }),
    ],
    handler: controller.useTemplate.bind(controller),
  });

  // Conversation management
  fastify.post('/conversations', {
    handler: controller.createConversation.bind(controller),
  });

  fastify.get('/conversations', {
    handler: controller.getConversations.bind(controller),
  });

  fastify.get('/conversations/:conversationId', {
    handler: controller.getConversation.bind(controller),
  });

  fastify.post('/conversations/:conversationId/messages', {
    preHandler: [
      rateLimiter({ max: 100, timeWindow: '1 minute' }),
    ],
    handler: controller.addMessage.bind(controller),
  });

  // Tenant-specific routes
  fastify.register(async function tenantRoutes(fastify) {
    fastify.addHook('preHandler', checkTenant);

    // API Key management (requires admin permission)
    fastify.post('/api-keys', {
      preHandler: [
        hasPermission('ai:manage'),
      ],
      handler: controller.createApiKey.bind(controller),
    });

    fastify.get('/api-keys', {
      preHandler: [
        hasPermission('ai:manage'),
      ],
      handler: controller.getApiKeys.bind(controller),
    });

    fastify.delete('/api-keys/:keyId', {
      preHandler: [
        hasPermission('ai:manage'),
      ],
      handler: controller.deleteApiKey.bind(controller),
    });
  });

  // Admin routes
  fastify.register(async function adminRoutes(fastify) {
    fastify.addHook('preHandler', hasPermission('admin'));

    // Cache management
    fastify.get('/cache/stats', {
      handler: controller.getCacheStats.bind(controller),
    });

    fastify.delete('/cache', {
      handler: controller.clearCache.bind(controller),
    });
  });

  // Health check
  fastify.get('/health', {
    handler: async (request, reply) => {
      reply.send({
        status: 'healthy',
        timestamp: new Date().toISOString(),
      });
    },
  });
}
