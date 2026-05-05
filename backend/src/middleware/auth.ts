import { Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { AuthRequest, ApiResponse } from '../types';

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.cookies?.token;
  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. Please log in.' } as ApiResponse);
    return;
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' } as ApiResponse);
  }
};

export const authorize = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Permission denied.' } as ApiResponse);
      return;
    }
    next();
  };