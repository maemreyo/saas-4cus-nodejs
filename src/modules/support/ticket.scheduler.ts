import { Service } from 'typedi';
import { queueService } from '@shared/queue/queue.service';
import { logger } from '@shared/logger';

@Service()
export class TicketScheduler {
  /**
   * Initialize scheduled jobs for ticket system
   */
  async initialize(): Promise<void> {
    logger.info('Initializing ticket scheduler');

    // Auto-close inactive tickets - Run every day at 2 AM
    await queueService.addJob(
      'ticket',
      'autoCloseInactive',
      {},
      {
        repeat: {
          cron: '0 2 * * *' // Every day at 2 AM
        }
      }
    );

    // Clean up old ticket data - Run weekly on Sunday at 3 AM
    await queueService.addJob(
      'ticket',
      'cleanupOldTickets',
      {},
      {
        repeat: {
          cron: '0 3 * * 0' // Every Sunday at 3 AM
        }
      }
    );

    // Generate SLA reports - Run daily at 6 AM
    await queueService.addJob(
      'ticket',
      'generateSLAReport',
      {},
      {
        repeat: {
          cron: '0 6 * * *' // Every day at 6 AM
        }
      }
    );

    // Send agent performance summaries - Run weekly on Monday at 9 AM
    await queueService.addJob(
      'ticket',
      'sendAgentPerformanceSummary',
      {},
      {
        repeat: {
          cron: '0 9 * * 1' // Every Monday at 9 AM
        }
      }
    );

    // Check for tickets pending response - Run every 4 hours
    await queueService.addJob(
      'ticket',
      'checkPendingResponses',
      {},
      {
        repeat: {
          cron: '0 */4 * * *' // Every 4 hours
        }
      }
    );

    // Update ticket statistics cache - Run every hour
    await queueService.addJob(
      'ticket',
      'updateTicketStatistics',
      {},
      {
        repeat: {
          cron: '0 * * * *' // Every hour
        }
      }
    );

    logger.info('Ticket scheduler initialized successfully');
  }

  /**
   * Cancel all scheduled jobs
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down ticket scheduler');

    // In a real implementation, we would track job IDs
    // and cancel them individually
  }
}

// Create singleton instance
export const ticketScheduler = new TicketScheduler();