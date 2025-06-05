#!/usr/bin/env tsx

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const execAsync = promisify(exec);

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  schema?: string;
}

class DatabaseBootstrap {
  private config: DatabaseConfig;
  private prisma: PrismaClient | null = null;

  constructor(config?: Partial<DatabaseConfig>) {
    // Load từ environment variables hoặc sử dụng default values
    this.config = {
      host: config?.host || process.env.DB_HOST || 'localhost',
      port: config?.port || parseInt(process.env.DB_PORT || '5432'),
      database: config?.database || process.env.DB_NAME || 'myapp_dev',
      username: config?.username || process.env.DB_USER || 'postgres',
      password: config?.password || process.env.DB_PASS || 'postgres',
      schema: config?.schema || process.env.DB_SCHEMA || 'public',
    };
  }

  /**
   * Start Docker containers for database
   */
  async startDockerServices(): Promise<void> {
    console.log('🐳 Starting Docker services...');

    try {
      // Check if Docker is running
      await execAsync('docker --version');

      // Start docker-compose services
      const composeFile = existsSync('docker-compose.dev.yml') ? 'docker-compose.dev.yml' : 'docker-compose.yml';

      await execAsync(`docker-compose -f ${composeFile} up -d postgres redis`);

      console.log('✅ Docker services started successfully');

      // Wait for PostgreSQL to be ready
      await this.waitForDatabase();
    } catch (error) {
      console.error('❌ Failed to start Docker services:', error);
      throw error;
    }
  }

