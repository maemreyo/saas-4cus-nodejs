import { z } from 'zod';
import { TicketType, TicketPriority, TicketStatus } from '@prisma/client';

export class CreateTicketDTO {
  static schema = z.object({
    subject: z.string().min(5).max(255),
    description: z.string().min(10).max(5000),
    type: z.nativeEnum(TicketType).default(TicketType.GENERAL_INQUIRY),
    priority: z.nativeEnum(TicketPriority).optional(),
    categoryId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    attachments: z.array(z.string()).optional()
  });

  subject!: string;
  description!: string;
  type?: TicketType;
  priority?: TicketPriority;
  categoryId?: string;
  tags?: string[];
  attachments?: string[];
}

export class UpdateTicketDTO {
  static schema = z.object({
    subject: z.string().min(5).max(255).optional(),
    description: z.string().min(10).max(5000).optional(),
    type: z.nativeEnum(TicketType).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    status: z.nativeEnum(TicketStatus).optional(),
    categoryId: z.string().optional(),
    tags: z.array(z.string()).optional()
  });

  subject?: string;
  description?: string;
  type?: TicketType;
  priority?: TicketPriority;
  status?: TicketStatus;
  categoryId?: string;
  tags?: string[];
}

export class CreateMessageDTO {
  static schema = z.object({
    content: z.string().min(1).max(10000),
    attachments: z.array(z.string()).optional(),
    internal: z.boolean().optional().default(false)
  });

  content!: string;
  attachments?: string[];
  internal?: boolean;
}

export class AssignTicketDTO {
  static schema = z.object({
    assigneeId: z.string().uuid()
  });

  assigneeId!: string;
}

export class RateTicketDTO {
  static schema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional()
  });

  rating!: number;
  comment?: string;
}

export class ListTicketsDTO {
  page?: number = 1;
  limit?: number = 20;
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  categoryId?: string;
  assigneeId?: string;
  userId?: string;
  tenantId?: string;
  search?: string;
  sort?: 'createdAt' | 'updatedAt' | 'priority' | 'status';
  order?: 'asc' | 'desc' = 'desc';
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}

export class CreateCategoryDTO {
  static schema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
    description: z.string().max(500).optional(),
    icon: z.string().max(50).optional(),
    parentId: z.string().optional(),
    order: z.number().int().optional()
  });

  name!: string;
  slug!: string;
  description?: string;
  icon?: string;
  parentId?: string;
  order?: number;
}

export class CreateTemplateDTO {
  static schema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    subject: z.string().min(1).max(255),
    content: z.string().min(1).max(5000),
    category: z.string().optional(),
    tags: z.array(z.string()).optional()
  });

  name!: string;
  description?: string;
  subject!: string;
  content!: string;
  category?: string;
  tags?: string[];
}

export class BulkUpdateTicketsDTO {
  static schema = z.object({
    ticketIds: z.array(z.string()).min(1),
    updates: z.object({
      status: z.nativeEnum(TicketStatus).optional(),
      priority: z.nativeEnum(TicketPriority).optional(),
      assigneeId: z.string().optional(),
      categoryId: z.string().optional(),
      tags: z.array(z.string()).optional()
    })
  });

  ticketIds!: string[];
  updates!: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assigneeId?: string;
    categoryId?: string;
    tags?: string[];
  };
}