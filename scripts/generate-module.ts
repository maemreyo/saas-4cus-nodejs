import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ModuleConfig {
  name: string;
  displayName: string;
  description: string;
  features: string[];
  dependencies: string[];
  includeQueue: boolean;
  includeEvents: boolean;
  includeMiddleware: boolean;
  includeController: boolean;
  includeWebhooks: boolean;
  includeCaching: boolean;
  includeAnalytics: boolean;
}

interface FileTemplate {
  path: string;
  content: string;
}

class ModuleGenerator {
  private config!: ModuleConfig;
  private modulePath!: string;

  async run() {
    console.clear();
    console.log(chalk.blue.bold('\n🚀 Business Module Generator\n'));

    // Get module configuration
    await this.getModuleConfig();

    // Confirm generation
    const confirmed = await this.confirmGeneration();
    if (!confirmed) {
      console.log(chalk.yellow('Module generation cancelled.'));
      return;
    }

    // Generate module files
    await this.generateModule();

    // Update related files
    await this.updateProjectFiles();

    // Show success message
    this.showSuccessMessage();
  }

  private async getModuleConfig() {
    const basicInfo = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Module name (lowercase, e.g., "ai", "chat", "workflow"):',
        validate: (input) => {
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'Module name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Display name (e.g., "AI Service", "Chat System"):',
        validate: (input) => input.length > 0,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Module description:',
        validate: (input) => input.length > 0,
      },
    ]);

    const features = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select module features:',
        choices: [
          { name: 'RESTful API endpoints', value: 'api', checked: true },
          { name: 'Database models (Prisma)', value: 'database', checked: true },
          { name: 'Background jobs (Queue)', value: 'queue' },
          { name: 'Event system', value: 'events' },
          { name: 'Middleware', value: 'middleware' },
          { name: 'Webhook support', value: 'webhooks' },
          { name: 'Caching layer', value: 'caching' },
          { name: 'Analytics tracking', value: 'analytics' },
          { name: 'Rate limiting', value: 'ratelimit' },
          { name: 'File handling', value: 'files' },
        ],
      },
    ]);

    const dependencies = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'dependencies',
        message: 'Select module dependencies:',
        choices: [
          { name: 'Auth (user authentication)', value: 'auth', checked: true },
          { name: 'User (user management)', value: 'user', checked: true },
          { name: 'Tenant (multi-tenancy)', value: 'tenant' },
          { name: 'Billing (payments)', value: 'billing' },
          { name: 'Notification', value: 'notification' },
          { name: 'Analytics', value: 'analytics' },
          { name: 'API Usage', value: 'api-usage' },
        ],
      },
    ]);

    this.config = {
      ...basicInfo,
      features: features.features,
      dependencies: dependencies.dependencies,
      includeQueue: features.features.includes('queue'),
      includeEvents: features.features.includes('events'),
      includeMiddleware: features.features.includes('middleware'),
      includeController: features.features.includes('api'),
      includeWebhooks: features.features.includes('webhooks'),
      includeCaching: features.features.includes('caching'),
      includeAnalytics: features.features.includes('analytics'),
    };

    this.modulePath = path.join(process.cwd(), 'src', 'modules', this.config.name);
  }

  private async confirmGeneration(): Promise<boolean> {
    console.log(chalk.blue('\n📋 Module Configuration:'));
    console.log(`   Name: ${this.config.name}`);
    console.log(`   Display Name: ${this.config.displayName}`);
    console.log(`   Description: ${this.config.description}`);
    console.log(`   Features: ${this.config.features.join(', ')}`);
    console.log(`   Dependencies: ${this.config.dependencies.join(', ')}`);
    console.log(`   Path: ${this.modulePath}`);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Generate module with this configuration?',
        default: true,
      },
    ]);

    return confirm;
  }

  private async generateModule() {
    console.log(chalk.blue('\n🔨 Generating module files...\n'));

    // Create module directory
    await fs.mkdir(this.modulePath, { recursive: true });

    // Generate files based on configuration
    const files = this.generateFileTemplates();

    for (const file of files) {
      const filePath = path.join(this.modulePath, file.path);
      const fileDir = path.dirname(filePath);

      // Create directory if needed
      await fs.mkdir(fileDir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, file.content);
      console.log(chalk.green(`✅ Created ${file.path}`));
    }
  }

  private generateFileTemplates(): FileTemplate[] {
    const files: FileTemplate[] = [];
    const pascalCase = this.toPascalCase(this.config.name);
    const camelCase = this.toCamelCase(this.config.name);

    // README.md
    files.push({
      path: 'README.md',
      content: this.generateReadme(),
    });

    // index.ts
    files.push({
      path: 'index.ts',
      content: this.generateIndex(),
    });

    // DTOs
    files.push({
      path: `${this.config.name}.dto.ts`,
      content: this.generateDto(),
    });

    // Service
    files.push({
      path: `${this.config.name}.service.ts`,
      content: this.generateService(),
    });

    // Controller
    if (this.config.includeController) {
      files.push({
        path: `${this.config.name}.controller.ts`,
        content: this.generateController(),
      });

      files.push({
        path: `${this.config.name}.route.ts`,
        content: this.generateRoutes(),
      });
    }

    // Events
    if (this.config.includeEvents) {
      files.push({
        path: `${this.config.name}.events.ts`,
        content: this.generateEvents(),
      });

      files.push({
        path: `${this.config.name}.events.handlers.ts`,
        content: this.generateEventHandlers(),
      });
    }

    // Queue
    if (this.config.includeQueue) {
      files.push({
        path: `${this.config.name}.queue.ts`,
        content: this.generateQueue(),
      });
    }

    // Middleware
    if (this.config.includeMiddleware) {
      files.push({
        path: `${this.config.name}.middleware.ts`,
        content: this.generateMiddleware(),
      });
    }

    // Tests
    files.push({
      path: `__tests__/${this.config.name}.service.test.ts`,
      content: this.generateServiceTest(),
    });

    return files;
  }

  private generateReadme(): string {
    return `# ${this.config.displayName} Module

${this.config.description}

## Features

${this.config.features.map(f => `- ${f}`).join('\n')}

## API Endpoints

### Protected Endpoints
\`\`\`
GET    /api/${this.config.name}              - List items
POST   /api/${this.config.name}              - Create item
GET    /api/${this.config.name}/:id          - Get item
PUT    /api/${this.config.name}/:id          - Update item
DELETE /api/${this.config.name}/:id          - Delete item
\`\`\`

## Usage Examples

### Create Item
\`\`\`typescript
POST /api/${this.config.name}
{
  "name": "Example",
  "description": "Example description"
}
\`\`\`

## Events

The module emits:
- \`${this.config.name}.created\`
- \`${this.config.name}.updated\`
- \`${this.config.name}.deleted\`

## Configuration

\`\`\`env
# ${this.config.displayName} Settings
${this.config.name.toUpperCase()}_ENABLED=true
\`\`\`
`;
  }

  private generateIndex(): string {
    const pascalCase = this.toPascalCase(this.config.name);
    const camelCase = this.toCamelCase(this.config.name);

    return `// src/modules/${this.config.name}/index.ts
import { Container } from 'typedi';
import { ${pascalCase}Service } from './${this.config.name}.service';
${this.config.includeController ? `import { ${pascalCase}Controller } from './${this.config.name}.controller';` : ''}
${this.config.includeEvents ? `import { ${pascalCase}EventHandlers } from './${this.config.name}.events.handlers';` : ''}
${this.config.includeQueue ? `import { ${camelCase}QueueProcessor } from './${this.config.name}.queue';` : ''}
import { logger } from '@shared/logger';

// Export all components
export { ${pascalCase}Service } from './${this.config.name}.service';
${this.config.includeController ? `export { ${pascalCase}Controller } from './${this.config.name}.controller';` : ''}
${this.config.includeEvents ? `export { ${pascalCase}Events } from './${this.config.name}.events';` : ''}
export * from './${this.config.name}.dto';
${this.config.includeMiddleware ? `export * from './${this.config.name}.middleware';` : ''}

// Export routes
${this.config.includeController ? `export { default as ${camelCase}Routes } from './${this.config.name}.route';` : ''}

/**
 * Initialize ${this.config.displayName} module
 */
export async function initialize${pascalCase}Module(): Promise<void> {
  try {
    logger.info('Initializing ${this.config.name} module...');

    // Initialize services
    Container.get(${pascalCase}Service);
    ${this.config.includeController ? `Container.get(${pascalCase}Controller);` : ''}
    ${this.config.includeEvents ? `Container.get(${pascalCase}EventHandlers);` : ''}

    ${this.config.includeQueue ? `
    // Initialize queue processor
    await ${camelCase}QueueProcessor.initialize();
    ` : ''}

    logger.info('${this.config.displayName} module initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize ${this.config.name} module', error as Error);
    throw error;
  }
}

/**
 * Shutdown ${this.config.displayName} module
 */
export async function shutdown${pascalCase}Module(): Promise<void> {
  ${this.config.includeQueue ? `await ${camelCase}QueueProcessor.shutdown();` : ''}
  logger.info('${this.config.displayName} module shut down');
}
`;
  }

  private generateDto(): string {
    const pascalCase = this.toPascalCase(this.config.name);

    return `// src/modules/${this.config.name}/${this.config.name}.dto.ts
import { z } from 'zod';
import {
  createPaginationSchema,
  createResponseSchema,
  type PaginatedResponse
} from '@shared/dto/common.dto';

// Base schemas
export const ${pascalCase}Schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  ${this.config.dependencies.includes('user') ? 'userId: z.string(),' : ''}
  ${this.config.dependencies.includes('tenant') ? 'tenantId: z.string().optional(),' : ''}
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create/Update schemas
export const Create${pascalCase}Schema = ${pascalCase}Schema.omit({
  id: true,
  ${this.config.dependencies.includes('user') ? 'userId: true,' : ''}
  ${this.config.dependencies.includes('tenant') ? 'tenantId: true,' : ''}
  createdAt: true,
  updatedAt: true,
});

export const Update${pascalCase}Schema = Create${pascalCase}Schema.partial();

// Query schemas
export const ${pascalCase}QuerySchema = createPaginationSchema.extend({
  search: z.string().optional(),
  status: z.string().optional(),
});

// Response schemas
export const ${pascalCase}ResponseSchema = createResponseSchema(${pascalCase}Schema);
export const ${pascalCase}ListResponseSchema = createResponseSchema(
  z.array(${pascalCase}Schema)
);

// Types
export type ${pascalCase} = z.infer<typeof ${pascalCase}Schema>;
export type Create${pascalCase}DTO = z.infer<typeof Create${pascalCase}Schema>;
export type Update${pascalCase}DTO = z.infer<typeof Update${pascalCase}Schema>;
export type ${pascalCase}Query = z.infer<typeof ${pascalCase}QuerySchema>;
export type ${pascalCase}Response = z.infer<typeof ${pascalCase}ResponseSchema>;
export type ${pascalCase}ListResponse = PaginatedResponse<${pascalCase}>;
`;
  }

  private generateService(): string {
    const pascalCase = this.toPascalCase(this.config.name);
    const camelCase = this.toCamelCase(this.config.name);

    return `// src/modules/${this.config.name}/${this.config.name}.service.ts
import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
${this.config.includeCaching ? `import { redis } from '@infrastructure/cache/redis.service';` : ''}
import { logger } from '@shared/logger';
${this.config.includeEvents ? `import { eventBus } from '@shared/events/event-bus';` : ''}
${this.config.includeQueue ? `import { queueService } from '@shared/queue/queue.service';` : ''}
${this.config.includeAnalytics ? `import { AnalyticsService } from '@modules/analytics';` : ''}
import { NotFoundException } from '@shared/exceptions';
import type {
  ${pascalCase},
  Create${pascalCase}DTO,
  Update${pascalCase}DTO,
  ${pascalCase}Query
} from './${this.config.name}.dto';

@Service()
export class ${pascalCase}Service {
  ${this.config.includeAnalytics ? `
  constructor(
    private readonly analyticsService: AnalyticsService
  ) {}
  ` : ''}

  /**
   * Create a new ${this.config.name}
   */
  async create(
    data: Create${pascalCase}DTO,
    userId: string,
    tenantId?: string
  ): Promise<${pascalCase}> {
    logger.info('Creating ${this.config.name}', { userId, tenantId });

    const ${camelCase} = await prisma.client.${camelCase}.create({
      data: {
        ...data,
        ${this.config.dependencies.includes('user') ? 'userId,' : ''}
        ${this.config.dependencies.includes('tenant') ? 'tenantId,' : ''}
      },
    });

    ${this.config.includeEvents ? `
    // Emit event
    await eventBus.emit('${this.config.name}.created', {
      ${camelCase}Id: ${camelCase}.id,
      userId,
      tenantId,
    });
    ` : ''}

    ${this.config.includeAnalytics ? `
    // Track analytics
    await this.analyticsService.track({
      event: '${this.config.name}_created',
      userId,
      properties: {
        ${camelCase}Id: ${camelCase}.id,
        tenantId,
      },
    });
    ` : ''}

    ${this.config.includeCaching ? `
    // Invalidate cache
    await this.invalidateCache(userId, tenantId);
    ` : ''}

    return ${camelCase};
  }

  /**
   * Get ${this.config.name} by ID
   */
  async getById(
    id: string,
    userId: string,
    tenantId?: string
  ): Promise<${pascalCase}> {
    ${this.config.includeCaching ? `
    // Check cache
    const cacheKey = this.getCacheKey('item', id);
    const cached = await redis.get<${pascalCase}>(cacheKey);
    if (cached) {
      return cached;
    }
    ` : ''}

    const ${camelCase} = await prisma.client.${camelCase}.findFirst({
      where: {
        id,
        ${this.config.dependencies.includes('user') ? 'userId,' : ''}
        ${this.config.dependencies.includes('tenant') ? 'tenantId,' : ''}
      },
    });

    if (!${camelCase}) {
      throw new NotFoundException('${pascalCase} not found');
    }

    ${this.config.includeCaching ? `
    // Cache result
    await redis.set(cacheKey, ${camelCase}, { ttl: 300 });
    ` : ''}

    return ${camelCase};
  }

  /**
   * List ${this.config.name}s with pagination
   */
  async list(
    query: ${pascalCase}Query,
    userId: string,
    tenantId?: string
  ): Promise<{
    items: ${pascalCase}[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, search, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      ${this.config.dependencies.includes('user') ? 'userId,' : ''}
      ${this.config.dependencies.includes('tenant') ? 'tenantId,' : ''}
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
    };

    const [items, total] = await Promise.all([
      prisma.client.${camelCase}.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.${camelCase}.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * Update ${this.config.name}
   */
  async update(
    id: string,
    data: Update${pascalCase}DTO,
    userId: string,
    tenantId?: string
  ): Promise<${pascalCase}> {
    // Check exists
    await this.getById(id, userId, tenantId);

    const updated = await prisma.client.${camelCase}.update({
      where: { id },
      data,
    });

    ${this.config.includeEvents ? `
    // Emit event
    await eventBus.emit('${this.config.name}.updated', {
      ${camelCase}Id: id,
      userId,
      changes: data,
    });
    ` : ''}

    ${this.config.includeCaching ? `
    // Invalidate cache
    await this.invalidateCache(userId, tenantId);
    await redis.delete(this.getCacheKey('item', id));
    ` : ''}

    return updated;
  }

  /**
   * Delete ${this.config.name}
   */
  async delete(
    id: string,
    userId: string,
    tenantId?: string
  ): Promise<void> {
    // Check exists
    await this.getById(id, userId, tenantId);

    await prisma.client.${camelCase}.delete({
      where: { id },
    });

    ${this.config.includeEvents ? `
    // Emit event
    await eventBus.emit('${this.config.name}.deleted', {
      ${camelCase}Id: id,
      userId,
    });
    ` : ''}

    ${this.config.includeCaching ? `
    // Invalidate cache
    await this.invalidateCache(userId, tenantId);
    await redis.delete(this.getCacheKey('item', id));
    ` : ''}
  }

  ${this.config.includeCaching ? `
  /**
   * Cache key helpers
   */
  private getCacheKey(type: string, ...parts: string[]): string {
    return ['${this.config.name}', type, ...parts].filter(Boolean).join(':');
  }

  private async invalidateCache(userId: string, tenantId?: string): Promise<void> {
    const pattern = this.getCacheKey('list', userId, tenantId || '*');
    await redis.deletePattern(pattern);
  }
  ` : ''}
}
`;
  }

  private generateController(): string {
    const pascalCase = this.toPascalCase(this.config.name);
    const camelCase = this.toCamelCase(this.config.name);

    return `// src/modules/${this.config.name}/${this.config.name}.controller.ts
import { Service } from 'typedi';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ${pascalCase}Service } from './${this.config.name}.service';
import {
  Create${pascalCase}Schema,
  Update${pascalCase}Schema,
  ${pascalCase}QuerySchema,
  type Create${pascalCase}DTO,
  type Update${pascalCase}DTO,
  type ${pascalCase}Query,
} from './${this.config.name}.dto';

@Service()
export class ${pascalCase}Controller {
  constructor(private readonly ${camelCase}Service: ${pascalCase}Service) {}

  /**
   * Create ${this.config.name}
   */
  async create(
    request: FastifyRequest<{
      Body: Create${pascalCase}DTO;
    }>,
    reply: FastifyReply
  ) {
    const data = Create${pascalCase}Schema.parse(request.body);
    const userId = request.user.id;
    ${this.config.dependencies.includes('tenant') ? 'const tenantId = request.tenantId;' : ''}

    const ${camelCase} = await this.${camelCase}Service.create(
      data,
      userId,
      ${this.config.dependencies.includes('tenant') ? 'tenantId' : 'undefined'}
    );

    return reply.status(201).send({
      message: '${pascalCase} created successfully',
      data: ${camelCase},
    });
  }

  /**
   * Get ${this.config.name} by ID
   */
  async getById(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const userId = request.user.id;
    ${this.config.dependencies.includes('tenant') ? 'const tenantId = request.tenantId;' : ''}

    const ${camelCase} = await this.${camelCase}Service.getById(
      id,
      userId,
      ${this.config.dependencies.includes('tenant') ? 'tenantId' : 'undefined'}
    );

    return reply.send({
      data: ${camelCase},
    });
  }

  /**
   * List ${this.config.name}s
   */
  async list(
    request: FastifyRequest<{
      Querystring: ${pascalCase}Query;
    }>,
    reply: FastifyReply
  ) {
    const query = ${pascalCase}QuerySchema.parse(request.query);
    const userId = request.user.id;
    ${this.config.dependencies.includes('tenant') ? 'const tenantId = request.tenantId;' : ''}

    const result = await this.${camelCase}Service.list(
      query,
      userId,
      ${this.config.dependencies.includes('tenant') ? 'tenantId' : 'undefined'}
    );

    return reply.send({
      data: result,
    });
  }

  /**
   * Update ${this.config.name}
   */
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Update${pascalCase}DTO;
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const data = Update${pascalCase}Schema.parse(request.body);
    const userId = request.user.id;
    ${this.config.dependencies.includes('tenant') ? 'const tenantId = request.tenantId;' : ''}

    const updated = await this.${camelCase}Service.update(
      id,
      data,
      userId,
      ${this.config.dependencies.includes('tenant') ? 'tenantId' : 'undefined'}
    );

    return reply.send({
      message: '${pascalCase} updated successfully',
      data: updated,
    });
  }

  /**
   * Delete ${this.config.name}
   */
  async delete(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const userId = request.user.id;
    ${this.config.dependencies.includes('tenant') ? 'const tenantId = request.tenantId;' : ''}

    await this.${camelCase}Service.delete(
      id,
      userId,
      ${this.config.dependencies.includes('tenant') ? 'tenantId' : 'undefined'}
    );

    return reply.send({
      message: '${pascalCase} deleted successfully',
    });
  }
}
`;
  }

  private generateRoutes(): string {
    const pascalCase = this.toPascalCase(this.config.name);
    const camelCase = this.toCamelCase(this.config.name);

    return `// src/modules/${this.config.name}/${this.config.name}.route.ts
import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { ${pascalCase}Controller } from './${this.config.name}.controller';
${this.config.dependencies.includes('auth') ? `import { authenticate } from '@modules/auth/auth.middleware';` : ''}
${this.config.dependencies.includes('tenant') ? `import { requireTenant } from '@modules/tenant/tenant.middleware';` : ''}
${this.config.includeMiddleware ? `import { /* your middleware */ } from './${this.config.name}.middleware';` : ''}

export default async function ${camelCase}Routes(fastify: FastifyInstance) {
  const controller = Container.get(${pascalCase}Controller);

  // Apply authentication to all routes
  ${this.config.dependencies.includes('auth') ? 'fastify.addHook(\'onRequest\', authenticate);' : ''}
  ${this.config.dependencies.includes('tenant') ? 'fastify.addHook(\'onRequest\', requireTenant());' : ''}

  // Routes
  fastify.post('/', controller.create.bind(controller));
  fastify.get('/', controller.list.bind(controller));
  fastify.get('/:id', controller.getById.bind(controller));
  fastify.put('/:id', controller.update.bind(controller));
  fastify.delete('/:id', controller.delete.bind(controller));
}
`;
  }

  private generateEvents(): string {
    return `// src/modules/${this.config.name}/${this.config.name}.events.ts
export enum ${this.toPascalCase(this.config.name)}Events {
  CREATED = '${this.config.name}.created',
  UPDATED = '${this.config.name}.updated',
  DELETED = '${this.config.name}.deleted',
}

export interface ${this.toPascalCase(this.config.name)}CreatedEvent {
  ${this.toCamelCase(this.config.name)}Id: string;
  userId: string;
  tenantId?: string;
  timestamp: Date;
}

export interface ${this.toPascalCase(this.config.name)}UpdatedEvent {
  ${this.toCamelCase(this.config.name)}Id: string;
  userId: string;
  changes: Record<string, any>;
  timestamp: Date;
}

export interface ${this.toPascalCase(this.config.name)}DeletedEvent {
  ${this.toCamelCase(this.config.name)}Id: string;
  userId: string;
  timestamp: Date;
}
`;
  }

  private generateEventHandlers(): string {
    const pascalCase = this.toPascalCase(this.config.name);

    return `// src/modules/${this.config.name}/${this.config.name}.events.handlers.ts
import { Service } from 'typedi';
import { eventBus } from '@shared/events/event-bus';
import { logger } from '@shared/logger';
import { ${pascalCase}Events } from './${this.config.name}.events';

@Service()
export class ${pascalCase}EventHandlers {
  constructor() {
    this.registerHandlers();
  }

  private registerHandlers() {
    // Handle created events
    eventBus.on(${pascalCase}Events.CREATED, async (payload) => {
      logger.info('${pascalCase} created', payload);
      // Add your logic here
    });

    // Handle updated events
    eventBus.on(${pascalCase}Events.UPDATED, async (payload) => {
      logger.info('${pascalCase} updated', payload);
      // Add your logic here
    });

    // Handle deleted events
    eventBus.on(${pascalCase}Events.DELETED, async (payload) => {
      logger.info('${pascalCase} deleted', payload);
      // Add your logic here
    });
  }
}
`;
  }

  private generateQueue(): string {
    const pascalCase = this.toPascalCase(this.config.name);
    const camelCase = this.toCamelCase(this.config.name);

    return `// src/modules/${this.config.name}/${this.config.name}.queue.ts
import { Container } from 'typedi';
import { queueService } from '@shared/queue/queue.service';
import { logger } from '@shared/logger';
import { ${pascalCase}Service } from './${this.config.name}.service';

export const ${camelCase}QueueProcessor = {
  async initialize() {
    const ${camelCase}Service = Container.get(${pascalCase}Service);

    // Register queue processors
    queueService.registerProcessor('${this.config.name}', 'process', async (job) => {
      logger.info('Processing ${this.config.name} job', { jobId: job.id });

      try {
        // Process job
        const { action, data } = job.data;

        switch (action) {
          case 'example':
            // Add your processing logic
            break;
          default:
            logger.warn('Unknown ${this.config.name} job action', { action });
        }
      } catch (error) {
        logger.error('Failed to process ${this.config.name} job', error as Error);
        throw error;
      }
    });

    logger.info('${pascalCase} queue processor initialized');
  },

  async shutdown() {
    // Any cleanup logic
    logger.info('${pascalCase} queue processor shutdown');
  }
};

// Helper to add jobs
export async function add${pascalCase}Job(
  action: string,
  data: any,
  options?: any
) {
  return queueService.addJob('${this.config.name}', 'process', {
    action,
    data,
  }, options);
}
`;
  }

  private generateMiddleware(): string {
    const pascalCase = this.toPascalCase(this.config.name);

    return `// src/modules/${this.config.name}/${this.config.name}.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { Container } from 'typedi';
import { ForbiddenException } from '@shared/exceptions';
import { ${pascalCase}Service } from './${this.config.name}.service';

/**
 * Middleware to check ${this.config.name} access
 */
export async function check${pascalCase}Access(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const ${this.toCamelCase(this.config.name)}Service = Container.get(${pascalCase}Service);
  const { id } = request.params;
  const userId = request.user.id;
  ${this.config.dependencies.includes('tenant') ? 'const tenantId = request.tenantId;' : ''}

  try {
    await ${this.toCamelCase(this.config.name)}Service.getById(
      id,
      userId,
      ${this.config.dependencies.includes('tenant') ? 'tenantId' : 'undefined'}
    );
  } catch (error) {
    throw new ForbiddenException('Access denied');
  }
}

/**
 * Rate limiting for ${this.config.name} operations
 */
export function ${this.toCamelCase(this.config.name)}RateLimit(max: number = 10, window: number = 60000) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Implement rate limiting logic
    // You can use the existing rate limiter from shared services
  };
}
`;
  }

  private generateServiceTest(): string {
    const pascalCase = this.toPascalCase(this.config.name);
    const camelCase = this.toCamelCase(this.config.name);

    return `// src/modules/${this.config.name}/__tests__/${this.config.name}.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Container } from 'typedi';
import { ${pascalCase}Service } from '../${this.config.name}.service';
import { prisma } from '@infrastructure/database/prisma.service';

vi.mock('@infrastructure/database/prisma.service', () => ({
  prisma: {
    client: {
      ${camelCase}: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  },
}));

describe('${pascalCase}Service', () => {
  let service: ${pascalCase}Service;

  beforeEach(() => {
    Container.reset();
    service = Container.get(${pascalCase}Service);
  });

  describe('create', () => {
    it('should create a new ${this.config.name}', async () => {
      const mockData = {
        name: 'Test ${pascalCase}',
        description: 'Test description',
      };

      const mockResult = {
        id: '123',
        ...mockData,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.client.${camelCase}.create).mockResolvedValue(mockResult);

      const result = await service.create(mockData, 'user-123');

      expect(result).toEqual(mockResult);
      expect(prisma.client.${camelCase}.create).toHaveBeenCalledWith({
        data: {
          ...mockData,
          userId: 'user-123',
        },
      });
    });
  });

  describe('getById', () => {
    it('should get ${this.config.name} by id', async () => {
      const mock${pascalCase} = {
        id: '123',
        name: 'Test',
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.client.${camelCase}.findFirst).mockResolvedValue(mock${pascalCase});

      const result = await service.getById('123', 'user-123');

      expect(result).toEqual(mock${pascalCase});
    });

    it('should throw NotFoundException when ${this.config.name} not found', async () => {
      vi.mocked(prisma.client.${camelCase}.findFirst).mockResolvedValue(null);

      await expect(service.getById('123', 'user-123')).rejects.toThrow(
        '${pascalCase} not found'
      );
    });
  });
});
`;
  }

  private async updateProjectFiles() {
    console.log(chalk.blue('\n📝 Updating project files...\n'));

    // Update module manager config
    await this.updateModuleManagerConfig();

    // Update environment template
    await this.updateEnvTemplate();

    // Generate Prisma schema if database feature is selected
    if (this.config.features.includes('database')) {
      await this.generatePrismaSchema();
    }
  }

  private async updateModuleManagerConfig() {
    const configPath = path.join(process.cwd(), 'src', 'infrastructure', 'modules', 'module.config.ts');

    try {
      let content = await fs.readFile(configPath, 'utf-8');

      // Add to MODULE_INIT_ORDER
      const orderRegex = /export const MODULE_INIT_ORDER[^=]*=\s*\[([^\]]*)\]/s;
      const match = content.match(orderRegex);

      if (match) {
        const modules = match[1].trim().split(',').map(m => m.trim()).filter(m => m);

        // Find appropriate position based on dependencies
        let position = modules.length;
        for (let i = 0; i < modules.length; i++) {
          const module = modules[i].replace(/['"`]/g, '');
          if (this.config.dependencies.includes(module)) {
            position = Math.max(position, i + 1);
          }
        }

        modules.splice(position, 0, `'${this.config.name}'`);

        content = content.replace(
          orderRegex,
          `export const MODULE_INIT_ORDER: ModuleName[] = [\n  ${modules.join(',\n  ')}\n]`
        );
      }

      await fs.writeFile(configPath, content);
      console.log(chalk.green('✅ Updated module.config.ts'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not update module.config.ts - please update manually'));
    }
  }

  private async updateEnvTemplate() {
    const envExamplePath = path.join(process.cwd(), '.env.example');

    try {
      let content = await fs.readFile(envExamplePath, 'utf-8');

      // Add module configuration
      const moduleSection = `
# ${this.config.displayName} Module
${this.config.name.toUpperCase()}_MODULE_ENABLED=false
`;

      content += moduleSection;

      await fs.writeFile(envExamplePath, content);
      console.log(chalk.green('✅ Updated .env.example'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not update .env.example'));
    }
  }

  private async generatePrismaSchema() {
    const schemaContent = `
// Add this to your prisma/schema.prisma file

model ${this.toPascalCase(this.config.name)} {
  id          String   @id @default(cuid())
  name        String
  description String?
  metadata    Json?
  status      String   @default("active")

  ${this.config.dependencies.includes('user') ? `// User relation
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)` : ''}

  ${this.config.dependencies.includes('tenant') ? `// Tenant relation
  tenantId    String?
  tenant      Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)` : ''}

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId${this.config.dependencies.includes('tenant') ? ', tenantId' : ''}])
  @@index([status])
  @@index([createdAt])
}
`;

    const schemaPath = path.join(this.modulePath, 'schema.prisma');
    await fs.writeFile(schemaPath, schemaContent);
    console.log(chalk.green('✅ Generated Prisma schema template'));
  }

  private showSuccessMessage() {
    console.log(chalk.green.bold('\n✨ Module generated successfully!\n'));

    console.log(chalk.blue('📋 Next steps:'));
    console.log(`1. Add Prisma model to prisma/schema.prisma (see ${this.config.name}/schema.prisma)`);
    console.log(`2. Run database migration: pnpm db:migrate`);
    console.log(`3. Update module.config.ts if not auto-updated`);
    console.log(`4. Add ${this.config.name.toUpperCase()}_MODULE_ENABLED=true to .env`);
    console.log(`5. Import and register routes in app.ts`);
    console.log(`6. Run tests: pnpm test src/modules/${this.config.name}`);

    console.log(chalk.yellow('\n💡 Tips:'));
    console.log(`- README.md has API documentation`);
    console.log(`- Customize the generated files for your specific needs`);
    console.log(`- Add validation rules in ${this.config.name}.dto.ts`);
    console.log(`- Implement business logic in ${this.config.name}.service.ts`);
  }

  private toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }
}

// Run the generator
const generator = new ModuleGenerator();
generator.run().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});
