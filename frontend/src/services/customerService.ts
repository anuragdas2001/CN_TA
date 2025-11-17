import api from "./api";
import type { Customer, User } from "../types";

export const customerService = {
  getProfile: async (): Promise<Customer> => {
    const response = await api.get("/customer/profile");
    return response.data;
  },
  // If id is provided, fetch profile by customer document id (/customer/profile/:id)
  // otherwise fetch the profile for the current authenticated user (/customer/profile)
  // getProfile: async (id?: string): Promise<Customer> => {
  //   const url = id ? `/customer/profile/${id}` : '/customer/profile';
  //   const response = await api.get(url);
  //   return response.data;
  // },

  updateProfile: async (data: {
    income?: number;
    creditScore?: number;
  }): Promise<Customer> => {
    const response = await api.put("/customer/profile", data);
    return response.data.customer;
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customer/${id}`);
    return response.data;
  },
  getUserDetails: async (id: string): Promise<{ user: User; customer: Customer }> => {
    const response = await api.get(`/customer/userprofile/${id}`);
    return response.data;
  },
};
