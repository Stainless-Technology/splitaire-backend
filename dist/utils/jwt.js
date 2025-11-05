"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
/**
 * Generate JWT token
 */
const generateToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, {
            expiresIn: config_1.default.jwtExpire,
        });
    }
    catch (error) {
        throw new Error('Failed to generate authentication token');
    }
};
exports.generateToken = generateToken;
/**
 * Verify JWT token
 */
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Authentication token has expired. Please login again.');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Invalid authentication token. Please login again.');
        }
        else {
            throw new Error('Token verification failed. Please login again.');
        }
    }
};
exports.verifyToken = verifyToken;
/**
 * Extract token from Authorization header
 */
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=jwt.js.map