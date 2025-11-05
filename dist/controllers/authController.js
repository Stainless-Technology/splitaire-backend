"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const apiResponse_1 = require("../utils/apiResponse");
/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.CONFLICT, 'Registration failed. An account with this email already exists.', 'Email already registered');
            return;
        }
        // Create new user
        const user = await User_1.default.create({
            fullName,
            email,
            password,
        });
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
        });
        (0, apiResponse_1.sendSuccess)(res, apiResponse_1.StatusCodes.CREATED, 'Account created successfully! Welcome to Bill Splitter.', {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find user and include password
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.UNAUTHORIZED, 'Login failed. Invalid email or password.', 'User not found');
            return;
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.UNAUTHORIZED, 'Login failed. Invalid email or password.', 'Incorrect password');
            return;
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
        });
        (0, apiResponse_1.sendSuccess)(res, apiResponse_1.StatusCodes.OK, 'Login successful! Welcome back.', {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.NOT_FOUND, 'User profile not found.', 'User does not exist');
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, apiResponse_1.StatusCodes.OK, 'Profile retrieved successfully.', {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { fullName } = req.body;
        const user = await User_1.default.findByIdAndUpdate(userId, { fullName }, { new: true, runValidators: true });
        if (!user) {
            (0, apiResponse_1.sendError)(res, apiResponse_1.StatusCodes.NOT_FOUND, 'User profile not found.', 'User does not exist');
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, apiResponse_1.StatusCodes.OK, 'Profile updated successfully.', {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=authController.js.map