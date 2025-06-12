import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { Container } from 'typedi';
import { UnauthorizedException, ForbiddenException } from '@shared/exceptions';
import { logger } from '@shared/logger';
import { AuthService } from '@modules/auth/auth.service';
import { UserRole } from '@prisma/client';

// JWT Payload interface matching what AuthService returns
interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  sessionId?: string;
  tenantId?: string;
  permissions?: string[];
}

// Extended FastifyRequest with user
export interface AuthRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    tenantId?: string;
    permissions?: string[];
  };
}

/**
 * Require authentication middleware
 * Compatible with Fastify's preHandler hook
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const token = extractToken(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const authService = Container.get(AuthService);
    const payload = (await authService.verifyAccessToken(token)) as JWTPayload;

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    // Map JWT payload to user object
    // Note: 'sub' is mapped to 'id', and role string is cast to UserRole enum
    (request as AuthRequest).user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
      tenantId: payload.tenantId,
      permissions: payload.permissions,
    };
  } catch (error) {
    logger.error('Authentication failed', error as Error);
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new UnauthorizedException('Authentication failed');
  }
}

/**
 * Require specific roles
 * Compatible with Fastify's preHandler hook
 */
export function requireRole(...roles: UserRole[]) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // First ensure user is authenticated
    const authRequest = request as AuthRequest;
    if (!authRequest.user) {
      await requireAuth(request, reply);
    }

    if (!authRequest.user || !roles.includes(authRequest.user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  };
}

/**
 * Require specific permissions
 * Compatible with Fastify's preHandler hook
 */
export function requirePermission(...permissions: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // First ensure user is authenticated
    const authRequest = request as AuthRequest;
    if (!authRequest.user) {
      await requireAuth(request, reply);
    }

    const userPermissions = authRequest.user?.permissions || [];
    const hasPermission = permissions.every(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }
  };
}

/**
 * Optional authentication - sets user if token present but doesn't require it
 * Compatible with Fastify's preHandler hook
 */
export async function optionalAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const token = extractToken(request);
    if (!token) return;

    const authService = Container.get(AuthService);
    const payload = (await authService.verifyAccessToken(token)) as JWTPayload;

    if (payload) {
      (request as AuthRequest).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role as UserRole,
        tenantId: payload.tenantId,
        permissions: payload.permissions,
      };
    }
  } catch (error) {
    // Ignore errors for optional auth
    logger.debug('Optional auth failed', error as Error);
  }
}

/**
 * Extract token from request
 */
function extractToken(request: FastifyRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookie
  const cookieToken = request.cookies?.access_token;
  if (cookieToken) {
    return cookieToken;
  }

  // Check query parameter (for download links, etc.)
  const queryToken = (request.query as any)?.token;
  if (queryToken) {
    return queryToken;
  }

  return null;
}
