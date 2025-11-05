import { Response } from 'express';
/**
 * Send success response
 */
export declare const sendSuccess: <T>(res: Response, statusCode: number, message: string, data?: T) => Response;
/**
 * Send error response
 */
export declare const sendError: (res: Response, statusCode: number, message: string, error?: string) => Response;
/**
 * Send validation error response
 */
export declare const sendValidationError: (res: Response, errors: Array<{
    field: string;
    message: string;
}>) => Response;
/**
 * HTTP Status codes for reference
 */
export declare const StatusCodes: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
};
//# sourceMappingURL=apiResponse.d.ts.map