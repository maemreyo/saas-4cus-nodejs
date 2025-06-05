import { Job } from 'bullmq';
import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { queueService } from '../queue.service';
import { logger } from '@shared/logger';

@Service()
export class CleanupProcessor {
  constructor() {
    this.registerProcessors();
  }

  private registerProcessors() {
    queueService.registerProcessor('cleanup', 'expiredTokens', this.cleanExpiredTokens.bind(this));
    queueService.registerProcessor('cleanup', 'oldSessions', this.cleanOldSessions.bind(this));
    queueService.registerProcessor('cleanup', 'tempFiles', this.cleanTempFiles.bind(this));
  }

  async cleanExpiredTokens(job: Job) {
    const result = await prisma.client.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    logger.info('Expired tokens cleaned', { count: result.count });

    return { deleted: result.count };
  }

  async cleanOldSessions(job: Job) {
    const result = await prisma.client.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    logger.info('Old sessions cleaned', { count: result.count });

    return { deleted: result.count };
  }

  async cleanTempFiles(job: Job) {
    // Implementation for cleaning temporary files
    // This would depend on your file storage implementation

    return { deleted: 0 };
  }
}
