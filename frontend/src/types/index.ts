// User & Auth Types
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OFFICER = 'OFFICER'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  income?: number;
  creditScore?: number;
  branch?: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  role: UserRole;
}

// Customer Types
export interface Customer {
  _id: string;
  userId: User;
  income?: number;
  creditScore?: number;
  createdAt: string;
  updatedAt: string;
}

// Loan Officer Types
export interface LoanOfficer {
  _id: string;
  userId: User;
  branch?: string;
  createdAt: string;
  updatedAt: string;
}

// Loan Types
export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface LoanApplication {
  _id: string;
  customerId: Customer;
  officerId?: LoanOfficer;
  amountRequested: number;
  tenureMonths: number;
  interestRate?: number;
  status: LoanStatus;
  eligibilityScore?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplicationRequest {
  customerId: string;
  amountRequested: number;
  tenureMonths: number;
}

export interface LoanReviewRequest {
  action: 'APPROVED' | 'REJECTED';
  remarks?: string;
}

export interface LoanStatusResponse {
  loanId: string;
  status: LoanStatus;
  eligibilityScore?: number;
  amountRequested: number;
  tenureMonths: number;
  interestRate?: number;
  emi?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  officer?: LoanOfficer;
}

// API Response Types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}