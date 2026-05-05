import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, string>;
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    statusCode = 409;
  }
  if (err.name === 'CastError')        { message = 'Resource not found.';  statusCode = 404; }
  if (err.name === 'JsonWebTokenError') { message = 'Invalid token.';       statusCode = 401; }
  if (err.name === 'TokenExpiredError') { message = 'Token expired.';       statusCode = 401; }
  res.status(statusCode).json({ success: false, message, ...(process.env.NODE_ENV === 'development' && { errors: err.stack }) } as ApiResponse);
};

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error: AppError = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};