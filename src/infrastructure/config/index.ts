import { z } from 'zod';
import dotenv from 'dotenv';
import { Logger } from '@shared/logger';

// Load environment variables
dotenv.config();

// Environment enum
export enum Environment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

// Configuration schema with Zod validation
const configSchema = z.object({
  app: z.object({
    name: z.string().default('Modern Backend API'),
    version: z.string().default('2.0.0'),
    env: z.nativeEnum(Environment).default(Environment.Development),
    port: z.number().int().positive().default(3000),
    host: z.string().default('0.0.0.0'),
    isProduction: z.boolean(),
    isDevelopment: z.boolean(),
    isTest: z.boolean(),
  }),

  security: z.object({
    jwt: z.object({
      accessSecret: z.string().min(32),
      refreshSecret: z.string().min(32),
      accessExpiresIn: z.string().default('15m'),
      refreshExpiresIn: z.string().default('7d'),
    }),
    encryption: z.object({
      key: z.string().length(32),
    }),
    cookie: z.object({
      secret: z.string().min(32),
      secure: z.boolean(),
      httpOnly: z.boolean().default(true),
      sameSite: z.enum(['strict', 'lax', 'none']).default('lax'),
    }),
    bcryptRounds: z.number().int().min(10).default(12),
  }),

  database: z.object({
    url: z.string().url(),
    pool: z.object({
      min: z.number().int().positive().default(2),
      max: z.number().int().positive().default(10),
      acquire: z.number().int().positive().default(60000),
      idle: z.number().int().positive().default(10000),
    }),
    logging: z.boolean(),
    ssl: z.boolean(),
  }),

  redis: z.object({
    host: z.string().default('localhost'),
    port: z.number().int().positive().default(6379),
    password: z.string().optional(),
    db: z.number().int().min(0).default(0),
    keyPrefix: z.string().default('app:'),
    tls: z.boolean().default(false),
  }),

  email: z.object({
    smtp: z.object({
      host: z.string(),
      port: z.number().int().positive(),
      secure: z.boolean().default(false),
      auth: z.object({
        user: z.string().email(),
        pass: z.string(),
      }),
    }),
    from: z.string().default('noreply@example.com'),
    replyTo: z.string().email().optional(),
  }),

  oauth: z.object({
    google: z.object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      callbackUrl: z.string().url().optional(),
    }),
    github: z.object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      callbackUrl: z.string().url().optional(),
    }),
  }),

  storage: z.object({
    type: z.enum(['local', 's3', 'gcs']).default('local'),
    local: z.object({
      path: z.string().default('./uploads'),
    }),
    s3: z.object({
      bucket: z.string().optional(),
      region: z.string().default('us-east-1'),
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
      endpoint: z.string().url().optional(),
    }),
  }),

  monitoring: z.object({
    sentry: z.object({
      dsn: z.string().url().optional(),
      environment: z.string().default('development'),
      enabled: z.boolean(),
      tracesSampleRate: z.number().min(0).max(1).default(1.0),
      profilesSampleRate: z.number().min(0).max(1).default(1.0),
    }),
    logging: z.object({
      level: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
      pretty: z.boolean().default(true),
    }),
    metrics: z.object({
      enabled: z.boolean().default(true),
      port: z.number().int().positive().default(9090),
    }),
  }),

  rateLimit: z.object({
    windowMs: z.number().int().positive().default(60000),
    max: z.number().int().positive().default(100),
    skipSuccessfulRequests: z.boolean().default(false),
    skipFailedRequests: z.boolean().default(false),
    standardHeaders: z.boolean().default(true),
    legacyHeaders: z.boolean().default(false),
  }),

  cors: z.object({
    origin: z.union([z.string(), z.array(z.string()), z.boolean(), z.function()]).default(true),
    credentials: z.boolean().default(true),
    methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
    allowedHeaders: z.array(z.string()).default(['Content-Type', 'Authorization']),
    exposedHeaders: z.array(z.string()).default([]),
    maxAge: z.number().int().positive().default(86400),
  }),

  queue: z.object({
    redis: z.object({
      host: z.string().default('localhost'),
      port: z.number().int().positive().default(6379),
      password: z.string().optional(),
    }),
    concurrency: z.number().int().positive().default(5),
    maxJobsPerWorker: z.number().int().positive().default(100),
    stalledInterval: z.number().int().positive().default(30000),
    maxStalledCount: z.number().int().positive().default(1),
  }),

  api: z.object({
    prefix: z.string().default('/api/v1'),
    swagger: z.object({
      enabled: z.boolean().default(true),
      route: z.string().default('/docs'),
      title: z.string().default('Modern Backend API'),
      description: z.string().default('Production-ready API documentation'),
    }),
    pagination: z.object({
      defaultLimit: z.number().int().positive().default(20),
      maxLimit: z.number().int().positive().default(100),
    }),
  }),

  features: z.object({
    registration: z.boolean().default(true),
    twoFactorAuth: z.boolean().default(true),
    oauth: z.boolean().default(true),
    emailVerification: z.boolean().default(true),
    passwordReset: z.boolean().default(true),
    fileUpload: z.boolean().default(true),
  }),

  external: z.object({
    openai: z.object({
      apiKey: z.string().optional(),
      organization: z.string().optional(),
    }),
    stripe: z.object({
      secretKey: z.string().optional(),
      webhookSecret: z.string().optional(),
    }),
  }),

  webhook: z.object({
    timeout: z.number().int().positive().default(30000),
    maxRetries: z.number().int().positive().default(3),
    retryDelay: z.number().int().positive().default(1000),
  }),

  search: z.object({
    elasticsearch: z.object({
      url: z.string().url().default('http://localhost:9200'),
      auth: z.union([
        z.object({
          username: z.string(),
          password: z.string().default(''),
        }),
        z.undefined()
      ]).optional(),
    }),
  }),

  support: z.object({
    email: z.string().email().default('support@example.com'),
    autoCloseDays: z.number().int().positive().default(7),
    autoCloseWarningDays: z.number().int().positive().default(5),
    satisfactionSurveyDelay: z.number().int().positive().default(86400000),
    sla: z.object({
      firstResponse: z.object({
        critical: z.number().int().positive().default(30),
        urgent: z.number().int().positive().default(60),
        high: z.number().int().positive().default(120),
        medium: z.number().int().positive().default(240),
        low: z.number().int().positive().default(480),
      }),
      resolution: z.object({
        critical: z.number().int().positive().default(240),
        urgent: z.number().int().positive().default(480),
        high: z.number().int().positive().default(1440),
        medium: z.number().int().positive().default(2880),
        low: z.number().int().positive().default(5760),
      }),
    }),

    rateLimit: z.object({
      max: z.number().int().positive().default(10),
      window: z.number().int().positive().default(3600),
    }),

    teamEmails: z.array(z.string()).default([]),
    managementEmails: z.array(z.string()).default([]),
  }),
});

