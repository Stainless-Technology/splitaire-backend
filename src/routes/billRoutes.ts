import { Router } from 'express';
import {
  createBill,
  getBillById,
  getUserBills,
  updateBill,
  markPayment,
  deleteBill,
  getBillStats,
} from '../controllers/billController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import {
  createBillValidation,
  updateBillValidation,
  markPaymentValidation,
  validate,
} from '../middleware/validation';

const router = Router();

/**
 * @route   POST /api/bills
 * @desc    Create a new bill (guest or authenticated)
 * @access  Public
 */
router.post('/', optionalAuthenticate, createBillValidation, validate, createBill);

/**
 * @route   GET /api/bills/stats
 * @desc    Get bill statistics for authenticated user
 * @access  Private
 */
router.get('/stats', authenticate, getBillStats);

/**
 * @route   GET /api/bills
 * @desc    Get all bills for authenticated user
 * @access  Private
 */
router.get('/', authenticate, getUserBills);

/**
 * @route   GET /api/bills/:billId
 * @desc    Get bill by ID
 * @access  Public
 */
router.get('/:billId', getBillById);

/**
 * @route   PUT /api/bills/:billId
 * @desc    Update bill
 * @access  Public (but should be creator)
 */
router.put('/:billId', optionalAuthenticate, updateBillValidation, validate, updateBill);

/**
 * @route   PATCH /api/bills/:billId/payment
 * @desc    Mark participant payment status
 * @access  Public
 */
router.patch('/:billId/payment', markPaymentValidation, validate, markPayment);

/**
 * @route   DELETE /api/bills/:billId
 * @desc    Delete bill
 * @access  Private (creator only)
 */
router.delete('/:billId', authenticate, deleteBill);

export default router;
