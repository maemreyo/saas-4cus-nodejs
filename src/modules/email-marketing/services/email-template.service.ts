// Service for managing email templates

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { StorageService } from '@/shared/services/storage.service';
import { AppError } from '@/shared/exceptions';
import { logger } from '@/shared/logger';
import {
  EmailTemplate,
  Prisma
} from '@prisma/client';
import {
  CreateTemplateDTO,
  UpdateTemplateDTO,
  TemplateFiltersDTO
} from '../dto/email-template.dto';
import * as handlebars from 'handlebars';
import * as htmlMinifier from 'html-minifier-terser';
import * as juice from 'juice';

export interface TemplateWithUsage extends EmailTemplate {
  _count?: {
    campaigns: number;
    automationSteps: number;
  };
}

@Injectable()
export class EmailTemplateService {
  private handlebars: typeof handlebars;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly redis: RedisService,
    private readonly storage: StorageService
  ) {
    this.handlebars = handlebars.create();
    this.registerHelpers();
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    // Date formatting helper
    this.handlebars.registerHelper('formatDate', (date: Date, format: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    // Conditional helper
    this.handlebars.registerHelper('ifEquals', function(a: any, b: any, options: any) {
      return a === b ? options.fn(this) : options.inverse(this);
    });

    // URL encoding helper
    this.handlebars.registerHelper('urlEncode', (str: string) => {
      return encodeURIComponent(str);
    });

    // Capitalize helper
    this.handlebars.registerHelper('capitalize', (str: string) => {
      return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
    });

    // Default value helper
    this.handlebars.registerHelper('default', (value: any, defaultValue: any) => {
      return value || defaultValue;
    });
  }

  /**
   * Create a new template
   */
  async createTemplate(
    tenantId: string,
    data: CreateTemplateDTO
  ): Promise<EmailTemplate> {
    // Process and optimize HTML content
    const processedHtml = await this.processHtmlContent(data.htmlContent);

    // Generate text content if not provided
    if (!data.textContent) {
      data.textContent = this.generateTextFromHtml(processedHtml);
    }

    // Generate thumbnail if HTML is provided
    let thumbnail: string | undefined;
    if (data.htmlContent) {
      thumbnail = await this.generateThumbnail(processedHtml);
    }

    const template = await this.prisma.emailTemplate.create({
      data: {
        tenantId,
        ...data,
        htmlContent: processedHtml,
        thumbnail,
        variables: data.variables || this.extractVariables(processedHtml)
      }
    });

    await this.eventBus.emit('email.template.created', {
      tenantId,
      templateId: template.id,
      name: template.name,
      isPublic: template.isPublic
    });

    logger.info('Email template created', {
      tenantId,
      templateId: template.id
    });

    return template;
  }

  /**
   * Update a template
   */
  async updateTemplate(
    tenantId: string,
    templateId: string,
    data: UpdateTemplateDTO
  ): Promise<EmailTemplate> {
    const template = await this.getTemplate(tenantId, templateId);

    let processedData: any = { ...data };

    // Process HTML if updated
    if (data.htmlContent) {
      processedData.htmlContent = await this.processHtmlContent(data.htmlContent);

      // Regenerate text content if not provided
      if (!data.textContent) {
        processedData.textContent = this.generateTextFromHtml(processedData.htmlContent);
      }

      // Regenerate thumbnail
      processedData.thumbnail = await this.generateThumbnail(processedData.htmlContent);

      // Extract variables
      processedData.variables = data.variables || this.extractVariables(processedData.htmlContent);
    }

    const updated = await this.prisma.emailTemplate.update({
      where: { id: templateId },
      data: processedData
    });

    await this.invalidateTemplateCache(templateId);

    await this.eventBus.emit('email.template.updated', {
      tenantId,
      templateId,
      changes: data
    });

    return updated;
  }

  /**
   * Get template
   */
  async getTemplate(
    tenantId: string,
    templateId: string
  ): Promise<TemplateWithUsage> {
    const cacheKey = `email-template:${templateId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const template = await this.prisma.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [
          { tenantId },
          { isPublic: true }
        ],
        isArchived: false
      },
      include: {
        _count: {
          select: {
            campaigns: true,
            automationSteps: true
          }
        }
      }
    });

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    await this.redis.set(cacheKey, template, { ttl: 300 });

    return template;
  }

  /**
   * List templates with filters
   */
  async listTemplates(
    tenantId: string,
    filters: TemplateFiltersDTO
  ): Promise<{
    templates: TemplateWithUsage[];
    total: number;
    page: number;
    pages: number;
  }> {
    const where: Prisma.EmailTemplateWhereInput = {
      OR: [
        { tenantId },
        { isPublic: true }
      ],
      ...(filters.category && { category: filters.category }),
      ...(filters.isPublic !== undefined && { isPublic: filters.isPublic }),
      ...(filters.isArchived !== undefined && { isArchived: filters.isArchived }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { subject: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    };

    const [templates, total] = await Promise.all([
      this.prisma.emailTemplate.findMany({
        where,
        include: {
          _count: {
            select: {
              campaigns: true,
              automationSteps: true
            }
          }
        },
        orderBy: {
          [filters.sortBy || 'updatedAt']: filters.sortOrder || 'desc'
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit
      }),
      this.prisma.emailTemplate.count({ where })
    ]);

    return {
      templates,
      total,
      page: filters.page,
      pages: Math.ceil(total / filters.limit)
    };
  }

  /**
   * Render template with data
   */
  async renderTemplate(
    templateId: string,
    data: Record<string, any>,
    tenantId?: string
  ): Promise<{
    subject: string;
    html: string;
    text: string;
  }> {
    const template = await this.getTemplate(tenantId || '', templateId);

    // Compile templates
    const subjectTemplate = this.handlebars.compile(template.subject);
    const htmlTemplate = this.handlebars.compile(template.htmlContent);
    const textTemplate = template.textContent
      ? this.handlebars.compile(template.textContent)
      : null;

    // Add default variables
    const renderData = {
      ...data,
      currentYear: new Date().getFullYear(),
      companyName: process.env.COMPANY_NAME || 'Company',
      unsubscribeUrl: data.unsubscribeUrl || '{{unsubscribe_url}}',
      preferencesUrl: data.preferencesUrl || '{{preferences_url}}',
      viewInBrowserUrl: data.viewInBrowserUrl || '{{view_in_browser_url}}'
    };

    return {
      subject: subjectTemplate(renderData),
      html: htmlTemplate(renderData),
      text: textTemplate ? textTemplate(renderData) : this.generateTextFromHtml(htmlTemplate(renderData))
    };
  }

  /**
   * Clone a template
   */
  async cloneTemplate(
    tenantId: string,
    templateId: string,
    name?: string
  ): Promise<EmailTemplate> {
    const original = await this.getTemplate(tenantId, templateId);

    const { id, createdAt, updatedAt, ...templateData } = original;

    const clone = await this.createTemplate(tenantId, {
      ...templateData,
      name: name || `${original.name} (Copy)`,
      isPublic: false // Clones are private by default
    });

    await this.eventBus.emit('email.template.cloned', {
      tenantId,
      originalId: templateId,
      cloneId: clone.id
    });

    return clone;
  }

  /**
   * Archive a template
   */
  async archiveTemplate(
    tenantId: string,
    templateId: string
  ): Promise<void> {
    const template = await this.getTemplate(tenantId, templateId);

    if (template.tenantId !== tenantId) {
      throw new AppError('Cannot archive public templates', 403);
    }

    // Check if template is in use
    if (template._count && (template._count.campaigns > 0 || template._count.automationSteps > 0)) {
      throw new AppError('Cannot archive template that is in use', 400);
    }

    await this.prisma.emailTemplate.update({
      where: { id: templateId },
      data: { isArchived: true }
    });

    await this.invalidateTemplateCache(templateId);

    await this.eventBus.emit('email.template.archived', {
      tenantId,
      templateId
    });
  }

  /**
   * Delete a template
   */
  async deleteTemplate(
    tenantId: string,
    templateId: string
  ): Promise<void> {
    const template = await this.getTemplate(tenantId, templateId);

    if (template.tenantId !== tenantId) {
      throw new AppError('Cannot delete public templates', 403);
    }

    // Check if template is in use
    if (template._count && (template._count.campaigns > 0 || template._count.automationSteps > 0)) {
      throw new AppError('Cannot delete template that is in use', 400);
    }

    await this.prisma.emailTemplate.delete({
      where: { id: templateId }
    });

    // Delete thumbnail from storage
    if (template.thumbnail) {
      await this.storage.delete(template.thumbnail);
    }

    await this.invalidateTemplateCache(templateId);

    await this.eventBus.emit('email.template.deleted', {
      tenantId,
      templateId
    });
  }

  /**
   * Get template categories
   */
  async getCategories(tenantId: string): Promise<string[]> {
    const categories = await this.prisma.emailTemplate.findMany({
      where: {
        OR: [
          { tenantId },
          { isPublic: true }
        ],
        isArchived: false,
        category: { not: null }
      },
      select: { category: true },
      distinct: ['category']
    });

    return categories.map(c => c.category!).filter(Boolean);
  }

  /**
   * Process HTML content
   */
  private async processHtmlContent(html: string): Promise<string> {
    // Inline CSS
    const inlined = juice(html);

    // Minify HTML
    const minified = htmlMinifier.minify(inlined, {
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: false, // Keep optional tags for email clients
      minifyCSS: true
    });

    return minified;
  }

  /**
   * Generate text content from HTML
   */
  private generateTextFromHtml(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract template variables
   */
  private extractVariables(content: string): any[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = regex.exec(content)) !== null) {
      const variable = match[1].trim();
      // Skip helper expressions
      if (!variable.includes('(') && !variable.includes(' ')) {
        variables.add(variable);
      }
    }

    return Array.from(variables).map(name => ({
      name,
      type: 'text',
      required: false
    }));
  }

  /**
   * Generate template thumbnail
   */
  private async generateThumbnail(html: string): Promise<string | undefined> {
    try {
      // This would use a service like Puppeteer to generate a screenshot
      // For now, we'll just store a data URI placeholder
      const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiPlRlbXBsYXRlIFByZXZpZXc8L3RleHQ+PC9zdmc+';
      return placeholder;
    } catch (error) {
      logger.error('Failed to generate template thumbnail', { error });
      return undefined;
    }
  }

  /**
   * Invalidate template cache
   */
  private async invalidateTemplateCache(templateId: string): Promise<void> {
    await this.redis.delete(`email-template:${templateId}`);
  }
}
