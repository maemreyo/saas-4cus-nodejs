// New file - Template service for email templates

import { Service } from 'typedi';
import { prisma } from '@infrastructure/database/prisma.service';
import { logger } from '@shared/logger';
import { eventBus } from '@shared/events/event-bus';
import { TenantContextService } from '@modules/tenant/tenant.context';
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
import { JSDOM } from 'jsdom';
import DOMPurify from 'isomorphic-dompurify';

@Service()
export class TemplateService {
  private handlebars: typeof Handlebars;

  constructor(
    private tenantContext: TenantContextService
  ) {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  /**
   * Create a new template
   */
  async create(data: CreateTemplateDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    try {
      // Validate and sanitize HTML
      const sanitizedHtml = this.sanitizeHtml(data.htmlContent);

      // Generate text version if not provided
      const textContent = data.textContent || this.htmlToText(sanitizedHtml);

      // Generate thumbnail
      const thumbnail = await this.generateThumbnail(sanitizedHtml);

      const template = await prisma.client.emailTemplate.create({
        data: {
          tenantId,
          name: data.name,
          description: data.description,
          category: data.category,
          subject: data.subject,
          preheader: data.preheader,
          htmlContent: sanitizedHtml,
          textContent,
          variables: data.variables,
          thumbnail,
          isPublic: data.isPublic ?? false,
          metadata: data.metadata
        }
      });

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
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(templateId);

    try {
      const updateData: any = {
        name: data.name,
        description: data.description,
        category: data.category,
        subject: data.subject,
        preheader: data.preheader,
        variables: data.variables,
        isPublic: data.isPublic,
        metadata: data.metadata
      };

      // Update HTML if provided
      if (data.htmlContent) {
        updateData.htmlContent = this.sanitizeHtml(data.htmlContent);
        updateData.textContent = data.textContent || this.htmlToText(updateData.htmlContent);
        updateData.thumbnail = await this.generateThumbnail(updateData.htmlContent);
      } else if (data.textContent) {
        updateData.textContent = data.textContent;
      }

      const updated = await prisma.client.emailTemplate.update({
        where: { id: templateId },
        data: updateData
      });

      await eventBus.emit(EmailMarketingEvents.TEMPLATE_UPDATED, {
        templateId: updated.id,
        tenantId
      });

      return updated;
    } catch (error) {
      logger.error('Failed to update template', error as Error);
      throw error;
    }
  }

  /**
   * Delete template
   */
  async delete(templateId: string): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    await this.findById(templateId);

    // Check if template is used in any campaigns
    const campaignsUsingTemplate = await prisma.client.emailCampaign.count({
      where: {
        templateId,
        status: {
          in: ['SCHEDULED', 'SENDING']
        }
      }
    });

    if (campaignsUsingTemplate > 0) {
      throw new BadRequestException('Cannot delete template used in active campaigns');
    }

    try {
      await prisma.client.emailTemplate.update({
        where: { id: templateId },
        data: { isArchived: true }
      });

      await eventBus.emit(EmailMarketingEvents.TEMPLATE_DELETED, {
        templateId,
        tenantId
      });

      logger.info('Template archived', { templateId });
    } catch (error) {
      logger.error('Failed to delete template', error as Error);
      throw error;
    }
  }

  /**
   * Get template by ID
   */
  async findById(templateId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const template = await prisma.client.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [
          { tenantId },
          { isPublic: true }
        ],
        isArchived: false
      }
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  /**
   * Find templates with filtering
   */
  async find(query: TemplateQueryDto): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const where: Prisma.EmailTemplateWhereInput = {
      isArchived: query.includeArchived ? undefined : false,
      ...(query.category && { category: query.category }),
      ...(query.isPublic !== undefined && { isPublic: query.isPublic }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { subject: { contains: query.search, mode: 'insensitive' } }
        ]
      })
    };

    // Include tenant templates and public templates
    if (!query.isPublic) {
      where.OR = [
        { tenantId },
        { isPublic: true }
      ];
    } else {
      where.isPublic = true;
    }

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
   * Preview template with variables
   */
  async preview(templateId: string, data: PreviewTemplateDto): Promise<any> {
    const template = await this.findById(templateId);

    try {
      // Merge provided variables with template defaults
      const variables = {
        ...template.variables,
        ...data.variables
      };

      // Compile and render
      const subject = this.compile(template.subject, variables);
      const htmlContent = this.compile(template.htmlContent, variables);
      const textContent = this.compile(template.textContent, variables);

      return {
        subject,
        htmlContent,
        textContent,
        variables
      };
    } catch (error) {
      logger.error('Failed to preview template', error as Error);
      throw new BadRequestException('Failed to render template');
    }
  }

  /**
   * Duplicate template
   */
  async duplicate(templateId: string): Promise<any> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

    const template = await this.findById(templateId);

    const duplicatedData = {
      ...template,
      id: undefined,
      name: `${template.name} (Copy)`,
      isPublic: false,
      createdAt: undefined,
      updatedAt: undefined
    };

    return this.create(duplicatedData);
  }

  /**
   * Get template categories
   */
  async getCategories(): Promise<string[]> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new ForbiddenException('Tenant context required');

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
   * Compile template with variables
   */
  compile(template: string, variables: TemplateVariables): string {
    try {
      const compiledTemplate = this.handlebars.compile(template);
      return compiledTemplate(variables);
    } catch (error) {
      logger.error('Failed to compile template', error as Error);
      throw new BadRequestException('Invalid template syntax');
    }
  }

  /**
   * Sanitize HTML content
   */
  private sanitizeHtml(html: string): string {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);

    // Allow email-specific attributes
    purify.addHook('uponSanitizeAttribute', (node, data) => {
      if (data.attrName === 'style' || data.attrName === 'bgcolor' || data.attrName === 'align') {
        data.forceKeepAttr = true;
      }
    });

    const clean = purify.sanitize(html, {
      WHOLE_DOCUMENT: false,
      ALLOWED_TAGS: [
        'a', 'b', 'br', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'i', 'img', 'li', 'ol', 'p', 'span', 'strong', 'table', 'tbody',
        'td', 'th', 'thead', 'tr', 'u', 'ul', 'center', 'font'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'style', 'class', 'id', 'width', 'height',
        'align', 'valign', 'bgcolor', 'color', 'size', 'face', 'cellpadding',
        'cellspacing', 'border'
      ]
    });

    // Inline CSS for better email client support
    return juice(clean);
  }

  /**
   * Convert HTML to plain text
   */
  private htmlToText(html: string): string {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());

    // Get text content
    let text = document.body.textContent || '';

    // Clean up whitespace
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    return text;
  }

  /**
   * Generate template thumbnail
   */
  private async generateThumbnail(html: string): Promise<string> {
    // For now, return a placeholder
    // In production, this could use a headless browser to generate actual thumbnails
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y0ZjRmNCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkVtYWlsIFRlbXBsYXRlPC90ZXh0Pgo8L3N2Zz4=';
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    // Date formatting helper
    this.handlebars.registerHelper('formatDate', (date: Date | string, format: string) => {
      const d = new Date(date);
      // Simple date formatting - in production, use a proper date library
      return d.toLocaleDateString();
    });

    // Conditional helper
    this.handlebars.registerHelper('ifEquals', function(arg1: any, arg2: any, options: any) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });

    // URL encoding helper
    this.handlebars.registerHelper('encodeUrl', (url: string) => {
      return encodeURIComponent(url);
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

    // Currency helper
    this.handlebars.registerHelper('currency', (amount: number, currency = 'USD') => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(amount);
    });
  }
}