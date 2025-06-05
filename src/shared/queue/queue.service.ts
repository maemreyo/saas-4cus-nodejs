import { Queue, Worker, Job, JobsOptions, WorkerOptions } from 'bullmq'
import { Service } from 'typedi'
import { logger } from '@shared/logger'
import { config } from '@infrastructure/config'
import { redis } from '@infrastructure/cache/redis.service'

export interface JobOptions {
  delay?: number
  attempts?: number
  backoff?: {
    type: 'exponential' | 'fixed'
    delay: number
  }
  removeOnComplete?: boolean | number
  removeOnFail?: boolean | number
  priority?: number
  repeat?: {
    every?: number
    cron?: string
    limit?: number
  }
}

export type JobProcessor<T = any> = (job: Job<T>) => Promise<any>

interface QueueConfig {
  name: string
  processor?: JobProcessor
  workerOptions?: Partial<WorkerOptions>
}

@Service()
export class QueueService {
  private queues: Map<string, Queue> = new Map()
  private workers: Map<string, Worker> = new Map()
  private processors: Map<string, Map<string, JobProcessor>> = new Map()

  constructor() {
    this.initializeDefaultQueues()
  }

  private initializeDefaultQueues() {
    const defaultQueues: QueueConfig[] = [
      { name: 'email' },
      { name: 'notification' },
      { name: 'export' },
      { name: 'import' },
      { name: 'webhook' },
      { name: 'cleanup' }
    ]

    for (const queueConfig of defaultQueues) {
      this.createQueue(queueConfig.name)
    }
  }

