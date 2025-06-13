// Controller for email list management

import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET, POST, PUT, DELETE } from '@/shared/decorators';
import { EmailListService } from '../services/email-list.service';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { requireTenant } from '@/modules/tenant/middleware/tenant.middleware';
import { getTenantId } from '@/modules/tenant/tenant.context';
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

@Controller('/api/email-marketing/lists')
export class EmailListController {
  constructor(
    private readonly listService: EmailListService
  ) {}

  /**
   * Create email list
   */
  @POST('/', {
    preHandler: [authenticate, requireTenant]
  })
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
  @GET('/', {
    preHandler: [authenticate, requireTenant]
  })
  async getLists(
    request: FastifyRequest<{
      Querystring: z.infer<typeof listFiltersSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const filters = listFiltersSchema.parse(request.query);

    // Implementation would need to add list filtering to service
    const lists = await this.listService.getListSegments(tenantId); // Placeholder

    reply.send({
      success: true,
      data: {
        lists,
        total: lists.length,
        page: filters.page,
        pages: Math.ceil(lists.length / filters.limit)
      }
    });
  }

  /**
   * Get single list
   */
  @GET('/:listId', {
    preHandler: [authenticate, requireTenant]
  })
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
  @PUT('/:listId', {
    preHandler: [authenticate, requireTenant]
  })
  async updateList(
    request: FastifyRequest<{
      Params: { listId: string },
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
   * Subscribe to list (public endpoint)
   */
  @POST('/:listId/subscribe', {
    preHandler: []
  })
  async subscribe(
    request: FastifyRequest<{
      Params: { listId: string },
      Body: z.infer<typeof subscribeSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { listId } = request.params;
    const data = subscribeSchema.parse(request.body);

    const subscriber = await this.listService.subscribe(
      listId,
      data,
      request.headers['x-forwarded-for'] as string || 'web'
    );

    reply.send({
      success: true,
      message: 'Successfully subscribed. Please check your email for confirmation.',
      data: {
        id: subscriber.id,
        requiresConfirmation: !subscriber.confirmed
      }
    });
  }

  /**
   * Confirm subscription (public endpoint)
   */
  @GET('/confirm/:token', {
    preHandler: []
  })
  async confirmSubscription(
    request: FastifyRequest<{
      Params: { token: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { token } = request.params;

    const result = await this.listService.confirmSubscription(token);

    // Redirect to confirmation page if configured
    if (result.list.confirmationPageUrl) {
      reply.redirect(302, result.list.confirmationPageUrl);
    } else {
      reply.send({
        success: true,
        message: 'Email confirmed successfully'
      });
    }
  }

  /**
   * Unsubscribe (public endpoint)
   */
  @POST('/unsubscribe', {
    preHandler: []
  })
  async unsubscribe(
    request: FastifyRequest<{
      Body: z.infer<typeof unsubscribeSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const data = unsubscribeSchema.parse(request.body);

    await this.listService.unsubscribe(data);

    reply.send({
      success: true,
      message: 'Successfully unsubscribed'
    });
  }

  /**
   * Import subscribers
   */
  @POST('/:listId/import', {
    preHandler: [authenticate, requireTenant]
  })
  async importSubscribers(
    request: FastifyRequest<{
      Params: { listId: string },
      Body: z.infer<typeof importSubscribersSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const tenantId = getTenantId(request);
    const { listId } = request.params;
    const data = importSubscribersSchema.parse(request.body);

    const result = await this.listService.importSubscribers(
      tenantId,
      listId,
      data
    );

    reply.send({
      success: true,
      data: result
    });
  }

  /**
   * Update subscriber
   */
  @PUT('/:listId/subscribers/:subscriberId', {
    preHandler: [authenticate, requireTenant]
  })
  async updateSubscriber(
    request: FastifyRequest<{
      Params: { listId: string, subscriberId: string },
      Body: z.infer<typeof updateSubscriberSchema>
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { subscriberId } = request.params;
    const data = updateSubscriberSchema.parse(request.body);

    const subscriber = await this.listService.updateSubscriber(subscriberId, data);

    reply.send({
      success: true,
      data: subscriber
    });
  }

  /**
   * Clean list
   */
  @POST('/:listId/clean', {
    preHandler: [authenticate, requireTenant]
  })
  async cleanList(
    request: FastifyRequest<{
      Params: { listId: string },
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
   * Get list stats
   */
  @GET('/:listId/stats', {
    preHandler: [authenticate, requireTenant]
  })
  async getListStats(
    request: FastifyRequest<{
      Params: { listId: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { listId } = request.params;

    const stats = await this.listService.getListStats(listId);

    reply.send({
      success: true,
      data: stats
    });
  }
}