import api from "./api";
import type { RegisterData, LoginResponse } from "../types";

export const authService = {
  register: async (
    data: RegisterData
  ): Promise<{ userId: string; message: string }> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    try {
      // Also remove default Authorization header from axios instance
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete api.defaults.headers.common.Authorization;
    } catch (e) {
      // ignore
    }
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem("token");
  },

  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  setAuthData: (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    try {
      // Ensure axios instance sends the Authorization header for subsequent requests
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } catch (e) {
      // ignore
    }
  },
};
