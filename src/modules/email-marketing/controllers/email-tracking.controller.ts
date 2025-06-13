// Controller for email tracking endpoints

import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable } from '@/shared/decorators';
import { EmailTrackingService } from '../services/email-tracking.service';

@Injectable()
export class EmailTrackingController {
  constructor(
    private readonly trackingService: EmailTrackingService
  ) {}

  /**
   * Track email open
   */
  async trackOpen(
    request: FastifyRequest<{
      Params: { encoded: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { encoded } = request.params;

    await this.trackingService.trackOpen(encoded, {
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip
    });

    // Return 1x1 transparent GIF
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    reply
      .type('image/gif')
      .header('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      .send(pixel);
  }

  /**
   * Track link click
   */
  async trackClick(
    request: FastifyRequest<{
      Params: { encoded: string }
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { encoded } = request.params;

    const originalUrl = await this.trackingService.trackClick(encoded, {
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip
    });

    if (originalUrl) {
      reply.redirect(302, originalUrl);
    } else {
      reply.code(404).send({ error: 'Invalid tracking link' });
    }
  }
}
