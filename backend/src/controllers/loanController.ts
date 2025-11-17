import { Response, NextFunction } from 'express';
import { LoanApplication, Customer } from '../models';
import { LoanService } from '../services/loanService';
import { AuthRequest, LoanApplicationDTO, LoanApplicationResponse, LoanStatus } from '../types';

export class LoanController {
  // @desc    Apply for a loan
  // @route   POST /loans/apply
  // @access  Private (Customer only)
  static async applyForLoan(
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    try {
      const { customerId, amountRequested, tenureMonths } = req.body;

      // Validate required fields
      if (!customerId || !amountRequested || !tenureMonths) {
        res.status(400).json({ 
          message: 'Please provide customerId, amountRequested, and tenureMonths' 
        });
        return;
      }

      // Verify customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }

      // Verify the requesting user is the customer
      if (customer.userId.toString() !== req.user?._id.toString()) {
        res.status(403).json({ 
          message: 'You can only apply for loans for your own account' 
        });
        return;
      }

      // Create loan application
      const loanApplication = await LoanApplication.create({
        customerId,
        amountRequested,
        tenureMonths,
        status: LoanStatus.PENDING
      });

      // Automatically evaluate the loan
      const evaluatedLoan = await LoanService.evaluateLoan(loanApplication._id);

      // Calculate EMI if approved
      let emi: number | undefined;
      if (evaluatedLoan.status === LoanStatus.APPROVED && evaluatedLoan.interestRate) {
        emi = LoanService.calculateEMI(
          amountRequested, 
          evaluatedLoan.interestRate, 
          tenureMonths
        );
      }

      const response: LoanApplicationResponse = {
        message: 'Loan application submitted',
        loanId: evaluatedLoan._id,
        status: evaluatedLoan.status,
        eligibilityScore: evaluatedLoan.eligibilityScore,
        interestRate: evaluatedLoan.interestRate,
        emi
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get loan status
  // @route   GET /loans/:id/status
  // @access  Private
  static async getLoanStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const loan = await LoanApplication.findById(req.params.id)
        .populate({
          path: 'customerId',
          populate: { path: 'userId', select: 'name email' }
        })
        .populate({
          path: 'officerId',
          populate: { path: 'userId', select: 'name email' }
        });

      if (!loan) {
        res.status(404).json({ message: 'Loan application not found' });
        return;
      }

      // Calculate EMI if loan is approved
      let emi: number | undefined;
      if (loan.status === LoanStatus.APPROVED && loan.interestRate) {
        emi = LoanService.calculateEMI(
          loan.amountRequested,
          loan.interestRate,
          loan.tenureMonths
        );
      }

      res.json({
        loanId: loan._id,
        status: loan.status,
        eligibilityScore: loan.eligibilityScore,
        amountRequested: loan.amountRequested,
        tenureMonths: loan.tenureMonths,
        interestRate: loan.interestRate,
        emi,
        remarks: loan.remarks,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
        customer: loan.customerId,
        officer: loan.officerId
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get all loans for a customer
  // @route   GET /loans/my-applications
  // @access  Private (Customer only)
  static async getMyApplications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Find customer profile
      const customer = await Customer.findOne({ userId: req.user?._id });
      
      if (!customer) {
        res.status(404).json({ message: 'Customer profile not found' });
        return;
      }

      // Get all loan applications for this customer
      const loans = await LoanApplication.find({ customerId: customer._id })
        .populate({
          path: 'officerId',
          populate: { path: 'userId', select: 'name email' }
        })
        .sort({ createdAt: -1 });

      res.json({
        count: loans.length,
        loans
      });
    } catch (error) {
      next(error);
    }
  }
}