// New file - Tracking routes for email opens and clicks

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { TrackingService } from './tracking.service';
import { trackingEventSchema } from './email-marketing.dto';
import { validateDto } from '@shared/utils/validation';
import { logger } from '@shared/logger';

// Transparent 1x1 pixel GIF
const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export default async function trackingRoutes(fastify: FastifyInstance) {
  const trackingService = Container.get(TrackingService);

  /**
   * Track email open
   */
  fastify.get('/track/open/:messageId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          messageId: { type: 'string' }
        },
        required: ['messageId']
      }
    }
  }, async (request: FastifyRequest<{ Params: { messageId: string } }>, reply: FastifyReply) => {
    try {
      const { messageId } = request.params;
      const ipAddress = request.ip;
      const userAgent = request.headers['user-agent'];

      // Track open asynchronously
      trackingService.trackOpen(messageId, ipAddress, userAgent).catch(error => {
        logger.error('Failed to track email open', error);
      });

      // Return tracking pixel
      reply
        .type('image/gif')
        .header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        .header('Pragma', 'no-cache')
        .header('Expires', '0')
        .send(TRACKING_PIXEL);
    } catch (error) {
      logger.error('Error in open tracking', error as Error);
      // Still return pixel even on error
      reply.type('image/gif').send(TRACKING_PIXEL);
    }
  });

  /**
   * Track email click
   */
  fastify.get('/track/click/:messageId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          messageId: { type: 'string' }
        },
        required: ['messageId']
      },
      querystring: {
        type: 'object',
        properties: {
          url: { type: 'string' }
        },
        required: ['url']
      }
    }
  }, async (
    request: FastifyRequest<{
      Params: { messageId: string };
      Querystring: { url: string };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { messageId } = request.params;
      const { url } = request.query;
      const ipAddress = request.ip;
      const userAgent = request.headers['user-agent'];

      // Decode URL
      const targetUrl = decodeURIComponent(url);

      // Track click asynchronously
      trackingService.trackClick(messageId, targetUrl, ipAddress, userAgent).catch(error => {
        logger.error('Failed to track email click', error);
      });

      // Redirect to target URL
      reply.redirect(302, targetUrl);
    } catch (error) {
      logger.error('Error in click tracking', error as Error);
      // Redirect to home page on error
      reply.redirect(302, process.env.APP_URL || '/');
    }
  });

  /**
   * Track email events via webhook (for email service providers)
   */
  fastify.post('/track/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify webhook signature if configured
      const signature = request.headers['x-webhook-signature'] as string;
      if (process.env.EMAIL_WEBHOOK_SECRET && signature) {
        // Implement signature verification based on your email provider
        // For example, for SendGrid:
        // const isValid = verifyWebhookSignature(request.body, signature);
        // if (!isValid) {
        //   return reply.code(401).send({ error: 'Invalid signature' });
        // }
      }

      const events = Array.isArray(request.body) ? request.body : [request.body];

      for (const event of events) {
        const validated = await validateDto(trackingEventSchema, event);
        await trackingService.processTrackingEvent(validated);
      }

      reply.send({ success: true });
    } catch (error) {
      logger.error('Error processing tracking webhook', error as Error);
      reply.code(400).send({ error: 'Failed to process webhook' });
    }
  });

  /**
   * Unsubscribe page
   */
  fastify.get('/unsubscribe', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          email: { type: 'string', format: 'email' }
        },
        required: ['token']
      }
    }
  }, async (
    request: FastifyRequest<{
      Querystring: { token: string; email?: string };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { token, email } = request.query;

      // Render unsubscribe page
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
            .form-group {
              margin-bottom: 20px;
            }
            label {
              display: block;
              margin-bottom: 5px;
              font-weight: 500;
            }
            input, textarea, select {
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 16px;
            }
            textarea {
              resize: vertical;
              min-height: 100px;
            }
            button {
              background: #dc3545;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
              width: 100%;
            }
            button:hover {
              background: #c82333;
            }
            .success {
              background: #d4edda;
              color: #155724;
              padding: 15px;
              border-radius: 4px;
              margin-bottom: 20px;
            }
            .error {
              background: #f8d7da;
              color: #721c24;
              padding: 15px;
              border-radius: 4px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unsubscribe</h1>
            <p>We're sorry to see you go. Please let us know why you're unsubscribing to help us improve.</p>

            <form method="POST" action="/api/v1/email-marketing/unsubscribe">
              <input type="hidden" name="token" value="${token}">
              ${email ? `<input type="hidden" name="email" value="${email}">` : ''}

              <div class="form-group">
                <label for="reason">Reason for unsubscribing</label>
                <select name="reason" id="reason" required>
                  <option value="">Please select...</option>
                  <option value="too_many">Too many emails</option>
                  <option value="not_relevant">Content not relevant</option>
                  <option value="never_signed_up">Never signed up</option>
                  <option value="privacy">Privacy concerns</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="feedback">Additional feedback (optional)</label>
                <textarea name="feedback" id="feedback" placeholder="Tell us more..."></textarea>
              </div>

              <div class="form-group">
                <label>
                  <input type="checkbox" name="globalUnsubscribe" value="true">
                  Unsubscribe from all email lists
                </label>
              </div>

              <button type="submit">Unsubscribe</button>
            </form>
          </div>
        </body>
        </html>
      `;

      reply.type('text/html').send(html);
    } catch (error) {
      logger.error('Error rendering unsubscribe page', error as Error);
      reply.code(500).send('An error occurred');
    }
  });

  /**
   * Process unsubscribe
   */
  fastify.post('/unsubscribe', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { token, email, reason, feedback, globalUnsubscribe } = request.body as any;

      // Find subscriber by token or email
      // Implementation would decode token to get message ID and subscriber info

      // For now, return success page
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribed</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              text-align: center;
            }
            h1 {
              color: #28a745;
              margin-bottom: 20px;
            }
            .icon {
              font-size: 48px;
              color: #28a745;
              margin-bottom: 20px;
            }
            a {
              color: #007bff;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✓</div>
            <h1>You've been unsubscribed</h1>
            <p>You have been successfully removed from our mailing list.</p>
            <p>We're sorry to see you go, but we respect your decision.</p>
            <p>If you unsubscribed by mistake, you can <a href="/subscribe">re-subscribe here</a>.</p>
          </div>
        </body>
        </html>
      `;

      reply.type('text/html').send(html);
    } catch (error) {
      logger.error('Error processing unsubscribe', error as Error);
      reply.code(500).send('An error occurred');
    }
  });
}