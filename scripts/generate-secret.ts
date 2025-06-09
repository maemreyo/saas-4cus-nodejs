import crypto from 'crypto';
import chalk from 'chalk';
import { program } from 'commander';
import boxen from 'boxen';
import clipboard from 'clipboardy';

interface SecretOptions {
  length: number;
  type: 'base64' | 'hex' | 'alphanumeric' | 'numeric';
  prefix?: string;
  copy: boolean;
}

function generateSecret(options: SecretOptions): string {
  const { length, type, prefix } = options;

  let secret = '';

  switch (type) {
    case 'hex':
      secret = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
      break;

    case 'base64':
      secret = crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
      // Make URL-safe
      secret = secret.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      break;

    case 'alphanumeric':
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const bytes = crypto.randomBytes(length);
      for (let i = 0; i < length; i++) {
        secret += chars[bytes[i] % chars.length];
      }
      break;

    case 'numeric':
      const digits = '0123456789';
      const numBytes = crypto.randomBytes(length);
      for (let i = 0; i < length; i++) {
        secret += digits[numBytes[i] % digits.length];
      }
      break;
  }

  return prefix ? `${prefix}${secret}` : secret;
}

function generateEncryptionKey(): string {
  return crypto.randomBytes(16).toString('hex'); // 32 characters
}

function generateJWT(): string {
  return generateSecret({ length: 64, type: 'base64', copy: false });
}

function generateApiKey(): string {
  const prefix = 'sk_';
  const env = process.env.NODE_ENV === 'production' ? 'live' : 'test';
  return `${prefix}${env}_${generateSecret({ length: 32, type: 'alphanumeric', copy: false })}`;
}

function generateWebhookSecret(): string {
  return `whsec_${generateSecret({ length: 32, type: 'base64', copy: false })}`;
}

program
  .name('generate-secret')
  .description('Generate secure secrets for your application')
  .version('1.0.0');

program
  .command('secret')
  .description('Generate a general purpose secret')
  .option('-l, --length <number>', 'Secret length', '64')
  .option('-t, --type <type>', 'Secret type (base64, hex, alphanumeric, numeric)', 'base64')
  .option('-p, --prefix <prefix>', 'Add prefix to secret')
  .option('--no-copy', 'Do not copy to clipboard')
  .action((options) => {
    const secret = generateSecret({
      length: parseInt(options.length),
      type: options.type,
      prefix: options.prefix,
      copy: options.copy,
    });

    console.log(
      boxen(
        chalk.green.bold('🔐 Generated Secret\n\n') + secret,
        {
          padding: 1,
          borderColor: 'green',
        }
      )
    );

    if (options.copy) {
      try {
        clipboard.writeSync(secret);
        console.log(chalk.green('\n✅ Copied to clipboard!'));
      } catch {
        console.log(chalk.yellow('\n⚠️  Could not copy to clipboard'));
      }
    }
  });

program
  .command('jwt')
  .description('Generate JWT secret')
  .option('--no-copy', 'Do not copy to clipboard')
  .action((options) => {
    const secret = generateJWT();

    console.log(
      boxen(
        chalk.green.bold('🔐 JWT Secret\n\n') + secret,
        {
          padding: 1,
          borderColor: 'green',
        }
      )
    );

    if (options.copy) {
      try {
        clipboard.writeSync(secret);
        console.log(chalk.green('\n✅ Copied to clipboard!'));
      } catch {
        console.log(chalk.yellow('\n⚠️  Could not copy to clipboard'));
      }
    }
  });

program
  .command('encryption')
  .description('Generate encryption key (32 chars)')
  .option('--no-copy', 'Do not copy to clipboard')
  .action((options) => {
    const key = generateEncryptionKey();

    console.log(
      boxen(
        chalk.green.bold('🔐 Encryption Key\n\n') + key + '\n\n' +
        chalk.gray('Length: 32 characters (256 bits)'),
        {
          padding: 1,
          borderColor: 'green',
        }
      )
    );

    if (options.copy) {
      try {
        clipboard.writeSync(key);
        console.log(chalk.green('\n✅ Copied to clipboard!'));
      } catch {
        console.log(chalk.yellow('\n⚠️  Could not copy to clipboard'));
      }
    }
  });

program
  .command('api-key')
  .description('Generate API key')
  .option('--no-copy', 'Do not copy to clipboard')
  .action((options) => {
    const key = generateApiKey();

    console.log(
      boxen(
        chalk.green.bold('🔐 API Key\n\n') + key,
        {
          padding: 1,
          borderColor: 'green',
        }
      )
    );

    if (options.copy) {
      try {
        clipboard.writeSync(key);
        console.log(chalk.green('\n✅ Copied to clipboard!'));
      } catch {
        console.log(chalk.yellow('\n⚠️  Could not copy to clipboard'));
      }
    }
  });

program
  .command('webhook')
  .description('Generate webhook secret')
  .option('--no-copy', 'Do not copy to clipboard')
  .action((options) => {
    const secret = generateWebhookSecret();

    console.log(
      boxen(
        chalk.green.bold('🔐 Webhook Secret\n\n') + secret,
        {
          padding: 1,
          borderColor: 'green',
        }
      )
    );

    if (options.copy) {
      try {
        clipboard.writeSync(secret);
        console.log(chalk.green('\n✅ Copied to clipboard!'));
      } catch {
        console.log(chalk.yellow('\n⚠️  Could not copy to clipboard'));
      }
    }
  });

program
  .command('all')
  .description('Generate all common secrets')
  .action(() => {
    const secrets = {
      JWT_ACCESS_SECRET: generateJWT(),
      JWT_REFRESH_SECRET: generateJWT(),
      ENCRYPTION_KEY: generateEncryptionKey(),
      COOKIE_SECRET: generateSecret({ length: 64, type: 'base64', copy: false }),
      API_KEY: generateApiKey(),
      WEBHOOK_SECRET: generateWebhookSecret(),
    };

    console.log(
      boxen(
        chalk.green.bold('🔐 Generated Secrets\n\n') +
        Object.entries(secrets)
          .map(([key, value]) => `${chalk.cyan(key)}=${value}`)
          .join('\n'),
        {
          padding: 1,
          borderColor: 'green',
        }
      )
    );

    console.log(chalk.yellow('\n⚠️  Copy these to your .env file and keep them secure!'));
  });

// Default action - interactive mode
if (process.argv.length === 2) {
  console.log(chalk.blue.bold('\n🔐 Secret Generator\n'));
  console.log('Usage: pnpm generate:secret <command> [options]\n');
  console.log('Commands:');
  console.log('  secret      Generate a general purpose secret');
  console.log('  jwt         Generate JWT secret');
  console.log('  encryption  Generate encryption key');
  console.log('  api-key     Generate API key');
  console.log('  webhook     Generate webhook secret');
  console.log('  all         Generate all common secrets\n');
  console.log('Run "pnpm generate:secret <command> --help" for more options');
}

program.parse();