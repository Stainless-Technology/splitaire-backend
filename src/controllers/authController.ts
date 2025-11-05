import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError, StatusCodes } from '../utils/apiResponse';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      sendError(
        res,
        StatusCodes.CONFLICT,
        'Registration failed. An account with this email already exists.',
        'Email already registered'
      );
      return;
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
    });

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    sendSuccess(
      res,
      StatusCodes.CREATED,
      'Account created successfully! Welcome to Bill Splitter.',
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      sendError(
        res,
        StatusCodes.UNAUTHORIZED,
        'Login failed. Invalid email or password.',
        'User not found'
      );
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      sendError(
        res,
        StatusCodes.UNAUTHORIZED,
        'Login failed. Invalid email or password.',
        'Incorrect password'
      );
      return;
    }

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    sendSuccess(
      res,
      StatusCodes.OK,
      'Login successful! Welcome back.',
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
        token,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const user = await User.findById(userId);

    if (!user) {
      sendError(
        res,
        StatusCodes.NOT_FOUND,
        'User profile not found.',
        'User does not exist'
      );
      return;
    }

    sendSuccess(
      res,
      StatusCodes.OK,
      'Profile retrieved successfully.',
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { fullName } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { fullName },
      { new: true, runValidators: true }
    );

    if (!user) {
      sendError(
        res,
        StatusCodes.NOT_FOUND,
        'User profile not found.',
        'User does not exist'
      );
      return;
    }

    sendSuccess(
      res,
      StatusCodes.OK,
      'Profile updated successfully.',
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          updatedAt: user.updatedAt,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};
