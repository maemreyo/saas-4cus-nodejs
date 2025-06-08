import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { WebhookService } from './webhook.service';
import { validateSchema } from '@shared/validators';
import {
  CreateWebhookDTO,
  UpdateWebhookDTO,
  ListWebhooksDTO,
  GetWebhookEventsDTO
} from './webhook.dto';

@Service()
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  /**
   * Create webhook endpoint
   */
  async createWebhook(
    request: FastifyRequest<{ Body: CreateWebhookDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(CreateWebhookDTO.schema, request.body) as any;
    const userId = request.customUser!.id;
    const tenantId = (request as any).tenant?.id;

    const webhook = await this.webhookService.createWebhook(userId, tenantId, dto);

    reply.code(201).send({
      message: 'Webhook endpoint created successfully',
      data: webhook
    });
  }

  /**
   * List webhook endpoints
   */
  async listWebhooks(
    request: FastifyRequest<{ Querystring: ListWebhooksDTO }>,
    reply: FastifyReply
  ) {
    const { limit, offset, event } = request.query;
    const userId = request.customUser!.id;
    const tenantId = (request as any).tenant?.id;

    const result = await this.webhookService.listWebhooks(userId, tenantId, {
      limit,
      offset,
      event
    });

    reply.send({ data: result });
  }

  /**
   * Get webhook endpoint
   */
  async getWebhook(
    request: FastifyRequest<{ Params: { webhookId: string } }>,
    reply: FastifyReply
  ) {
    const { webhookId } = request.params;
    const userId = request.customUser!.id;

    const webhook = await this.webhookService.getWebhook(webhookId, userId);

    reply.send({ data: webhook });
  }

  /**
   * Update webhook endpoint
   */
  async updateWebhook(
    request: FastifyRequest<{
      Params: { webhookId: string };
      Body: UpdateWebhookDTO;
    }>,
    reply: FastifyReply
  ) {
    const { webhookId } = request.params;
    const dto = await validateSchema(UpdateWebhookDTO.schema, request.body);
    const userId = request.customUser!.id;

    const webhook = await this.webhookService.updateWebhook(webhookId, userId, dto);

    reply.send({
      message: 'Webhook endpoint updated successfully',
      data: webhook
    });
  }

  /**
   * Delete webhook endpoint
   */
  async deleteWebhook(
    request: FastifyRequest<{ Params: { webhookId: string } }>,
    reply: FastifyReply
  ) {
    const { webhookId } = request.params;
    const userId = request.customUser!.id;

    await this.webhookService.deleteWebhook(webhookId, userId);

    reply.send({ message: 'Webhook endpoint deleted successfully' });
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(
    request: FastifyRequest<{ Params: { webhookId: string } }>,
    reply: FastifyReply
  ) {
    const { webhookId } = request.params;
    const userId = request.customUser!.id;

    const result = await this.webhookService.testWebhook(webhookId, userId);

    reply.send({
      message: result.success ? 'Test webhook delivered successfully' : 'Test webhook delivery failed',
      data: result
    });
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats(
    request: FastifyRequest<{ Params: { webhookId: string } }>,
    reply: FastifyReply
  ) {
    const { webhookId } = request.params;
    const userId = request.customUser!.id;

    // Verify ownership
    await this.webhookService.getWebhook(webhookId, userId);

    const stats = await this.webhookService.getWebhookStats(webhookId);

    reply.send({ data: stats });
  }

  /**
   * Get webhook events/deliveries
   */
  async getWebhookEvents(
    request: FastifyRequest<{
      Params: { webhookId: string };
      Querystring: GetWebhookEventsDTO;
    }>,
    reply: FastifyReply
  ) {
    const { webhookId } = request.params;
    const { limit, offset, status } = request.query;
    const userId = request.customUser!.id;

    // Verify ownership
    await this.webhookService.getWebhook(webhookId, userId);

    const result = await this.webhookService.getWebhookEvents(webhookId, {
      limit,
      offset,
      status
    });

    reply.send({ data: result });
  }

  /**
   * Replay webhook delivery
   */
  async replayDelivery(
    request: FastifyRequest<{ Params: { deliveryId: string } }>,
    reply: FastifyReply
  ) {
    const { deliveryId } = request.params;
    const userId = request.customUser!.id;

    await this.webhookService.replayDelivery(deliveryId, userId);

    reply.send({ message: 'Webhook delivery replay queued' });
  }

  /**
   * Get available webhook events
   */
  async getAvailableEvents(request: FastifyRequest, reply: FastifyReply) {
    // This would typically come from configuration
    const events = [
      { event: 'user.created', description: 'User account created' },
      { event: 'user.updated', description: 'User profile updated' },
      { event: 'user.deleted', description: 'User account deleted' },
      { event: 'subscription.created', description: 'Subscription created' },
      { event: 'subscription.updated', description: 'Subscription updated' },
      { event: 'subscription.cancelled', description: 'Subscription cancelled' },
      { event: 'payment.succeeded', description: 'Payment successful' },
      { event: 'payment.failed', description: 'Payment failed' },
      { event: 'tenant.member.added', description: 'Member added to tenant' },
      { event: 'tenant.member.removed', description: 'Member removed from tenant' }
    ];

    reply.send({ data: events });
  }
}
