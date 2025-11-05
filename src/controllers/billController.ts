import { Response, NextFunction } from 'express';
import Bill from '../models/Bill';
import { AuthRequest, CreateBillRequest, UpdateBillRequest, MarkPaymentRequest } from '../types';
import { sendSuccess, sendError, StatusCodes } from '../utils/apiResponse';
import {
  calculateSplitAmounts,
  validateItemParticipants,
  calculateTotalFromItems,
} from '../utils/billCalculations';
import {
  sendBillCreatedEmail,
  sendBillUpdatedEmail,
  sendPaymentMarkedEmail,
  sendBillSettledEmail,
} from '../utils/emailService';

/**
 * Create a new bill (authenticated or guest)
 * @route POST /api/bills
 * @access Public
 */
export const createBill = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      billName,
      totalAmount,
      currency = 'USD',
      participants,
      items,
      splitMethod,
      customSplits,
      notes,
      createdByName,
      createdByEmail,
      accountDetails, // NEW: Accept account details
    }: CreateBillRequest = req.body;

    // Validate item-based splits
    if (items && items.length > 0) {
      const validation = validateItemParticipants(participants, items);
      if (!validation.valid) {
        sendError(res, StatusCodes.BAD_REQUEST, validation.error || 'Invalid item participants');
        return;
      }

      // Calculate total from items and verify it matches
      const calculatedTotal = calculateTotalFromItems(items);
      if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        sendError(
          res,
          StatusCodes.BAD_REQUEST,
          `Item totals (${calculatedTotal}) do not match the bill total (${totalAmount})`,
          'Total amount mismatch'
        );
        return;
      }
    }

    // Calculate split amounts
    let participantsWithAmounts;
    try {
      participantsWithAmounts = calculateSplitAmounts(
        totalAmount,
        participants,
        splitMethod,
        customSplits,
        items
      );
    } catch (error) {
      sendError(
        res,
        StatusCodes.BAD_REQUEST,
        error instanceof Error ? error.message : 'Failed to calculate split amounts',
        'Calculation error'
      );
      return;
    }

    // Create bill data
    const billData: any = {
      billName,
      totalAmount,
      currency,
      participants: participantsWithAmounts,
      items,
      splitMethod,
      notes,
    };

    // Add account details if provided
    if (accountDetails) {
      billData.accountDetails = {
        bankName: accountDetails.bankName || '',
        accountNumber: accountDetails.accountNumber || '',
        accountHolderName: accountDetails.accountHolderName || '',
        paymentHandle: accountDetails.paymentHandle || '',
        currency: accountDetails.currency || currency,
      };
    }

    // Add creator info based on authentication status
    if (req.user) {
      billData.createdBy = req.user.id;
      billData.createdByName = req.user.fullName;
      billData.createdByEmail = req.user.email;
    } else {
      billData.createdByName = createdByName;
      billData.createdByEmail = createdByEmail;
    }

    // Create the bill
    const bill = await Bill.create(billData);

    // Send email notifications to all participants
    const creatorName = billData.createdByName || 'Someone';
    for (const participant of bill.participants) {
      try {
        await sendBillCreatedEmail(
          participant.email,
          participant.name,
          bill.billName,
          bill.billId,
          participant.amountOwed,
          bill.currency,
          creatorName
        );
      } catch (emailError) {
        console.error(`Failed to send email to ${participant.email}:`, emailError);
      }
    }

    sendSuccess(
      res,
      StatusCodes.CREATED,
      'Bill created successfully! Notifications sent to all participants.',
      {
        bill: {
          id: bill._id,
          billId: bill.billId,
          billName: bill.billName,
          totalAmount: bill.totalAmount,
          currency: bill.currency,
          participants: bill.participants,
          items: bill.items,
          splitMethod: bill.splitMethod,
          notes: bill.notes,
          accountDetails: bill.accountDetails, // Include account details in response
          isSettled: bill.isSettled,
          createdAt: bill.createdAt,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get bill by ID
 * @route GET /api/bills/:billId
 * @access Public
 */
export const getBillById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { billId } = req.params;

    const bill = await Bill.findOne({ billId }).populate('createdBy', 'fullName email');

    if (!bill) {
      sendError(
        res,
        StatusCodes.NOT_FOUND,
        'Bill not found. Please check the bill ID and try again.',
        'Invalid bill ID'
      );
      return;
    }

    sendSuccess(
      res,
      StatusCodes.OK,
      'Bill retrieved successfully.',
      {
        bill: {
          id: bill._id,
          billId: bill.billId,
          billName: bill.billName,
          totalAmount: bill.totalAmount,
          currency: bill.currency,
          createdBy: bill.createdBy,
          createdByName: bill.createdByName,
          createdByEmail: bill.createdByEmail,
          participants: bill.participants,
          items: bill.items,
          splitMethod: bill.splitMethod,
          notes: bill.notes,
          accountDetails: bill.accountDetails, // Include account details in response
          isSettled: bill.isSettled,
          settledAt: bill.settledAt,
          createdAt: bill.createdAt,
          updatedAt: bill.updatedAt,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bills for authenticated user
 * @route GET /api/bills
 * @access Private
 */
export const getUserBills = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, settled } = req.query;

    const query: any = { createdBy: userId };
    
    if (settled !== undefined) {
      query.isSettled = settled === 'true';
    }

    const bills = await Bill.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Bill.countDocuments(query);

    sendSuccess(
      res,
      StatusCodes.OK,
      'Bills retrieved successfully.',
      {
        bills: bills.map((bill) => ({
          id: bill._id,
          billId: bill.billId,
          billName: bill.billName,
          totalAmount: bill.totalAmount,
          currency: bill.currency,
          participantsCount: bill.participants.length,
          isSettled: bill.isSettled,
          settledAt: bill.settledAt,
          createdAt: bill.createdAt,
        })),
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit),
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update bill
 * @route PUT /api/bills/:billId
 * @access Public (but should be creator)
 */
export const updateBill = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { billId } = req.params;
    const updates: UpdateBillRequest = req.body;

    const bill = await Bill.findOne({ billId });

    if (!bill) {
      sendError(
        res,
        StatusCodes.NOT_FOUND,
        'Bill not found. Unable to update.',
        'Invalid bill ID'
      );
      return;
    }

    // Check if bill is settled
    if (bill.isSettled) {
      sendError(
        res,
        StatusCodes.BAD_REQUEST,
        'Cannot update a settled bill. All participants have marked their payments as complete.',
        'Bill is settled'
      );
      return;
    }

    // Recalculate splits if necessary
    if (updates.participants || updates.totalAmount || updates.splitMethod) {
      const participants = updates.participants || bill.participants;
      const totalAmount = updates.totalAmount || bill.totalAmount;
      const splitMethod = updates.splitMethod || bill.splitMethod;
      const items = updates.items || bill.items;

      // Validate items if provided
      if (items && items.length > 0) {
        const validation = validateItemParticipants(participants, items);
        if (!validation.valid) {
          sendError(res, StatusCodes.BAD_REQUEST, validation.error || 'Invalid item participants');
          return;
        }
      }

      try {
        const participantsWithAmounts = calculateSplitAmounts(
          totalAmount,
          participants,
          splitMethod,
          updates.customSplits,
          items
        );

        bill.participants = participantsWithAmounts;
      } catch (error) {
        sendError(
          res,
          StatusCodes.BAD_REQUEST,
          error instanceof Error ? error.message : 'Failed to calculate split amounts',
          'Calculation error'
        );
        return;
      }
    }

    // Update bill fields
    if (updates.billName) bill.billName = updates.billName;
    if (updates.totalAmount) bill.totalAmount = updates.totalAmount;
    if (updates.items) bill.items = updates.items;
    if (updates.notes !== undefined) bill.notes = updates.notes;
    
    // Update account details if provided
    if (updates.accountDetails) {
      bill.accountDetails = {
        bankName: updates.accountDetails.bankName || bill.accountDetails?.bankName || '',
        accountNumber: updates.accountDetails.accountNumber || bill.accountDetails?.accountNumber || '',
        accountHolderName: updates.accountDetails.accountHolderName || bill.accountDetails?.accountHolderName || '',
        paymentHandle: updates.accountDetails.paymentHandle || bill.accountDetails?.paymentHandle || '',
        currency: updates.accountDetails.currency || bill.accountDetails?.currency || bill.currency,
      };
    }

    await bill.save();

    // Send update notifications
    const updaterName = req.user?.fullName || bill.createdByName || 'Someone';
    for (const participant of bill.participants) {
      try {
        await sendBillUpdatedEmail(
          participant.email,
          participant.name,
          bill.billName,
          bill.billId,
          participant.amountOwed,
          bill.currency,
          updaterName
        );
      } catch (emailError) {
        console.error(`Failed to send email to ${participant.email}:`, emailError);
      }
    }

    sendSuccess(
      res,
      StatusCodes.OK,
      'Bill updated successfully! Notifications sent to all participants.',
      {
        bill: {
          id: bill._id,
          billId: bill.billId,
          billName: bill.billName,
          totalAmount: bill.totalAmount,
          currency: bill.currency,
          participants: bill.participants,
          items: bill.items,
          splitMethod: bill.splitMethod,
          notes: bill.notes,
          accountDetails: bill.accountDetails, // Include account details in response
          isSettled: bill.isSettled,
          updatedAt: bill.updatedAt,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark participant payment status
 * @route PATCH /api/bills/:billId/payment
 * @access Public
 */
export const markPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { billId } = req.params;
    const { participantEmail, isPaid }: MarkPaymentRequest = req.body;

    const bill = await Bill.findOne({ billId });

    if (!bill) {
      sendError(
        res,
        StatusCodes.NOT_FOUND,
        'Bill not found. Unable to update payment status.',
        'Invalid bill ID'
      );
      return;
    }

    // Find participant
    const participant = bill.participants.find(
      (p) => p.email.toLowerCase() === participantEmail.toLowerCase()
    );

    if (!participant) {
      sendError(
        res,
        StatusCodes.NOT_FOUND,
        'Participant not found in this bill.',
        'Invalid participant email'
      );
      return;
    }

    // Update payment status
    participant.isPaid = isPaid;
    participant.paidAt = isPaid ? new Date() : undefined;

    await bill.save();

    // Send notifications to other participants
    const otherParticipants = bill.participants.filter(
      (p) => p.email.toLowerCase() !== participantEmail.toLowerCase()
    );

    for (const otherParticipant of otherParticipants) {
      try {
        await sendPaymentMarkedEmail(
          otherParticipant.email,
          otherParticipant.name,
          bill.billName,
          bill.billId,
          participant.name,
          participant.amountOwed,
          bill.currency
        );
      } catch (emailError) {
        console.error(`Failed to send email to ${otherParticipant.email}:`, emailError);
      }
    }

    // Check if bill is now settled
    if (bill.isSettled && isPaid) {
      // Send settlement notification to all participants
      for (const p of bill.participants) {
        try {
          await sendBillSettledEmail(
            p.email,
            p.name,
            bill.billName,
            bill.billId,
            bill.totalAmount,
            bill.currency
          );
        } catch (emailError) {
          console.error(`Failed to send email to ${p.email}:`, emailError);
        }
      }
    }

    sendSuccess(
      res,
      StatusCodes.OK,
      isPaid
        ? 'Payment marked as complete successfully! Other participants have been notified.'
        : 'Payment status updated successfully.',
      {
        bill: {
          id: bill._id,
          billId: bill.billId,
          isSettled: bill.isSettled,
          settledAt: bill.settledAt,
          participants: bill.participants,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete bill
 * @route DELETE /api/bills/:billId
 * @access Private (creator only)
 */
export const deleteBill = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { billId } = req.params;
    const userId = req.user?.id;

    const bill = await Bill.findOne({ billId });

    if (!bill) {
      sendError(
        res,
        StatusCodes.NOT_FOUND,
        'Bill not found. Unable to delete.',
        'Invalid bill ID'
      );
      return;
    }

    // Check if user is the creator
    if (bill.createdBy && bill.createdBy.toString() !== userId) {
      sendError(
        res,
        StatusCodes.FORBIDDEN,
        'You do not have permission to delete this bill. Only the creator can delete it.',
        'Unauthorized'
      );
      return;
    }

    await Bill.deleteOne({ billId });

    sendSuccess(
      res,
      StatusCodes.OK,
      'Bill deleted successfully.',
      null
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get bill statistics for authenticated user
 * @route GET /api/bills/stats
 * @access Private
 */
export const getBillStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const totalBills = await Bill.countDocuments({ createdBy: userId });
    const settledBills = await Bill.countDocuments({ createdBy: userId, isSettled: true });
    const pendingBills = totalBills - settledBills;

    const bills = await Bill.find({ createdBy: userId });
    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    sendSuccess(
      res,
      StatusCodes.OK,
      'Bill statistics retrieved successfully.',
      {
        stats: {
          totalBills,
          settledBills,
          pendingBills,
          totalAmount: Math.round(totalAmount * 100) / 100,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};