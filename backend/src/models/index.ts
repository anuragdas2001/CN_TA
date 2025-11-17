import mongoose, { Schema } from 'mongoose';
import { IUser, ICustomer, ILoanOfficer, ILoanApplication, UserRole, LoanStatus } from '../types';

// User Model
const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    required: [true, 'Role is required'] 
  }
}, { 
  timestamps: true 
});

// Customer Model
const CustomerSchema = new Schema<ICustomer>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  income: { 
    type: Number,
    min: [0, 'Income cannot be negative']
  },
  creditScore: { 
    type: Number,
    min: [300, 'Credit score must be at least 300'],
    max: [850, 'Credit score cannot exceed 850']
  }
}, {
  timestamps: true
});

// Loan Officer Model
const LoanOfficerSchema = new Schema<ILoanOfficer>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  branch: { 
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Loan Application Model
const LoanApplicationSchema = new Schema<ILoanApplication>({
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  officerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'LoanOfficer' 
  },
  amountRequested: { 
    type: Number, 
    required: [true, 'Loan amount is required'],
    min: [1000, 'Minimum loan amount is 1000']
  },
  tenureMonths: { 
    type: Number, 
    required: [true, 'Tenure is required'],
    min: [6, 'Minimum tenure is 6 months'],
    max: [360, 'Maximum tenure is 360 months']
  },
  interestRate: { 
    type: Number,
    default: 0
  },
  status: { 
    type: String, 
    enum: Object.values(LoanStatus), 
    default: LoanStatus.PENDING 
  },
  eligibilityScore: { 
    type: Number,
    min: 0,
    max: 1
  },
  remarks: {
    type: String
  }
}, { 
  timestamps: true 
});

// Export Models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export const LoanOfficer = mongoose.model<ILoanOfficer>('LoanOfficer', LoanOfficerSchema);
export const LoanApplication = mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);