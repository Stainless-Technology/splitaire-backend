"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const apiResponse_1 = require("../utils/apiResponse");
/**
 * Global error handling middleware
 */
const errorHandler = (err, _req, res, _next) => {
    console.error('❌ Error:', err);
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.BAD_REQUEST, 'Validation error. Please check your input.', err.message);
        return;
    }
    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.BAD_REQUEST, 'Invalid ID format provided.', err.message);
        return;
    }
    // Duplicate key error
    if (err.name === 'MongoServerError' && err.code === 11000) {
        (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.CONFLICT, 'Duplicate entry found. This resource already exists.', err.message);
        return;
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.UNAUTHORIZED, 'Authentication failed. Please login again.', err.message);
        return;
    }
    // Default server error
    (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred. Please try again later.', process.env.NODE_ENV === 'development' ? err.message : undefined);
};
exports.errorHandler = errorHandler;
/**
 * Handle 404 - Route not found
 */
const notFoundHandler = (req, res, _next) => {
    (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`, 'The requested endpoint does not exist');
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map