import { useEffect, useState } from "react";
import { officerService } from "@/services/officerService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import type { LoanApplication, LoanOfficer } from "@/types";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useParams } from "react-router-dom";

const OfficerDashboard = () => {
  const [pendingLoans, setPendingLoans] = useState<LoanApplication[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(
    null
  );
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "REJECTED">(
    "APPROVED"
  );
  const [remarks, setRemarks] = useState("");
  const [profile, setProfile] = useState<LoanOfficer | null>(null);
  const { id } = useParams();

  console.log("Officer ID:", id);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pendingData, allData, profileData] = await Promise.all([
        officerService.getPendingLoans(),
        officerService.getAllLoans(),
        officerService.getProfile(),
      ]);

      setPendingLoans(pendingData.loans);
      setProfile(profileData);

      const approved = allData.loans.filter(
        (l: LoanApplication) => l.status === "APPROVED"
      ).length;
      const rejected = allData.loans.filter(
        (l: LoanApplication) => l.status === "REJECTED"
      ).length;

      setStats({
        pending: pendingData.count,
        approved,
        rejected,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedLoan) return;

    try {
      setIsReviewing(true);
      await officerService.reviewLoan(selectedLoan._id, {
        action: reviewAction,
        remarks,
      });

      toast.success(`Loan ${reviewAction.toLowerCase()} successfully!`);
      setSelectedLoan(null);
      setRemarks("");
      fetchData();
    } catch (error) {
      console.error("Error reviewing loan:", error);
    } finally {
      setIsReviewing(false);
    }
  };

  const openReviewDialog = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setReviewAction("APPROVED");
    setRemarks("");
  };

  if (isLoading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Review and manage loan applications
        </p>
      </div>

      {/* Officer Profile Stats */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Officer Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {profile.userId?.name || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Branch Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {profile.branch || "Not Assigned"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pending Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-green-600">
              {stats.approved}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-red-600">
              {stats.rejected}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Pending Loans */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Loan Applications</CardTitle>
          <CardDescription>
            Review and approve or reject loan applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingLoans.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending applications
              </h3>
              <p className="text-gray-600">
                All loan applications have been reviewed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingLoans.map((loan) => (
                <div
                  key={loan._id}
                  className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-lg">
                          {formatCurrency(loan.amountRequested)}
                        </h4>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          {loan.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Customer: {loan.customerId?.userId?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tenure: {loan.tenureMonths} months
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => openReviewDialog(loan)}
                    >
                      Review Application
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Income</p>
                      <p className="font-semibold flex items-center">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {formatCurrency(loan.customerId?.income || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Credit Score</p>
                      <p className="font-semibold flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {loan.customerId?.creditScore || "N/A"}
                      </p>
                    </div>
                    {loan.eligibilityScore && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Eligibility Score
                        </p>
                        <p className="font-semibold">
                          {(loan.eligibilityScore * 100).toFixed(2)}%
                        </p>
                      </div>
                    )}
                    {loan.interestRate && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Interest Rate
                        </p>
                        <p className="font-semibold">
                          {loan.interestRate}% p.a.
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Applied on {new Date(loan.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog
        open={!!selectedLoan}
        onOpenChange={(open) => !open && setSelectedLoan(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Loan Application</DialogTitle>
            <DialogDescription>
              Approve or reject this loan application
            </DialogDescription>
          </DialogHeader>

          {selectedLoan && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">
                    {formatCurrency(selectedLoan.amountRequested)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tenure:</span>
                  <span className="font-semibold">
                    {selectedLoan.tenureMonths} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Eligibility Score:
                  </span>
                  <span className="font-semibold">
                    {selectedLoan.eligibilityScore
                      ? `${(selectedLoan.eligibilityScore * 100).toFixed(2)}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Suggested Rate:</span>
                  <span className="font-semibold">
                    {selectedLoan.interestRate}% p.a.
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Action</Label>
                <div className="flex space-x-2">
                  <Button
                    
                    type="button"
                    variant={
                      reviewAction === "APPROVED" ? "secondary" : "outline"
                    }
                    className="flex-1"
                    onClick={() => setReviewAction("APPROVED")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                   
                    type="button"
                    variant={
                      reviewAction === "REJECTED" ? "outline" : "outline"
                    }
                    // variant="destructive"
                    className={`flex-1 `}
                    onClick={() => setReviewAction("REJECTED")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Input
                  id="remarks"
                  placeholder="Add comments or reasons..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLoan(null)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleReview} disabled={isReviewing}>
              {isReviewing ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficerDashboard;
