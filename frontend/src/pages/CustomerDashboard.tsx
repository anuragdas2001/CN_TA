import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import loanService from "@/services/loanService";
import { customerService } from "@/services/customerService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/shared/Loader";
import type { LoanApplication, Customer } from "@/types";
import {
  FileText,
  IndianRupee,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const CustomerDashboard = () => {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  // const [, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Customer | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [loansData, fullProfile] = await Promise.all([
        loanService.getMyApplications(),
        customerService.getUserDetails(id!),
      ]);

      setLoans(loansData.loans);
      // setUser(fullProfile.user);
      setProfile(fullProfile.customer);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (isLoading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your loan applications</p>
        </div>
        {/* <Link to="/customer/apply">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Apply for Loan</span>
          </Button>
        </Link> */}
      </div>

      {/* Profile Stats */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Annual Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">
                  {formatCurrency(profile.income || 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">
                  {profile.creditScore || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">{loans.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loan Applications */}
      <Card>
        <CardHeader>
          <CardTitle>My Loan Applications</CardTitle>
          <CardDescription>
            Track the status of your loan applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by applying for your first loan
              </p>
              <Link to="/customer/apply">
                <Button>Apply Now</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {formatCurrency(loan.amountRequested)}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {loan.tenureMonths} months
                      </p>
                    </div>
                    <Badge className={getStatusColor(loan.status)}>
                      {loan.status}
                    </Badge>
                  </div>

                  {loan.eligibilityScore && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        Eligibility Score:{" "}
                        <span className="font-semibold">
                          {(loan.eligibilityScore * 100).toFixed(2)}%
                        </span>
                      </p>
                    </div>
                  )}

                  {loan.interestRate && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        Interest Rate:{" "}
                        <span className="font-semibold">
                          {loan.interestRate}% per annum
                        </span>
                      </p>
                    </div>
                  )}

                  {loan.remarks && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Remarks:</span>{" "}
                        {loan.remarks}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      Applied on {new Date(loan.createdAt).toLocaleDateString()}
                    </p>
                    {/* <Link to={`/loans/${loan._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
