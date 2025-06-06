import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { TicketService } from './ticket.service';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { redis } from '@infrastructure/cache/redis.service';
import { ForbiddenException, UnauthorizedException } from '@shared/exceptions';

/**
 * Middleware to verify ticket access
 */
export function requireTicketAccess() {
  return async (request: FastifyRequest<{ Params: { ticketId: string } }>, reply: FastifyReply) => {
    const ticketService = Container.get(TicketService);
    const { ticketId } = request.params;
    const user = request.customUser;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const ticket = await ticketService.getTicket(ticketId);

      // Check if user is the ticket owner
      const isOwner = ticket.userId === user.id;

      // Check if user is an agent/admin
      const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

      // Check if user is assigned to the ticket
      const isAssignee = ticket.assigneeId === user.id;

      if (!isOwner && !isAgent && !isAssignee) {
        throw new ForbiddenException('You do not have access to this ticket');
      }

      // Attach ticket to request for downstream use
      (request as any).ticket = ticket;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Ticket not found or access denied');
    }
  };
}

/**
 * Middleware to require agent role
 */
export function requireAgent() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.customUser;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      throw new ForbiddenException('Agent access required');
    }
  };
}

/**
 * Middleware to check if user can modify ticket
 */
export function requireTicketModifyAccess() {
  return async (request: FastifyRequest<{ Params: { ticketId: string } }>, reply: FastifyReply) => {
    const ticketService = Container.get(TicketService);
    const { ticketId } = request.params;
    const user = request.customUser;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const ticket = await ticketService.getTicket(ticketId);

      // Agents can modify any ticket
      const isAgent = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
      if (isAgent) {
        (request as any).ticket = ticket;
        return;
      }

      // Customers can only modify their own tickets with limitations
      const isOwner = ticket.userId === user.id;
      if (!isOwner) {
        throw new ForbiddenException('You can only modify your own tickets');
      }

      // Check if ticket is in a state that allows customer modifications
      if (ticket.status === 'CLOSED') {
        throw new ForbiddenException('Cannot modify closed tickets');
      }

      (request as any).ticket = ticket;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Ticket not found or access denied');
    }
  };
}

/**
 * Middleware to track ticket view
 */
export function trackTicketView() {
  return async (request: FastifyRequest<{ Params: { ticketId: string } }>, reply: FastifyReply) => {
    const { ticketId } = request.params;
    const userId = request.customUser?.id;

    if (userId) {
      // Track view in analytics
      await Container.get(AnalyticsService).track({
        userId,
        event: 'ticket.viewed',
        properties: { ticketId }
      });
    }
  };
}

/**
 * Rate limiting for ticket creation
 */
export function ticketRateLimit() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.customUser?.id;
    if (!userId) return;

    const key = `ticket:ratelimit:${userId}`;
    const limit = 10; // 10 tickets per hour
    const window = 3600; // 1 hour in seconds

    const current = await redis.increment(key);

    if (current === 1) {
      await redis.expire(key, window);
    }

    if (current > limit) {
      throw new ForbiddenException(
        'Too many tickets created. Please wait before creating another ticket.',
        {
          limit,
          window,
          retryAfter: await redis.ttl(key)
        }
      );
    }
  };
}
