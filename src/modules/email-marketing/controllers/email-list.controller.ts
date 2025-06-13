import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable } from '@/shared/decorators';
import { EmailListService } from '../services/email-list.service';
import { getTenantId } from '@/modules/tenant/tenant.utils';
import {
  createEmailListSchema,
  updateEmailListSchema,
  listFiltersSchema,
  subscribeSchema,
  unsubscribeSchema,
  importSubscribersSchema,
  updateSubscriberSchema
} from '../dto/email-list.dto';
import { z } from 'zod';

const cleanListSchema = z.object({
  removeUnconfirmed: z.boolean().optional(),
  removeInactive: z.boolean().optional(),
  inactiveDays: z.number().optional(),
  removeBounced: z.boolean().optional()
});

@Injectable()
export class EmailListController {
  constructor(
    private readonly listService: EmailListService
  ) {}

  /**
   * Create email list
   */
  async createList(
    request: FastifyRequest<{
      Body: z.infer<typeof createEmailListSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const data = createEmailListSchema.parse(request.body);

    const list = await this.listService.createList(tenantId, data);

    reply.code(201).send({
      success: true,
      data: list
    });
  }

  /**
   * Get email lists
   */
  async getLists(
    request: FastifyRequest<{
      Querystring: z.infer<typeof listFiltersSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const filters = listFiltersSchema.parse(request.query);

    const result = await this.listService.getLists(tenantId, filters);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Get single list
   */
  async getList(
    request: FastifyRequest<{
      Params: { listId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;

    const list = await this.listService.getList(tenantId, listId);

    reply.send({
      success: true,
      data: list
    });
  }

  /**
   * Update list
   */
  async updateList(
    request: FastifyRequest<{
      Params: { listId: string }
      Body: z.infer<typeof updateEmailListSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const data = updateEmailListSchema.parse(request.body);

    const list = await this.listService.updateList(tenantId, listId, data);

    reply.send({
      success: true,
      data: list
    });
  }

  /**
   * Delete list
   */
  async deleteList(
    request: FastifyRequest<{
      Params: { listId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;

    await this.listService.deleteList(tenantId, listId);

    reply.code(204).send();
  }

  /**
   * Get list subscribers
   */
  async getListSubscribers(
    request: FastifyRequest<{
      Params: { listId: string }
      Querystring: {
        page?: number;
        limit?: number;
        status?: 'subscribed' | 'unsubscribed' | 'pending';
        search?: string;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const { page = 1, limit = 50, status, search } = request.query;

    const result = await this.listService.getListSubscribers(tenantId, listId, {
      page,
      limit,
      status,
      search
    });

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Subscribe to list
   */
  async subscribe(
    request: FastifyRequest<{
      Params: { listId: string }
      Body: z.infer<typeof subscribeSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const data = subscribeSchema.parse(request.body);

    const subscriber = await this.listService.subscribeWithTenant(tenantId, listId, data);

    reply.code(201).send({
      success: true,
      data: subscriber
    });
  }

  /**
   * Unsubscribe from list
   */
  async unsubscribe(
    request: FastifyRequest<{
      Params: { listId: string }
      Body: z.infer<typeof unsubscribeSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const data = unsubscribeSchema.parse(request.body);

    await this.listService.unsubscribeWithTenant(tenantId, listId, data.email, data.reason);

    reply.send({
      success: true,
      message: 'Successfully unsubscribed'
    });
  }

  /**
   * Import subscribers
   */
  async importSubscribers(
    request: FastifyRequest<{
      Params: { listId: string }
      Body: z.infer<typeof importSubscribersSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const data = importSubscribersSchema.parse(request.body);

    const result = await this.listService.importSubscribers(tenantId, listId, data);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Update subscriber
   */
  async updateSubscriber(
    request: FastifyRequest<{
      Params: { listId: string; subscriberId: string }
      Body: z.infer<typeof updateSubscriberSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId, subscriberId } = request.params;
    const data = updateSubscriberSchema.parse(request.body);

    const subscriber = await this.listService.updateSubscriberWithTenant(tenantId, listId, subscriberId, data);

    reply.send({
      success: true,
      data: subscriber
    });
  }

  /**
   * Remove subscriber from list
   */
  async removeSubscriber(
    request: FastifyRequest<{
      Params: { listId: string; subscriberId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId, subscriberId } = request.params;

    await this.listService.removeSubscriber(tenantId, listId, subscriberId);

    reply.code(204).send();
  }

  /**
   * Clean list (remove inactive, bounced, etc.)
   */
  async cleanList(
    request: FastifyRequest<{
      Params: { listId: string }
      Body: z.infer<typeof cleanListSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const options = cleanListSchema.parse(request.body);

    const result = await this.listService.cleanList(tenantId, listId, options);

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Get list analytics
   */
  async getListAnalytics(
    request: FastifyRequest<{
      Params: { listId: string }
      Querystring: {
        startDate?: string;
        endDate?: string;
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const { startDate, endDate } = request.query;

    const analytics = await this.listService.getListAnalytics(
      tenantId,
      listId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    reply.send({
      success: true,
      data: analytics
    });
  }

  /**
   * Export list subscribers
   */
  async exportSubscribers(
    request: FastifyRequest<{
      Params: { listId: string }
      Querystring: {
        format?: 'csv' | 'json';
        status?: 'subscribed' | 'unsubscribed' | 'all';
      }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const { format = 'csv', status = 'subscribed' } = request.query;

    const data = await this.listService.exportSubscribers(tenantId, listId, { format, status });

    const filename = `list-${listId}-subscribers.${format}`;
    const contentType = format === 'csv' ? 'text/csv' : 'application/json';

    reply
      .header('Content-Type', contentType)
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(data);
  }
}
