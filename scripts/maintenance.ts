import { redis } from '../src/infrastructure/cache/redis.service';
import chalk from 'chalk';
import inquirer from 'inquirer';
import boxen from 'boxen';

interface MaintenanceInfo {
  enabled: boolean;
  message: string;
  startedAt?: string;
  estimatedEnd?: string;
  allowedIPs?: string[];
}

async function enableMaintenance() {
  console.log(chalk.blue.bold('\n🔧 Enable Maintenance Mode\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: 'Maintenance message:',
      default: 'We are currently performing scheduled maintenance. Please check back later.',
    },
    {
      type: 'input',
      name: 'duration',
      message: 'Estimated duration (in minutes):',
      default: '30',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num > 0 ? true : 'Please enter a valid number';
      },
    },
    {
      type: 'input',
      name: 'allowedIPs',
      message: 'Allowed IP addresses (comma-separated, optional):',
      default: '',
    },
  ]);

  const duration = parseInt(answers.duration);
  const estimatedEnd = new Date();
  estimatedEnd.setMinutes(estimatedEnd.getMinutes() + duration);

  const maintenanceInfo: MaintenanceInfo = {
    enabled: true,
    message: answers.message,
    startedAt: new Date().toISOString(),
    estimatedEnd: estimatedEnd.toISOString(),
    allowedIPs: answers.allowedIPs ? answers.allowedIPs.split(',').map(ip => ip.trim()) : [],
  };

  try {
    // Connect to Redis
    await redis.connect();

    // Set maintenance mode
    await redis.set('maintenance:mode', maintenanceInfo, { ttl: duration * 60 });

    console.log(
      boxen(
        chalk.green.bold('✅ Maintenance mode enabled!\n\n') +
        `Message: ${maintenanceInfo.message}\n` +
        `Started: ${new Date(maintenanceInfo.startedAt).toLocaleString()}\n` +
        `Estimated End: ${estimatedEnd.toLocaleString()}\n` +
        (maintenanceInfo.allowedIPs.length > 0
          ? `Allowed IPs: ${maintenanceInfo.allowedIPs.join(', ')}`
          : 'No IP whitelist'),
        {
          padding: 1,
          borderColor: 'green',
        }
      )
    );

    // Disconnect
    await redis.disconnect();
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    console.log(chalk.yellow('\nMake sure Redis is running and accessible.'));
    process.exit(1);
  }
}

async function disableMaintenance() {
  console.log(chalk.blue.bold('\n🔧 Disable Maintenance Mode\n'));

  try {
    // Connect to Redis
    await redis.connect();

    // Get current maintenance info
    const info = await redis.get<MaintenanceInfo>('maintenance:mode');

    if (!info || !info.enabled) {
      console.log(chalk.yellow('Maintenance mode is not currently enabled.'));
      await redis.disconnect();
      return;
    }

    // Confirm
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to disable maintenance mode?',
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Operation cancelled.'));
      await redis.disconnect();
      return;
    }

    // Disable maintenance mode
    await redis.delete('maintenance:mode');

    const duration = info.startedAt
      ? Math.round((Date.now() - new Date(info.startedAt).getTime()) / 1000 / 60)
      : 0;

    console.log(
      boxen(
        chalk.green.bold('✅ Maintenance mode disabled!\n\n') +
        `Duration: ${duration} minutes\n` +
        'Your application is now accessible to all users.',
        {
          padding: 1,
          borderColor: 'green',
        }
      )
    );

    // Disconnect
    await redis.disconnect();
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    console.log(chalk.yellow('\nMake sure Redis is running and accessible.'));
    process.exit(1);
  }
}

async function checkStatus() {
  try {
    // Connect to Redis
    await redis.connect();

    // Get current maintenance info
    const info = await redis.get<MaintenanceInfo>('maintenance:mode');

    if (!info || !info.enabled) {
      console.log(
        boxen(
          chalk.green.bold('✅ Application is online\n\n') +
          'Maintenance mode is not enabled.',
          {
            padding: 1,
            borderColor: 'green',
          }
        )
      );
    } else {
      const startedAt = new Date(info.startedAt!);
      const estimatedEnd = new Date(info.estimatedEnd!);
      const now = new Date();
      const elapsed = Math.round((now.getTime() - startedAt.getTime()) / 1000 / 60);
      const remaining = Math.max(0, Math.round((estimatedEnd.getTime() - now.getTime()) / 1000 / 60));

      console.log(
        boxen(
          chalk.yellow.bold('⚠️  Application is in maintenance mode\n\n') +
          `Message: ${info.message}\n` +
          `Started: ${startedAt.toLocaleString()} (${elapsed} minutes ago)\n` +
          `Estimated End: ${estimatedEnd.toLocaleString()} (${remaining} minutes remaining)\n` +
          (info.allowedIPs && info.allowedIPs.length > 0
            ? `Allowed IPs: ${info.allowedIPs.join(', ')}`
            : 'No IP whitelist'),
          {
            padding: 1,
            borderColor: 'yellow',
          }
        )
      );
    }

    // Disconnect
    await redis.disconnect();
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    console.log(chalk.yellow('\nMake sure Redis is running and accessible.'));
    process.exit(1);
  }
}

async function updateMessage() {
  try {
    // Connect to Redis
    await redis.connect();

    // Get current maintenance info
    const info = await redis.get<MaintenanceInfo>('maintenance:mode');

    if (!info || !info.enabled) {
      console.log(chalk.yellow('Maintenance mode is not currently enabled.'));
      await redis.disconnect();
      return;
    }

    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: 'New maintenance message:',
        default: info.message,
      },
    ]);

    info.message = message;

    // Calculate remaining TTL
    const estimatedEnd = new Date(info.estimatedEnd!);
    const remaining = Math.max(60, Math.round((estimatedEnd.getTime() - Date.now()) / 1000));

    // Update
    await redis.set('maintenance:mode', info, { ttl: remaining });

    console.log(chalk.green('\n✅ Maintenance message updated successfully!'));

    // Disconnect
    await redis.disconnect();
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

// CLI
async function main() {
  const action = process.argv[2];

  switch (action) {
    case 'enable':
    case 'on':
      await enableMaintenance();
      break;

    case 'disable':
    case 'off':
      await disableMaintenance();
      break;

    case 'status':
      await checkStatus();
      break;

    case 'update':
      await updateMessage();
      break;

    default:
      // Interactive mode
      const { choice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'What would you like to do?',
          choices: [
            { name: 'Enable maintenance mode', value: 'enable' },
            { name: 'Disable maintenance mode', value: 'disable' },
            { name: 'Check status', value: 'status' },
            { name: 'Update message', value: 'update' },
            { name: 'Exit', value: 'exit' },
          ],
        },
      ]);

      switch (choice) {
        case 'enable':
          await enableMaintenance();
          break;
        case 'disable':
          await disableMaintenance();
          break;
        case 'status':
          await checkStatus();
          break;
        case 'update':
          await updateMessage();
          break;
      }
  }
}

// Run
main().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});