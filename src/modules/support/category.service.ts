import { Service } from 'typedi';
import { TicketCategory } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';
import { NotFoundException, ConflictException } from '@shared/exceptions';
import { CreateCategoryDTO } from './ticket.dto';

@Service()
export class CategoryService {
  /**
   * Get all categories
   */
  @Cacheable({ ttl: 3600, namespace: 'ticket:categories' })
  async getCategories(includeInactive: boolean = false): Promise<TicketCategory[]> {
    const where = includeInactive ? {} : { active: true };

    const categories = await prisma.client.ticketCategory.findMany({
      where,
      include: {
        parent: true,
        children: {
          where: includeInactive ? {} : { active: true },
        },
        _count: {
          select: { tickets: true },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    // Build hierarchy
    const rootCategories = categories.filter(cat => !cat.parentId);
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));

    // Attach children to parents
    categories.forEach(cat => {
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        const parent = categoryMap.get(cat.parentId);
        if (parent && !parent.children) {
          parent.children = [];
        }
        if (parent) {
          parent.children.push(cat);
        }
      }
    });

    return rootCategories;
  }

  /**
   * Get category by ID
   */
  async getCategory(categoryId: string): Promise<TicketCategory & { children?: TicketCategory[] }> {
    const category = await prisma.client.ticketCategory.findUnique({
      where: { id: categoryId },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { tickets: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<TicketCategory> {
    const category = await prisma.client.ticketCategory.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /**
   * Create category
   */
  @CacheInvalidate(['ticket:categories'])
  async createCategory(data: CreateCategoryDTO): Promise<TicketCategory> {
    // Check if slug exists
    const existing = await prisma.client.ticketCategory.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ConflictException('Category slug already exists');
    }

    // Validate parent if provided
    if (data.parentId) {
      const parent = await prisma.client.ticketCategory.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }

      // Prevent deep nesting (max 2 levels)
      if (parent.parentId) {
        throw new ConflictException('Cannot create sub-subcategories');
      }
    }

    const category = await prisma.client.ticketCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        parentId: data.parentId,
        order: data.order || 0,
      },
    });

    logger.info('Ticket category created', { categoryId: category.id });

    return category;
  }

  /**
   * Update category
   */
  @CacheInvalidate(['ticket:categories'])
  async updateCategory(
    categoryId: string,
    updates: Partial<CreateCategoryDTO>,
  ): Promise<TicketCategory & { children?: TicketCategory[] }> {
    const category = await this.getCategory(categoryId);

    // Check slug uniqueness if updating
    if (updates.slug && updates.slug !== category.slug) {
      const existing = await prisma.client.ticketCategory.findUnique({
        where: { slug: updates.slug },
      });

      if (existing) {
        throw new ConflictException('Category slug already exists');
      }
    }

    // Validate new parent if changing
    if (updates.parentId !== undefined && updates.parentId !== category.parentId) {
      if (updates.parentId) {
        const parent = await prisma.client.ticketCategory.findUnique({
          where: { id: updates.parentId },
        });

        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }

        // Prevent circular references
        if (parent.parentId === categoryId) {
          throw new ConflictException('Circular reference detected');
        }

        // Prevent deep nesting
        if (parent.parentId) {
          throw new ConflictException('Cannot create sub-subcategories');
        }
      }

      // If this category has children and we're trying to make it a child
      if (updates.parentId && category.children && category.children.length > 0) {
        throw new ConflictException('Cannot make a parent category a child');
      }
    }

    const updatedCategory = await prisma.client.ticketCategory.update({
      where: { id: categoryId },
      data: updates,
      include: {
        parent: true,
        children: true,
        _count: {
          select: { tickets: true },
        },
      },
    });

    logger.info('Ticket category updated', { categoryId });

    return updatedCategory;
  }

  /**
   * Delete category
   */
  @CacheInvalidate(['ticket:categories'])
  async deleteCategory(categoryId: string): Promise<void> {
    const category = await this.getCategory(categoryId);

    // Check if category has tickets
    const ticketCount = await prisma.client.ticket.count({
      where: { categoryId },
    });

    if (ticketCount > 0) {
      throw new ConflictException('Cannot delete category with existing tickets');
    }

    // Check if category has children
    if (category.children && category.children.length > 0) {
      throw new ConflictException('Cannot delete category with subcategories');
    }

    await prisma.client.ticketCategory.delete({
      where: { id: categoryId },
    });

    logger.info('Ticket category deleted', { categoryId });
  }

  /**
   * Toggle category status
   */
  @CacheInvalidate(['ticket:categories'])
  async toggleCategoryStatus(categoryId: string): Promise<TicketCategory> {
    const category = await this.getCategory(categoryId);

    const updatedCategory = await prisma.client.ticketCategory.update({
      where: { id: categoryId },
      data: { active: !category.active },
      include: {
        parent: true,
        children: true,
      },
    });

    logger.info('Ticket category status toggled', {
      categoryId,
      active: updatedCategory.active,
    });

    return updatedCategory;
  }

  /**
   * Reorder categories
   */
  @CacheInvalidate(['ticket:categories'])
  async reorderCategories(categoryOrders: Array<{ id: string; order: number }>): Promise<void> {
    // Update each category's order
    await Promise.all(
      categoryOrders.map(({ id, order }) =>
        prisma.client.ticketCategory.update({
          where: { id },
          data: { order },
        }),
      ),
    );

    logger.info('Ticket categories reordered', {
      count: categoryOrders.length,
    });
  }

  /**
   * Get popular categories
   */
  @Cacheable({ ttl: 3600, namespace: 'ticket:popular-categories' })
  async getPopularCategories(limit: number = 5): Promise<TicketCategory[]> {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const popularCategories = await prisma.client.ticket.groupBy({
      by: ['categoryId'],
      where: {
        categoryId: { not: null },
        createdAt: { gte: last30Days },
        deletedAt: null,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    const categoryIds = popularCategories.filter(cat => cat.categoryId !== null).map(cat => cat.categoryId as string);

    if (categoryIds.length === 0) {
      return [];
    }

    const categories = await prisma.client.ticketCategory.findMany({
      where: {
        id: { in: categoryIds },
        active: true,
      },
    });

    // Sort by popularity
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    return popularCategories
      .map(pop => categoryMap.get(pop.categoryId!))
      .filter(cat => cat !== undefined) as TicketCategory[];
  }
}
