"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPaymentValidation = exports.updateBillValidation = exports.createBillValidation = exports.loginValidation = exports.registerValidation = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const apiResponse_1 = require("../utils/apiResponse");
const types_1 = require("../types");
/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
        }));
        (0, apiResponse_1.sendValidationError)(res, formattedErrors);
        return;
    }
    next();
};
exports.validate = validate;
/**
 * User registration validation
 */
exports.registerValidation = [
    (0, express_validator_1.body)('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
/**
 * User login validation
 */
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
/**
 * Bill creation validation
 */
exports.createBillValidation = [
    (0, express_validator_1.body)('billName')
        .trim()
        .notEmpty()
        .withMessage('Bill name is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Bill name must be between 3 and 200 characters'),
    (0, express_validator_1.body)('totalAmount')
        .notEmpty()
        .withMessage('Total amount is required')
        .isFloat({ min: 0.01 })
        .withMessage('Total amount must be greater than 0'),
    (0, express_validator_1.body)('currency')
        .optional()
        .isIn(['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'INR', 'JPY', 'CNY'])
        .withMessage('Invalid currency code'),
    (0, express_validator_1.body)('participants')
        .isArray({ min: 2 })
        .withMessage('At least 2 participants are required to split a bill'),
    (0, express_validator_1.body)('participants.*.name')
        .trim()
        .notEmpty()
        .withMessage('Participant name is required'),
    (0, express_validator_1.body)('participants.*.email')
        .trim()
        .notEmpty()
        .withMessage('Participant email is required')
        .isEmail()
        .withMessage('Participant must have a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('splitMethod')
        .notEmpty()
        .withMessage('Split method is required')
        .isIn(Object.values(types_1.SplitMethod))
        .withMessage('Invalid split method'),
    (0, express_validator_1.body)('customSplits')
        .optional()
        .isArray()
        .withMessage('Custom splits must be an array'),
    (0, express_validator_1.body)('items')
        .optional()
        .isArray()
        .withMessage('Items must be an array'),
    (0, express_validator_1.body)('items.*.description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Item description is required'),
    (0, express_validator_1.body)('items.*.amount')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Item amount must be greater than 0'),
    (0, express_validator_1.body)('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes cannot exceed 1000 characters'),
    (0, express_validator_1.body)('createdByName')
        .optional()
        .trim(),
    (0, express_validator_1.body)('createdByEmail')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Creator email must be valid')
        .normalizeEmail(),
];
/**
 * Bill update validation
 */
exports.updateBillValidation = [
    (0, express_validator_1.body)('billName')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Bill name must be between 3 and 200 characters'),
    (0, express_validator_1.body)('totalAmount')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Total amount must be greater than 0'),
    (0, express_validator_1.body)('participants')
        .optional()
        .isArray({ min: 2 })
        .withMessage('At least 2 participants are required'),
    (0, express_validator_1.body)('participants.*.name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Participant name is required'),
    (0, express_validator_1.body)('participants.*.email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Participant must have a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('splitMethod')
        .optional()
        .isIn(Object.values(types_1.SplitMethod))
        .withMessage('Invalid split method'),
    (0, express_validator_1.body)('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes cannot exceed 1000 characters'),
];
/**
 * Mark payment validation
 */
exports.markPaymentValidation = [
    (0, express_validator_1.body)('participantEmail')
        .trim()
        .notEmpty()
        .withMessage('Participant email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('isPaid')
        .notEmpty()
        .withMessage('Payment status is required')
        .isBoolean()
        .withMessage('Payment status must be true or false'),
];
//# sourceMappingURL=validation.js.map