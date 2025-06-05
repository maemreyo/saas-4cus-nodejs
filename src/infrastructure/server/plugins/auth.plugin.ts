import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '@infrastructure/config';
import { prisma } from '@infrastructure/database/prisma.service';
import { redis } from '@infrastructure/cache/redis.service';
import { UnauthorizedException, ForbiddenException } from '@shared/exceptions';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  sessionId: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    customUser?: {
      id: string;
      email: string;
      role: string;
    };
    customContext?: {
      requestId: string;
      startTime: number;
    };
  }
}

export default fp(async function authPlugin(fastify: FastifyInstance) {
  // Verify JWT decorator
  fastify.decorate('verifyJWT', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = extractToken(request);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const payload = jwt.verify(token, config.security.jwt.accessSecret) as JwtPayload;

      // Check session in cache
      const session = await redis.get(`session:${payload.sessionId}`);
      if (!session) {
        // Check in database
        const dbSession = await prisma.client.session.findUnique({
          where: { id: payload.sessionId },
        });

        if (!dbSession || dbSession.expiresAt < new Date()) {
          throw new UnauthorizedException('Session expired');
        }

        // Cache session
        await redis.set(`session:${payload.sessionId}`, { userId: dbSession.userId }, { ttl: 900 });
      }

      request.customUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  });

  // Verify role decorator
  fastify.decorate('verifyRole', function (roles: string[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      if (!request.customUser) {
        throw new UnauthorizedException('Not authenticated');
      }

      if (!roles.includes(request.customUser.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }
    };
  });
});

function extractToken(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookie
  if (request.cookies && request.cookies.token) {
    return request.cookies.token;
  }

  return null;
}
