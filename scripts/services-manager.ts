#!/usr/bin/env tsx

/**
 * Services Manager - Separate concern for Docker services management
 *
 * This module handles all Docker services operations separately from database bootstrap
 * Following SEPARATION OF CONCERNS principle
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';

const execAsync = promisify(exec);

export interface ServiceConfig {
  name: string;
  required: boolean;
  description: string;
  ports?: string[];
  healthCheck?: () => Promise<boolean>;
  webUI?: string;
}

export class ServicesManager {
  private services: ServiceConfig[] = [
    {
      name: 'postgres',
      required: true,
      description: 'PostgreSQL Database Server',
      ports: ['5555:5432'],
      webUI: undefined,
      healthCheck: async () => this.checkPostgresHealth()
    },
    {
      name: 'redis',
      required: true,
      description: 'Redis Cache Server',
      ports: ['6379:6379'],
      webUI: undefined,
      healthCheck: async () => this.checkRedisHealth()
    },
    {
      name: 'mailhog',
      required: false,
      description: 'Email Testing Server (MailHog)',
      ports: ['1025:1025', '8025:8025'],
      webUI: 'http://localhost:8025',
      healthCheck: async () => this.checkMailhogHealth()
    },
    {
      name: 'pgadmin',
      required: false,
      description: 'PostgreSQL Admin Interface',
      ports: ['5050:80'],
      webUI: 'http://localhost:5050',
      healthCheck: async () => this.checkPgAdminHealth()
    }
  ];

  /**
   * Get Docker container ID for a specific service
   */
  private async getContainerId(serviceName: string): Promise<string> {
    try {
      const composeFile = this.getComposeFile();
      const { stdout } = await execAsync(`docker-compose -f ${composeFile} ps -q ${serviceName}`);
      const containerId = stdout.trim();

      if (!containerId) {
        throw new Error(`${serviceName} container not found`);
      }

      return containerId;
    } catch (error) {
      throw new Error(`Failed to get ${serviceName} container ID: ${error}`);
    }
  }

  /**
   * Get appropriate docker-compose file
   */
  private getComposeFile(): string {
    return existsSync('docker-compose.dev.yml') ? 'docker-compose.dev.yml' : 'docker-compose.yml';
  }

  /**
   * Health check methods for each service
   */
  private async checkPostgresHealth(): Promise<boolean> {
    try {
      const containerId = await this.getContainerId('postgres');
      await execAsync(`docker exec ${containerId} pg_isready -U postgres`);
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedisHealth(): Promise<boolean> {
    try {
      const containerId = await this.getContainerId('redis');
      const { stdout } = await execAsync(`docker exec ${containerId} redis-cli ping`);
      return stdout.trim() === 'PONG';
    } catch {
      return false;
    }
  }

  private async checkMailhogHealth(): Promise<boolean> {
    try {
      const containerId = await this.getContainerId('mailhog');
      const { stdout } = await execAsync(`docker inspect ${containerId} --format='{{.State.Status}}'`);
      return stdout.trim() === 'running';
    } catch {
      return false;
    }
  }

  private async checkPgAdminHealth(): Promise<boolean> {
    try {
      const containerId = await this.getContainerId('pgadmin');
      const { stdout } = await execAsync(`docker inspect ${containerId} --format='{{.State.Status}}'`);
      return stdout.trim() === 'running';
    } catch {
      return false;
    }
  }

  /**
   * Start specific services
   */
  async startServices(serviceNames: string[] = []): Promise<void> {
    console.log('🐳 Starting Docker services...');

    try {
      // Check if Docker is running
      await execAsync('docker --version');

      const servicesToStart = serviceNames.length > 0 ? serviceNames : this.getDefaultServices();
      const composeFile = this.getComposeFile();

      console.log(`📋 Starting services: ${servicesToStart.join(', ')}`);
      await execAsync(`docker-compose -f ${composeFile} up -d ${servicesToStart.join(' ')}`);

      console.log('✅ Docker services started successfully');

      // Wait for services to be ready
      await this.waitForServices(servicesToStart);
    } catch (error) {
      console.error('❌ Failed to start Docker services:', error);
      throw error;
    }
  }

  /**
   * Stop specific services
   */
  async stopServices(serviceNames: string[] = []): Promise<void> {
    console.log('🛑 Stopping Docker services...');

    try {
      const servicesToStop = serviceNames.length > 0 ? serviceNames : this.getAllServiceNames();
      const composeFile = this.getComposeFile();

      console.log(`📋 Stopping services: ${servicesToStop.join(', ')}`);
      await execAsync(`docker-compose -f ${composeFile} stop ${servicesToStop.join(' ')}`);

      console.log('✅ Docker services stopped successfully');
    } catch (error) {
      console.error('❌ Failed to stop Docker services:', error);
      throw error;
    }
  }

  /**
   * Restart specific services
   */
  async restartServices(serviceNames: string[] = []): Promise<void> {
    console.log('🔄 Restarting Docker services...');

    try {
      const servicesToRestart = serviceNames.length > 0 ? serviceNames : this.getAllServiceNames();
      const composeFile = this.getComposeFile();

      console.log(`📋 Restarting services: ${servicesToRestart.join(', ')}`);
      await execAsync(`docker-compose -f ${composeFile} restart ${servicesToRestart.join(' ')}`);

      console.log('✅ Docker services restarted successfully');

      // Wait for services to be ready
      await this.waitForServices(servicesToRestart);
    } catch (error) {
      console.error('❌ Failed to restart Docker services:', error);
      throw error;
    }
  }

  /**
   * Get default services to start (required + available optional)
   */
  private getDefaultServices(): string[] {
    const requiredServices = this.services
      .filter(service => service.required)
      .map(service => service.name);

    const optionalServices = this.services
      .filter(service => !service.required)
      .map(service => service.name);

    // Check which optional services are available in the compose file
    const composeFile = this.getComposeFile();
    const availableOptionalServices = optionalServices.filter(service => {
      try {
        const composeContent = readFileSync(composeFile, 'utf-8');
        return composeContent.includes(`${service}:`);
      } catch {
        return false;
      }
    });

    return [...requiredServices, ...availableOptionalServices];
  }

  /**
   * Get all service names
   */
  private getAllServiceNames(): string[] {
    return this.services.map(service => service.name);
  }

  /**
   * Wait for services to be ready
   */
  private async waitForServices(serviceNames: string[], maxRetries: number = 30): Promise<void> {
    console.log('⏳ Waiting for services to be ready...');

    for (const serviceName of serviceNames) {
      const service = this.services.find(s => s.name === serviceName);
      if (!service || !service.healthCheck) {
        console.log(`ℹ️  Skipping health check for ${serviceName} (no health check available)`);
        continue;
      }

      console.log(`⏳ Checking ${service.description}...`);

      for (let i = 0; i < maxRetries; i++) {
        try {
          const isHealthy = await service.healthCheck();
          if (isHealthy) {
            console.log(`✅ ${service.description} is ready`);
            break;
          }
        } catch (error) {
          // Continue retrying
        }

        if (i === maxRetries - 1) {
          if (service.required) {
            throw new Error(`${service.description} failed to start within timeout period`);
          } else {
            console.log(`⚠️  ${service.description} is not ready but continuing (optional service)`);
          }
        }

        console.log(`⏳ Waiting for ${service.description}... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Display status of all services
   */
  async displayStatus(): Promise<void> {
    console.log('📊 Services Status Report\n');

    for (const service of this.services) {
      try {
        const isHealthy = service.healthCheck ? await service.healthCheck() : false;
        const status = isHealthy ? '✅ Running' : '❌ Not Running';
        const required = service.required ? '(Required)' : '(Optional)';

        console.log(`${status} ${service.description} ${required}`);

        // Show additional info for running services
        if (isHealthy) {
          if (service.ports) {
            console.log(`   📍 Ports: ${service.ports.join(', ')}`);
          }
          if (service.webUI) {
            console.log(`   🌐 Web UI: ${service.webUI}`);
          }
        }
      } catch (error) {
        console.log(`❌ ${service.description} (Error checking status)`);
      }
    }
    console.log('');
  }

  /**
   * Comprehensive health check
   */
  async healthCheck(): Promise<boolean> {
    console.log('🏥 Running services health check...\n');

    let allHealthy = true;

    for (const service of this.services) {
      try {
        const isHealthy = service.healthCheck ? await service.healthCheck() : false;
        const status = isHealthy ? '✅' : '❌';
        const required = service.required ? '(Required)' : '(Optional)';

        console.log(`${status} ${service.description} ${required}`);

        if (service.required && !isHealthy) {
          allHealthy = false;
        }
      } catch (error) {
        console.log(`❌ ${service.description} (Error: ${error})`);
        if (service.required) {
          allHealthy = false;
        }
      }
    }

    console.log(`\n🏥 Overall services health: ${allHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    return allHealthy;
  }

  /**
   * Get service configuration
   */
  getServiceConfig(serviceName: string): ServiceConfig | undefined {
    return this.services.find(service => service.name === serviceName);
  }

  /**
   * Get all services configuration
   */
  getAllServices(): ServiceConfig[] {
    return this.services;
  }

  /**
   * Get required services
   */
  getRequiredServices(): ServiceConfig[] {
    return this.services.filter(service => service.required);
  }

  /**
   * Get optional services
   */
  getOptionalServices(): ServiceConfig[] {
    return this.services.filter(service => !service.required);
  }
}

// CLI interface for services manager
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  const serviceNames = args.slice(1);

  const manager = new ServicesManager();

  switch (command) {
    case 'start':
      await manager.startServices(serviceNames);
      break;

    case 'stop':
      await manager.stopServices(serviceNames);
      break;

    case 'restart':
      await manager.restartServices(serviceNames);
      break;

    case 'status':
      await manager.displayStatus();
      break;

    case 'health':
      const isHealthy = await manager.healthCheck();
      process.exit(isHealthy ? 0 : 1);
      break;

    case 'start-required':
      const requiredServices = manager.getRequiredServices().map(s => s.name);
      await manager.startServices(requiredServices);
      break;

    case 'start-optional':
      const optionalServices = manager.getOptionalServices().map(s => s.name);
      await manager.startServices(optionalServices);
      break;

    default:
      console.log(`
🐳 Services Manager CLI

Usage: tsx scripts/services-manager.ts <command> [service-names...]

Commands:
  start [services...]    - Start specified services (or all if none specified)
  stop [services...]     - Stop specified services (or all if none specified)
  restart [services...]  - Restart specified services (or all if none specified)
  status                 - Show status of all services
  health                 - Run health check on all services
  start-required         - Start only required services
  start-optional         - Start only optional services

Available Services:
  postgres    - PostgreSQL Database Server (Required)
  redis       - Redis Cache Server (Required)
  mailhog     - Email Testing Server (Optional)
  pgadmin     - PostgreSQL Admin Interface (Optional)

Examples:
  tsx scripts/services-manager.ts start postgres redis
  tsx scripts/services-manager.ts stop mailhog
  tsx scripts/services-manager.ts restart
  tsx scripts/services-manager.ts status
      `);
  }
}

// Export for use in other modules
export default ServicesManager;

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
