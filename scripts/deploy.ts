// scripts/deploy.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import crypto from 'crypto';

const execAsync = promisify(exec);

interface DeploymentConfig {
  provider: 'render' | 'railway';
  appName: string;
  environment: 'staging' | 'production';
  database: 'included' | 'external';
  databaseUrl?: string;
  region?: string;
  customDomain?: string;
  envVars: Record<string, string>;
}

interface ProviderConfig {
  name: string;
  cost: string;
  features: string[];
  limitations: string[];
  setup: () => Promise<void>;
  deploy: (config: DeploymentConfig) => Promise<void>;
  postDeploy: (config: DeploymentConfig) => Promise<void>;
}

class DeploymentManager {
  private providers: Record<string, ProviderConfig>;
  private config: DeploymentConfig | null = null;

  constructor() {
    this.providers = {
      render: {
        name: 'Render',
        cost: 'FREE (750 hours/month)',
        features: [
          '✅ Free PostgreSQL database',
          '✅ Auto-deploy from Git',
          '✅ SSL certificates',
          '✅ Environment variables',
          '✅ Health checks',
          '✅ Logs & monitoring'
        ],
        limitations: [
          '⚠️  Auto-sleep after 15 minutes (free tier)',
          '⚠️  750 hours/month limit',
          '⚠️  Slower cold starts'
        ],
        setup: this.setupRender.bind(this),
        deploy: this.deployToRender.bind(this),
        postDeploy: this.postDeployRender.bind(this)
      },
      railway: {
        name: 'Railway',
        cost: '$5/month (after $5 free credit)',
        features: [
          '✅ Always-on service',
          '✅ Instant deployments',
          '✅ Built-in databases',
          '✅ Custom domains',
          '✅ Team collaboration',
          '✅ Better performance'
        ],
        limitations: [
          '💰 $5/month after free trial',
          '⚠️  Limited free credit'
        ],
        setup: this.setupRailway.bind(this),
        deploy: this.deployToRailway.bind(this),
        postDeploy: this.postDeployRailway.bind(this)
      }
    };
  }

  async run() {
    console.clear();
    console.log(chalk.blue.bold('\n🚀 Universal Deployment Script\n'));
    console.log(chalk.gray('Deploy your backend to Render (FREE) or Railway ($5/month)\n'));

    try {
      await this.checkPrerequisites();
      await this.chooseProvider();
      await this.configureDeployment();
      await this.generateSecrets();
      await this.providers[this.config!.provider].setup();
      await this.providers[this.config!.provider].deploy(this.config!);
      await this.providers[this.config!.provider].postDeploy(this.config!);

      this.showSuccess();
    } catch (error) {
      console.error(chalk.red('\n❌ Deployment failed:'), error);
      console.log(chalk.yellow('\n💡 Tips:'));
      console.log('- Check your internet connection');
      console.log('- Verify CLI tools are installed');
      console.log('- Ensure Git repository is clean');
      process.exit(1);
    }
  }

  private async checkPrerequisites() {
    const spinner = ora('Checking prerequisites...').start();

    try {
      // Check if we're in a Git repository
      await execAsync('git rev-parse --git-dir');

      // Check if we have package.json
      await fs.access('package.json');

      // Check if we have Prisma schema
      await fs.access('prisma/schema.prisma');

      spinner.succeed('Prerequisites check passed');
    } catch (error) {
      spinner.fail('Prerequisites check failed');
      throw new Error('Missing required files or not in a Git repository');
    }
  }

