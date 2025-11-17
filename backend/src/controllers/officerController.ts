import { Response, NextFunction } from "express";
import { LoanApplication, LoanOfficer } from "../models";
import { LoanService } from "../services/loanService";
import { AuthRequest, LoanStatus } from "../types";

export class OfficerController {

  // --------------------------------------------------------
  // GET /officer/profile  (Logged-in Officer's Profile)
  // --------------------------------------------------------
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const officer = await LoanOfficer.findOne({
        userId: req.user?._id,
      }).populate("userId", "name email role");

      if (!officer) {
        return res.status(404).json({ message: "Officer profile not found" });
      }

      res.json(officer);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------------
  // GET /officer/userprofile/:id  (Officer by USER ID)
  // --------------------------------------------------------
  static async getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const officer = await LoanOfficer.findOne({
        userId: req.params.id,
      }).populate("userId", "name email role");

      if (!officer) {
        return res.status(404).json({ message: "Officer not found" });
      }

      res.json(officer);
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------------
  // PUT /officer/profile   (Update logged-in officer)
  // --------------------------------------------------------
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { branch } = req.body;

      const officer = await LoanOfficer.findOneAndUpdate(
        { userId: req.user?._id },
        { branch },
        { new: true, runValidators: true }
      ).populate("userId", "name email role");

      if (!officer) {
        return res.status(404).json({ message: "Officer profile not found" });
      }

      res.json({
        message: "Profile updated successfully",
        officer,
      });
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------------
  // GET /officer/loans/pending
  // --------------------------------------------------------
  static async getPendingLoans(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const loans = await LoanApplication.find({ status: LoanStatus.PENDING })
        .populate({
          path: "customerId",
          populate: { path: "userId", select: "name email" },
        })
        .sort({ createdAt: -1 });

      res.json({
        count: loans.length,
        loans,
      });
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------------
  // GET /officer/loans   (all loans with pagination + filtering)
  // --------------------------------------------------------
  static async getAllLoans(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, page = "1", limit = "10" } = req.query;

      const query: any = {};
      if (status) query.status = status;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const loans = await LoanApplication.find(query)
        .populate({
          path: "customerId",
          populate: { path: "userId", select: "name email" },
        })
        .populate({
          path: "officerId",
          populate: { path: "userId", select: "name email" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const total = await LoanApplication.countDocuments(query);

      res.json({
        count: loans.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        loans,
      });
    } catch (error) {
      next(error);
    }
  }

  // --------------------------------------------------------
  // POST /officer/loans/:id/review
  // --------------------------------------------------------
  static async reviewLoan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { action, remarks } = req.body;

      if (!["APPROVED", "REJECTED"].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }

      const loan = await LoanApplication.findById(req.params.id).populate({
        path: "customerId",
        populate: { path: "userId" },
      });

      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      const officer = await LoanOfficer.findOne({ userId: req.user?._id });
      if (!officer) {
        return res.status(404).json({ message: "Officer not found" });
      }

      loan.status = action as LoanStatus;
      loan.officerId = officer._id;
      loan.remarks = remarks || "";

      // Re-evaluate if manually approving
      if (action === "APPROVED" && !loan.eligibilityScore) {
        const evaluated = await LoanService.evaluateLoan(loan._id);
        loan.eligibilityScore = evaluated.eligibilityScore;
        loan.interestRate = evaluated.interestRate;
      }

      await loan.save();

      // Calculate EMI
      const emi =
        loan.status === LoanStatus.APPROVED && loan.interestRate
          ? LoanService.calculateEMI(
              loan.amountRequested,
              loan.interestRate,
              loan.tenureMonths
            )
          : undefined;

      res.json({
        message: `Loan ${loan.status.toLowerCase()} successfully`,
        loan: {
          loanId: loan._id,
          status: loan.status,
          eligibilityScore: loan.eligibilityScore,
          interestRate: loan.interestRate,
          emi,
          remarks: loan.remarks,
          officerId: loan.officerId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
