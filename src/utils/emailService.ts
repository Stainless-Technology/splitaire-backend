import nodemailer from 'nodemailer';
import config from '../config/config';
import { EmailData } from '../types';
import { formatCurrency } from './billCalculations';

/**
 * Create email transporter
 */

console.log("Here u gp",config.email);

const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
};

/**
 * Send email
 */
export const sendEmail = async (emailData: EmailData): Promise<void> => {
  try {
    // Skip sending email if credentials are not configured
    if (!config.email.user || !config.email.password) {
      console.log('📧 Email service not configured. Email not sent to:', emailData.to);
      console.log('📧 Subject:', emailData.subject);
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `Bill Splitter <${config.email.from}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    // Don't throw error to prevent email failures from breaking the application
  }
};

/**
 * Send bill created notification
 */
export const sendBillCreatedEmail = async (
  recipientEmail: string,
  recipientName: string,
  billName: string,
  billId: string,
  amountOwed: number,
  currency: string,
  createdBy: string
): Promise<void> => {
  const billUrl = `${config.frontendUrl}/bill/${billId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .amount { font-size: 32px; font-weight: bold; color: #4F46E5; margin: 20px 0; }
        .button { display: inline-block; background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 New Bill to Split</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p><strong>${createdBy}</strong> has created a new bill that involves you:</p>
          <h2>${billName}</h2>
          <div class="amount">${formatCurrency(amountOwed, currency)}</div>
          <p>This is your share of the total bill.</p>
          <p style="text-align: center;">
            <a href="${billUrl}" class="button">View Bill Details</a>
          </p>
          <p>You can view the complete breakdown, mark your payment as complete, and see who else is involved in splitting this bill.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Bill Splitter.</p>
          <p>If you have any questions, please contact ${createdBy} directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: recipientEmail,
    subject: `New bill to split: ${billName}`,
    html,
  });
};

/**
 * Send bill updated notification
 */
export const sendBillUpdatedEmail = async (
  recipientEmail: string,
  recipientName: string,
  billName: string,
  billId: string,
  newAmountOwed: number,
  currency: string,
  updatedBy: string
): Promise<void> => {
  const billUrl = `${config.frontendUrl}/bill/${billId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .amount { font-size: 32px; font-weight: bold; color: #F59E0B; margin: 20px 0; }
        .button { display: inline-block; background-color: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 Bill Updated</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p><strong>${updatedBy}</strong> has updated the bill:</p>
          <h2>${billName}</h2>
          <div class="amount">${formatCurrency(newAmountOwed, currency)}</div>
          <p>Your new share of the bill is shown above.</p>
          <p style="text-align: center;">
            <a href="${billUrl}" class="button">View Updated Bill</a>
          </p>
          <p>Please review the changes and ensure everything looks correct.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Bill Splitter.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: recipientEmail,
    subject: `Bill updated: ${billName}`,
    html,
  });
};

/**
 * Send payment marked notification
 */
export const sendPaymentMarkedEmail = async (
  recipientEmail: string,
  recipientName: string,
  billName: string,
  billId: string,
  participantName: string,
  amountPaid: number,
  currency: string
): Promise<void> => {
  const billUrl = `${config.frontendUrl}/bill/${billId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .amount { font-size: 32px; font-weight: bold; color: #10B981; margin: 20px 0; }
        .button { display: inline-block; background-color: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Received</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>Great news! <strong>${participantName}</strong> has marked their payment as complete for:</p>
          <h2>${billName}</h2>
          <div class="amount">${formatCurrency(amountPaid, currency)}</div>
          <p style="text-align: center;">
            <a href="${billUrl}" class="button">View Bill Status</a>
          </p>
          <p>Check the bill to see the current payment status of all participants.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Bill Splitter.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: recipientEmail,
    subject: `Payment marked for: ${billName}`,
    html,
  });
};

/**
 * Send bill settled notification
 */
export const sendBillSettledEmail = async (
  recipientEmail: string,
  recipientName: string,
  billName: string,
  billId: string,
  totalAmount: number,
  currency: string
): Promise<void> => {
  const billUrl = `${config.frontendUrl}/bill/${billId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8B5CF6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; text-align: center; }
        .amount { font-size: 32px; font-weight: bold; color: #8B5CF6; margin: 20px 0; }
        .celebration { font-size: 48px; margin: 20px 0; }
        .button { display: inline-block; background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bill Fully Settled!</h1>
        </div>
        <div class="content">
          <div class="celebration">🎊 🥳 🎊</div>
          <p>Hi ${recipientName},</p>
          <p>Excellent news! The bill has been fully settled:</p>
          <h2>${billName}</h2>
          <div class="amount">${formatCurrency(totalAmount, currency)}</div>
          <p><strong>All participants have marked their payments as complete!</strong></p>
          <p style="text-align: center;">
            <a href="${billUrl}" class="button">View Final Bill</a>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated message from Bill Splitter.</p>
          <p>Thank you for using our service!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: recipientEmail,
    subject: `Bill settled: ${billName} 🎉`,
    html,
  });
};
