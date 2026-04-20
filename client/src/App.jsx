import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";

import DashboardLayout from "./layout/DashboardLayout";

const App = () => {
  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected / Dashboard layout */}
      <Route
        path="/admin/dashboard"
        element={
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default App;