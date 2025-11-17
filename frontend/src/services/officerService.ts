import api from "./api";
import type { LoanApplication, LoanOfficer, LoanReviewRequest, User } from "../types";

export const officerService = {
  
  getProfile: async (): Promise<LoanOfficer> => {
    const response = await api.get(`/officer/profile`);
    return response.data;
  },

  getOfficerDetails: async (id: string): 
    Promise<{ user: User; officer: LoanOfficer }> => {
    const response = await api.get(`/officer/userprofile/${id}`);
    return response.data;
  },

  getPendingLoans: async (): Promise<{
    count: number;
    loans: LoanApplication[];
  }> => {
    const response = await api.get("/officer/loans/pending");
    return response.data;
  },

  getAllLoans: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get("/officer/loans", { params });
    return response.data;
  },

  reviewLoan: async (loanId: string, data: LoanReviewRequest) => {
    const response = await api.post(`/officer/loans/${loanId}/review`, data);
    return response.data;
  },

  updateProfile: async (data: { branch?: string }): Promise<LoanOfficer> => {
    const response = await api.put("/officer/profile", data);
    return response.data.officer;
  },
};
