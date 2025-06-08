import { Job } from 'bullmq';
import Container, { Service } from 'typedi';
import { queueService } from '@shared/queue/queue.service';
import { EmailService } from '@shared/services/email.service';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { TicketEvents } from './ticket.events';
import { TicketStatus } from '@prisma/client';

@Service()
export class TicketQueueProcessor {
  constructor(
    private emailService: EmailService,
    private eventBus: EventBus
  ) {
    this.registerProcessors();
  }

  private registerProcessors() {
    // SLA monitoring
    queueService.registerProcessor('ticket', 'checkFirstResponseSLA', this.checkFirstResponseSLA.bind(this));
    queueService.registerProcessor('ticket', 'checkResolutionSLA', this.checkResolutionSLA.bind(this));

    // Auto-close inactive tickets
    queueService.registerProcessor('ticket', 'autoCloseInactive', this.autoCloseInactiveTickets.bind(this));

    // Notifications
    queueService.registerProcessor('notification', 'ticketCreated', this.notifyTicketCreated.bind(this));
    queueService.registerProcessor('notification', 'ticketAssigned', this.notifyTicketAssigned.bind(this));
    queueService.registerProcessor('notification', 'ticketMessageAdded', this.notifyTicketMessageAdded.bind(this));

    // Scheduled reminders
    queueService.registerProcessor('ticket', 'sendReminder', this.sendTicketReminder.bind(this));

    // Satisfaction survey
    queueService.registerProcessor('ticket', 'sendSatisfactionSurvey', this.sendSatisfactionSurvey.bind(this));
  }

  /**
   * Check first response SLA
   */
  async checkFirstResponseSLA(job: Job<{ ticketId: string; type: 'warning' | 'breach' }>) {
    const { ticketId, type } = job.data;

    try {
      const ticket = await prisma.client.ticket.findUnique({
        where: { id: ticketId },
        include: {
          user: true,
          assignee: true
        }
      });

      if (!ticket) {
        logger.warn('Ticket not found for SLA check', { ticketId });
        return;
      }

      // Skip if already responded
      if (ticket.firstResponseAt) {
        return;
      }

      // Skip if ticket is closed
      if (ticket.status === TicketStatus.CLOSED) {
        return;
      }

      if (type === 'warning') {
        // Send warning notification
        await this.eventBus.emit(TicketEvents.TICKET_SLA_WARNING, {
          ticketId,
          type: 'firstResponse',
          slaMinutes: ticket.firstResponseSla,
          timestamp: new Date()
        });

        // Send email to assignee
        if (ticket.assignee) {
          await this.emailService.queue({
            to: ticket.assignee.email,
            subject: `SLA Warning: Ticket #${ticket.number} needs response`,
            template: 'ticket-sla-warning',
            context: {
              ticketNumber: ticket.number,
              subject: ticket.subject,
              priority: ticket.priority,
              timeRemaining: Math.round(ticket.firstResponseSla! * 0.2) // 20% remaining
            }
          });
        }
      } else if (type === 'breach') {
        // Mark SLA as breached
        await prisma.client.ticket.update({
          where: { id: ticketId },
          data: { slaBreached: true }
        });

        await this.eventBus.emit(TicketEvents.TICKET_SLA_BREACHED, {
          ticketId,
          type: 'firstResponse',
          slaMinutes: ticket.firstResponseSla,
          timestamp: new Date()
        });

        // Escalate ticket
        await this.escalateTicket(ticketId);
      }
    } catch (error) {
      logger.error('Error checking first response SLA', error as Error, { ticketId });
      throw error;
    }
  }

