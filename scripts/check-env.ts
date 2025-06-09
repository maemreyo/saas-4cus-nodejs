import { EnvironmentValidator } from '../src/infrastructure/config/env-validator';
import chalk from 'chalk';
import boxen from 'boxen';
import { table } from 'table';

interface ServiceStatus {
  name: string;
  status: 'ready' | 'missing' | 'error';
  message: string;
}

async function checkEnvironment() {
  console.clear();
  console.log(
    boxen(chalk.blue.bold('🔍 Environment Health Check'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
    })
  );

  // Run environment validation
  const validation = EnvironmentValidator.validate();
  EnvironmentValidator.printReport(validation);

  // Check services configuration
  console.log(chalk.blue.bold('\n📡 Service Configuration:\n'));

  const services: ServiceStatus[] = [
    // Database
    {
      name: 'PostgreSQL',
      status: process.env.DATABASE_URL ? 'ready' : 'missing',
      message: process.env.DATABASE_URL ? '✅ Configured' : '❌ DATABASE_URL not set',
    },
    // Redis
    {
      name: 'Redis',
      status: process.env.REDIS_HOST ? 'ready' : 'missing',
      message: process.env.REDIS_HOST
        ? `✅ ${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}`
        : '⚠️  Not configured (using memory cache)',
    },
    // Email
    {
      name: 'Email',
      status: process.env.SMTP_HOST ? 'ready' : 'missing',
      message: process.env.SMTP_HOST
        ? `✅ SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`
        : '❌ Email not configured',
    },
    // Elasticsearch
    {
      name: 'Elasticsearch',
      status: process.env.ELASTICSEARCH_URL ? 'ready' : 'missing',
      message: process.env.ELASTICSEARCH_URL
        ? `✅ ${process.env.ELASTICSEARCH_URL}`
        : '⚠️  Not configured (optional)',
    },
  ];

  // Check optional services based on enabled modules
  if (process.env.BILLING_MODULE_ENABLED === 'true') {
    services.push({
      name: 'Stripe',
      status: process.env.STRIPE_SECRET_KEY ? 'ready' : 'error',
      message: process.env.STRIPE_SECRET_KEY
        ? '✅ Configured'
        : '❌ Billing enabled but Stripe not configured',
    });
  }

  if (process.env.MONITORING_ENABLED === 'true') {
    services.push({
      name: 'Sentry',
      status: process.env.SENTRY_DSN ? 'ready' : 'missing',
      message: process.env.SENTRY_DSN
        ? '✅ Configured'
        : '⚠️  Monitoring enabled but Sentry not configured',
    });
  }

  // Display services table
  const serviceData = [
    ['Service', 'Status', 'Details'],
    ...services.map(s => [
      s.name,
      s.status === 'ready'
        ? chalk.green('Ready')
        : s.status === 'missing'
        ? chalk.yellow('Missing')
        : chalk.red('Error'),
      s.message,
    ]),
  ];

  console.log(table(serviceData));

  // Check enabled modules
  console.log(chalk.blue.bold('\n📦 Module Status:\n'));

  const modules = [
    { name: 'Authentication', key: 'AUTH_MODULE_ENABLED', default: true },
    { name: 'User Management', key: 'USER_MODULE_ENABLED', default: true },
    { name: 'Billing', key: 'BILLING_MODULE_ENABLED', default: false },
    { name: 'Multi-tenancy', key: 'TENANT_MODULE_ENABLED', default: false },
    { name: 'Support Tickets', key: 'SUPPORT_MODULE_ENABLED', default: false },
    { name: 'Analytics', key: 'ANALYTICS_MODULE_ENABLED', default: true },
    { name: 'Webhooks', key: 'WEBHOOKS_MODULE_ENABLED', default: false },
    { name: 'Onboarding', key: 'ONBOARDING_MODULE_ENABLED', default: true },
    { name: 'Admin Dashboard', key: 'ADMIN_MODULE_ENABLED', default: false },
    { name: 'API Usage', key: 'API_USAGE_MODULE_ENABLED', default: true },
  ];

  const moduleData = [
    ['Module', 'Status', 'Environment Variable'],
    ...modules.map(m => {
      const enabled = process.env[m.key] !== 'false' && (process.env[m.key] === 'true' || m.default);
      return [
        m.name,
        enabled ? chalk.green('✅ Enabled') : chalk.gray('❌ Disabled'),
        m.key,
      ];
    }),
  ];

  console.log(table(moduleData));

  // Security check
  console.log(chalk.blue.bold('\n🔒 Security Check:\n'));

  const securityChecks = [
    {
      name: 'JWT Access Secret',
      passed: process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET.length >= 32,
      message:
        process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET.length >= 32
          ? '✅ Strong secret configured'
          : '❌ Weak or missing secret',
    },
    {
      name: 'JWT Refresh Secret',
      passed: process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length >= 32,
      message:
        process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length >= 32
          ? '✅ Strong secret configured'
          : '❌ Weak or missing secret',
    },
    {
      name: 'Encryption Key',
      passed: process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 32,
      message:
        process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 32
          ? '✅ Valid encryption key'
          : '❌ Invalid or missing encryption key',
    },
    {
      name: 'Production Check',
      passed: process.env.NODE_ENV !== 'production' || !process.env.JWT_ACCESS_SECRET?.includes('change-this'),
      message:
        process.env.NODE_ENV !== 'production' || !process.env.JWT_ACCESS_SECRET?.includes('change-this')
          ? '✅ No default secrets in production'
          : '❌ Default secrets detected in production!',
    },
  ];

  securityChecks.forEach(check => {
    console.log(`${check.name}: ${check.message}`);
  });

  // Overall status
  const hasErrors = validation.errors.length > 0 || securityChecks.some(c => !c.passed);
  const hasWarnings = validation.warnings.length > 0;

  console.log('\n' + chalk.bold('Overall Status:'));
  if (hasErrors) {
    console.log(
      boxen(chalk.red.bold('❌ Environment has critical issues!'), {
        padding: 1,
        borderColor: 'red',
      })
    );
  } else if (hasWarnings) {
    console.log(
      boxen(chalk.yellow.bold('⚠️  Environment has warnings'), {
        padding: 1,
        borderColor: 'yellow',
      })
    );
  } else {
    console.log(
      boxen(chalk.green.bold('✅ Environment is properly configured!'), {
        padding: 1,
        borderColor: 'green',
      })
    );
  }

  // Exit with appropriate code
  process.exit(hasErrors ? 1 : 0);
}

// Run check
checkEnvironment().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});