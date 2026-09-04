import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Safe stack trace capture
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: (req as any).ip,
  });

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';
  let details: any = undefined;

  // Handle known AppErrors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = statusCode >= 400 && statusCode < 500 ? 'CLIENT_ERROR' : 'SERVER_ERROR';
    details = err.details;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
    code = 'UNAUTHORIZED';
  }

  // Prisma/Database errors
  if (err.message.includes('Unique constraint')) {
    statusCode = 409;
    message = 'Resource already exists';
    code = 'DUPLICATE_RESOURCE';
  }

  if (err.message.includes('Foreign key constraint')) {
    statusCode = 400;
    message = 'Invalid reference to related resource';
    code = 'INVALID_REFERENCE';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
      // ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};