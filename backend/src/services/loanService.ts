import { LoanApplication, Customer } from "../models";
import {
  ILoanApplication,
  ICustomer,
  LoanStatus,
  EligibilityResult,
} from "../types";

export class LoanService {
  /**
   * Evaluates loan application eligibility
   */
  static async evaluateLoan(applicationId: string): Promise<ILoanApplication> {
    try {
      // Fetch application with customer data
      const application = await LoanApplication.findById(
        applicationId
      ).populate({
        path: "customerId",
        populate: { path: "userId" },
      });

      if (!application) {
        throw new Error("Loan application not found");
      }

      const customer = application.customerId as ICustomer;

      // Get customer's income and credit score
      const income = customer.income || 0;
      const creditScore = customer.creditScore || 300;
      const amountRequested = application.amountRequested;

      // Define normalization ranges
      const MIN_INCOME = 0;
      const MAX_INCOME = 10000000; // 1 crore
      const MIN_CREDIT_SCORE = 300;
      const MAX_CREDIT_SCORE = 850;

      // Normalize income (0-1 scale)
      const incomeNorm = Math.min(
        Math.max((income - MIN_INCOME) / (MAX_INCOME - MIN_INCOME), 0),
        1
      );

      // Normalize credit score (0-1 scale)
      const creditScoreNorm = Math.min(
        Math.max(
          (creditScore - MIN_CREDIT_SCORE) /
            (MAX_CREDIT_SCORE - MIN_CREDIT_SCORE),
          0
        ),
        1
      );

      // Calculate eligibility score: 60% credit score + 40% income
      const eligibilityScore = 0.6 * creditScoreNorm + 0.4 * incomeNorm;

      // Determine loan-to-income ratio factor
      const loanToIncomeRatio =
        income > 0 ? amountRequested / income : Infinity;

      // Dynamic threshold based on loan amount and income
      let threshold = 0.5; // Base threshold

      // Adjust threshold based on loan-to-income ratio
      if (loanToIncomeRatio > 10) {
        threshold = 0.7; // High risk - need higher score
      } else if (loanToIncomeRatio > 5) {
        threshold = 0.6; // Moderate risk
      } else if (loanToIncomeRatio <= 3) {
        threshold = 0.4; // Lower risk - easier approval
      }

      // Determine status based on eligibility score
      let status: LoanStatus = LoanStatus.PENDING;
      if (eligibilityScore > threshold) {
        status = LoanStatus.APPROVED;
      } else if (eligibilityScore === threshold) {
        status = LoanStatus.PENDING;
      } else {
        status = LoanStatus.PENDING;
      }

      // Calculate interest rate based on eligibility score
      const baseRate = 8.5;
      const interestRate = Math.max(baseRate - eligibilityScore * 3, 5.5);

      // Update application
      application.eligibilityScore = parseFloat(eligibilityScore.toFixed(4));
      application.status = status;
      application.interestRate = parseFloat(interestRate.toFixed(2));

      await application.save();

      return application;
    } catch (error) {
      console.error("Error evaluating loan:", error);
      throw error;
    }
  }

  /**
   * Calculate EMI (Equated Monthly Installment)
   */
  static calculateEMI(
    principal: number,
    annualRate: number,
    tenureMonths: number
  ): number {
    const monthlyRate = annualRate / 12 / 100;

    if (monthlyRate === 0) {
      return principal / tenureMonths;
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return parseFloat(emi.toFixed(2));
  }

  /**
   * Calculate total repayment amount
   */
  static calculateTotalRepayment(
    principal: number,
    annualRate: number,
    tenureMonths: number
  ): number {
    const emi = this.calculateEMI(principal, annualRate, tenureMonths);
    return parseFloat((emi * tenureMonths).toFixed(2));
  }
}
