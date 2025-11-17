import mongoose from 'mongoose';


const LoanApplicationSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  officerId: { 
    type: mongoose.Schema.Types.ObjectId, 
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
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
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

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);