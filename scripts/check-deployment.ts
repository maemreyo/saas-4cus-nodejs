import fetch from 'node-fetch';
import chalk from 'chalk';
import ora from 'ora';

interface HealthCheck {
  endpoint: string;
  expected: number;
  timeout: number;
}

async function checkDeployment(baseUrl: string) {
  console.log(chalk.blue(`🔍 Checking deployment at: ${baseUrl}\n`));

  const checks: HealthCheck[] = [
    { endpoint: '/health', expected: 200, timeout: 10000 },
    { endpoint: '/health/ready', expected: 200, timeout: 10000 },
    { endpoint: '/health/live', expected: 200, timeout: 10000 },
    { endpoint: '/api/auth/health', expected: 200, timeout: 10000 }
  ];

  for (const check of checks) {
    const spinner = ora(`Checking ${check.endpoint}...`).start();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), check.timeout);

      const response = await fetch(`${baseUrl}${check.endpoint}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === check.expected) {
        spinner.succeed(`${check.endpoint} - OK (${response.status})`);
      } else {
        spinner.fail(`${check.endpoint} - Failed (${response.status})`);
        const text = await response.text();
        console.log(chalk.red(`Response: ${text}`));
      }
    } catch (error) {
      spinner.fail(`${check.endpoint} - Error`);
      console.log(chalk.red(`Error: ${error.message}`));
    }
  }

  console.log(chalk.green('\n✅ Deployment check completed'));
}

// CLI usage
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: tsx scripts/check-deployment.ts <url>');
    process.exit(1);
  }

  checkDeployment(url).catch(console.error);
}

export { checkDeployment };
