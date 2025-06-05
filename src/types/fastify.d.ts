import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    verifyJWT: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyRole: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

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

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      role: string;
      sessionId: string;
    };
    user: {
      sub: string;
      email: string;
      role: string;
      sessionId: string;
    };
  }
}
