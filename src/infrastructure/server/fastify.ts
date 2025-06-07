import { Service } from 'typedi';
import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import { config } from '@infrastructure/config';
import { logger } from '@shared/logger';
import { redis } from '@infrastructure/cache/redis.service';
import { trackApiUsage, enforceApiQuota, planBasedRateLimit } from '@modules/api-usage/api-usage.middleware';

// Import route modules
import authRoutes from '@modules/auth/auth.route';
import userRoutes from '@modules/user/user.route';
import billingRoutes from '@modules/billing/billing.route';
import tenantRoutes from '@modules/tenant/tenant.route';
import featureRoutes from '@modules/features/feature.route';
import analyticsRoutes from '@modules/analytics/analytics.route';
import webhookRoutes from '@modules/webhooks/webhook.route';
import onboardingRoutes from '@modules/onboarding/onboarding.route';
import ticketRoutes from '@modules/support/ticket.route';
import apiUsageRoutes from '@modules/api-usage/api-usage.route';
import adminRoutes from '@modules/admin/admin.route';

@Service()
export class FastifyServer {
  private app: FastifyInstance;

  constructor() {
    this.app = Fastify({
      logger: logger.getPino(),
      requestIdHeader: 'x-request-id',
      requestIdLogLabel: 'requestId',
      disableRequestLogging: false,
      trustProxy: true,
      bodyLimit: 10485760, // 10MB
    });
  }

  async initialize() {
    await this.registerPlugins();
    await this.registerMiddleware();
    await this.registerErrorHandlers();
    await this.registerRoutes();
  }

