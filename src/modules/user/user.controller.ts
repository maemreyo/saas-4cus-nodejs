import { FastifyRequest, FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { UserService } from './user.service';
import { validateSchema } from '@shared/validators';
import {
  UpdateProfileDTO,
  ChangePasswordDTO,
  UpdatePreferencesDTO,
  SearchUsersDTO
} from './user.dto';

@Service()
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get current user profile
   */
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const user = await this.userService.getUserById(userId);

    reply.send({
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          role: user.role,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
          preferences: user.preferences,
          metadata: user.metadata
        }
      }
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(
    request: FastifyRequest<{ Body: UpdateProfileDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(UpdateProfileDTO.schema, request.body);
    const userId = request.customUser!.id;

    const user = await this.userService.updateProfile(userId, dto);

    reply.send({
      message: 'Profile updated successfully',
      data: { user }
    });
  }

  /**
   * Change password
   */
  async changePassword(
    request: FastifyRequest<{ Body: ChangePasswordDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(ChangePasswordDTO.schema, request.body);
    const userId = request.customUser!.id;

    await this.userService.changePassword(userId, dto.currentPassword, dto.newPassword);

    reply.send({
      message: 'Password changed successfully'
    });
  }

  /**
   * Update preferences
   */
  async updatePreferences(
    request: FastifyRequest<{ Body: UpdatePreferencesDTO }>,
    reply: FastifyReply
  ) {
    const dto = await validateSchema(UpdatePreferencesDTO.schema, request.body);
    const userId = request.customUser!.id;

    const preferences = await this.userService.updatePreferences(userId, dto);

    reply.send({
      message: 'Preferences updated successfully',
      data: { preferences }
    });
  }

  /**
   * Get user by ID (public profile)
   */
  async getUserById(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;
    const user = await this.userService.getPublicProfile(userId);

    reply.send({ data: { user } });
  }

  /**
   * Search users
   */
  async searchUsers(
    request: FastifyRequest<{ Querystring: SearchUsersDTO }>,
    reply: FastifyReply
  ) {
    const query = await validateSchema(SearchUsersDTO.schema, request.query);
    const result = await this.userService.searchUsers(query);

    reply.send({ data: result });
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const data = await request.file();

    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    const avatarUrl = await this.userService.uploadAvatar(userId, data);

    reply.send({
      message: 'Avatar uploaded successfully',
      data: { avatarUrl }
    });
  }

  /**
   * Delete account
   */
  async deleteAccount(
    request: FastifyRequest<{ Body: { password: string } }>,
    reply: FastifyReply
  ) {
    const userId = request.customUser!.id;
    const { password } = request.body;

    await this.userService.deleteAccount(userId, password);

    reply.send({
      message: 'Account deleted successfully'
    });
  }

  /**
   * Get user activity
   */
  async getUserActivity(
    request: FastifyRequest<{ Querystring: { days?: number } }>,
    reply: FastifyReply
  ) {
    const userId = request.customUser!.id;
    const { days = 30 } = request.query;

    const activity = await this.userService.getUserActivity(userId, days);

    reply.send({ data: activity });
  }

  /**
   * Get user sessions
   */
  async getUserSessions(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.customUser!.id;
    const sessions = await this.userService.getUserSessions(userId);

    reply.send({ data: { sessions } });
  }

  /**
   * Revoke session
   */
  async revokeSession(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply
  ) {
    const userId = request.customUser!.id;
    const { sessionId } = request.params;

    await this.userService.revokeSession(userId, sessionId);

    reply.send({
      message: 'Session revoked successfully'
    });
  }
}