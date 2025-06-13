export class BaseException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * General application error
 * This is a convenience class that can be used for general application errors
 * with a custom status code
 */
export class AppError extends BaseException {
  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message, statusCode, 'APP_ERROR', details);
  }
}

export class BadRequestException extends BaseException {
  constructor(message: string = 'Bad Request', details?: any) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = 'Forbidden', details?: any) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string = 'Not Found', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string = 'Conflict', details?: any) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class ValidationException extends BaseException {
  constructor(message: string = 'Validation Failed', details?: any) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

export class TooManyRequestsException extends BaseException {
  constructor(message: string = 'Too Many Requests', details?: any) {
    super(message, 429, 'TOO_MANY_REQUESTS', details);
  }
}

export class InternalServerException extends BaseException {
  constructor(message: string = 'Internal Server Error', details?: any) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

export class ServiceUnavailableException extends BaseException {
  constructor(message: string = 'Service Unavailable', details?: any) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details);
  }
}
