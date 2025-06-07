import { z } from 'zod';
import { usernameSchema } from '@shared/validators';

export class UpdateProfileDTO {
  static schema = z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    displayName: z.string().min(1).max(200).optional(),
    username: usernameSchema.optional(),
    bio: z.string().max(500).optional(),
    website: z.string().url().optional(),
    location: z.string().max(100).optional(),
    metadata: z.record(z.any()).optional()
  });

  firstName?: string;
  lastName?: string;
  displayName?: string;
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  metadata?: Record<string, any>;
}

export class ChangePasswordDTO {
  static schema = z.object({
    currentPassword: z.string(),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  });

  currentPassword!: string;
  newPassword!: string;
}

export class UpdatePreferencesDTO {
  static schema = z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().length(2).optional(),
    timezone: z.string().optional(),
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    marketingEmails: z.boolean().optional(),
    twoFactorEnabled: z.boolean().optional(),
    publicProfile: z.boolean().optional()
  });

  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
  twoFactorEnabled?: boolean;
  publicProfile?: boolean;
}

export class SearchUsersDTO {
  static schema = z.object({
    query: z.string().optional(),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED', 'DELETED']).optional(),
    verified: z.boolean().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
  });

  query?: string;
  role?: string;
  status?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
}

export class DeleteAccountDTO {
  static schema = z.object({
    password: z.string(),
    confirmation: z.literal('DELETE')
  });

  password!: string;
  confirmation!: 'DELETE';
}