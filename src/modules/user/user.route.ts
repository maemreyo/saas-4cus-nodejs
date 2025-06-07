import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { UserController } from './user.controller';

export default async function userRoutes(fastify: FastifyInstance) {
  const userController = Container.get(UserController);

  // Public routes (search users, view public profiles)
  fastify.get('/search', userController.searchUsers.bind(userController));
  fastify.get('/:userId', userController.getUserById.bind(userController));

  // Protected routes
  fastify.register(async function protectedRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyJWT(request, reply);
    });

    // Profile management
    fastify.get('/me', userController.getProfile.bind(userController));
    fastify.put('/me', userController.updateProfile.bind(userController));
    fastify.post('/me/avatar', userController.uploadAvatar.bind(userController));
    fastify.delete('/me', userController.deleteAccount.bind(userController));

    // Password & preferences
    fastify.post('/me/change-password', userController.changePassword.bind(userController));
    fastify.put('/me/preferences', userController.updatePreferences.bind(userController));

    // Activity & sessions
    fastify.get('/me/activity', userController.getUserActivity.bind(userController));
    fastify.get('/me/sessions', userController.getUserSessions.bind(userController));
    fastify.delete('/me/sessions/:sessionId', userController.revokeSession.bind(userController));
  });
}