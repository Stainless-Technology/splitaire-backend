"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes = exports.sendValidationError = exports.sendError = exports.sendSuccess = void 0;
/**
 * Send success response
 */
const sendSuccess = (res, statusCode, message, data) => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
/**
 * Send error response
 */
const sendError = (res, statusCode, message, error) => {
    const response = {
        success: false,
        message,
        error,
    };
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
/**
 * Send validation error response
 */
const sendValidationError = (res, errors) => {
    const response = {
        success: false,
        message: 'Validation failed. Please check the provided data.',
        errors,
    };
    return res.status(400).json(response);
};
exports.sendValidationError = sendValidationError;
/**
 * HTTP Status codes for reference
 */
exports.StatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};
//# sourceMappingURL=apiResponse.js.map