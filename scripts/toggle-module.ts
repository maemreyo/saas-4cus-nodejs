import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { config as dotenv } from 'dotenv';

dotenv();

interface ModuleConfig {
  name: string;
  displayName: string;
  envKey: string;
  dependencies: string[];
  dependents: string[];
  configKeys?: string[];
}

const modules: ModuleConfig[] = [
  {
    name: 'auth',
    displayName: 'Authentication',
    envKey: 'AUTH_MODULE_ENABLED',
    dependencies: [],
    dependents: ['user', 'billing', 'tenant', 'admin'],
  },
  {
    name: 'user',
    displayName: 'User Management',
    envKey: 'USER_MODULE_ENABLED',
    dependencies: ['auth'],
    dependents: ['notification', 'billing', 'tenant', 'admin'],
  },
  {
    name: 'billing',
    displayName: 'Billing & Subscriptions',
    envKey: 'BILLING_MODULE_ENABLED',
    dependencies: ['auth', 'user'],
    dependents: ['api-usage', 'admin'],
    configKeys: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  },
  {
    name: 'tenant',
    displayName: 'Multi-tenancy',
    envKey: 'TENANT_MODULE_ENABLED',
    dependencies: ['auth', 'user'],
    dependents: ['admin'],
    configKeys: ['TENANT_SUBDOMAIN_ENABLED'],
  },
  {
    name: 'notification',
    displayName: 'Notifications',
    envKey: 'NOTIFICATION_MODULE_ENABLED',
    dependencies: ['user'],
    dependents: ['support'],
  },
  {
    name: 'support',
    displayName: 'Support Tickets',
    envKey: 'SUPPORT_MODULE_ENABLED',
    dependencies: ['user', 'notification'],
    dependents: [],
    configKeys: ['SUPPORT_EMAIL', 'ELASTICSEARCH_URL'],
  },
  {
    name: 'analytics',
    displayName: 'Analytics',
    envKey: 'ANALYTICS_MODULE_ENABLED',
    dependencies: ['user'],
    dependents: ['onboarding'],
  },
  {
    name: 'webhooks',
    displayName: 'Webhooks',
    envKey: 'WEBHOOKS_MODULE_ENABLED',
    dependencies: ['user'],
    dependents: [],
  },
  {
    name: 'onboarding',
    displayName: 'User Onboarding',
    envKey: 'ONBOARDING_MODULE_ENABLED',
    dependencies: ['user', 'analytics'],
    dependents: [],
  },
  {
    name: 'admin',
    displayName: 'Admin Dashboard',
    envKey: 'ADMIN_MODULE_ENABLED',
    dependencies: ['auth', 'user', 'billing', 'tenant'],
    dependents: [],
    configKeys: ['ADMIN_IP_WHITELIST'],
  },
  {
    name: 'api-usage',
    displayName: 'API Usage Tracking',
    envKey: 'API_USAGE_MODULE_ENABLED',
    dependencies: ['user', 'billing'],
    dependents: [],
  },
];

async function loadEnvFile(): Promise<Record<string, string>> {
  const envPath = path.join(process.cwd(), '.env');
  try {
    const content = await fs.readFile(envPath, 'utf-8');
    const env: Record<string, string> = {};

    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return env;
  } catch {
    throw new Error('.env file not found. Run "pnpm generate:env" first.');
  }
}

async function saveEnvFile(env: Record<string, string>): Promise<void> {
  const envPath = path.join(process.cwd(), '.env');
  const lines: string[] = [];

  // Read existing file to preserve comments and order
  try {
    const content = await fs.readFile(envPath, 'utf-8');
    const existingLines = content.split('\n');

    for (const line of existingLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        lines.push(line);
      } else {
        const [key] = trimmed.split('=');
        if (key && env[key.trim()] !== undefined) {
          lines.push(`${key.trim()}=${env[key.trim()]}`);
        } else {
          lines.push(line);
        }
      }
    }
  } catch {
    // If file doesn't exist, create new one
    Object.entries(env).forEach(([key, value]) => {
      lines.push(`${key}=${value}`);
    });
  }

  await fs.writeFile(envPath, lines.join('\n'));
}

function getModulesToEnable(moduleName: string): string[] {
  const module = modules.find(m => m.name === moduleName);
  if (!module) return [];

  const toEnable = new Set<string>([moduleName]);

  // Recursively add dependencies
  function addDependencies(modName: string) {
    const mod = modules.find(m => m.name === modName);
    if (mod) {
      mod.dependencies.forEach(dep => {
        toEnable.add(dep);
        addDependencies(dep);
      });
    }
  }

  addDependencies(moduleName);
  return Array.from(toEnable);
}

