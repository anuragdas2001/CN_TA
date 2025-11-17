// src/routes/AppRoutes.tsx

import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CustomerDashboard from "../pages/CustomerDashboard";
import OfficerDashboard from "../pages/OfficerDashboard";
import NotFoundPage from "../pages/NotFoundPage";

import MainLayout from "../layouts/MainLayout";
import { UserRole } from "@/types";
import ProtectedRoute from "@/shared/ProtectedRoute";
import ApplyLoan from "@/pages/ApplyLoan";
import OfficerProfile from "@/pages/officerProfile";
import CustomerProfile from "@/pages/customerProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes WITHOUT navbar */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes WITH navbar using MainLayout */}
      <Route element={<MainLayout />}>
        {/* Customer Routes */}
        <Route
          path="/customer/dashboard/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/apply"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <ApplyLoan />
            </ProtectedRoute>
          }
        />

        {/* Officer Routes */}
        <Route
          path="/officer/dashboard/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.OFFICER]}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/profile/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.OFFICER]}>
              <OfficerProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
