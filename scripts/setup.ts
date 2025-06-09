// scripts/setup.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import ServicesManager from './services-manager.js';
import DatabaseBootstrap from './db-bootstrap.js';

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

  private servicesManager: ServicesManager;
  private dbBootstrap: DatabaseBootstrap;

  constructor() {
    this.servicesManager = new ServicesManager();
    this.dbBootstrap = new DatabaseBootstrap();
  }

  async run() {
    console.clear();
    console.log(chalk.blue.bold('\n🚀 Modern Backend Template Setup Wizard\n'));

    // Check Docker first
    await this.checkDocker();

    // Step 1: Basic Information
    await this.askBasicInfo();

    // Step 2: Select Modules
    await this.askModules();

    // Step 3: Configure Services
    await this.askServices();

    // Step 4: Authentication Options
    await this.askAuthOptions();

    // Step 5: Generate .env file
    await this.generateEnvFile();

    // Step 6: Install Dependencies
    await this.installDependencies();

    // Step 7: Setup Services and Database
    await this.setupServices();

    // Step 8: Generate Initial Data
    await this.generateInitialData();

    // Step 9: Show Summary
    this.showSummary();
  }

  private async checkDocker() {
    const spinner = ora('Checking Docker installation...').start();

    try {
      await execAsync('docker --version');
      await execAsync('docker-compose --version');
      spinner.succeed('Docker is installed and ready');
    } catch (error) {
      spinner.fail('Docker is not installed or not running');
      console.log(chalk.yellow('\n⚠️  Docker is required for this setup.'));
      console.log('Please install Docker Desktop from: https://www.docker.com/products/docker-desktop');
      process.exit(1);
    }
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

  private async generateEnvFile() {
    const spinner = ora('Generating environment configuration...').start();

    try {
      // Use the generate-env script
      await execAsync('tsx scripts/generate-env.ts --force');

      // Update with project-specific values
      const envPath = path.join(process.cwd(), '.env');
      let envContent = await fs.readFile(envPath, 'utf-8');

      // Update project name
      envContent = envContent.replace(/APP_NAME=.*/, `APP_NAME="${this.options.projectName}"`);

      // Update module flags
      const moduleFlags = {
        BILLING_MODULE_ENABLED: this.options.features.billing,
        TENANT_MODULE_ENABLED: this.options.features.multiTenancy,
        ANALYTICS_MODULE_ENABLED: this.options.features.analytics,
        WEBHOOKS_MODULE_ENABLED: this.options.features.webhooks,
        SUPPORT_MODULE_ENABLED: this.options.features.support,
      };

      for (const [key, value] of Object.entries(moduleFlags)) {
        const regex = new RegExp(`${key}=.*`);
        envContent = envContent.replace(regex, `${key}=${value}`);
      }

      await fs.writeFile(envPath, envContent);
      spinner.succeed('Environment configuration generated');
    } catch (error) {
      spinner.fail('Failed to generate environment configuration');
      throw error;
    }
  }

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
      spinner.text = 'Installing project dependencies (this may take a few minutes)...';
      await execAsync('pnpm install', {
        env: { ...process.env, PUPPETEER_SKIP_DOWNLOAD: 'true' },
      });

      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      throw error;
    }
  }

  private async setupServices() {
    if (this.options.cache === 'redis' || this.options.database === 'postgresql') {
      const spinner = ora('Setting up services...').start();

      try {
        // Determine which services to start
        const servicesToStart: string[] = [];

        if (this.options.database === 'postgresql') {
          servicesToStart.push('postgres');
        }

        if (this.options.cache === 'redis') {
          servicesToStart.push('redis');
        }

        if (this.options.email === 'smtp') {
          servicesToStart.push('mailhog');
        }

        // Add PgAdmin for development
        if (process.env.NODE_ENV !== 'production') {
          servicesToStart.push('pgadmin');
        }

        // Use ServicesManager to start services
        spinner.text = 'Starting Docker services...';
        await this.servicesManager.startServices(servicesToStart);

        spinner.text = 'Setting up database...';

        // Use DatabaseBootstrap for proper database setup
        await this.dbBootstrap.bootstrap({
          skipDocker: true, // We already started Docker
          skipSeeding: true, // We'll seed later
          reset: false,
        });

        spinner.succeed('Services setup completed');
      } catch (error) {
        spinner.fail('Failed to setup services');
        console.log(chalk.yellow('\nTip: Make sure Docker is running and ports are not in use'));

        // Show service status
        await this.servicesManager.displayStatus();

        throw error;
      }
    }
  }

  private async generateInitialData() {
    const spinner = ora('Generating initial data...').start();

    try {
      // Only seed if we have a database
      if (this.options.database) {
        await execAsync('pnpm db:seed');
        spinner.succeed('Initial data generated');
      } else {
        spinner.info('Skipping data generation (no database)');
      }
    } catch (error) {
      spinner.warn('Failed to generate initial data (non-critical)');
      // Not critical, continue
    }
  }

  private showSummary() {
    console.log(chalk.green.bold('\n✅ Setup completed successfully!\n'));

    console.log(chalk.blue('📋 Configuration Summary:'));
    console.log(`   Project Name: ${this.options.projectName}`);
    console.log(`   Database: ${this.options.database}`);
    console.log(`   Cache: ${this.options.cache}`);
    console.log(`   Email: ${this.options.email}`);
    console.log(`   Enabled Modules: ${this.options.modules.join(', ')}`);

    console.log(chalk.blue('\n🚀 Quick Commands:'));
    console.log('   pnpm dev            - Start development server');
    console.log('   pnpm services:status - Check service status');
    console.log('   pnpm db:studio      - Open database GUI');
    console.log('   pnpm test           - Run tests');

    console.log(chalk.blue('\n📡 Service URLs:'));
    console.log('   API:        http://localhost:3000');
    console.log('   Swagger:    http://localhost:3000/docs');
    console.log('   Health:     http://localhost:3000/health');

    if (this.options.database === 'postgresql') {
      console.log('   PgAdmin:    http://localhost:5050 (admin@admin.com / admin)');
    }

    if (this.options.email === 'smtp') {
      console.log('   MailHog:    http://localhost:8025');
    }

    if (this.options.features.billing) {
      console.log(chalk.yellow('\n💳 Billing Setup:'));
      console.log('   1. Get your Stripe keys from https://dashboard.stripe.com');
      console.log('   2. Update STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env');
    }

    if (this.options.auth.oauth) {
      console.log(chalk.yellow('\n🔐 OAuth Setup:'));
      console.log('   1. Create OAuth apps on provider dashboards');
      console.log('   2. Update OAuth credentials in .env');
      console.log('   - Google: https://console.cloud.google.com');
      console.log('   - GitHub: https://github.com/settings/developers');
    }

    console.log(chalk.green('\n🎉 Your project is ready! Run "pnpm dev" to start.\n'));
  }
}

// Run setup wizard
const setup = new SetupWizard();
setup.run().catch(error => {
  console.error(chalk.red('\n❌ Setup failed:'), error.message);
  process.exit(1);
});