  /**
   * Check resolution SLA
   */
  async checkResolutionSLA(job: Job<{ ticketId: string; type: 'warning' | 'breach' }>) {
    const { ticketId, type } = job.data;

    try {
      const ticket = await prisma.client.ticket.findUnique({
        where: { id: ticketId },
        include: {
          user: true,
          assignee: true
        }
      });

      if (!ticket) {
        logger.warn('Ticket not found for SLA check', { ticketId });
        return;
      }

      // Skip if already resolved
      if (ticket.resolutionAt || ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED) {
        return;
      }

      if (type === 'warning') {
        await this.eventBus.emit(TicketEvents.TICKET_SLA_WARNING, {
          ticketId,
          type: 'resolution',
          slaMinutes: ticket.resolutionSla,
          timestamp: new Date()
        });

        if (ticket.assignee) {
          await this.emailService.queue({
            to: ticket.assignee.email,
            subject: `SLA Warning: Ticket #${ticket.number} needs resolution`,
            template: 'ticket-sla-warning',
            context: {
              ticketNumber: ticket.number,
              subject: ticket.subject,
              priority: ticket.priority,
              timeRemaining: Math.round(ticket.resolutionSla! * 0.2)
            }
          });
        }
      } else if (type === 'breach') {
        await prisma.client.ticket.update({
          where: { id: ticketId },
          data: { slaBreached: true }
        });

        await this.eventBus.emit(TicketEvents.TICKET_SLA_BREACHED, {
          ticketId,
          type: 'resolution',
          slaMinutes: ticket.resolutionSla,
          timestamp: new Date()
        });

        await this.escalateTicket(ticketId);
      }
    } catch (error) {
      logger.error('Error checking resolution SLA', error as Error, { ticketId });
      throw error;
    }
  }

  /**
   * Auto-close inactive tickets
   */
  async autoCloseInactiveTickets(job: Job) {
    try {
      const inactiveDays = 7; // Close tickets inactive for 7 days
      const warningDays = 5; // Send warning after 5 days

      const inactiveDate = new Date();
      inactiveDate.setDate(inactiveDate.getDate() - inactiveDays);

      const warningDate = new Date();
      warningDate.setDate(warningDate.getDate() - warningDays);

      // Find tickets to close
      const ticketsToClose = await prisma.client.ticket.findMany({
        where: {
          status: {
            in: [TicketStatus.WAITING_FOR_CUSTOMER, TicketStatus.RESOLVED]
          },
          updatedAt: { lt: inactiveDate },
          deletedAt: null
        },
        include: { user: true }
      });

      // Close tickets
      for (const ticket of ticketsToClose) {
        await prisma.client.ticket.update({
          where: { id: ticket.id },
          data: {
            status: TicketStatus.CLOSED,
            closedAt: new Date(),
            metadata: {
              ...(ticket.metadata as any || {}),
              autoClosedAt: new Date(),
              autoCloseReason: 'inactivity'
            }
          }
        });

        // Send notification
        await this.emailService.queue({
          to: ticket.user.email,
          subject: `Ticket #${ticket.number} has been automatically closed`,
          template: 'ticket-auto-closed',
          context: {
            ticketNumber: ticket.number,
            subject: ticket.subject,
            inactiveDays
          }
        });

        await this.eventBus.emit(TicketEvents.TICKET_AUTO_CLOSED, {
          ticketId: ticket.id,
          timestamp: new Date()
        });
      }

      // Find tickets to warn
      const ticketsToWarn = await prisma.client.ticket.findMany({
        where: {
          status: {
            in: [TicketStatus.WAITING_FOR_CUSTOMER, TicketStatus.RESOLVED]
          },
          updatedAt: {
            gte: inactiveDate,
            lt: warningDate
          },
          deletedAt: null,
          metadata: {
            path: ['autoCloseWarned'],
            equals: undefined
          }
        },
        include: { user: true }
      });

      // Send warnings
      for (const ticket of ticketsToWarn) {
        await this.emailService.queue({
          to: ticket.user.email,
          subject: `Ticket #${ticket.number} will be closed soon due to inactivity`,
          template: 'ticket-auto-close-warning',
          context: {
            ticketNumber: ticket.number,
            subject: ticket.subject,
            daysRemaining: inactiveDays - warningDays
          }
        });

        // Mark as warned
        await prisma.client.ticket.update({
          where: { id: ticket.id },
          data: {
            metadata: {
              ...(ticket.metadata as any || {}),
              autoCloseWarned: true,
              autoCloseWarnedAt: new Date()
            }
          }
        });

        await this.eventBus.emit(TicketEvents.TICKET_AUTO_CLOSE_WARNING, {
          ticketId: ticket.id,
          timestamp: new Date()
        });
      }

      logger.info('Auto-close inactive tickets completed', {
        closed: ticketsToClose.length,
        warned: ticketsToWarn.length
      });
    } catch (error) {
      logger.error('Error auto-closing inactive tickets', error as Error);
      throw error;
    }
  }