  createQueue(name: string): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name)!
    }

    const connection = {
      host: config.queue.redis.host,
      port: config.queue.redis.port,
      password: config.queue.redis.password
    }

    // Create queue
    const queue = new Queue(name, {
      connection,
      defaultJobOptions: {
        removeOnComplete: {
          age: 3600, // 1 hour
          count: 1000
        },
        removeOnFail: {
          age: 86400, // 24 hours
          count: 5000
        }
      }
    })

    // Create worker
    const worker = new Worker(
      name,
      async (job: Job) => {
        const processor = this.getProcessor(name, job.name)
        if (!processor) {
          throw new Error(`No processor found for job ${job.name} in queue ${name}`)
        }
        return processor(job)
      },
      {
        connection,
        concurrency: config.queue.concurrency,
        maxStalledCount: config.queue.maxStalledCount,
        stalledInterval: config.queue.stalledInterval
      }
    )

    this.setupWorkerEvents(worker, name)

    this.queues.set(name, queue)
    this.workers.set(name, worker)

    logger.info(`Queue ${name} created`)

    return queue
  }

  private setupWorkerEvents(worker: Worker, queueName: string) {
    worker.on('completed', (job: Job) => {
      logger.info('Job completed', {
        queue: queueName,
        jobId: job.id,
        jobName: job.name,
        duration: job.finishedOn! - job.processedOn!
      })
    })

    worker.on('failed', (job: Job | undefined, error: Error) => {
      logger.error('Job failed', error, {
        queue: queueName,
        jobId: job?.id,
        jobName: job?.name,
        attemptsMade: job?.attemptsMade,
        error: error.message
      })
    })

    worker.on('active', (job: Job) => {
      logger.debug('Job started', {
        queue: queueName,
        jobId: job.id,
        jobName: job.name
      })
    })

    worker.on('stalled', (jobId: string) => {
      logger.warn('Job stalled', {
        queue: queueName,
        jobId
      })
    })

    worker.on('error', (error: Error) => {
      logger.error('Worker error', error, {
        queue: queueName
      })
    })
  }

  // Register job processor
  registerProcessor<T = any>(
    queueName: string,
    jobName: string,
    processor: JobProcessor<T>
  ): void {
    if (!this.processors.has(queueName)) {
      this.processors.set(queueName, new Map())
    }

    this.processors.get(queueName)!.set(jobName, processor)
    logger.info(`Processor registered for ${queueName}:${jobName}`)
  }

  // Get processor for job
  private getProcessor(queueName: string, jobName: string): JobProcessor | undefined {
    return this.processors.get(queueName)?.get(jobName)
  }

  // Add job to queue
  async addJob<T = any>(
    queueName: string,
    jobName: string,
    data: T,
    options?: JobOptions
  ): Promise<Job<T>> {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    const jobOptions: JobsOptions = {
      attempts: options?.attempts || 3,
      backoff: options?.backoff || { type: 'exponential', delay: 2000 },
      delay: options?.delay,
      priority: options?.priority,
      repeat: options?.repeat,
      removeOnComplete: options?.removeOnComplete ?? true,
      removeOnFail: options?.removeOnFail ?? false
    }

    const job = await queue.add(jobName, data, jobOptions)

    logger.info('Job added', {
      queue: queueName,
      jobId: job.id,
      jobName,
      delay: options?.delay,
      repeat: options?.repeat
    })

    return job
  }

  // Add bulk jobs
  async addBulkJobs<T = any>(
    queueName: string,
    jobs: Array<{
      name: string
      data: T
      opts?: JobOptions
    }>
  ): Promise<Job<T>[]> {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    const bulkJobs = jobs.map(job => ({
      name: job.name,
      data: job.data,
      opts: {
        attempts: job.opts?.attempts || 3,
        backoff: job.opts?.backoff || { type: 'exponential', delay: 2000 },
        delay: job.opts?.delay,
        removeOnComplete: job.opts?.removeOnComplete ?? true,
        removeOnFail: job.opts?.removeOnFail ?? false
      } as JobsOptions
    }))

    const addedJobs = await queue.addBulk(bulkJobs)

    logger.info('Bulk jobs added', {
      queue: queueName,
      count: addedJobs.length
    })

    return addedJobs
  }

  // Get job by ID
  async getJob(queueName: string, jobId: string): Promise<Job | undefined> {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    return queue.getJob(jobId)
  }

  // Get job counts
  async getJobCounts(queueName: string) {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    return queue.getJobCounts()
  }

  // Get queue metrics
  async getMetrics(queueName: string) {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    const [counts, completed, failed] = await Promise.all([
      queue.getJobCounts(),
      queue.getCompletedCount(),
      queue.getFailedCount()
    ])

    return {
      ...counts,
      completed,
      failed,
      queueName
    }
  }

  // Pause queue
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    await queue.pause()
    logger.info(`Queue ${queueName} paused`)
  }

  // Resume queue
  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    await queue.resume()
    logger.info(`Queue ${queueName} resumed`)
  }

  // Clean queue
  async cleanQueue(
    queueName: string,
    grace: number = 0,
    limit: number = 100,
    status?: 'completed' | 'failed'
  ): Promise<string[]> {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    const jobs = await queue.clean(grace, limit, status)
    logger.info(`Queue ${queueName} cleaned`, { removed: jobs.length })

    return jobs
  }

  // Obliterate queue (remove all jobs)
  async obliterateQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    await queue.obliterate()
    logger.info(`Queue ${queueName} obliterated`)
  }

  // Close all connections
  async close(): Promise<void> {
    await Promise.all([
      ...Array.from(this.workers.values()).map(w => w.close()),
      ...Array.from(this.queues.values()).map(q => q.close())
    ])

    logger.info('All queues closed')
  }

  // Get all queues
  getQueues(): string[] {
    return Array.from(this.queues.keys())
  }

  // Health check
  async healthCheck(): Promise<Record<string, any>> {
    const results: Record<string, any> = {}

    for (const [name, queue] of this.queues) {
      try {
        const counts = await queue.getJobCounts()
        results[name] = {
          status: 'healthy',
          counts
        }
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          error: (error as Error).message
        }
      }
    }

    return results
  }
}

// Create singleton instance
export const queueService = new QueueService()

// Queue decorator
export function QueueProcessor(queueName: string, jobName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    queueService.registerProcessor(queueName, jobName, async (job: Job) => {
      return originalMethod.call(target, job)
    })

    return descriptor
  }
}
