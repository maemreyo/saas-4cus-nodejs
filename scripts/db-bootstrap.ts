#!/usr/bin/env tsx

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import ServicesManager from './services-manager.js';

const execAsync = promisify(exec);

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  schema?: string;
}

interface DockerServiceConfig {
  name: string;
  required: boolean;
  healthCheck?: () => Promise<boolean>;
  description: string;
}

interface BootstrapOptions {
  skipDocker?: boolean;
  skipMigrations?: boolean;
  skipSeeding?: boolean;
  reset?: boolean;
  cleanReset?: boolean;
  forcePermissions?: boolean;
  services?: string[];
}

class DatabaseBootstrap {
  private config: DatabaseConfig;
  private prisma: PrismaClient | null = null;
  private dockerServices: DockerServiceConfig[] = [
    {
      name: 'postgres',
      required: true,
      description: 'PostgreSQL Database Server',
      healthCheck: async () => this.checkPostgresHealth()
    },
    {
      name: 'redis',
      required: true,
      description: 'Redis Cache Server',
      healthCheck: async () => this.checkRedisHealth()
    },
    {
      name: 'mailhog',
      required: false,
      description: 'Email Testing Server (MailHog)',
      healthCheck: async () => this.checkMailhogHealth()
    },
    {
      name: 'pgadmin',
      required: false,
      description: 'PostgreSQL Admin Interface',
      healthCheck: async () => this.checkPgAdminHealth()
    }
  ];

  constructor(config?: Partial<DatabaseConfig>) {
    // Load từ environment variables hoặc sử dụng default values
    this.config = {
      host: config?.host || process.env.DB_HOST || 'localhost',
      port: config?.port || parseInt(process.env.DB_PORT || '5555'),
      database: config?.database || process.env.DB_NAME || 'myapp_dev',
      username: config?.username || process.env.DB_USER || 'postgres',
      password: config?.password || process.env.DB_PASS || 'postgres',
      schema: config?.schema || process.env.DB_SCHEMA || 'public',
    };
  }

  /**
   * Get Docker container ID for a specific service
   */
  private async getContainerId(serviceName: string): Promise<string> {
    try {
      const composeFile = existsSync('docker-compose.dev.yml') ? 'docker-compose.dev.yml' : 'docker-compose.yml';
      const { stdout } = await execAsync(`docker-compose -f ${composeFile} ps -q ${serviceName}`);
      const containerId = stdout.trim();

      if (!containerId) {
        throw new Error(`${serviceName} container not found`);
      }

      return containerId;
    } catch (error) {
      console.error(`Failed to get ${serviceName} container ID:`, error);
      throw error;
    }
  }

  /**
   * Get Docker container ID for postgres service (backward compatibility)
   */
  private async getPostgresContainerId(): Promise<string> {
    return this.getContainerId('postgres');
  }

