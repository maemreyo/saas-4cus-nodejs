import { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from './index';

export interface HttpLogContext {
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  userAgent?: string;
  ip?: string;
  userId?: string;
}

export class HttpLogger {
  static logRequest(req: FastifyRequest, reply: FastifyReply) {
    const start = Date.now();
    const requestLogger = (logger as any).forRequest(req.id as string);

    // Attach logger to request
    (req as any).log = requestLogger;

    // Log incoming request
    requestLogger.info('Incoming request', {
      method: req.method,
      url: req.url,
      headers: this.sanitizeHeaders(req.headers),
      query: req.query,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Log response when it's sent
    (reply as any).addHook('onSend', async (request: any, reply: any, payload: any) => {
      const duration = Date.now() - start;
      const context: HttpLogContext = {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        duration,
        userAgent: request.headers['user-agent'] as string,
        ip: request.ip,
        userId: (request as any).user?.id,
      };

      if (reply.statusCode >= 400) {
        requestLogger.warn('Request failed', context);
      } else {
        requestLogger.info('Request completed', context);
      }

      // Log slow requests
      if (duration > 1000) {
        requestLogger.warn('Slow request detected', {
          ...context,
          threshold: 1000,
        });
      }
    });
  }

  private static sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
