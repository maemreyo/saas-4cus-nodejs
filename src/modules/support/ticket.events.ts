export const TicketEvents = {
  // Ticket lifecycle
  TICKET_CREATED: 'ticket.created',
  TICKET_UPDATED: 'ticket.updated',
  TICKET_DELETED: 'ticket.deleted',
  TICKET_CLOSED: 'ticket.closed',
  TICKET_REOPENED: 'ticket.reopened',
  TICKET_RESOLVED: 'ticket.resolved',

  // Assignment
  TICKET_ASSIGNED: 'ticket.assigned',
  TICKET_UNASSIGNED: 'ticket.unassigned',
  TICKET_ESCALATED: 'ticket.escalated',

  // Messages
  TICKET_MESSAGE_ADDED: 'ticket.message.added',
  TICKET_INTERNAL_NOTE_ADDED: 'ticket.internal_note.added',

  // Status changes
  TICKET_STATUS_CHANGED: 'ticket.status.changed',
  TICKET_PRIORITY_CHANGED: 'ticket.priority.changed',

  // SLA
  TICKET_SLA_WARNING: 'ticket.sla.warning',
  TICKET_SLA_BREACHED: 'ticket.sla.breached',

  // Customer feedback
  TICKET_RATED: 'ticket.rated',

  // Notifications
  TICKET_REMINDER: 'ticket.reminder',
  TICKET_AUTO_CLOSE_WARNING: 'ticket.auto_close.warning',
  TICKET_AUTO_CLOSED: 'ticket.auto_closed',
} as const;

export type TicketEventName = (typeof TicketEvents)[keyof typeof TicketEvents];