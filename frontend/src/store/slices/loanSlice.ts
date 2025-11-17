import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store';

interface LoanApplication {
  _id: string;
  customerId: string;
  officerId?: string;
  amountRequested: number;
  tenureMonths: number;
  interestRate?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  eligibilityScore?: number;
  createdAt: string;
}

interface LoanState {
  applications: LoanApplication[];
  currentLoan: LoanApplication | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoanState = {
  applications: [],
  currentLoan: null,
  loading: false,
  error: null,
};

// Helper to get auth token from state
const getAuthToken = (getState: () => unknown) => {
  const state = getState() as RootState;
  return state.auth.token;
};

// ============================================
// ASYNC THUNKS
// ============================================

// Apply for Loan
export const applyForLoan = createAsyncThunk(
  'loan/apply',
  async (
    loanData: {
      customerId: string;
      amountRequested: number;
      tenureMonths: number;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getAuthToken(getState);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/loans/apply`,
        loanData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Application failed'
      );
    }
  }
);

// Fetch Loan Status
export const fetchLoanStatus = createAsyncThunk(
  'loan/fetchStatus',
  async (loanId: string, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/loans/${loanId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch loan status'
      );
    }
  }
);

// Fetch All Customer Loans
export const fetchCustomerLoans = createAsyncThunk(
  'loan/fetchCustomerLoans',
  async (customerId: string, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/loans/customer/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch loans'
      );
    }
  }
);

// Fetch Pending Loans (Officer)
export const fetchPendingLoans = createAsyncThunk(
  'loan/fetchPending',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/officer/loans/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch pending loans'
      );
    }
  }
);

// Review Loan (Officer)
export const reviewLoan = createAsyncThunk(
  'loan/review',
  async (
    { loanId, status }: { loanId: string; status: 'APPROVED' | 'REJECTED' },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getAuthToken(getState);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/officer/loans/${loanId}/review`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to review loan'
      );
    }
  }
);

// ============================================
// SLICE
// ============================================

const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLoan: (state) => {
      state.currentLoan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply for Loan
      .addCase(applyForLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
      })
      .addCase(applyForLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Loan Status
      .addCase(fetchLoanStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoanStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLoan = action.payload;
      })
      .addCase(fetchLoanStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Customer Loans
      .addCase(fetchCustomerLoans.fulfilled, (state, action) => {
        state.applications = action.payload;
      })
      // Fetch Pending Loans
      .addCase(fetchPendingLoans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchPendingLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Review Loan
      .addCase(reviewLoan.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          (loan) => loan._id === action.payload._id
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentLoan } = loanSlice.actions;
export default loanSlice.reducer;
