import { Request, Response, NextFunction } from 'express';
import { verifyToken, getUserProfile } from '../utils/supabase';
import { AuthRequest, User } from '../types';
import { AppError } from './error.middleware';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const user = await verifyToken(token);
    if (!user) {
      throw new AppError('Invalid or expired token', 401);
    }

    // Get user profile with role information
    const profile = await getUserProfile(user.id);
    if (!profile) {
      throw new AppError('User profile not found', 404);
    }

    // Attach user to request
    req.user = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role_id: profile.role_id,
      role: profile.roles?.name,
      avatar_url: profile.avatar_url,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!req.user.role) {
      return next(new AppError('User role not found', 403));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    const user = await verifyToken(token);
    
    if (user) {
      const profile = await getUserProfile(user.id);
      if (profile) {
        req.user = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role_id: profile.role_id,
          role: profile.roles?.name,
          avatar_url: profile.avatar_url,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication on error
    next();
  }
};