function getModulesToDisable(moduleName: string): string[] {
  const module = modules.find(m => m.name === moduleName);
  if (!module) return [];

  const toDisable = new Set<string>([moduleName]);

  // Recursively add dependents
  function addDependents(modName: string) {
    const mod = modules.find(m => m.name === modName);
    if (mod) {
      mod.dependents.forEach(dep => {
        toDisable.add(dep);
        addDependents(dep);
      });
    }
  }

  addDependents(moduleName);
  return Array.from(toDisable);
}

async function enableModule(moduleName: string, interactive: boolean = true) {
  const env = await loadEnvFile();
  const module = modules.find(m => m.name === moduleName);

  if (!module) {
    console.error(chalk.red(`Module "${moduleName}" not found.`));
    process.exit(1);
  }

  console.log(chalk.blue(`\n🔧 Enabling ${module.displayName} module...\n`));

  // Check dependencies
  const toEnable = getModulesToEnable(moduleName);
  if (toEnable.length > 1) {
    console.log(chalk.yellow('The following modules will be enabled:'));
    toEnable.forEach(mod => {
      const m = modules.find(m => m.name === mod);
      console.log(`  • ${m?.displayName || mod}`);
    });

    if (interactive) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Continue?',
        default: true,
      }]);

      if (!confirm) {
        console.log(chalk.yellow('Operation cancelled.'));
        return;
      }
    }
  }

  // Enable modules
  toEnable.forEach(mod => {
    const m = modules.find(m => m.name === mod);
    if (m) {
      env[m.envKey] = 'true';
      console.log(chalk.green(`✅ Enabled ${m.displayName}`));
    }
  });

  // Check for required config keys
  if (module.configKeys && interactive) {
    console.log(chalk.yellow('\nThis module requires additional configuration:'));
    for (const key of module.configKeys) {
      if (!env[key] || env[key] === '') {
        const { value } = await inquirer.prompt([{
          type: 'input',
          name: 'value',
          message: `${key}:`,
          default: key.includes('SECRET') ? 'your-secret-here' : '',
        }]);
        env[key] = value;
      }
    }
  }

  await saveEnvFile(env);
  console.log(chalk.green('\n✅ Module enabled successfully!'));
  console.log(chalk.yellow('Restart your application for changes to take effect.'));
}

async function disableModule(moduleName: string, interactive: boolean = true) {
  const env = await loadEnvFile();
  const module = modules.find(m => m.name === moduleName);

  if (!module) {
    console.error(chalk.red(`Module "${moduleName}" not found.`));
    process.exit(1);
  }

  // Don't allow disabling core modules
  if (['auth', 'user'].includes(moduleName)) {
    console.error(chalk.red(`Cannot disable core module "${module.displayName}".`));
    process.exit(1);
  }

  console.log(chalk.blue(`\n🔧 Disabling ${module.displayName} module...\n`));

  // Check dependents
  const toDisable = getModulesToDisable(moduleName);
  if (toDisable.length > 1) {
    console.log(chalk.yellow('The following modules will be disabled:'));
    toDisable.forEach(mod => {
      const m = modules.find(m => m.name === mod);
      console.log(`  • ${m?.displayName || mod}`);
    });

    if (interactive) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Continue?',
        default: true,
      }]);

      if (!confirm) {
        console.log(chalk.yellow('Operation cancelled.'));
        return;
      }
    }
  }

  // Disable modules
  toDisable.forEach(mod => {
    const m = modules.find(m => m.name === mod);
    if (m) {
      env[m.envKey] = 'false';
      console.log(chalk.green(`✅ Disabled ${m.displayName}`));
    }
  });

  await saveEnvFile(env);
  console.log(chalk.green('\n✅ Module disabled successfully!'));
  console.log(chalk.yellow('Restart your application for changes to take effect.'));
}

async function interactiveToggle() {
  const env = await loadEnvFile();

  const choices = modules.map(m => ({
    name: `${m.displayName} (${env[m.envKey] === 'true' ? chalk.green('enabled') : chalk.gray('disabled')})`,
    value: m.name,
    disabled: ['auth', 'user'].includes(m.name) ? 'Core module' : false,
  }));

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['Enable a module', 'Disable a module', 'Exit'],
  }]);

  if (action === 'Exit') {
    return;
  }

  const { module } = await inquirer.prompt([{
    type: 'list',
    name: 'module',
    message: `Select a module to ${action.toLowerCase()}:`,
    choices,
  }]);

  if (action === 'Enable a module') {
    await enableModule(module);
  } else {
    await disableModule(module);
  }
}

// CLI
if (require.main === module) {
  const [action, moduleName] = process.argv.slice(2);

  if (action === 'enable' && moduleName) {
    enableModule(moduleName, true).catch(error => {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    });
  } else if (action === 'disable' && moduleName) {
    disableModule(moduleName, true).catch(error => {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    });
  } else {
    interactiveToggle().catch(error => {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    });
  }
}