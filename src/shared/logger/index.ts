import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';
import { config } from '@infrastructure/config';
import { nanoid } from 'nanoid';
import { Container, Service } from 'typedi';

// Custom log context interface
export interface LogContext {
  requestId?: string;
  userId?: string;
  tenantId?: string;
  traceId?: string;
  spanId?: string;
  [key: string]: any;
}

// Log levels
export enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
}

// Custom error serializer
const errorSerializer = (err: any) => {
  return {
    type: err.constructor?.name || 'Error',
    message: err.message,
    stack: err.stack,
    code: err.code,
    statusCode: err.statusCode,
    details: err.details,
    ...err,
  };
};

// Custom request serializer
const requestSerializer = (req: any) => {
  return {
    id: req.id,
    method: req.method,
    url: req.url,
    path: req.path,
    parameters: req.parameters,
    headers: {
      ...req.headers,
      authorization: req.headers.authorization ? '[REDACTED]' : undefined,
    },
    remoteAddress: req.ip || req.connection?.remoteAddress,
    remotePort: req.connection?.remotePort,
  };
};

// Custom response serializer
const responseSerializer = (res: any) => {
  return {
    statusCode: res.statusCode,
    headers: res.getHeaders?.() || res.headers,
    responseTime: res.responseTime,
  };
};

// Create base logger configuration
function createLoggerConfig(): LoggerOptions {
  const isDev = config.app.isDevelopment;
  const isTest = config.app.isTest;

  const baseConfig: LoggerOptions = {
    level: config.monitoring.logging.level,
    name: config.app.name,
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      err: errorSerializer,
      error: errorSerializer,
      req: requestSerializer,
      res: responseSerializer,
    },
    base: {
      pid: process.pid,
      hostname: process.env.HOSTNAME || 'unknown',
      environment: config.app.env,
      version: config.app.version,
    },
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        '*.password',
        '*.token',
        '*.secret',
        '*.apiKey',
        '*.accessToken',
        '*.refreshToken',
        '*.creditCard',
        '*.ssn',
      ],
      censor: '[REDACTED]',
    },
  };

  // Development transport
  if (isDev && config.monitoring.logging.pretty) {
    return {
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          messageFormat: '{msg} {req.method} {req.url} {res.statusCode}',
          errorLikeObjectKeys: ['err', 'error'],
        },
      },
    };
  }

  // Test environment - minimal logging
  if (isTest) {
    return {
      ...baseConfig,
      level: 'error',
    };
  }

  // Production - structured JSON logs
  return baseConfig;
}

@Service()
export class Logger {
  private logger: PinoLogger;
  private context: LogContext = {};

  constructor() {
    this.logger = pino(createLoggerConfig());
  }

  // Create child logger with context
  child(context: LogContext): Logger {
    const childLogger = new Logger();
    childLogger.logger = this.logger.child(context);
    childLogger.context = { ...this.context, ...context };
    return childLogger;
  }

  // Create logger for specific request
  forRequest(requestId?: string): Logger {
    return this.child({ requestId: requestId || nanoid() });
  }

  // Log methods
  fatal(msg: string, data?: any): void {
    this.logger.fatal({ ...this.context, ...data }, msg);
  }

  error(msg: string, error?: Error | any, data?: any): void {
    if (error instanceof Error) {
      this.logger.error({ ...this.context, err: error, ...data }, msg);
    } else {
      this.logger.error({ ...this.context, ...error, ...data }, msg);
    }
  }

  warn(msg: string, data?: any): void {
    this.logger.warn({ ...this.context, ...data }, msg);
  }

  info(msg: string, data?: any): void {
    this.logger.info({ ...this.context, ...data }, msg);
  }

  debug(msg: string, data?: any): void {
    this.logger.debug({ ...this.context, ...data }, msg);
  }

  trace(msg: string, data?: any): void {
    this.logger.trace({ ...this.context, ...data }, msg);
  }

  // Performance logging
  time(label: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.debug(`${label} completed`, { duration, label });
    };
  }

  // Async performance logging
  async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.debug(`${label} completed`, { duration, label });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.error(`${label} failed`, error as Error, { duration, label });
      throw error;
    }
  }

  // Audit logging
  audit(action: string, data: any): void {
    this.info('Audit', {
      ...this.context,
      audit: true,
      action,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  // Security logging
  security(event: string, data: any): void {
    this.warn('Security Event', {
      ...this.context,
      security: true,
      event,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  // Business metrics logging
  metric(name: string, value: number, tags?: Record<string, string>): void {
    this.info('Metric', {
      ...this.context,
      metric: true,
      name,
      value,
      tags,
      timestamp: new Date().toISOString(),
    });
  }

  // Get underlying Pino logger
  getPino(): PinoLogger {
    return this.logger;
  }
}

// Create singleton instance
const logger = new Logger();

// Export singleton
export { logger };

// Export factory function
export function createLogger(context?: LogContext): Logger {
  return context ? logger.child(context) : logger;
}

// Fastify logger plugin
export const fastifyLogger = {
  logger: logger.getPino(),
  serializers: {
    req: requestSerializer,
    res: responseSerializer,
  },
  genReqId: () => nanoid(),
};

// Express middleware
export function expressLogger() {
  return (req: any, res: any, next: any) => {
    const start = Date.now();
    const requestId = req.headers['x-request-id'] || nanoid();

    req.id = requestId;
    req.log = logger.forRequest(requestId);

    // Log request
    req.log.info('Request started', {
      req,
      query: req.query,
      body: req.body,
    });

    // Log response
    const originalSend = res.send;
    res.send = function (data: any) {
      res.responseTime = Date.now() - start;

      req.log.info('Request completed', {
        res,
        duration: res.responseTime,
      });

      originalSend.call(this, data);
    };

    next();
  };
}

// Global error handler for uncaught exceptions
if (!config.app.isTest) {
  process.on('uncaughtException', (error: Error) => {
    logger.fatal('Uncaught Exception', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any) => {
    logger.fatal('Unhandled Rejection', reason);
    process.exit(1);
  });
}