  /**
   * Notify ticket created
   */
  async notifyTicketCreated(job: Job<{ ticketId: string; userId: string }>) {
    const { ticketId } = job.data;

    try {
      const ticket = await prisma.client.ticket.findUnique({
        where: { id: ticketId },
        include: {
          user: true,
          category: true
        }
      });

      if (!ticket) return;

      // Send confirmation email to customer
      await this.emailService.queue({
        to: ticket.user.email,
        subject: `Ticket #${ticket.number}: ${ticket.subject}`,
        template: 'ticket-created',
        context: {
          ticketNumber: ticket.number,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category?.name,
          priority: ticket.priority
        }
      });

      // Notify support team
      const supportEmails = await this.getSupportTeamEmails(ticket.categoryId);
      if (supportEmails.length > 0) {
        await this.emailService.queue({
          to: supportEmails,
          subject: `New Ticket #${ticket.number}: ${ticket.subject}`,
          template: 'ticket-created-agent',
          context: {
            ticketNumber: ticket.number,
            subject: ticket.subject,
            description: ticket.description,
            category: ticket.category?.name,
            priority: ticket.priority,
            customerName: ticket.user.displayName || ticket.user.email
          }
        });
      }
    } catch (error) {
      logger.error('Error notifying ticket created', error as Error, { ticketId });
      throw error;
    }
  }

  /**
   * Notify ticket assigned
   */
  async notifyTicketAssigned(job: Job<{ ticketId: string; assigneeId: string; assignedBy: string }>) {
    const { ticketId, assigneeId } = job.data;

    try {
      const ticket = await prisma.client.ticket.findUnique({
        where: { id: ticketId },
        include: {
          user: true,
          assignee: true
        }
      });

      if (!ticket || !ticket.assignee) return;

      // Notify assignee
      await this.emailService.queue({
        to: ticket.assignee.email,
        subject: `You've been assigned to Ticket #${ticket.number}`,
        template: 'ticket-assigned',
        context: {
          ticketNumber: ticket.number,
          subject: ticket.subject,
          priority: ticket.priority,
          customerName: ticket.user.displayName || ticket.user.email
        }
      });
    } catch (error) {
      logger.error('Error notifying ticket assigned', error as Error, { ticketId });
      throw error;
    }
  }

  /**
   * Notify ticket message added
   */
  async notifyTicketMessageAdded(job: Job<{ ticketId: string; messageId: string; userId: string }>) {
    const { ticketId, messageId } = job.data;

    try {
      const [ticket, message] = await Promise.all([
        prisma.client.ticket.findUnique({
          where: { id: ticketId },
          include: {
            user: true,
            assignee: true
          }
        }),
        prisma.client.ticketMessage.findUnique({
          where: { id: messageId },
          include: { user: true }
        })
      ]);

      if (!ticket || !message) return;

      // Determine recipients
      const recipients: string[] = [];
      const isCustomerMessage = message.userId === ticket.userId;

      if (isCustomerMessage) {
        // Notify assignee and watchers
        if (ticket.assignee) {
          recipients.push(ticket.assignee.email);
        }
      } else {
        // Notify customer
        recipients.push(ticket.user.email);
      }

      if (recipients.length > 0) {
        await this.emailService.queue({
          to: recipients,
          subject: `Re: Ticket #${ticket.number}: ${ticket.subject}`,
          template: 'ticket-message',
          context: {
            ticketNumber: ticket.number,
            subject: ticket.subject,
            message: message.content,
            senderName: message.user.displayName || message.user.email,
            isCustomerMessage
          }
        });
      }
    } catch (error) {
      logger.error('Error notifying ticket message added', error as Error, { ticketId, messageId });
      throw error;
    }
  }

