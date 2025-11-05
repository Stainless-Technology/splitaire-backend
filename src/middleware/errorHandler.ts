import { Request, Response, NextFunction } from 'express';
import { sendError, StatusCodes } from '../utils/apiResponse';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      'Validation error. Please check your input.',
      err.message
    );
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(
      res,
      StatusCodes.BAD_REQUEST,
      'Invalid ID format provided.',
      err.message
    );
    return;
  }

  // Duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    sendError(
      res,
      StatusCodes.CONFLICT,
      'Duplicate entry found. This resource already exists.',
      err.message
    );
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    sendError(
      res,
      StatusCodes.UNAUTHORIZED,
      'Authentication failed. Please login again.',
      err.message
    );
    return;
  }

  // Default server error
  sendError(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred. Please try again later.',
    process.env.NODE_ENV === 'development' ? err.message : undefined
  );
};

/**
 * Handle 404 - Route not found
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(
    res,
    StatusCodes.NOT_FOUND,
    `Route not found: ${req.method} ${req.originalUrl}`,
    'The requested endpoint does not exist'
  );
};
