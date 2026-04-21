import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/AdminDashboard";
import AllOrder from "./pages/AllOrder";
import OrderOpen from "./pages/OrderOpen";
import OrderClosed from "./pages/OrderClosed";

import DashboardLayout from "./layout/DashboardLayout";
import FundedAc from "./pages/FundedAc";
import OrderReport from "./pages/OrderReport";

const App = () => {
  return (
    <Routes>
      {/* Redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 🔥 ADMIN LAYOUT WRAPPER */}
      <Route path="/admin" element={<DashboardLayout />}>
        {/* default */}
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* your new page */}
        <Route path="orders/all" element={<AllOrder />} />
        <Route path="orders/open" element={<OrderOpen />} />
        <Route path="orders/closed" element={<OrderClosed />} />
        <Route path="orders/funded" element={<FundedAc />} />
        <Route path="orders/report" element={<OrderReport />} />

        {/* add more pages like this */}
        {/* <Route path="users" element={<Users />} /> */}
      </Route>
    </Routes>
  );
};

export default App;