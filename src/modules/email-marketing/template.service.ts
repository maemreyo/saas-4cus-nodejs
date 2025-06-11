import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { TenantContextService } from '@modules/tenant/tenant.context';
import { StorageService } from '@shared/services/storage.service';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@shared/exceptions';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  TemplateQueryDto,
  PreviewTemplateDto,
  TemplateVariables
} from './email-marketing.dto';
import { Prisma } from '@prisma/client';
import { EmailMarketingEvents } from './email-marketing.events';
import Handlebars from 'handlebars';
import juice from 'juice';
import { minify } from 'html-minifier-terser';

@Service()
export class TemplateService {
  private handlebars: typeof Handlebars;

  constructor(
    private tenantContext: TenantContextService,
    private storageService: StorageService
  ) {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  /**
   * Create template
   */
  async create(data: CreateTemplateDto): Promise<any> {
    const tenantId = data.tenantId || this.tenantContext.getTenantId();
    if (!tenantId && !data.isPublic) {
      throw new ForbiddenException('Tenant context required for private templates');
    }

    // Validate template syntax
    this.validateTemplate(data.htmlContent);
    if (data.textContent) {
      this.validateTemplate(data.textContent);
    }

    try {
      // Process and optimize HTML
      const processedHtml = await this.processHtmlContent(data.htmlContent);

      const template = await prisma.client.emailTemplate.create({
        data: {
          tenantId: tenantId!,
          name: data.name,
          description: data.description,
          category: data.category,
          subject: data.subject,
          preheader: data.preheader,
          htmlContent: processedHtml,
          textContent: data.textContent || this.generateTextFromHtml(processedHtml),
          variables: data.variables as any,
          thumbnail: data.thumbnail,
          isPublic: data.isPublic || false,
          metadata: data.metadata
        }
      });

      // Generate thumbnail if not provided
      if (!template.thumbnail) {
        await this.generateTemplateThumbnail(template.id);
      }

      await eventBus.emit(EmailMarketingEvents.TEMPLATE_CREATED, {
        templateId: template.id,
        tenantId
      });

      logger.info('Template created', { templateId: template.id, tenantId });

      return template;
    } catch (error) {
      logger.error('Failed to create template', error as Error);
      throw error;
    }
  }

  /**
   * Update template
   */
  async update(templateId: string, data: UpdateTemplateDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();

    const template = await this.findById(templateId);

    // Check ownership for private templates
    if (!template.isPublic && template.tenantId !== tenantId) {
      throw new ForbiddenException('Cannot update template from another tenant');
    }

    // Validate template syntax if content is being updated
    if (data.htmlContent) {
      this.validateTemplate(data.htmlContent);
    }
    if (data.textContent) {
      this.validateTemplate(data.textContent);
    }

    try {
      const updateData: any = {
        name: data.name,
        description: data.description,
        category: data.category,
        subject: data.subject,
        preheader: data.preheader,
        variables: data.variables as any,
        thumbnail: data.thumbnail,
        metadata: data.metadata
      };

      if (data.htmlContent) {
        updateData.htmlContent = await this.processHtmlContent(data.htmlContent);
        if (!data.textContent) {
          updateData.textContent = this.generateTextFromHtml(updateData.htmlContent);
        }
      }

      if (data.textContent) {
        updateData.textContent = data.textContent;
      }

      const updated = await prisma.client.emailTemplate.update({
        where: { id: templateId },
        data: updateData
      });

      // Regenerate thumbnail if content changed
      if (data.htmlContent && !data.thumbnail) {
        await this.generateTemplateThumbnail(templateId);
      }

      await eventBus.emit(EmailMarketingEvents.TEMPLATE_UPDATED, {
        templateId: updated.id,
        tenantId: updated.tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update template', error as Error);
      throw error;
    }
  }

  /**
   * Archive/unarchive template
   */
  async toggleArchive(templateId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();

    const template = await this.findById(templateId);

    if (!template.isPublic && template.tenantId !== tenantId) {
      throw new ForbiddenException('Cannot modify template from another tenant');
    }

    try {
      const updated = await prisma.client.emailTemplate.update({
        where: { id: templateId },
        data: { isArchived: !template.isArchived }
      });

      return updated;
    } catch (error) {
      logger.error('Failed to toggle template archive', error as Error);
      throw error;
    }
  }

  /**
   * Delete template
   */
  async delete(templateId: string): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();

    const template = await this.findById(templateId);

    if (!template.isPublic && template.tenantId !== tenantId) {
      throw new ForbiddenException('Cannot delete template from another tenant');
    }

    // Check if template is used in any active campaigns or automations
    const [campaignsCount, automationsCount] = await Promise.all([
      prisma.client.emailCampaign.count({
        where: {
          templateId,
          status: { in: ['SCHEDULED', 'SENDING'] }
        }
      }),
      prisma.client.emailAutomationStep.count({
        where: {
          templateId,
          automation: { active: true }
        }
      })
    ]);

    if (campaignsCount > 0 || automationsCount > 0) {
      throw new BadRequestException('Cannot delete template in use');
    }

    try {
      await prisma.client.emailTemplate.delete({
        where: { id: templateId }
      });

      await eventBus.emit(EmailMarketingEvents.TEMPLATE_DELETED, {
        templateId,
        tenantId: template.tenantId
      });

      logger.info('Template deleted', { templateId });
    } catch (error) {
      logger.error('Failed to delete template', error as Error);
      throw error;
    }
  }

  /**
   * Find template by ID
   */
  async findById(templateId: string): Promise<any> {
    const template = await prisma.client.emailTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  /**
   * Find templates
   */
  async find(query: TemplateQueryDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();

    const where: Prisma.EmailTemplateWhereInput = {
      OR: [
        { tenantId, isArchived: query.includeArchived ? undefined : false },
        { isPublic: true, isArchived: false }
      ],
      ...(query.category && { category: query.category }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } }
        ]
      })
    };

