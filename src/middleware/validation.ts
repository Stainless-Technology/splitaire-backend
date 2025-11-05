import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from '../utils/apiResponse';
import { SplitMethod } from '../types';

/**
 * Middleware to check validation results
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));

    sendValidationError(res, formattedErrors);
    return;
  }

  next();
};

/**
 * User registration validation
 */
export const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * User login validation
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Bill creation validation
 */
export const createBillValidation = [
  body('billName')
    .trim()
    .notEmpty()
    .withMessage('Bill name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Bill name must be between 3 and 200 characters'),
  
  body('totalAmount')
    .notEmpty()
    .withMessage('Total amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Total amount must be greater than 0'),
  
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'INR', 'JPY', 'CNY'])
    .withMessage('Invalid currency code'),
  
  body('participants')
    .isArray({ min: 2 })
    .withMessage('At least 2 participants are required to split a bill'),
  
  body('participants.*.name')
    .trim()
    .notEmpty()
    .withMessage('Participant name is required'),
  
  body('participants.*.email')
    .trim()
    .notEmpty()
    .withMessage('Participant email is required')
    .isEmail()
    .withMessage('Participant must have a valid email address')
    .normalizeEmail(),
  
  body('splitMethod')
    .notEmpty()
    .withMessage('Split method is required')
    .isIn(Object.values(SplitMethod))
    .withMessage('Invalid split method'),
  
  body('customSplits')
    .optional()
    .isArray()
    .withMessage('Custom splits must be an array'),
  
  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),
  
  body('items.*.description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Item description is required'),
  
  body('items.*.amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Item amount must be greater than 0'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  body('createdByName')
    .optional()
    .trim(),
  
  body('createdByEmail')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Creator email must be valid')
    .normalizeEmail(),
];

/**
 * Bill update validation
 */
export const updateBillValidation = [
  body('billName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Bill name must be between 3 and 200 characters'),
  
  body('totalAmount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Total amount must be greater than 0'),
  
  body('participants')
    .optional()
    .isArray({ min: 2 })
    .withMessage('At least 2 participants are required'),
  
  body('participants.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Participant name is required'),
  
  body('participants.*.email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Participant must have a valid email address')
    .normalizeEmail(),
  
  body('splitMethod')
    .optional()
    .isIn(Object.values(SplitMethod))
    .withMessage('Invalid split method'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

/**
 * Mark payment validation
 */
export const markPaymentValidation = [
  body('participantEmail')
    .trim()
    .notEmpty()
    .withMessage('Participant email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('isPaid')
    .notEmpty()
    .withMessage('Payment status is required')
    .isBoolean()
    .withMessage('Payment status must be true or false'),
];
