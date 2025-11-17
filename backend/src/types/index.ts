import { Request } from 'express';
import { Document } from 'mongoose';

// Enums
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OFFICER = 'OFFICER'
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// User Types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer extends Document {
  _id: string;
  userId: string | IUser;
  income?: number;
  creditScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoanOfficer extends Document {
  _id: string;
  userId: string | IUser;
  branch?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoanApplication extends Document {
  _id: string;
  customerId: string | ICustomer;
  officerId?: string | ILoanOfficer;
  amountRequested: number;
  tenureMonths: number;
  interestRate?: number;
  status: LoanStatus;
  eligibilityScore?: number;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request Types
export interface AuthRequest extends Request {
  user?: IUser;
}

// DTO Types
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  income?: number;
  creditScore?: number;
  branch?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoanApplicationDTO {
  customerId: string;
  amountRequested: number;
  tenureMonths: number;
}

export interface LoanReviewDTO {
  action: 'APPROVED' | 'REJECTED';
  remarks?: string;
}

export interface LoanReviewRequest {
  action: 'APPROVED' | 'REJECTED';
  remarks?: string;
}

export interface UpdateCustomerDTO {
  income?: number;
  creditScore?: number;
}

export interface UpdateOfficerDTO {
  branch?: string;
}

// Response Types
export interface AuthResponse {
  token: string;
  userId: string;
  role: UserRole;
}

export interface LoanApplicationResponse {
  message: string;
  loanId: string;
  status: LoanStatus;
  eligibilityScore?: number;
  interestRate?: number;
  emi?: number;
}

// Service Types
export interface EligibilityResult {
  eligibilityScore: number;
  status: LoanStatus;
  interestRate: number;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}