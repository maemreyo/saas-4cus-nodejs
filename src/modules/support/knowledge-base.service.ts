import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { Cacheable } from '@infrastructure/cache/redis.service';
import { elasticsearchClient } from '@infrastructure/search/elasticsearch.service';
import { Container } from 'typedi';

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  viewCount: number;
  helpful: number;
  notHelpful: number;
  relatedTickets: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SuggestedSolution {
  articleId: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
  category: string;
}

@Service()
export class KnowledgeBaseService {
  /**
   * Search for solutions based on ticket content
   */
  async searchSolutions(
    query: string,
    options?: {
      category?: string;
      limit?: number;
    }
  ): Promise<SuggestedSolution[]> {
    try {
      // Use Elasticsearch for advanced search
      const searchQuery = {
        index: 'knowledge_articles',
        body: {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query,
                    fields: ['title^3', 'content', 'tags^2'],
                    type: 'best_fields',
                    fuzziness: 'AUTO'
                  }
                }
              ],
              ...(options?.category && {
                filter: [
                  { term: { category: options.category } }
                ]
              })
            }
          },
          highlight: {
            fields: {
              content: {
                fragment_size: 150,
                number_of_fragments: 1
              }
            }
          },
          size: options?.limit || 5
        }
      };

      const response = await elasticsearchClient.search(searchQuery);

      return response.body.hits.hits.map((hit: any) => ({
        articleId: hit._id,
        title: hit._source.title,
        excerpt: hit.highlight?.content?.[0] || hit._source.content.substring(0, 150) + '...',
        relevanceScore: hit._score,
        category: hit._source.category
      }));
    } catch (error) {
      logger.error('Error searching knowledge base', error as Error);

      // Fallback to database search
      return this.fallbackSearch(query, options);
    }
  }

  /**
   * Get suggested articles for a ticket
   */
  @Cacheable({ ttl: 3600, namespace: 'kb:suggestions' })
  async getSuggestedArticles(
    ticketSubject: string,
    ticketDescription: string,
    category?: string
  ): Promise<SuggestedSolution[]> {
    // Extract keywords from ticket
    const keywords = this.extractKeywords(ticketSubject + ' ' + ticketDescription);

    // Search for relevant articles
    const query = keywords.join(' ');
    return this.searchSolutions(query, { category });
  }

  /**
   * Get popular articles
   */
  @Cacheable({ ttl: 3600, namespace: 'kb:popular' })
  async getPopularArticles(limit: number = 10): Promise<KnowledgeArticle[]> {
    // In a real implementation, this would query from a knowledge base table
    // For now, return mock data
    return [];
  }

  /**
   * Track article view
   */
  async trackArticleView(articleId: string, userId?: string): Promise<void> {
    const key = `kb:views:${articleId}`;
    await redis.hincrby(key, 'total', 1);

    if (userId) {
      await redis.hincrby(key, `user:${userId}`, 1);
    }

    // Update view count periodically (every 100 views)
    const views = await redis.hget(key, 'total');
    if (parseInt(views || '0') % 100 === 0) {
      await this.updateArticleViewCount(articleId, parseInt(views || '0'));
    }
  }

  /**
   * Rate article helpfulness
   */
  async rateArticle(
    articleId: string,
    userId: string,
    helpful: boolean
  ): Promise<void> {
    const key = `kb:ratings:${articleId}`;
    const userKey = `kb:user_ratings:${userId}`;

    // Check if user already rated
    const existingRating = await redis.hget(userKey, articleId);
    if (existingRating) {
      throw new Error('You have already rated this article');
    }

    // Record rating
    await redis.hincrby(key, helpful ? 'helpful' : 'notHelpful', 1);
    await redis.hset(userKey, articleId, helpful ? '1' : '0');

    // Update article ratings periodically
    await this.updateArticleRatings(articleId);
  }

  /**
   * Get articles related to common ticket issues
   */
  async getCommonIssueArticles(): Promise<{
    issue: string;
    articles: KnowledgeArticle[];
  }[]> {
    // Analyze recent tickets to find common issues
    const recentTickets = await prisma.client.ticket.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      select: {
        subject: true,
        categoryId: true,
        tags: true
      },
      take: 1000
    });

    // Group by common themes (simplified version)
    const commonIssues = this.identifyCommonIssues(recentTickets);

    // Get related articles for each issue
    const results = await Promise.all(
      commonIssues.map(async issue => ({
        issue: issue.topic,
        articles: await this.searchSolutions(issue.keywords.join(' '), { limit: 3 })
      }))
    );

    return results as any;
  }

  /**
   * Create auto-response template from resolved tickets
   */
  async generateAutoResponse(
    category: string,
    issueType: string
  ): Promise<string> {
    // Find successfully resolved tickets with high satisfaction
    const resolvedTickets = await prisma.client.ticket.findMany({
      where: {
        categoryId: category,
        status: 'RESOLVED',
        satisfactionRating: { gte: 4 },
        tags: { has: issueType }
      },
      include: {
        messages: {
          where: {
            internal: false
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      take: 10
    });

    if (resolvedTickets.length === 0) {
      return '';
    }

    // Analyze successful resolutions to create template
    // This is a simplified version - in production, you'd use NLP
    const commonPhrases = this.extractCommonPhrases(
      resolvedTickets.flatMap(t => t.messages.map(m => m.content))
    );

    return this.buildResponseTemplate(commonPhrases);
  }

  // Private helper methods

  private async fallbackSearch(
    query: string,
    options?: { category?: string; limit?: number }
  ): Promise<SuggestedSolution[]> {
    // Simple database search fallback
    // In a real implementation, this would search a knowledge_articles table
    return [];
  }

  private extractKeywords(text: string): string[] {
    // Remove common words and extract important terms
    const commonWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
      'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this',
      'it', 'from', 'be', 'are', 'was', 'were', 'been'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));

    // Return unique keywords
    return [...new Set(words)];
  }

  private async updateArticleViewCount(articleId: string, views: number): Promise<void> {
    // Update view count in database
    // In a real implementation, this would update a knowledge_articles table
  }

  private async updateArticleRatings(articleId: string): Promise<void> {
    const key = `kb:ratings:${articleId}`;
    const ratings = await redis.hgetall(key);

    if (ratings) {
      const helpful = parseInt(ratings.helpful || '0');
      const notHelpful = parseInt(ratings.notHelpful || '0');

      // Update in database
      // In a real implementation, this would update a knowledge_articles table
    }
  }

  private identifyCommonIssues(tickets: any[]): Array<{ topic: string; keywords: string[]; count: number }> {
    // Simple keyword frequency analysis
    const keywordMap = new Map<string, number>();

    tickets.forEach(ticket => {
      const keywords = this.extractKeywords(ticket.subject);
      keywords.forEach(keyword => {
        keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
      });
    });

    // Group related keywords into topics
    const topics = Array.from(keywordMap.entries())
      .filter(([_, count]) => count > 5) // Minimum frequency
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({
        topic: keyword,
        keywords: [keyword], // In reality, would cluster related keywords
        count
      }));

    return topics;
  }

  private extractCommonPhrases(messages: string[]): string[] {
    // Extract common response patterns
    // This is simplified - real implementation would use NLP
    const phrases: string[] = [];

    const greetings = [
      'Thank you for contacting us',
      'I understand your concern',
      'I\'d be happy to help'
    ];

    const closings = [
      'Please let me know if you need further assistance',
      'Is there anything else I can help you with',
      'Feel free to reach out if you have any questions'
    ];

    return [...greetings, ...closings];
  }

  private buildResponseTemplate(phrases: string[]): string {
    // Build a response template from common phrases
    return phrases.join('\n\n[Resolution steps here]\n\n');
  }

  /**
   * Index knowledge article for search
   */
  async indexArticle(article: KnowledgeArticle): Promise<void> {
    try {
      await elasticsearchClient.index({
        index: 'knowledge_articles',
        id: article.id,
        body: {
          title: article.title,
          content: article.content,
          category: article.category,
          tags: article.tags,
          viewCount: article.viewCount,
          helpful: article.helpful,
          notHelpful: article.notHelpful,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt
        }
      });

      logger.info('Knowledge article indexed', { articleId: article.id });
    } catch (error) {
      logger.error('Error indexing knowledge article', error as Error);
    }
  }
}