import { Client } from '@elastic/elasticsearch';
import { config } from '@infrastructure/config';
import { logger } from '@shared/logger';

interface ElasticsearchMapping {
  properties: Record<string, any>;
}

class ElasticsearchService {
  private client: Client;
  private isConnected: boolean = false;

  constructor() {
    this.client = new Client({
      node: config.search?.elasticsearch?.url || 'http://localhost:9200',
      auth: config.search?.elasticsearch?.auth
        ? {
            username: config.search.elasticsearch.auth.username,
            password: config.search.elasticsearch.auth.password,
          }
        : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async connect(): Promise<void> {
    try {
      const info = await this.client.info();
      logger.info('Elasticsearch connected', {
        version: info.version.number,
        cluster: info.cluster_name,
      });
      this.isConnected = true;

      // Create indices if they don't exist
      await this.createIndices();
    } catch (error) {
      logger.error('Failed to connect to Elasticsearch', error as Error);
      this.isConnected = false;
      // Don't throw - allow app to run without search
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    this.isConnected = false;
    logger.info('Elasticsearch disconnected');
  }

  async createIndices(): Promise<void> {
    const indices = [
      {
        name: 'knowledge_articles',
        mappings: {
          properties: {
            title: { type: 'text' as const, analyzer: 'standard' },
            content: { type: 'text' as const, analyzer: 'standard' },
            category: { type: 'keyword' as const },
            tags: { type: 'keyword' as const },
            viewCount: { type: 'integer' as const },
            helpful: { type: 'integer' as const },
            notHelpful: { type: 'integer' as const },
            createdAt: { type: 'date' as const },
            updatedAt: { type: 'date' as const },
          },
        } as ElasticsearchMapping,
      },
      {
        name: 'tickets',
        mappings: {
          properties: {
            number: { type: 'keyword' as const },
            subject: { type: 'text' as const, analyzer: 'standard' },
            description: { type: 'text' as const, analyzer: 'standard' },
            status: { type: 'keyword' as const },
            priority: { type: 'keyword' as const },
            category: { type: 'keyword' as const },
            tags: { type: 'keyword' as const },
            createdAt: { type: 'date' as const },
            resolvedAt: { type: 'date' as const },
          },
        } as ElasticsearchMapping,
      },
    ];

    for (const index of indices) {
      try {
        const exists = await this.client.indices.exists({ index: index.name });

        if (!exists) {
          await this.client.indices.create({
            index: index.name,
            body: {
              mappings: index.mappings,
              settings: {
                number_of_shards: 1,
                number_of_replicas: 0,
              },
            },
          });

          logger.info(`Elasticsearch index created: ${index.name}`);
        }
      } catch (error) {
        logger.error(`Failed to create index ${index.name}`, error as Error);
      }
    }
  }

  async search(params: any): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Elasticsearch is not connected');
    }

    return this.client.search(params);
  }

  async index(params: any): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Elasticsearch is not connected');
    }

    return this.client.index(params);
  }

  async update(params: any): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Elasticsearch is not connected');
    }

    return this.client.update(params);
  }

  async delete(params: any): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Elasticsearch is not connected');
    }

    return this.client.delete(params);
  }

  async bulk(params: any): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Elasticsearch is not connected');
    }

    return this.client.bulk(params);
  }

  getClient(): Client {
    return this.client;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Create singleton instance
export const elasticsearchClient = new ElasticsearchService();

// Export for use in services
export { ElasticsearchService };
