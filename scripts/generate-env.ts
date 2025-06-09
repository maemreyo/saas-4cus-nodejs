import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface EnvTemplate {
  key: string;
  description: string;
  defaultValue?: string;
  required: boolean;
  secret?: boolean;
  example?: string;
}

const envTemplates: EnvTemplate[] = [
  // Core
  {
    key: 'NODE_ENV',
    description: 'Node environment',
    defaultValue: 'development',
    required: true,
    example: 'development | production | test',
  },
  {
    key: 'APP_NAME',
    description: 'Application name',
    defaultValue: 'Modern Backend API',
    required: true,
  },
  {
    key: 'APP_VERSION',
    description: 'Application version',
    defaultValue: '1.0.0',
    required: true,
  },
  {
    key: 'PORT',
    description: 'Server port',
    defaultValue: '3000',
    required: true,
  },

  // Database
  {
    key: 'DATABASE_URL',
    description: 'PostgreSQL connection string',
    defaultValue: 'postgresql://postgres:postgres@localhost:5432/myapp_dev?schema=public',
    required: true,
    example: 'postgresql://user:password@host:port/database',
  },

  // Security
  {
    key: 'JWT_ACCESS_SECRET',
    description: 'JWT access token secret',
    required: true,
    secret: true,
  },
  {
    key: 'JWT_REFRESH_SECRET',
    description: 'JWT refresh token secret',
    required: true,
    secret: true,
  },
  {
    key: 'ENCRYPTION_KEY',
    description: 'Encryption key (32 chars)',
    required: true,
    secret: true,
  },
  {
    key: 'COOKIE_SECRET',
    description: 'Cookie secret',
    required: true,
    secret: true,
  },

  // Redis
  {
    key: 'REDIS_HOST',
    description: 'Redis host',
    defaultValue: 'localhost',
    required: false,
  },
  {
    key: 'REDIS_PORT',
    description: 'Redis port',
    defaultValue: '6379',
    required: false,
  },

  // Email
  {
    key: 'SMTP_HOST',
    description: 'SMTP server host',
    defaultValue: 'localhost',
    required: true,
  },
  {
    key: 'SMTP_PORT',
    description: 'SMTP server port',
    defaultValue: '1025',
    required: true,
  },
  {
    key: 'SMTP_USER',
    description: 'SMTP username',
    defaultValue: 'test',
    required: true,
  },
  {
    key: 'SMTP_PASS',
    description: 'SMTP password',
    defaultValue: 'test',
    required: true,
  },

  // Module flags
  {
    key: 'BILLING_MODULE_ENABLED',
    description: 'Enable billing module',
    defaultValue: 'false',
    required: false,
  },
  {
    key: 'TENANT_MODULE_ENABLED',
    description: 'Enable multi-tenancy module',
    defaultValue: 'false',
    required: false,
  },
  {
    key: 'SUPPORT_MODULE_ENABLED',
    description: 'Enable support ticket module',
    defaultValue: 'false',
    required: false,
  },
  {
    key: 'ANALYTICS_MODULE_ENABLED',
    description: 'Enable analytics module',
    defaultValue: 'true',
    required: false,
  },
  {
    key: 'WEBHOOKS_MODULE_ENABLED',
    description: 'Enable webhooks module',
    defaultValue: 'false',
    required: false,
  },
  {
    key: 'ONBOARDING_MODULE_ENABLED',
    description: 'Enable onboarding module',
    defaultValue: 'true',
    required: false,
  },
  {
    key: 'ADMIN_MODULE_ENABLED',
    description: 'Enable admin module',
    defaultValue: 'false',
    required: false,
  },
];

function generateSecret(length: number = 64): string {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function generateEncryptionKey(): string {
  return crypto.randomBytes(16).toString('hex'); // 32 chars
}

async function generateEnvFile(interactive: boolean = true): Promise<void> {
  console.log(chalk.blue.bold('\n🔧 Environment File Generator\n'));

  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

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
    } else {
      console.log(chalk.yellow('.env file already exists. Use --force to overwrite.'));
      return;
    }
  } catch {
    // File doesn't exist, continue
  }

  const lines: string[] = [
    '# Generated Environment Configuration',
    `# Generated on: ${new Date().toISOString()}`,
    '# WARNING: This file contains secrets. Do not commit to version control!',
    '',
  ];

  let currentSection = '';

  for (const template of envTemplates) {
    // Add section headers
    const section = getSection(template.key);
    if (section !== currentSection) {
      lines.push('');
      lines.push(`# ${section}`);
      currentSection = section;
    }

    // Add description
    lines.push(`# ${template.description}${template.required ? ' (REQUIRED)' : ' (optional)'}`);
    if (template.example) {
      lines.push(`# Example: ${template.example}`);
    }

    // Generate value
    let value = template.defaultValue || '';

    if (template.secret) {
      if (template.key === 'ENCRYPTION_KEY') {
        value = generateEncryptionKey();
      } else {
        value = generateSecret();
      }
    }

    lines.push(`${template.key}=${value}`);
  }

  // Write .env file
  await fs.writeFile(envPath, lines.join('\n'));
  console.log(chalk.green('✅ .env file generated successfully!'));

  // Generate .env.example
  const exampleLines = lines.map(line => {
    // Replace secret values with placeholders
    if (line.includes('_SECRET=') || line.includes('_KEY=')) {
      const [key] = line.split('=');
      return `${key}=your-${key.toLowerCase().replace(/_/g, '-')}`;
    }
    return line;
  });

  await fs.writeFile(envExamplePath, exampleLines.join('\n'));
  console.log(chalk.green('✅ .env.example file generated successfully!'));

  // Show next steps
  console.log(chalk.blue('\n📝 Next Steps:'));
  console.log('1. Review the generated .env file');
  console.log('2. Update any values specific to your environment');
  console.log('3. Never commit .env to version control');
  console.log('4. Use "pnpm check:env" to validate your configuration');
}

function getSection(key: string): string {
  if (key.startsWith('APP_') || key === 'NODE_ENV' || key === 'PORT') {
    return 'Application';
  }
  if (key.includes('DATABASE') || key.includes('DB_')) {
    return 'Database';
  }
  if (key.includes('REDIS')) {
    return 'Redis';
  }
  if (key.includes('SECRET') || key.includes('KEY') || key.includes('JWT')) {
    return 'Security';
  }
  if (key.includes('SMTP') || key.includes('EMAIL')) {
    return 'Email';
  }
  if (key.includes('MODULE')) {
    return 'Modules';
  }
  return 'Other';
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');

  generateEnvFile(!force).catch(error => {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  });
}