import { Service } from 'typedi';
import { WebhookEndpoint, WebhookEvent, WebhookDelivery, WebhookDeliveryStatus } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { queueService } from '@shared/queue/queue.service';
import { EventBus } from '@shared/events/event-bus';
import { BadRequestException, NotFoundException, ConflictException } from '@shared/exceptions';
import { createHmac, randomBytes } from 'crypto';
import { nanoid } from 'nanoid';
import fetch from 'node-fetch';

export interface CreateWebhookOptions {
  url: string;
  events: string[];
  description?: string;
  secret?: string;
  enabled?: boolean;
  headers?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface WebhookPayload {
  id: string;
  event: string;
  data: any;
  timestamp: string;
  webhookId?: string;
  [key: string]: any; // Index signature for JsonValue compatibility
}

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  duration: number;
  response?: any;
}

@Service()
export class WebhookService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS = [60000, 300000, 900000]; // 1min, 5min, 15min
  private readonly TIMEOUT = 30000; // 30 seconds

  constructor(private eventBus: EventBus) {
    this.setupEventListeners();
    this.registerQueueProcessors();
  }

  /**
   * Setup event listeners for webhook triggers
   */
  private setupEventListeners() {
    // Get all available events and listen to them individually
    // Since we can't use wildcard, we'll listen to specific events
    const events = [
      'user.created',
      'user.updated',
      'user.deleted',
      'subscription.created',
      'subscription.updated',
      'subscription.cancelled',
      'payment.succeeded',
      'payment.failed',
      'tenant.member.added',
      'tenant.member.removed',
      'ticket.created',
      'ticket.resolved',
      'ticket.closed',
    ];

    events.forEach(eventName => {
      this.eventBus.on(eventName, async (payload: any) => {
        await this.handleEvent(eventName, payload);
      });
    });
  }

  /**
   * Register queue processors
   */
  private registerQueueProcessors() {
    queueService.registerProcessor('webhook', 'deliver', this.processWebhookDelivery.bind(this));
    queueService.registerProcessor('webhook', 'retry', this.processWebhookRetry.bind(this));
  }

  /**
   * Create webhook endpoint
   */
  async createWebhook(
    userId: string,
    tenantId: string | undefined,
    options: CreateWebhookOptions,
  ): Promise<WebhookEndpoint> {
    // Validate URL
    try {
      new URL(options.url);
    } catch (error) {
      throw new BadRequestException('Invalid webhook URL');
    }

    // Check for duplicate URL
    const existing = await prisma.client.webhookEndpoint.findFirst({
      where: {
        userId,
        tenantId,
        url: options.url,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('Webhook endpoint already exists for this URL');
    }

    // Generate secret if not provided
    const secret = options.secret || randomBytes(32).toString('hex');

    const webhook = await prisma.client.webhookEndpoint.create({
      data: {
        userId,
        tenantId,
        url: options.url,
        events: options.events,
        description: options.description,
        secret,
        enabled: options.enabled !== false,
        headers: options.headers || {},
        metadata: options.metadata || {},
      },
    });

    logger.info('Webhook endpoint created', {
      webhookId: webhook.id,
      userId,
      url: options.url,
    });

    return webhook;
  }

  /**
   * Update webhook endpoint
   */
  async updateWebhook(
    webhookId: string,
    userId: string,
    updates: Partial<CreateWebhookOptions>,
  ): Promise<WebhookEndpoint> {
    const webhook = await this.getWebhook(webhookId, userId);

    // Validate new URL if provided
    if (updates.url) {
      try {
        new URL(updates.url);
      } catch (error) {
        throw new BadRequestException('Invalid webhook URL');
      }
    }

    const updated = await prisma.client.webhookEndpoint.update({
      where: { id: webhookId },
      data: {
        url: updates.url,
        events: updates.events,
        description: updates.description,
        enabled: updates.enabled,
        headers: updates.headers,
        metadata: updates.metadata,
      },
    });

    logger.info('Webhook endpoint updated', { webhookId });

    return updated;
  }

  /**
   * Delete webhook endpoint
   */
  async deleteWebhook(webhookId: string, userId: string): Promise<void> {
    const webhook = await this.getWebhook(webhookId, userId);

    await prisma.client.webhookEndpoint.update({
      where: { id: webhookId },
      data: { deletedAt: new Date() },
    });

    logger.info('Webhook endpoint deleted', { webhookId });
  }

  /**
   * Get webhook endpoint
   */
  async getWebhook(webhookId: string, userId: string): Promise<WebhookEndpoint> {
    const webhook = await prisma.client.webhookEndpoint.findFirst({
      where: {
        id: webhookId,
        userId,
        deletedAt: null,
      },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook endpoint not found');
    }

    return webhook;
  }

  /**
   * List webhook endpoints
   */
  async listWebhooks(
    userId: string,
    tenantId?: string,
    options?: {
      limit?: number;
      offset?: number;
      event?: string;
    },
  ): Promise<{
    webhooks: WebhookEndpoint[];
    total: number;
  }> {
    const where = {
      userId,
      tenantId,
      deletedAt: null,
      ...(options?.event && { events: { has: options.event } }),
    };

    const [webhooks, total] = await Promise.all([
      prisma.client.webhookEndpoint.findMany({
        where,
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.webhookEndpoint.count({ where }),
    ]);

    return { webhooks, total };
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(webhookId: string, userId: string): Promise<WebhookDeliveryResult> {
    const webhook = await this.getWebhook(webhookId, userId);

    const testPayload: WebhookPayload = {
      id: nanoid(),
      event: 'webhook.test',
      data: {
        message: 'This is a test webhook delivery',
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    const result = await this.deliverWebhook(webhook, testPayload);

    // Store test delivery
    await prisma.client.webhookDelivery.create({
      data: {
        webhookEndpointId: webhook.id,
        eventId: testPayload.id,
        eventType: testPayload.event,
        payload: testPayload,
        status: result.success ? WebhookDeliveryStatus.SUCCESS : WebhookDeliveryStatus.FAILED,
        statusCode: result.statusCode,
        error: result.error,
        duration: result.duration,
        response: result.response,
      },
    });

    return result;
  }

  /**
   * Handle event for webhook delivery
   */
  private async handleEvent(eventName: string, payload: any): Promise<void> {
    // Find all webhooks subscribed to this event
    const webhooks = await prisma.client.webhookEndpoint.findMany({
      where: {
        events: { has: eventName },
        enabled: true,
        deletedAt: null,
      },
    });

    if (webhooks.length === 0) return;

    // Create webhook event
    const event = await prisma.client.webhookEvent.create({
      data: {
        eventType: eventName,
        payload,
      },
    });

    // Queue delivery for each webhook
    for (const webhook of webhooks) {
      await queueService.addJob('webhook', 'deliver', {
        webhookId: webhook.id,
        eventId: event.id,
      });
    }

    logger.info('Webhook deliveries queued', {
      event: eventName,
      webhookCount: webhooks.length,
    });
  }

  /**
   * Process webhook delivery job
   */
  private async processWebhookDelivery(job: any): Promise<void> {
    const { webhookId, eventId } = job.data;

    const [webhook, event] = await Promise.all([
      prisma.client.webhookEndpoint.findUnique({
        where: { id: webhookId },
      }),
      prisma.client.webhookEvent.findUnique({
        where: { id: eventId },
      }),
    ]);

    if (!webhook || !event) {
      logger.error('Webhook or event not found', { webhookId, eventId });
      return;
    }

    const payload: WebhookPayload = {
      id: event.id,
      event: event.eventType,
      data: event.payload,
      timestamp: event.createdAt.toISOString(),
      webhookId: webhook.id,
    };

    const result = await this.deliverWebhook(webhook, payload);

    // Store delivery record
    const delivery = await prisma.client.webhookDelivery.create({
      data: {
        webhookEndpointId: webhook.id,
        eventId: event.id,
        eventType: event.eventType,
        payload,
        status: result.success ? WebhookDeliveryStatus.SUCCESS : WebhookDeliveryStatus.FAILED,
        statusCode: result.statusCode,
        error: result.error,
        duration: result.duration,
        response: result.response,
        attemptNumber: 1,
      },
    });

    // Schedule retry if failed
    if (!result.success && delivery.attemptNumber < this.MAX_RETRIES) {
      const delay = this.RETRY_DELAYS[delivery.attemptNumber - 1];
      await queueService.addJob(
        'webhook',
        'retry',
        {
          deliveryId: delivery.id,
        },
        { delay },
      );
    }

    // Update webhook stats
    await this.updateWebhookStats(webhook.id, result.success);
  }

  /**
   * Process webhook retry job
   */
  private async processWebhookRetry(job: any): Promise<void> {
    const { deliveryId } = job.data;

    const delivery = await prisma.client.webhookDelivery.findUnique({
      where: { id: deliveryId },
      include: {
        webhookEndpoint: true,
      },
    });

    if (!delivery) {
      logger.error('Webhook delivery not found', { deliveryId });
      return;
    }

    const result = await this.deliverWebhook(delivery.webhookEndpoint, delivery.payload as WebhookPayload);

    // Update delivery record
    await prisma.client.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: result.success ? WebhookDeliveryStatus.SUCCESS : WebhookDeliveryStatus.FAILED,
        statusCode: result.statusCode,
        error: result.error,
        duration: result.duration,
        response: result.response,
        attemptNumber: delivery.attemptNumber + 1,
        retriedAt: new Date(),
      },
    });

    // Schedule another retry if failed and not max retries
    if (!result.success && delivery.attemptNumber + 1 < this.MAX_RETRIES) {
      const delay = this.RETRY_DELAYS[delivery.attemptNumber];
      await queueService.addJob(
        'webhook',
        'retry',
        {
          deliveryId: delivery.id,
        },
        { delay },
      );
    }

    // Update webhook stats
    await this.updateWebhookStats(delivery.webhookEndpointId, result.success);
  }

  /**
   * Deliver webhook
   */
  private async deliverWebhook(webhook: WebhookEndpoint, payload: WebhookPayload): Promise<WebhookDeliveryResult> {
    const startTime = Date.now();

    try {
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Webhook/1.0',
        'X-Webhook-Id': webhook.id,
        'X-Webhook-Event': payload.event,
        'X-Webhook-Delivery': payload.id,
        'X-Webhook-Timestamp': payload.timestamp,
        ...((webhook.headers as Record<string, string>) || {}),
      };

      // Add signature
      const signature = this.generateSignature(webhook.secret, payload);
      headers['X-Webhook-Signature'] = signature;

      // Make request
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const duration = Date.now() - startTime;
      const responseText = await response.text();

      // Parse response if JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      return {
        success: response.status >= 200 && response.status < 300,
        statusCode: response.status,
        duration,
        response: responseData,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        error: error.message,
        duration,
      };
    }
  }

  /**
   * Generate webhook signature
   */
  private generateSignature(secret: string, payload: WebhookPayload): string {
    const hmac = createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
  }

  /**
   * Verify webhook signature
   */
  verifySignature(secret: string, payload: any, signature: string): boolean {
    const expectedSignature = this.generateSignature(secret, payload);
    return signature === expectedSignature;
  }

  /**
   * Update webhook statistics
   */
  private async updateWebhookStats(webhookId: string, success: boolean): Promise<void> {
    const key = `webhook:stats:${webhookId}`;
    const stats = (await redis.get(key)) || {
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
    };

    stats.totalDeliveries++;
    if (success) {
      stats.successfulDeliveries++;
    } else {
      stats.failedDeliveries++;
    }

    await redis.set(key, stats, { ttl: 86400 }); // 24 hours
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats(webhookId: string): Promise<{
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    successRate: number;
    recentDeliveries: WebhookDelivery[];
  }> {
    // Get cached stats
    const key = `webhook:stats:${webhookId}`;
    const cachedStats = (await redis.get(key)) || {
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
    };

    // Get recent deliveries
    const recentDeliveries = await prisma.client.webhookDelivery.findMany({
      where: { webhookEndpointId: webhookId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const successRate =
      cachedStats.totalDeliveries > 0 ? (cachedStats.successfulDeliveries / cachedStats.totalDeliveries) * 100 : 0;

    return {
      ...cachedStats,
      successRate: Math.round(successRate * 100) / 100,
      recentDeliveries,
    };
  }

  /**
   * Get webhook events
   */
  async getWebhookEvents(
    webhookId: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: WebhookDeliveryStatus;
    },
  ): Promise<{
    events: Array<WebhookEvent & { delivery?: WebhookDelivery }>;
    total: number;
  }> {
    const deliveries = await prisma.client.webhookDelivery.findMany({
      where: {
        webhookEndpointId: webhookId,
        ...(options?.status && { status: options.status }),
      },
      include: {
        event: true,
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });

    const total = await prisma.client.webhookDelivery.count({
      where: {
        webhookEndpointId: webhookId,
        ...(options?.status && { status: options.status }),
      },
    });

    const events = deliveries.map(d => ({
      ...d.event!,
      delivery: d,
    }));

    return { events, total };
  }

  /**
   * Replay webhook delivery
   */
  async replayDelivery(deliveryId: string, userId: string): Promise<void> {
    const delivery = await prisma.client.webhookDelivery.findUnique({
      where: { id: deliveryId },
      include: {
        webhookEndpoint: true,
      },
    });

    if (!delivery) {
      throw new NotFoundException('Webhook delivery not found');
    }

    // Check permissions
    if (delivery.webhookEndpoint.userId !== userId) {
      throw new NotFoundException('Webhook delivery not found');
    }

    // Queue for immediate delivery
    await queueService.addJob('webhook', 'deliver', {
      webhookId: delivery.webhookEndpointId,
      eventId: delivery.eventId,
    });

    logger.info('Webhook delivery replay queued', { deliveryId });
  }

  /**
   * Manually trigger a webhook event
   * This method allows other services to directly trigger webhook events
   * without going through the event bus
   */
  async trigger(eventName: string, payload: any): Promise<void> {
    // This method is similar to handleEvent but can be called directly
    // Find all webhooks subscribed to this event
    const webhooks = await prisma.client.webhookEndpoint.findMany({
      where: {
        events: { has: eventName },
        enabled: true,
        deletedAt: null,
      },
    });

    if (webhooks.length === 0) return;

    // Create webhook event
    const event = await prisma.client.webhookEvent.create({
      data: {
        eventType: eventName,
        payload,
      },
    });

    // Queue delivery for each webhook
    for (const webhook of webhooks) {
      await queueService.addJob('webhook', 'deliver', {
        webhookId: webhook.id,
        eventId: event.id,
      });
    }

    logger.info('Webhook deliveries manually triggered', {
      event: eventName,
      webhookCount: webhooks.length,
    });
  }
}