  /**
   * Health check methods for each service
   */
  private async checkPostgresHealth(): Promise<boolean> {
    try {
      const containerId = await this.getContainerId('postgres');
      await execAsync(`docker exec ${containerId} pg_isready -U ${this.config.username}`);
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedisHealth(): Promise<boolean> {
    try {
      const containerId = await this.getContainerId('redis');
      await execAsync(`docker exec ${containerId} redis-cli ping`);
      return true;
    } catch {
      return false;
    }
  }

  private async checkMailhogHealth(): Promise<boolean> {
    try {
      const containerId = await this.getContainerId('mailhog');
      // Check if container is running
      const { stdout } = await execAsync(`docker inspect ${containerId} --format='{{.State.Status}}'`);
      return stdout.trim() === 'running';
    } catch {
      return false;
    }
  }

  private async checkPgAdminHealth(): Promise<boolean> {
    try {
      const containerId = await this.getContainerId('pgadmin');
      // Check if container is running
      const { stdout } = await execAsync(`docker inspect ${containerId} --format='{{.State.Status}}'`);
      return stdout.trim() === 'running';
    } catch {
      return false;
    }
  }

  /**
   * Execute SQL command in PostgreSQL container - FIXED
   */
  private async executeSql(database: string, sql: string): Promise<void> {
    const containerId = await this.getPostgresContainerId();
    const { username, password } = this.config;

    // FIX: Khi thực thi từ bên trong container, sử dụng localhost:5432 thay vì localhost:5555
    // Vì bên trong container PostgreSQL chạy trên port 5432
    const env = `PGPASSWORD=${password}`;
    const command = `${env} psql -h localhost -p 5432 -U ${username} -d ${database} -c "${sql}"`;

    await execAsync(`docker exec ${containerId} sh -c '${command}'`);
  }

  /**
   * FIX: Alternative method - execute SQL directly without network connection
   */
  private async executeSqlDirect(database: string, sql: string): Promise<void> {
    const containerId = await this.getPostgresContainerId();
    const { username } = this.config;

    // Method 1: Try direct psql execution (no network, using Unix socket)
    try {
      const command = `su - postgres -c "psql -d ${database} -c \\"${sql}\\""`;
      await execAsync(`docker exec ${containerId} sh -c '${command}'`);
      return;
    } catch (error) {
      console.log('Direct method failed, trying with user specification...');
    }

    // Method 2: Use specified user with Unix socket
    try {
      const command = `su - postgres -c "psql -U ${username} -d ${database} -c \\"${sql}\\""`;
      await execAsync(`docker exec ${containerId} sh -c '${command}'`);
      return;
    } catch (error) {
      console.log('User-specified method failed, trying postgres user...');
    }

    // Method 3: Fallback to postgres superuser
    const command = `su - postgres -c "psql -c \\"${sql}\\""`;
    await execAsync(`docker exec ${containerId} sh -c '${command}'`);
  }

  /**
   * FIX: Configure PostgreSQL authentication to use 'trust' method
   */
  private async configurePostgresAuth(): Promise<void> {
    console.log('🔧 Configuring PostgreSQL authentication...');

    const containerId = await this.getPostgresContainerId();

    try {
      // Backup original pg_hba.conf
      await execAsync(`docker exec ${containerId} cp /var/lib/postgresql/data/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf.backup`);

      // Create new pg_hba.conf with trust authentication
      const pgHbaConfig = `
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     trust
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
host    all             all             0.0.0.0/0               trust
# IPv6 local connections:
host    all             all             ::1/128                 trust
host    all             all             ::/0                    trust
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust
`;

      // Write new pg_hba.conf
      await execAsync(`docker exec ${containerId} sh -c 'echo "${pgHbaConfig}" > /var/lib/postgresql/data/pg_hba.conf'`);

      // Reload PostgreSQL configuration
      await execAsync(`docker exec ${containerId} su - postgres -c "psql -c 'SELECT pg_reload_conf();'"`);

      console.log('✅ PostgreSQL authentication configured to use trust method');

      // Wait for configuration to take effect
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error('❌ Failed to configure PostgreSQL authentication:', error);
      throw error;
    }
  }

  /**
   * Start Docker containers for all services
   */
  async startDockerServices(options: BootstrapOptions = {}): Promise<void> {
    console.log('🐳 Starting Docker services...');

    try {
      // Check if Docker is running
      await execAsync('docker --version');

      // Determine which services to start
      const servicesToStart = this.getServicesToStart(options);

      // Start docker-compose services
      const composeFile = existsSync('docker-compose.dev.yml') ? 'docker-compose.dev.yml' : 'docker-compose.yml';

      console.log(`📋 Starting services: ${servicesToStart.join(', ')}`);
      await execAsync(`docker-compose -f ${composeFile} up -d ${servicesToStart.join(' ')}`);

      console.log('✅ Docker services started successfully');

      // Wait for services to be ready
      await this.waitForServices(servicesToStart);

      // Configure PostgreSQL authentication if postgres is started
      if (servicesToStart.includes('postgres')) {
        await this.configurePostgresAuth();
      }
    } catch (error) {
      console.error('❌ Failed to start Docker services:', error);
      throw error;
    }
  }

  /**
   * Determine which services to start based on options
   */
  private getServicesToStart(options: BootstrapOptions): string[] {
    if (options.services && options.services.length > 0) {
      return options.services;
    }

    // Default: start all required services + optional ones available in compose file
    const requiredServices = this.dockerServices
      .filter(service => service.required)
      .map(service => service.name);

    const optionalServices = this.dockerServices
      .filter(service => !service.required)
      .map(service => service.name);

    // Check which optional services are available in the compose file
    const composeFile = existsSync('docker-compose.dev.yml') ? 'docker-compose.dev.yml' : 'docker-compose.yml';
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
   * Wait for multiple services to be ready
   */
  private async waitForServices(services: string[], maxRetries: number = 30): Promise<void> {
    console.log('⏳ Waiting for services to be ready...');

    for (const serviceName of services) {
      const service = this.dockerServices.find(s => s.name === serviceName);
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
   * Chờ database sẵn sàng (backward compatibility)
   */
  private async waitForDatabase(maxRetries: number = 30): Promise<void> {
    await this.waitForServices(['postgres'], maxRetries);
  }

  private generateDatabaseUrl(): string {
    const { host, port, database, username, password, schema } = this.config;

    let url = `postgresql://${username}:${password}@${host}:${port}/${database}`;

    if (schema && schema !== 'public') {
      url += `?schema=${schema}`;
    }

    return url;
  }

  /**
   * Update .env file với DATABASE_URL
   */
  async updateEnvFile(): Promise<void> {
    console.log('📝 Updating .env file...');

    const envPath = '.env';
    const databaseUrl = this.generateDatabaseUrl();

    try {
      let envContent = '';

      if (existsSync(envPath)) {
        envContent = readFileSync(envPath, 'utf-8');

        // Update existing DATABASE_URL hoặc thêm mới
        if (envContent.includes('DATABASE_URL=')) {
          envContent = envContent.replace(/DATABASE_URL=.*/, `DATABASE_URL="${databaseUrl}"`);
        } else {
          envContent += `\nDATABASE_URL="${databaseUrl}"\n`;
        }
      } else {
        // Tạo .env file mới từ template
        const envExamplePath = '.env.example';
        if (existsSync(envExamplePath)) {
          envContent = readFileSync(envExamplePath, 'utf-8');
          envContent = envContent.replace(/DATABASE_URL=.*/, `DATABASE_URL="${databaseUrl}"`);
        } else {
          envContent = `DATABASE_URL="${databaseUrl}"\n`;
        }
      }

      writeFileSync(envPath, envContent);
      console.log('✅ .env file updated successfully');
      console.log(`   DATABASE_URL="${databaseUrl}"`);
    } catch (error) {
      console.error('❌ Failed to update .env file:', error);
      throw error;
    }
  }

  /**
   * Chạy Prisma migrations
   */
  async runMigrations(): Promise<void> {
    console.log('🔄 Running Prisma migrations...');

    try {
      // Generate Prisma client
      await execAsync('npx prisma generate');
      console.log('✅ Prisma client generated');

      const env = {
        ...process.env,
        DATABASE_URL: this.generateDatabaseUrl()
      };

      // Run migrations with explicit DATABASE_URL
      await execAsync('npx prisma migrate dev --name init', { env });
      console.log('✅ Migrations completed successfully');
    } catch (error) {
      console.error('❌ Failed to run migrations:', error);

      console.log('🔄 Trying alternative migration approach...');
      try {
        await execAsync('npx prisma db push');
        console.log('✅ Database schema pushed successfully');
      } catch (pushError) {
        console.error('❌ Alternative migration also failed:', pushError);
        throw error;
      }
    }
  }

  /**
   * Seed database với data mẫu
   */
  async seedDatabase(): Promise<void> {
    console.log('🌱 Seeding database...');

    try {
      const seedPath = 'src/infrastructure/database/seed.ts';
      if (existsSync(seedPath)) {
        // Set environment variables needed for seeding
        const env = {
          ...process.env,
          DATABASE_URL: this.generateDatabaseUrl(),
          // Add minimal required config to avoid validation errors
          SECURITY_ENCRYPTION_KEY: process.env.SECURITY_ENCRYPTION_KEY || 'temp-key-for-seeding-only-change-in-production',
          EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || 'localhost',
          EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT || '587',
          EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || 'temp@example.com',
          EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS || 'temp-password',
          NODE_ENV: 'development'
        };

        await execAsync('pnpm run db:seed', { env });
        console.log('✅ Database seeded successfully');
      } else {
        console.log('ℹ️  No seed file found, skipping seeding');
      }
    } catch (error) {
      console.error('❌ Failed to seed database:', error);

      // In development, seeding failure shouldn't stop the entire bootstrap
      if (process.env.NODE_ENV !== 'production') {
        console.log('⚠️  Continuing bootstrap despite seeding failure (development mode)');
        return;
      }

      // In production, we might want to throw the error
      throw error;
    }
  }

  /**
   * Display status of all services
   */
  async displayServicesStatus(): Promise<void> {
    console.log('📊 Checking services status...\n');

    for (const service of this.dockerServices) {
      try {
        const isHealthy = service.healthCheck ? await service.healthCheck() : false;
        const status = isHealthy ? '✅ Running' : '❌ Not Running';
        const required = service.required ? '(Required)' : '(Optional)';

        console.log(`${status} ${service.description} ${required}`);

        // Show additional info for some services
        if (isHealthy) {
          switch (service.name) {
            case 'postgres':
              console.log(`   📍 Database: ${this.config.database} on ${this.config.host}:${this.config.port}`);
              break;
            case 'mailhog':
              console.log(`   📍 Web UI: http://localhost:8025`);
              break;
            case 'pgadmin':
              console.log(`   📍 Web UI: http://localhost:5050`);
              break;
          }
        }
      } catch (error) {
        console.log(`❌ ${service.description} (Error checking status)`);
      }
    }
    console.log('');
  }

  /**
   * Test db connection
   */
  async testConnection(): Promise<void> {
    console.log('🔍 Testing database connection...');

    try {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: this.generateDatabaseUrl()
          }
        }
      });

      await this.prisma.$connect();

      // Test query
      await this.prisma.$queryRaw`SELECT 1 as test`;

      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    } finally {
      if (this.prisma) {
        await this.prisma.$disconnect();
      }
    }
  }

  /**
   * Reset database (DROP và recreate) - Enhanced version
   */
  async resetDatabase(): Promise<void> {
    console.log('🗑️  Resetting database...');

    try {
      // Method 1: Try Prisma reset first
      try {
        const env = {
          ...process.env,
          DATABASE_URL: this.generateDatabaseUrl()
        };
        await execAsync('npx prisma migrate reset --force', { env });
        console.log('✅ Database reset via Prisma successfully');
        return;
      } catch (prismaError) {
        console.log('⚠️  Prisma reset failed, trying manual database reset...');
      }

      // Method 2: Manual reset via SQL commands
      await this.manualDatabaseReset();
      console.log('✅ Database reset manually successfully');
    } catch (error) {
      console.error('❌ Failed to reset database:', error);
      throw error;
    }
  }

  /**
   * Manual database reset khi Prisma reset fail - FIXED
   */
  private async manualDatabaseReset(): Promise<void> {
    const { database, username } = this.config;

    console.log('🔧 Performing manual database reset...');

    try {
      // 1. Terminate all connections to target database
      const terminateConnections = `
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = '${database}' AND pid <> pg_backend_pid();
      `;

      await this.executeSqlDirect('postgres', terminateConnections);

      // 2. Drop database if exists
      await this.executeSqlDirect('postgres', `DROP DATABASE IF EXISTS "${database}";`);

      // 3. Create fresh database
      await this.executeSqlDirect('postgres', `CREATE DATABASE "${database}" OWNER "${username}";`);

      console.log('✅ Manual database reset completed');
    } catch (error) {
      console.error('❌ Manual database reset failed:', error);
      throw error;
    }
  }

  /**
   * Clean reset - Xóa hoàn toàn containers và volumes
   */
  async cleanReset(): Promise<void> {
    console.log('🧹 Performing clean reset (removing all Docker data)...');

    try {
      const composeFile = existsSync('docker-compose.dev.yml') ? 'docker-compose.dev.yml' : 'docker-compose.yml';

      // 1. Stop all services with timeout
      console.log('🛑 Stopping Docker services...');
      await execAsync(`docker-compose -f ${composeFile} stop --timeout 10`);

      // 2. Remove containers and volumes completely
      console.log('🗑️  Removing containers and volumes...');
      await execAsync(`docker-compose -f ${composeFile} down -v --remove-orphans`);

      // 3. Force remove containers if they still exist
      try {
        const { stdout: containerIds } = await execAsync(`docker-compose -f ${composeFile} ps -q`);
        if (containerIds.trim()) {
          await execAsync(`docker rm -f ${containerIds.trim().split('\n').join(' ')}`);
        }
      } catch (error) {
        // Containers might not exist, that's OK
      }

      // 4. Remove specific volumes that might persist
      const volumeCommands = [
        'docker volume ls -q --filter "name=postgres" | xargs -r docker volume rm',
        'docker volume ls -q --filter "name=myapp" | xargs -r docker volume rm',
        'docker volume prune -f',
      ];

      for (const cmd of volumeCommands) {
        try {
          await execAsync(cmd);
        } catch (error) {
          console.log(`⚠️  Volume cleanup command might have failed: ${cmd}`);
        }
      }

      // 5. Clean up any orphaned networks
      try {
        await execAsync('docker network prune -f');
      } catch (error) {
        // Network cleanup might fail, that's OK
      }

      console.log('✅ Clean reset completed');

      // 6. Wait a moment for cleanup to complete
      console.log('⏳ Waiting for cleanup to complete...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 7. Start fresh
      await this.startDockerServices();
    } catch (error) {
      console.error('❌ Clean reset failed:', error);
      throw error;
    }
  }

  /**
   * FIX: Setup database permissions - COMPLETELY REWRITTEN with better error handling
   */
  async setupDatabasePermissions(): Promise<void> {
    console.log('🔐 Setting up database permissions...');

    try {
      const { database, username } = this.config;

      // 1. Create database if not exists and set owner
      try {
        await this.executeSqlDirect('postgres', `CREATE DATABASE "${database}" OWNER "${username}";`);
        console.log('✅ Database created with proper owner');
      } catch (error) {
        // Database might already exist
        console.log('ℹ️  Database already exists, updating owner...');

        // Make sure the database owner is correct
        await this.executeSqlDirect('postgres', `ALTER DATABASE "${database}" OWNER TO "${username}";`);
      }

      // 2. Grant all privileges on database
      await this.executeSqlDirect('postgres', `GRANT ALL PRIVILEGES ON DATABASE "${database}" TO "${username}";`);

      // 3. Connect to the target database and setup schema permissions
      const schemaCommands = [
        // Ensure public schema exists
        'CREATE SCHEMA IF NOT EXISTS public;',

        // Set schema owner
        `ALTER SCHEMA public OWNER TO "${username}";`,

        // Grant all privileges on schema
        `GRANT ALL ON SCHEMA public TO "${username}";`,
        `GRANT CREATE ON SCHEMA public TO "${username}";`,

        // Grant privileges on all existing tables/sequences/functions
        `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${username}";`,
        `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "${username}";`,
        `GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO "${username}";`,

        // Set default privileges for future objects
        `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${username}";`,
        `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "${username}";`,
        `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "${username}";`,

        // Additional grants for public schema (required by some applications)
        'GRANT ALL ON SCHEMA public TO public;',
        'GRANT CREATE ON SCHEMA public TO public;'
      ];

      for (const cmd of schemaCommands) {
        try {
          await this.executeSqlDirect(database, cmd);
        } catch (error) {
          console.log(`⚠️  Schema command might have failed: ${cmd}`);
          console.log(`   Error: ${error}`);
        }
      }

      // 4. Set user privileges (execute on postgres database)
      const userCommands = [
        `ALTER USER "${username}" CREATEDB;`,
        `ALTER USER "${username}" CREATEROLE;`
      ];

      for (const cmd of userCommands) {
        try {
          await this.executeSqlDirect('postgres', cmd);
        } catch (error) {
          console.log(`⚠️  User command might have failed: ${cmd}`);
        }
      }

      console.log('✅ Database permissions setup completed');
    } catch (error) {
      console.error('❌ Failed to setup database permissions:', error);
      throw error;
    }
  }

  /**
   * FIX: Ensure database and schema exist before migrations - ENHANCED
   */
  async ensureDatabaseAndSchema(): Promise<void> {
    console.log('🔍 Ensuring database and schema exist...');

    try {
      const { database, username } = this.config;

      // 1. Create database if not exists
      try {
        await this.executeSqlDirect('postgres', `CREATE DATABASE "${database}" OWNER "${username}";`);
        console.log('✅ Database created');
      } catch (error) {
        console.log('ℹ️  Database already exists');
      }

      // 2. Ensure public schema exists and has correct permissions
      const schemaSetupCommands = [
        'CREATE SCHEMA IF NOT EXISTS public;',
        `ALTER SCHEMA public OWNER TO "${username}";`,
        `GRANT ALL ON SCHEMA public TO "${username}";`,
        'GRANT ALL ON SCHEMA public TO public;',
        `GRANT CREATE ON SCHEMA public TO "${username}";`,
        `GRANT USAGE ON SCHEMA public TO "${username}";`
      ];

      for (const cmd of schemaSetupCommands) {
        try {
          await this.executeSqlDirect(database, cmd);
        } catch (error) {
          console.log(`⚠️  Schema setup command might have failed: ${cmd}`);
        }
      }

      console.log('✅ Database and schema setup completed');
    } catch (error) {
      console.error('❌ Failed to ensure database and schema:', error);
      throw error;
    }
  }

  async bootstrap(options: BootstrapOptions = {}): Promise<void> {
    const { skipDocker, skipMigrations, skipSeeding, reset, cleanReset, forcePermissions } = options;

    try {
      console.log('🚀 Starting database bootstrap...\n');

      // 1. Clean reset if requested (this includes stopping and removing Docker containers)
      if (cleanReset) {
        await this.cleanReset();
      } else if (!skipDocker) {
        await this.startDockerServices(options);
      }

      // 2. Update .env file
      await this.updateEnvFile();

      // 3. Reset database if requested (only if not doing clean reset)
      if (reset && !cleanReset) {
        await this.resetDatabase();
      }

      // 4. CRITICAL: Ensure database and schema exist before any other operations
      await this.ensureDatabaseAndSchema();

      // 5. Setup database permissions (always run this for fresh/clean setups)
      if (cleanReset || forcePermissions || reset) {
        await this.setupDatabasePermissions();
      }

      // 6. Run migrations
      if (!skipMigrations) {
        await this.runMigrations();
      }

      // 7. Seed database
      if (!skipSeeding) {
        await this.seedDatabase();
      }

      // 8. Test connection
      await this.testConnection();

      // 9. Display services status
      await this.displayServicesStatus();

      console.log('\n🎉 Database bootstrap completed successfully!');
      console.log('📊 You can now access:');
      console.log(`   - Database: postgresql://localhost:${this.config.port}/${this.config.database}`);
      console.log('   - PgAdmin: http://localhost:5050 (admin@admin.com / admin)');
      console.log('   - MailHog: http://localhost:8025');
      console.log('   - Prisma Studio: pnpm run db:studio');
    } catch (error) {
      console.error('\n💥 Bootstrap failed:', error);
      process.exit(1);
    }
  }

  /**
   * Comprehensive health check for all services
   */
  async healthCheck(): Promise<boolean> {
    console.log('🏥 Running comprehensive health check...\n');

    let allHealthy = true;

    // Check each service
    for (const service of this.dockerServices) {
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

    // Test database connection specifically
    console.log('\n🔍 Testing database connection...');
    try {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: this.generateDatabaseUrl()
          }
        }
      });
      await this.prisma.$connect();
      await this.prisma.$queryRaw`SELECT 1`;
      await this.prisma.$disconnect();
      console.log('✅ Database connection successful');
    } catch (error) {
      console.log('❌ Database connection failed');
      allHealthy = false;
    }

