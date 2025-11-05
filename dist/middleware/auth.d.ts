import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * Middleware to protect routes that require authentication
 */
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Optional authentication middleware - doesn't fail if no token
 * Useful for routes that work for both authenticated and guest users
 */
export declare const optionalAuthenticate: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map