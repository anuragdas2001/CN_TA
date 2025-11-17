import { Response, NextFunction } from "express";
import { Customer, User } from "../models";
import { AuthRequest } from "../types";

export class CustomerController {
  // @desc    Get customer profile
  // @route   GET /customer/profile
  // @access  Private (Customer only)
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // If an ID param is provided, fetch by customer _id; otherwise fetch profile for current user
      const customer = req.params.id
        ? await Customer.findById(req.params.id).populate(
            "userId",
            "name email role createdAt updatedAt"
          )
        : await Customer.findOne({ userId: req.user?._id }).populate(
            "userId",
            "name email role createdAt updatedAt"
          );

      if (!customer) {
        return res.status(404).json({ message: "Customer profile not found" });
      }

      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update customer profile
  // @route   PUT /customer/profile
  // @access  Private (Customer only)
  static async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { income, creditScore } = req.body;

      const updateData: any = {};
      if (income !== undefined) updateData.income = income;
      if (creditScore !== undefined) updateData.creditScore = creditScore;

      // Find and update customer profile
      const customer = await Customer.findOneAndUpdate(
        { userId: req.user?._id },
        updateData,
        { new: true, runValidators: true }
      ).populate("userId", "name email role createdAt updatedAt");

      if (!customer) {
        res.status(404).json({ message: "Customer profile not found" });
        return;
      }

      res.json({
        message: "Profile updated successfully",
        customer,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get customer details by ID
  // @route   GET /customer/:id
  // @access  Private
  static async getCustomerById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("req.params.id", req.params.id);
      const customer = await Customer.findById(req.params.id).populate(
        "userId",
        "name email role"
      );
      console.log("customer", customer);
      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }

      res.json(customer);
    } catch (error) {
      next(error);
    }
  }
  static async getUserProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;

      // Fetch user (basic information)
      const user = await User.findById(userId).select("-passwordHash");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Fetch linked customer profile
      const customer = await Customer.findOne({ userId });

      res.json({
        user,
        customer,
      });
    } catch (error) {
      next(error);
    }
  }
}