    console.log(`\n🏥 Overall health: ${allHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    return allHealthy;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'bootstrap';

  const bootstrap = new DatabaseBootstrap();

  switch (command) {
    case 'bootstrap':
    case 'init':
      await bootstrap.bootstrap();
      break;

    case 'start':
      await bootstrap.startDockerServices();
      break;

    case 'reset':
      await bootstrap.bootstrap({ reset: true });
      break;

    case 'clean-reset':
    case 'nuclear':
      await bootstrap.cleanReset();
      break;

    case 'fix-permissions':
      await bootstrap.setupDatabasePermissions();
      break;

    case 'fresh':
      // Complete fresh start with permissions
      await bootstrap.bootstrap({
        cleanReset: true,
        forcePermissions: true,
      });
      break;

    case 'test':
      const isHealthy = await bootstrap.healthCheck();
      console.log(isHealthy ? '✅ Database is healthy' : '❌ Database is unhealthy');
      process.exit(isHealthy ? 0 : 1);
      break;

    case 'migrate':
      await bootstrap.runMigrations();
      break;

    case 'seed':
      await bootstrap.seedDatabase();
      break;

    case 'status':
      await bootstrap.displayServicesStatus();
      break;

    case 'start-postgres':
      await bootstrap.startDockerServices({ services: ['postgres'] });
      break;

    case 'start-redis':
      await bootstrap.startDockerServices({ services: ['redis'] });
      break;

    case 'start-mailhog':
      await bootstrap.startDockerServices({ services: ['mailhog'] });
      break;

    case 'start-pgadmin':
      await bootstrap.startDockerServices({ services: ['pgadmin'] });
      break;

    case 'start-required':
      await bootstrap.startDockerServices({ services: ['postgres', 'redis'] });
      break;

    case 'start-optional':
      await bootstrap.startDockerServices({ services: ['mailhog', 'pgadmin'] });
      break;

    default:
      console.log(`
🔧 Database Bootstrap CLI - Enhanced Version

Usage: tsx scripts/db-bootstrap.ts <command>

📋 Main Commands:
  bootstrap, init     - Full database setup (default)
  start              - Start all Docker services
  reset              - Reset database (keep Docker volumes)
  clean-reset, nuclear- Complete clean reset (remove Docker volumes)
  fresh              - Nuclear reset + fix permissions
  test               - Comprehensive health check for all services
  status             - Show status of all services

🐳 Docker Service Commands:
  start-required     - Start only required services (postgres, redis)
  start-optional     - Start only optional services (mailhog, pgadmin)
  start-postgres     - Start PostgreSQL only
  start-redis        - Start Redis only
  start-mailhog      - Start MailHog only
  start-pgadmin      - Start PgAdmin only

🔧 Database Commands:
  migrate            - Run migrations only
  seed               - Seed database only
  fix-permissions    - Fix database user permissions

🚨 Troubleshooting Commands:
  fresh              - When you have permission issues
  clean-reset        - When Docker containers are corrupted
  fix-permissions    - When you get "user denied access" errors
  status             - Check what services are running
  test               - Full health check

📊 Service Information:
  - PostgreSQL: Database server (Required)
  - Redis: Cache server (Required)
  - MailHog: Email testing server (Optional) - http://localhost:8025
  - PgAdmin: Database admin interface (Optional) - http://localhost:5050

Options:
  --skip-docker      Skip Docker services
  --skip-migrations  Skip running migrations
  --skip-seeding     Skip database seeding
      `);
  }
}

// Export class for programmatic use
export default DatabaseBootstrap;

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
