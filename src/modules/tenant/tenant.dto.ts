import { z } from 'zod';
import { TenantMemberRole } from '@prisma/client';

export class CreateTenantDTO {
  static schema = z.object({
    name: z.string().min(1).max(255),
    slug: z
      .string()
      .min(3)
      .max(100)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    description: z.string().max(500).optional(),
    logo: z.string().url().optional(),
  });

  name!: string;
  slug?: string;
  description?: string;
  logo?: string;
}

export class UpdateTenantDTO {
  static schema = z.object({
    name: z.string().min(1).max(255).optional(),
    slug: z
      .string()
      .min(3)
      .max(100)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    description: z.string().max(500).optional(),
    logo: z.string().url().optional(),
    settings: z.record(z.any()).optional(),
  });

  name?: string;
  slug?: string;
  description?: string;
  logo?: string;
  settings?: Record<string, any>;
}

export class InviteMemberDTO {
  static schema = z.object({
    email: z.string().email(),
    role: z.nativeEnum(TenantMemberRole).optional().default(TenantMemberRole.MEMBER),
    sendEmail: z.boolean().optional().default(true),
  });

  email!: string;
  role?: TenantMemberRole;
  sendEmail?: boolean;
}

export class UpdateMemberRoleDTO {
  static schema = z.object({
    role: z.nativeEnum(TenantMemberRole),
  });

  role!: TenantMemberRole;
}

export class TransferOwnershipDTO {
  static schema = z.object({
    newOwnerId: z.string().uuid(),
  });

  newOwnerId!: string;
}
