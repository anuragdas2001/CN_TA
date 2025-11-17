import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loanService } from "@/services/loanService";
import { customerService } from "@/services/customerService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import Loader from "@/components/shared/Loader";
import { formatCurrency } from "@/utils/formatters";
import { IndianRupee, Calendar, Calculator } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
const ApplyLoan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [formData, setFormData] = useState({
    amountRequested: "",
    tenureMonths: "",
  });
  const [emi, setEmi] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomerId();
  }, []);

  useEffect(() => {
    calculateEMI();
  }, [formData.amountRequested, formData.tenureMonths]);

  const fetchCustomerId = async () => {
    try {
      const profile = await customerService.getProfile();
      setCustomerId(profile._id);
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      toast.error("Failed to load customer profile");
    }
  };

  const calculateEMI = () => {
    const amount = parseFloat(formData.amountRequested);
    const tenure = parseInt(formData.tenureMonths);

    if (amount > 0 && tenure > 0) {
      // Assuming 8.5% interest rate for calculation
      const calculatedEmi = loanService.calculateEMI(amount, 8.5, tenure);
      setEmi(calculatedEmi);
    } else {
      setEmi(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Customer profile not loaded");
      return;
    }

    try {
      setIsLoading(true);
      const response = await loanService.applyForLoan({
        customerId,
        amountRequested: parseFloat(formData.amountRequested),
        tenureMonths: parseInt(formData.tenureMonths),
      });

      toast.success(
        response.message || "Loan application submitted successfully!"
      );
      navigate(`/customer/dashboard/${user?._id}`);
    } catch (error) {
      console.error("Error applying for loan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Apply for Loan</h1>
        <p className="text-gray-600 mt-1">
          Fill in the details to apply for a loan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>
                Enter the amount and tenure for your loan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amountRequested">Loan Amount (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="amountRequested"
                      name="amountRequested"
                      type="number"
                      min="1000"
                      step="1000"
                      placeholder="500000"
                      value={formData.amountRequested}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Minimum amount: ₹1,000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenureMonths">Loan Tenure (Months)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="tenureMonths"
                      name="tenureMonths"
                      type="number"
                      min="6"
                      max="360"
                      placeholder="24"
                      value={formData.tenureMonths}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Duration: 6 to 360 months
                  </p>
                </div>

                <Button variant="outline" type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* EMI Calculator */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>EMI Calculator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emi ? (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">
                      Estimated Monthly EMI
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(emi)}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-semibold">
                        {formatCurrency(parseFloat(formData.amountRequested))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tenure:</span>
                      <span className="font-semibold">
                        {formData.tenureMonths} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-semibold">~8.5% p.a.</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Repayment:</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            emi * parseInt(formData.tenureMonths)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    <p className="font-semibold mb-1">Note:</p>
                    <p>
                      The actual interest rate will be determined based on your
                      credit score and income. This is an estimated calculation
                      at 8.5% p.a.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>Enter loan details to calculate EMI</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;
