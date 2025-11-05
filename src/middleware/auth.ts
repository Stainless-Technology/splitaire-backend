import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { sendError, StatusCodes } from '../utils/apiResponse';
import User from '../models/User';

/**
 * Middleware to protect routes that require authentication
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      sendError(
        res,
        StatusCodes.UNAUTHORIZED,
        'Authentication required. Please provide a valid token.',
        'No authentication token provided'
      );
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      sendError(
        res,
        StatusCodes.UNAUTHORIZED,
        'User account no longer exists. Please login again.',
        'Invalid user'
      );
      return;
    }

    // Attach user info to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    sendError(
      res,
      StatusCodes.UNAUTHORIZED,
      error instanceof Error ? error.message : 'Authentication failed',
      'Invalid or expired token'
    );
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * Useful for routes that work for both authenticated and guest users
 */
export const optionalAuthenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (user) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
