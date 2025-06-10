// Updated: 2024-12-25 - AI module implementation

import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { aiRoutes } from './ai.routes';
import { AiService } from './ai.service';
import { AiCacheService } from './ai.cache';
import { AiController } from './ai.controller';
import { AiWorker } from './ai.worker';
import { AiHealthCheck } from './ai.health';
import { logger } from '@shared/logger';
import { prisma } from '@infrastructure/database/prisma.service';

export class AiModule {
  static async register(fastify: FastifyInstance) {
    try {
      // Initialize services
      await this.initializeServices();

      // Register routes
      await fastify.register(aiRoutes, { prefix: '/api/v1/ai' });

      // Initialize workers
      await this.initializeWorkers();

      // Register health checks
      await this.registerHealthChecks();

      // Seed initial data
      await this.seedProviders();

      logger.info('AI module registered successfully');
    } catch (error) {
      logger.error('Failed to register AI module', error as Error);
      throw error;
    }
  }

  private static async initializeServices() {
    // Services are automatically initialized via dependency injection
    const aiService = Container.get(AiService);
    const cacheService = Container.get(AiCacheService);
    const controller = Container.get(AiController);

    logger.info('AI services initialized');
  }

  private static async initializeWorkers() {
    const worker = Container.get(AiWorker);
    await worker.start();

    logger.info('AI workers started');
  }

  private static async registerHealthChecks() {
    const healthCheck = Container.get(AiHealthCheck);
    await healthCheck.register();

    logger.info('AI health checks registered');
  }

  private static async seedProviders() {
    try {
      const providers = [
        {
          name: 'openai',
          displayName: 'OpenAI',
          enabled: true,
          apiEndpoint: 'https://api.openai.com/v1',
          settings: {
            models: ['gpt-4', 'gpt-3.5-turbo', 'dall-e-3', 'whisper-1'],
            rateLimit: 10000,
            supportedFeatures: ['chat', 'completion', 'embedding', 'image', 'audio'],
          },
        },
        {
          name: 'anthropic',
          displayName: 'Anthropic',
          enabled: true,
          apiEndpoint: 'https://api.anthropic.com',
          settings: {
            models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
            rateLimit: 5000,
            supportedFeatures: ['chat', 'completion'],
          },
        },
        {
          name: 'google',
          displayName: 'Google AI',
          enabled: true,
          apiEndpoint: 'https://generativelanguage.googleapis.com',
          settings: {
            models: ['gemini-pro', 'gemini-pro-vision', 'embedding-001'],
            rateLimit: 5000,
            supportedFeatures: ['chat', 'completion', 'embedding'],
          },
        },
        {
          name: 'ollama',
          displayName: 'Ollama (Local)',
          enabled: true,
          apiEndpoint: 'http://localhost:11434',
          settings: {
            models: ['llama2', 'codellama', 'mistral'],
            rateLimit: null,
            supportedFeatures: ['chat', 'completion', 'embedding'],
          },
        },
        {
          name: 'mock',
          displayName: 'Mock Provider',
          enabled: process.env.NODE_ENV !== 'production',
          apiEndpoint: null,
          settings: {
            models: ['mock-model'],
            rateLimit: null,
            supportedFeatures: ['chat', 'completion', 'embedding', 'image', 'audio'],
          },
        },
      ];

      for (const provider of providers) {
        await prisma.client.aiProvider.upsert({
          where: { name: provider.name },
          create: provider,
          update: {
            displayName: provider.displayName,
            enabled: provider.enabled,
            settings: provider.settings,
          },
        });
      }

      logger.info('AI providers seeded successfully');
    } catch (error) {
      logger.error('Failed to seed AI providers', error as Error);
    }
  }

  static async shutdown() {
    try {
      const worker = Container.get(AiWorker);
      await worker.stop();

      logger.info('AI module shut down successfully');
    } catch (error) {
      logger.error('Error shutting down AI module', error as Error);
    }
  }
}