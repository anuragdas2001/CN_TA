import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";
import { Building2 } from "lucide-react";

const Register = () => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: UserRole.CUSTOMER,
    income: "",
    creditScore: "",
    branch: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === UserRole.CUSTOMER) {
        data.income = formData.income ? parseFloat(formData.income) : 0;
        data.creditScore = formData.creditScore
          ? parseFloat(formData.creditScore)
          : 300;
      } else {
        data.branch = formData.branch;
      }

      await register(data);
    } catch (error) {
      // Error handled by auth service
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-xl w-full  mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value as UserRole }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
                  <SelectItem value={UserRole.OFFICER}>Loan Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === UserRole.CUSTOMER && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="income">Annual Income (₹)</Label>
                  <Input
                    id="income"
                    name="income"
                    type="number"
                    placeholder="500000"
                    value={formData.income}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditScore">Credit Score (300-850)</Label>
                  <Input
                    id="creditScore"
                    name="creditScore"
                    type="number"
                    min="300"
                    max="850"
                    placeholder="700"
                    value={formData.creditScore}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {formData.role === UserRole.OFFICER && (
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  name="branch"
                  placeholder="Mumbai Central"
                  value={formData.branch}
                  onChange={handleChange}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex mt-4 flex-col space-y-4">
            <Button variant="outline" type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
