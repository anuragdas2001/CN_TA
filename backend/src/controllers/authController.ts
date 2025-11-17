import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Customer, LoanOfficer } from "../models";
import { RegisterDTO, LoginDTO, AuthResponse, UserRole } from "../types";

export class AuthController {
  // Generate JWT Token
  private static generateToken(userId: string, role: UserRole): string {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
  }

  // @desc    Register user
  // @route   POST /auth/register
  // @access  Public
  static async register(
    req: Request<{}, {}, RegisterDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password, role, income, creditScore, branch } =
        req.body;

      // Validate required fields
      if (!name || !email || !password || !role) {
        res.status(400).json({
          message: "Please provide name, email, password, and role",
        });
        return;
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res
          .status(400)
          .json({ message: "User already exists with this email" });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({
        name,
        email,
        passwordHash,
        role,
      });

      // Create role-specific profile
      if (role === UserRole.CUSTOMER) {
        await Customer.create({
          userId: user._id,
          income: income || 0,
          creditScore: creditScore || 300,
        });
      } else if (role === UserRole.OFFICER) {
        await LoanOfficer.create({
          userId: user._id,
          branch: branch || "",
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: user._id,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Login user
  // @route   POST /auth/login
  // @access  Public
  static async login(
    req: Request<{}, {}, LoginDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate
      if (!email || !password) {
        res.status(400).json({
          message: "Please provide email and password",
        });
        return;
      }

      // Check for user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Create token
      const token = AuthController.generateToken(user._id, user.role);

      const response: AuthResponse = {
        token,
        userId: user._id,
        role: user.role,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
