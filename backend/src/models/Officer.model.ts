import mongoose from 'mongoose';


const LoanOfficerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
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

module.exports = mongoose.model('LoanOfficer', LoanOfficerSchema);