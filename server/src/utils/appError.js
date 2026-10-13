export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR', details = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errorCode = 'BAD_REQUEST', details = []) {
    return new AppError(message, 400, errorCode, details);
  }

  static unauthorized(message = 'Authentication required', errorCode = 'UNAUTHORIZED', details = []) {
    return new AppError(message, 401, errorCode, details);
  }

  static forbidden(message = 'Access denied: insufficient permissions', errorCode = 'FORBIDDEN', details = []) {
    return new AppError(message, 403, errorCode, details);
  }

  static notFound(message = 'Resource not found', errorCode = 'NOT_FOUND', details = []) {
    return new AppError(message, 404, errorCode, details);
  }

  static conflict(message = 'Resource conflict or duplicate reference', errorCode = 'CONFLICT', details = []) {
    return new AppError(message, 409, errorCode, details);
  }

  static unprocessable(message = 'Validation failed', errorCode = 'VALIDATION_ERROR', details = []) {
    return new AppError(message, 422, errorCode, details);
  }
}
