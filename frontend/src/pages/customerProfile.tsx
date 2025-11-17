import { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import type { Customer, User } from "@/types";
import { User as UserIcon, IndianRupee, TrendingUp, Save, Edit2, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useParams } from "react-router-dom";

const CustomerProfile = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState<Customer | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    income: "",
    creditScore: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getUserDetails(id!);

      setUser(data.user);
      setProfile(data.customer);

      setFormData({
        income: data.customer.income?.toString() || "",
        creditScore: data.customer.creditScore?.toString() || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        income: profile.income?.toString() || "",
        creditScore: profile.creditScore?.toString() || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const updatedProfile = await customerService.updateProfile({
        income: parseFloat(formData.income) || 0,
        creditScore: parseFloat(formData.creditScore) || 300,
      });

      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getCreditScoreColor = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getCreditScoreLabel = (score?: number) => {
    if (!score) return "Not Set";
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  if (isLoading) {
    return <Loader text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          View and manage your profile information
        </p>
      </div>

      {/* Profile Information */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic account details</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600">Name</Label>
                <p className="text-lg font-semibold">
                  {user?.name || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="text-lg font-semibold">
                  {user?.email || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Role</Label>
                <p className="text-lg font-semibold">
                  {user?.role || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Member Since</Label>
                <p className="text-lg font-semibold">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>
                  Update your income and credit score details
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-6">
                {/* Income Display */}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <IndianRupee className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-gray-600 text-sm">
                      Annual Income
                    </Label>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(profile.income || 0)}
                    </p>
                  </div>
                </div>

                {/* Credit Score Display */}
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-gray-600 text-sm">
                      Credit Score
                    </Label>
                    <div className="flex items-baseline space-x-2">
                      <p
                        className={`text-2xl font-bold ${getCreditScoreColor(
                          profile.creditScore
                        )}`}
                      >
                        {profile.creditScore || "N/A"}
                      </p>
                      <span
                        className={`text-sm font-medium ${getCreditScoreColor(
                          profile.creditScore
                        )}`}
                      >
                        ({getCreditScoreLabel(profile.creditScore)})
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Range: 300 - 850
                    </p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    How this affects your loans
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Higher credit scores result in lower interest rates
                    </li>
                    <li>• Higher income increases loan eligibility</li>
                    <li>
                      • Keep your information updated for accurate loan
                      evaluations
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Income Input */}
                <div className="space-y-2">
                  <Label htmlFor="income">Annual Income (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="income"
                      name="income"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="600000"
                      value={formData.income}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Your total annual income before taxes
                  </p>
                </div>

                {/* Credit Score Input */}
                <div className="space-y-2">
                  <Label htmlFor="creditScore">Credit Score</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="creditScore"
                      name="creditScore"
                      type="number"
                      min="300"
                      max="850"
                      placeholder="720"
                      value={formData.creditScore}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be between 300 and 850
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3">
                  <Button type="submit" disabled={isSaving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your account activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-gray-600 text-sm">Account ID</Label>
                <p className="text-sm font-mono mt-1">{profile._id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-gray-600 text-sm">Last Updated</Label>
                <p className="text-sm font-semibold mt-1">
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerProfile;
