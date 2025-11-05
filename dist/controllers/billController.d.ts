import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * Create a new bill (authenticated or guest)
 * @route POST /api/bills
 * @access Public
 */
export declare const createBill: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get bill by ID
 * @route GET /api/bills/:billId
 * @access Public
 */
export declare const getBillById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get all bills for authenticated user
 * @route GET /api/bills
 * @access Private
 */
export declare const getUserBills: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update bill
 * @route PUT /api/bills/:billId
 * @access Public (but should be creator)
 */
export declare const updateBill: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Mark participant payment status
 * @route PATCH /api/bills/:billId/payment
 * @access Public
 */
export declare const markPayment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete bill
 * @route DELETE /api/bills/:billId
 * @access Private (creator only)
 */
export declare const deleteBill: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get bill statistics for authenticated user
 * @route GET /api/bills/stats
 * @access Private
 */
export declare const getBillStats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=billController.d.ts.map