  /**
   * Chờ database sẵn sàng
   */
  private async waitForDatabase(maxRetries: number = 30): Promise<void> {
    console.log('⏳ Waiting for database to be ready...');

    for (let i = 0; i < maxRetries; i++) {
      try {
        await execAsync(
          `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) pg_isready -U ${this.config.username}`,
        );
        console.log('✅ Database is ready');
        return;
      } catch (error) {
        if (i === maxRetries - 1) {
          throw new Error('Database failed to start within timeout period');
        }
        console.log(`⏳ Waiting for database... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Tạo DATABASE_URL từ config
   */
  private generateDatabaseUrl(): string {
    const { host, port, database, username, password, schema } = this.config;
    const schemaParam = schema && schema !== 'public' ? `?schema=${schema}` : '';
    return `postgresql://${username}:${password}@${host}:${port}/${database}${schemaParam}`;
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

      // Run migrations
      await execAsync('npx prisma migrate dev --name init');
      console.log('✅ Migrations completed successfully');
    } catch (error) {
      console.error('❌ Failed to run migrations:', error);
      throw error;
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
        await execAsync('npm run db:seed');
        console.log('✅ Database seeded successfully');
      } else {
        console.log('ℹ️  No seed file found, skipping seeding');
      }
    } catch (error) {
      console.error('❌ Failed to seed database:', error);
    }
  }

  /**
   * Test db connection
   */
  async testConnection(): Promise<void> {
    console.log('🔍 Testing database connection...');

    try {
      this.prisma = new PrismaClient();
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
        await execAsync('npx prisma migrate reset --force');
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
   * Manual database reset khi Prisma reset fail
   */
  private async manualDatabaseReset(): Promise<void> {
    const { database, username, password } = this.config;

    console.log('🔧 Performing manual database reset...');

    try {
      // 1. Connect to postgres database để drop/create main database
      const postgresUrl = `postgresql://${username}:${password}@${this.config.host}:${this.config.port}/postgres`;

      // 2. Terminate all connections to target database
      const terminateConnections = `
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = '${database}' AND pid <> pg_backend_pid()
      `;

      await execAsync(
        `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) psql "${postgresUrl}" -c "${terminateConnections}"`,
      );

      // 3. Drop database if exists
      await execAsync(
        `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) psql "${postgresUrl}" -c "DROP DATABASE IF EXISTS ${database}"`,
      );

      // 4. Create fresh database
      await execAsync(
        `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) psql "${postgresUrl}" -c "CREATE DATABASE ${database}"`,
      );

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
      // 1. Stop all services
      await execAsync('docker-compose -f docker-compose.dev.yml down');

      // 2. Remove volumes
      await execAsync('docker-compose -f docker-compose.dev.yml down -v');

      // 3. Remove containers completely
      await execAsync('docker-compose -f docker-compose.dev.yml rm -f');

      // 4. Prune volumes
      await execAsync('docker volume prune -f');

      console.log('✅ Clean reset completed');

      // 5. Start fresh
      await this.startDockerServices();
    } catch (error) {
      console.error('❌ Clean reset failed:', error);
      throw error;
    }
  }

  /**
   * Setup database với proper permissions - FIXED VERSION
   */
  async setupDatabasePermissions(): Promise<void> {
    console.log('🔐 Setting up database permissions...');

    try {
      const { database, username, password, host, port } = this.config;
      const postgresUrl = `postgresql://${username}:${password}@${host}:${port}/postgres`;
      const dbUrl = `postgresql://${username}:${password}@${host}:${port}/${database}`;

      // 1. First, ensure the database exists
      try {
        await execAsync(
          `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) psql "${postgresUrl}" -c "CREATE DATABASE ${database}"`,
        );
      } catch (error) {
        // Database might already exist, that's OK
      }

      // 2. Connect to the specific database and setup schema permissions
      const setupCommands = [
        // Grant all privileges on database
        `GRANT ALL PRIVILEGES ON DATABASE ${database} TO ${username};`,

        // Connect to the database and set up schema permissions
        `\\c ${database}`,

        // Grant schema permissions
        `GRANT ALL ON SCHEMA public TO ${username};`,
        `GRANT CREATE ON SCHEMA public TO ${username};`,
        `ALTER SCHEMA public OWNER TO ${username};`,

        // Grant all privileges on all tables
        `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${username};`,
        `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${username};`,
        `GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO ${username};`,

        // Set default privileges
        `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${username};`,
        `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${username};`,
        `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO ${username};`,
      ];

      // Execute commands in a single psql session
      const commandString = setupCommands.join('\\n');

      try {
        await execAsync(
          `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) psql "${postgresUrl}" -c "${commandString}"`,
        );
      } catch (error) {
        console.log('⚠️  Some permission commands might have failed (this is often OK)');
      }

      // 3. Additional fix: ensure public schema exists and has correct permissions
      const schemaFixCommands = `
        \\c ${database}
        CREATE SCHEMA IF NOT EXISTS public;
        GRANT ALL ON SCHEMA public TO ${username};
        GRANT ALL ON SCHEMA public TO public;
        ALTER SCHEMA public OWNER TO ${username};
      `;

      try {
        await execAsync(
          `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) psql "${postgresUrl}" -c "${schemaFixCommands}"`,
        );
      } catch (error) {
        console.log('⚠️  Schema fix commands might have failed (this is often OK)');
      }

      console.log('✅ Database permissions setup completed');
    } catch (error) {
      console.error('❌ Failed to setup database permissions:', error);
      // Don't throw, as this might not always be necessary
    }
  }

  /**
   * Ensure database and schema exist before migrations
   */
  async ensureDatabaseAndSchema(): Promise<void> {
    console.log('🔍 Ensuring database and schema exist...');

    try {
      const { database, username, password, host, port } = this.config;
      const postgresUrl = `postgresql://${username}:${password}@${host}:${port}/postgres`;

      // 1. Create database if not exists
      try {
        await execAsync(
          `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) psql "${postgresUrl}" -c "CREATE DATABASE ${database}"`,
        );
        console.log('✅ Database created');
      } catch (error) {
        console.log('ℹ️  Database already exists');
      }

      // 2. Create and setup public schema
      const schemaCommands = `
        \\c ${database};
        CREATE SCHEMA IF NOT EXISTS public;
        GRANT ALL ON SCHEMA public TO ${username};
        GRANT ALL ON SCHEMA public TO public;
      `;

      await execAsync(
        `docker exec $(docker-compose -f docker-compose.dev.yml ps -q postgres) psql "${postgresUrl}" -c "${schemaCommands}"`,
      );

      console.log('✅ Schema setup completed');
    } catch (error) {
      console.error('❌ Failed to ensure database and schema:', error);
      throw error;
    }
  }

  async bootstrap(options?: {
    skipDocker?: boolean;
    skipMigrations?: boolean;
    skipSeeding?: boolean;
    reset?: boolean;
    cleanReset?: boolean;
    forcePermissions?: boolean;
  }): Promise<void> {
    const { skipDocker, skipMigrations, skipSeeding, reset, cleanReset, forcePermissions } = options || {};

    try {
      console.log('🚀 Starting database bootstrap...\n');

      // 1. Clean reset if requested (this includes stopping and removing Docker containers)
      if (cleanReset) {
        await this.cleanReset();
      } else if (!skipDocker) {
        await this.startDockerServices();
      }

      // 2. Update .env file
      await this.updateEnvFile();

      // 3. Reset database if requested (only if not doing clean reset)
      if (reset && !cleanReset) {
        await this.resetDatabase();
      }

      // 4. CRITICAL: Ensure database and schema exist before any other operations
      await this.ensureDatabaseAndSchema();

      // 5. Setup database permissions
      await this.setupDatabasePermissions();

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

      console.log('\n🎉 Database bootstrap completed successfully!');
      console.log('📊 You can now access:');
      console.log(`   - Database: postgresql://localhost:${this.config.port}/${this.config.database}`);
      console.log('   - PgAdmin: http://localhost:5050 (admin@admin.com / admin)');
      console.log('   - Prisma Studio: npm run db:studio');
    } catch (error) {
      console.error('\n💥 Bootstrap failed:', error);
      process.exit(1);
    }
  }

  /**
   * Health check cho database
   */
  async healthCheck(): Promise<boolean> {
    try {
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
      await this.prisma.$queryRaw`SELECT 1`;
      await this.prisma.$disconnect();
      return true;
    } catch (error) {
      return false;
    }
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

    default:
      console.log(`
🔧 Database Bootstrap CLI

Usage: tsx scripts/db-bootstrap.ts <command>

Commands:
  bootstrap, init     - Full database setup (default)
  start              - Start Docker services only
  reset              - Reset database (keep Docker volumes)
  clean-reset, nuclear- Complete clean reset (remove Docker volumes)
  fresh              - Nuclear reset + fix permissions
  fix-permissions    - Fix database user permissions
  test               - Test database connection
  migrate            - Run migrations only
  seed               - Seed database only

Troubleshooting Commands:
  fresh              - When you have permission issues
  clean-reset        - When Docker containers are corrupted
  fix-permissions    - When you get "user denied access" errors

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
