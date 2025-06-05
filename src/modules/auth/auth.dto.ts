import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema } from '@shared/validators';

export class RegisterDTO {
  static schema = z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    username: usernameSchema.optional(),
  });

  email!: string;
  password!: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export class LoginDTO {
  static schema = z.object({
    email: emailSchema,
    password: z.string(),
    twoFactorCode: z.string().length(6).optional(),
  });

  email!: string;
  password!: string;
  twoFactorCode?: string;
  ip?: string;
}

export class RefreshTokenDTO {
  static schema = z.object({
    refreshToken: z.string(),
  });

  refreshToken!: string;
}

export class ResetPasswordRequestDTO {
  static schema = z.object({
    email: emailSchema,
  });

  email!: string;
}

export class ResetPasswordDTO {
  static schema = z.object({
    token: z.string(),
    password: passwordSchema,
  });

  token!: string;
  password!: string;
}

export class Enable2FADTO {
  static schema = z.object({});
}

export class Verify2FADTO {
  static schema = z.object({
    code: z.string().length(6),
  });

  code!: string;
}
