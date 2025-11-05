import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


// Account Details Interface
export interface IAccountDetails {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  paymentHandle?: string; // e.g. PayPal, CashApp, Venmo, etc.
  currency?: string;
}

// Bill Participant Interface
export interface IParticipant {
  participantId?: string;
  name: string;
  email: string;
  amountOwed: number;
  isPaid: boolean;
  paidAt?: Date;
}

// Bill Item Interface
export interface IBillItem {
  description: string;
  amount: number;
  paidBy: string; // participant name or email
  splitBetween: string[]; // array of participant names/emails
}

// Split Method Types
export enum SplitMethod {
  EQUAL = 'equal',
  PERCENTAGE = 'percentage',
  CUSTOM = 'custom',
  ITEM_BASED = 'itemBased'
}

// Bill Interface
export interface IBill extends Document {
  _id: Types.ObjectId;
  billId: string; // unique identifier for sharing
  billName: string;
  totalAmount: number;
  currency: string;
  createdBy?: Types.ObjectId | string; // optional user reference
  createdByEmail?: string; // for guest users
  createdByName?: string; // for guest users
  participants: IParticipant[];
  items?: IBillItem[];
  splitMethod: SplitMethod;
  notes?: string;

  // Account Details
  accountDetails?: IAccountDetails;

  isSettled: boolean;
  settledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // for guest bills
}

// Custom percentage split
export interface ICustomSplit {
  participantEmail: string;
  percentage?: number; // for percentage split
  amount?: number; // for custom amount split
}

// Request with user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
}

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

// Bill Creation Request
export interface CreateBillRequest {
  billName: string;
  totalAmount: number;
  currency?: string;
  participants: Array<{
    name: string;
    email: string;
  }>;
  items?: IBillItem[];
  splitMethod: SplitMethod;
  customSplits?: ICustomSplit[];
  notes?: string;
  createdByName?: string;
  createdByEmail?: string;
  accountDetails?: IAccountDetails; // NEW: Account details in create request
}

// Bill Update Request
export interface UpdateBillRequest {
  billName?: string;
  totalAmount?: number;
  participants?: Array<{
    name: string;
    email: string;
  }>;
  items?: IBillItem[];
  splitMethod?: SplitMethod;
  customSplits?: ICustomSplit[];
  notes?: string;
  accountDetails?: IAccountDetails; // NEW: Account details in update request
}

// Mark Payment Request
export interface MarkPaymentRequest {
  participantEmail: string;
  isPaid: boolean;
}

// Email Data Interface
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Pagination Interface
export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}

// Pagination Result
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}