  private async registerPlugins(): Promise<void> {
    // CORS
    await this.app.register(import('@fastify/cors'), {
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: config.cors.methods,
      allowedHeaders: config.cors.allowedHeaders,
      exposedHeaders: config.cors.exposedHeaders,
      maxAge: config.cors.maxAge,
    });

    // Security headers
    await this.app.register(import('@fastify/helmet'), {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: true,
    });

    // Cookie support
    await this.app.register(import('@fastify/cookie'), {
      secret: config.security.cookie.secret,
      parseOptions: {
        httpOnly: config.security.cookie.httpOnly,
        secure: config.security.cookie.secure,
        sameSite: config.security.cookie.sameSite,
      },
    });

    // Multipart support
    await this.app.register(import('@fastify/multipart'), {
      limits: {
        fieldNameSize: 100,
        fieldSize: 100,
        fields: 10,
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 5,
        headerPairs: 2000,
      },
    });

    // Rate limiting
    await this.app.register((await import('@fastify/rate-limit')).default, {
      max: config.rateLimit.max,
      timeWindow: config.rateLimit.windowMs,
    });

    // Sensible defaults
    await this.app.register(import('@fastify/sensible'));

    // JWT
    await this.app.register(import('@fastify/jwt'), {
      secret: config.security.jwt.accessSecret,
      sign: {
        algorithm: 'HS256',
        expiresIn: config.security.jwt.accessExpiresIn,
      },
      verify: {
        algorithms: ['HS256'],
      },
    });

    // Swagger documentation
    if (config.api.swagger.enabled) {
      await this.app.register(import('@fastify/swagger'), {
        swagger: {
          info: {
            title: config.api.swagger.title,
            description: config.api.swagger.description,
            version: config.app.version,
          },
          host: `localhost:${config.app.port}`,
          schemes: ['http', 'https'],
          consumes: ['application/json'],
          produces: ['application/json'],
          securityDefinitions: {
            Bearer: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
              description: 'Enter JWT token with Bearer prefix',
            },
          },
        },
      });

      await this.app.register(import('@fastify/swagger-ui'), {
        routePrefix: config.api.swagger.route,
        uiConfig: {
          docExpansion: 'list',
          deepLinking: false,
        },
      });
    }
  }

  private async registerMiddleware(): Promise<void> {
    // Request context
    this.app.addHook('onRequest', async (request: FastifyRequest, reply) => {
      (request as any).customContext = {
        requestId: request.id,
        startTime: Date.now(),
      };
    });

    // Response time
    this.app.addHook('onSend', async (request: FastifyRequest, reply, payload) => {
      const responseTime = Date.now() - (request as any).customContext.startTime;
      reply.header('X-Response-Time', `${responseTime}ms`);
    });

    // Maintenance mode
    this.app.addHook('preHandler', async (request, reply) => {
      const maintenance = await redis.get('maintenance:mode');
      if (maintenance && !request.url.startsWith('/health')) {
        reply.code(503).send({
          error: 'Service Unavailable',
          message: 'System is under maintenance',
        });
      }
    });

    // Track API usage for all authenticated requests
    this.app.addHook('onRequest', async (request, reply) => {
      // Skip for health and metrics endpoints
      if (request.url.startsWith('/health') || request.url.startsWith('/metrics')) {
        return;
      }

      // Only track authenticated requests
      if (request.customUser) {
        await trackApiUsage(request, reply);
      }
    });

    // Add global quota enforcement
    this.app.addHook('onRequest', enforceApiQuota());

    // Add plan-based rate limiting
    this.app.addHook('onRequest', planBasedRateLimit);
  }

  private async registerRoutes() {
    // Health check
    this.app.get('/health', async (request, reply) => {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: config.app.version,
        environment: config.app.env,
      };
      reply.send(health);
    });

    // API routes
    await this.app.register(authRoutes, { prefix: '/api/auth' });
    await this.app.register(userRoutes, { prefix: '/api/users' });
    await this.app.register(billingRoutes, { prefix: '/api/billing' });
    await this.app.register(tenantRoutes, { prefix: '/api/tenants' });
    await this.app.register(featureRoutes, { prefix: '/api/features' });
    await this.app.register(analyticsRoutes, { prefix: '/api/analytics' });
    await this.app.register(webhookRoutes, { prefix: '/api/webhooks' });
    await this.app.register(onboardingRoutes, { prefix: '/api/onboarding' });
    await this.app.register(ticketRoutes, { prefix: '/api/tickets' });
    await this.app.register(apiUsageRoutes, { prefix: '/api/api-usage' });
    await this.app.register(adminRoutes, { prefix: '/api/admin' });

    // 404 handler
    this.app.setNotFoundHandler((request, reply) => {
      reply.code(404).send({
        error: 'Not Found',
        message: 'The requested resource was not found',
        path: request.url,
      });
    });
  }

  private async registerErrorHandlers(): Promise<void> {
    // Not found handler
    this.app.setNotFoundHandler((request, reply) => {
      reply.code(404).send({
        error: 'Not Found',
        message: `Route ${request.method} ${request.url} not found`,
        statusCode: 404,
      });
    });

    // Error handler
    this.app.setErrorHandler((error, request, reply) => {
      // Log error
      logger.error('Request error', error, {
        requestId: request.id,
        method: request.method,
        url: request.url,
        params: request.params,
        query: request.query,
      });

      // Handle custom exceptions
      if (error.statusCode) {
        reply.code(error.statusCode).send({
          error: error.name,
          message: error.message,
          statusCode: error.statusCode,
          details: (error as any).details,
        });
        return;
      }

      // Handle validation errors
      if (error.validation) {
        reply.code(400).send({
          error: 'Validation Error',
          message: 'Request validation failed',
          statusCode: 400,
          details: error.validation,
        });
        return;
      }

      // Default error
      reply.code(500).send({
        error: 'Internal Server Error',
        message: config.app.isDevelopment ? error.message : 'Something went wrong',
        statusCode: 500,
      });
    });
  }

  async start(): Promise<void> {
    try {
      await this.app.listen({
        port: config.app.port,
        host: config.app.host,
      });

      logger.info(`Server listening on ${config.app.host}:${config.app.port}`);

      // Log routes in development
      if (config.app.isDevelopment) {
        const routes = this.app.printRoutes();
        logger.debug('Registered routes:\n' + routes);
      }
    } catch (error) {
      logger.error('Failed to start server', error as Error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    await this.app.close();
    logger.info('Server stopped');
  }

  getApp(): FastifyInstance {
    return this.app;
  }
}
