import { z } from 'zod';
import { logger } from '@shared/logger';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

interface EnvRequirement {
  key: string;
  required: boolean;
  description: string;
  example?: string;
  validator?: (value: string) => boolean;
}

export class EnvironmentValidator {
  private static requirements: EnvRequirement[] = [
    // Core Requirements
    {
      key: 'NODE_ENV',
      required: true,
      description: 'Node environment (development/production/test)',
      example: 'development',
      validator: (v) => ['development', 'production', 'test', 'staging'].includes(v),
    },
    {
      key: 'DATABASE_URL',
      required: true,
      description: 'PostgreSQL connection string',
      example: 'postgresql://user:password@localhost:5555/mydb',
      validator: (v) => v.startsWith('postgresql://') || v.startsWith('postgres://'),
    },

    // Security
    {
      key: 'JWT_ACCESS_SECRET',
      required: true,
      description: 'JWT access token secret (min 32 chars)',
      example: 'your-super-secret-jwt-access-key-change-this-in-production',
      validator: (v) => v.length >= 32,
    },
    {
      key: 'JWT_REFRESH_SECRET',
      required: true,
      description: 'JWT refresh token secret (min 32 chars)',
      example: 'your-super-secret-jwt-refresh-key-change-this-in-production',
      validator: (v) => v.length >= 32,
    },
    {
      key: 'ENCRYPTION_KEY',
      required: true,
      description: 'Encryption key (exactly 32 chars)',
      example: 'your-32-character-encryption-key',
      validator: (v) => v.length === 32,
    },
    {
      key: 'COOKIE_SECRET',
      required: true,
      description: 'Cookie secret (min 32 chars)',
      example: 'your-cookie-secret-change-this-in-production',
      validator: (v) => v.length >= 32,
    },

    // Email
    {
      key: 'SMTP_HOST',
      required: true,
      description: 'SMTP server host',
      example: 'smtp.gmail.com',
    },
    {
      key: 'SMTP_USER',
      required: true,
      description: 'SMTP username/email',
      example: 'your-email@gmail.com',
      validator: (v) => v.includes('@'),
    },
    {
      key: 'SMTP_PASS',
      required: true,
      description: 'SMTP password',
      example: 'your-app-password',
    },

    // Redis
    {
      key: 'REDIS_HOST',
      required: false,
      description: 'Redis host',
      example: 'localhost',
    },
    {
      key: 'REDIS_PORT',
      required: false,
      description: 'Redis port',
      example: '6379',
      validator: (v) => !isNaN(parseInt(v)),
    },

    // Billing (Stripe)
    {
      key: 'STRIPE_SECRET_KEY',
      required: false,
      description: 'Stripe secret key (required for billing)',
      example: 'sk_test_...',
      validator: (v) => v.startsWith('sk_'),
    },
    {
      key: 'STRIPE_WEBHOOK_SECRET',
      required: false,
      description: 'Stripe webhook secret (required for billing)',
      example: 'whsec_...',
      validator: (v) => v.startsWith('whsec_'),
    },

    // OAuth (optional)
    {
      key: 'GOOGLE_CLIENT_ID',
      required: false,
      description: 'Google OAuth client ID',
      example: 'your-google-client-id.apps.googleusercontent.com',
    },
    {
      key: 'GOOGLE_CLIENT_SECRET',
      required: false,
      description: 'Google OAuth client secret',
      example: 'your-google-client-secret',
    },

    // Monitoring (optional)
    {
      key: 'SENTRY_DSN',
      required: false,
      description: 'Sentry DSN for error tracking',
      example: 'https://your-sentry-dsn@sentry.io/project-id',
      validator: (v) => v.startsWith('https://'),
    },
  ];

