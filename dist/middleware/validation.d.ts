import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to check validation results
 */
export declare const validate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * User registration validation
 */
export declare const registerValidation: import("express-validator").ValidationChain[];
/**
 * User login validation
 */
export declare const loginValidation: import("express-validator").ValidationChain[];
/**
 * Bill creation validation
 */
export declare const createBillValidation: import("express-validator").ValidationChain[];
/**
 * Bill update validation
 */
export declare const updateBillValidation: import("express-validator").ValidationChain[];
/**
 * Mark payment validation
 */
export declare const markPaymentValidation: import("express-validator").ValidationChain[];
//# sourceMappingURL=validation.d.ts.map