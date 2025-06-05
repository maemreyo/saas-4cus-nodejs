import { PrismaClient, Prisma } from '@prisma/client'
import { Service } from 'typedi'
import { logger } from '@shared/logger'
import { config } from '@infrastructure/config'

// Extended Prisma Client type with middleware
type ExtendedPrismaClient = PrismaClient & {
  $transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T>
}

@Service()
export class PrismaService {
  private prisma: ExtendedPrismaClient

  constructor() {
    this.prisma = new PrismaClient({
      log: this.getLogLevels(),
      errorFormat: config.app.isDevelopment ? 'pretty' : 'minimal'
    }) as ExtendedPrismaClient

    this.setupMiddleware()
    this.setupEventHandlers()
    this.setupShutdownHooks()
  }

  private getLogLevels(): Prisma.LogLevel[] {
    if (config.app.isProduction) {
      return ['error', 'warn']
    }
    if (config.app.isDevelopment) {
      return ['query', 'error', 'warn', 'info']
    }
    return ['error']
  }

  private setupMiddleware() {
    // Soft delete middleware
    this.prisma.$use(async (params, next) => {
      // Handle soft deletes for findUnique, findFirst, findMany
      if (params.model && ['findUnique', 'findFirst', 'findMany'].includes(params.action)) {
        if (!params.args) params.args = {}
        if (!params.args.where) params.args.where = {}

        // Only filter if not explicitly looking for deleted records
        if (!params.args.where.deletedAt) {
          params.args.where.deletedAt = null
        }
      }

      // Convert delete to soft delete
      if (params.model && params.action === 'delete') {
        params.action = 'update'
        params.args.data = { deletedAt: new Date() }
      }

      // Convert deleteMany to soft delete
      if (params.model && params.action === 'deleteMany') {
        params.action = 'updateMany'
        if (!params.args) params.args = {}
        params.args.data = { deletedAt: new Date() }
      }

      return next(params)
    })

    // Query performance monitoring
    this.prisma.$use(async (params, next) => {
      const start = Date.now()
      const result = await next(params)
      const duration = Date.now() - start

      // Log slow queries
      if (duration > 1000) {
        logger.warn('Slow database query detected', {
          model: params.model,
          action: params.action,
          duration,
          args: params.args
        })
      }

      return result
    })

    // Audit logging middleware
    this.prisma.$use(async (params, next) => {
      const result = await next(params)

      // Skip audit logging for audit log model itself
      if (params.model === 'AuditLog') return result

      // Log write operations
      if (params.model && ['create', 'update', 'delete', 'deleteMany', 'updateMany'].includes(params.action)) {
        const userId = (params.args as any)?.userId || 'system'

        try {
          await this.prisma.auditLog.create({
            data: {
              userId: userId === 'system' ? null : userId,
              action: params.action,
              entity: params.model,
              entityId: result?.id || null,
              newValues: params.action === 'create' ? result : params.args.data,
              oldValues: null, // You could fetch old values if needed
              ipAddress: (params as any).context?.ipAddress,
              userAgent: (params as any).context?.userAgent
            }
          })
        } catch (error) {
          logger.error('Failed to create audit log', error as Error)
        }
      }

      return result
    })
  }

  private setupEventHandlers() {
    // Log queries in development
    if (config.app.isDevelopment && config.database.logging) {
      this.prisma.$on('query' as never, (e: any) => {
        logger.debug('Database query', {
          query: e.query,
          params: e.params,
          duration: e.duration,
          target: e.target
        })
      })
    }

    // Always log errors
    this.prisma.$on('error' as never, (e: any) => {
      logger.error('Database error', e)
    })

    // Log warnings
    this.prisma.$on('warn' as never, (e: any) => {
      logger.warn('Database warning', e)
    })
  }

  private setupShutdownHooks() {
    // Graceful shutdown
    process.on('beforeExit', async () => {
      await this.disconnect()
    })

    process.on('SIGINT', async () => {
      await this.disconnect()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await this.disconnect()
      process.exit(0)
    })
  }

  // Get Prisma client instance
  get client(): PrismaClient {
    return this.prisma
  }

  // Connect to database
  async connect(): Promise<void> {
    try {
      await this.prisma.$connect()
      logger.info('Database connected successfully')
    } catch (error) {
      logger.error('Failed to connect to database', error as Error)
      throw error
    }
  }

  // Disconnect from database
  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect()
      logger.info('Database disconnected successfully')
    } catch (error) {
      logger.error('Failed to disconnect from database', error as Error)
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      logger.error('Database ping failed', error as Error)
      return false
    }
  }

  // Transaction helper
  async transaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
    options?: { maxWait?: number; timeout?: number }
  ): Promise<T> {
    return this.prisma.$transaction(fn, options)
  }

  // Pagination helper
  async paginate<T, K extends keyof PrismaClient>(
    model: K,
    {
      page = 1,
      limit = 20,
      where,
      orderBy,
      include
    }: {
      page?: number
      limit?: number
      where?: any
      orderBy?: any
      include?: any
    }
  ) {
    const skip = (page - 1) * limit

    // Get model from Prisma client
    const prismaModel = this.prisma[model] as any

    // Execute queries in parallel
    const [data, total] = await Promise.all([
      prismaModel.findMany({
        where,
        orderBy,
        include,
        skip,
        take: limit
      }),
      prismaModel.count({ where })
    ])

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  }

  // Batch operations helper
  async batchCreate<T>(
    model: keyof PrismaClient,
    data: T[],
    batchSize = 1000
  ): Promise<number> {
    const prismaModel = this.prisma[model] as any
    let created = 0

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      const result = await prismaModel.createMany({
        data: batch,
        skipDuplicates: true
      })
      created += result.count
    }

    return created
  }

  // Upsert many helper
  async upsertMany<T extends { id?: string }>(
    model: keyof PrismaClient,
    data: T[],
    uniqueFields: string[]
  ): Promise<void> {
    const prismaModel = this.prisma[model] as any

    await this.transaction(async (tx) => {
      for (const item of data) {
        const where: any = {}
        for (const field of uniqueFields) {
          where[field] = (item as any)[field]
        }

        await (tx[model] as any).upsert({
          where,
          create: item,
          update: item
        })
      }
    })
  }

  // Execute raw SQL
  async raw<T = any>(sql: string, params?: any[]): Promise<T> {
    return this.prisma.$queryRawUnsafe<T>(sql, ...(params || []))
  }

  // Get database statistics
  async getStats() {
    const [
      userCount,
      sessionCount,
      jobCount,
      dbSize
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
      this.prisma.job.count({ where: { status: 'PENDING' } }),
      this.raw<{ size: string }[]>(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `)
    ])

    return {
      users: userCount,
      activeSessions: sessionCount,
      pendingJobs: jobCount,
      databaseSize: dbSize[0]?.size || 'unknown'
    }
  }
}

// Create singleton instance
export const prisma = new PrismaService()
