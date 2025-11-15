// src/routes/AppRoutes.tsx

import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CustomerDashboard from "../pages/CustomerDashboard";
import OfficerDashboard from "../pages/OfficerDashboard";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
