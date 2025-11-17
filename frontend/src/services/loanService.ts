import api from "./api";

function calculateEMI(
  amount: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const n = tenureMonths;
  if (monthlyRate === 0) return amount / n;
  const factor = Math.pow(1 + monthlyRate, n);
  const emi = (amount * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

export const loanService = {
  getMyApplications: async () => {
    const response = await api.get("/loans/my-applications");
    return response.data;
  },

  applyForLoan: async (data: {
    customerId: string;
    amountRequested: number;
    tenureMonths: number;
  }) => {
    const response = await api.post("/loans/apply", data);
    return response.data;
  },

  calculateEMI,
};

export default loanService;
