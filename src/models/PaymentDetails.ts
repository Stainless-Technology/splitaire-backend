import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentMethod {
  type: 'bank_account' | 'paypal' | 'venmo' | 'cashapp' | 'zelle' | 'crypto' | 'other';
  label: string;
  details: {
    // For bank accounts
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    routingNumber?: string;
    
    // For payment apps
    username?: string;
    phoneNumber?: string;
    email?: string;
    
    // For crypto
    walletAddress?: string;
    network?: string;
    
    // Additional info
    instructions?: string;
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface IPaymentDetails extends Document {
  userId: mongoose.Types.ObjectId;
  paymentMethods: IPaymentMethod[];
  defaultCurrency: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentDetailsSchema = new Schema<IPaymentDetails>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ['bank_account', 'paypal', 'venmo', 'cashapp', 'zelle', 'crypto', 'other'],
          required: true,
        },
        label: {
          type: String,
          required: true,
          trim: true,
        },
        details: {
          // For bank accounts
          accountName: { type: String, trim: true },
          accountNumber: { type: String, trim: true },
          bankName: { type: String, trim: true },
          routingNumber: { type: String, trim: true },
          
          // For payment apps
          username: { type: String, trim: true },
          phoneNumber: { type: String, trim: true },
          email: { type: String, trim: true },
          
          // For crypto
          walletAddress: { type: String, trim: true },
          network: { type: String, trim: true },
          
          // Additional info
          instructions: { type: String, trim: true },
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    defaultCurrency: {
      type: String,
      default: 'USD',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one default payment method per user
paymentDetailsSchema.pre('save', function(next) {
  if (this.paymentMethods && this.paymentMethods.length > 0) {
    const defaultMethods = this.paymentMethods.filter((method: IPaymentMethod) => method.isDefault);
    if (defaultMethods.length > 1) {
      // Keep only the first default, set others to false
      this.paymentMethods.forEach((method: IPaymentMethod, index: number) => {
        if (index > 0 && method.isDefault) {
          method.isDefault = false;
        }
      });
    }
  }
  next();
});

const PaymentDetails = mongoose.model<IPaymentDetails>('PaymentDetails', paymentDetailsSchema);

export default PaymentDetails;