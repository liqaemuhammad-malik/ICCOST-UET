import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  // If response headers are already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request input data',
        details,
      },
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_KEY',
        message: `A resource with the same ${fields.join(', ')} already exists`,
        details: err.keyValue,
      },
    });
  }

  // Handle custom operational AppErrors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authorization token',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authorization token has expired',
      },
    });
  }

  // Unexpected internal errors
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled server error');

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    },
  });
}
