// scripts/db-config.ts
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface DatabaseBootstrapConfig {
  // Database connection
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    schema: string;
  };

  // Docker settings
  docker: {
    composeFile: string;
    services: string[];
    healthCheckRetries: number;
    healthCheckInterval: number;
  };

  // Prisma settings
  prisma: {
    generateBeforeMigrate: boolean;
    migrationName: string;
    seedAfterMigrate: boolean;
  };

  // Development tools
  tools: {
    pgAdmin: {
      port: number;
      email: string;
      password: string;
    };
    mailhog: {
      smtpPort: number;
      webPort: number;
    };
    redis: {
      port: number;
      password?: string;
    };
  };

  // Bootstrap options
  bootstrap: {
    skipDocker: boolean;
    skipMigrations: boolean;
    skipSeeding: boolean;
    autoBackup: boolean;
    verboseLogging: boolean;
  };
}

// Default configuration
const defaultConfig: DatabaseBootstrapConfig = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5555'),
    name: process.env.DB_NAME || 'myapp_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    schema: process.env.DB_SCHEMA || 'public'
  },

  docker: {
    composeFile: 'docker-compose.dev.yml',
    services: ['postgres', 'redis', 'mailhog', 'pgadmin'],
    healthCheckRetries: 30,
    healthCheckInterval: 2000
  },

  prisma: {
    generateBeforeMigrate: true,
    migrationName: 'init',
    seedAfterMigrate: true
  },

  tools: {
    pgAdmin: {
      port: 5050,
      email: 'admin@admin.com',
      password: 'admin'
    },
    mailhog: {
      smtpPort: 1025,
      webPort: 8025
    },
    redis: {
      port: 6379
    }
  },

  bootstrap: {
    skipDocker: false,
    skipMigrations: false,
    skipSeeding: false,
    autoBackup: true,
    verboseLogging: true
  }
};

// Environment-specific configurations
const environmentConfigs: Record<string, Partial<DatabaseBootstrapConfig>> = {
  development: {
    bootstrap: {
      skipDocker: false,
      skipMigrations: false,
      skipSeeding: true,
      autoBackup: true,
      verboseLogging: true
    }
  },

  test: {
    database: {
      name: 'myapp_test',
      port: 5433
    },
    docker: {
      services: ['postgres', 'redis']
    },
    bootstrap: {
      skipDocker: false,
      skipMigrations: false,
      skipSeeding: false,
      autoBackup: false,
      verboseLogging: false
    }
  },

  production: {
    bootstrap: {
      skipDocker: true,
      skipMigrations: false,
      skipSeeding: false,
      autoBackup: true,
      verboseLogging: false
    }
  }
};

/**
 * Load configuration từ file hoặc environment
 */
export function loadConfig(environment?: string): DatabaseBootstrapConfig {
  const env = environment || process.env.NODE_ENV || 'development';

  let config = { ...defaultConfig };

  // Load từ config file nếu tồn tại
  const configFile = join(process.cwd(), 'db-bootstrap.config.js');
  if (existsSync(configFile)) {
    try {
      const fileConfig = require(configFile);
      config = mergeDeep(config, fileConfig);
    } catch (error) {
      console.warn('⚠️  Failed to load config file:', error);
    }
  }

  // Apply environment-specific config
  if (environmentConfigs[env]) {
    config = mergeDeep(config, environmentConfigs[env]);
  }

  // Override với environment variables
  config = applyEnvironmentOverrides(config);

  return config;
}

/**
 * Apply environment variable overrides
 */
function applyEnvironmentOverrides(config: DatabaseBootstrapConfig): DatabaseBootstrapConfig {
  // Database overrides
  if (process.env.DATABASE_URL) {
    const dbUrl = new URL(process.env.DATABASE_URL);
    config.database.host = dbUrl.hostname;
    config.database.port = parseInt(dbUrl.port) || 5555;
    config.database.name = dbUrl.pathname.substring(1);
    config.database.username = dbUrl.username;
    config.database.password = dbUrl.password;
  }

  // Docker overrides
  if (process.env.DOCKER_COMPOSE_FILE) {
    config.docker.composeFile = process.env.DOCKER_COMPOSE_FILE;
  }

  // Bootstrap overrides
  if (process.env.SKIP_DOCKER === 'true') {
    config.bootstrap.skipDocker = true;
  }

  if (process.env.SKIP_MIGRATIONS === 'true') {
    config.bootstrap.skipMigrations = true;
  }

  if (process.env.SKIP_SEEDING === 'true') {
    config.bootstrap.skipSeeding = true;
  }

  return config;
}

/**
 * Deep merge utility
 */
function mergeDeep(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Validate configuration
 */
export function validateConfig(config: DatabaseBootstrapConfig): void {
  const errors: string[] = [];

  // Validate database config
  if (!config.database.host) errors.push('Database host is required');
  if (!config.database.name) errors.push('Database name is required');
  if (!config.database.username) errors.push('Database username is required');

  // Validate Docker config
  if (!config.docker.composeFile) errors.push('Docker compose file is required');
  if (!config.docker.services.length) errors.push('At least one Docker service is required');

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Generate database URL từ config
 */
export function generateDatabaseUrl(config: DatabaseBootstrapConfig): string {
  const { host, port, name, username, password, schema } = config.database;
  const schemaParam = schema && schema !== 'public' ? `?schema=${schema}` : '';
  return `postgresql://${username}:${password}@${host}:${port}/${name}${schemaParam}`;
}

/**
 * Sample config file generator
 */
export function generateConfigFile(): string {
  return `// db-bootstrap.config.js
module.exports = {
  database: {
    host: 'localhost',
    port: 5555,
    name: 'myapp_dev',
    username: 'postgres',
    password: 'postgres',
    schema: 'public'
  },

  docker: {
    composeFile: 'docker-compose.dev.yml',
    services: ['postgres', 'redis', 'mailhog', 'pgadmin'],
    healthCheckRetries: 30,
    healthCheckInterval: 2000
  },

  prisma: {
    generateBeforeMigrate: true,
    migrationName: 'init',
    seedAfterMigrate: true
  },

  tools: {
    pgAdmin: {
      port: 5050,
      email: 'admin@admin.com',
      password: 'admin'
    },
    mailhog: {
      smtpPort: 1025,
      webPort: 8025
    },
    redis: {
      port: 6379
    }
  },

  bootstrap: {
    skipDocker: false,
    skipMigrations: false,
    skipSeeding: false,
    autoBackup: true,
    verboseLogging: true
  }
};`;
}

export default {
  loadConfig,
  validateConfig,
  generateDatabaseUrl,
  generateConfigFile
};
