import { Request, Response, NextFunction } from 'express';
/**
 * Global error handling middleware
 */
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => void;
/**
 * Handle 404 - Route not found
 */
export declare const notFoundHandler: (req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map