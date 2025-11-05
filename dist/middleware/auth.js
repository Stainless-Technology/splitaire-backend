"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const apiResponse_1 = require("../utils/apiResponse");
const User_1 = __importDefault(require("../models/User"));
/**
 * Middleware to protect routes that require authentication
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.UNAUTHORIZED, 'Authentication required. Please provide a valid token.', 'No authentication token provided');
            return;
        }
        // Verify token
        const decoded = (0, jwt_1.verifyToken)(token);
        // Check if user still exists
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.UNAUTHORIZED, 'User account no longer exists. Please login again.', 'Invalid user');
            return;
        }
        // Attach user info to request
        req.user = {
            id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
        };
        next();
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.UNAUTHORIZED, error instanceof Error ? error.message : 'Authentication failed', 'Invalid or expired token');
    }
};
exports.authenticate = authenticate;
/**
 * Optional authentication middleware - doesn't fail if no token
 * Useful for routes that work for both authenticated and guest users
 */
const optionalAuthenticate = async (req, _res, next) => {
    try {
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (token) {
            const decoded = (0, jwt_1.verifyToken)(token);
            const user = await User_1.default.findById(decoded.id);
            if (user) {
                req.user = {
                    id: user._id.toString(),
                    email: user.email,
                    fullName: user.fullName,
                };
            }
        }
        next();
    }
    catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
//# sourceMappingURL=auth.js.map