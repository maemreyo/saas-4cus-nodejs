import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { table } from 'table';
import boxen from 'boxen';
import dotenv from 'dotenv';

interface ValidationRule {
  key: string;
  required: boolean;
  condition?: (value: string | undefined, allVars: Record<string, string>) => boolean;
  validate?: (value: string) => boolean | string;
  description: string;
}

async function validateEnv() {
  console.clear();
  console.log(
    boxen(chalk.blue.bold('🔍 Environment Configuration Validator'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
    })
  );

  // Load .env file
  const envPath = path.join(process.cwd(), '.env');

  try {
    await fs.access(envPath);
  } catch {
    console.error(chalk.red('❌ .env file not found!'));
    console.log(chalk.yellow('Run "pnpm env:generate" to create one.'));
    process.exit(1);
  }

  const envConfig = dotenv.parse(await fs.readFile(envPath, 'utf-8'));

  // Define validation rules
  const rules: ValidationRule[] = [
    // Core required
    {
      key: 'NODE_ENV',
      required: true,
      validate: (value) => ['development', 'staging', 'production', 'test'].includes(value),
      description: 'Node environment',
    },
    {
      key: 'APP_NAME',
      required: true,
      description: 'Application name',
    },
    {
      key: 'PORT',
      required: true,
      validate: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0,
      description: 'Server port',
    },

    // Security
    {
      key: 'JWT_ACCESS_SECRET',
      required: true,
      validate: (value) => value.length >= 32 || 'Must be at least 32 characters',
      description: 'JWT access secret',
    },
    {
      key: 'JWT_REFRESH_SECRET',
      required: true,
      validate: (value) => value.length >= 32 || 'Must be at least 32 characters',
      description: 'JWT refresh secret',
    },
    {
      key: 'ENCRYPTION_KEY',
      required: true,
      validate: (value) => value.length === 32 || 'Must be exactly 32 characters',
      description: 'Encryption key',
    },

    // Database
    {
      key: 'DATABASE_URL',
      required: true,
      validate: (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return 'Invalid database URL format';
        }
      },
      description: 'Database connection URL',
    },

    // Module-specific validations
    {
      key: 'STRIPE_SECRET_KEY',
      required: false,
      condition: (_, vars) => vars.BILLING_MODULE_ENABLED === 'true',
      validate: (value) => value.startsWith('sk_') || 'Must start with sk_',
      description: 'Stripe secret key (billing module)',
    },
    {
      key: 'STRIPE_WEBHOOK_SECRET',
      required: false,
      condition: (_, vars) => vars.BILLING_MODULE_ENABLED === 'true',
      validate: (value) => value.startsWith('whsec_') || 'Must start with whsec_',
      description: 'Stripe webhook secret (billing module)',
    },
    {
      key: 'ELASTICSEARCH_URL',
      required: false,
      condition: (_, vars) => vars.SUPPORT_MODULE_ENABLED === 'true',
      validate: (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return 'Invalid Elasticsearch URL';
        }
      },
      description: 'Elasticsearch URL (support module)',
    },
    {
      key: 'GOOGLE_CLIENT_ID',
      required: false,
      condition: (_, vars) => vars.FEATURE_OAUTH_ENABLED === 'true',
      description: 'Google OAuth client ID',
    },
    {
      key: 'REDIS_HOST',
      required: false,
      condition: (_, vars) => vars.API_USAGE_MODULE_ENABLED === 'true' || vars.TENANT_MODULE_ENABLED === 'true',
      description: 'Redis host (for caching)',
    },
  ];

  // Run validations
  const results: Array<{
    key: string;
    status: 'pass' | 'fail' | 'warning' | 'skip';
    message: string;
  }> = [];

  for (const rule of rules) {
    const value = envConfig[rule.key];

    // Check condition
    if (rule.condition && !rule.condition(value, envConfig)) {
      results.push({
        key: rule.key,
        status: 'skip',
        message: 'Not required for current configuration',
      });
      continue;
    }

    // Check if required
    if (rule.required && !value) {
      results.push({
        key: rule.key,
        status: 'fail',
        message: 'Required but not set',
      });
      continue;
    }

    // Check if optional and not set
    if (!rule.required && !value) {
      results.push({
        key: rule.key,
        status: 'warning',
        message: 'Optional - not set',
      });
      continue;
    }

    // Validate value
    if (value && rule.validate) {
      const validationResult = rule.validate(value);
      if (validationResult === true) {
        results.push({
          key: rule.key,
          status: 'pass',
          message: '✓ Valid',
        });
      } else {
        results.push({
          key: rule.key,
          status: 'fail',
          message: typeof validationResult === 'string' ? validationResult : 'Invalid value',
        });
      }
    } else if (value) {
      results.push({
        key: rule.key,
        status: 'pass',
        message: '✓ Set',
      });
    }
  }

  // Display results
  console.log(chalk.blue.bold('\n📋 Validation Results:\n'));

  const tableData = [
    ['Variable', 'Status', 'Details'],
    ...results.map(r => [
      r.key,
      r.status === 'pass' ? chalk.green('✅ Pass') :
      r.status === 'fail' ? chalk.red('❌ Fail') :
      r.status === 'warning' ? chalk.yellow('⚠️  Warning') :
      chalk.gray('⏭️  Skip'),
      r.message,
    ]),
  ];

  console.log(table(tableData));

  // Module status
  console.log(chalk.blue.bold('\n📦 Module Configuration:\n'));

  const moduleKeys = Object.keys(envConfig).filter(k => k.endsWith('_MODULE_ENABLED'));
  const moduleData = [
    ['Module', 'Enabled'],
    ...moduleKeys.map(key => {
      const moduleName = key.replace('_MODULE_ENABLED', '').replace(/_/g, ' ');
      const enabled = envConfig[key] === 'true';
      return [
        moduleName,
        enabled ? chalk.green('✅ Yes') : chalk.gray('❌ No'),
      ];
    }),
  ];

  console.log(table(moduleData));

  // Summary
  const failCount = results.filter(r => r.status === 'fail').length;
  const warnCount = results.filter(r => r.status === 'warning').length;
  const passCount = results.filter(r => r.status === 'pass').length;

  console.log(chalk.bold('\n📊 Summary:'));
  console.log(`   Passed: ${chalk.green(passCount)}`);
  console.log(`   Failed: ${chalk.red(failCount)}`);
  console.log(`   Warnings: ${chalk.yellow(warnCount)}`);

  // Recommendations
  if (failCount > 0) {
    console.log(chalk.red.bold('\n❌ Configuration has errors!'));
    console.log(chalk.yellow('\n💡 Recommendations:'));

    results.filter(r => r.status === 'fail').forEach(r => {
      const rule = rules.find(rule => rule.key === r.key);
      console.log(`   - ${r.key}: ${rule?.description || 'Set this variable'}`);
    });
  } else if (warnCount > 0) {
    console.log(chalk.yellow.bold('\n⚠️  Configuration has warnings'));
    console.log(chalk.blue('Consider setting optional variables for full functionality.'));
  } else {
    console.log(chalk.green.bold('\n✅ Configuration is valid!'));
  }

  // Security warnings
  if (envConfig.NODE_ENV === 'production') {
    console.log(chalk.red.bold('\n🔒 Security Check (Production Mode):'));

    const securityIssues: string[] = [];

    if (envConfig.JWT_ACCESS_SECRET?.includes('change-this')) {
      securityIssues.push('JWT secrets contain default values');
    }

    if (envConfig.DATABASE_URL?.includes('postgres:postgres')) {
      securityIssues.push('Database using default credentials');
    }

    if (!envConfig.SENTRY_DSN) {
      securityIssues.push('Error monitoring not configured');
    }

    if (securityIssues.length > 0) {
      securityIssues.forEach(issue => {
        console.log(`   ❌ ${issue}`);
      });
    } else {
      console.log('   ✅ No security issues detected');
    }
  }

  // Exit code
  process.exit(failCount > 0 ? 1 : 0);
}

// Run validation
validateEnv().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});