// Build configuration object
function buildConfig() {
  const env = process.env.NODE_ENV || 'development';
  const isProduction = env === 'production';
  const isDevelopment = env === 'development';
  const isTest = env === 'test';

  return {
    app: {
      name: process.env.APP_NAME,
      version: process.env.APP_VERSION,
      env: env as Environment,
      port: parseInt(process.env.PORT || '3000'),
      host: process.env.HOST,
      isProduction,
      isDevelopment,
      isTest,
    },

    security: {
      jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
      encryption: {
        key: process.env.ENCRYPTION_KEY!,
      },
      cookie: {
        secret: process.env.COOKIE_SECRET!,
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'strict' : 'lax',
      },
      bcryptRounds: 12,
    },

    database: {
      url: process.env.DATABASE_URL!,
      pool: {
        min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
        max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
        acquire: parseInt(process.env.DATABASE_POOL_ACQUIRE || '60000'),
        idle: parseInt(process.env.DATABASE_POOL_IDLE || '10000'),
      },
      logging: !isProduction,
      ssl: isProduction,
    },

    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: process.env.REDIS_KEY_PREFIX,
      tls: isProduction && process.env.REDIS_TLS === 'true',
    },

    email: {
      smtp: {
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      },
      from: process.env.EMAIL_FROM,
      replyTo: process.env.EMAIL_REPLY_TO,
    },

    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/google/callback`,
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/github/callback`,
      },
    },

    storage: {
      type: process.env.STORAGE_TYPE as 'local' | 's3' | 'gcs',
      local: {
        path: process.env.STORAGE_LOCAL_PATH,
      },
      s3: {
        bucket: process.env.STORAGE_S3_BUCKET,
        region: process.env.STORAGE_S3_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        endpoint: process.env.STORAGE_S3_ENDPOINT,
      },
    },

    monitoring: {
      sentry: {
        dsn: process.env.SENTRY_DSN,
        environment: process.env.SENTRY_ENVIRONMENT || env,
        enabled: isProduction && !!process.env.SENTRY_DSN,
        tracesSampleRate: isProduction ? 0.1 : 1.0,
        profilesSampleRate: isProduction ? 0.1 : 1.0,
      },
      logging: {
        level: process.env.LOG_LEVEL as any,
        pretty: process.env.LOG_PRETTY === 'true',
      },
      metrics: {
        enabled: process.env.METRICS_ENABLED === 'true',
        port: parseInt(process.env.METRICS_PORT || '9090'),
      },
    },

    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true',
      skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED_REQUESTS === 'true',
      standardHeaders: true,
      legacyHeaders: false,
    },

    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || true,
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: [],
      maxAge: 86400,
    },

    queue: {
      redis: {
        host: process.env.QUEUE_REDIS_HOST || process.env.REDIS_HOST,
        port: parseInt(process.env.QUEUE_REDIS_PORT || process.env.REDIS_PORT || '6379'),
        password: process.env.QUEUE_REDIS_PASSWORD || process.env.REDIS_PASSWORD,
      },
      concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5'),
      maxJobsPerWorker: parseInt(process.env.QUEUE_MAX_JOBS_PER_WORKER || '100'),
      stalledInterval: 30000,
      maxStalledCount: 1,
    },

    api: {
      prefix: '/api/v1',
      swagger: {
        enabled: process.env.SWAGGER_ENABLED === 'true',
        route: process.env.SWAGGER_ROUTE,
        title: process.env.APP_NAME || 'Modern Backend API',
        description: 'Production-ready API documentation',
      },
      pagination: {
        defaultLimit: 20,
        maxLimit: 100,
      },
    },

    features: {
      registration: process.env.FEATURE_REGISTRATION_ENABLED === 'true',
      twoFactorAuth: process.env.FEATURE_2FA_ENABLED === 'true',
      oauth: process.env.FEATURE_OAUTH_ENABLED === 'true',
      emailVerification: process.env.FEATURE_EMAIL_VERIFICATION_REQUIRED === 'true',
      passwordReset: true,
      fileUpload: true,
    },

    external: {
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORGANIZATION,
      },
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },

    webhook: {
      timeout: parseInt(process.env.WEBHOOK_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.WEBHOOK_MAX_RETRIES || '3'),
      retryDelay: 1000,
    },

    search: {
      elasticsearch: {
        url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
        auth: process.env.ELASTICSEARCH_USERNAME
          ? {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD || '',
            }
          : undefined,
      },
    },

    support: {
      email: process.env.SUPPORT_EMAIL || 'support@example.com',
      autoCloseDays: parseInt(process.env.SUPPORT_AUTO_CLOSE_DAYS || '7'),
      autoCloseWarningDays: parseInt(process.env.SUPPORT_AUTO_CLOSE_WARNING_DAYS || '5'),
      satisfactionSurveyDelay: parseInt(process.env.SUPPORT_SATISFACTION_SURVEY_DELAY || '86400000'),
      sla: {
        firstResponse: {
          critical: parseInt(process.env.SLA_FIRST_RESPONSE_CRITICAL || '30'),
          urgent: parseInt(process.env.SLA_FIRST_RESPONSE_URGENT || '60'),
          high: parseInt(process.env.SLA_FIRST_RESPONSE_HIGH || '120'),
          medium: parseInt(process.env.SLA_FIRST_RESPONSE_MEDIUM || '240'),
          low: parseInt(process.env.SLA_FIRST_RESPONSE_LOW || '480'),
        },
        resolution: {
          critical: parseInt(process.env.SLA_RESOLUTION_CRITICAL || '240'),
          urgent: parseInt(process.env.SLA_RESOLUTION_URGENT || '480'),
          high: parseInt(process.env.SLA_RESOLUTION_HIGH || '1440'),
          medium: parseInt(process.env.SLA_RESOLUTION_MEDIUM || '2880'),
          low: parseInt(process.env.SLA_RESOLUTION_LOW || '5760'),
        },
      },
      rateLimit: {
        max: parseInt(process.env.TICKET_RATE_LIMIT_MAX || '10'),
        window: parseInt(process.env.TICKET_RATE_LIMIT_WINDOW || '3600'),
      },
      teamEmails: process.env.SUPPORT_TEAM_EMAILS?.split(',') || [],
      managementEmails: process.env.SUPPORT_MANAGEMENT_EMAILS?.split(',') || [],
    },
  };
}

// Validate and export configuration
let config: z.infer<typeof configSchema>;

try {
  const rawConfig = buildConfig();
  config = configSchema.parse(rawConfig);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Configuration validation failed:');
    console.error(error.format());
    process.exit(1);
  }
  throw error;
}

export { config };
export type Config = typeof config;

// Helper functions
export function getConfig(): Config {
  return config;
}

export function isProduction(): boolean {
  return config.app.isProduction;
}

export function isDevelopment(): boolean {
  return config.app.isDevelopment;
}

export function isTest(): boolean {
  return config.app.isTest;
}
