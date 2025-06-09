import chalk from 'chalk';
import { table } from 'table';
import boxen from 'boxen';
import fs from 'fs/promises';
import path from 'path';

interface ModuleInfo {
  name: string;
  displayName: string;
  description: string;
  envKey: string;
  enabled: boolean;
  dependencies: string[];
  features: string[];
  status: 'active' | 'inactive' | 'error';
}

const moduleDefinitions: Omit<ModuleInfo, 'enabled' | 'status'>[] = [
  {
    name: 'auth',
    displayName: 'Authentication',
    description: 'JWT authentication, OAuth, 2FA',
    envKey: 'AUTH_MODULE_ENABLED',
    dependencies: [],
    features: ['JWT tokens', 'OAuth providers', '2FA support', 'Session management'],
  },
  {
    name: 'user',
    displayName: 'User Management',
    description: 'User profiles, preferences, activity tracking',
    envKey: 'USER_MODULE_ENABLED',
    dependencies: ['auth'],
    features: ['Profile management', 'Avatar upload', 'Activity tracking', 'Preferences'],
  },
  {
    name: 'billing',
    displayName: 'Billing & Subscriptions',
    description: 'Stripe integration for payments and subscriptions',
    envKey: 'BILLING_MODULE_ENABLED',
    dependencies: ['auth', 'user'],
    features: ['Stripe integration', 'Subscription management', 'Usage billing', 'Invoices'],
  },
  {
    name: 'tenant',
    displayName: 'Multi-tenancy',
    description: 'Organization and team management',
    envKey: 'TENANT_MODULE_ENABLED',
    dependencies: ['auth', 'user'],
    features: ['Organizations', 'Team members', 'Role management', 'Invitations'],
  },
  {
    name: 'notification',
    displayName: 'Notifications',
    description: 'In-app, email, push notifications',
    envKey: 'NOTIFICATION_MODULE_ENABLED',
    dependencies: ['user'],
    features: ['In-app notifications', 'Email alerts', 'Push notifications', 'Preferences'],
  },
  {
    name: 'support',
    displayName: 'Support Tickets',
    description: 'Customer support ticket system',
    envKey: 'SUPPORT_MODULE_ENABLED',
    dependencies: ['user', 'notification'],
    features: ['Ticket management', 'SLA tracking', 'Knowledge base', 'Auto-assignment'],
  },
  {
    name: 'analytics',
    displayName: 'Analytics',
    description: 'Event tracking and analytics',
    envKey: 'ANALYTICS_MODULE_ENABLED',
    dependencies: ['user'],
    features: ['Event tracking', 'User analytics', 'Custom reports', 'Export data'],
  },
  {
    name: 'webhooks',
    displayName: 'Webhooks',
    description: 'Webhook management and delivery',
    envKey: 'WEBHOOKS_MODULE_ENABLED',
    dependencies: ['user'],
    features: ['Webhook endpoints', 'Event subscriptions', 'Retry logic', 'Delivery tracking'],
  },
  {
    name: 'onboarding',
    displayName: 'User Onboarding',
    description: 'Guided onboarding flows',
    envKey: 'ONBOARDING_MODULE_ENABLED',
    dependencies: ['user', 'analytics'],
    features: ['Onboarding flows', 'Progress tracking', 'Interactive tours', 'Checklists'],
  },
  {
    name: 'admin',
    displayName: 'Admin Dashboard',
    description: 'Admin tools and system management',
    envKey: 'ADMIN_MODULE_ENABLED',
    dependencies: ['auth', 'user', 'billing', 'tenant'],
    features: ['User management', 'System metrics', 'Configuration', 'Audit logs'],
  },
  {
    name: 'api-usage',
    displayName: 'API Usage Tracking',
    description: 'Track and limit API usage',
    envKey: 'API_USAGE_MODULE_ENABLED',
    dependencies: ['user', 'billing'],
    features: ['Usage tracking', 'Rate limiting', 'Quota management', 'Analytics'],
  },
];

async function getModuleStatus(module: Omit<ModuleInfo, 'enabled' | 'status'>): Promise<ModuleInfo> {
  // Check if module is enabled
  const envValue = process.env[module.envKey];
  const enabled = envValue !== 'false' && (envValue === 'true' || ['auth', 'user'].includes(module.name));

  // Check if module files exist
  let status: 'active' | 'inactive' | 'error' = 'inactive';
  if (enabled) {
    try {
      const modulePath = path.join(process.cwd(), 'src', 'modules', module.name);
      await fs.access(modulePath);
      status = 'active';
    } catch {
      status = 'error';
    }
  }

  return {
    ...module,
    enabled,
    status,
  };
}

async function listModules() {
  console.clear();
  console.log(
    boxen(chalk.blue.bold('📦 Modern Backend Template - Modules'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
    })
  );

  // Get all module statuses
  const modules = await Promise.all(moduleDefinitions.map(getModuleStatus));

  // Summary
  const activeModules = modules.filter(m => m.status === 'active').length;
  const enabledModules = modules.filter(m => m.enabled).length;
  const totalModules = modules.length;

  console.log(chalk.blue('📊 Summary:'));
  console.log(`   Total Modules: ${totalModules}`);
  console.log(`   Enabled: ${chalk.green(enabledModules)}`);
  console.log(`   Active: ${chalk.green(activeModules)}`);
  console.log(`   Inactive: ${chalk.gray(totalModules - activeModules)}\n`);

  // Module table
  const tableData = [
    ['Module', 'Status', 'Description', 'Dependencies'],
    ...modules.map(m => [
      chalk.bold(m.displayName),
      m.status === 'active'
        ? chalk.green('✅ Active')
        : m.status === 'error'
        ? chalk.red('❌ Error')
        : chalk.gray('⭕ Inactive'),
      m.description,
      m.dependencies.length > 0 ? m.dependencies.join(', ') : chalk.gray('None'),
    ]),
  ];

  console.log(table(tableData));

  // Detailed view for each module
  console.log(chalk.blue.bold('\n📋 Module Details:\n'));

  for (const module of modules) {
    console.log(chalk.bold(`${module.displayName} (${module.name})`));
    console.log(`   Status: ${
      module.status === 'active'
        ? chalk.green('Active')
        : module.status === 'error'
        ? chalk.red('Error - Module files missing')
        : chalk.gray('Inactive')
    }`);
    console.log(`   Environment Variable: ${chalk.cyan(module.envKey)}`);
    console.log(`   Features:`);
    module.features.forEach(feature => {
      console.log(`     • ${feature}`);
    });
    if (module.dependencies.length > 0) {
      console.log(`   Dependencies: ${module.dependencies.join(', ')}`);
    }
    console.log('');
  }

  // Configuration tips
  console.log(
    boxen(
      chalk.yellow.bold('💡 Tips:\n') +
      '• Enable/disable modules by setting environment variables\n' +
      '• Use "pnpm modules:enable <module>" to enable a module\n' +
      '• Use "pnpm modules:disable <module>" to disable a module\n' +
      '• Some modules depend on others and will be auto-enabled',
      {
        padding: 1,
        borderColor: 'yellow',
      }
    )
  );
}

// Run
listModules().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});