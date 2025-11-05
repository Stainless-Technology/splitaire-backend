import { Request, Response, NextFunction } from 'express';
/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export declare const getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export declare const updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map