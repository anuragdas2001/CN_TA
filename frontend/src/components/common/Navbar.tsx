import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import {
  LogOut,
  User,
  LayoutDashboard,
  FileText,
  Building2,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log("Navbar user:", user);
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LoanHub</span>
            </Link>
          </div>

          {/* Navigation Links - Only show if user is logged in */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              {user.role === UserRole.CUSTOMER && (
                <>
                  <Link to={`/customer/dashboard/${user?._id}`}>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Link to="/customer/apply">
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Apply for Loan</span>
                    </Button>
                  </Link>
                  <Link to={`/customer/profile/${user?._id}`}>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                </>
              )}

              {user.role === UserRole.OFFICER && (
                <>
                  <Link to={`/officer/dashboard/${user?._id}`}>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  {/* <Link to="/officer/profile">
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </Link> */}
                </>
              )}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Profile Link */}
                  {/* <DropdownMenuItem asChild>
                    <Link
                      to={
                        user.role === UserRole.CUSTOMER
                          ? "/customer/profile"
                          : "/officer/profile"
                      }
                      className="cursor-pointer"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </DropdownMenuItem> */}

                  <DropdownMenuItem className="text-sm text-gray-600" disabled>
                    Role:{" "}
                    <span className="font-semibold ml-1">{user.role}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Show only if logged in */}
      {user && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-2">
          {user.role === UserRole.CUSTOMER && (
            <>
              <Link to="/customer/dashboard" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/customer/apply" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Apply for Loan
                </Button>
              </Link>
              <Link to="/customer/profile" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </>
          )}

          {user.role === UserRole.OFFICER && (
            <>
              <Link to="/officer/dashboard" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/officer/profile" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
