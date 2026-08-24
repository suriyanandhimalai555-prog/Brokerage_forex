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
import FundedUser from "./pages/FundedUser";
import ChallengeUser from "./pages/ChallengeUser";
import UserDoc from "./pages/UserDoc";
import Withdraw from "./pages/Withdraw";
import UserOrderReport from "./pages/UserOrderReport";
import OrderEditLog from "./pages/OrderEditLog";
import UserTransactionLog from "./pages/UserTransactionLog";
import UserLayout from "./layout/UserLayout";
import MyAccount from "./pages/MyAccount";
import OpenAccount from "./components/OpenAccount";
import Performance from "./pages/Performance";
import HistoryOrders from "./pages/HistoryOrders";
import Deposit from "./pages/Deposit";
import DepositDetails from "./pages/DepositDetails";
import UserWithdraw from "./pages/UserWithdraw";
import WithdrawDetails from "./pages/UserWithdrawDetails";
import Transfer from "./pages/Transfer";
import TransferDetails from "./pages/TransferDetails";
import TransactionHistory from "./pages/TransactionHistory";
import CryptoWallet from "./pages/CryptoWallet";
import AnalystView from "./pages/AnalystView";
import MarketNews from "./pages/MarketNews";
import EconomicCalendar from "./pages/EconomicCalendar";
import TradingConditions from "./pages/TradingConditions";
import Savings from "./pages/Savings";
import SwapFree from "./pages/SwapFree";
import NegativeBalance from "./pages/NegativeBalance";
import Vps from "./pages/Vps";
import CopyTrading from "./pages/CopyTrading";
import SupportHub from "./pages/SupportHub";
import UserProfile from "./pages/UserProfile";
import Security from "./pages/Security";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import TradingTerminal from "./pages/TradingTerminal";
import PaymentCheckout from "./pages/PaymentCheckout";
import Website from "./pages/Website";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Website />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route
        path="/privacy-policy"
        element={
          <PublicRoute>
            <PrivacyPolicy />
          </PublicRoute>
        }
      />

      <Route
        path="/terms-and-conditions"
        element={
          <PublicRoute>
            <TermsConditions />
          </PublicRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders/all" element={<AllOrder />} />
        <Route path="orders/open" element={<OrderOpen />} />
        <Route path="orders/closed" element={<OrderClosed />} />
        <Route path="orders/funded" element={<FundedAc />} />
        <Route path="orders/report" element={<OrderReport />} />
        <Route path="users/funded" element={<FundedUser />} />
        <Route path="users/challenge" element={<ChallengeUser />} />
        <Route path="users/docs" element={<UserDoc />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="reports/user-order" element={<UserOrderReport />} />
        <Route path="reports/edit-log" element={<OrderEditLog />} />
        <Route path="reports/transactions" element={<UserTransactionLog />} />
      </Route>

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MyAccount />} />
        <Route path="my-accounts" element={<MyAccount />} />
        <Route path="open-account" element={<OpenAccount />} />
        <Route path="performance" element={<Performance />} />
        <Route path="order-history" element={<HistoryOrders />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="deposit/:methodId" element={<DepositDetails />} />
        <Route path="withdraw" element={<UserWithdraw />} />
        <Route path="withdraw/:methodId" element={<WithdrawDetails />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="transfer/:type" element={<TransferDetails />} />
        <Route path="transaction-history" element={<TransactionHistory />} />
        <Route path="crypto-wallet" element={<CryptoWallet />} />
        <Route path="analyst-views" element={<AnalystView />} />
        <Route path="market-news" element={<MarketNews />} />
        <Route path="economic-calendar" element={<EconomicCalendar />} />
        <Route path="trading-conditions" element={<TradingConditions />} />
        <Route path="savings" element={<Savings />} />
        <Route path="savings/swap" element={<SwapFree />} />
        <Route path="savings/negative" element={<NegativeBalance />} />
        <Route path="vps" element={<Vps />} />
        <Route path="copy-trading" element={<CopyTrading />} />
        <Route path="support-hub" element={<SupportHub />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="security" element={<Security />} />

        <Route path="avg-terminal" element={<TradingTerminal />} />
      </Route>
      <Route
        path="/terminal"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <TradingTerminal />
          </ProtectedRoute>
        }
      />
      <Route path="/user/payment" element={<PaymentCheckout />} />
    </Routes>
  );
};

export default App;