  static validate(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check required environment variables
    for (const req of this.requirements) {
      const value = process.env[req.key];

      if (req.required && !value) {
        errors.push(`Missing required environment variable: ${req.key} - ${req.description}`);
        if (req.example) {
          errors.push(`  Example: ${req.key}=${req.example}`);
        }
      } else if (value && req.validator && !req.validator(value)) {
        errors.push(`Invalid value for ${req.key}: ${req.description}`);
        if (req.example) {
          errors.push(`  Example: ${req.key}=${req.example}`);
        }
      } else if (!req.required && !value) {
        warnings.push(`Optional variable not set: ${req.key} - ${req.description}`);
      }
    }

    // Module-specific checks
    if (process.env.BILLING_MODULE_ENABLED !== 'false' && !process.env.STRIPE_SECRET_KEY) {
      warnings.push('Billing module is enabled but Stripe is not configured');
      suggestions.push('Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET or disable billing with BILLING_MODULE_ENABLED=false');
    }

    if (!process.env.ELASTICSEARCH_URL && process.env.SUPPORT_MODULE_ENABLED !== 'false') {
      warnings.push('Support module may have limited search functionality without Elasticsearch');
      suggestions.push('Consider setting up Elasticsearch for better search capabilities');
    }

    // Security checks
    if (process.env.NODE_ENV === 'production') {
      if (process.env.JWT_ACCESS_SECRET?.includes('change-this')) {
        errors.push('JWT_ACCESS_SECRET contains default value - must be changed in production!');
      }
      if (process.env.JWT_REFRESH_SECRET?.includes('change-this')) {
        errors.push('JWT_REFRESH_SECRET contains default value - must be changed in production!');
      }
      if (process.env.ENCRYPTION_KEY?.includes('change-this')) {
        errors.push('ENCRYPTION_KEY contains default value - must be changed in production!');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  static generateEnvExample(): string {
    const lines: string[] = [
      '# Generated .env.example file',
      '# Copy this to .env and update with your values',
      '',
    ];

    let currentSection = '';

    for (const req of this.requirements) {
      // Add section headers
      const section = this.getSection(req.key);
      if (section !== currentSection) {
        lines.push('');
        lines.push(`# ${section}`);
        currentSection = section;
      }

      lines.push(`# ${req.description}${req.required ? ' (REQUIRED)' : ' (optional)'}`);
      if (req.example) {
        lines.push(`${req.key}=${req.example}`);
      } else {
        lines.push(`${req.key}=`);
      }
    }

    return lines.join('\n');
  }

  private static getSection(key: string): string {
    if (key.startsWith('JWT_') || key.startsWith('ENCRYPTION_') || key.includes('SECRET')) {
      return 'Security';
    }
    if (key.startsWith('SMTP_') || key.includes('EMAIL')) {
      return 'Email';
    }
    if (key.startsWith('REDIS_')) {
      return 'Redis';
    }
    if (key.startsWith('STRIPE_')) {
      return 'Billing';
    }
    if (key.includes('OAUTH') || key.includes('GOOGLE_') || key.includes('GITHUB_')) {
      return 'OAuth';
    }
    if (key.includes('SENTRY') || key.includes('LOG')) {
      return 'Monitoring';
    }
    return 'Core';
  }

  static async checkAndCreateEnvFile(): Promise<void> {
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');

    // Check if .env exists
    if (!fs.existsSync(envPath)) {
      logger.warn('.env file not found');

      // Check if .env.example exists
      if (fs.existsSync(envExamplePath)) {
        logger.info('Copying .env.example to .env...');
        fs.copyFileSync(envExamplePath, envPath);
        logger.info('.env file created from .env.example');
        logger.warn('Please update .env with your actual values');
      } else {
        logger.warn('.env.example not found, generating...');
        const content = this.generateEnvExample();
        fs.writeFileSync(envExamplePath, content);
        fs.writeFileSync(envPath, content);
        logger.info('.env and .env.example files created');
        logger.warn('Please update .env with your actual values');
      }
    }
  }

  static printReport(result: ReturnType<typeof EnvironmentValidator.validate>): void {
    console.log('\n=== Environment Validation Report ===\n');

    if (result.valid) {
      console.log('✅ Environment validation passed!\n');
    } else {
      console.log('❌ Environment validation failed!\n');
    }

    if (result.errors.length > 0) {
      console.log('🚨 Errors:');
      result.errors.forEach(error => console.log(`   ${error}`));
      console.log('');
    }

    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      result.warnings.forEach(warning => console.log(`   ${warning}`));
      console.log('');
    }

    if (result.suggestions.length > 0) {
      console.log('💡 Suggestions:');
      result.suggestions.forEach(suggestion => console.log(`   ${suggestion}`));
      console.log('');
    }

    if (!result.valid) {
      console.log('Please fix the errors above before starting the application.\n');
    }
  }
}
