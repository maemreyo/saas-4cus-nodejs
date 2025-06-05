export const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      firstName: { type: 'string', minLength: 1, maxLength: 100 },
      lastName: { type: 'string', minLength: 1, maxLength: 100 },
      username: { type: 'string', minLength: 3, maxLength: 30, pattern: '^[a-zA-Z0-9_-]+$' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
              },
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                expiresIn: { type: 'number' },
                tokenType: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      twoFactorCode: { type: 'string', minLength: 6, maxLength: 6 },
    },
  },
};

export const refreshTokenSchema = {
  body: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string' },
    },
  },
};

export const resetPasswordRequestSchema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email' },
    },
  },
};

export const resetPasswordSchema = {
  body: {
    type: 'object',
    required: ['token', 'password'],
    properties: {
      token: { type: 'string' },
      password: { type: 'string', minLength: 8 },
    },
  },
};

export const enable2FASchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            secret: { type: 'string' },
            qrCode: { type: 'string' },
            backupCodes: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const verify2FASchema = {
  body: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'string', minLength: 6, maxLength: 6 },
    },
  },
};
