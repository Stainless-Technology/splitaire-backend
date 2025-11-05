import { EmailData } from '../types';
/**
 * Send email
 */
export declare const sendEmail: (emailData: EmailData) => Promise<void>;
/**
 * Send bill created notification
 */
export declare const sendBillCreatedEmail: (recipientEmail: string, recipientName: string, billName: string, billId: string, amountOwed: number, currency: string, createdBy: string) => Promise<void>;
/**
 * Send bill updated notification
 */
export declare const sendBillUpdatedEmail: (recipientEmail: string, recipientName: string, billName: string, billId: string, newAmountOwed: number, currency: string, updatedBy: string) => Promise<void>;
/**
 * Send payment marked notification
 */
export declare const sendPaymentMarkedEmail: (recipientEmail: string, recipientName: string, billName: string, billId: string, participantName: string, amountPaid: number, currency: string) => Promise<void>;
/**
 * Send bill settled notification
 */
export declare const sendBillSettledEmail: (recipientEmail: string, recipientName: string, billName: string, billId: string, totalAmount: number, currency: string) => Promise<void>;
//# sourceMappingURL=emailService.d.ts.map