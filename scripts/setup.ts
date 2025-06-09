// scripts/setup.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

const execAsync = promisify(exec);

interface SetupOptions {
  projectName: string;
  modules: string[];
  database: 'postgresql' | 'mysql';
  cache: 'redis' | 'memory';
  email: 'smtp' | 'sendgrid' | 'none';
  auth: {
    jwt: boolean;
    oauth: boolean;
    twoFactor: boolean;
  };
  features: {
    billing: boolean;
    multiTenancy: boolean;
    analytics: boolean;
    webhooks: boolean;
    support: boolean;
  };
}

class SetupWizard {
  private options: SetupOptions = {
    projectName: 'my-app',
    modules: [],
    database: 'postgresql',
    cache: 'redis',
    email: 'smtp',
    auth: {
      jwt: true,
      oauth: false,
      twoFactor: false,
    },
    features: {
      billing: false,
      multiTenancy: false,
      analytics: true,
      webhooks: false,
      support: false,
    },
  };

  async run() {
    console.clear();
    console.log(chalk.blue.bold('\n🚀 Modern Backend Template Setup Wizard\n'));

    // Step 1: Basic Information
    await this.askBasicInfo();

    // Step 2: Select Modules
    await this.askModules();

    // Step 3: Configure Services
    await this.askServices();

    // Step 4: Authentication Options
    await this.askAuthOptions();

    // Step 5: Generate Configuration
    // await this.generateConfiguration();

    // Step 6: Install Dependencies
    await this.installDependencies();

    // Step 7: Setup Database
    await this.setupDatabase();

    // Step 8: Generate Initial Data
    await this.generateInitialData();

    // Step 9: Show Summary
    this.showSummary();
  }

