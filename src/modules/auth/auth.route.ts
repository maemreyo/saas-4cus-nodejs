import { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { AuthController } from './auth.controller';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  enable2FASchema,
  verify2FASchema,
} from './auth.schema';

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = Container.get(AuthController);

  // Public routes
  fastify.post(
    '/register',
    {
      schema: registerSchema,
    },
    authController.register.bind(authController),
  );

  fastify.post(
    '/login',
    {
      schema: loginSchema,
    },
    authController.login.bind(authController),
  );

  fastify.post(
    '/refresh',
    {
      schema: refreshTokenSchema,
    },
    authController.refreshToken.bind(authController),
  );

  fastify.post(
    '/forgot-password',
    {
      schema: resetPasswordRequestSchema,
    },
    authController.forgotPassword.bind(authController),
  );

  fastify.post(
    '/reset-password',
    {
      schema: resetPasswordSchema,
    },
    authController.resetPassword.bind(authController),
  );

  fastify.get('/verify-email', authController.verifyEmail.bind(authController));

  // OAuth routes
  fastify.get('/google', authController.googleAuth.bind(authController));
  fastify.get('/google/callback', authController.googleCallback.bind(authController));

  // Protected routes
  fastify.register(async function protectedRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', async (request, reply) => {
      await (fastify as any).verifyJWT(request, reply);
    });

    fastify.post('/logout', authController.logout.bind(authController));

    fastify.get('/me', authController.getCurrentUser.bind(authController));

    fastify.post(
      '/2fa/enable',
      {
        schema: enable2FASchema,
      },
      authController.enable2FA.bind(authController),
    );

    fastify.post(
      '/2fa/verify',
      {
        schema: verify2FASchema,
      },
      authController.verify2FA.bind(authController),
    );

    fastify.post('/2fa/disable', authController.disable2FA.bind(authController));
  });
}
