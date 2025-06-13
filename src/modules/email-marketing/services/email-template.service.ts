// Service for managing email templates

import { Injectable } from '@/shared/decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventBus } from '@/shared/events/event-bus';
import { RedisService } from '@/infrastructure/cache/redis.service';
import { StorageService } from '@/shared/services/storage.service';
import { AppError } from '@/shared/exceptions';
import { logger } from '@/shared/logger';
import { EmailTemplate, Prisma } from '@prisma/client';
import { CreateTemplateDTO, UpdateTemplateDTO, TemplateFiltersDTO } from '../dto/email-template.dto';
import * as handlebars from 'handlebars';
import * as htmlMinifier from 'html-minifier-terser';
import juice from 'juice';

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
    private readonly storage: StorageService,
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
        day: 'numeric',
      });
    });

    // Conditional helper
    this.handlebars.registerHelper('ifEquals', function (a: any, b: any, options: any) {
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
  async createTemplate(tenantId: string, data: CreateTemplateDTO): Promise<EmailTemplate> {
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

    const template = await this.prisma.client.emailTemplate.create({
      data: {
        tenant: { connect: { id: tenantId } }, // Use relation instead of direct tenantId
        name: data.name,
        description: data.description || null,
        category: data.category || null,
        subject: data.subject,
        preheader: data.preheader || null,
        htmlContent: processedHtml,
        textContent: data.textContent || null,
        variables: data.variables || this.extractVariables(processedHtml),
        thumbnail: thumbnail || null,
        isPublic: data.isPublic || false,
        metadata: data.metadata || null,
      },
    });

    await this.eventBus.emit('email.template.created', {
      tenantId,
      templateId: template.id,
      name: template.name,
      isPublic: template.isPublic,
    });

    logger.info('Email template created', {
      tenantId,
      templateId: template.id,
    });

    return template;
  }

  /**
   * Update a template
   */
  async updateTemplate(tenantId: string, templateId: string, data: UpdateTemplateDTO): Promise<EmailTemplate> {
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

    const updated = await this.prisma.client.emailTemplate.update({
      where: { id: templateId },
      data: processedData,
    });

    await this.invalidateTemplateCache(templateId);

    await this.eventBus.emit('email.template.updated', {
      tenantId,
      templateId,
      changes: data,
    });

    return updated;
  }

  /**
   * Get template
   */
  async getTemplate(tenantId: string, templateId: string): Promise<TemplateWithUsage> {
    const cacheKey = `email-template:${templateId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const template = await this.prisma.client.emailTemplate.findFirst({
      where: {
        id: templateId,
        OR: [{ tenantId }, { isPublic: true }],
        isArchived: false,
      },
      include: {
        _count: {
          select: {
            campaigns: true,
            automationSteps: true,
          },
        },
      },
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
    filters: TemplateFiltersDTO,
  ): Promise<{
    templates: TemplateWithUsage[];
    total: number;
    page: number;
    pages: number;
  }> {
    const where: Prisma.EmailTemplateWhereInput = {
      OR: [{ tenantId }, { isPublic: true }],
      ...(filters.category && { category: filters.category }),
      ...(filters.isPublic !== undefined && { isPublic: filters.isPublic }),
      ...(filters.isArchived !== undefined && { isArchived: filters.isArchived }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { subject: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [templates, total] = await Promise.all([
      this.prisma.client.emailTemplate.findMany({
        where,
        include: {
          _count: {
            select: {
              campaigns: true,
              automationSteps: true,
            },
          },
        },
        orderBy: {
          [filters.sortBy || 'updatedAt']: filters.sortOrder || 'desc',
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      this.prisma.client.emailTemplate.count({ where }),
    ]);

    return {
      templates,
      total,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    };
  }

  /**
   * Render template with data
   */
  async renderTemplate(
    templateId: string,
    data: Record<string, any>,
    tenantId?: string,
  ): Promise<{
    subject: string;
    html: string;
    text: string;
  }> {
    const template = await this.getTemplate(tenantId || '', templateId);

    // Compile templates
    const subjectTemplate = this.handlebars.compile(template.subject);
    const htmlTemplate = this.handlebars.compile(template.htmlContent);
    const textTemplate = template.textContent ? this.handlebars.compile(template.textContent) : null;

    // Add default variables
    const renderData = {
      ...data,
      currentYear: new Date().getFullYear(),
      companyName: process.env.COMPANY_NAME || 'Company',
      unsubscribeUrl: data.unsubscribeUrl || '{{unsubscribe_url}}',
      preferencesUrl: data.preferencesUrl || '{{preferences_url}}',
      viewInBrowserUrl: data.viewInBrowserUrl || '{{view_in_browser_url}}',
    };

    return {
      subject: subjectTemplate(renderData),
      html: htmlTemplate(renderData),
      text: textTemplate ? textTemplate(renderData) : this.generateTextFromHtml(htmlTemplate(renderData)),
    };
  }

  /**
   * Clone a template
   */
  async cloneTemplate(tenantId: string, templateId: string, name?: string): Promise<EmailTemplate> {
    const original = await this.getTemplate(tenantId, templateId);

    // Extract only the fields needed for CreateTemplateDTO
    const clone = await this.createTemplate(tenantId, {
      name: name || `${original.name} (Copy)`,
      description: original.description || undefined,
      category: original.category || undefined,
      subject: original.subject,
      preheader: original.preheader || undefined,
      htmlContent: original.htmlContent,
      textContent: original.textContent || undefined,
      variables: original.variables as any[] || [],
      thumbnail: original.thumbnail || undefined,
      isPublic: false, // Clones are private by default
      metadata: original.metadata ? JSON.parse(JSON.stringify(original.metadata)) : undefined,
    });

    await this.eventBus.emit('email.template.cloned', {
      tenantId,
      originalId: templateId,
      cloneId: clone.id,
    });

    return clone;
  }

  /**
   * Archive a template
   */
  async archiveTemplate(tenantId: string, templateId: string): Promise<void> {
    const template = await this.getTemplate(tenantId, templateId);

    if (template.tenantId !== tenantId) {
      throw new AppError('Cannot archive public templates', 403);
    }

    // Check if template is in use
    if (template._count && (template._count.campaigns > 0 || template._count.automationSteps > 0)) {
      throw new AppError('Cannot archive template that is in use', 400);
    }

    await this.prisma.client.emailTemplate.update({
      where: { id: templateId },
      data: { isArchived: true },
    });

    await this.invalidateTemplateCache(templateId);

    await this.eventBus.emit('email.template.archived', {
      tenantId,
      templateId,
    });
  }

  /**
   * Delete a template
   */
  async deleteTemplate(tenantId: string, templateId: string): Promise<void> {
    const template = await this.getTemplate(tenantId, templateId);

    if (template.tenantId !== tenantId) {
      throw new AppError('Cannot delete public templates', 403);
    }

    // Check if template is in use
    if (template._count && (template._count.campaigns > 0 || template._count.automationSteps > 0)) {
      throw new AppError('Cannot delete template that is in use', 400);
    }

    await this.prisma.client.emailTemplate.delete({
      where: { id: templateId },
    });

    // Delete thumbnail from storage
    if (template.thumbnail) {
      await this.storage.delete(template.thumbnail);
    }

    await this.invalidateTemplateCache(templateId);

    await this.eventBus.emit('email.template.deleted', {
      tenantId,
      templateId,
    });
  }

  /**
   * Get template categories
   */
  async getCategories(tenantId: string): Promise<string[]> {
    const categories = await this.prisma.client.emailTemplate.findMany({
      where: {
        OR: [{ tenantId }, { isPublic: true }],
        isArchived: false,
        category: { not: null },
      },
      select: { category: true },
      distinct: ['category'],
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
      minifyCSS: true,
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
      required: false,
    }));
  }

  /**
   * Generate template thumbnail
   */
  private async generateThumbnail(html: string): Promise<string | undefined> {
    try {
      // This would use a service like Puppeteer to generate a screenshot
      // For now, we'll just store a data URI placeholder
      const placeholder =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiPlRlbXBsYXRlIFByZXZpZXc8L3RleHQ+PC9zdmc+';
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

  /**
   * Preview template with subscriber data
   */
  async previewTemplate(
    tenantId: string,
    templateId: string,
    subscriberId?: string,
    sampleData: Record<string, any> = {}
  ): Promise<{
    subject: string;
    html: string;
    text: string;
  }> {
    const template = await this.getTemplate(tenantId, templateId);

    let subscriberData = { ...sampleData };

    if (subscriberId) {
      // Get subscriber data for personalization
      const subscriber = await this.prisma.client.emailListSubscriber.findUnique({
        where: { id: subscriberId },
      });

      if (!subscriber) {
        throw new AppError('Subscriber not found', 404);
      }

      // Merge subscriber data with sample data
      subscriberData = {
        ...this.getSubscriberData(subscriber),
        ...sampleData,
      };
    }

    // Render template with data
    return this.renderTemplate(templateId, subscriberData, tenantId);
  }

  /**
   * Get subscriber data for templates
   */
  private getSubscriberData(subscriber: any): Record<string, any> {
    return {
      email: subscriber.email,
      firstName: subscriber.firstName || '',
      lastName: subscriber.lastName || '',
      fullName: [subscriber.firstName, subscriber.lastName]
        .filter(Boolean)
        .join(' ') || subscriber.email,
      ...subscriber.customData as any
    };
  }

  /**
   * Get template usage statistics
   */
  async getTemplateStats(
    tenantId: string,
    templateId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    usageCount: number;
    campaigns: Array<{ id: string; name: string; sentAt: Date }>;
    automations: Array<{ id: string; name: string; active: boolean }>;
    performance: {
      opens: number;
      clicks: number;
      averageOpenRate: number;
      averageClickRate: number;
    }
  }> {
    const template = await this.getTemplate(tenantId, templateId);

    // Set default date range if not provided
    if (!startDate) {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // 1 month ago
    }

    if (!endDate) {
      endDate = new Date();
    }

    // Get campaigns using this template
    const campaigns = await this.prisma.client.emailCampaign.findMany({
      where: {
        tenantId,
        templateId: template.id,
        sentAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        name: true,
        sentAt: true,
        stats: {
          select: {
            openRate: true,
            clickRate: true,
            uniqueOpenCount: true,
            uniqueClickCount: true,
          },
        },
      },
    });

    // Get automations using this template
    const automations = await this.prisma.client.emailAutomation.findMany({
      where: {
        tenantId,
        steps: {
          some: {
            templateId: template.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        active: true,
      },
    });

    // Calculate performance metrics
    let totalOpens = 0;
    let totalClicks = 0;
    let totalOpenRate = 0;
    let totalClickRate = 0;

    campaigns.forEach(campaign => {
      if (campaign.stats) {
        totalOpens += campaign.stats.uniqueOpenCount || 0;
        totalClicks += campaign.stats.uniqueClickCount || 0;
        totalOpenRate += campaign.stats.openRate || 0;
        totalClickRate += campaign.stats.clickRate || 0;
      }
    });

    const campaignCount = campaigns.length;

    return {
      usageCount: campaignCount + automations.length,
      campaigns: campaigns.map(c => ({
        id: c.id,
        name: c.name,
        sentAt: c.sentAt!,
      })),
      automations: automations.map(a => ({
        id: a.id,
        name: a.name,
        active: a.active,
      })),
      performance: {
        opens: totalOpens,
        clicks: totalClicks,
        averageOpenRate: campaignCount > 0 ? totalOpenRate / campaignCount : 0,
        averageClickRate: campaignCount > 0 ? totalClickRate / campaignCount : 0,
      },
    };
  }

  /**
   * Send a test email for a template
   */
  async sendTestTemplate(
    tenantId: string,
    templateId: string,
    recipientEmail: string,
    sampleData: Record<string, any> = {}
  ): Promise<void> {
    const template = await this.getTemplate(tenantId, templateId);

    // Render template with sample data
    const rendered = await this.renderTemplate(templateId, sampleData, tenantId);

    // Get email delivery service
    const emailDeliveryService = await this.getEmailDeliveryService();

    // Send the test email
    await emailDeliveryService.sendMail({
      to: recipientEmail,
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Email Marketing',
        email: process.env.EMAIL_FROM_ADDRESS || 'noreply@example.com',
      },
      subject: `[TEST] ${rendered.subject}`,
      html: rendered.html,
      text: rendered.text,
      isTransactional: true,
    });

    await this.eventBus.emit('email.template.test.sent', {
      tenantId,
      templateId,
      recipientEmail,
    });

    logger.info('Test email sent', {
      templateId,
      recipientEmail,
    });
  }

  /**
   * Get email delivery service
   */
  private async getEmailDeliveryService(): Promise<any> {
    // This would typically be injected, but for now we'll create a simple mock
    return {
      sendMail: async (options: any) => {
        logger.info('Sending test email', { to: options.to });
        // In a real implementation, this would send via SMTP or an email API
        return true;
      },
    };
  }

  /**
   * Export template
   */
  async exportTemplate(
    tenantId: string,
    templateId: string,
    format: 'json' | 'html' = 'json'
  ): Promise<string | object> {
    const template = await this.getTemplate(tenantId, templateId);

    if (format === 'html') {
      return template.htmlContent;
    }

    // Export as JSON
    const { id, tenantId: tid, createdAt, updatedAt, ...exportData } = template;

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import template
   */
  async importTemplate(
    tenantId: string,
    name: string,
    templateData: any
  ): Promise<EmailTemplate> {
    // Validate required fields
    if (!templateData.htmlContent || !templateData.subject) {
      throw new AppError('Template data must include htmlContent and subject', 400);
    }

    // Create new template
    return this.createTemplate(tenantId, {
      name,
      subject: templateData.subject,
      htmlContent: templateData.htmlContent,
      textContent: templateData.textContent,
      description: templateData.description,
      category: templateData.category,
      isPublic: false, // Imported templates are private by default
      variables: templateData.variables,
    });
  }

  /**
   * Get template variables
   */
  async getTemplateVariables(
    tenantId: string,
    templateId: string
  ): Promise<Array<{ name: string; type: string; required: boolean }>> {
    const template = await this.getTemplate(tenantId, templateId);

    // If template has defined variables, return them
    if (template.variables && Array.isArray(template.variables)) {
      return template.variables as any[];
    }

    // Otherwise extract variables from content
    return this.extractVariables(template.htmlContent);
  }
}
