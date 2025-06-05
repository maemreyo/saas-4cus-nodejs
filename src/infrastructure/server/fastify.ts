import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Service } from 'typedi'
import { config } from '@infrastructure/config'
import { logger, fastifyLogger } from '@shared/logger'
import { prisma } from '@infrastructure/database/prisma.service'
import { redis } from '@infrastructure/cache/redis.service'

@Service()
export class FastifyServer {
  private app: FastifyInstance

  constructor() {
    this.app = Fastify({
      logger: fastifyLogger,
      trustProxy: true,
      requestIdHeader: 'x-request-id',
      disableRequestLogging: false,
      bodyLimit: 10485760 // 10MB
    })
  }

  async initialize(): Promise<void> {
    await this.registerPlugins()
    await this.registerMiddleware()
    await this.registerRoutes()
    await this.registerErrorHandlers()
  }

  private async registerPlugins(): Promise<void> {
    // CORS
    await this.app.register(import('@fastify/cors'), {
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: config.cors.methods,
      allowedHeaders: config.cors.allowedHeaders,
      exposedHeaders: config.cors.exposedHeaders,
      maxAge: config.cors.maxAge
    })

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
          upgradeInsecureRequests: []
        }
      },
      crossOriginEmbedderPolicy: true
    })

    // Cookie support
    await this.app.register(import('@fastify/cookie'), {
      secret: config.security.cookie.secret,
      parseOptions: {
        httpOnly: config.security.cookie.httpOnly,
        secure: config.security.cookie.secure,
        sameSite: config.security.cookie.sameSite
      }
    })

    // Multipart support
    await this.app.register(import('@fastify/multipart'), {
      limits: {
        fieldNameSize: 100,
        fieldSize: 100,
        fields: 10,
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 5,
        headerPairs: 2000
      }
    })

    // Rate limiting
    await this.app.register(import('@fastify/rate-limit'), {
      max: config.rateLimit.max,
      timeWindow: config.rateLimit.windowMs,
      skipSuccessfulRequests: config.rateLimit.skipSuccessfulRequests,
      skipFailedRequests: config.rateLimit.skipFailedRequests
    })

    // Sensible defaults
    await this.app.register(import('@fastify/sensible'))

    // JWT
    await this.app.register(import('@fastify/jwt'), {
      secret: config.security.jwt.accessSecret,
      sign: {
        algorithm: 'HS256',
        expiresIn: config.security.jwt.accessExpiresIn
      },
      verify: {
        algorithms: ['HS256']
      }
    })

    // Swagger documentation
    if (config.api.swagger.enabled) {
      await this.app.register(import('@fastify/swagger'), {
        swagger: {
          info: {
            title: config.api.swagger.title,
            description: config.api.swagger.description,
            version: config.app.version
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
              description: 'Enter JWT token with Bearer prefix'
            }
          }
        }
      })

      await this.app.register(import('@fastify/swagger-ui'), {
        routePrefix: config.api.swagger.route,
        uiConfig: {
          docExpansion: 'list',
          deepLinking: false
        }
      })
    }
  }

  private async registerMiddleware(): Promise<void> {
    // Request context
    this.app.addHook('onRequest', async (request, reply) => {
      request.context = {
        requestId: request.id,
        startTime: Date.now()
      }
    })

    // Response time
    this.app.addHook('onSend', async (request, reply, payload) => {
      const responseTime = Date.now() - request.context.startTime
      reply.header('X-Response-Time', `${responseTime}ms`)
    })

    // Maintenance mode
    this.app.addHook('preHandler', async (request, reply) => {
      const maintenance = await redis.get('maintenance:mode')
      if (maintenance && !request.url.startsWith('/health')) {
        reply.code(503).send({
          error: 'Service Unavailable',
          message: 'System is under maintenance'
        })
      }
    })
  }

  private async registerRoutes(): Promise<void> {
    // Auto-load routes
    await this.app.register(import('@fastify/autoload'), {
      dir: `${__dirname}/../../modules`,
      options: { prefix: config.api.prefix },
      matchFilter: (path: string) => path.endsWith('.route.ts') || path.endsWith('.route.js')
    })

    // Health check routes
    this.app.register(healthRoutes)
  }

  private async registerErrorHandlers(): Promise<void> {
    // Not found handler
    this.app.setNotFoundHandler((request, reply) => {
      reply.code(404).send({
        error: 'Not Found',
        message: `Route ${request.method} ${request.url} not found`,
        statusCode: 404
      })
    })

    // Error handler
    this.app.setErrorHandler((error, request, reply) => {
      // Log error
      logger.error('Request error', error, {
        requestId: request.id,
        method: request.method,
        url: request.url,
        params: request.params,
        query: request.query
      })

      // Handle custom exceptions
      if (error.statusCode) {
        reply.code(error.statusCode).send({
          error: error.name,
          message: error.message,
          statusCode: error.statusCode,
          details: error.details
        })
        return
      }

      // Handle validation errors
      if (error.validation) {
        reply.code(400).send({
          error: 'Validation Error',
          message: 'Request validation failed',
          statusCode: 400,
          details: error.validation
        })
        return
      }

      // Default error
      reply.code(500).send({
        error: 'Internal Server Error',
        message: config.app.isDevelopment ? error.message : 'Something went wrong',
        statusCode: 500
      })
    })
  }

  async start(): Promise<void> {
    try {
      await this.app.listen({
        port: config.app.port,
        host: config.app.host
      })

      logger.info(`Server listening on ${config.app.host}:${config.app.port}`)

      // Log routes in development
      if (config.app.isDevelopment) {
        const routes = this.app.printRoutes()
        logger.debug('Registered routes:\n' + routes)
      }
    } catch (error) {
      logger.error('Failed to start server', error as Error)
      throw error
    }
  }

  async stop(): Promise<void> {
    await this.app.close()
    logger.info('Server stopped')
  }

  getApp(): FastifyInstance {
    return this.app
  }
}