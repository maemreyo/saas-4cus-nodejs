import { z } from 'zod';
import { WebhookDeliveryStatus } from '@prisma/client';

export class CreateWebhookDTO {
  static schema = z.object({
    url: z.string().url(),
    events: z.array(z.string()).min(1),
    description: z.string().max(500).optional(),
    secret: z.string().optional(),
    enabled: z.boolean().optional().default(true),
    headers: z.record(z.string()).optional()
  });

  url!: string;
  events!: string[];
  description?: string;
  secret?: string;
  enabled?: boolean;
  headers?: Record<string, string>;
}

export class UpdateWebhookDTO {
  static schema = CreateWebhookDTO.schema.partial();
}

export class ListWebhooksDTO {
  limit?: number = 50;
  offset?: number = 0;
  event?: string;
}

export class GetWebhookEventsDTO {
  limit?: number = 50;
  offset?: number = 0;
  status?: WebhookDeliveryStatus;
}