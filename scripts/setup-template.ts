import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';

interface SetupOptions {
  projectName: string;
  modules: {
    auth: boolean;
    user: boolean;
    tenant: boolean;
    billing: boolean;
    features: boolean;
    notification: boolean;
    analytics: boolean;
    webhooks: boolean;
    onboarding: boolean;
    support: boolean;
    apiUsage: boolean;
    admin: boolean;
  };
  database: 'postgresql' | 'mysql' | 'sqlite';
  cache: 'redis' | 'memory';
  search: 'elasticsearch' | 'none';
  storage: 'local' | 's3' | 'gcs';
  email: 'smtp' | 'sendgrid' | 'ses';
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const confirm = async (query: string): Promise<boolean> => {
  const answer = await question(`${query} (y/n): `);
  return answer.toLowerCase() === 'y';
};

async function main() {
  console.log(chalk.blue.bold('\n🚀 Modern Backend Template Setup\n'));

  // Get project name
  const projectName = await question('Project name: ');

  // Select modules
  console.log(chalk.yellow('\n📦 Select modules to include:\n'));

  const modules = {
    auth: await confirm('Include Auth module? (JWT, OAuth, 2FA)'),
    user: await confirm('Include User module? (Profiles, Sessions)'),
    tenant: await confirm('Include Tenant module? (Multi-tenancy)'),
    billing: await confirm('Include Billing module? (Stripe integration)'),
    features: await confirm('Include Features module? (Feature flags)'),
    notification: await confirm('Include Notification module?'),
    analytics: await confirm('Include Analytics module?'),
    webhooks: await confirm('Include Webhooks module?'),
    onboarding: await confirm('Include Onboarding module?'),
    support: await confirm('Include Support module? (Tickets)'),
    apiUsage: await confirm('Include API Usage module? (Rate limiting)'),
    admin: await confirm('Include Admin module? (Dashboard)'),
  };

  // Database selection
  console.log(chalk.yellow('\n🗄️  Database configuration:\n'));
  const dbChoice = await question('Database (1: PostgreSQL, 2: MySQL, 3: SQLite): ');
  const database = ['postgresql', 'mysql', 'sqlite'][parseInt(dbChoice) - 1] as any;

  // Cache selection
  const cacheChoice = await question('Cache (1: Redis, 2: In-memory): ');
  const cache = ['redis', 'memory'][parseInt(cacheChoice) - 1] as any;

  // Optional services
  console.log(chalk.yellow('\n⚙️  Optional services:\n'));
  const useElasticsearch = await confirm('Use Elasticsearch for search?');
  const search = useElasticsearch ? 'elasticsearch' : 'none';

  const storageChoice = await question('File storage (1: Local, 2: AWS S3, 3: Google Cloud): ');
  const storage = ['local', 's3', 'gcs'][parseInt(storageChoice) - 1] as any;

  const emailChoice = await question('Email service (1: SMTP, 2: SendGrid, 3: AWS SES): ');
  const email = ['smtp', 'sendgrid', 'ses'][parseInt(emailChoice) - 1] as any;

  const options: SetupOptions = {
    projectName,
    modules,
    database,
    cache,
    search,
    storage,
    email,
  };

  console.log(chalk.green('\n✅ Configuration summary:\n'));
  console.log(options);

  const proceed = await confirm('\nProceed with setup?');
  if (!proceed) {
    console.log(chalk.red('Setup cancelled'));
    process.exit(0);
  }

  await setupProject(options);

  rl.close();
}

async function setupProject(options: SetupOptions) {
  console.log(chalk.blue('\n🔧 Setting up project...\n'));

  try {
    // 1. Update package.json
    await updatePackageJson(options);

    // 2. Generate .env file
    await generateEnvFile(options);

    // 3. Update Prisma schema if needed
    await updatePrismaSchema(options);

    // 4. Remove unused modules
    await removeUnusedModules(options);

    // 5. Update app.ts
    await updateAppFile(options);

    // 6. Install dependencies
    console.log(chalk.blue('📦 Installing dependencies...\n'));
    execSync('pnpm install', { stdio: 'inherit' });

    // 7. Generate Prisma client
    if (options.database !== 'sqlite') {
      console.log(chalk.blue('🗄️  Generating Prisma client...\n'));
      execSync('pnpm db:generate', { stdio: 'inherit' });
    }

    console.log(chalk.green.bold('\n✨ Setup complete!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log('1. Update .env with your configuration');
    console.log('2. Start development services: pnpm services:start');
    console.log('3. Run database migrations: pnpm db:migrate');
    console.log('4. Start development server: pnpm dev');
    console.log(chalk.blue('\nHappy coding! 🚀\n'));

  } catch (error) {
    console.error(chalk.red('Setup failed:'), error);
    process.exit(1);
  }
}

async function updatePackageJson(options: SetupOptions) {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'));

  packageJson.name = options.projectName.toLowerCase().replace(/\s+/g, '-');
  packageJson.description = `${options.projectName} - Built with Modern Backend Template`;

  // Remove unused dependencies
  const dependencies = { ...packageJson.dependencies };
  const devDependencies = { ...packageJson.devDependencies };

  if (!options.modules.billing) {
    delete dependencies['stripe'];
  }

  if (options.search !== 'elasticsearch') {
    delete dependencies['@elastic/elasticsearch'];
  }

  if (options.storage === 's3') {
    dependencies['@aws-sdk/client-s3'] = '^3.0.0';
  }

  if (options.email === 'sendgrid') {
    dependencies['@sendgrid/mail'] = '^8.0.0';
  }

  packageJson.dependencies = dependencies;
  packageJson.devDependencies = devDependencies;

  await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
}

async function generateEnvFile(options: SetupOptions) {
  let envContent = `# ${options.projectName} Configuration
# Generated by Modern Backend Template

# Application
NODE_ENV=development
APP_NAME="${options.projectName}"
APP_VERSION=1.0.0
PORT=3000
HOST=0.0.0.0

# Security
JWT_ACCESS_SECRET=change-this-to-a-secure-secret-key
JWT_REFRESH_SECRET=change-this-to-another-secure-secret-key
ENCRYPTION_KEY=change-this-to-32-character-key
COOKIE_SECRET=change-this-cookie-secret

# Database
`;

  if (options.database === 'postgresql') {
    envContent += `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/${options.projectName.toLowerCase()}_dev?schema=public"\n`;
  } else if (options.database === 'mysql') {
    envContent += `DATABASE_URL="mysql://root:password@localhost:3306/${options.projectName.toLowerCase()}_dev"\n`;
  } else {
    envContent += `DATABASE_URL="file:./dev.db"\n`;
  }

  if (options.cache === 'redis') {
    envContent += `
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
`;
  }

  // Add module-specific configs
  if (options.modules.billing) {
    envContent += `
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
`;
  }

  if (options.modules.auth) {
    envContent += `
# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
`;
  }

  // Email config
  if (options.email === 'smtp') {
    envContent += `
# Email (SMTP)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="${options.projectName} <noreply@example.com>"
`;
  } else if (options.email === 'sendgrid') {
    envContent += `
# Email (SendGrid)
SENDGRID_API_KEY=SG...
EMAIL_FROM="${options.projectName} <noreply@example.com>"
`;
  }

  if (options.search === 'elasticsearch') {
    envContent += `
# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200
`;
  }

  if (options.storage === 's3') {
    envContent += `
# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET=
`;
  }

  // Write .env file
  await fs.writeFile('.env', envContent);

  // Copy to .env.example
  await fs.copyFile('.env', '.env.example');
}

async function updatePrismaSchema(options: SetupOptions) {
  if (options.database === 'mysql' || options.database === 'sqlite') {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    let schema = await fs.readFile(schemaPath, 'utf-8');

    if (options.database === 'mysql') {
      schema = schema.replace('provider = "postgresql"', 'provider = "mysql"');
    } else {
      schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
    }

    await fs.writeFile(schemaPath, schema);
  }
}

async function removeUnusedModules(options: SetupOptions) {
  const modulesDir = path.join(process.cwd(), 'src', 'modules');
  const allModules = Object.keys(options.modules);

  for (const module of allModules) {
    if (!options.modules[module as keyof typeof options.modules]) {
      const modulePath = path.join(modulesDir, module.replace(/([A-Z])/g, '-$1').toLowerCase());
      try {
        await fs.rm(modulePath, { recursive: true, force: true });
        console.log(chalk.yellow(`Removed ${module} module`));
      } catch (error) {
        // Module might not exist or already removed
      }
    }
  }
}

async function updateAppFile(options: SetupOptions) {
  const appPath = path.join(process.cwd(), 'src', 'app.ts');
  let appContent = await fs.readFile(appPath, 'utf-8');

  // Comment out imports for disabled modules
  const moduleImports = {
    auth: "import { initializeAuthModule, shutdownAuthModule } from './modules/auth';",
    billing: "import { initializeBillingModule, shutdownBillingModule } from './modules/billing';",
    support: "import { initializeSupportModule, shutdownSupportModule } from './modules/support';",
    // ... etc
  };

  for (const [module, importStatement] of Object.entries(moduleImports)) {
    if (!options.modules[module as keyof typeof options.modules]) {
      appContent = appContent.replace(importStatement, `// ${importStatement}`);
    }
  }

  // Update MODULE_INIT_ORDER
  const enabledModules = Object.entries(options.modules)
    .filter(([_, enabled]) => enabled)
    .map(([module]) => module);

  // This is simplified - in reality, you'd want to maintain proper order
  await fs.writeFile(appPath, appContent);
}

// Run the setup
main().catch(console.error);