    const [templates, total] = await Promise.all([
      prisma.client.emailTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit
      }),
      prisma.client.emailTemplate.count({ where })
    ]);

    return {
      templates,
      pagination: {
        total,
        page: Math.floor(query.skip / query.limit) + 1,
        limit: query.limit,
        pages: Math.ceil(total / query.limit)
      }
    };
  }

  /**
   * Find templates by category
   */
  async findByCategory(category: string): Promise<any[]> {
    const tenantId = this.tenantContext.getTenantId();

    return prisma.client.emailTemplate.findMany({
      where: {
        OR: [
          { tenantId, category, isArchived: false },
          { isPublic: true, category, isArchived: false }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get template categories
   */
  async getCategories(): Promise<string[]> {
    const tenantId = this.tenantContext.getTenantId();

    const categories = await prisma.client.emailTemplate.findMany({
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

    return categories
      .map(c => c.category)
      .filter(Boolean) as string[];
  }

  /**
   * Preview template with data
   */
  async preview(templateId: string, data: PreviewTemplateDto): Promise<any> {
    const template = await this.findById(templateId);

    const tenantId = this.tenantContext.getTenantId();
    if (!template.isPublic && template.tenantId !== tenantId) {
      throw new ForbiddenException('Cannot preview template from another tenant');
    }

    try {
      // Merge provided variables with defaults
      const variables = {
        ...this.getDefaultVariables(),
        ...data.variables
      };

      // Render subject
      const subject = this.renderTemplate(template.subject, variables);

      // Render HTML content
      const htmlContent = this.renderTemplate(template.htmlContent, variables);

      // Render text content
      const textContent = template.textContent
        ? this.renderTemplate(template.textContent, variables)
        : this.generateTextFromHtml(htmlContent);

      return {
        subject,
        htmlContent,
        textContent,
        preheader: template.preheader
      };
    } catch (error) {
      logger.error('Failed to preview template', error as Error);
      throw new BadRequestException('Failed to render template: ' + (error as Error).message);
    }
  }

  /**
   * Duplicate template
   */
  async duplicate(templateId: string, name?: string): Promise<any> {
    const template = await this.findById(templateId);
    const tenantId = this.tenantContext.getTenantId();

    if (!template.isPublic && template.tenantId !== tenantId) {
      throw new ForbiddenException('Cannot duplicate template from another tenant');
    }

    const duplicated = await this.create({
      tenantId: tenantId!,
      name: name || `${template.name} (Copy)`,
      description: template.description,
      category: template.category,
      subject: template.subject,
      preheader: template.preheader,
      htmlContent: template.htmlContent,
      textContent: template.textContent,
      variables: template.variables as TemplateVariables,
      isPublic: false
    });

    logger.info('Template duplicated', {
      originalId: templateId,
      duplicatedId: duplicated.id
    });

    return duplicated;
  }

  /**
   * Render template with variables
   */
  renderTemplate(content: string, variables: Record<string, any>): string {
    try {
      const template = this.handlebars.compile(content);
      return template(variables);
    } catch (error) {
      throw new BadRequestException('Template rendering failed: ' + (error as Error).message);
    }
  }

  /**
   * Validate template syntax
   */
  private validateTemplate(content: string): void {
    try {
      this.handlebars.compile(content);
    } catch (error) {
      throw new BadRequestException('Invalid template syntax: ' + (error as Error).message);
    }
  }

  /**
   * Process HTML content
   */
  private async processHtmlContent(html: string): Promise<string> {
    try {
      // Inline CSS
      const inlined = juice(html);

      // Minify HTML for smaller size
      const minified = await minify(inlined, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true
      });

      return minified;
    } catch (error) {
      logger.error('Failed to process HTML content', error as Error);
      return html; // Return original if processing fails
    }
  }

  /**
   * Generate text version from HTML
   */
  private generateTextFromHtml(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  /**
   * Generate template thumbnail
   */
  private async generateTemplateThumbnail(templateId: string): Promise<void> {
    // This would use a service like Puppeteer to generate a screenshot
    // For now, we'll skip the implementation
    logger.info('Template thumbnail generation skipped', { templateId });
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    // Date formatting helper
    this.handlebars.registerHelper('formatDate', (date: Date | string, format: string) => {
      if (!date) return '';
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      // Simple date formatting - in production use date-fns or similar
      return dateObj.toLocaleDateString();
    });

    // Conditional helper
    this.handlebars.registerHelper('ifEquals', function(arg1: any, arg2: any, options: any) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });

    // URL encoding helper
    this.handlebars.registerHelper('urlEncode', (str: string) => {
      return encodeURIComponent(str || '');
    });

    // Default value helper
    this.handlebars.registerHelper('default', (value: any, defaultValue: any) => {
      return value || defaultValue;
    });

    // Capitalize helper
    this.handlebars.registerHelper('capitalize', (str: string) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    // Truncate helper
    this.handlebars.registerHelper('truncate', (str: string, length: number) => {
      if (!str || str.length <= length) return str;
      return str.substring(0, length) + '...';
    });
  }

  /**
   * Get default template variables
   */
  private getDefaultVariables(): Record<string, any> {
    return {
      companyName: process.env.APP_NAME || 'Your Company',
      currentYear: new Date().getFullYear(),
      unsubscribeUrl: '{{unsubscribeUrl}}',
      browserUrl: '{{browserUrl}}',
      profileUrl: '{{profileUrl}}'
    };
  }
}