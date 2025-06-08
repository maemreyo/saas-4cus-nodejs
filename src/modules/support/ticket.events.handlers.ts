import { Service } from 'typedi';
import { OnEvent } from '@shared/events/event-bus';
import { logger } from '@shared/logger';
import { TicketEvents } from './ticket.events';
import { prisma } from '@infrastructure/database/prisma.service';
import { queueService } from '@shared/queue/queue.service';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { WebhookService } from '@modules/webhooks/webhook.service';
import { redis } from '@/infrastructure/cache/redis.service';

@Service()
export class TicketEventHandlers {
  constructor(
    private analyticsService: AnalyticsService,
    private webhookService: WebhookService,
  ) {}

  @OnEvent(TicketEvents.TICKET_CREATED)
  async handleTicketCreated(payload: any) {
    logger.info('Ticket created event', payload);

    // Track analytics
    await this.analyticsService.track({
      userId: payload.userId,
      event: 'ticket.created',
      properties: {
        ticketId: payload.ticketId,
        number: payload.number,
      },
    });

    // Schedule satisfaction survey for 2 days after resolution
    // Will be cancelled if ticket is reopened
  }

  @OnEvent(TicketEvents.TICKET_UPDATED)
  async handleTicketUpdated(payload: any) {
    logger.info('Ticket updated event', payload);

    // Track specific changes
    for (const change of payload.changes) {
      await this.analyticsService.track({
        userId: payload.userId,
        event: `ticket.${change.type.toLowerCase()}`,
        properties: {
          ticketId: payload.ticketId,
          oldValue: change.oldValue,
          newValue: change.newValue,
        },
      });
    }
  }

  @OnEvent(TicketEvents.TICKET_CLOSED)
  async handleTicketClosed(payload: any) {
    logger.info('Ticket closed event', payload);

    // Schedule satisfaction survey after 24 hours
    await queueService.addJob(
      'ticket',
      'sendSatisfactionSurvey',
      { ticketId: payload.ticketId },
      { delay: 24 * 60 * 60 * 1000 }, // 24 hours
    );

    // Calculate and track resolution time
    const ticket = await prisma.client.ticket.findUnique({
      where: { id: payload.ticketId },
    });

    if (ticket) {
      const resolutionTime = ticket.closedAt!.getTime() - ticket.createdAt.getTime();

      await this.analyticsService.track({
        userId: payload.userId,
        event: 'ticket.closed',
        properties: {
          ticketId: payload.ticketId,
          resolutionTimeMs: resolutionTime,
          resolutionTimeHours: Math.round(resolutionTime / (1000 * 60 * 60)),
        },
      });
    }
  }

  @OnEvent(TicketEvents.TICKET_REOPENED)
  async handleTicketReopened(payload: any) {
    logger.info('Ticket reopened event', payload);

    // Cancel any scheduled satisfaction surveys
    // In a real implementation, we'd track job IDs to cancel them
  }

  @OnEvent(TicketEvents.TICKET_ASSIGNED)
  async handleTicketAssigned(payload: any) {
    logger.info('Ticket assigned event', payload);

    // Track assignment
    await this.analyticsService.track({
      userId: payload.assignedBy,
      event: 'ticket.assigned',
      properties: {
        ticketId: payload.ticketId,
        assigneeId: payload.assigneeId,
      },
    });

    // Update assignee's workload metrics
    await this.updateAgentWorkloadMetrics(payload.assigneeId);
  }

  @OnEvent(TicketEvents.TICKET_MESSAGE_ADDED)
  async handleTicketMessageAdded(payload: any) {
    logger.info('Ticket message added event', payload);

    if (!payload.internal) {
      // Update ticket status if needed
      const ticket = await prisma.client.ticket.findUnique({
        where: { id: payload.ticketId },
      });

      if (ticket) {
        // Track response time for first agent response
        if (!ticket.firstResponseAt) {
          const responseTime = Date.now() - ticket.createdAt.getTime();

          await this.analyticsService.track({
            event: 'ticket.first_response',
            properties: {
              ticketId: payload.ticketId,
              responseTimeMs: responseTime,
              responseTimeMinutes: Math.round(responseTime / (1000 * 60)),
            },
          });
        }
      }
    }
  }

