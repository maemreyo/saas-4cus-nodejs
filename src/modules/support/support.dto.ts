import { z } from 'zod';
import { TicketType, TicketPriority, TicketStatus } from '@prisma/client';
import { paginationSchema } from '@shared/validators';

export class CreateTicketDTO {
  static schema = z.object({
    subject: z.string().min(5).max(255),
    description: z.string().min(10).max(5000),
    type: z.nativeEnum(TicketType).default(TicketType.OTHER),
    priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
    categoryId: z.string().uuid().optional(),
    attachmentIds: z.array(z.string().uuid()).optional(),
    metadata: z.record(z.any()).optional()
  });

  subject!: string;
  description!: string;
  type?: TicketType;
  priority?: TicketPriority;
  categoryId?: string;
  attachmentIds?: string[];
  metadata?: Record<string, any>;
}

export class UpdateTicketDTO {
  static schema = z.object({
    subject: z.string().min(5).max(255).optional(),
    description: z.string().min(10).max(5000).optional(),
    type: z.nativeEnum(TicketType).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    status: z.nativeEnum(TicketStatus).optional(),
    categoryId: z.string().uuid().nullable().optional(),
    assignedToId: z.string().uuid().nullable().optional(),
    tags: z.array(z.string()).optional()
  });

  subject?: string;
  description?: string;
  type?: TicketType;
  priority?: TicketPriority;
  status?: TicketStatus;
  categoryId?: string | null;
  assignedToId?: string | null;
  tags?: string[];
}

export class CreateTicketMessageDTO {
  static schema = z.object({
    content: z.string().min(1).max(5000),
    internal: z.boolean().default(false),
    attachmentIds: z.array(z.string().uuid()).optional()
  });

  content!: string;
  internal?: boolean;
  attachmentIds?: string[];
}

export class UpdateTicketMessageDTO {
  static schema = z.object({
    content: z.string().min(1).max(5000)
  });

  content!: string;
}

export class ListTicketsDTO {
  static schema = paginationSchema.extend({
    status: z.nativeEnum(TicketStatus).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    type: z.nativeEnum(TicketType).optional(),
    categoryId: z.string().uuid().optional(),
    assignedToId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    search: z.string().optional(),
    tags: z.array(z.string()).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    includeDeleted: z.boolean().default(false)
  });

  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  categoryId?: string;
  assignedToId?: string;
  userId?: string;
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  includeDeleted?: boolean;
}

export class AssignTicketDTO {
  static schema = z.object({
    assignedToId: z.string().uuid(),
    message: z.string().optional()
  });

  assignedToId!: string;
  message?: string;
}

export class RateTicketDTO {
  static schema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional()
  });

  rating!: number;
  comment?: string;
}

export class CreateTicketCategoryDTO {
  static schema = z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
    description: z.string().max(500).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    parentId: z.string().uuid().optional(),
    sortOrder: z.number().int().default(0)
  });

  name!: string;
  slug!: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  sortOrder?: number;
}

export class CreateTicketTemplateDTO {
  static schema = z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
    description: z.string().max(500).optional(),
    subject: z.string().min(5).max(255),
    content: z.string().min(10).max(5000),
    categoryId: z.string().uuid().optional(),
    type: z.nativeEnum(TicketType).optional(),
    priority: z.nativeEnum(TicketPriority).optional()
  });

  name!: string;
  slug!: string;
  description?: string;
  subject!: string;
  content!: string;
  categoryId?: string;
  type?: TicketType;
  priority?: TicketPriority;
}

export class CreateTicketTagDTO {
  static schema = z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#6B7280')
  });

  name!: string;
  slug!: string;
  color?: string;
}

export class BulkUpdateTicketsDTO {
  static schema = z.object({
    ticketIds: z.array(z.string().uuid()).min(1),
    updates: z.object({
      status: z.nativeEnum(TicketStatus).optional(),
      priority: z.nativeEnum(TicketPriority).optional(),
      assignedToId: z.string().uuid().nullable().optional(),
      categoryId: z.string().uuid().nullable().optional(),
      tags: z.array(z.string()).optional()
    })
  });

  ticketIds!: string[];
  updates!: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedToId?: string | null;
    categoryId?: string | null;
    tags?: string[];
  };
}

export class TicketStatsQueryDTO {
  static schema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    groupBy: z.enum(['status', 'priority', 'type', 'category', 'agent']).optional(),
    tenantId: z.string().uuid().optional()
  });

  startDate?: string;
  endDate?: string;
  groupBy?: 'status' | 'priority' | 'type' | 'category' | 'agent';
  tenantId?: string;
}

export class SearchTicketsDTO {
  static schema = z.object({
    query: z.string().min(2),
    filters: z.object({
      status: z.array(z.nativeEnum(TicketStatus)).optional(),
      priority: z.array(z.nativeEnum(TicketPriority)).optional(),
      type: z.array(z.nativeEnum(TicketType)).optional(),
      categoryIds: z.array(z.string().uuid()).optional(),
      assignedToIds: z.array(z.string().uuid()).optional(),
      tags: z.array(z.string()).optional()
    }).optional(),
    limit: z.number().int().positive().max(100).default(20),
    offset: z.number().int().min(0).default(0)
  });

  query!: string;
  filters?: any;
  limit?: number;
  offset?: number;
}