  /**
   * Send ticket reminder
   */
  async sendTicketReminder(job: Job<{ ticketId: string; reminderType: string }>) {
    const { ticketId, reminderType } = job.data;

    try {
      const ticket = await prisma.client.ticket.findUnique({
        where: { id: ticketId },
        include: {
          user: true,
          assignee: true
        }
      });

      if (!ticket) return;

      // Send reminder based on type
      switch (reminderType) {
        case 'pending_response':
          if (ticket.assignee) {
            await this.emailService.queue({
              to: ticket.assignee.email,
              subject: `Reminder: Ticket #${ticket.number} needs response`,
              template: 'ticket-reminder',
              context: {
                ticketNumber: ticket.number,
                subject: ticket.subject,
                daysSinceUpdate: Math.floor((Date.now() - ticket.updatedAt.getTime()) / (1000 * 60 * 60 * 24))
              }
            });
          }
          break;
      }

      await this.eventBus.emit(TicketEvents.TICKET_REMINDER, {
        ticketId,
        reminderType,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error sending ticket reminder', error as Error, { ticketId });
      throw error;
    }
  }

  /**
   * Send satisfaction survey
   */
  async sendSatisfactionSurvey(job: Job<{ ticketId: string }>) {
    const { ticketId } = job.data;

    try {
      const ticket = await prisma.client.ticket.findUnique({
        where: { id: ticketId },
        include: { user: true }
      });

      if (!ticket) return;

      // Skip if already rated
      if (ticket.satisfactionRating) return;

      const surveyUrl = `${process.env.APP_URL}/tickets/${ticket.number}/rate`;

      await this.emailService.queue({
        to: ticket.user.email,
        subject: `How was your experience with Ticket #${ticket.number}?`,
        template: 'ticket-satisfaction-survey',
        context: {
          ticketNumber: ticket.number,
          subject: ticket.subject,
          surveyUrl
        }
      });
    } catch (error) {
      logger.error('Error sending satisfaction survey', error as Error, { ticketId });
      throw error;
    }
  }

  /**
   * Escalate ticket
   */
  private async escalateTicket(ticketId: string): Promise<void> {
    const ticket = await prisma.client.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) return;

    // Update priority if not already critical
    if (ticket.priority !== 'CRITICAL') {
      await prisma.client.ticket.update({
        where: { id: ticketId },
        data: {
          priority: 'URGENT',
          metadata: {
            ...(ticket.metadata as any || {}),
            escalatedAt: new Date(),
            escalationReason: 'sla_breach'
          }
        }
      });
    }

    // Notify management
    const managementEmails = await this.getManagementEmails();
    if (managementEmails.length > 0) {
      await this.emailService.queue({
        to: managementEmails,
        subject: `ESCALATION: Ticket #${ticket.number} - SLA Breach`,
        template: 'ticket-escalated',
        context: {
          ticketNumber: ticket.number,
          subject: ticket.subject,
          priority: ticket.priority,
          slaBreached: true
        }
      });
    }

    await this.eventBus.emit(TicketEvents.TICKET_ESCALATED, {
      ticketId,
      reason: 'sla_breach',
      timestamp: new Date()
    });
  }

  /**
   * Get support team emails for category
   */
  private async getSupportTeamEmails(categoryId?: string | null): Promise<string[]> {
    // In a real implementation, this would fetch from a configuration
    // or team assignment table based on category
    const agents = await prisma.client.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        status: 'ACTIVE'
      },
      select: { email: true }
    });

    return agents.map(agent => agent.email);
  }

  /**
   * Get management emails
   */
  private async getManagementEmails(): Promise<string[]> {
    const managers = await prisma.client.user.findMany({
      where: {
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      },
      select: { email: true }
    });

    return managers.map(manager => manager.email);
  }
}

// Initialize the processor
export const ticketQueueProcessor = new TicketQueueProcessor(
  Container.get(EmailService),
  Container.get(EventBus)
);