  @OnEvent(TicketEvents.TICKET_SLA_WARNING)
  async handleSLAWarning(payload: any) {
    logger.warn('Ticket SLA warning', payload);

    // Track SLA warning
    await this.analyticsService.track({
      event: 'ticket.sla_warning',
      properties: {
        ticketId: payload.ticketId,
        slaType: payload.type,
        slaMinutes: payload.slaMinutes,
      },
    });

    // Send alerts to management
    const ticket = await prisma.client.ticket.findUnique({
      where: { id: payload.ticketId },
      include: { assignee: true },
    });

    if (ticket && ticket.priority === 'CRITICAL') {
      // Escalate immediately for critical tickets
      await this.escalateToManagement(ticket);
    }
  }

  @OnEvent(TicketEvents.TICKET_SLA_BREACHED)
  async handleSLABreached(payload: any) {
    logger.error('Ticket SLA breached', payload);

    // Track SLA breach
    await this.analyticsService.track({
      event: 'ticket.sla_breached',
      properties: {
        ticketId: payload.ticketId,
        slaType: payload.type,
        slaMinutes: payload.slaMinutes,
      },
    });

    // Update SLA metrics
    await this.updateSLAMetrics(payload.ticketId, payload.type);
  }

  @OnEvent(TicketEvents.TICKET_RATED)
  async handleTicketRated(payload: any) {
    logger.info('Ticket rated event', payload);

    // Track satisfaction rating
    await this.analyticsService.track({
      userId: payload.userId,
      event: 'ticket.rated',
      properties: {
        ticketId: payload.ticketId,
        rating: payload.rating,
      },
    });

    // Update satisfaction metrics
    await this.updateSatisfactionMetrics(payload.rating);

    // If low rating, create follow-up task
    if (payload.rating <= 2) {
      await this.createFollowUpTask(payload.ticketId, payload.rating);
    }
  }

  @OnEvent(TicketEvents.TICKET_ESCALATED)
  async handleTicketEscalated(payload: any) {
    logger.warn('Ticket escalated', payload);

    // Track escalation
    await this.analyticsService.track({
      event: 'ticket.escalated',
      properties: {
        ticketId: payload.ticketId,
        reason: payload.reason,
      },
    });
  }

  @OnEvent(TicketEvents.TICKET_AUTO_CLOSED)
  async handleTicketAutoClosed(payload: any) {
    logger.info('Ticket auto-closed', payload);

    // Track auto-closure
    await this.analyticsService.track({
      event: 'ticket.auto_closed',
      properties: {
        ticketId: payload.ticketId,
      },
    });
  }

  // Helper methods

  private async updateAgentWorkloadMetrics(agentId: string) {
    const [openTickets, todayTickets] = await Promise.all([
      prisma.client.ticket.count({
        where: {
          assigneeId: agentId,
          status: { in: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER'] },
        },
      }),
      prisma.client.ticket.count({
        where: {
          assigneeId: agentId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Store in Redis for real-time dashboard
    await redis.hset(`agent:workload:${agentId}`, 'openTickets', openTickets);
    await redis.hset(`agent:workload:${agentId}`, 'todayTickets', todayTickets);
    await redis.hset(`agent:workload:${agentId}`, 'lastUpdated', new Date().toISOString());
  }

  private async updateSLAMetrics(ticketId: string, slaType: string) {
    const today = new Date().toISOString().split('T')[0];
    const key = `sla:breaches:${today}`;

    await redis.hincrby(key, slaType, 1);
    await redis.expire(key, 90 * 24 * 60 * 60); // Keep for 90 days
  }

  private async updateSatisfactionMetrics(rating: number) {
    const today = new Date().toISOString().split('T')[0];
    const key = `satisfaction:${today}`;

    await redis.hincrby(key, `rating_${rating}`, 1);
    await redis.expire(key, 90 * 24 * 60 * 60); // Keep for 90 days
  }

  private async escalateToManagement(ticket: any) {
    // Create high-priority notification
    await queueService.addJob(
      'notification',
      'urgentNotification',
      {
        type: 'ticket_escalation',
        ticketId: ticket.id,
        ticketNumber: ticket.number,
        priority: ticket.priority,
        subject: ticket.subject,
      },
      { priority: 1 }, // High priority job
    );
  }

  private async createFollowUpTask(ticketId: string, rating: number) {
    // In a real implementation, this might create a task in a task management system
    // or flag the ticket for review
    await prisma.client.ticketActivity.create({
      data: {
        ticketId,
        type: 'INTERNAL_NOTE_ADDED',
        description: `Low satisfaction rating (${rating}/5) - requires follow-up`,
        metadata: {
          autoGenerated: true,
          reason: 'low_satisfaction',
        },
      },
    });
  }
}
