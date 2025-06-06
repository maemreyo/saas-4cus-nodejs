import { Service } from 'typedi';
import { TicketTemplate } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';
import { NotFoundException } from '@shared/exceptions';
import { CreateTemplateDTO } from './ticket.dto';

@Service()
export class TemplateService {
  /**
   * Get all templates
   */
  @Cacheable({ ttl: 3600, namespace: 'ticket:templates' })
  async getTemplates(
    options?: {
      category?: string;
      active?: boolean;
    }
  ): Promise<TicketTemplate[]> {
    const where: any = {};

    if (options?.category) {
      where.category = options.category;
    }

    if (options?.active !== undefined) {
      where.active = options.active;
    }

    const templates = await prisma.client.ticketTemplate.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    return templates;
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<TicketTemplate> {
    const template = await prisma.client.ticketTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  /**
   * Create template
   */
  @CacheInvalidate(['ticket:templates'])
  async createTemplate(data: CreateTemplateDTO): Promise<TicketTemplate> {
    const template = await prisma.client.ticketTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        subject: data.subject,
        content: data.content,
        category: data.category,
        tags: data.tags || []
      }
    });

    logger.info('Ticket template created', { templateId: template.id });

    return template;
  }

  /**
   * Update template
   */
  @CacheInvalidate(['ticket:templates'])
  async updateTemplate(
    templateId: string,
    updates: Partial<CreateTemplateDTO>
  ): Promise<TicketTemplate> {
    const template = await this.getTemplate(templateId);

    const updatedTemplate = await prisma.client.ticketTemplate.update({
      where: { id: templateId },
      data: updates
    });

    logger.info('Ticket template updated', { templateId });

    return updatedTemplate;
  }

  /**
   * Delete template
   */
  @CacheInvalidate(['ticket:templates'])
  async deleteTemplate(templateId: string): Promise<void> {
    await this.getTemplate(templateId);

    await prisma.client.ticketTemplate.delete({
      where: { id: templateId }
    });

    logger.info('Ticket template deleted', { templateId });
  }

  /**
   * Toggle template status
   */
  @CacheInvalidate(['ticket:templates'])
  async toggleTemplateStatus(templateId: string): Promise<TicketTemplate> {
    const template = await this.getTemplate(templateId);

    const updatedTemplate = await prisma.client.ticketTemplate.update({
      where: { id: templateId },
      data: { active: !template.active }
    });

    logger.info('Ticket template status toggled', {
      templateId,
      active: updatedTemplate.active
    });

    return updatedTemplate;
  }

  /**
   * Get frequently used templates
   */
  @Cacheable({ ttl: 3600, namespace: 'ticket:frequent-templates' })
  async getFrequentTemplates(
    limit: number = 5,
    userId?: string
  ): Promise<TicketTemplate[]> {
    // This would track template usage in a real implementation
    // For now, return the most recent active templates
    const templates = await prisma.client.ticketTemplate.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return templates;
  }

  /**
   * Apply template variables
   */
  applyTemplateVariables(
    template: TicketTemplate,
    variables: Record<string, string>
  ): {
    subject: string;
    content: string;
  } {
    let subject = template.subject;
    let content = template.content;

    // Replace variables in format {{variableName}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value);
      content = content.replace(regex, value);
    });

    return { subject, content };
  }

  /**
   * Duplicate template
   */
  @CacheInvalidate(['ticket:templates'])
  async duplicateTemplate(templateId: string): Promise<TicketTemplate> {
    const original = await this.getTemplate(templateId);

    const duplicate = await prisma.client.ticketTemplate.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        subject: original.subject,
        content: original.content,
        category: original.category,
        tags: original.tags,
        active: false // Start as inactive
      }
    });

    logger.info('Ticket template duplicated', {
      originalId: templateId,
      duplicateId: duplicate.id
    });

    return duplicate;
  }
}