  private async askBasicInfo() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-app',
        validate: (input: string) => {
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Project name can only contain lowercase letters, numbers, and hyphens';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'environment',
        message: 'Which environment are you setting up?',
        choices: ['development', 'production', 'staging'],
        default: 'development',
      },
    ]);

    this.options.projectName = answers.projectName;
  }

  private async askModules() {
    const { modules } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'modules',
        message: 'Which modules would you like to enable?',
        choices: [
          { name: 'Authentication & Users', value: 'auth', checked: true },
          { name: 'Billing & Subscriptions', value: 'billing' },
          { name: 'Multi-tenancy', value: 'tenant' },
          { name: 'Support Tickets', value: 'support' },
          { name: 'Analytics & Tracking', value: 'analytics', checked: true },
          { name: 'Webhooks', value: 'webhooks' },
          { name: 'User Onboarding', value: 'onboarding' },
          { name: 'Admin Dashboard', value: 'admin' },
          { name: 'API Usage Tracking', value: 'api-usage', checked: true },
          { name: 'Notifications', value: 'notifications', checked: true },
        ],
      },
    ]);

    this.options.modules = modules;

    // Update features based on module selection
    this.options.features.billing = modules.includes('billing');
    this.options.features.multiTenancy = modules.includes('tenant');
    this.options.features.analytics = modules.includes('analytics');
    this.options.features.webhooks = modules.includes('webhooks');
    this.options.features.support = modules.includes('support');
  }

  private async askServices() {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'database',
        message: 'Which database would you like to use?',
        choices: [
          { name: 'PostgreSQL (recommended)', value: 'postgresql' },
          { name: 'MySQL', value: 'mysql' },
        ],
        default: 'postgresql',
      },
      {
        type: 'list',
        name: 'cache',
        message: 'Which caching solution would you like to use?',
        choices: [
          { name: 'Redis (recommended)', value: 'redis' },
          { name: 'In-Memory', value: 'memory' },
        ],
        default: 'redis',
      },
      {
        type: 'list',
        name: 'email',
        message: 'How will you send emails?',
        choices: [
          { name: 'SMTP', value: 'smtp' },
          { name: 'SendGrid', value: 'sendgrid' },
          { name: 'None (disable email)', value: 'none' },
        ],
        default: 'smtp',
      },
    ]);

    Object.assign(this.options, answers);
  }

  private async askAuthOptions() {
    if (this.options.modules.includes('auth')) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'oauth',
          message: 'Enable OAuth providers (Google, GitHub)?',
          default: false,
        },
        {
          type: 'confirm',
          name: 'twoFactor',
          message: 'Enable two-factor authentication?',
          default: false,
        },
      ]);

      this.options.auth.oauth = answers.oauth;
      this.options.auth.twoFactor = answers.twoFactor;
    }
  }

  // private generateEnvFile(): string {
  //   const lines: string[] = [
  //     '# Generated by Setup Wizard',
  //     `# Project: ${this.options.projectName}`,
  //     `# Date: ${new Date().toISOString()}`,
  //     '',
  //     '# Core',
  //     'NODE_ENV=development',
  //     `APP_NAME="${this.options.projectName}"`,
  //     'APP_VERSION=1.0.0',
  //     'PORT=3000',
  //     'HOST=0.0.0.0',
  //     '',
  //     '# Database',
  //   ];

  //   if (this.options.database === 'postgresql') {
  //     lines.push('DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp_dev?schema=public"');
  //   } else {
  //     lines.push('DATABASE_URL="mysql://root:password@localhost:3306/myapp_dev"');
  //   }

  //   lines.push('', '# Redis');
  //   if (this.options.cache === 'redis') {
  //     lines.push('REDIS_HOST=localhost');
  //     lines.push('REDIS_PORT=6379');
  //     lines.push('REDIS_PASSWORD=');
  //   }

  //   lines.push('', '# Security');
  //   lines.push(`JWT_ACCESS_SECRET="${this.generateSecret()}"`)
  //   lines.push(`JWT_REFRESH_SECRET="${this.generateSecret()}"`)
  //   lines.push('JWT_ACCESS_EXPIRES_IN=15m');
  //   lines.push('JWT_REFRESH_EXPIRES_IN=7d');
  //   lines.push(`ENCRYPTION_KEY="${this.generateSecret(32)}"`)
  //   lines.push(`COOKIE_SECRET="${this.generateSecret()}"`)

  //   if (this.options.email !== 'none') {
  //     lines.push('', '# Email');
  //     if (this.options.email === 'smtp') {
  //       lines.push('SMTP_HOST=localhost');
  //       lines.push('SMTP_PORT=1025');
  //       lines.push('SMTP_SECURE=false');
  //       lines.push('SMTP_USER=test');
  //       lines.push('SMTP_PASS=test');
  //     } else if (this.options.email === 'sendgrid') {
  //       lines.push('SENDGRID_API_KEY=your-sendgrid-api-key');
  //     }
  //     lines.push('EMAIL_FROM="noreply@example.com"');
  //   }

  //   // Module-specific configuration
  //   if (this.options.features.billing) {
  //     lines.push('', '# Billing');
  //     lines.push('STRIPE_SECRET_KEY=sk_test_...');
  //     lines.push('STRIPE_WEBHOOK_SECRET=whsec_...');
  //   }

  //   if (this.options.auth.oauth) {
  //     lines.push('', '# OAuth');
  //     lines.push('GOOGLE_CLIENT_ID=your-google-client-id');
  //     lines.push('GOOGLE_CLIENT_SECRET=your-google-client-secret');
  //     lines.push('GITHUB_CLIENT_ID=your-github-client-id');
  //     lines.push('GITHUB_CLIENT_SECRET=your-github-client-secret');
  //   }

  //   // Module toggles
  //   lines.push('', '# Module Configuration');
  //   lines.push(`BILLING_MODULE_ENABLED=${this.options.features.billing}`);
  //   lines.push(`TENANT_MODULE_ENABLED=${this.options.features.multiTenancy}`);
  //   lines.push(`SUPPORT_MODULE_ENABLED=${this.options.features.support}`);
  //   lines.push(`ANALYTICS_MODULE_ENABLED=${this.options.features.analytics}`);
  //   lines.push(`WEBHOOKS_MODULE_ENABLED=${this.options.features.webhooks}`);

  //   return lines.join('\n');
  // }

  // private generateSecret(length: number = 64): string {
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let result = '';
  //   for (let i = 0; i < length; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // }

  // private generateModuleConfig() {
  //   return {
  //     modules: {
  //       auth: { enabled: this.options.modules.includes('auth') },
  //       user: { enabled: true }, // Always enabled
  //       billing: { enabled: this.options.features.billing },
  //       tenant: { enabled: this.options.features.multiTenancy },
  //       notification: { enabled: this.options.modules.includes('notifications') },
  //       support: { enabled: this.options.features.support },
  //       analytics: { enabled: this.options.features.analytics },
  //       webhooks: { enabled: this.options.features.webhooks },
  //       onboarding: { enabled: this.options.modules.includes('onboarding') },
  //       admin: { enabled: this.options.modules.includes('admin') },
  //       apiUsage: { enabled: this.options.modules.includes('api-usage') },
  //     },
  //     features: this.options.features,
  //     auth: this.options.auth,
  //   };
  // }

  private async installDependencies() {
    const spinner = ora('Installing dependencies...').start();

    try {
      // Check if pnpm is installed
      try {
        await execAsync('pnpm --version');
      } catch {
        spinner.text = 'Installing pnpm...';
        await execAsync('npm install -g pnpm');
      }

      // Install dependencies
      spinner.text = 'Installing project dependencies...';
      await execAsync('pnpm install');

      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      throw error;
    }
  }

  private async setupDatabase() {
    if (this.options.cache === 'redis' || this.options.database === 'postgresql') {
      const spinner = ora('Setting up services...').start();

      try {
        // Create docker-compose.dev.yml if needed
        spinner.text = 'Starting Docker services...';
        await execAsync('docker-compose -f docker-compose.dev.yml up -d');

        // Wait for services to be ready
        spinner.text = 'Waiting for services to be ready...';
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Run migrations
        spinner.text = 'Running database migrations...';
        await execAsync('pnpm db:migrate');

        spinner.succeed('Services setup completed');
      } catch (error) {
        spinner.fail('Failed to setup services');
        console.log(chalk.yellow('\nTip: Make sure Docker is installed and running'));
        throw error;
      }
    }
  }

  private async generateInitialData() {
    const spinner = ora('Generating initial data...').start();

    try {
      // Seed database
      await execAsync('pnpm db:seed');

      spinner.succeed('Initial data generated');
    } catch (error) {
      spinner.fail('Failed to generate initial data');
      // Not critical, continue
    }
  }

  private showSummary() {
    console.log(chalk.green.bold('\n✅ Setup completed successfully!\n'));

    console.log(chalk.blue('📋 Configuration Summary:'));
    console.log(`   Project Name: ${this.options.projectName}`);
    console.log(`   Database: ${this.options.database}`);
    console.log(`   Cache: ${this.options.cache}`);
    console.log(`   Enabled Modules: ${this.options.modules.join(', ')}`);

    console.log(chalk.blue('\n🚀 Next Steps:'));
    console.log('   1. Review and update the .env file with your actual values');
    console.log('   2. Start the development server: pnpm dev');
    console.log('   3. View API documentation: http://localhost:3000/docs');
    console.log('   4. Check health status: http://localhost:3000/health');

    if (this.options.features.billing) {
      console.log(chalk.yellow('\n💳 Billing Setup:'));
      console.log("   Don't forget to update your Stripe keys in .env");
    }

    if (this.options.auth.oauth) {
      console.log(chalk.yellow('\n🔐 OAuth Setup:'));
      console.log('   Configure your OAuth providers in .env');
    }

    console.log(chalk.green('\n🎉 Happy coding!\n'));
  }
}

// Run setup wizard
const setup = new SetupWizard();
setup.run().catch(error => {
  console.error(chalk.red('\n❌ Setup failed:'), error.message);
  process.exit(1);
});
