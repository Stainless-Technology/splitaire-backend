"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billController_1 = require("../controllers/billController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/bills
 * @desc    Create a new bill (guest or authenticated)
 * @access  Public
 */
router.post('/', auth_1.optionalAuthenticate, validation_1.createBillValidation, validation_1.validate, billController_1.createBill);
/**
 * @route   GET /api/bills/stats
 * @desc    Get bill statistics for authenticated user
 * @access  Private
 */
router.get('/stats', auth_1.authenticate, billController_1.getBillStats);
/**
 * @route   GET /api/bills
 * @desc    Get all bills for authenticated user
 * @access  Private
 */
router.get('/', auth_1.authenticate, billController_1.getUserBills);
/**
 * @route   GET /api/bills/:billId
 * @desc    Get bill by ID
 * @access  Public
 */
router.get('/:billId', billController_1.getBillById);
/**
 * @route   PUT /api/bills/:billId
 * @desc    Update bill
 * @access  Public (but should be creator)
 */
router.put('/:billId', auth_1.optionalAuthenticate, validation_1.updateBillValidation, validation_1.validate, billController_1.updateBill);
/**
 * @route   PATCH /api/bills/:billId/payment
 * @desc    Mark participant payment status
 * @access  Public
 */
router.patch('/:billId/payment', validation_1.markPaymentValidation, validation_1.validate, billController_1.markPayment);
/**
 * @route   DELETE /api/bills/:billId
 * @desc    Delete bill
 * @access  Private (creator only)
 */
router.delete('/:billId', auth_1.authenticate, billController_1.deleteBill);
exports.default = router;
//# sourceMappingURL=billRoutes.js.map