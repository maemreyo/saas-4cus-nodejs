// scripts/generate-env.ts
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface EnvConfig {
  modules?: {
    auth?: boolean;
    user?: boolean;
    billing?: boolean;
    tenant?: boolean;
    notification?: boolean;
    support?: boolean;
    analytics?: boolean;
    webhooks?: boolean;
    onboarding?: boolean;
    admin?: boolean;
    apiUsage?: boolean;
    features?: boolean;
  };
  services?: {
    database?: 'postgresql' | 'mysql';
    redis?: boolean;
    elasticsearch?: boolean;
    email?: 'smtp' | 'sendgrid' | 'ses' | 'none';
    storage?: 'local' | 's3' | 'gcs';
  };
  features?: {
    oauth?: boolean;
    twoFactor?: boolean;
    emailVerification?: boolean;
  };
}

function generateSecret(length: number = 64): string {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function generateEncryptionKey(): string {
  return crypto.randomBytes(16).toString('hex'); // 32 chars
}

function generateApiKey(prefix: string = 'sk'): string {
  const env = process.env.NODE_ENV === 'production' ? 'live' : 'test';
  return `${prefix}_${env}_${generateSecret(32)}`;
}

async function generateEnvFile(config: EnvConfig = {}, interactive: boolean = true): Promise<void> {
  console.log(chalk.blue.bold('\n🔧 Environment File Generator\n'));

  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  // Default config if not provided
  const defaultConfig: EnvConfig = {
    modules: {
      auth: true,
      user: true,
      billing: true,
      tenant: true,
      notification: true,
      support: true,
      analytics: true,
      webhooks: true,
      onboarding: true,
      admin: true,
      apiUsage: true,
      features: true,
    },
    services: {
      database: 'postgresql',
      redis: true,
      elasticsearch: true,
      email: 'smtp',
      storage: 'local',
    },
    features: {
      oauth: true,
      twoFactor: true,
      emailVerification: true,
    },
  };

  // Merge with defaults
  const finalConfig = {
    modules: { ...defaultConfig.modules, ...config.modules },
    services: { ...defaultConfig.services, ...config.services },
    features: { ...defaultConfig.features, ...config.features },
  };

  // Check if .env already exists
  try {
    await fs.access(envPath);
    if (interactive) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: '.env file already exists. Overwrite?',
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('Generation cancelled.'));
        return;
      }
    }
  } catch {
    // File doesn't exist, continue
  }

  // Generate the full .env content
  const lines: string[] = [];

  // Header
  lines.push('# Generated Environment Configuration');
  lines.push(`# Generated on: ${new Date().toISOString()}`);
  lines.push('# WARNING: This file contains secrets. Do not commit to version control!');
  lines.push('');

  // Application
  lines.push('# Application');
  lines.push('NODE_ENV=development');
  lines.push('APP_NAME="Modern Backend API"');
  lines.push('APP_VERSION=2.0.0');
  lines.push('PORT=3000');
  lines.push('HOST=0.0.0.0');
  lines.push('');

  // Security
  lines.push('# Security');
  lines.push(`JWT_ACCESS_SECRET=${generateSecret()}`);
  lines.push(`JWT_REFRESH_SECRET=${generateSecret()}`);
  lines.push('JWT_ACCESS_EXPIRES_IN=15m');
  lines.push('JWT_REFRESH_EXPIRES_IN=7d');
  lines.push(`ENCRYPTION_KEY=${generateEncryptionKey()}`);
  lines.push(`COOKIE_SECRET=${generateSecret()}`);
  lines.push('');

  // Database
  lines.push('# Database');
  if (finalConfig.services.database === 'postgresql') {
    lines.push('DATABASE_URL="postgresql://postgres:postgres@localhost:5555/myapp_dev?schema=public"');
  } else {
    lines.push('DATABASE_URL="mysql://root:password@localhost:3306/myapp_dev"');
  }
  lines.push('DATABASE_POOL_MIN=2');
  lines.push('DATABASE_POOL_MAX=10');
  lines.push('DATABASE_POOL_ACQUIRE=60000');
  lines.push('DATABASE_POOL_IDLE=10000');
  lines.push('');

  // Redis
  if (finalConfig.services.redis) {
    lines.push('# Redis');
    lines.push('REDIS_HOST=localhost');
    lines.push('REDIS_PORT=6379');
    lines.push('REDIS_PASSWORD=');
    lines.push('REDIS_DB=0');
    lines.push('REDIS_KEY_PREFIX=app:');
    lines.push('');
  }

  // Email
  lines.push('# Email');
  if (finalConfig.services.email === 'smtp') {
    lines.push('SMTP_HOST=localhost');
    lines.push('SMTP_PORT=1025');
    lines.push('SMTP_SECURE=false');
    lines.push('SMTP_USER=test');
    lines.push('SMTP_PASS=test');
    lines.push('EMAIL_FROM="Modern Backend <noreply@example.com>"');
  } else if (finalConfig.services.email === 'sendgrid') {
    lines.push('# SENDGRID_API_KEY=SG.your-sendgrid-api-key');
    lines.push('EMAIL_FROM="Modern Backend <noreply@example.com>"');
  } else if (finalConfig.services.email === 'ses') {
    lines.push('# AWS_SES_REGION=us-east-1');
    lines.push('EMAIL_FROM="Modern Backend <noreply@example.com>"');
  }
  lines.push('');

  // OAuth Providers (commented if not enabled)
  if (finalConfig.features.oauth) {
    lines.push('# OAuth Providers');
    lines.push('GOOGLE_CLIENT_ID=your-google-client-id');
    lines.push('GOOGLE_CLIENT_SECRET=your-google-client-secret');
    lines.push('GITHUB_CLIENT_ID=your-github-client-id');
    lines.push('GITHUB_CLIENT_SECRET=your-github-client-secret');
    lines.push('');
  } else {
    lines.push('# OAuth Providers (Enable oauth in features to use)');
    lines.push('# GOOGLE_CLIENT_ID=your-google-client-id');
    lines.push('# GOOGLE_CLIENT_SECRET=your-google-client-secret');
    lines.push('# GITHUB_CLIENT_ID=your-github-client-id');
    lines.push('# GITHUB_CLIENT_SECRET=your-github-client-secret');
    lines.push('');
  }

  // File Storage
  lines.push('# File Storage');
  if (finalConfig.services.storage === 'local') {
    lines.push('STORAGE_TYPE=local');
    lines.push('STORAGE_LOCAL_PATH=./uploads');
  } else if (finalConfig.services.storage === 's3') {
    lines.push('STORAGE_TYPE=s3');
    lines.push('STORAGE_S3_BUCKET=your-s3-bucket');
    lines.push('STORAGE_S3_REGION=us-east-1');
    lines.push('AWS_ACCESS_KEY_ID=your-aws-access-key');
    lines.push('AWS_SECRET_ACCESS_KEY=your-aws-secret-key');
  }
  lines.push('');

  // Monitoring
  lines.push('# Monitoring');
  lines.push('# SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id');
  lines.push('# SENTRY_ENVIRONMENT=development');
  lines.push('LOG_LEVEL=debug');
  lines.push('LOG_PRETTY=true');
  lines.push('');

  // Rate Limiting
  lines.push('# Rate Limiting');
  lines.push('RATE_LIMIT_WINDOW_MS=60000');
  lines.push('RATE_LIMIT_MAX_REQUESTS=100');
  lines.push('RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false');
  lines.push('RATE_LIMIT_SKIP_FAILED_REQUESTS=false');
  lines.push('');

  // CORS
  lines.push('# CORS');
  lines.push('CORS_ORIGIN=http://localhost:3001,http://localhost:5173');
  lines.push('CORS_CREDENTIALS=true');
  lines.push('');

  // Queue
  lines.push('# Queue');
  lines.push('QUEUE_REDIS_HOST=localhost');
  lines.push('QUEUE_REDIS_PORT=6379');
  lines.push('QUEUE_CONCURRENCY=5');
  lines.push('QUEUE_MAX_JOBS_PER_WORKER=100');
  lines.push('');

  // API Documentation
  lines.push('# API Documentation');
  lines.push('SWAGGER_ENABLED=true');
  lines.push('SWAGGER_ROUTE=/docs');
  lines.push('');

  // Feature Flags
  lines.push('# Feature Flags');
  lines.push('FEATURE_REGISTRATION_ENABLED=true');
  lines.push(`FEATURE_2FA_ENABLED=${finalConfig.features.twoFactor}`);
  lines.push(`FEATURE_OAUTH_ENABLED=${finalConfig.features.oauth}`);
  lines.push(`FEATURE_EMAIL_VERIFICATION_REQUIRED=${finalConfig.features.emailVerification}`);
  lines.push('');

  // Module Configuration
  lines.push('# Module Configuration');
  lines.push(`AUTH_MODULE_ENABLED=${finalConfig.modules.auth}`);
  lines.push(`USER_MODULE_ENABLED=${finalConfig.modules.user}`);
  lines.push(`BILLING_MODULE_ENABLED=${finalConfig.modules.billing}`);
  lines.push(`TENANT_MODULE_ENABLED=${finalConfig.modules.tenant}`);
  lines.push(`NOTIFICATION_MODULE_ENABLED=${finalConfig.modules.notification}`);
  lines.push(`SUPPORT_MODULE_ENABLED=${finalConfig.modules.support}`);
  lines.push(`ANALYTICS_MODULE_ENABLED=${finalConfig.modules.analytics}`);
  lines.push(`WEBHOOKS_MODULE_ENABLED=${finalConfig.modules.webhooks}`);
  lines.push(`ONBOARDING_MODULE_ENABLED=${finalConfig.modules.onboarding}`);
  lines.push(`ADMIN_MODULE_ENABLED=${finalConfig.modules.admin}`);
  lines.push(`API_USAGE_MODULE_ENABLED=${finalConfig.modules.apiUsage}`);
  lines.push(`FEATURES_MODULE_ENABLED=${finalConfig.modules.features}`);
  lines.push('');

  // Webhook Settings
  if (finalConfig.modules.webhooks) {
    lines.push('# Webhook Settings');
    lines.push('WEBHOOK_TIMEOUT=30000');
    lines.push('WEBHOOK_MAX_RETRIES=3');
    lines.push('');
  }

  // Monitoring Endpoints
  lines.push('# Monitoring Endpoints');
  lines.push('HEALTH_CHECK_ENABLED=true');
  lines.push('METRICS_ENABLED=true');
  lines.push('METRICS_PORT=9090');
  lines.push('');

  // Billing/Stripe (commented if not enabled)
  if (finalConfig.modules.billing) {
    lines.push('# Stripe Configuration');
    lines.push('STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key');
    lines.push('STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret');
    lines.push('STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key');
    lines.push('');
  } else {
    lines.push('# Stripe Configuration (Enable billing module to use)');
    lines.push('# STRIPE_SECRET_KEY=sk_test_...');
    lines.push('# STRIPE_WEBHOOK_SECRET=whsec_...');
    lines.push('# STRIPE_PUBLISHABLE_KEY=pk_test_...');
    lines.push('');
  }

  // Multi-tenancy (commented if not enabled)
  if (finalConfig.modules.tenant) {
    lines.push('# Multi-tenancy');
    lines.push('TENANT_SUBDOMAIN_ENABLED=true');
    lines.push('TENANT_CUSTOM_DOMAIN_ENABLED=false');
    lines.push('TENANT_MAX_MEMBERS=100');
    lines.push('TENANT_INVITATION_EXPIRY_DAYS=7');
    lines.push('');
  } else {
    lines.push('# Multi-tenancy (Enable tenant module to use)');
    lines.push('# TENANT_SUBDOMAIN_ENABLED=true');
    lines.push('# TENANT_CUSTOM_DOMAIN_ENABLED=false');
    lines.push('');
  }

  // Analytics (commented if not enabled)
  if (finalConfig.modules.analytics) {
    lines.push('# Analytics');
    lines.push('# MIXPANEL_TOKEN=your-mixpanel-token');
    lines.push('# SEGMENT_WRITE_KEY=your-segment-key');
    lines.push('# GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX');
    lines.push('');
  }

  // Search
  if (finalConfig.services.elasticsearch) {
    lines.push('# Search');
    lines.push('ELASTICSEARCH_URL=http://localhost:9200');
    lines.push('ELASTICSEARCH_USERNAME=');
    lines.push('ELASTICSEARCH_PASSWORD=');
    lines.push('');
  } else {
    lines.push('# Search (Elasticsearch not enabled)');
    lines.push('# ELASTICSEARCH_URL=http://localhost:9200');
    lines.push('');
  }

  // App URLs
  lines.push('# Application URLs');
  lines.push('APP_URL=http://localhost:3000');
  lines.push('FRONTEND_URL=http://localhost:3001');
  lines.push('');

  // Support System (commented if not enabled)
  if (finalConfig.modules.support) {
    lines.push('# Support System');
    lines.push('SUPPORT_EMAIL=support@example.com');
    lines.push('SUPPORT_AUTO_CLOSE_DAYS=7');
    lines.push('SUPPORT_AUTO_CLOSE_WARNING_DAYS=5');
    lines.push('SUPPORT_SATISFACTION_SURVEY_DELAY=86400000');
    lines.push('');
    lines.push('# SLA Settings (in minutes)');
    lines.push('SLA_FIRST_RESPONSE_CRITICAL=30');
    lines.push('SLA_FIRST_RESPONSE_URGENT=60');
    lines.push('SLA_FIRST_RESPONSE_HIGH=120');
    lines.push('SLA_FIRST_RESPONSE_MEDIUM=240');
    lines.push('SLA_FIRST_RESPONSE_LOW=480');
    lines.push('');
    lines.push('SLA_RESOLUTION_CRITICAL=240');
    lines.push('SLA_RESOLUTION_URGENT=480');
    lines.push('SLA_RESOLUTION_HIGH=1440');
    lines.push('SLA_RESOLUTION_MEDIUM=2880');
    lines.push('SLA_RESOLUTION_LOW=5760');
    lines.push('');
    lines.push('# Ticket Rate Limiting');
    lines.push('TICKET_RATE_LIMIT_MAX=10');
    lines.push('TICKET_RATE_LIMIT_WINDOW=3600');
    lines.push('');
    lines.push('# Support Team Emails');
    lines.push('SUPPORT_TEAM_EMAILS=team@example.com,support@example.com');
    lines.push('SUPPORT_MANAGEMENT_EMAILS=manager@example.com');
    lines.push('');
  }

  // API Usage & Metering (commented if not enabled)
  if (finalConfig.modules.apiUsage) {
    lines.push('# API Usage & Metering');
    lines.push('API_RATE_LIMIT_WINDOW_MS=60000');
    lines.push('API_RATE_LIMIT_MAX_REQUESTS=100');
    lines.push('API_USAGE_RETENTION_DAYS=90');
    lines.push('API_USAGE_AGGREGATION_INTERVAL=3600');
    lines.push('API_ERROR_RATE_THRESHOLD=10');
    lines.push('API_SLOW_RESPONSE_THRESHOLD=3000');
    lines.push('API_HEALTH_CHECK_INTERVAL=300');
    lines.push('API_HEALTH_DEGRADED_THRESHOLD=10');
    lines.push('API_HEALTH_UNHEALTHY_THRESHOLD=25');
    lines.push('OPS_ALERT_EMAIL=ops@example.com');
    lines.push('# PAGERDUTY_INTEGRATION_KEY=your-pagerduty-key');
    lines.push('');
  }

  // Admin module settings (commented if not enabled)
  if (finalConfig.modules.admin) {
    lines.push('# Admin Module');
    lines.push('ADMIN_REGISTRATION_ENABLED=true');
    lines.push('ADMIN_IP_WHITELIST=');
    lines.push('ADMIN_SESSION_TIMEOUT=3600');
    lines.push('ADMIN_RATE_LIMIT=1000');
    lines.push('ADMIN_SUPER_ADMIN_EMAILS=super@example.com');
    lines.push('');
    lines.push('# Audit & Compliance');
    lines.push('AUDIT_LOG_RETENTION_DAYS=90');
    lines.push('COMPLIANCE_REPORT_SCHEDULE=0 0 1 * *');
    lines.push('GDPR_DATA_RETENTION_DAYS=1825');
    lines.push('');
  }

  // External APIs (always commented by default)
  lines.push('# External APIs (Uncomment and configure as needed)');
  lines.push('# OPENAI_API_KEY=sk-...');
  lines.push('# SLACK_CLIENT_ID=...');
  lines.push('# SLACK_CLIENT_SECRET=...');
  lines.push('# SENDGRID_API_KEY=SG...');
  lines.push('# MAILCHIMP_API_KEY=...');
  lines.push('# ALGOLIA_APP_ID=...');
  lines.push('# ALGOLIA_API_KEY=...');

  // Write .env file
  await fs.writeFile(envPath, lines.join('\n'));
  console.log(chalk.green('✅ .env file generated successfully!'));

  // Generate .env.example with placeholders
  const exampleLines = lines.map(line => {
    // Skip empty lines and comments
    if (!line.trim() || line.startsWith('#')) {
      return line;
    }

    const [key, value] = line.split('=');
    if (!key) return line;

    // Replace secrets with placeholders
    if (key.includes('SECRET') || key.includes('KEY') || key.includes('TOKEN')) {
      return `${key}=your-${key.toLowerCase().replace(/_/g, '-')}`;
    }

    // Keep example values for non-sensitive data
    return line;
  });

  await fs.writeFile(envExamplePath, exampleLines.join('\n'));
  console.log(chalk.green('✅ .env.example file generated successfully!'));

  // Show summary
  console.log(chalk.blue('\n📝 Configuration Summary:'));
  console.log(`   Database: ${finalConfig.services.database}`);
  console.log(`   Cache: ${finalConfig.services.redis ? 'Redis' : 'In-memory'}`);
  console.log(`   Email: ${finalConfig.services.email}`);
  console.log(`   Storage: ${finalConfig.services.storage}`);

  console.log(chalk.blue('\n📦 Enabled Modules:'));
  Object.entries(finalConfig.modules).forEach(([module, enabled]) => {
    if (enabled) {
      console.log(`   ✅ ${module}`);
    }
  });

  console.log(chalk.yellow('\n⚠️  Important:'));
  console.log('1. Review the generated .env file');
  console.log('2. Update service-specific credentials (Stripe, OAuth, etc.)');
  console.log('3. Never commit .env to version control');
  console.log('4. Use "pnpm check:env" to validate your configuration');
}

// Export for use in other scripts
export { generateEnvFile, EnvConfig };

// CLI interface
// In ES modules, we can check if this file is being run directly by checking import.meta.url
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');

  // Allow passing config via CLI (for setup.ts)
  const configArg = args.find(arg => arg.startsWith('--config='));
  let config: EnvConfig = {};

  if (configArg) {
    try {
      config = JSON.parse(configArg.split('=')[1]);
    } catch (error) {
      console.error(chalk.red('Invalid config JSON'));
      process.exit(1);
    }
  }

  generateEnvFile(config, !force).catch(error => {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  });
}
