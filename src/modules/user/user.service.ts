import { Service } from 'typedi';
import { User, Session, UserRole } from '@prisma/client';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { logger } from '@shared/logger';
import { EventBus } from '@shared/events/event-bus';
import { NotFoundException, BadRequestException, UnauthorizedException, ConflictException } from '@shared/exceptions';
import { hashPassword, verifyPassword } from '@shared/utils/crypto';
import { Cacheable, CacheInvalidate } from '@infrastructure/cache/redis.service';
import { AuditService } from '@shared/services/audit.service';
import { storageService } from '@/shared/services/storage.service';

export interface UpdateProfileOptions {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  metadata?: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  publicProfile: boolean;
}

export interface SearchUsersOptions {
  query?: string;
  role?: string;
  status?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
}

@Service()
export class UserService {
  constructor(
    private eventBus: EventBus,
    private auditService: AuditService,
  ) {}

  /**
   * Get user by ID
   */
  @Cacheable({ ttl: 300, namespace: 'users' })
  async getUserById(userId: string): Promise<User> {
    const user = await prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.client.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<User | null> {
    return prisma.client.user.findUnique({
      where: { username },
    });
  }

  /**
   * Update user profile
   */
  @CacheInvalidate(['users'])
  async updateProfile(userId: string, options: UpdateProfileOptions): Promise<User> {
    const user = await this.getUserById(userId);

    // Check username uniqueness if changing
    if (options.username && options.username !== user.username) {
      const existing = await this.getUserByUsername(options.username);
      if (existing) {
        throw new ConflictException('Username already taken');
      }
    }

    const oldValues = {
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      username: user.username,
      bio: user.bio,
    };

    // Merge metadata
    const updatedMetadata = {
      ...((user.metadata as any) || {}),
      ...(options.website && { website: options.website }),
      ...(options.location && { location: options.location }),
    };

    const updatedUser = await prisma.client.user.update({
      where: { id: userId },
      data: {
        firstName: options.firstName,
        lastName: options.lastName,
        username: options.username,
        bio: options.bio,
        displayName:
          options.displayName || `${options.firstName || user.firstName} ${options.lastName || user.lastName}`.trim(),
        metadata: updatedMetadata,
      },
    });

    // Audit log
    await this.auditService.log({
      userId,
      action: 'user.profile.updated',
      entity: 'User',
      entityId: userId,
      oldValues,
      newValues: options,
    });

    logger.info('User profile updated', { userId });

    await this.eventBus.emit('user.updated', {
      userId,
      changes: options,
      timestamp: new Date(),
    });

    return updatedUser;
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId);

    if (!user.password) {
      throw new BadRequestException('Password change not allowed for OAuth users');
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    await prisma.client.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate all sessions except current
    await this.invalidateUserSessions(userId);

    // Audit log
    await this.auditService.log({
      userId,
      action: 'user.password.changed',
      entity: 'User',
      entityId: userId,
    });

    logger.info('User password changed', { userId });

    await this.eventBus.emit('user.passwordChanged', {
      userId,
      timestamp: new Date(),
    });
  }

  /**
   * Update user preferences
   */
  @CacheInvalidate(['users'])
  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const user = await this.getUserById(userId);

    const currentPreferences = (user.preferences as any) || {};
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
    };

    await prisma.client.user.update({
      where: { id: userId },
      data: {
        preferences: updatedPreferences,
      },
    });

    logger.info('User preferences updated', { userId });

    return updatedPreferences;
  }

  /**
   * Get public profile
   */
  async getPublicProfile(userId: string): Promise<Partial<User>> {
    const user = await this.getUserById(userId);

    // Check if profile is public
    const preferences = (user.preferences as any) || {};
    if (!preferences.publicProfile && user.role !== 'ADMIN') {
      throw new NotFoundException('User profile is private');
    }

    const metadata = (user.metadata as any) || {};

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      // Include metadata fields
      ...(metadata.website && { website: metadata.website }),
      ...(metadata.location && { location: metadata.location }),
    };
  }

  /**
   * Search users
   */
  async searchUsers(options: SearchUsersOptions) {
    const { query, role, status, verified, page = 1, limit = 20 } = options;

    const where: any = {};

    if (query) {
      where.OR = [
        { email: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role as UserRole;
    }

    if (status) {
      where.status = status;
    }

    if (verified !== undefined) {
      where.emailVerified = verified;
    }

    const [users, total] = await Promise.all([
      prisma.client.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.client.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
}

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId: string, file: any): Promise<string> {
    const user = await this.getUserById(userId);

    // Validate file
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    const buffer = await file.toBuffer();
    if (buffer.length > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Delete old avatar if exists
    if (user.avatar) {
      try {
        const oldKey = user.avatar.split('/').pop();
        if (oldKey) {
          await storageService.delete(oldKey);
        }
      } catch (error) {
        logger.error('Failed to delete old avatar', error as Error);
      }
    }

    // Upload new avatar
    const filename = `avatars/${userId}-${Date.now()}.${file.mimetype.split('/')[1]}`;
    const result = await storageService.upload({
      buffer,
      filename,
      mimeType: file.mimetype,
      path: 'avatars',
    });

    // Update user
    await prisma.client.user.update({
      where: { id: userId },
      data: { avatar: result.url },
    });

    // Clear cache
    await redis.delete(`users:${userId}`);

    logger.info('User avatar uploaded', { userId, filename });

    return result.url;
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await this.getUserById(userId);

    // Verify password
    if (user.password) {
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    // Soft delete
    await prisma.client.user.update({
      where: { id: userId },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
        email: `deleted_${Date.now()}_${user.email}`,
        username: user.username ? `deleted_${Date.now()}_${user.username}` : null,
      },
    });

    // Invalidate all sessions
    await this.invalidateUserSessions(userId);

    // Clear cache
    await redis.delete(`users:${userId}`);

    // Audit log
    await this.auditService.log({
      userId,
      action: 'user.account.deleted',
      entity: 'User',
      entityId: userId,
    });

    logger.info('User account deleted', { userId });

    await this.eventBus.emit('user.deleted', {
      userId,
      timestamp: new Date(),
    });
  }

  /**
   * Get user activity
   */
  async getUserActivity(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [loginHistory, apiUsage, actions] = await Promise.all([
      // Login history
      prisma.client.auditLog.findMany({
        where: {
          userId,
          action: { in: ['user.login', 'user.logout'] },
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),

      // API usage
      prisma.client.apiUsage.groupBy({
        by: ['createdAt'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // User actions
      this.auditService.getUserActivity(userId, days),
    ]);

    return {
      loginHistory,
      apiUsage,
      actions,
    };
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    return prisma.client.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Revoke session
   */
  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await prisma.client.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await prisma.client.session.delete({
      where: { id: sessionId },
    });

    // Clear from cache
    await redis.delete(`session:${sessionId}`);

    logger.info('Session revoked', { userId, sessionId });
  }

  /**
   * Invalidate all user sessions
   */
  private async invalidateUserSessions(userId: string): Promise<void> {
    const sessions = await prisma.client.session.findMany({
      where: { userId },
    });

    // Delete from database
    await prisma.client.session.deleteMany({
      where: { userId },
    });

    // Clear from cache
    for (const session of sessions) {
      await redis.delete(`session:${session.id}`);
    }
  }
}
