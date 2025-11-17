import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";
import { customerService } from "@/services/customerService";
import { officerService } from "@/services/officerService";
import type { AuthContextType, RegisterData, User } from "@/types";
import { UserRole } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage on mount
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

 const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);

    const response = await authService.login(email, password);

    // 1️⃣ Save token IMMEDIATELY (so future requests have it)
    setToken(response.token);
    authService.setAuthData(response.token, null);

    // Force axios to use the token instantly
    // api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

    // 2️⃣ Now safely fetch the profile (token is available)
    let profile: any;
    if (response.role === UserRole.CUSTOMER) {
      profile = await customerService.getProfile();
    } else {
      profile = await officerService.getProfile();
    }

    // 3️⃣ Build userData
    const userData: User = {
      _id: response.userId,
      email: profile.userId?.email || email,
      name: profile.userId?.name || "",
      role: response.role,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: profile.updatedAt || new Date().toISOString(),
    };

    // Save user
    setUser(userData);
    authService.setAuthData(response.token, userData);

    toast.success("Login successful!");

    // Navigate
    if (response.role === UserRole.CUSTOMER) {
      navigate(`/customer/dashboard/${response.userId}`);
    } else {
      navigate(`/officer/dashboard/${response.userId}`);
    }

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      await authService.register(data);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};