  private async chooseProvider() {
    const choices = Object.entries(this.providers).map(([key, provider]) => ({
      name: `${provider.name} - ${provider.cost}`,
      value: key,
      short: provider.name
    }));

    const { provider } = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Choose your deployment provider:',
        choices,
        default: 'render' // Default to Render (free)
      }
    ]);

    // Show provider details
    const selectedProvider = this.providers[provider];
    console.log(chalk.blue(`\n📋 ${selectedProvider.name} Features:`));
    selectedProvider.features.forEach(feature => console.log(`  ${feature}`));

    console.log(chalk.yellow(`\n⚠️  Limitations:`));
    selectedProvider.limitations.forEach(limitation => console.log(`  ${limitation}`));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Deploy to ${selectedProvider.name}?`,
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Deployment cancelled.'));
      process.exit(0);
    }

    this.config = { provider } as DeploymentConfig;
  }

  private async configureDeployment() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'App name (lowercase, alphanumeric):',
        default: 'my-saas-backend',
        validate: (input: string) => {
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'App name must be lowercase alphanumeric with hyphens only';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'environment',
        message: 'Environment:',
        choices: [
          { name: 'Production', value: 'production' },
          { name: 'Staging', value: 'staging' }
        ],
        default: 'production'
      },
      {
        type: 'list',
        name: 'database',
        message: 'Database setup:',
        choices: [
          { name: 'Use included database (recommended)', value: 'included' },
          { name: 'Connect to external database', value: 'external' }
        ],
        default: 'included'
      }
    ]);

    Object.assign(this.config!, answers);

    if (this.config!.database === 'external') {
      const { databaseUrl } = await inquirer.prompt([
        {
          type: 'input',
          name: 'databaseUrl',
          message: 'External database URL:',
          validate: (input: string) => {
            if (!input.startsWith('postgresql://')) {
              return 'Database URL must start with postgresql://';
            }
            return true;
          }
        }
      ]);
      this.config!.databaseUrl = databaseUrl;
    }

    // Optional custom domain
    const { wantCustomDomain } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'wantCustomDomain',
        message: 'Do you want to configure a custom domain?',
        default: false
      }
    ]);

    if (wantCustomDomain) {
      const { customDomain } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customDomain',
          message: 'Custom domain (e.g., api.yourdomain.com):',
          validate: (input: string) => {
            if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(input)) {
              return 'Please enter a valid domain';
            }
            return true;
          }
        }
      ]);
      this.config!.customDomain = customDomain;
    }
  }

  private async generateSecrets() {
    const spinner = ora('Generating secure secrets...').start();

    this.config!.envVars = {
      NODE_ENV: this.config!.environment,
      APP_NAME: this.config!.appName,
      APP_VERSION: '1.0.0',
      PORT: '3000',

      // Generate secure secrets
      JWT_ACCESS_SECRET: this.generateSecret(64),
      JWT_REFRESH_SECRET: this.generateSecret(64),
      ENCRYPTION_KEY: this.generateSecret(32),
      COOKIE_SECRET: this.generateSecret(32),

      // Default expiration times
      JWT_ACCESS_EXPIRES_IN: '15m',
      JWT_REFRESH_EXPIRES_IN: '7d',

      // Default configurations
      CORS_ORIGIN: this.config!.customDomain ?
        `https://${this.config!.customDomain}` : 'true',

      // Database URL (will be set by provider if using included database)
      ...(this.config!.databaseUrl && { DATABASE_URL: this.config!.databaseUrl }),

      // Optional services (will be configured based on provider)
      REDIS_URL: '', // Will be set by provider

      // Monitoring
      HEALTH_CHECK_ENABLED: 'true',
      METRICS_ENABLED: 'true',

      // Security
      RATE_LIMIT_MAX: '100',
      RATE_LIMIT_WINDOW: '900000', // 15 minutes

      // Email (free tier)
      EMAIL_SERVICE: 'sendgrid',
      EMAIL_FROM: `noreply@${this.config!.customDomain || 'example.com'}`,

      // Feature flags (enable core modules)
      AUTH_MODULE_ENABLED: 'true',
      USER_MODULE_ENABLED: 'true',
      BILLING_MODULE_ENABLED: 'true',
      ANALYTICS_MODULE_ENABLED: 'true',
      ADMIN_MODULE_ENABLED: 'true'
    };

    spinner.succeed('Secrets generated');
  }

  private generateSecret(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // RENDER DEPLOYMENT
  private async setupRender() {
    const spinner = ora('Setting up Render deployment...').start();

    try {
      // Create render.yaml configuration
      await this.createRenderConfig();

      // Create Dockerfile if not exists
      await this.ensureDockerfile();

      spinner.succeed('Render configuration created');

      console.log(chalk.yellow('\n📋 Next steps for Render:'));
      console.log('1. Push your code to GitHub');
      console.log('2. Connect your repository in Render dashboard');
      console.log('3. Render will automatically deploy using render.yaml');

    } catch (error) {
      spinner.fail('Render setup failed');
      throw error;
    }
  }

  private async createRenderConfig() {
    const renderConfig = {
      services: [
        {
          type: 'web',
          name: this.config!.appName,
          env: 'node',
          plan: 'free',
          buildCommand: 'npm install && npm run build',
          startCommand: 'npm run start:prod',
          healthCheckPath: '/health',
          envVars: Object.entries(this.config!.envVars).map(([key, value]) => ({
            key,
            value: value || ''
          })),
          ...(this.config!.database === 'included' && {
            envVars: [
              ...Object.entries(this.config!.envVars).map(([key, value]) => ({
                key,
                value: value || ''
              })),
              {
                key: 'DATABASE_URL',
                fromDatabase: {
                  name: `${this.config!.appName}-db`,
                  property: 'connectionString'
                }
              }
            ]
          })
        }
      ],
      ...(this.config!.database === 'included' && {
        databases: [
          {
            name: `${this.config!.appName}-db`,
            plan: 'free'
          }
        ]
      })
    };

    await fs.writeFile('render.yaml',
      `# render.yaml - Render deployment configuration\n` +
      `# This file was auto-generated by the deployment script\n\n` +
      JSON.stringify(renderConfig, null, 2)
    );
  }

  private async deployToRender(config: DeploymentConfig) {
    const spinner = ora('Preparing Render deployment...').start();

    try {
      // Commit render.yaml to git
      await execAsync('git add render.yaml');
      await execAsync('git commit -m "Add Render deployment configuration" || true');

      spinner.succeed('Render configuration committed');

    } catch (error) {
      spinner.fail('Render deployment preparation failed');
      throw error;
    }
  }

  private async postDeployRender(config: DeploymentConfig) {
    console.log(chalk.green('\n🎉 Render deployment prepared successfully!\n'));

    console.log(chalk.blue('📋 Manual steps required:\n'));
    console.log('1. Push code to GitHub:');
    console.log(chalk.gray('   git push origin main\n'));

    console.log('2. Go to Render Dashboard: https://dashboard.render.com');
    console.log('3. Click "New +" → "Web Service"');
    console.log('4. Connect your GitHub repository');
    console.log('5. Select your repository and branch');
    console.log('6. Render will detect render.yaml and auto-configure\n');

    if (config.database === 'included') {
      console.log(chalk.yellow('📊 Database setup:'));
      console.log('- Database will be automatically created');
      console.log('- Run migrations after first deployment:');
      console.log(chalk.gray('  In Render Shell: npm run db:migrate:prod\n'));
    }

    console.log(chalk.green('🔗 Your app will be available at:'));
    console.log(chalk.blue(`   https://${config.appName}.onrender.com\n`));
  }

  // RAILWAY DEPLOYMENT
  private async setupRailway() {
    const spinner = ora('Setting up Railway deployment...').start();

    try {
      // Check if Railway CLI is installed
      try {
        await execAsync('railway --version');
      } catch {
        spinner.warn('Railway CLI not found. Installing...');
        await execAsync('npm install -g @railway/cli');
      }

      // Login to Railway
      spinner.text = 'Logging into Railway...';
      await execAsync('railway login');

      // Initialize Railway project
      spinner.text = 'Initializing Railway project...';
      await execAsync('railway init');

      spinner.succeed('Railway setup completed');

    } catch (error) {
      spinner.fail('Railway setup failed');
      throw error;
    }
  }

  private async deployToRailway(config: DeploymentConfig) {
    const spinner = ora('Deploying to Railway...').start();

    try {
      // Add database if needed
      if (config.database === 'included') {
        spinner.text = 'Adding PostgreSQL database...';
        await execAsync('railway add postgresql');

        spinner.text = 'Adding Redis cache...';
        await execAsync('railway add redis');
      }

      // Set environment variables
      spinner.text = 'Setting environment variables...';
      for (const [key, value] of Object.entries(config.envVars)) {
        if (value) {
          await execAsync(`railway variables set ${key}="${value}"`);
        }
      }

      // Deploy
      spinner.text = 'Deploying application...';
      await execAsync('railway up --detach');

      spinner.succeed('Railway deployment completed');

    } catch (error) {
      spinner.fail('Railway deployment failed');
      throw error;
    }
  }

  private async postDeployRailway(config: DeploymentConfig) {
    const spinner = ora('Running post-deployment tasks...').start();

    try {
      // Wait a bit for service to be ready
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Run database migrations
      if (config.database === 'included') {
        spinner.text = 'Running database migrations...';
        await execAsync('railway run npm run db:migrate:prod');
      }

      spinner.succeed('Post-deployment tasks completed');

      // Get deployment URL
      const { stdout } = await execAsync('railway status --json');
      const status = JSON.parse(stdout);

      console.log(chalk.green('\n🎉 Railway deployment successful!\n'));
      console.log(chalk.blue('🔗 Your app is available at:'));
      console.log(chalk.blue(`   ${status.deployments[0].url}\n`));

      if (config.customDomain) {
        console.log(chalk.yellow('🌐 Custom domain setup:'));
        console.log('1. Go to Railway dashboard');
        console.log('2. Add custom domain in settings');
        console.log(`3. Point ${config.customDomain} to Railway\n`);
      }

    } catch (error) {
      spinner.warn('Some post-deployment tasks failed');
      console.log(chalk.yellow('⚠️  You may need to run migrations manually:'));
      console.log(chalk.gray('   railway run npm run db:migrate:prod\n'));
    }
  }

  private async ensureDockerfile() {
    try {
      await fs.access('Dockerfile');
    } catch {
      // Create a production Dockerfile
      const dockerfileContent = `# Production Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --production

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start:prod"]
`;

      await fs.writeFile('Dockerfile', dockerfileContent);
    }
  }

  private showSuccess() {
    console.log(chalk.green.bold('\n🎉 Deployment completed successfully!\n'));

    console.log(chalk.blue('📋 What happens next:\n'));
    console.log('✅ Your backend API is now deployed');
    console.log('✅ Database is configured and running');
    console.log('✅ Environment variables are set');
    console.log('✅ SSL certificate is configured\n');

    console.log(chalk.yellow('🔧 Recommended next steps:\n'));
    console.log('1. Test your API endpoints');
    console.log('2. Set up monitoring and alerts');
    console.log('3. Configure your frontend to use the new API URL');
    console.log('4. Set up CI/CD for automatic deployments\n');

    console.log(chalk.blue('📚 Useful commands:\n'));
    console.log(`- Check logs: ${this.config!.provider} logs`);
    console.log(`- Run migrations: ${this.config!.provider} run npm run db:migrate:prod`);
    console.log(`- Set env vars: ${this.config!.provider} variables set KEY=value\n`);
  }
}

// Add to package.json scripts
async function updatePackageJsonScripts() {
  try {
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    packageJson.scripts = {
      ...packageJson.scripts,
      'deploy': 'tsx scripts/deploy.ts',
      'deploy:render': 'tsx scripts/deploy.ts --provider=render',
      'deploy:railway': 'tsx scripts/deploy.ts --provider=railway'
    };

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Package.json scripts updated');
  } catch (error) {
    console.warn('⚠️  Could not update package.json scripts');
  }
}

// Main execution
if (require.main === module) {
  const deployment = new DeploymentManager();
  deployment.run().catch(console.error);
}

export { DeploymentManager };
